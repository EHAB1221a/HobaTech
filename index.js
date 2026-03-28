import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

const DEFAULT_MODEL = process.env.OPENAI_TRANSLATE_MODEL || "gpt-4.1-mini";
const openAiApiKey = defineSecret("OPENAI_API_KEY");

initializeApp();

function withCors(response) {
  response.set("Access-Control-Allow-Origin", "*");
  response.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}

function extractOutputText(payload) {
  if (typeof payload?.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const outputs = Array.isArray(payload?.output) ? payload.output : [];
  for (const item of outputs) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === "string" && part.text.trim()) {
        return part.text.trim();
      }
    }
  }

  return "";
}

export const translateText = onRequest({ cors: true, secrets: [openAiApiKey] }, async (request, response) => {
  withCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const apiKey = openAiApiKey.value();
  if (!apiKey) {
    response.status(500).json({ error: "OPENAI_API_KEY is not configured" });
    return;
  }

  const text = String(request.body?.text || "").trim();
  const mode = String(request.body?.mode || "ar2fr").trim();
  const model = String(request.body?.model || DEFAULT_MODEL).trim() || DEFAULT_MODEL;

  if (!text) {
    response.status(400).json({ error: "text is required" });
    return;
  }

  const instruction = mode === "fr2ar"
    ? "Translate the user text from French to Arabic. Return only the translation with no explanations."
    : "Translate the user text from Arabic to French. Return only the translation with no explanations.";

  try {
    const openaiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        input: [
          { role: "system", content: instruction },
          { role: "user", content: text }
        ]
      })
    });

    const payload = await openaiResponse.json();
    if (!openaiResponse.ok) {
      response.status(openaiResponse.status).json({
        error: payload?.error?.message || "OpenAI request failed",
        details: payload
      });
      return;
    }

    const translation = extractOutputText(payload);
    response.json({
      ok: true,
      translation: translation || text,
      model
    });
  } catch (error) {
    response.status(500).json({
      error: error?.message || "Unexpected translation error"
    });
  }
});

export const sendNotification = onRequest({ cors: true }, async (request, response) => {
  withCors(response);

  if (request.method === "OPTIONS") {
    response.status(204).send("");
    return;
  }

  if (request.method !== "POST") {
    response.status(405).json({ error: "Method not allowed" });
    return;
  }

  const token = String(request.body?.token || "").trim();
  const title = String(request.body?.title || "").trim();
  const body = String(request.body?.body || "").trim();

  if (!token || !title || !body) {
    response.status(400).json({
      error: "token, title and body are required"
    });
    return;
  }

  try {
    const result = await getMessaging().send({
      token,
      notification: { title, body }
    });

    response.json({
      ok: true,
      messageId: result
    });
  } catch (error) {
    response.status(500).json({
      error: error?.message || "Failed to send notification"
    });
  }
});

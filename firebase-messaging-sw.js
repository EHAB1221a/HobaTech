importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyAjpqfDdoxYs8rRBw4UKOrvtMoqBDB0Z_s",
  authDomain: "hoba-tech.firebaseapp.com",
  projectId: "hoba-tech",
  messagingSenderId: "465948708700",
  appId: "1:465948708700:web:dac008d1cb9f8caa50fb99"
});

const messaging = firebase.messaging();

// هذه الخطوة هي التي تجعل الإشعار يظهر والموقع مغلق
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png' // يمكنك وضع رابط أيقونة هنا
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

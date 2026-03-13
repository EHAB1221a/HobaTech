import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.x.x/firebase-auth.js";

// تأكد إنك عامل Initialize لـ Firebase هنا أو استدعي ملف الـ Config بتاعك
const auth = getAuth();

// إخفاء محتوى الصفحة فوراً قبل أي تحميل
document.documentElement.style.display = 'none';

onAuthStateChanged(auth, (user) => {
  if (user) {
    // لو مسجل، أظهر الصفحة
    document.documentElement.style.display = 'block';
    console.log("تم التحقق: دخول ملكي مصرح به.");
  } else {
    // لو مش مسجل، ابعته لصفحة التسجيل (تأكد من مسار الصفحة)
    window.location.href = "login.html"; 
  }
});
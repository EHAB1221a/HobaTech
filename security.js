// استدعاء البيانات من الفايربيس
// ملحوظة: تأكد أنك قمت بتعريف 'db' أو 'database' في ملف الإعدادات الرئيسي
const userPath = 'codes/38575565602'; // المسار اللي اتفقنا عليه

database.ref(userPath).once('value').then((snapshot) => {
    const data = snapshot.val();
    
    if (data && data.expiryDate) {
        const today = new Date();
        const expire = new Date(data.expiryDate);

        // إذا كان تاريخ اليوم أكبر من تاريخ الانتهاء
        if (today > expire) {
            // مسح الصفحة وعرض رسالة القفل الفخمة
            document.body.innerHTML = `
                <div style="background:#000; color:#d4af37; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; font-family:Arial; border:15px solid #1a1a1a; direction: rtl;">
                    <h1 style="font-size:3.5rem; margin-bottom:10px;">🔒 HobaTech</h1>
                    <h2 style="color:#fff;">انتهت فترة الصلاحية</h2>
                    <p style="font-size:1.2rem;">الكود المستخدم: ${data.pass || 'غير معروف'}</p>
                    <p style="font-size:1.1rem; color:#888;">برجاء مراجعة المطور: <b style="color:#d4af37;">إيهاب الدرديري</b></p>
                </div>
            `;
            // إيقاف أي عمليات أخرى في الصفحة
            window.stop();
        } else {
            console.log("الاشتراك ساري.. استمتع بالمنصة يا بطل! ✅");
        }
    } else {
        console.warn("لم يتم العثور على تاريخ صلاحية لهذا الكود.");
    }
}).catch((error) => {
    console.error("خطأ في الاتصال بقاعدة البيانات:", error);
});
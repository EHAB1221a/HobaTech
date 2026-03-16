// استنى لما الصفحة تحمل بالكامل
window.onload = function() {
    console.log("نظام الحماية بدأ الفحص... 🛡️");

    // محاولة التعرف على قاعدة البيانات بأكثر من اسم (database أو db أو firebase.database)
    var myDb;
    try {
        if (typeof database !== 'undefined') {
            myDb = database;
        } else if (typeof db !== 'undefined') {
            myDb = db;
        } else {
            myDb = firebase.database();
        }
    } catch (e) {
        console.error("الفايربيس مش متعرف صح في الصفحة دي!");
        return;
    }

    const userPath = 'codes/38575565602';

    myDb.ref(userPath).once('value').then((snapshot) => {
        const data = snapshot.val();
        
        if (data && data.expiryDate) {
            // تحويل التاريخ من نص إلى كائن تاريخ (تأكد من الصيغة YYYY-MM-DD)
            const expire = new Date(data.expiryDate);
            const today = new Date();

            console.log("تاريخ اليوم: " + today);
            console.log("تاريخ الانتهاء: " + expire);

            if (today > expire) {
                console.log("❌ انتهت الصلاحية!");
                document.body.innerHTML = `
                    <div style="background:#000; color:#d4af37; height:100vh; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; font-family:Arial; direction: rtl;">
                        <h1 style="font-size:3.5rem;">🔒 HobaTech</h1>
                        <h2 style="color:#fff;">انتهت فترة الصلاحية</h2>
                        <p>برجاء مراجعة المطور: <b>إيهاب الدرديري</b></p>
                    </div>
                `;
                window.stop();
            } else {
                console.log("✅ الكود شغال، استمتع!");
            }
        }
    }).catch((err) => {
        console.error("مشكلة في سحب البيانات: ", err);
    });
};

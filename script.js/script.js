// ==========================================

// الخطوة 2: الكبسلة وحماية البيانات (Class)

// ==========================================

class Student {

    #name;

    #grades;

    #attendance;

    constructor(name, grade1, grade2, grade3, attendance) {

        this.name = name;

        this.grades = [grade1, grade2, grade3];

        this.attendance = attendance;

    }

    // التحقق من الاسم

    set name(value) {

        if (!value || value.trim() === "") {

            throw new Error("يرجى إدخال اسم الطالب بشكل صحيح.");

        }

        this.#name = value.trim();

    }

    get name() {

        return this.#name;

    }

    // حارس الأمان للدرجات الثلاث

    set grades(gradesArray) {

        const validatedGrades = gradesArray.map((grade, index) => {

            if (grade === "" || grade === null || isNaN(grade)) {

                throw new Error(`يرجى إدخال درجة المادة رقم (${index + 1}) وعدم ترك الحقل فارغاً.`);

            }

            const numGrade = Number(grade);

            if (numGrade < 0 || numGrade > 100) {

                throw new Error(`درجة المادة (${index + 1}) يجب أن تكون بين 0 و 100.`);

            }

            return numGrade;

        });

        this.#grades = validatedGrades;

    }

    get grades() {

        return this.#grades;

    }

    // حارس الأمان لنسبة الحضور

    set attendance(value) {

        if (value === "" || value === null || isNaN(value)) {

            throw new Error("يرجى إدخال نسبة الحضور وعدم ترك الحقل فارغاً.");

        }

        const numAttendance = Number(value);

        if (numAttendance < 0 || numAttendance > 100) {

            throw new Error("نسبة الحضور يجب أن تكون بين 0% و 100%.");

        }

        this.#attendance = numAttendance;

    }

    get attendance() {

        return this.#attendance;

    }

    // حساب متوسط درجات الطالب

    getAverage() {

        const sum = this.#grades.reduce((acc, curr) => acc + curr, 0);

        return sum / this.#grades.length;

    }

}

// ==========================================

// الخطوة 3: التفاعل مع الشاشة واصطياد الأخطاء

// ==========================================

const studentsList = [];

// الإمساك بعناصر الشاشة عبر getElementById

const nameInput = document.getElementById("studentName");

const grade1Input = document.getElementById("grade1");

const grade2Input = document.getElementById("grade2");

const grade3Input = document.getElementById("grade3");

const attendanceInput = document.getElementById("attendance");

const addStudentBtn = document.getElementById("addStudentBtn");

const mercyBtn = document.getElementById("mercyBtn");

const errorBox = document.getElementById("errorBox");

const studentsListBox = document.getElementById("studentsListBox");

const mercyReportBox = document.getElementById("mercyReportBox");

// زر إضافة طالب

addStudentBtn.onclick = function () {

    // إخفاء وتفريغ صندوق الخطأ عند كل محاولة جديدة

    errorBox.textContent = "";

    errorBox.classList.add("d-none");

    try {

        // أخذ القيم وتخليق كائن جديد من الكلاس

        const newStudent = new Student(

            nameInput.value,

            grade1Input.value,

            grade2Input.value,

            grade3Input.value,

            attendanceInput.value

        );

        // دفع الكائن إلى المصفوفة

        studentsList.push(newStudent);

        // إزالة رسالة "لا يوجد طلاب" عند إضافة أول طالب

        const emptyMsg = document.getElementById("emptyMsg");

        if (emptyMsg) {

            emptyMsg.remove();

        }

        // عرض بيانات الطالب في صندوق القائمة على الشاشة

        const avg = newStudent.getAverage().toFixed(2);

        studentsListBox.innerHTML += `
<div class="list-group-item student-item mb-2 rounded shadow-sm d-flex justify-content-between align-items-center">
<div>
<h6 class="mb-1 fw-bold">${newStudent.name}</h6>
<small class="text-muted">الدرجات: [${newStudent.grades.join(" - ")}] | الحضور: ${newStudent.attendance}%</small>
</div>
<span class="badge bg-primary rounded-pill fs-6">المتوسط: ${avg}</span>
</div>

        `;

        // تفريغ حقول الإدخال

        nameInput.value = "";

        grade1Input.value = "";

        grade2Input.value = "";

        grade3Input.value = "";

        attendanceInput.value = "";

        nameInput.focus();

    } catch (error) {

        // التقاط الخطأ وعرضه في صندوق رسائل الخطأ باللون الأحمر

        errorBox.textContent = error.message;

        errorBox.classList.remove("d-none");

    }

};

// ==========================================

// الخطوة 4: لجنة الرأفة (Filter, Map, Reduce)

// ==========================================

mercyBtn.onclick = function () {

    // 1. Filter: استخراج الطلاب الذين يقع متوسطهم بين 40 و 49

    const strugglingStudents = studentsList.filter(student => {

        const avg = student.getAverage();

        return avg >= 40 && avg <= 49;

    });

    // التحقق من وجود طلاب متعثرين لمنع القسمة على صفر

    if (strugglingStudents.length === 0) {

        mercyReportBox.innerHTML = `
<div class="alert alert-info mb-0 text-center fw-semibold">

                لا يوجد طلاب متعثرون (متوسط درجاتهم بين 40 و 49) يستحقون درجات الرأفة حالياً.
</div>

        `;

        return;

    }

    // 2. Map: إضافة 5 درجات رأفة لمتوسط كل طالب مستخرج

    const boostedStudents = strugglingStudents.map(student => {

        return {

            name: student.name,

            oldAvg: student.getAverage(),

            newAvg: student.getAverage() + 5

        };

    });

    // 3. Reduce: حساب مجموع المتوسطات الجديدة ثم القسمة على عددهم

    const totalNewAvg = boostedStudents.reduce((sum, item) => sum + item.newAvg, 0);

    const generalAvgAfterMercy = (totalNewAvg / boostedStudents.length).toFixed(2);

    // استخراج أسماء الطلاب المستفيدين

    const namesList = boostedStudents.map(s => `${s.name} (${s.newAvg.toFixed(1)})`).join(" ، ");

    // 4. الطباعة على الشاشة باستخدام قوالب النصوص ${}

    mercyReportBox.innerHTML = `
<div class="alert alert-success border-success">
<h5 class="fw-bold mb-3">ملخص قرارات لجنة الرأفة:</h5>
<ul class="list-unstyled mb-0">
<li class="mb-2"><strong>عدد الطلاب المتعثرين المستفيدين:</strong> ${boostedStudents.length} طالب/ة</li>
<li class="mb-2"><strong>أسماء الطلاب (بعد إضافة 5 درجات):</strong> ${namesList}</li>
<li><strong>المتوسط العام لدرجاتهم بعد التعديل:</strong> <span class="badge bg-success fs-6">${generalAvgAfterMercy}</span></li>
</ul>
</div>

    `;

};
 
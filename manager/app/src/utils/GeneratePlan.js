/**
 * generatePlan
 * ------------------------
 * تولید برنامه پیشنهادی برای دروس و اساتید انتخاب شده با رعایت محدودیت‌ها
 * الگوریتم: Backtracking با اولویت MRV (Minimum Remaining Values)
 */

function generatePlan({ assignments, courses, professors }) {
  // --------------------------
  // 1. تعریف بازه‌های زمانی استاندارد
  // --------------------------
  const DEFAULT_TWO_HOUR_SLOTS = [
    { start: 8, end: 10 },
    { start: 10, end: 12 },
    { start: 13, end: 15 },
    { start: 15, end: 17 },
  ];

  const DEFAULT_ONE_HOUR_SLOTS = [
    { start: 8, end: 9 },
    { start: 9, end: 10 },
    { start: 10, end: 11 },
    { start: 11, end: 12 },
    { start: 13, end: 14 },
    { start: 14, end: 15 },
    { start: 15, end: 16 },
    { start: 16, end: 17 },
  ];

  const DAYS = ["saturday", "sunday", "monday", "tuesday", "wednesday"];

  // --------------------------
  // 2. ساخت لیست جلسات (Tasks)
  // هر جلسه: courseId + professorId + semester + مدت زمان جلسه
  // --------------------------
  let tasks = [];
  let taskIdCounter = 1;

  for (const { courseId, professors: profIds } of assignments) {
    const course = courses.find((c) => c.id === courseId);
    if (!course) continue;

    const totalMinutes = course.credit * 60;
    let sessions = [];

    if (totalMinutes % 120 === 0) {
      // کل جلسات ۲ ساعته
      const count = totalMinutes / 120;
      sessions = Array(count).fill({ type: "2h" });
    } else {
      // ترکیب 2 ساعته + 1 ساعته
      const twos = Math.floor(totalMinutes / 120);
      const ones = (totalMinutes % 120) / 60;
      sessions = [
        ...Array(twos).fill({ type: "2h" }),
        ...Array(ones).fill({ type: "1h" }),
      ];
    }

    // هر استاد جلسات خودش را برای این درس دارد
    for (const profId of profIds) {
      for (const ses of sessions) {
        tasks.push({
          id: taskIdCounter++,
          courseId: course.id,
          professorId: profId,
          semester: course.semester,
          duration: ses.type,
        });
      }
    }
  }

  // --------------------------
  // 3. ساخت دامین (دامنه‌ی زمان‌های ممکن) برای هر جلسه
  // --------------------------
  const domains = {};
  for (const task of tasks) {
    const prof = professors.find((p) => p.id === task.professorId);
    domains[task.id] = [];

    for (const day of DAYS) {
      const working = prof.workingHours?.[day] || [];

      for (const wh of working) {
        const slots =
          task.duration === "2h"
            ? DEFAULT_TWO_HOUR_SLOTS
            : DEFAULT_ONE_HOUR_SLOTS;

        for (const slot of slots) {
          // اسلات فقط وقتی معتبره که داخل بازه کاری استاد باشه
          if (slot.start >= wh.start && slot.end <= wh.end) {
            domains[task.id].push({ day, start: slot.start, end: slot.end });
          }
        }
      }
    }
  }

  // --------------------------
  // 4. مرتب‌سازی جلسات بر اساس کمترین دامین (MRV)
  // --------------------------
  tasks.sort((a, b) => domains[a.id].length - domains[b.id].length);

  // --------------------------
  // 5. متغیرهای کنترل تداخل
  // --------------------------
  let solution = [];
  let usedByProfessor = {}; // { "profId_day": [ {start,end}, ... ] }
  let usedBySemester = {}; // { "semester_day": [ {start,end}, ... ] }

  // --------------------------
  // 6. تابع کمکی تشخیص تداخل بازه‌ها
  // --------------------------
  function hasConflict(existingSlots, newSlot) {
    return existingSlots.some(
      (s) => !(newSlot.end <= s.start || newSlot.start >= s.end)
    );
    // true یعنی حداقل یکی از بازه‌ها هم‌پوشانی دارد
  }

  // --------------------------
  // 7. تابع بازگشتی Backtracking
  // --------------------------
  function backtrack(index) {
    // شرط پایان: تمام جلسات زمان‌بندی شده‌اند
    if (index === tasks.length) return true;

    const task = tasks[index];

    for (const slot of domains[task.id]) {
      const profKey = `${task.professorId}_${slot.day}`;
      const semKey = `${task.semester}_${slot.day}`;

      if (!usedByProfessor[profKey]) usedByProfessor[profKey] = [];
      if (!usedBySemester[semKey]) usedBySemester[semKey] = [];

      // چک تداخل استاد
      if (hasConflict(usedByProfessor[profKey], slot)) continue;

      // چک تداخل ترم
      if (hasConflict(usedBySemester[semKey], slot)) continue;

      // انتخاب این اسلات
      solution.push({
        courseId: task.courseId,
        professorId: task.professorId,
        day: slot.day,
        start: slot.start,
        end: slot.end,
      });
      usedByProfessor[profKey].push(slot);
      usedBySemester[semKey].push(slot);

      // ادامه به جلسه بعدی
      if (backtrack(index + 1)) return true;

      // اگر جلو نرفتیم → بازگشت (حذف انتخاب)
      solution.pop();
      usedByProfessor[profKey] = usedByProfessor[profKey].filter(
        (s) => s !== slot
      );
      usedBySemester[semKey] = usedBySemester[semKey].filter((s) => s !== slot);
    }

    // هیچ انتخابی جواب نداد → بازگشت
    return false;
  }

  // --------------------------
  // 8. اجرای Backtracking
  // --------------------------
  const ok = backtrack(0);

  if (!ok) {
    throw new Error(
      "امکان تولید برنامه پیشنهادی با محدودیت‌های فعلی وجود ندارد"
    );
  }

  return solution;
}

module.exports = { generatePlan };

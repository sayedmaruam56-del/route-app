
const sessions = [
  {id:1,title:"Intro & Pre-requisites",category:"foundation",tag:"Foundation",tasks:["مراجعة npm و ES Modules","فهم الفرق بين Framework و Library","معرفة فكرة React وليه بنستخدمه","فهم إنشاء المشروع وتشغيله بـ Vite","التعرف على App.jsx و main.jsx"]},
  {id:2,title:"Folder Structure & Components",category:"foundation",tag:"Foundation",tasks:["فهم Component-Based Architecture","فهم Folder Structure و Entry Point","تقسيم الواجهة إلى Components","فهم JSX وكتابة الواجهة","Destructuring و Shallow Copy و Map"]},
  {id:3,title:"Binding, Props & CRUD",category:"foundation",tag:"Core React",tasks:["فهم useState","تمرير البيانات باستخدام Props","التعامل مع Arrays و Objects في State","Binding و Render Array","تطبيق CRUD: إضافة وعرض وتعديل وحذف"]},
  {id:4,title:"Virtual DOM & Routing",category:"navigation",tag:"Navigation",tasks:["فهم فكرة Virtual DOM","إعداد Routes والتنقل بين الصفحات","إنشاء Navbar و Active Route","إضافة صفحة Not Found","فهم Nested Routing"]},
  {id:5,title:"Component Lifecycle & Axios",category:"api",tag:"API",tasks:["فهم Lifecycle حسب محتوى الكورس","استخدام Axios لطلب البيانات","عرض Loading و Error states","التعامل مع البيانات الفارغة","فهم AbortController عند الحاجة"]},
  {id:6,title:"Social App Start",category:"project",tag:"Project",tasks:["فهم هيكل مشروع Social App","تقسيم الواجهة إلى Components","تنظيم الملفات والمجلدات","تشغيل المشروع وحل الأخطاء","ربط المكونات ببعضها"]},
  {id:7,title:"RHF Validation & Zod",category:"forms",tag:"Forms",tasks:["فهم React Hook Form","استخدام register و handleSubmit","فهم defaultValues وحالة الفورم","فهم Zod Schema","التحقق من الإيميل وكلمة المرور","فهم Types و Interfaces الأساسية"]},
  {id:8,title:"Auth Flow & Context",category:"auth",tag:"Authentication",tasks:["تنفيذ Login باستخدام API","فهم Context و useContext","فهم Token وآلية حفظه","تنفيذ Protected Routes","التعامل مع تحديث الصفحة","تنفيذ Logout"]},
  {id:9,title:"Posts & React Query",category:"advanced",tag:"Advanced",tasks:["فهم TanStack React Query","جلب Posts وعرضها","التعامل مع Comments وبيانات المنشور","إظهار Loading و Error states","فهم تحديث البيانات بعد التغيير","مراجعة المشروع واختبار وظائفه"]}
];

const grid = document.getElementById("sessionGrid");

const allTasks = () =>
  sessions.reduce((sum, session) => sum + session.tasks.length, 0);

function renderSessions(filter = "all") {
  grid.innerHTML = "";

  sessions
    .filter(session => filter === "all" || session.category === filter)
    .forEach(session => {
      const card = document.createElement("article");

      card.className = "session-card";
      card.id = `session-${session.id}`;

      card.innerHTML = `
        <div class="session-top">
          <span class="session-number">${String(session.id).padStart(2, "0")}</span>
          <span class="session-title">${session.title}</span>
          <span class="category-tag">${session.tag}</span>
        </div>

        <ul class="task-list">
          ${session.tasks.map((task, index) => `
            <li>
              <label>
                <input
                  type="checkbox"
                  data-session="${session.id}"
                  data-task="${index}"
                >
                <span>${task}</span>
              </label>
            </li>
          `).join("")}
        </ul>

        <div class="card-footer">
          <span class="task-progress" id="count-${session.id}">
            0 / ${session.tasks.length}
          </span>

          <div class="mini-track">
            <div class="mini-fill" id="fill-${session.id}"></div>
          </div>

          <button
            class="reset-btn"
            title="Reset session"
            aria-label="Reset session"
          >↻</button>

          <button class="start-btn" data-start="${session.id}">
            Start
          </button>
        </div>
      `;

      grid.appendChild(card);
    });

  loadChecks();
}

function checkKey(sessionId, taskIndex) {
  return `react-roadmap-session-${sessionId}-task-${taskIndex}`;
}

function loadChecks() {
  document
    .querySelectorAll('.task-list input[type="checkbox"]')
    .forEach(input => {
      input.checked =
        localStorage.getItem(
          checkKey(input.dataset.session, input.dataset.task)
        ) === "true";
    });

  updateProgress();
}

function updateProgress() {
  let done = 0;

  sessions.forEach(session => {
    const checks = [
      ...document.querySelectorAll(
        `input[data-session="${session.id}"]`
      )
    ];

    const count = checks.filter(check => check.checked).length;

    done += count;

    const countElement = document.getElementById(`count-${session.id}`);
    const fillElement = document.getElementById(`fill-${session.id}`);

    if (countElement) {
      countElement.textContent = `${count} / ${session.tasks.length}`;
    }

    if (fillElement) {
      fillElement.style.width =
        `${count / session.tasks.length * 100}%`;
    }

    const card = document.getElementById(`session-${session.id}`);

    if (card) {
      card.classList.toggle(
        "completed",
        count === session.tasks.length
      );
    }
  });

  const total = allTasks();
  const percent = Math.round(done / total * 100);

  document.getElementById("overallPercent").textContent = `${percent}%`;
  document.getElementById("heroProgress").textContent = `${percent}%`;
  document.getElementById("overallFill").style.width = `${percent}%`;
  document.getElementById("taskCount").textContent =
    `${done} من ${total} مهمة مكتملة`;
}

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");

  if (!button) return;

  document.querySelectorAll(".filter").forEach(filterButton => {
    filterButton.classList.toggle("active", filterButton === button);
  });

  renderSessions(button.dataset.filter);
});

grid.addEventListener("change", event => {
  if (!event.target.matches('input[type="checkbox"]')) return;

  localStorage.setItem(
    checkKey(event.target.dataset.session, event.target.dataset.task),
    event.target.checked
  );

  updateProgress();
});

grid.addEventListener("click", event => {
  const resetButton = event.target.closest(".reset-btn");

  if (resetButton) {
    const card = resetButton.closest(".session-card");

    card.querySelectorAll('input[type="checkbox"]').forEach(input => {
      input.checked = false;

      localStorage.removeItem(
        checkKey(input.dataset.session, input.dataset.task)
      );
    });

    updateProgress();
  }

  const startButton = event.target.closest("[data-start]");

  if (startButton) {
    const target = document.getElementById(
      `session-${startButton.dataset.start}`
    );

    target.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    target.classList.add("focus-card");

    setTimeout(() => {
      target.classList.remove("focus-card");
    }, 1200);
  }
});

const notesInput = document.getElementById("notesInput");

notesInput.value = localStorage.getItem("react-roadmap-notes") || "";

document.getElementById("saveNotes").addEventListener("click", () => {
  localStorage.setItem("react-roadmap-notes", notesInput.value);

  const status = document.getElementById("notesStatus");

  status.textContent = "Notes saved 💜";

  setTimeout(() => {
    status.textContent = "";
  }, 2200);
});

document.querySelectorAll(".nav-link").forEach(link => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach(item => {
      item.classList.toggle("active", item === link);
    });
  });
});

renderSessions();

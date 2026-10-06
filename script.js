const state = {
  date: "",
  time: "",
  plan: ""
};

const cards = document.querySelectorAll(".card");

function showStep(id) {
  cards.forEach(card => card.classList.remove("active"));

  const target = document.getElementById(id);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


/* =========================================================
   YES + NO BUTTON
========================================================= */

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const ctaArea = document.getElementById("ctaArea");

const noTexts = [
  "no",
  "are you sure?",
  "reallyy!!?",
  "try again mahh",
  "still no?!?",
  "naurr 😭",
  "just say yes (～￣▽￣)～ ",
  "wrong answer",
  "one more try",
  "pliss? 😭"
];

let noCount = 0;
let noHasMoved = false;


/*
  Di chuyển NO ra ngoài card.

  Lý do:
  card của bạn có animation/transform.
  Nếu NO vẫn nằm bên trong card thì position: fixed
  có thể bị tính theo card thay vì viewport.

  Đưa NO thẳng vào body sẽ giúp nó thật sự chạy
  theo toàn màn hình.
*/
function detachNoButton() {
  if (noHasMoved) return;

  const yesRect = yesBtn.getBoundingClientRect();

  /*
    Lấy size chính xác của YES trước,
    để NO bằng hệt YES.
  */
  noBtn.style.width = `${yesRect.width}px`;
  noBtn.style.height = `${yesRect.height}px`;

  /*
    Move NO ra body.
  */
  document.body.appendChild(noBtn);

  noBtn.classList.add("moving");

  noBtn.style.position = "fixed";
  noBtn.style.zIndex = "99999";

  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";

  noBtn.style.margin = "0";
  noBtn.style.transform = "none";

  noHasMoved = true;
}


/*
  Clamp một giá trị trong khoảng min → max.
*/
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}


/*
  Random vị trí NO nhưng luôn giữ nó
  hoàn toàn nằm trong viewport.
*/
function moveNoButton() {
  detachNoButton();

  /*
    Đổi text trước rồi mới đo kích thước.
    Như vậy text dài cũng không làm calculation sai.
  */
  noCount++;

  noBtn.textContent =
    noTexts[noCount % noTexts.length];


  /*
    Luôn ép NO bằng kích thước YES.
  */
  const yesRect = yesBtn.getBoundingClientRect();

  noBtn.style.width = `${yesRect.width}px`;
  noBtn.style.height = `${yesRect.height}px`;


  /*
    Đo lại NO sau khi:
    - được chuyển vào body
    - position fixed
    - được resize
    - đổi text
  */
  const buttonRect = noBtn.getBoundingClientRect();

  const buttonWidth = buttonRect.width;
  const buttonHeight = buttonRect.height;


  /*
    visualViewport đáng tin cậy hơn window.innerWidth
    trên mobile và khi browser zoom.
  */
  const viewportWidth =
    window.visualViewport?.width ||
    document.documentElement.clientWidth;

  const viewportHeight =
    window.visualViewport?.height ||
    document.documentElement.clientHeight;


  /*
    Chừa mép để nút không sát cạnh màn hình.
  */
  const padding = 24;

  const minX = padding;
  const minY = padding;

  const maxX =
    viewportWidth -
    buttonWidth -
    padding;

  const maxY =
    viewportHeight -
    buttonHeight -
    padding;


  /*
    Nếu màn hình quá nhỏ thì vẫn tránh NaN.
  */
  const safeMaxX = Math.max(minX, maxX);
  const safeMaxY = Math.max(minY, maxY);


  let randomX =
    minX +
    Math.random() *
      (safeMaxX - minX);

  let randomY =
    minY +
    Math.random() *
      (safeMaxY - minY);


  /*
    Clamp lần cuối.
    Đây là lớp bảo vệ cuối cùng để NO không
    vượt ra khỏi viewport.
  */
  randomX = clamp(
    randomX,
    minX,
    safeMaxX
  );

  randomY = clamp(
    randomY,
    minY,
    safeMaxY
  );


  noBtn.style.left = `${randomX}px`;
  noBtn.style.top = `${randomY}px`;

  noBtn.style.right = "auto";
  noBtn.style.bottom = "auto";
}


/*
  Desktop:
  vừa hover vào NO là nó chạy.
*/
noBtn.addEventListener(
  "mouseenter",
  moveNoButton
);


/*
  Mobile + desktop click.
*/
noBtn.addEventListener(
  "pointerdown",
  (e) => {
    e.preventDefault();
    moveNoButton();
  }
);


/*
  Khi YES được chọn:
  ẩn NO rồi chuyển step.
*/
yesBtn.addEventListener(
  "click",
  () => {
    noBtn.style.display = "none";

    showStep("step-date");
  }
);


/*
  Reset NO nếu quay lại màn hình đầu.
*/
function resetNoButton() {
  noCount = 0;

  noBtn.textContent = "no";

  noBtn.style.display = "";

  noBtn.classList.remove("moving");

  noBtn.style.position = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "";
  noBtn.style.bottom = "";

  noBtn.style.width = "";
  noBtn.style.height = "";

  noBtn.style.zIndex = "";
  noBtn.style.margin = "";
  noBtn.style.transform = "";

  /*
    Đưa NO về lại đúng khu vực ban đầu.
  */
  if (ctaArea && noBtn.parentElement !== ctaArea) {
    ctaArea.appendChild(noBtn);
  }

  noHasMoved = false;
}


/* =========================================================
   BACK BUTTONS
========================================================= */

document
  .querySelectorAll(".back")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        const target =
          btn.dataset.back;

        if (target === "step-intro") {
          resetNoButton();
        }

        showStep(target);
      }
    );

  });


/* =========================================================
   DATE
========================================================= */

const calendarDays = document.getElementById("calendarDays");
const monthYear = document.getElementById("monthYear");

const prevMonthBtn = document.getElementById("prevMonth");
const nextMonthBtn = document.getElementById("nextMonth");
const dateNext = document.getElementById("dateNext");

const today = new Date();

today.setHours(0, 0, 0, 0);

let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

let selectedDate = null;


function renderCalendar() {
  calendarDays.innerHTML = "";

  const firstDay =
    new Date(
      currentYear,
      currentMonth,
      1
    ).getDay();

  const daysInMonth =
    new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate();


  monthYear.textContent =
    new Date(
      currentYear,
      currentMonth
    ).toLocaleDateString(
      "en-US",
      {
        month: "long",
        year: "numeric"
      }
    );


  // empty spaces before first day
  for (let i = 0; i < firstDay; i++) {
    const empty =
      document.createElement("div");

    empty.classList.add("calendar-empty");

    calendarDays.appendChild(empty);
  }


  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    const button =
      document.createElement("button");

    button.type = "button";

    button.classList.add("calendar-day");

    button.textContent = day;


    const thisDate =
      new Date(
        currentYear,
        currentMonth,
        day
      );

    thisDate.setHours(0, 0, 0, 0);


    // disable past dates
    if (thisDate < today) {
      button.disabled = true;

      button.classList.add("past");
    }


    // mark today
    if (
      thisDate.getTime() ===
      today.getTime()
    ) {
      button.classList.add("today");
    }


    // restore selected date
    if (
      selectedDate &&
      thisDate.getTime() ===
        selectedDate.getTime()
    ) {
      button.classList.add("selected");
    }


    button.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".calendar-day")
          .forEach(btn =>
            btn.classList.remove("selected")
          );

        button.classList.add("selected");

        selectedDate = thisDate;

        state.date =
          `${currentYear}-${String(
            currentMonth + 1
          ).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;

        dateNext.disabled = false;
      }
    );


    calendarDays.appendChild(button);
  }
}


prevMonthBtn.addEventListener(
  "click",
  () => {

    const previous =
      new Date(
        currentYear,
        currentMonth - 1,
        1
      );

    // không cho quay về tháng đã qua
    const thisMonth =
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );

    if (previous < thisMonth) {
      return;
    }

    currentMonth--;

    if (currentMonth < 0) {
      currentMonth = 11;
      currentYear--;
    }

    renderCalendar();
  }
);


nextMonthBtn.addEventListener(
  "click",
  () => {

    currentMonth++;

    if (currentMonth > 11) {
      currentMonth = 0;
      currentYear++;
    }

    renderCalendar();
  }
);


dateNext.addEventListener(
  "click",
  () => {

    if (!selectedDate) return;

    renderTimeOptions();

    showStep("step-time");

  }
);


renderCalendar();


/* =========================================================
   TIME
========================================================= */

const timeGrid = document.getElementById("timeGrid");
const timeNext = document.getElementById("timeNext");
const timeSubtitle = document.getElementById("timeSubtitle");

const weekdayTimes = [
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
];

const weekendTimes = [
  "12:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM"
];

function renderTimeOptions() {
  timeGrid.innerHTML = "";
  state.time = "";
  timeNext.disabled = true;

  const selected = new Date(`${state.date}T12:00:00`);
  const day = selected.getDay();

  const isWeekend = day === 0 || day === 6;

  timeSubtitle.textContent = isWeekend
  ? "weekend mode ♡"
  : "after work?";

  const times = isWeekend
    ? weekendTimes
    : weekdayTimes;

  times.forEach(time => {
    const btn = document.createElement("button");

    btn.type = "button";
    btn.className = "choice";
    btn.dataset.time = time;
    btn.textContent = time;

    btn.addEventListener("click", () => {
      document
        .querySelectorAll("[data-time]")
        .forEach(b => b.classList.remove("selected"));

      btn.classList.add("selected");

      state.time = time;
      timeNext.disabled = false;
    });

    timeGrid.appendChild(btn);
  });
}

timeNext.addEventListener("click", () => {
  if (!state.time) return;

  showStep("step-plan");
});


/* =========================================================
   PLAN
========================================================= */

const planButtons =
  document.querySelectorAll(
    "[data-plan]"
  );

const finishBtn =
  document.getElementById(
    "finishBtn"
  );


planButtons.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      planButtons.forEach(
        b =>
          b.classList.remove(
            "selected"
          )
      );

      btn.classList.add(
        "selected"
      );

      state.plan =
        btn.dataset.plan;

      finishBtn.disabled =
        false;
    }
  );

});


const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbw7kB1H0wOjrbaM_qfPABz9YKY4477leUwAAEJepxzfXrTY4aFD1xIMM90nDYKr_DZ0QA/exec";

finishBtn.addEventListener("click", async () => {
  if (!state.date || !state.time || !state.plan) return;

  finishBtn.disabled = true;
  finishBtn.textContent = "sending... ♡";

  const pickedDate = new Date(`${state.date}T12:00:00`);

  const formattedDate = pickedDate.toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric"
    }
  );

  const formData = new URLSearchParams();

  formData.append("date", state.date);
  formData.append("time", state.time);
  formData.append("food", state.plan);

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      body: formData
    });

    document.getElementById("summaryDate").textContent =
      formattedDate;

    document.getElementById("summaryTime").textContent =
      state.time;

    document.getElementById("summaryPlan").textContent =
      state.plan;

    showStep("step-final");

  } catch (error) {
    console.error("Submission failed:", error);

    alert("Something went wrong. Please try again ♡");

  } finally {
    finishBtn.disabled = false;
    finishBtn.textContent = "lock it in ♡";
  }
});




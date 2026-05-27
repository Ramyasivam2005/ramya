document.addEventListener("DOMContentLoaded", function () {

  var schoolFields = document.getElementById("schoolFields");
  var schoolRadios = document.querySelectorAll("input[name='schoolStatus']");

  schoolRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      if (this.value === "going") {
        schoolFields.style.display = "block";
      } else {
        schoolFields.style.display = "none";
      }
    });
  });

  var emailInput   = document.getElementById("email");
  var emailError   = document.getElementById("emailError");
  var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (emailInput && emailError) {
    emailInput.addEventListener("input", function () {
      var value = emailInput.value.trim();
      if (!value) {
        emailError.textContent = "";
        emailError.className   = "";
      } else if (emailPattern.test(value)) {
        emailError.textContent = "Valid Email ✓";
        emailError.className   = "valid";
      } else {
        emailError.textContent = "Invalid Email";
        emailError.className   = "invalid";
      }
    });
  }

  var passwordInput = document.getElementById("password");
  var toggleBtn     = document.getElementById("toggleBtn");

  if (passwordInput && toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var isPassword        = passwordInput.type === "password";
      passwordInput.type    = isPassword ? "text" : "password";
      toggleBtn.textContent = isPassword ? "Hide" : "Show";
    });
  }

  var photoInput        = document.getElementById("photoInput");
  var photoBox          = document.getElementById("photoBox");
  var photoPreviewBox   = document.getElementById("photoPreviewBox");
  var photoPreviewLarge = document.getElementById("photoPreviewLarge");
  var photoFileName     = document.getElementById("photoFileName");
  var photoRemoveBtn    = document.getElementById("photoRemoveBtn");
  var photoViewBtn      = document.getElementById("photoViewBtn");
  var lightbox          = document.getElementById("imgLightbox");
  var lightboxImg       = document.getElementById("lightboxImg");
  var lightboxClose     = document.getElementById("lightboxClose");

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });

  if (photoInput) {
    photoInput.addEventListener("change", function () {
      var file = this.files[0];
      if (file && file.type.startsWith("image/")) {
        var reader = new FileReader();
        reader.onload = function (e) {
          photoPreviewLarge.src     = e.target.result;
          photoFileName.textContent = file.name;
          photoBox.style.display        = "none";
          photoPreviewBox.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (photoPreviewLarge) {
    photoPreviewLarge.addEventListener("click", function () {
      if (this.src) openLightbox(this.src);
    });
  }

  if (photoViewBtn) {
    photoViewBtn.addEventListener("click", function () {
      if (photoPreviewLarge && photoPreviewLarge.src) openLightbox(photoPreviewLarge.src);
    });
  }

  if (photoRemoveBtn) {
    photoRemoveBtn.addEventListener("click", function () {
      photoInput.value              = "";
      photoPreviewLarge.src         = "";
      photoBox.style.display        = "block";
      photoPreviewBox.style.display = "none";
    });
  }

  var MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function buildCalendar(calEl, hiddenInput, displayEl, errId) {
    var now = new Date();
    var viewYear  = now.getFullYear();
    var viewMonth = now.getMonth();
    var selectedDate = null;

    var header      = calEl.querySelector(".cal-header");
    var monthLabel  = calEl.querySelector(".cal-month-label");
    var yearLabel   = calEl.querySelector(".cal-year-label");
    var navBtns     = calEl.querySelectorAll(".cal-nav");
    var daysGrid    = calEl.querySelector(".cal-days");
    var monthPicker = calEl.querySelector(".cal-month-picker");
    var yearPicker  = calEl.querySelector(".cal-year-picker");
    var todayBtn    = calEl.querySelector(".cal-today-btn");
    var clearBtn    = calEl.querySelector(".cal-clear-btn");
    var displayText = displayEl.querySelector(".date-display-text");

    function renderDays() {
      monthLabel.textContent = MONTHS[viewMonth];
      yearLabel.textContent  = viewYear;
      daysGrid.innerHTML = "";

      var firstDay = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();

      var todayStr = formatDateVal(now.getFullYear(), now.getMonth(), now.getDate());

      for (var i = firstDay - 1; i >= 0; i--) {
        var d = createDayEl(daysInPrev - i, viewYear, viewMonth - 1, "other-month", todayStr, selectedDate);
        daysGrid.appendChild(d);
      }

      for (var day = 1; day <= daysInMonth; day++) {
        var d2 = createDayEl(day, viewYear, viewMonth, "", todayStr, selectedDate);
        daysGrid.appendChild(d2);
      }

      var totalCells = daysGrid.children.length;
      var remaining  = totalCells <= 35 ? 35 - totalCells : 42 - totalCells;
      for (var n = 1; n <= remaining; n++) {
        var d3 = createDayEl(n, viewYear, viewMonth + 1, "other-month", todayStr, selectedDate);
        daysGrid.appendChild(d3);
      }
    }

    function createDayEl(day, y, m, extraClass, todayStr, selDate) {
      var el = document.createElement("div");
      el.className = "cal-day" + (extraClass ? " " + extraClass : "");
      el.textContent = day;

      var realDate = new Date(y, m, day);
      var ry = realDate.getFullYear();
      var rm = realDate.getMonth();
      var rd = realDate.getDate();
      var dateStr = formatDateVal(ry, rm, rd);

      if (dateStr === todayStr) el.classList.add("today");
      if (selDate && dateStr === selDate) el.classList.add("selected");

      el.addEventListener("click", function () {
        selectedDate = dateStr;
        hiddenInput.value = dateStr;
        displayText.textContent = formatDisplay(ry, rm, rd);
        displayEl.classList.add("has-value");
        displayEl.classList.remove("input-error");
        if (errId) {
          var errEl = document.getElementById(errId);
          if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
        }
        if (m !== viewMonth) {
          viewYear  = ry;
          viewMonth = rm;
        }
        renderDays();
        closeCalendar();
      });

      return el;
    }

    function formatDateVal(y, m, d) {
      return y + "-" + pad(m + 1) + "-" + pad(d);
    }

    function formatDisplay(y, m, d) {
      return pad(d) + " " + SHORT_MONTHS[m] + " " + y;
    }

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function buildMonthPicker() {
      monthPicker.innerHTML = "";
      MONTHS.forEach(function (name, idx) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "cal-month-btn" + (idx === viewMonth ? " selected" : "");
        btn.textContent = name.substring(0, 3);
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          viewMonth = idx;
          monthPicker.classList.remove("visible");
          renderDays();
        });
        monthPicker.appendChild(btn);
      });
      monthPicker.classList.toggle("visible");
      yearPicker.classList.remove("visible");
    }

    function buildYearPicker() {
      yearPicker.innerHTML = "";
      var startYear = 1950;
      var endYear   = now.getFullYear() + 10;
      for (var yr = endYear; yr >= startYear; yr--) {
        (function(y) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "cal-year-btn" + (y === viewYear ? " selected" : "");
          btn.textContent = y;
          btn.addEventListener("click", function (e) {
            e.stopPropagation();
            viewYear = y;
            yearPicker.classList.remove("visible");
            renderDays();
          });
          yearPicker.appendChild(btn);
        })(yr);
      }
      yearPicker.classList.toggle("visible");
      monthPicker.classList.remove("visible");
    }

    monthLabel.addEventListener("click", function (e) {
      e.stopPropagation();
      buildMonthPicker();
    });

    yearLabel.addEventListener("click", function (e) {
      e.stopPropagation();
      buildYearPicker();
    });

    navBtns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        monthPicker.classList.remove("visible");
        yearPicker.classList.remove("visible");
        viewMonth += parseInt(this.getAttribute("data-dir"));
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        if (viewMonth < 0)  { viewMonth = 11; viewYear--; }
        renderDays();
      });
    });

    todayBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      viewYear  = now.getFullYear();
      viewMonth = now.getMonth();
      var todayStr = formatDateVal(viewYear, viewMonth, now.getDate());
      selectedDate = todayStr;
      hiddenInput.value = todayStr;
      displayText.textContent = formatDisplay(viewYear, viewMonth, now.getDate());
      displayEl.classList.add("has-value");
      displayEl.classList.remove("input-error");
      if (errId) {
        var errEl = document.getElementById(errId);
        if (errEl) { errEl.textContent = ""; errEl.classList.remove("show"); }
      }
      renderDays();
      closeCalendar();
    });

    clearBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      selectedDate = null;
      hiddenInput.value = "";
      displayText.textContent = "Select date";
      displayEl.classList.remove("has-value");
      renderDays();
      closeCalendar();
    });

    function openCalendar() {
      monthPicker.classList.remove("visible");
      yearPicker.classList.remove("visible");
      renderDays();
      calEl.classList.add("open");
      displayEl.classList.add("active");
    }

    function closeCalendar() {
      calEl.classList.remove("open");
      displayEl.classList.remove("active");
    }

    displayEl.addEventListener("click", function (e) {
      e.stopPropagation();
      var isOpen = calEl.classList.contains("open");
      document.querySelectorAll(".custom-calendar.open").forEach(function(c) {
        c.classList.remove("open");
        var assocDisplay = document.getElementById(c.id.replace("-cal", "-display"));
        if (assocDisplay) assocDisplay.classList.remove("active");
      });
      if (!isOpen) openCalendar();
    });

    calEl.addEventListener("click", function (e) { e.stopPropagation(); });

    document.addEventListener("click", function () {
      closeCalendar();
    });

    renderDays();
  }

  var dobHidden    = document.getElementById("dob");
  var dobDisplay   = document.getElementById("dob-display");
  var dobCal       = document.getElementById("dob-cal");

  var admHidden    = document.getElementById("admissionDate");
  var admDisplay   = document.getElementById("admissionDate-display");
  var admCal       = document.getElementById("admissionDate-cal");

  if (dobHidden && dobDisplay && dobCal) {
    buildCalendar(dobCal, dobHidden, dobDisplay, "dob-err");
  }

  if (admHidden && admDisplay && admCal) {
    buildCalendar(admCal, admHidden, admDisplay, "admissionDate-err");
  }

  var skipTypes = ["email", "password", "radio", "checkbox", "date", "file", "submit", "button", "number"];

  document.querySelectorAll("input, textarea").forEach(function (field) {
    if (skipTypes.indexOf(field.type) !== -1 || field.id === "email") return;
    field.addEventListener("input", function () {
      var pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      try { this.setSelectionRange(pos, pos); } catch (e) {}
    });
  });

  function showErr(fieldId, errId, msg) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(errId);
    if (field) {
      if (field.type === "hidden") {
        var displayField = document.getElementById(fieldId + "-display");
        if (displayField) displayField.classList.add("input-error");
      } else {
        field.classList.add("input-error");
      }
    }
    if (err) { err.textContent = msg; err.classList.add("show"); }
  }

  function clearErr(fieldId, errId) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(errId);
    if (field) {
      if (field.type === "hidden") {
        var displayField = document.getElementById(fieldId + "-display");
        if (displayField) displayField.classList.remove("input-error");
      } else {
        field.classList.remove("input-error");
      }
    }
    if (err) { err.textContent = ""; err.classList.remove("show"); }
  }

  var liveFields = [
    ["branch",          "branch-err"],
    ["studentName",     "studentName-err"],
    ["gender",          "gender-err"],
    ["dob",             "dob-err"],
    ["religion",        "religion-err"],
    ["referralType",    "referralType-err"],
    ["admissionDate",   "admissionDate-err"],
    ["password",        "password-err"],
    ["fatherName",      "fatherName-err"],
    ["fatherPhone",     "fatherPhone-err"],
    ["motherName",      "motherName-err"],
    ["motherPhone",     "motherPhone-err"],
    ["schoolName",      "schoolName-err"],
    ["schoolStandard",  "schoolStandard-err"],
    ["schoolAddress",   "schoolAddress-err"],
    ["currentAddress",  "currentAddress-err"],
    ["permanentAddress","permanentAddress-err"],
    ["guardianRelation","guardianRelation-err"],
    ["guardianPhone",   "guardianPhone-err"],
    ["guardianAddress", "guardianAddress-err"]
  ];

  liveFields.forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    if (!el) return;
    var events = (el.tagName === "SELECT" || el.type === "date" || el.type === "hidden") ? ["change"] : ["input"];
    events.forEach(function (ev) {
      el.addEventListener(ev, function () {
        if (el.value.trim()) clearErr(pair[0], pair[1]);
      });
    });
  });

  var guardianNameInput = document.getElementById("guardianName");
  var guardianFields    = document.getElementById("guardianFields");

  guardianNameInput.addEventListener("input", function () {
    if (this.value.trim()) {
      guardianFields.style.display = "block";
    } else {
      guardianFields.style.display = "none";
      ["guardianRelation","guardianPhone","guardianAddress"].forEach(function (id) {
        clearErr(id, id + "-err");
      });
    }
  });

  var form = document.getElementById("admissionForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var isValid = true;

    function req(fieldId, errId, label) {
      var el = document.getElementById(fieldId);
      if (!el) return;
      if (!el.value.trim()) {
        showErr(fieldId, errId, label + " is required!");
        isValid = false;
      } else {
        clearErr(fieldId, errId);
      }
    }

    req("branch",        "branch-err",        "Primary Branch");
    req("studentName",   "studentName-err",   "Student Name");
    req("gender",        "gender-err",        "Gender");
    req("dob",           "dob-err",           "Date of Birth");
    req("religion",      "religion-err",      "Religion");
    req("referralType",  "referralType-err",  "Referral Type");
    req("admissionDate", "admissionDate-err", "Admission Date");

    var emailVal = document.getElementById("email");
    if (emailVal && !emailVal.value.trim()) {
      emailVal.classList.add("input-error");
      isValid = false;
    }

    req("password", "password-err", "Password");

    req("fatherName",  "fatherName-err",  "Father's Name");
    req("fatherPhone", "fatherPhone-err", "Father's Phone");
    req("motherName",  "motherName-err",  "Mother's Name");
    req("motherPhone", "motherPhone-err", "Mother's Phone");

    var schoolGoing = document.querySelector("input[name='schoolStatus']:checked");
    if (schoolGoing && schoolGoing.value === "going") {
      req("schoolName",     "schoolName-err",     "School Name");
      req("schoolStandard", "schoolStandard-err", "Standard / Section");
      req("schoolAddress",  "schoolAddress-err",  "School Address");
    }

    req("currentAddress",   "currentAddress-err",   "Current Address");
    req("permanentAddress", "permanentAddress-err",  "Permanent Address");

    var gName = document.getElementById("guardianName");
    if (gName && gName.value.trim()) {
      req("guardianRelation", "guardianRelation-err", "Relationship");
      req("guardianPhone",    "guardianPhone-err",    "Guardian Phone");
      req("guardianAddress",  "guardianAddress-err",  "Guardian Address");
    }

    if (!isValid) {
      var firstErrField = document.querySelector(".input-error");
      if (firstErrField) firstErrField.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

});
document.addEventListener("DOMContentLoaded", function () {


  var schoolFields = document.getElementById("schoolFields");
  var schoolRadios = document.querySelectorAll("input[name='schoolStatus']");
  schoolRadios.forEach(function (radio) {
    radio.addEventListener("change", function () {
      schoolFields.style.display = this.value === "going" ? "block" : "none";
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
        emailError.className   = "field-error";
      } else if (emailPattern.test(value)) {
        emailError.textContent = "Valid Email ✓";
        emailError.className   = "field-error show valid-msg";
        emailInput.classList.remove("input-error");
      } else {
        emailError.textContent = "Invalid Email";
        emailError.className   = "field-error show";
        emailInput.classList.add("input-error");
      }
    });

    emailInput.addEventListener("blur", function () {
      var value = emailInput.value.trim();
      if (value && !emailPattern.test(value)) {
        emailError.textContent = "Invalid Email";
        emailError.className   = "field-error show";
        emailInput.classList.add("input-error");
      }
    });
  }


  var passwordInput = document.getElementById("password");
  var toggleBtn     = document.getElementById("toggleBtn");

  var eyeOpen = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>';
  var eyeClosed = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.96 9.96 0 012.293-3.95M6.47 6.47A9.952 9.952 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.959 9.959 0 01-4.166 5.36M3 3l18 18"/></svg>';

  if (toggleBtn) toggleBtn.innerHTML = eyeOpen;

  if (passwordInput && toggleBtn) {
    toggleBtn.addEventListener("click", function () {
      var isPassword = passwordInput.type === "password";
      passwordInput.type    = isPassword ? "text" : "password";
      toggleBtn.innerHTML   = isPassword ? eyeOpen : eyeClosed;
    });

    passwordInput.addEventListener("input", function () {
      if (this.value.length === 0) {
        clearErr("password", "password-err");
      } else if (this.value.length < 6) {
        showErr("password", "password-err", "Password must be at least 6 characters!");
      } else {
        clearErr("password", "password-err");
      }
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

  var lbScale = 1, lbRotateDeg = 0;

  function updateImgTransform() {
    lightboxImg.style.transform = "scale(" + lbScale + ") rotate(" + lbRotateDeg + "deg)";
  }

  function openLightbox(src) {
    lightboxImg.src = src;
    lbScale = 1; lbRotateDeg = 0;
    lightboxImg.style.transform = "";
    lightbox.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  var lbZoomIn  = document.getElementById("lbZoomIn");
  var lbZoomOut = document.getElementById("lbZoomOut");
  var lbRotate  = document.getElementById("lbRotate");

  if (lbZoomIn) {
    lbZoomIn.addEventListener("click", function (e) {
      e.stopPropagation();
      lbScale = Math.min(lbScale + 0.25, 3);
      updateImgTransform();
    });
  }

  if (lbZoomOut) {
    lbZoomOut.addEventListener("click", function (e) {
      e.stopPropagation();
      lbScale = Math.max(lbScale - 0.25, 0.5);
      updateImgTransform();
    });
  }

  if (lbRotate) {
    lbRotate.addEventListener("click", function (e) {
      e.stopPropagation();
      lbRotateDeg = (lbRotateDeg + 90) % 360;
      updateImgTransform();
    });
  }

  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightbox) lightbox.addEventListener("click", function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });

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

  if (photoPreviewLarge) photoPreviewLarge.addEventListener("click", function () { if (this.src) openLightbox(this.src); });
  if (photoViewBtn) photoViewBtn.addEventListener("click", function () { if (photoPreviewLarge && photoPreviewLarge.src) openLightbox(photoPreviewLarge.src); });
  if (photoRemoveBtn) {
    photoRemoveBtn.addEventListener("click", function () {
      photoInput.value              = "";
      photoPreviewLarge.src         = "";
      photoBox.style.display        = "block";
      photoPreviewBox.style.display = "none";
    });
  }


  var MONTHS       = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  var SHORT_MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function buildCalendar(calEl, hiddenInput, displayEl, errId) {
    var now = new Date();
    var viewYear  = now.getFullYear();
    var viewMonth = now.getMonth();
    var selectedDate = null;

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
      var firstDay    = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
      var daysInPrev  = new Date(viewYear, viewMonth, 0).getDate();
      var todayStr    = fmtVal(now.getFullYear(), now.getMonth(), now.getDate());

      for (var i = firstDay - 1; i >= 0; i--)
        daysGrid.appendChild(mkDay(daysInPrev - i, viewYear, viewMonth - 1, "other-month", todayStr));
      for (var d = 1; d <= daysInMonth; d++)
        daysGrid.appendChild(mkDay(d, viewYear, viewMonth, "", todayStr));
      var total = daysGrid.children.length;
      var rem   = total <= 35 ? 35 - total : 42 - total;
      for (var n = 1; n <= rem; n++)
        daysGrid.appendChild(mkDay(n, viewYear, viewMonth + 1, "other-month", todayStr));
    }

    function mkDay(day, y, m, extra, todayStr) {
      var el = document.createElement("div");
      el.className = "cal-day" + (extra ? " " + extra : "");
      el.textContent = day;
      var rd = new Date(y, m, day);
      var ry = rd.getFullYear(), rm = rd.getMonth(), rday = rd.getDate();
      var ds = fmtVal(ry, rm, rday);
      if (ds === todayStr) el.classList.add("today");
      if (selectedDate && ds === selectedDate) el.classList.add("selected");
      el.addEventListener("click", function () {
        selectedDate = ds; hiddenInput.value = ds;
        displayText.textContent = fmtDisp(ry, rm, rday);
        displayEl.classList.add("has-value"); displayEl.classList.remove("input-error");
        if (errId) { var e2=document.getElementById(errId); if(e2){e2.textContent="";e2.classList.remove("show");} }
        if (m !== viewMonth) { viewYear=ry; viewMonth=rm; }
        renderDays(); closeCalendar();
      });
      return el;
    }

    function fmtVal(y,m,d){ return y+"-"+pad(m+1)+"-"+pad(d); }
    function fmtDisp(y,m,d){ return pad(d)+" "+SHORT_MONTHS[m]+" "+y; }
    function pad(n){ return n<10?"0"+n:""+n; }

    function buildMonthPicker() {
      monthPicker.innerHTML="";
      MONTHS.forEach(function(name,idx){
        var btn=document.createElement("button"); btn.type="button";
        btn.className="cal-month-btn"+(idx===viewMonth?" selected":"");
        btn.textContent=name.substring(0,3);
        btn.addEventListener("click",function(e){e.stopPropagation();viewMonth=idx;monthPicker.classList.remove("visible");renderDays();});
        monthPicker.appendChild(btn);
      });
      monthPicker.classList.toggle("visible"); yearPicker.classList.remove("visible");
    }

    function buildYearPicker() {
      yearPicker.innerHTML="";
      for(var yr=now.getFullYear()+10;yr>=1950;yr--){
        (function(y){
          var btn=document.createElement("button"); btn.type="button";
          btn.className="cal-year-btn"+(y===viewYear?" selected":"");
          btn.textContent=y;
          btn.addEventListener("click",function(e){e.stopPropagation();viewYear=y;yearPicker.classList.remove("visible");renderDays();});
          yearPicker.appendChild(btn);
        })(yr);
      }
      yearPicker.classList.toggle("visible"); monthPicker.classList.remove("visible");
    }

    monthLabel.addEventListener("click",function(e){e.stopPropagation();buildMonthPicker();});
    yearLabel.addEventListener("click",function(e){e.stopPropagation();buildYearPicker();});

    navBtns.forEach(function(btn){
      btn.addEventListener("click",function(e){
        e.stopPropagation();
        monthPicker.classList.remove("visible"); yearPicker.classList.remove("visible");
        viewMonth+=parseInt(this.getAttribute("data-dir"));
        if(viewMonth>11){viewMonth=0;viewYear++;}
        if(viewMonth<0){viewMonth=11;viewYear--;}
        renderDays();
      });
    });

    todayBtn.addEventListener("click",function(e){
      e.stopPropagation();
      viewYear=now.getFullYear(); viewMonth=now.getMonth();
      var ts=fmtVal(viewYear,viewMonth,now.getDate());
      selectedDate=ts; hiddenInput.value=ts;
      displayText.textContent=fmtDisp(viewYear,viewMonth,now.getDate());
      displayEl.classList.add("has-value"); displayEl.classList.remove("input-error");
      if(errId){var e2=document.getElementById(errId);if(e2){e2.textContent="";e2.classList.remove("show");}}
      renderDays(); closeCalendar();
    });

    clearBtn.addEventListener("click",function(e){
      e.stopPropagation();
      selectedDate=null; hiddenInput.value="";
      displayText.textContent="Select date";
      displayEl.classList.remove("has-value");
      renderDays(); closeCalendar();
    });

    function openCalendar(){
      monthPicker.classList.remove("visible"); yearPicker.classList.remove("visible");
      renderDays(); calEl.classList.add("open"); displayEl.classList.add("active");
    }
    function closeCalendar(){ calEl.classList.remove("open"); displayEl.classList.remove("active"); }

    displayEl.addEventListener("click",function(e){
      e.stopPropagation();
      var isOpen=calEl.classList.contains("open");
      document.querySelectorAll(".custom-calendar.open").forEach(function(c){c.classList.remove("open");});
      if(!isOpen) openCalendar();
    });

    calEl.addEventListener("click",function(e){e.stopPropagation();});
    document.addEventListener("click",function(){closeCalendar();});
    renderDays();

    // expose reset function
    calEl._resetCal = function() {
      selectedDate = null;
      hiddenInput.value = "";
      displayText.textContent = "Select date";
      displayEl.classList.remove("has-value", "input-error", "active");
      calEl.classList.remove("open");
      viewYear = now.getFullYear();
      viewMonth = now.getMonth();
      renderDays();
    };
  }

  var dobHidden  = document.getElementById("dob");
  var dobDisplay = document.getElementById("dob-display");
  var dobCal     = document.getElementById("dob-cal");
  var admHidden  = document.getElementById("admissionDate");
  var admDisplay = document.getElementById("admissionDate-display");
  var admCal     = document.getElementById("admissionDate-cal");

  if (dobHidden && dobDisplay && dobCal) buildCalendar(dobCal, dobHidden, dobDisplay, "dob-err");
  if (admHidden && admDisplay && admCal) buildCalendar(admCal, admHidden, admDisplay, "admissionDate-err");


  var skipTypes = ["email","password","radio","checkbox","date","file","submit","button","number"];
  document.querySelectorAll("input, textarea").forEach(function (field) {
    if (skipTypes.indexOf(field.type) !== -1 || field.id === "email") return;
    field.addEventListener("input", function () {
      var pos = this.selectionStart;
      this.value = this.value.toUpperCase();
      try { this.setSelectionRange(pos, pos); } catch(e){}
    });
  });


  function showErr(fieldId, errId, msg) {
    var field = document.getElementById(fieldId);
    var err   = document.getElementById(errId);
    if (field) {
      if (field.type === "hidden") {
        var df = document.getElementById(fieldId+"-display");
        if (df) df.classList.add("input-error");
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
        var df = document.getElementById(fieldId+"-display");
        if (df) df.classList.remove("input-error");
      } else {
        field.classList.remove("input-error");
      }
    }
    if (err) { err.textContent = ""; err.classList.remove("show"); }
  }

  function isValidIndianPhone(val) {
    return /^[6-9]\d{9}$/.test(val);
  }

var liveFields = [
  ["branch","branch-err"],
  ["studentName","studentName-err"],
  ["gender","gender-err"],
  ["dob","dob-err"],
  ["religion","religion-err"],
  ["referralType","referralType-err"],
  ["admissionDate","admissionDate-err"],

  ["fatherName","fatherName-err"],
  ["fatherOccupation","fatherOccupation-err"],

  ["motherName","motherName-err"],
  ["motherOccupation","motherOccupation-err"],

  ["schoolName","schoolName-err"],
  ["schoolStandard","schoolStandard-err"],
  ["schoolAddress","schoolAddress-err"],

  ["currentAddress","currentAddress-err"],
  ["permanentAddress","permanentAddress-err"],

  ["guardianName","guardianName-err"],
  ["guardianRelation","guardianRelation-err"],
  ["guardianAddress","guardianAddress-err"]
];
  liveFields.forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    if (!el) return;
    var events = (el.tagName==="SELECT"||el.type==="date"||el.type==="hidden") ? ["change"] : ["input"];
    events.forEach(function (ev) {
      el.addEventListener(ev, function () { if (el.value.trim()) clearErr(pair[0], pair[1]); });
    });
  });


 var phoneFields = [
  ["fatherPhone","fatherPhone-err","Father's Phone"],
  ["motherPhone","motherPhone-err","Mother's Phone"]
];

  phoneFields.forEach(function(p) {
    var el = document.getElementById(p[0]);
    if (!el) return;
    el.addEventListener("input", function () {
      var val = this.value.trim();
      if (!val) {
        clearErr(p[0], p[1]);
      } else if (!isValidIndianPhone(val)) {
        showErr(p[0], p[1], "Invalid mobile number");
      } else {
        clearErr(p[0], p[1]);
      }
    });
  });

  var guardianPhone = document.getElementById("guardianPhone");

if (guardianPhone) {
  guardianPhone.addEventListener("input", function () {

    // only numbers allowed
    this.value = this.value.replace(/\D/g, "");

    var val = this.value.trim();

    if (!val) {
      clearErr("guardianPhone","guardianPhone-err");
    }
    else if (!isValidIndianPhone(val)) {
      showErr("guardianPhone","guardianPhone-err","Invalid mobile number");
    }
    else {
      clearErr("guardianPhone","guardianPhone-err");
    }
  });
}

  var form = document.getElementById("admissionForm");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var isValid = true;

    function req(fieldId, errId, label) {
      var el = document.getElementById(fieldId);
      if (!el) return;
      if (!el.value.trim()) { showErr(fieldId, errId, label+" is required!"); isValid = false; }
      else clearErr(fieldId, errId);
    }

    req("branch","branch-err","Primary Branch");
    req("studentName","studentName-err","Student Name");
    req("gender","gender-err","Gender");
    req("dob","dob-err","Date of Birth");
    req("religion","religion-err","Religion");
    req("referralType","referralType-err","Referral Type");
    req("admissionDate","admissionDate-err","Admission Date");

    // Email
    var emailVal = document.getElementById("email");
    if (emailVal) {
      if (!emailVal.value.trim()) {
        emailVal.classList.add("input-error");
        emailError.textContent = "Email is required!";
        emailError.className   = "field-error show";
        isValid = false;
      } else if (!emailPattern.test(emailVal.value.trim())) {
        emailVal.classList.add("input-error");
        emailError.textContent = "Invalid Email";
        emailError.className   = "field-error show";
        isValid = false;
      }
    }


    var pwEl = document.getElementById("password");
    if (pwEl) {
      if (!pwEl.value.trim()) { showErr("password","password-err","Password is required!"); isValid=false; }
      else if (pwEl.value.length < 6) { showErr("password","password-err","Password must be at least 6 characters!"); isValid=false; }
      else clearErr("password","password-err");
    }

    req("fatherName","fatherName-err","Father's Name");
req("fatherOccupation","fatherOccupation-err","Father Occupation");

req("motherName","motherName-err","Mother's Name");
req("motherOccupation","motherOccupation-err","Mother Occupation");

    phoneFields.forEach(function(p) {
      var el = document.getElementById(p[0]);
      if (!el) return;
      if (!el.value.trim()) { showErr(p[0],p[1],p[2]+" is required!"); isValid=false; }
      else if (!isValidIndianPhone(el.value.trim())) { showErr(p[0],p[1],"Invalid mobile number"); isValid=false; }
      else clearErr(p[0],p[1]);
    });

    var schoolGoing = document.querySelector("input[name='schoolStatus']:checked");
    if (schoolGoing && schoolGoing.value === "going") {
      req("schoolName","schoolName-err","School Name");
      req("schoolStandard","schoolStandard-err","Standard / Section");
      req("schoolAddress","schoolAddress-err","School Address");
    }

    req("currentAddress","currentAddress-err","Current Address");
    req("permanentAddress","permanentAddress-err","Permanent Address");

 var guardianName = document.getElementById("guardianName").value.trim();
var guardianRelation = document.getElementById("guardianRelation").value.trim();
var guardianAddress = document.getElementById("guardianAddress").value.trim();
var gPhone = document.getElementById("guardianPhone").value.trim();

// If Guardian Name is entered, make other fields mandatory
if (guardianName) {

  clearErr("guardianName","guardianName-err");

  if (!guardianRelation) {
    showErr("guardianRelation","guardianRelation-err","Relationship is required!");
    isValid = false;
  } else {
    clearErr("guardianRelation","guardianRelation-err");
  }

  if (!guardianAddress) {
    showErr("guardianAddress","guardianAddress-err","Guardian Address is required!");
    isValid = false;
  } else {
    clearErr("guardianAddress","guardianAddress-err");
  }

  if (!gPhone) {
    showErr("guardianPhone","guardianPhone-err","Guardian Phone is required!");
    isValid = false;
  }
  else if (!isValidIndianPhone(gPhone)) {
    showErr("guardianPhone","guardianPhone-err","Invalid mobile number");
    isValid = false;
  }
  else {
    clearErr("guardianPhone","guardianPhone-err");
  }

} else {
  // Guardian section completely optional
  clearErr("guardianName","guardianName-err");
  clearErr("guardianRelation","guardianRelation-err");
  clearErr("guardianAddress","guardianAddress-err");
  clearErr("guardianPhone","guardianPhone-err");
}

    if (!isValid) {
      var firstErrField = document.querySelector(".input-error");
      if (firstErrField) firstErrField.scrollIntoView({ behavior:"smooth", block:"center" });
    } else {
      alert("Application submitted successfully!");

      // ── Reset standard form fields ──
      form.reset();

      // ── Reset password eye icon back to open ──
      if (passwordInput) passwordInput.type = "password";
      if (toggleBtn) toggleBtn.innerHTML = eyeOpen;

      // ── Reset Date pickers ──
      if (dobCal && dobCal._resetCal) dobCal._resetCal();
      if (admCal && admCal._resetCal) admCal._resetCal();

      // ── Reset Photo upload ──
      photoInput.value          = "";
      photoPreviewLarge.src     = "";
      photoFileName.textContent = "";
      photoBox.style.display        = "block";
      photoPreviewBox.style.display = "none";

      // ── Hide school fields ──
      schoolFields.style.display = "none";

      // ── Clear all error highlights and messages ──
      document.querySelectorAll(".input-error").forEach(function(el) {
        el.classList.remove("input-error");
      });
      document.querySelectorAll(".field-error").forEach(function(el) {
        el.textContent = "";
        el.className   = "field-error";
      });

      // ── Scroll back to top ──
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

});

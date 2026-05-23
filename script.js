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

 
  var photoInput       = document.getElementById("photoInput");
  var photoPreview     = document.getElementById("photoPreview");
  var photoPlaceholder = document.getElementById("photoPlaceholder");

  if (photoInput && photoPreview) {
    photoInput.addEventListener("change", function () {
      var file = this.files[0];
      if (file && file.type.startsWith("image/")) {
        var reader = new FileReader();
        reader.onload = function (e) {
          photoPreview.src           = e.target.result;
          photoPreview.style.display = "block";
          if (photoPlaceholder) photoPlaceholder.style.display = "none";
        };
        reader.readAsDataURL(file);
      }
    });
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

 
  var form = document.getElementById("admissionForm");

  form.addEventListener("submit", function (e) {
    var allFields = form.querySelectorAll("input, select, textarea");
    var isValid   = true;

    allFields.forEach(function (field) {
 
      if (
        field.type === "submit"   ||
        field.type === "button"   ||
        field.type === "radio"    ||
        field.type === "file"
      ) return;

     
      if (field.closest("#schoolFields") && schoolFields.style.display === "none") return;

      if (field.value.trim() === "") {
        isValid = false;
        field.style.border = "2px solid red";
      } else {
        field.style.border = "2px solid green";
      }
    });

    if (!isValid) {
      e.preventDefault();
      alert("Please fill all the required fields.");
    }
  });

});
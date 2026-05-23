document.addEventListener("DOMContentLoaded", () => {

 
    const schoolFields = document.getElementById("schoolFields");
    const schoolRadios = document.querySelectorAll("input[name='schoolStatus']");

    schoolRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "going" && radio.checked) {
                schoolFields.style.display = "block";
            } else {
                schoolFields.style.display = "none";
            }
        });
    });

    const emailInput = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailInput && emailError) {
        emailInput.addEventListener("input", () => {
            const value = emailInput.value.trim();
            if (!value) {
                emailError.textContent = "";
                emailError.className = "";
            } else if (emailPattern.test(value)) {
                emailError.textContent = "Valid Email";
                emailError.className = "valid";
            } else {
                emailError.textContent = "Invalid Email";
                emailError.className = "invalid";
            }
        });
    }
  
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("toggleBtn");

    if (passwordInput && toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isPassword = passwordInput.type === "password";
            passwordInput.type = isPassword ? "text" : "password";
            toggleBtn.textContent = isPassword ? "Hide" : "Show";
        });
    }

    const photoInput = document.getElementById("photoInput");
    const photoPreview = document.getElementById("photoPreview");
    const photoPlaceholder = document.getElementById("photoPlaceholder");

    if (photoInput && photoPreview) {
        photoInput.addEventListener("change", function () {
            const file = this.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    photoPreview.src = e.target.result;
                    photoPreview.style.display = "block";
                    if (photoPlaceholder) photoPlaceholder.style.display = "none";
                };
                reader.readAsDataURL(file);
            }
        });
    }



   
    document.querySelectorAll("input, textarea").forEach(field => {
        if (field.id === "email") return;
        field.addEventListener("input", () => {
            field.value = field.value.toUpperCase();
        });
    });
   


    document.querySelectorAll(
        "input[type='text'], input[type='tel'], input[type='email'], input[type='password']"
    ).forEach(input => {
        input.style.width = "100%";
        input.style.boxSizing = "border-box";
    });
 


   
    const form = document.getElementById("admissionForm");

    form.addEventListener("submit", function (e) {
        const allFields = form.querySelectorAll("input, select, textarea");
        let isValid = true;

        allFields.forEach(field => {
            if (
                field.type === "submit" ||
                field.type === "button" ||
                field.type === "radio" ||
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
            alert("Please fill all the details");
        }
    });
   

});
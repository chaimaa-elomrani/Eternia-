document.addEventListener("DOMContentLoaded", function () {
    attachEventListener();
  });
  
  function attachEventListener() {
    const sendBtn = document.getElementById("sendbtn");
  
    sendBtn.addEventListener("click", function (event) {
      event.preventDefault();
  
      const firstName = document.getElementById("firstname");
      const lastName = document.getElementById("secondname");
      const email = document.getElementById("email");
      const message = document.getElementById("message");
  
      const errorHandling = document.querySelectorAll("#error");
  
      const nameRegex = /^[a-zA-Z]+$/;
      const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,6}$/;
  
      // Clear errors
      errorHandling.forEach((error) => (error.textContent = ""));
      [firstName, lastName, email, message].forEach((input) => {
        input.classList.remove("border-red-500");
        input.classList.add("border-black");
      });
  
      let isValid = true;
  
      // Validate fields
      if (!firstName.value.trim()) {
        showError(firstName, errorHandling[0], "Enter first name");
        isValid = false;
      } else if (!nameRegex.test(firstName.value)) {
        showError(firstName, errorHandling[0], "First name must only contain letters");
        isValid = false;
      }
  
      if (!lastName.value.trim()) {
        showError(lastName, errorHandling[1], "Enter last name");
        isValid = false;
      } else if (!nameRegex.test(lastName.value)) {
        showError(lastName, errorHandling[1], "Last name must only contain letters");
        isValid = false;
      }
  
      if (!email.value.trim()) {
        showError(email, errorHandling[2], "Enter email address");
        isValid = false;
      } else if (!emailRegex.test(email.value)) {
        showError(email, errorHandling[2], "Enter a valid email address");
        isValid = false;
      }
  
      if (!message.value.trim()) {
        showError(message, errorHandling[3], "Message cannot be empty");
        isValid = false;
      }
  
      if (isValid) {
        [firstName, lastName, email, message].forEach((input) => {
          input.value = "";
          input.classList.remove("border-red-500");
        });
  
        showSuccessAnimation();
      }
    });
  }
  
  function showError(input, errorHandling, message) {
    input.classList.add("border-red-500");
    input.classList.remove("border-black");
    errorHandling.textContent = message;
    errorHandling.classList.add("text-red-500");
  }
  
  function showSuccessAnimation() {
    const form = document.querySelector("form");
    const originalForm = form.innerHTML; 
  
    form.innerHTML = `
      <div class="flex flex-col items-center gap-4 animate-fade-in">
        <div class="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.2l-4.2-4.2L3 12l6 6 12-12-1.4-1.4L9 16.2z" />
            </svg>
        </div>
        <h2 class="text-xl font-semibold text-green-600">Form submitted successfully!</h2>
        <p class="text-gray-500 text-sm">Thank you for reaching out. We'll get back to you shortly!</p>
      </div>
    `;
  
    setTimeout(() => {
      form.innerHTML = originalForm; 
      attachEventListener(); 
    }, 4000);
  }
  
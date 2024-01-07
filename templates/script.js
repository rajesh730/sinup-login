window.addEventListener("DOMContentLoaded", () => {
  const line = document.querySelector(".password_strength .line");
  const text = document.querySelector(".password_strength .text");
  const passwordField = document.querySelector('input[name="password"]');
  const passwordStrengthBox = document.querySelector(".password_strength_box");

  // Hide strength box initially
  passwordStrengthBox.style.display = "none";

  passwordField.addEventListener("input", () => {
    const password = passwordField.value;

    if (password.length === 0) {
      passwordStrengthBox.style.display = "none";
    } else {
      passwordStrengthBox.style.display = "flex";

      let strength = 0;

      // Check for conditions and increase strength
      if (password.length >= 8) strength += 20;
      if (password.match(/[A-Z]/)) strength += 20;
      if (password.match(/[a-z]/)) strength += 20;
      if (password.match(/[0-9]/)) strength += 20;
      if (password.match(/[!@#$%^&*]/)) strength += 20;

      // Update line width and strength text based on the strength
      if (strength <= 40) {
        line.style.width = "40%";
        line.style.backgroundColor = "red";
        text.style.color = "red";
        text.innerHTML = "Weak";
      } else if (strength <= 80) {
        line.style.width = "80%";
        line.style.backgroundColor = "#e9ee30";
        text.style.color = "#e9ee30";
        text.innerHTML = "Medium";
      } else {
        line.style.width = "100%";
        line.style.backgroundColor = "#2ccc2c";
        text.style.color = "#2ccc2c";
        text.innerHTML = "Strong";
      }
    }
  });
});

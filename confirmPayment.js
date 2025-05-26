document.addEventListener("DOMContentLoaded", () => {
  const payButton = document.getElementById("pay-button");

  // Enable button if all required fields are filled
  const requiredInputs = document.querySelectorAll("#first-name, #last-name, #phone-number, #email, input[name='payment-method']");
  requiredInputs.forEach(input => {
    input.addEventListener("input", checkFormCompletion);
  });

  function checkFormCompletion() {
    const isFormComplete = Array.from(requiredInputs).every(input => {
      if (input.type === "radio") {
        const radios = document.querySelectorAll(`input[name="${input.name}"]`);
        return Array.from(radios).some(radio => radio.checked);
      }
      return input.value.trim() !== "";
    });
    payButton.disabled = !isFormComplete;
  }

  // handle Pay Now button click
  payButton.addEventListener("click", () => {
    alert("Your payment has been received. Thank you for your purchase!");
    window.location.href = "LandingPage.html";
  });
});

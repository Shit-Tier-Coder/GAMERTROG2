// script.js
document.addEventListener('DOMContentLoaded', function() {
  const form = document.querySelector('form[action*="formspree"]');
  const customRadio = document.getElementById('amountCustom');
  const customContainer = document.getElementById('customAmountContainer');
  const customAmountInput = document.getElementById('customAmount');
  const formSuccess = document.getElementById('formSuccess');
  
  // Custom amount toggle
  if (customRadio) {
    customRadio.addEventListener('change', function() {
      if (this.checked) {
        customContainer.style.display = 'block';
        customAmountInput.required = true;
      } else {
        customContainer.style.display = 'none';
        customAmountInput.required = false;
      }
    });
  }
  
  // Hide custom amount if other amounts are selected
  const allRadios = document.querySelectorAll('input[name="donationAmount"]');
  allRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.id !== 'amountCustom') {
        customContainer.style.display = 'none';
        customAmountInput.required = false;
      }
    });
  });
  
  // Formspree submission handling
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitButton = form.querySelector('button[type="submit"]');
      const originalText = submitButton.innerHTML;
      
      // Show loading state
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
      submitButton.disabled = true;
      
      try {
        const formData = new FormData(form);
        
        // If custom amount is selected, use that value
        if (customRadio.checked && customAmountInput.value) {
          formData.set('donationAmount', `$${customAmountInput.value} (Custom)`);
        }
        
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          // Show success message
          form.style.display = 'none';
          formSuccess.style.display = 'block';
          form.reset();
        } else {
          throw new Error('Form submission failed');
        }
        
      } catch (error) {
        alert('Sorry, there was an error submitting your donation. Please try again.');
        console.error('Form submission error:', error);
      } finally {
        // Reset button state
        submitButton.innerHTML = originalText;
        submitButton.disabled = false;
      }
    });
  }
});

// Add this function at the very bottom - outside of DOMContentLoaded
function scrollToDonations() {
  setTimeout(() => {
    document.getElementById('donations').scrollIntoView({ 
      behavior: 'smooth' 
    });
  }, 300);
}

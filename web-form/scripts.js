document.addEventListener('DOMContentLoaded', 
  function() {

    // find our input for phone by its ID
    const leadForm = document.querySelector('form');
    const phoneInputField = document.querySelector("#phone");
    const emailField = document.querySelector('#email'); // <-- find an email field
    const emailErrorElement = document.querySelector('#email-error'); // find our field for error

// initialize library on this field
//we saved the result in a variable phoneInput to use it for validation
const phoneInput = window.intlTelInput(phoneInputField, {
  // function for format logic and validation of numbers
  utilsScript:
  "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/19.5.6/js/utils.js",
  // automatically select user's country by IP
  initialCountry: "auto",
  geoIpLookup: function(callback) {
    fetch("https://ipapi.co/json")
      .then(res => res.json())
      .then(data => callback(data.country_code))
      .catch(() => callback("us"));
  
  },
});

//check valid Email
function isValidEmail(email) {
  const emailRegex = new RegExp(
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  );
  if (!emailRegex.test(email)) {
    return false; // if the format is incorrect - exit
  }
  const domain = email.split('@')[1];
  const forbiddenDomains = ['test.com', 'example.com', 'test.ru', 'mail.com','letterprotect.net'];
  if (forbiddenDomains.includes(domain)) {
    return false;
  }
  return true;
}
 
function timestamp() { 
  var response = document.getElementById("g-recaptcha-response"); 
  if (response == null || 
    response.value.trim() == "") {
    var elems = 
    JSON.parse(document.getElementsByName("captcha_settings")[0].value);
    elems["ts"] = JSON.stringify(new Date().getTime());
    document.getElementsByName("captcha_settings")[0].value = JSON.stringify(elems); 
  } 
} 
    setInterval(timestamp, 500); 

    // validation in real time for email
  
        emailField.addEventListener('input', function() {
               if (isValidEmail(emailField.value)) {
                  emailField.classList.remove('error');
                  emailErrorElement.classList.remove('visible');
               } else {
                emailField.classList.add('error');
                emailErrorElement.classList.add('visible');
               }
          });
              
    // add listener for send event form
    leadForm.addEventListener('submit', function(event) {
        // check reCaptcha
        const recaptchaResponse = grecaptcha.getResponse();
        if (recaptchaResponse.length == 0) {
    alert('Please confirom that you are human.');
    event.preventDefault(); // <-- cancel form submission
    return;
        }

        if(!phoneInput.isValidNumber()) {
          alert('Please enter a valid phone number.');
          event.preventDefault();
          return;
        }
        
        if (!isValidEmail(emailField.value)) {
          event.preventDefault();
          return;
        }
  });
  });

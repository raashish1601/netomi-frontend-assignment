document.addEventListener('DOMContentLoaded', function () {
  // get countries and states from API
  fetch(
    'https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json'
  )
    .then((response) => response.json())
    .then((data) => {
      var countries = '';
      var states = '';
      data.forEach(function (value) {
        countries +=
          "<option value='" + value.name + "'>" + value.name + '</option>';
      });
      document.querySelector('#country').innerHTML += countries;

      // populate states based on selected country
      document
        .querySelector('#country')
        .addEventListener('change', function () {
          var selectedCountry = this.value;
          data.forEach(function (value) {
            if (value.name == selectedCountry) {
              states = '';
              value.states.forEach(function (state) {
                states +=
                  "<option value='" +
                  state.name +
                  "'>" +
                  state.name +
                  '</option>';
              });
              document.querySelector('#state').innerHTML = states;
            }
          });
        });
    });

  // form validation
  document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    var name = document.querySelector('#name').value;
    var email = document.querySelector('#email').value;
    var contact = document.querySelector('#contact').value;
    var country = document.querySelector('#country').value;
    var state = document.querySelector('#state').value;
    var valid = true;
    var errorMessage = '';

    // check if name is valid
    if (name.length < 4 || name.length > 10) {
      errorMessage += '{"Name": {"erorr": "Length should be in between 4-10 characters."}} ';
      valid = false;
    }

    // check if email is valid
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      errorMessage += '{"Email": {"erorr": "Email is invalid"}} ';
      valid = false;
    }

    // check if contact number is valid
    if (contact.length != 10) {
      errorMessage += '{"Contact": {"erorr": "Contact number should be of 10 digits."}} ';
      valid = false;
    }

    // check if country and state are selected
    // check if country and state are selected
    if (country == 'Select Country' || state == 'Select State') {
      errorMessage += '{"Country": {"erorr": "Country and State are mandatory fields."}} ';
      valid = false;
    }
    // check if there are any errors
    if (!valid) {
      // send error message to parent window
      parent.postMessage({ type: 'error', message: errorMessage }, '*');
    } else {
      // send success message to parent window
      parent.postMessage(
        { type: 'success', message: 'All fields are valid!' },
        '*'
      );
    }
  });
});

// main.js
window.addEventListener('message', function (e) {
  var messageDiv = document.querySelector('#message');
  if (e.data.type === 'error') {
    messageDiv.innerHTML = e.data.message;
    messageDiv.style.color = 'red';
    messageDiv.style.textAlign = 'center';
  } else if (e.data.type === 'success') {
    messageDiv.innerHTML = e.data.message;
    messageDiv.style.color = 'green';
    messageDiv.style.textAlign = 'center';
  }
});

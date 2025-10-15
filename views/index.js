let contactForm = document.querySelector(".contact-form");
let name = document.getElementById("name");
let email = document.getElementById("emailAddr");
let emailCheck = document.getElementById("email");
let message = document.getElementById("message");
let send = document.getElementById("send-btn");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let formData = {
    name: name.value,
    email: email.value,
    message: message.value,
  };
  send.value = "Sending Message...";
  if (emailCheck.value == "") {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/sendmail");
    xhr.setRequestHeader("content-type", "application/json");
    xhr.onload = () => {
      if (xhr.responseText == "success") {
        name.value = "";
        email.value = "";
        message.value = "";
        send.value = "Message Sent Successfully!";
        $('.toast').toast('show')
      } else {
        send.value = "Something Went Wrong!";
      }
    };
    xhr.send(JSON.stringify(formData));
  }else{
    send.value = "Something Went Wrong!";
    console.log("failed");
  }
});




window.onload = () => {
  var alertDialog = document.getElementById("alertDialog");
  var confirmDialog = document.getElementById("confirmDialog");
  var promptDialog = document.getElementById("promptDialog");
  var outputDiv = document.getElementById("outputDiv");
  var output = document.getElementById("output");
  var nameInput = document.getElementById("name-input");


  // Alert
  alertFunc = () => alertDialog.showModal();
  alertHandler = () => alertDialog.close();


  // Confirm
  confirmFunc = () => {
    clearOutput();
    confirmDialog.showModal();
  }
  confirmHandler = response => {
    setupOutput();
    output.innerHTML = `Confirm result : ${response}`;
    confirmDialog.close();
  }


  // Prompt
  promptFunc = () => {
    clearOutput();
    promptDialog.showModal();
    nameInput.focus();
  }

  promptHandler = response => {
    setupOutput();
    if (response) {
      response = DOMPurify.sanitize(nameInput.value);
      nameInput.value = "";
    } else {
      response = "User didn't enter anything";
    }
    output.innerHTML = `Prompt result : ${response}`;
    promptDialog.close();
  }


  // Output
  clearOutput = () => {
    outputDiv.classList.remove("divStyle");
    output.style.display = "none";
  }

  setupOutput = () => {
    outputDiv.classList.add("divStyle");
    output.style.display = "block";
  }
}
(function (document, localStorage) {

   var extEnabled = localStorage.extEnabled ? JSON.parse(localStorage.extEnabled) : false

   // Manipulating button text
   var btn = document.getElementsByClassName("btn")[0]
   if (extEnabled) {
      btn.innerText = "Click here to Disable"
   } else {
      btn.innerText = "Click here to Enable"
   }

   // Adding onClick Handler for Toggling Enable or disable
   btn.onclick = function () {
      if (extEnabled) {
         extEnabled = false
         localStorage.extEnabled = extEnabled
         btn.innerText = "Click here to Enable"
      } else {
         extEnabled = true
         localStorage.extEnabled = extEnabled
         btn.innerText = "Click here to Disable"
      }
   }

})(document, localStorage)
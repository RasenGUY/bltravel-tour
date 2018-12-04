//  convert tags of HTML string into Text

let transFromText = () => {
  document.querySelectorAll(".transformText").forEach((text)=>{
  text.innerHTML = text.textContent
  })
}
let changeColorOfBold = () => {
  // theme color --> green
  $("b").css("color", "#4F9E1E");
}
transFromText();
changeColorOfBold();

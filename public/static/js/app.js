//  convert tags of HTML string into Text

let transformText = () => {
  document.querySelectorAll(".transformText").forEach((text)=>{
  text.innerHTML = text.textContent
  })
}
let changeColorOfBold = () => {
  // theme color --> green
  $("b").css("color", "#4F9E1E");
  $("strong").css("color", "#4F9E1E");
}
transformText();
changeColorOfBold();

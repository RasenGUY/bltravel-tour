let transformText=()=>{document.querySelectorAll(".transformText").forEach((text)=>{text.innerHTML=text.textContent})}
let changeColorOfBold=()=>{$("b").css("color","#4F9E1E");$("strong").css("color","#4F9E1E");}
transformText();changeColorOfBold();
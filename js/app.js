const addNBSPToString = (str) => str.replace(
  / ([a-zA-Z]) /g,
  ' $1' + '\u00A0'
);

function addNBSPToAll() {
  Query.all(".add-nbsp").forEach(element => {
    element.innerText = addNBSPToString(element.innerText)
  })
}


document.addEventListener("mouseover", (e) => {
 
  if(e.target.closest(".navlink, .header--logo")) {
    let rect = e.target.closest(".navlink, .header--logo").getBoundingClientRect()
    Q("header .header--border-bottom").style.left = rect.x + "px"
    Q("header .header--border-bottom").style.width = rect.width + "px"
    Q("header .header--border-bottom").style.opacity = "1.0"
    
  }
  else {
    Q("header .header--border-bottom").style.left = ""
    Q("header .header--border-bottom").style.width = ""
    Q("header .header--border-bottom").style.opacity = ""
  }
  
})
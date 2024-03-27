//search query parsing
function init() {

  /* Process the URL search */
  let searchQuery = window.location.search.replace("?", "")
  let pairs = searchQuery.split("+")
  pairs.forEach(pair => {
    let [key, value] = pair.split("=")
    
    switch(key) {
      case "project": {
        //display a specific project
        break
      }
    }
  })
}
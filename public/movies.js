window.onload = () => {
  // Variables
  let movieDialog = document.getElementById("movieDialog");
  let inputTitle = document.getElementById("title");
  let inputYear = document.getElementById("year");
  let inputRating = document.getElementById("rating");
  let noMovies = document.getElementById("noMovies");
  let movieList = document.getElementById("movieList");
  let movies = [
    ["Star Wars", 1977, "PG"],
    ["The Empire Strikes Back", 1980, "PG"],
    ["The Revenge of the Jedi", 1983, "PG"]
  ];
  let toDelete;
  let toEdit;
  var key = 1;
  const items = {...localStorage};


  // Functions
  checkList = () => noMovies.style.display = (movieList.childElementCount == 0) ? "inline-block" : "none";

  edit = obj => {
    movieDialog.showModal();
    let movieInfo = obj.textContent.split(" (");
    let title = movieInfo[0];
    movieInfo = movieInfo[1].split(") - Rated: ");
    let year = movieInfo[0];
    movieInfo = movieInfo[1].split("EditDelete");
    let rating = movieInfo[0];
    
    inputTitle.value = title;
    inputYear.value = year;
    inputRating.value = rating;
    toEdit = obj;
  }

  deleteConfirm = () => {
    localStorage.removeItem(toDelete.getAttribute('data-key'), toDelete);
    toDelete.remove();
    checkList();
    deleteDialog.close();
  }

  del = obj => {
    deleteDialog.showModal();
    toDelete = obj;
  }

  addButton = (obj, buttonId, buttonTxt) => {
    let btn = document.createElement("BUTTON");
    btn.setAttribute("id", buttonId);
    if (buttonTxt == "Edit") {
      btn.addEventListener("click", function() { edit(obj) });
    } else {
      btn.addEventListener("click", function() { del(obj) });
    }
    let btnTxt = document.createTextNode(buttonTxt);
    btn.appendChild(btnTxt);
    return btn;
  }
  
  createMovie = movieTxt => {
    let movieEl = document.createElement("LI");
    movieEl.appendChild(document.createTextNode(movieTxt));
    movieEl.appendChild(addButton(movieEl, "edit", "Edit"));
    movieEl.appendChild(addButton(movieEl, "delete", "Delete"));
    movieEl.setAttribute('data-key', key);
    key = key + 1;
    document.getElementById("movieList").appendChild(movieEl);
    return movieEl;
  }

  resetMovieDialog = () => {
    inputTitle.value = "";
    inputYear.value = "";
    inputRating.value = "G";
  }

  addMovie = () => {
    resetMovieDialog();
    movieDialog.showModal();
  }

  cancel = id => {
    document.getElementById(id).close();
    toDelete = null;
  }

  save = () => {
    // Get values
    let title = inputTitle.value;
    let year = parseInt(inputYear.value);
    let rating = inputRating.value;

    if (toEdit == null) {
      // Create movie
      let movie = [title, year, rating];
      movies.push(movie);
      createMovie(movie[0] + " (" + movie[1] + ") - Rated: " + movie[2]);
    } else {
      // Update movie
      toEdit.innerText = title + " (" + year + ") - Rated: " + rating;
      toEdit.appendChild(addButton(toEdit, "edit", "Edit"));
      toEdit.appendChild(addButton(toEdit, "delete", "Delete"));
      toEdit = null;
    }

    // Clean up
    cancel("movieDialog");
    checkList();
  }


  // Render
  for (let i = 0; i < movies.length; i++) {
    let name = movies[i][0] + " (" + movies[i][1] + ") - Rated: " + movies[i][2];
    localStorage.setItem(key, createMovie(name));
  }

  checkList();
}
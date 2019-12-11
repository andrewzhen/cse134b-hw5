window.onload = () => {

  let allItemsToPop=[];

  retrieveAllWishes=() => {
    const xhr= new XMLHttpRequest()

    const retrieveUrl= "http://fa19server.appspot.com/api/wishlists/myWishlist?access_token="+
            localStorage.getItem("access_token")

    xhr.open ('GET', retrieveUrl, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange= () => {
      if(xhr.readyState== 4 && xhr.status== 200){
        allWishes= JSON.parse(xhr.responseText);

        for(let i=0; i<allWishes.wishItems.length; i++){
          let currWish= allWishes.wishItems[i]
          //allItemsToPop.push(currWish)
          //item, price, category, img, comment
          createItem(currWish.item, currWish.price, currWish.category, currWish.img, currWish.comment);
        }
      } else if (xhr.readyState == 4 && xhr.status== 401){
        alert("You must be logged in to see your list")
      }
    }

    xhr.send()
  }

  retrieveAllWishes()
  

  // Variables
  let wishList = document.getElementById("wishList");
  let itemDialog = document.getElementById("itemDialog");
  let inputItem = document.getElementById("item");
  let inputPrice = document.getElementById("price");
  let inputCategory = document.getElementById("category");
  let inputImage = document.getElementById("image");
  let inputComment = document.getElementById("comment");
  // let items = [
  //   ["Orange", 1, "Fruit", "orange.png", "naval pls"],
  //   ["Apple", 1, "Fruit", "apple.png", "fuji pls"],
  //   ["Banana", 1, "Fruit", "none.png", ""],
  // ]
  let toDelete;
  let toEdit;
  let imgToRender;
  
  // Functions
  checkList = () => noItems.style.display = (wishList.childElementCount == 0) ? "inline-block" : "none";

  edit = obj => {
    itemDialog.showModal();
    inputItem.value = obj.childNodes[1].childNodes[0].innerText;
    inputPrice.value = obj.childNodes[1].childNodes[1].innerText.split("$")[1];
    inputCategory.value = obj.childNodes[1].childNodes[2].innerText.split("Category: ")[1];
    inputComment.value = obj.childNodes[1].childNodes[3].innerText.split("Comment: ")[1];
    toEdit = obj;
  }

  deleteConfirm = () => {
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
    if(buttonTxt == "Edit") {
      btn.addEventListener("click", function() { edit(obj) });
    } else {
      btn.addEventListener("click", function() { del(obj) });
    }
    let btnTxt = document.createTextNode(buttonTxt);
    btn.appendChild(btnTxt);
    btn.classList.add("btn");
    btn.classList.add("modifyBtns");
    return btn;
  }

  getImg = src => {
    let img = document.createElement("IMG");
    img.src = src;
    img.width = "250";
    img.style.boxShadow = "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)";
    img.style.padding = "100px";
    return img;
  }
  function renderImg(input, display) {
    var reader;
  
    if (input.files && input.files[0]) {
      reader = new FileReader();
  
      reader.onload = function(e) {
        display.setAttribute('src', e.target.result);
      }
  
      reader.readAsDataURL(input.files[0]);
    }
  }

  createItem = (item, price, category, img, comment) => {
    let itemEl = document.createElement("LI");
    let itemDiv = document.createElement("DIV");
    itemDiv.style.marginBottom = "5vw";

    // Item
    let itemNode = document.createElement("P");
    itemNode.appendChild(document.createTextNode(item));
    itemNode.style.fontSize = "2rem";
    itemDiv.appendChild(itemNode);

    // Price
    let priceNode = document.createElement("P");
    priceNode.appendChild(document.createTextNode(` $${price} `));
    priceNode.style.fontSize = "1.5rem";
    itemDiv.appendChild(priceNode);

    // Category
    let categoryNode = document.createElement("P");
    categoryNode.appendChild(document.createTextNode(` Category: ${category} `));
    itemDiv.appendChild(categoryNode);
    
    // Comment
    let commentNode = document.createElement("P");
    commentNode.appendChild(document.createTextNode(` Comment: ${comment} `));
    itemDiv.appendChild(commentNode);

    itemDiv.appendChild(addButton(itemEl, "edit", "Edit"));
    let del = addButton(itemEl, "delete", "Delete");
    del.classList.add("delete");
    itemDiv.appendChild(del);

    // Image
    let imgNode = getImg(img);
    if (imgToRender) {
      renderImg(imgToRender, imgNode);
    }

    // Divider
    hrNode = document.createElement("HR");
    itemDiv.appendChild(hrNode);
    
    itemEl.append(imgNode);
    itemEl.appendChild(itemDiv);
    wishList.appendChild(itemEl);
    return itemEl;
  }

  resetItemDialog = () => {
    inputItem.value = inputPrice.value = inputCategory.value = inputImage.value = inputComment.value = "";
  }

  addItem = () => {
    resetItemDialog();
    itemDialog.showModal();
  }

  cancel = id => {
    document.getElementById(id).close();
    toDelete = null;
  }

  save = () => {
    // Get values
    let item = inputItem.value;
    let price = inputPrice.value;
    let category = inputCategory.value;
    let image = inputImage.value;
    let comment = inputComment.value;

    if (toEdit == null) {
      // Create item
      let wishItem = [item, price, category, image, comment];
      //items.push(wishItem);
      createItem(wishItem[0], wishItem[1], wishItem[2], wishItem[3], wishItem[4]);
      console.log(wishItem)

      handleNewItem(wishItem);
    } else {
      // Update item
      let itemInfo = toEdit.childNodes[1];
      itemInfo.childNodes[0].innerText = item;
      itemInfo.childNodes[1].innerText = `$${price}`;
      itemInfo.childNodes[2].innerText = `Category: ${category}`;
      toEdit.childNodes[0] = getImg(image);
      if (imgToRender) {
        renderImg(imgToRender, toEdit.childNodes[0]);
      }
      itemInfo.childNodes[3].innerText = `Comment: ${comment}`;
      toEdit = null;
    }

    // Clean up
    cancel("itemDialog");
    checkList();
  }

  // Event Listeners
  inputImage.addEventListener("change", function() {
    imgToRender = this;
  });

  // // Render
  // for (let i = 0; i < items.length; i++) {
  //   createItem(items[i][0], items[i][1], items[i][2], items[i][3], items[i][4]);
  // }

  checkList();

  //Sending WishList Item to the server
  handleNewItem = (wishItem) => {
    const xhr= new XMLHttpRequest();

    const url= "http://fa19server.appspot.com/api/wishlists?access_token="+localStorage.getItem('access_token');
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange= () => {
      if(xhr.readyState==4 && xhr.status== 200){
        console.log("Item Added To The Server")
        console.log(xhr.responseText)
      }else if (xhr.readyState== 4 && xhr.status!= 200){
        console.log("Unable to add item to wishlist")
      }
    }

    let item=wishItem[0]
    let price= wishItem[1]
    let category= wishItem[2]
    let image= wishItem[3]
    let comment= wishItem[4]

    let payload= `item=${item}&price=${price}&category=${category}&image=${image}&comment=${comment}`

    xhr.send(payload)
  }

  //Logout
  document.getElementById('logout').addEventListener('click', ()=> {

    console.log(localStorage.getItem("access_token"));

    const access_token= localStorage.getItem('access_token');
    const url= "http://fa19server.appspot.com/api/Users/logout?access_token="+access_token;
    console.log(url)

    const xhr= new XMLHttpRequest()
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
      if( xhr.readyState==4 && xhr.status== 204){
        console.log("Logout Processed");

        window.location.href="./login.html"
      }else if(xhr.readyState==4 && xhr.status == 401){
        console.log("Authorization Issue")
      }
    }

    xhr.send();
  })
}
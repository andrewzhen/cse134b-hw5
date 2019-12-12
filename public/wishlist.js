window.onload = () => {

  document.getElementById('username').innerHTML= localStorage.getItem('username');
  retrieveAllWishes=() => {
    const xhr= new XMLHttpRequest()

    const retrieveUrl= "http://fa19server.appspot.com/api/wishlists/myWishlist?access_token="+
            localStorage.getItem("access_token")

    xhr.open ('GET', retrieveUrl, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    if(!localStorage.getItem('access_token')){
      console.log("Unable to retrieve access token")
    }
    xhr.onreadystatechange= () => {
      if(xhr.readyState== 4 && xhr.status== 200){
        allWishes= JSON.parse(xhr.responseText);

        if(allWishes.wishItems.length==0){
          checkList();
        }else{
          for(let i=0; i<allWishes.wishItems.length; i++){
            let currWish= allWishes.wishItems[i]
            //allItemsToPop.push(currWish)
            //item, price, category, img, comment
            createItem(currWish.item, currWish.price, currWish.category, currWish.image, currWish.comment, currWish.id);
        }
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
  let toDelete;
  let toEdit;
  let imgUrl;
  let imgToRender;

  // Cloundinary
  var CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dhn2vey6h/upload';
  var CLOUDINARY_UPLOAD_PRESET = 'cpxjan92';

  inputImage.addEventListener('change', (e) => {
    imgToRender = this;
    
    var file = e.target.files[0];
    var formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    axios({
      url: CLOUDINARY_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: formData
    }).then(function(res) { 
      imgUrl= "https://res.cloudinary.com/dhn2vey6h/image/fetch/"+res["data"]["url"];
      console.log(imgUrl);
      // display.src = res.data.secure_url;
    }).catch(function(err) {
      console.error(err);
    });
  });
  
  // Functions
  checkList = () => {
    noItems.style.display = (wishList.childElementCount == 0) ? "inline-block" : "none";
    noItems.innerHTML = "No items currently wished"
  }

  edit = obj => {
    itemDialog.showModal();
    inputItem.value = obj.childNodes[1].childNodes[0].innerText;
    inputPrice.value = obj.childNodes[1].childNodes[1].innerText.split("$")[1];
    inputCategory.value = obj.childNodes[1].childNodes[2].innerText.split("Category: ")[1];
    inputComment.value = obj.childNodes[1].childNodes[3].innerText.split("Comment: ")[1];
    toEdit = obj;
  }

  deleteConfirm = () => {

    //checkWish(toDelete.getAttribute('data-id'));
    handleDelete(toDelete.getAttribute('data-id'));
    toDelete.remove();
    checkList();
    deleteDialog.close();
  }

  handleDelete= deleteId => {

    
    const xhr= new XMLHttpRequest();
    const url= `http://fa19server.appspot.com/api/wishlists/${deleteId}?access_token=${localStorage.getItem('access_token')}`

    xhr.open('DELETE',url,true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
    xhr.onreadystatechange=()=>{
      if(xhr.readyState==4 && xhr.status == 200){
        console.log("Deletion Processed")
      } else if (xhr.readyState == 4 && xhr.status== 401){
        alert("You must be logged in to delete items")
      } else if(xhr.readyState == 4 && xhr.status == 422){
        alert("Bad Input. Please Retry")
      }
    }

    xhr.send();
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
    if (!src) {
      img.src = "https://res.cloudinary.com/dhn2vey6h/image/upload/v1576109558/xvgtgtfuqrysqjkxmqgo.png";
    } else { 
      img.src = src;
    }
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

  createItem = (item, price, category, img, comment, id) => {
    let itemEl = document.createElement("LI");
    itemEl.setAttribute('data-id', id)
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
    if(!inputItem.value) {
      alert("Please give this item a name");
      console.log("User tried to save changes without providing item name");
    } else if (!inputImage.value) {
      alert("Please give this item an image");
      console.log("User tried to save changes without providing item image");
    } else {
      console.log(inputImage.value);
      // Get values
      let item = inputItem.value;
      let price = inputPrice.value;
      let category = inputCategory.value;
      let image = imgUrl;
      let comment = inputComment.value;

      //Trying to save a new wish
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

        //when i click on the delete button

        //send edited item to the server
        const xhr= new XMLHttpRequest()
        const url= `http://fa19server.appspot.com/api/wishlists/${toEdit.getAttribute(
          'data-id')}/replace?access_token=${localStorage.getItem('access_token')}`

        xhr.open('POST', url, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
        xhr.onreadystatechange=()=>{
          if(xhr.readyState==4 && xhr.status==200){
            console.log("Your item has been edited")
          } else if(xhr.readyState==4 && xhr.status== 401){
            alert("Must be logged in to authorize changes")
          } else if (xhr.readyState==4 && xhr.status ==422){
            alert ("Unable to process request, check input.")
          }
        }

        let payload= `item=${item}&price=${price}&category=${category}&image=${imgUrl}&comment=${comment}`;

        xhr.send(payload)
      }

      // Clean up
      cancel("itemDialog");
      checkList();
    }
  }

  // // Render
  // for (let i = 0; i < items.length; i++) {
  //   createItem(items[i][0], items[i][1], items[i][2], items[i][3], items[i][4]);
  // }



  //Sending WishList Item to the server
  handleNewItem = (wishItem) => {
    const xhr= new XMLHttpRequest();

    const url= "http://fa19server.appspot.com/api/wishlists?access_token="+localStorage.getItem('access_token');
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.onreadystatechange= () => {
      if(xhr.readyState==4 && xhr.status== 200){
        window.location.reload(true)
      }else if (xhr.readyState== 4 && xhr.status== 401){
        alert("You need to be logged in to add items to the wishlist")
      }else if (xhr.readyState== 4 && xhr.status==422){
        alert("Bad input. Please improvise")
      }
    }

    let item=wishItem[0]
    let price= wishItem[1]
    let category= wishItem[2]
    let image= wishItem[3]
    let comment= wishItem[4]

    console.log(image);

    let payload= `item=${item}&price=${price}&category=${category}&image=${image}&comment=${comment}`
    xhr.send(payload)
  }

  //Logout
  document.getElementById('logout').addEventListener('click', ()=> {

    const access_token= localStorage.getItem('access_token');
    const url= "http://fa19server.appspot.com/api/Users/logout?access_token="+access_token;

    const xhr= new XMLHttpRequest()
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
      if( xhr.readyState==4 && xhr.status== 204){
        console.log("Logout Processed");

        window.location.href="./login.html"
        localStorage.clear();
      }else if(xhr.readyState==4 && xhr.status == 401){
        console.log("Authorization Issue")
      }
    }

    xhr.send();
  })
}
const keys={
    googleSheetId: '',// required 
    unsplashID: '',// required
} 
//-------- using html template form----------
const formTemplate = document.getElementById("form-template");
const userInfoDiv = document.getElementById("userInfo");
const userInfoModal = document.getElementById("userInfoModal");

const userFormNode = formTemplate.content.cloneNode(true);// for home page form
const userModalForm = formTemplate.content.cloneNode(true); // for contact modal 
userInfoDiv.appendChild(userFormNode);
userInfoModal.appendChild(userModalForm);
//---------------

const menuDiv= document.getElementsByTagName("nav")
const toggleDiv= document.getElementsByClassName('toggle');
const counterDiv = document.getElementById('countDown');

const imgModal = document.getElementById('imgModal');
const modalImg = document.getElementById("modalImg");
const spanCloseImg = document.getElementsByClassName("closeImgModal")[0];
const contactModal = document.getElementById("contactModal");


const scriptURL = `https://script.google.com/macros/s/${keys.googleSheetId}/exec`

const modal = document.getElementById("sucessModal");
const span = document.getElementsByClassName("close")[0];

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
  if(event.target == contactModal){
    contactModal.style.display = "none";
  }
}

const toggleNav =()=>{
    menuDiv[0].children[2].classList.toggle('active-menu');
    toggleDiv[0].classList.toggle('active');
}

const checkForUpperCase=(passWrd)=>{
    return (passWrd !== passWrd.toLowerCase());
}


function validateForm(formName) {
    let form = document.forms[formName];
    let name = document.forms[formName]["name"]? document.forms[formName]["name"].value : "";
    let email = document.forms[formName]["email"]?document.forms[formName]["email"].value : "";
    let passWrd = document.forms[formName]["passWord"]?document.forms[formName]["passWord"].value : "";
    let resetpassWrd = document.forms[formName]["resetPassWord"]?document.forms[formName]["resetPassWord"].value : "";
    let errorDiv = form.children[1].children[2];
    errorDiv.innerHTML="";
    
    if (name === "" || email === "" || passWrd === "" || resetpassWrd === "") {
        errorDiv.innerHTML = `*${(name?'':'User name ,')} ${(email?'':'Email ,')} ${(passWrd?'':'Password ,')} ${(resetpassWrd?'':'Reset Password')} Field is required !`
        return false;
    }
    if(!name.toLowerCase().match(/[a-z|a-z0-9]/)){
        errorDiv.innerHTML = `*No Spaces or Special Characters allowed in User name`
        return false;
    }
    if(!email.match(/\S+@\S+\.\S+/)){
        errorDiv.innerHTML = `*Email format is not accurate`
        return false;
    }
    if(!(passWrd.length>=10 && checkForUpperCase(passWrd) && passWrd.match(/[!|@|#|$|%|^|&|*]/))){
        errorDiv.innerHTML = `*Password Should be at-least 10 Char long , At-least one special char & one UPPERCASE char`
        return false;
    }
    if(resetpassWrd !== passWrd){
        errorDiv.innerHTML = `*reset password doesn't match with password`
        return false;
    }
    fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: new FormData(form)})
        .then(response => {
            console.log(response);
        })
        .catch(error => console.error('Error!', error.message))
    modal.style.display = "block";
    startCountDown();
    return false;
}

const startCountDown=()=>{
    let counter = 8;
    let timer = setInterval(function(){
        if(counter == 0){
            clearInterval(timer);
            window.location.reload();
        }
        counterDiv.innerHTML = counter;
        counter -= 1;
    }, 1000);
}


// ------------------------------ Image search section------------------------------

spanCloseImg.onclick = function() { 
    imgModal.style.display = "none";
}

function debounce(fun, delay){
    let timeOut;
    return (...args) => {
      if (timeOut) { // clearing setTimeout of prev. click in case user clicks again 
        clearTimeout(timeOut);
      }
      timeOut = setTimeout(() => {
        fun(...args);
      }, delay);
    };
}

const processChange = debounce((e) => search(e),1500);

async function search(e){
    let inputVal = e.target.value;
    let url = `https://api.unsplash.com/search/photos?query=${inputVal}&client_id=${keys.unsplashID}`
    let ImgData = await fetch(url)
        .then(response => response.json())
        .then(data => {
            return data.results;
        });
    mapData(ImgData);
}

function mapData(data){
    let smallImgDiv = document.getElementById("small_img");

    smallImgDiv.innerHTML="";

    data.forEach(({urls})=>{
        let node = document.createElement("IMG");
        node.src = urls.thumb; 

        node.onclick = function(){ // add onclick event and data for full image modal
            display_modal(urls.full)
        };
        smallImgDiv.appendChild(node);
    })
}

function display_modal(src){

    imgModal.style.display = "flex";
    modalImg.src = src;
    modalImg.alt = this.alt;
    
}

// contact section--------------------------------------------------

const openForm=()=>{
    contactModal.style.display = "block";
}
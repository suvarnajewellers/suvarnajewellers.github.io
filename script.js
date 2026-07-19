document.addEventListener("DOMContentLoaded", function(){


/* ================= MOBILE MENU ================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");


if(menuToggle && navLinks){

    menuToggle.addEventListener("click", function(){

        navLinks.classList.toggle("active");

    });

}



/* ================= SCROLL TOP ================= */

const scrollBtn = document.getElementById("scrollTopBtn");


if(scrollBtn){

window.addEventListener("scroll", function(){

    if(window.scrollY > 300){

        scrollBtn.style.display="block";

    }else{

        scrollBtn.style.display="none";

    }

});


scrollBtn.addEventListener("click", function(){

    window.scrollTo({

        top:0,
        behavior:"smooth"

    });

});


}



/* ================= IMAGE POPUP ================= */


document.addEventListener("click", function(e){


if(e.target.classList.contains("gallery-img")){


let popup=document.createElement("div");

popup.className="image-popup";


popup.innerHTML=`

<span class="close-popup">
×
</span>

<img src="${e.target.src}" class="popup-image">

`;


document.body.appendChild(popup);



popup.addEventListener("click",function(event){


if(
event.target.classList.contains("close-popup") ||
event.target===popup
){

popup.remove();

}


});


}



});





/* ================= PRODUCT IMAGE THUMB ================= */


const mainImage=document.getElementById("main-image");

const thumbs=document.querySelectorAll(".thumb");


thumbs.forEach(function(thumb){


thumb.addEventListener("click",function(){


if(mainImage){

mainImage.src=this.src;

}


thumbs.forEach(function(t){

t.classList.remove("active");

});


this.classList.add("active");


});


});





/* ================= PRODUCT DATA LOADER ================= */


const productGrid=document.getElementById("product-grid");


if(productGrid){


fetch("products.json")

.then(res=>res.json())

.then(products=>{


let page=window.location.pathname;


let category="";


if(page.includes("gold")){

category="gold";

}

else if(page.includes("silver")){

category="silver";

}

else if(page.includes("rudraksha-mala")){

category="rudraksha-mala";

}

else if(page.includes("pendant")){

category="pendants";

}

else if(page.includes("bracelet")){

category="bracelets";

}



let filtered=products.filter(item=>item.category===category);



filtered.forEach(product=>{


productGrid.innerHTML += `

<div class="card">


<a href="product.html?id=${product.id}">


<img src="${product.image}"
alt="${product.name}"
class="gallery-img">


</a>


<h3>${product.name}</h3>


</div>

`;


});


});


}



});

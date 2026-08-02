/* ==========================================
   SUVARNA JEWELLERS V8
   UTILITIES.JS
========================================== */


/* ==========================
   DOM SELECTOR
========================== */

const $ = (selector) => {

    return document.querySelector(selector);

};


const $$ = (selector) => {

    return document.querySelectorAll(selector);

};



/* ==========================
   CREATE ELEMENT
========================== */

function createElement(tag, className = ""){

    const element = document.createElement(tag);

    if(className){

        element.className = className;

    }

    return element;

}



/* ==========================
   FORMAT TEXT
========================== */

function capitalize(text){

    if(!text) return "";

    return text.charAt(0).toUpperCase() + text.slice(1);

}



/* ==========================
   IMAGE CHECK
========================== */

function getImage(path){

    if(!path){

        return "assets/images/no-image.jpg";

    }

    return path;

}



/* ==========================
   WHATSAPP LINK
========================== */

function whatsappMessage(product){

    const number = "917777991118";

    const message =
`Hello Suvarna Jewellers,

I am interested in:
${product.name}

Category:
${product.category}

Please share details.`;

    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

}


/* ==========================
   LOADER
========================== */

function hideLoader(){

    const loader = document.getElementById("page-loader");


    if(loader){

        loader.style.opacity="0";

        setTimeout(()=>{

            loader.style.display="none";

        },500);

    }

}



/* ==========================
   SCROLL TOP
========================== */

function scrollToTop(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}



/* ==========================
   DEBOUNCE
========================== */

function debounce(func, delay = 300){

    let timer;


    return function(...args){

        clearTimeout(timer);


        timer = setTimeout(()=>{

            func.apply(this,args);

        },delay);

    };

}

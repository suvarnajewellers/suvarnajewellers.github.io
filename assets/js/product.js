/* ==========================================
SUVARNA JEWELLERS V8
PRODUCT.JS
========================================== */

/* ==========================
GLOBAL VARIABLES
========================== */

let currentProduct = null;
let products = [];
let productImages = [];

/* ==========================
DOM ELEMENTS
========================== */

const mainImage = document.getElementById("mainImage");
const thumbnailContainer = document.getElementById("thumbnailContainer");

const productCategory = document.getElementById("productCategory");
const productName = document.getElementById("productName");
const productDescription = document.getElementById("productDescription");

const productMetal = document.getElementById("productMetal");
const productGrossWeight = document.getElementById("productGrossWeight");
const productNetWeight = document.getElementById("productNetWeight");
const productSize = document.getElementById("productSize");

const whatsappButton = document.getElementById("whatsappButton");
const relatedProducts = document.getElementById("relatedProducts");

const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");

/* ==========================
INITIALIZE
========================== */

document.addEventListener("DOMContentLoaded", initProductPage);

async function initProductPage(){

const params = new URLSearchParams(window.location.search);  

const productId = params.get("id");  

if(!productId){  

    window.location.href = "collections.html";  
    return;  

}  

products = await getProducts();

currentProduct = products.find(product => product.id === productId);
if(!currentProduct){

window.location.href = "collections.html";  
    return;  

}  

renderProduct(currentProduct);  

renderRelatedProducts();

}

/* ==========================
   RENDER PRODUCT
========================== */

function renderProduct(product){

    productCategory.textContent = product.category || "";

    productName.textContent = product.name || "";

    productDescription.textContent = product.description || "";

    productMetal.textContent = product.metal || "-";

    productGrossWeight.textContent = product.grossWeight || "-";

    productNetWeight.textContent = product.netWeight || "-";

    productSize.textContent = product.size || "-";


    productImages = [];

    if(product.image){

        productImages.push(product.image);

    }

    if(Array.isArray(product.gallery)){

        productImages.push(...product.gallery);

    }

    productImages = [...new Set(productImages)];


    if(productImages.length){

        mainImage.src = getImage(productImages[0]);

        mainImage.alt = product.name;

    }


    createThumbnails();

    createWhatsappButton(product);

    }

/* ==========================
THUMBNAILS
========================== */

function createThumbnails(){

thumbnailContainer.innerHTML = "";  

productImages.forEach((image,index)=>{  

    const img = document.createElement("img");  

    img.src = getImage(image);  

    img.alt = currentProduct.name;  

    if(index === 0){  

        img.classList.add("active");  

    }  

    img.addEventListener("click",()=>{

    mainImage.style.opacity = "0";

    setTimeout(()=>{

        mainImage.src = getImage(image);

        mainImage.style.opacity = "1";

    },180);

    document
    .querySelectorAll("#thumbnailContainer img")
    .forEach(item=>item.classList.remove("active"));

    img.classList.add("active");

});

    thumbnailContainer.appendChild(img);  

});

}

/* ==========================
WHATSAPP BUTTON
========================== */

function createWhatsappButton(product){

    const phone =
    CONFIG.BUSINESS.phone.replace(/\D/g,"");

    const message =
`Hello SUVARNA JEWELLERS,

I am interested in this product.

Product : ${product.name}
Category : ${product.category}

Please share more details.`;

    const whatsappLink =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    /* Main Button */

    whatsappButton.href = whatsappLink;

}

/* ==========================
RELATED PRODUCTS
========================== */

function renderRelatedProducts(){

relatedProducts.innerHTML = "";  

const items = products  

.filter(item =>  

    item.category === currentProduct.category &&  

    item.id !== currentProduct.id  

)  

.slice(0,4);  


items.forEach(product=>{  

    const card = document.createElement("a");  

    card.href =  
    `product.html?id=${product.id}`;  

    card.className = "product-card";  

    card.innerHTML = `  

    <div class="card-image">  

        <img  
        src="${getImage(product.image)}"  
        alt="${product.name}"  
        loading="lazy">  

    </div>  

    <div class="card-content">  

        <h3>${product.name}</h3>  

        <p>${product.category}</p>  

    </div>  

    `;  

    relatedProducts.appendChild(card);  

});

}

/* ==========================
IMAGE LIGHTBOX
========================== */

if(mainImage){

mainImage.addEventListener("click",()=>{  

    if(!mainImage.src){  

        return;  

    }  

    lightboxImage.src = mainImage.src;  

    imageLightbox.classList.add("show");  

});

}

/* ==========================
CLOSE LIGHTBOX
========================== */

if(lightboxClose){

lightboxClose.addEventListener("click",()=>{  

    imageLightbox.classList.remove("show");  

});

}

if(imageLightbox){

imageLightbox.addEventListener("click",(event)=>{  

    if(event.target === imageLightbox){  

        imageLightbox.classList.remove("show");  

    }  

});

}

document.addEventListener("keydown",(event)=>{

if(event.key === "Escape"){  

    imageLightbox.classList.remove("show");  

}

});

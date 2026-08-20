/* =========================================================
   SUVARNA JEWELLERS
   PRODUCT.JS — FINAL VERSION
   Product Page + Source-aware Back Navigation
========================================================= */


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentProduct = null;
let products = [];
let productImages = [];
let currentImageIndex = 0;


/* =========================================================
   DOM ELEMENTS
========================================================= */

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
const callButton = document.getElementById("callButton");

const relatedProducts = document.getElementById("relatedProducts");

const imageLightbox = document.getElementById("imageLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");

const breadcrumbCategory =
    document.getElementById("breadcrumbCategory");

const productBack =
    document.querySelector(".sj-product-back");

const relatedSection =
    document.getElementById("relatedSection");


/* =========================================================
   PRODUCT SOURCE
========================================================= */

let productSource = {
    type: "collections",
    label: "Back to Collections",
    url: "collections.html"
};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initProductPage
);


async function initProductPage(){

    detectProductSource();

    updateBackNavigation();

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("id");

    if(!productId){

        showProductError(
            "Product not found",
            "No product was selected."
        );

        return;
    }


    products = await getProducts();


    if(!Array.isArray(products) || !products.length){

        showProductError(
            "Unable to load product",
            "Please try again or return to the product list."
        );

        return;
    }


    currentProduct =
        products.find(
            product =>
                String(product.id) === String(productId)
        );


    if(!currentProduct){

        showProductError(
            "Product not found",
            "The requested product could not be found."
        );

        return;
    }


    renderProduct(currentProduct);

    renderRelatedProducts();

}


/* =========================================================
   DETECT WHERE PRODUCT WAS OPENED FROM
========================================================= */

function detectProductSource(){

    /*
        Priority:

        1. Explicit ?source=ready-stock
        2. Explicit ?source=collections
        3. Referrer URL
        4. Default = Collections
    */


    const params =
        new URLSearchParams(window.location.search);

    const source =
        (params.get("source") || "")
        .toLowerCase()
        .trim();


    /* Explicit Ready Stock */

    if(
        source === "ready-stock" ||
        source === "readystock" ||
        source === "ready_stock"
    ){

        setProductSource(
            "ready-stock",
            "Back to Ready Stock",
            "ready-stock.html"
        );

        return;
    }


    /* Explicit Collections */

    if(source === "collections"){

        setProductSource(
            "collections",
            "Back to Collections",
            "collections.html"
        );

        return;
    }


    /* Detect from referrer */

    const referrer =
        document.referrer || "";

    const referrerUrl =
        referrer.toLowerCase();


    if(
        referrerUrl.includes("ready-stock.html") ||
        referrerUrl.includes("ready-stock")
    ){

        setProductSource(
            "ready-stock",
            "Back to Ready Stock",
            "ready-stock.html"
        );

        return;
    }


    /* Default */

    setProductSource(
        "collections",
        "Back to Collections",
        "collections.html"
    );

}


/* =========================================================
   SET PRODUCT SOURCE
========================================================= */

function setProductSource(
    type,
    label,
    url
){

    productSource = {
        type: type,
        label: label,
        url: url
    };

}


/* =========================================================
   UPDATE BACK NAVIGATION
========================================================= */

function updateBackNavigation(){

    if(productBack){

        productBack.href =
            productSource.url;

        productBack.innerHTML =
            `<span aria-hidden="true">←</span>
             ${productSource.label}`;
    }


    /*
       Breadcrumb
    */

    if(breadcrumbCategory){

        if(productSource.type === "ready-stock"){

            breadcrumbCategory.textContent =
                "Ready Stock";

        }else{

            breadcrumbCategory.textContent =
                "Collections";

        }

    }


    /*
       Optional collection CTA
    */

    const collectionButton =
        document.querySelector(
            ".sj-product-action-collection"
        );


    if(collectionButton){

        if(productSource.type === "ready-stock"){

            collectionButton.href =
                "ready-stock.html";

            collectionButton.textContent =
                "Back To Ready Stock";

        }else{

            collectionButton.href =
                "collections.html";

            collectionButton.textContent =
                "View More Collections";

        }

    }

}


/* =========================================================
   RENDER PRODUCT
========================================================= */

function renderProduct(product){

    if(productCategory){

        productCategory.textContent =
            product.category || "";
    }


    if(productName){

        productName.textContent =
            product.name || "Jewellery Product";
    }


    if(productDescription){

        productDescription.textContent =
            product.description ||
            "Premium jewellery design by Suvarna Jewellers.";
    }


    if(productMetal){

        productMetal.textContent =
            product.metal || "—";
    }


    if(productGrossWeight){

        productGrossWeight.textContent =
            product.grossWeight || "—";
    }


    if(productNetWeight){

        productNetWeight.textContent =
            product.netWeight || "—";
    }


    if(productSize){

        productSize.textContent =
            product.size || "—";
    }


    /*
       Product Images
    */

    productImages = [];


    if(product.image){

        productImages.push(
            product.image
        );

    }


    if(Array.isArray(product.gallery)){

        productImages.push(
            ...product.gallery
        );

    }


    /*
       Remove duplicate images
    */

    productImages =
        productImages.filter(
            (image,index,array) =>
                image &&
                array.indexOf(image) === index
        );


    currentImageIndex = 0;


    if(productImages.length){

        setMainImage(
            productImages[0],
            0
        );

    }else{

        showImageFallback();

    }


    createThumbnails();

    createWhatsappButton(product);

    createCallButton(product);

    setupMainImage();

}


/* =========================================================
   SET MAIN IMAGE
========================================================= */

function setMainImage(
    image,
    index = 0
){

    if(!mainImage){

        return;
    }


    const imagePath =
        getImage(image);


    currentImageIndex = index;


    mainImage.style.opacity = "0";


    const preloader =
        new Image();


    preloader.onload = function(){

        mainImage.src =
            imagePath;

        mainImage.alt =
            currentProduct?.name ||
            "Suvarna Jewellers Jewellery";

        mainImage.style.opacity =
            "1";

    };


    preloader.onerror = function(){

        showImageFallback();

    };


    preloader.src =
        imagePath;


    updateActiveThumbnail();

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function showImageFallback(){

    if(!mainImage){

        return;
    }


    mainImage.onerror = null;


    mainImage.src =
        getImage("");


    mainImage.alt =
        "Product image unavailable";


    mainImage.style.opacity =
        "1";

}


/* =========================================================
   CREATE THUMBNAILS
========================================================= */

function createThumbnails(){

    if(!thumbnailContainer){

        return;
    }


    thumbnailContainer.innerHTML =
        "";


    if(productImages.length <= 1){

        return;
    }


    productImages.forEach(
        (image,index)=>{

            const img =
                document.createElement("img");


            img.src =
                getImage(image);


            img.alt =
                `${currentProduct?.name || "Product"} image ${index + 1}`;


            img.loading =
                "lazy";


            img.draggable =
                false;


            img.dataset.index =
                String(index);


            img.addEventListener(
                "click",
                ()=>{

                    setMainImage(
                        image,
                        index
                    );

                }
            );


            img.addEventListener(
                "error",
                ()=>{

                    img.style.display =
                        "none";

                }
            );


            thumbnailContainer.appendChild(
                img
            );

        }
    );


    updateActiveThumbnail();

}


/* =========================================================
   ACTIVE THUMBNAIL
========================================================= */

function updateActiveThumbnail(){

    if(!thumbnailContainer){

        return;
    }


    thumbnailContainer
        .querySelectorAll("img")
        .forEach(
            (img,index)=>{

                img.classList.toggle(
                    "active",
                    index === currentImageIndex
                );

            }
        );

}


/* =========================================================
   MAIN IMAGE CLICK / LIGHTBOX
========================================================= */

function setupMainImage(){

    if(!mainImage){

        return;
    }


    mainImage.onclick =
        function(){

            if(
                !productImages.length ||
                !mainImage.src
            ){

                return;
            }


            openLightbox(
                currentImageIndex
            );

        };


    mainImage.onerror =
        function(){

            showImageFallback();

        };

}


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openLightbox(index){

    if(
        !imageLightbox ||
        !lightboxImage ||
        !productImages.length
    ){

        return;
    }


    currentImageIndex =
        Math.max(
            0,
            Math.min(
                index,
                productImages.length - 1
            )
        );


    lightboxImage.src =
        getImage(
            productImages[currentImageIndex]
        );


    lightboxImage.alt =
        currentProduct?.name ||
        "Product image";


    imageLightbox.classList.add(
        "show"
    );


    imageLightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    updateLightboxButtons();


    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE LIGHTBOX
========================================================= */

function closeLightbox(){

    if(!imageLightbox){

        return;
    }


    imageLightbox.classList.remove(
        "show"
    );


    imageLightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


/* =========================================================
   LIGHTBOX IMAGE CHANGE
========================================================= */

function changeLightboxImage(direction){

    if(productImages.length <= 1){

        return;
    }


    let nextIndex =
        currentImageIndex + direction;


    if(nextIndex < 0){

        nextIndex =
            productImages.length - 1;

    }


    if(nextIndex >= productImages.length){

        nextIndex = 0;

    }


    currentImageIndex =
        nextIndex;


    if(lightboxImage){

        lightboxImage.src =
            getImage(
                productImages[currentImageIndex]
            );
    }


    setMainImage(
        productImages[currentImageIndex],
        currentImageIndex
    );


    updateLightboxButtons();

}


/* =========================================================
   LIGHTBOX BUTTON STATE
========================================================= */

function updateLightboxButtons(){

    const hasMultiple =
        productImages.length > 1;


    if(lightboxPrev){

        lightboxPrev.style.display =
            hasMultiple ? "grid" : "none";
    }


    if(lightboxNext){

        lightboxNext.style.display =
            hasMultiple ? "grid" : "none";
    }

}


/* =========================================================
   LIGHTBOX EVENTS
========================================================= */

if(lightboxClose){

    lightboxClose.addEventListener(
        "click",
        closeLightbox
    );

}


if(lightboxPrev){

    lightboxPrev.addEventListener(
        "click",
        function(event){

            event.stopPropagation();

            changeLightboxImage(-1);

        }
    );

}


if(lightboxNext){

    lightboxNext.addEventListener(
        "click",
        function(event){

            event.stopPropagation();

            changeLightboxImage(1);

        }
    );

}


if(imageLightbox){

    imageLightbox.addEventListener(
        "click",
        function(event){

            if(
                event.target === imageLightbox
            ){

                closeLightbox();

            }

        }
    );

}


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function(event){

        if(
            !imageLightbox ||
            !imageLightbox.classList.contains("show")
        ){

            return;
        }


        if(event.key === "Escape"){

            closeLightbox();

        }


        if(event.key === "ArrowLeft"){

            changeLightboxImage(-1);

        }


        if(event.key === "ArrowRight"){

            changeLightboxImage(1);

        }

    }
);


/* =========================================================
   WHATSAPP BUTTON
========================================================= */

function createWhatsappButton(product){

    if(!whatsappButton){

        return;
    }


    let phone =
        "917777991118";


    if(
        typeof CONFIG !== "undefined" &&
        CONFIG.BUSINESS &&
        CONFIG.BUSINESS.phone
    ){

        phone =
            String(
                CONFIG.BUSINESS.phone
            ).replace(/\D/g,"");

    }


    const message =
`Hello SUVARNA JEWELLERS,

I am interested in this product.

Product : ${product.name || ""}
Category : ${product.category || ""}

Please share more details and price.`;


    whatsappButton.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

}


/* =========================================================
   CALL BUTTON
========================================================= */

function createCallButton(product){

    if(!callButton){

        return;
    }


    let phone =
        "7777991118";


    if(
        typeof CONFIG !== "undefined" &&
        CONFIG.BUSINESS &&
        CONFIG.BUSINESS.phone
    ){

        phone =
            String(
                CONFIG.BUSINESS.phone
            ).replace(/\D/g,"");

    }


    /*
       Indian number safety
    */

    if(phone.startsWith("91")){

        phone =
            phone.substring(2);

    }


    callButton.href =
        `tel:+91${phone}`;

}


/* =========================================================
   RELATED PRODUCTS
========================================================= */

function renderRelatedProducts(){

    if(!relatedProducts){

        return;
    }


    relatedProducts.innerHTML =
        "";


    if(
        !currentProduct ||
        !Array.isArray(products)
    ){

        return;
    }


    const items =
        products
        .filter(
            item =>
                String(item.id) !==
                    String(currentProduct.id)
                &&
                (
                    item.category ===
                        currentProduct.category
                    ||
                    item.metal ===
                        currentProduct.metal
                )
        )
        .slice(0,4);


    if(!items.length){

        if(relatedSection){

            relatedSection.style.display =
                "none";

        }

        return;
    }


    items.forEach(
        product => {

            const card =
                document.createElement("a");


            card.href =
                `product.html?id=${encodeURIComponent(product.id)}&source=${encodeURIComponent(productSource.type)}`;


            card.className =
                "product-card";


            const image =
                getImage(
                    product.image
                );


            const name =
                product.name ||
                "Jewellery Product";


            const category =
                product.category ||
                "";


            card.innerHTML =
`
<div class="card-image">
    <img
        src="${escapeHtml(image)}"
        alt="${escapeHtml(name)}"
        loading="lazy"
    >
</div>

<div class="card-content">
    <h3>${escapeHtml(name)}</h3>
    <p>${escapeHtml(category)}</p>
</div>
`;


            relatedProducts.appendChild(
                card
            );

        }
    );

}


/* =========================================================
   ERROR STATE
========================================================= */

function showProductError(
    title,
    message
){

    const productContent =
        document.getElementById(
            "productContent"
        );


    if(!productContent){

        return;
    }


    productContent.innerHTML =
`
<div style="
    min-height:420px;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding:40px 20px;
">

    <div style="
        color:#d4af37;
        font-size:11px;
        letter-spacing:2px;
        text-transform:uppercase;
        margin-bottom:15px;
    ">
        SUVARNA JEWELLERS
    </div>

    <h1 style="
        margin:0 0 12px;
        color:#f7f2e8;
        font-family:Cinzel,Georgia,serif;
        font-size:32px;
    ">
        ${escapeHtml(title)}
    </h1>

    <p style="
        margin:0 0 25px;
        color:rgba(247,242,232,.60);
        font-size:13px;
    ">
        ${escapeHtml(message)}
    </p>

    <a
        href="${productSource.url}"
        class="btn btn-primary"
        style="text-decoration:none;"
    >
        ${escapeHtml(productSource.label)}
    </a>

</div>
`;

}


/* =========================================================
   SAFE HTML ESCAPE
========================================================= */

function escapeHtml(value){

    return String(value ?? "")
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}

/* =========================================================
   SUVARNA JEWELLERS
   PRODUCT.JS — FINAL PREMIUM + STABLE VERSION

   Features:
   • Product loading through existing getProducts()
   • Collections / Ready Stock source-aware navigation
   • Legacy ?from= compatibility
   • Product gallery
   • Thumbnail navigation
   • Lightbox
   • Keyboard controls
   • WhatsApp CTA
   • Call CTA
   • Related Products
   • Graceful error state
   • No duplicate product-loading logic
========================================================= */


/* =========================================================
   GLOBAL STATE
========================================================= */

let currentProduct = null;
let products = [];
let productImages = [];
let currentImageIndex = 0;


/* =========================================================
   DOM REFERENCES
   Initialized AFTER DOM is ready
========================================================= */

let mainImage = null;
let thumbnailContainer = null;

let productCategory = null;
let productName = null;
let productDescription = null;

let productMetal = null;
let productGrossWeight = null;
let productNetWeight = null;
let productSize = null;

let whatsappButton = null;
let callButton = null;

let relatedProducts = null;

let imageLightbox = null;
let lightboxImage = null;
let lightboxClose = null;
let lightboxPrev = null;
let lightboxNext = null;

let breadcrumbCategory = null;
let productBack = null;
let relatedSection = null;


/* =========================================================
   PRODUCT SOURCE
========================================================= */

let productSource = {
    type: "collections",
    label: "Back to Collections",
    url: "collections.html"
};


/* =========================================================
   DOM INITIALIZATION
========================================================= */

function initializeDOMReferences(){

    mainImage =
        document.getElementById("mainImage");

    thumbnailContainer =
        document.getElementById(
            "thumbnailContainer"
        );


    productCategory =
        document.getElementById(
            "productCategory"
        );

    productName =
        document.getElementById(
            "productName"
        );

    productDescription =
        document.getElementById(
            "productDescription"
        );


    productMetal =
        document.getElementById(
            "productMetal"
        );

    productGrossWeight =
        document.getElementById(
            "productGrossWeight"
        );

    productNetWeight =
        document.getElementById(
            "productNetWeight"
        );

    productSize =
        document.getElementById(
            "productSize"
        );


    whatsappButton =
        document.getElementById(
            "whatsappButton"
        );

    callButton =
        document.getElementById(
            "callButton"
        );


    relatedProducts =
        document.getElementById(
            "relatedProducts"
        );


    imageLightbox =
        document.getElementById(
            "imageLightbox"
        );

    lightboxImage =
        document.getElementById(
            "lightboxImage"
        );

    lightboxClose =
        document.getElementById(
            "lightboxClose"
        );

    lightboxPrev =
        document.getElementById(
            "lightboxPrev"
        );

    lightboxNext =
        document.getElementById(
            "lightboxNext"
        );


    breadcrumbCategory =
        document.getElementById(
            "breadcrumbCategory"
        );


    productBack =
        document.querySelector(
            ".sj-product-back"
        );


    relatedSection =
        document.getElementById(
            "relatedSection"
        );

}


/* =========================================================
   INITIALIZE PRODUCT PAGE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initProductPage
);


async function initProductPage(){

    initializeDOMReferences();

    detectProductSource();

    updateBackNavigation();

    setupLightboxEvents();


    const params =
        new URLSearchParams(
            window.location.search
        );


    const productId =
        params.get("id");


    if(!productId){

        showProductError(
            "Product Not Found",
            "No product was selected."
        );

        return;

    }


    /* -----------------------------------------
       Existing API system ONLY
    ----------------------------------------- */

    if(
        typeof getProducts !== "function"
    ){

        console.error(
            "Suvarna Jewellers: getProducts() unavailable."
        );

        showProductError(
            "Unable to Load Product",
            "Please return to the product list and try again."
        );

        return;

    }


    try{

        products =
            await getProducts();

    }
    catch(error){

        console.error(
            "Suvarna Jewellers: Unable to load products.",
            error
        );

        showProductError(
            "Unable to Load Product",
            "Please return to the product list and try again."
        );

        return;

    }


    if(
        !Array.isArray(products) ||
        products.length === 0
    ){

        showProductError(
            "Unable to Load Product",
            "Please return to the product list and try again."
        );

        return;

    }


    currentProduct =
        products.find(
            product =>
                String(product.id) ===
                String(productId)
        );


    if(!currentProduct){

        showProductError(
            "Product Not Found",
            "The requested product could not be found."
        );

        return;

    }


    renderProduct(
        currentProduct
    );


    renderRelatedProducts();

}


/* =========================================================
   PRODUCT SOURCE DETECTION
========================================================= */

function detectProductSource(){

    const params =
        new URLSearchParams(
            window.location.search
        );


    /* -----------------------------------------
       New source parameter
    ----------------------------------------- */

    const source =
        normalizeSource(
            params.get("source")
        );


    if(source){

        applyProductSource(
            source
        );

        return;

    }


    /* -----------------------------------------
       Legacy from parameter
    ----------------------------------------- */

    const legacySource =
        normalizeSource(
            params.get("from")
        );


    if(legacySource){

        applyProductSource(
            legacySource
        );

        return;

    }


    /* -----------------------------------------
       Referrer fallback
    ----------------------------------------- */

    const referrer =
        String(
            document.referrer || ""
        ).toLowerCase();


    if(
        referrer.includes(
            "ready-stock.html"
        ) ||
        referrer.includes(
            "ready-stock"
        )
    ){

        applyProductSource(
            "ready-stock"
        );

        return;

    }


    /* -----------------------------------------
       Default
    ----------------------------------------- */

    applyProductSource(
        "collections"
    );

}


/* =========================================================
   NORMALIZE SOURCE
========================================================= */

function normalizeSource(value){

    const source =
        String(
            value || ""
        )
        .toLowerCase()
        .trim();


    if(
        source === "ready-stock" ||
        source === "readystock" ||
        source === "ready_stock"
    ){

        return "ready-stock";

    }


    if(
        source === "collections" ||
        source === "collection"
    ){

        return "collections";

    }


    return "";

}


/* =========================================================
   APPLY SOURCE
========================================================= */

function applyProductSource(
    type
){

    if(
        type === "ready-stock"
    ){

        productSource = {

            type:
                "ready-stock",

            label:
                "Back to Ready Stock",

            url:
                "ready-stock.html"

        };

        return;

    }


    productSource = {

        type:
            "collections",

        label:
            "Back to Collections",

        url:
            "collections.html"

    };

}


/* =========================================================
   UPDATE BACK NAVIGATION
========================================================= */

function updateBackNavigation(){

    /* -----------------------------------------
       Top Back Button
    ----------------------------------------- */

    if(productBack){

        productBack.href =
            productSource.url;


        productBack.innerHTML = `
            <span aria-hidden="true">
                ←
            </span>
            ${escapeHtml(
                productSource.label
            )}
        `;

    }


    /* -----------------------------------------
       Breadcrumb
    ----------------------------------------- */

    if(breadcrumbCategory){

        breadcrumbCategory.textContent =
            productSource.type ===
                "ready-stock"
                ? "Ready Stock"
                : "Collections";

    }


    /* -----------------------------------------
       Bottom Collection CTA
    ----------------------------------------- */

    const collectionButton =
        document.querySelector(
            ".sj-product-action-collection"
        );


    if(collectionButton){

        if(
            productSource.type ===
            "ready-stock"
        ){

            collectionButton.href =
                "ready-stock.html";

            collectionButton.textContent =
                "Back To Ready Stock";

        }
        else{

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

function renderProduct(
    product
){

    if(productCategory){

        productCategory.textContent =
            product.category || "";

    }


    if(productName){

        productName.textContent =
            product.name ||
            "Jewellery Product";

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


    /* -----------------------------------------
       Product Images
    ----------------------------------------- */

    productImages = [];


    if(product.image){

        productImages.push(
            product.image
        );

    }


    if(
        Array.isArray(
            product.gallery
        )
    ){

        productImages.push(
            ...product.gallery
        );

    }


    /*
       Also support images[] if ever used
       by the CMS without breaking the
       existing image/gallery structure.
    */

    if(
        Array.isArray(
            product.images
        )
    ){

        productImages.push(
            ...product.images
        );

    }


    /* -----------------------------------------
       Remove empty + duplicate images
    ----------------------------------------- */

    productImages =
        productImages.filter(
            (image, index, array) => {

                if(!image){

                    return false;

                }


                return (
                    array.indexOf(
                        image
                    ) === index
                );

            }
        );


    currentImageIndex = 0;


    if(productImages.length){

        setMainImage(
            productImages[0],
            0
        );

    }
    else{

        showImageFallback();

    }


    createThumbnails();

    createWhatsappButton(
        product
    );

    createCallButton(
        product
    );

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


    let imagePath = "";


    try{

        imagePath =
            typeof getImage === "function"
                ? getImage(image)
                : image;

    }
    catch(error){

        console.warn(
            "Image resolver error:",
            error
        );

        imagePath =
            image || "";

    }


    if(!imagePath){

        showImageFallback();

        return;

    }


    currentImageIndex =
        index;


    mainImage.style.opacity =
        "0";


    const preloader =
        new Image();


    preloader.onload =
        function(){

            mainImage.src =
                imagePath;


            mainImage.alt =
                currentProduct?.name ||
                "Suvarna Jewellers Jewellery";


            mainImage.style.opacity =
                "1";


            updateActiveThumbnail();

        };


    preloader.onerror =
        function(){

            showImageFallback();

        };


    preloader.src =
        imagePath;

}


/* =========================================================
   IMAGE FALLBACK
========================================================= */

function showImageFallback(){

    if(!mainImage){

        return;

    }


    mainImage.onerror =
        null;


    let fallback = "";


    try{

        fallback =
            typeof getImage === "function"
                ? getImage("")
                : "";

    }
    catch(error){

        fallback = "";

    }


    if(fallback){

        mainImage.src =
            fallback;

    }
    else{

        mainImage.removeAttribute(
            "src"
        );

    }


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


    if(
        productImages.length <= 1
    ){

        return;

    }


    productImages.forEach(
        (image, index) => {

            const img =
                document.createElement(
                    "img"
                );


            let imagePath = "";


            try{

                imagePath =
                    typeof getImage === "function"
                        ? getImage(image)
                        : image;

            }
            catch(error){

                imagePath =
                    image || "";

            }


            img.src =
                imagePath;


            img.alt =
                `${currentProduct?.name || "Product"} image ${index + 1}`;


            img.loading =
                "lazy";


            img.decoding =
                "async";


            img.draggable =
                false;


            img.dataset.index =
                String(index);


            img.addEventListener(
                "click",
                function(){

                    setMainImage(
                        image,
                        index
                    );

                }
            );


            img.addEventListener(
                "error",
                function(){

                    this.style.display =
                        "none";

                },
                {
                    once: true
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
            (img, index) => {

                img.classList.toggle(
                    "active",
                    index ===
                    currentImageIndex
                );

            }
        );

}


/* =========================================================
   MAIN IMAGE
========================================================= */

function setupMainImage(){

    if(!mainImage){

        return;

    }


    mainImage.onclick =
        function(){

            if(
                !productImages.length
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
   LIGHTBOX EVENTS
========================================================= */

function setupLightboxEvents(){

    if(lightboxClose){

        lightboxClose.onclick =
            closeLightbox;

    }


    if(lightboxPrev){

        lightboxPrev.onclick =
            function(event){

                event.stopPropagation();

                changeLightboxImage(
                    -1
                );

            };

    }


    if(lightboxNext){

        lightboxNext.onclick =
            function(event){

                event.stopPropagation();

                changeLightboxImage(
                    1
                );

            };

    }


    if(imageLightbox){

        imageLightbox.addEventListener(
            "click",
            function(event){

                if(
                    event.target ===
                    imageLightbox
                ){

                    closeLightbox();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        handleLightboxKeyboard
    );

}


/* =========================================================
   OPEN LIGHTBOX
========================================================= */

function openLightbox(
    index
){

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


    let imagePath = "";


    try{

        imagePath =
            typeof getImage === "function"
                ? getImage(
                    productImages[
                        currentImageIndex
                    ]
                )
                : productImages[
                    currentImageIndex
                ];

    }
    catch(error){

        imagePath =
            productImages[
                currentImageIndex
            ] || "";

    }


    lightboxImage.src =
        imagePath;


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
   CHANGE LIGHTBOX IMAGE
========================================================= */

function changeLightboxImage(
    direction
){

    if(
        productImages.length <= 1
    ){

        return;

    }


    let nextIndex =
        currentImageIndex +
        direction;


    if(nextIndex < 0){

        nextIndex =
            productImages.length - 1;

    }


    if(
        nextIndex >=
        productImages.length
    ){

        nextIndex = 0;

    }


    currentImageIndex =
        nextIndex;


    let imagePath = "";


    try{

        imagePath =
            typeof getImage === "function"
                ? getImage(
                    productImages[
                        currentImageIndex
                    ]
                )
                : productImages[
                    currentImageIndex
                ];

    }
    catch(error){

        imagePath =
            productImages[
                currentImageIndex
            ] || "";

    }


    if(lightboxImage){

        lightboxImage.src =
            imagePath;

    }


    setMainImage(
        productImages[
            currentImageIndex
        ],
        currentImageIndex
    );


    updateLightboxButtons();

}


/* =========================================================
   LIGHTBOX BUTTON STATE
========================================================= */

function updateLightboxButtons(){

    const multiple =
        productImages.length > 1;


    if(lightboxPrev){

        lightboxPrev.style.display =
            multiple
                ? "grid"
                : "none";

    }


    if(lightboxNext){

        lightboxNext.style.display =
            multiple
                ? "grid"
                : "none";

    }

}


/* =========================================================
   KEYBOARD
========================================================= */

function handleLightboxKeyboard(
    event
){

    if(
        !imageLightbox ||
        !imageLightbox.classList.contains(
            "show"
        )
    ){

        return;

    }


    if(
        event.key === "Escape"
    ){

        closeLightbox();

        return;

    }


    if(
        event.key === "ArrowLeft"
    ){

        event.preventDefault();

        changeLightboxImage(
            -1
        );

        return;

    }


    if(
        event.key === "ArrowRight"
    ){

        event.preventDefault();

        changeLightboxImage(
            1
        );

    }

}


/* =========================================================
   WHATSAPP
========================================================= */

function createWhatsappButton(
    product
){

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
            ).replace(
                /\D/g,
                ""
            );

    }


    const message =
`Hello SUVARNA JEWELLERS,

I am interested in this product.

Product : ${product.name || ""}
Category : ${product.category || ""}

Please share more details and price.`;


    whatsappButton.href =
        `https://wa.me/${phone}?text=${encodeURIComponent(
            message
        )}`;

}


/* =========================================================
   CALL
========================================================= */

function createCallButton(
    product
){

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
            ).replace(
                /\D/g,
                ""
            );

    }


    if(
        phone.startsWith("91")
    ){

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
                item => {

                    if(!item){

                        return false;

                    }


                    if(
                        String(item.id) ===
                        String(
                            currentProduct.id
                        )
                    ){

                        return false;

                    }


                    return (
                        item.category ===
                            currentProduct.category
                        ||
                        item.metal ===
                            currentProduct.metal
                    );

                }
            )
            .slice(0,4);


    if(!items.length){

        if(relatedSection){

            relatedSection.style.display =
                "none";

        }

        return;

    }


    if(relatedSection){

        relatedSection.style.display =
            "";

    }


    items.forEach(
        product => {

            const card =
                document.createElement(
                    "a"
                );


            /*
             * Preserve current source.
             */

            card.href =
                `product.html?id=${encodeURIComponent(
                    product.id
                )}&source=${encodeURIComponent(
                    productSource.type
                )}`;


            card.className =
                "product-card";


            let image = "";


            try{

                image =
                    typeof getImage === "function"
                        ? getImage(
                            product.image
                        )
                        : product.image || "";

            }
            catch(error){

                image =
                    product.image || "";

            }


            const name =
                product.name ||
                "Jewellery Product";


            const category =
                product.category ||
                "";


            card.innerHTML = `

                <div class="card-image">

                    <img
                        src="${escapeHtml(image)}"
                        alt="${escapeHtml(name)}"
                        loading="lazy"
                        decoding="async"
                    >

                </div>


                <div class="card-content">

                    <h3>
                        ${escapeHtml(name)}
                    </h3>

                    <p>
                        ${escapeHtml(category)}
                    </p>

                </div>

            `;


            const relatedImage =
                card.querySelector(
                    "img"
                );


            if(relatedImage){

                relatedImage.addEventListener(
                    "error",
                    function(){

                        this.style.display =
                            "none";

                    },
                    {
                        once: true
                    }
                );

            }


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


    productContent.innerHTML = `

        <div
            class="sj-product-error"
            style="
                min-height:420px;
                display:flex;
                flex-direction:column;
                align-items:center;
                justify-content:center;
                text-align:center;
                padding:40px 20px;
            "
        >

            <div
                style="
                    color:#d4af37;
                    font-size:10px;
                    letter-spacing:3px;
                    text-transform:uppercase;
                    margin-bottom:15px;
                "
            >
                SUVARNA JEWELLERS
            </div>


            <h1
                style="
                    margin:0 0 12px;
                    color:#f7f2e8;
                    font-family:Cinzel,Georgia,serif;
                    font-size:32px;
                "
            >
                ${escapeHtml(title)}
            </h1>


            <p
                style="
                    margin:0 0 25px;
                    color:rgba(247,242,232,.60);
                    font-size:13px;
                    line-height:1.7;
                "
            >
                ${escapeHtml(message)}
            </p>


            <a
                href="${escapeHtml(
                    productSource.url
                )}"
                class="btn btn-primary"
                style="
                    text-decoration:none;
                "
            >
                ${escapeHtml(
                    productSource.label
                )}
            </a>

        </div>

    `;

}


/* =========================================================
   SAFE HTML ESCAPE
========================================================= */

function escapeHtml(
    value
){

    return String(
        value ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}

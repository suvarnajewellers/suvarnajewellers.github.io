/* =========================================================
   SUVARNA JEWELLERS
   PRODUCT.JS
   PREMIUM + STABLE FINAL VERSION
========================================================= */

let currentProduct = null;
let products = [];
let productImages = [];
let currentImageIndex = 0;

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
let relatedSection = null;

let imageLightbox = null;
let lightboxImage = null;
let lightboxClose = null;
let lightboxPrev = null;
let lightboxNext = null;

let breadcrumbCategory = null;
let productBack = null;

let productSource = {
    type: "collections",
    label: "Back to Collections",
    url: "collections.html"
};


/* =========================================================
   DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initProductPage
);


/* =========================================================
   INITIALIZE
========================================================= */

async function initProductPage(){

    initializeDOMReferences();

    injectPremiumProductStyles();

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


    if(
        typeof getProducts !== "function"
    ){

        console.error(
            "getProducts() is unavailable."
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
            "Product loading error:",
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
        !products.length
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
                product &&
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
   DOM REFERENCES
========================================================= */

function initializeDOMReferences(){

    mainImage =
        document.getElementById(
            "mainImage"
        );

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

    relatedSection =
        document.getElementById(
            "relatedSection"
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

}


/* =========================================================
   SOURCE DETECTION
========================================================= */

function detectProductSource(){

    const params =
        new URLSearchParams(
            window.location.search
        );


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


    const legacy =
        normalizeSource(
            params.get("from")
        );


    if(legacy){

        applyProductSource(
            legacy
        );

        return;
    }


    const referrer =
        String(
            document.referrer || ""
        ).toLowerCase();


    if(
        referrer.includes(
            "ready-stock"
        )
    ){

        applyProductSource(
            "ready-stock"
        );

        return;
    }


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
        source === "ready_stock" ||
        source === "readystock"
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

function applyProductSource(type){

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
   BACK NAVIGATION
========================================================= */

function updateBackNavigation(){

    if(productBack){

        productBack.href =
            productSource.url;

        productBack.innerHTML = `
            <span aria-hidden="true">←</span>
            ${escapeHtml(
                productSource.label
            )}
        `;

    }


    if(breadcrumbCategory){

        breadcrumbCategory.textContent =
            productSource.type ===
            "ready-stock"
                ? "Ready Stock"
                : "Collections";

    }


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

function renderProduct(product){

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


    collectProductImages(
        product
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
   COLLECT IMAGES
========================================================= */

function collectProductImages(product){

    productImages = [];


    if(product.image){

        productImages.push(
            product.image
        );

    }


    if(
        Array.isArray(product.gallery)
    ){

        productImages.push(
            ...product.gallery
        );

    }


    if(
        Array.isArray(product.images)
    ){

        productImages.push(
            ...product.images
        );

    }


    productImages =
        productImages
            .filter(Boolean)
            .map(
                image =>
                    String(image).trim()
            )
            .filter(
                (image,index,array) =>
                    array.indexOf(image) === index
            );

}


/* =========================================================
   RESOLVE IMAGE
========================================================= */

function resolveImage(image){

    if(!image){

        return "";
    }


    try{

        if(
            typeof getImage ===
            "function"
        ){

            const resolved =
                getImage(image);

            if(resolved){

                return resolved;
            }

        }

    }
    catch(error){

        console.warn(
            "getImage failed:",
            error
        );

    }


    return String(image);
}


/* =========================================================
   MAIN IMAGE
========================================================= */

function setMainImage(
    image,
    index = 0
){

    if(!mainImage){

        return;
    }


    const imagePath =
        resolveImage(image);


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

            mainImage.classList.add(
                "sj-premium-main-image"
            );

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


    mainImage.removeAttribute(
        "src"
    );


    mainImage.alt =
        "Product image unavailable";


    mainImage.style.opacity =
        "1";


    const stage =
        mainImage.closest(
            ".card-image, .product-image, .sj-product-image, .product-gallery"
        );


    if(
        stage &&
        !stage.querySelector(
            ".sj-product-image-fallback"
        )
    ){

        const fallback =
            document.createElement(
                "div"
            );


        fallback.className =
            "sj-product-image-fallback";


        fallback.innerHTML = `
            <span>SUVARNA JEWELLERS</span>
            <strong>Premium Jewellery</strong>
        `;


        stage.appendChild(
            fallback
        );

    }

}


/* =========================================================
   THUMBNAILS
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

        thumbnailContainer.style.display =
            "none";

        return;
    }


    thumbnailContainer.style.display =
        "";


    productImages.forEach(
        (image,index) => {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";

            button.className =
                "sj-premium-thumbnail";

            button.dataset.index =
                String(index);

            button.setAttribute(
                "aria-label",
                `View image ${index + 1}`
            );


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                resolveImage(image);

            img.alt =
                `${currentProduct?.name || "Product"} image ${index + 1}`;

            img.loading =
                "lazy";

            img.decoding =
                "async";

            img.draggable =
                false;


            img.addEventListener(
                "error",
                function(){

                    button.style.display =
                        "none";

                },
                {
                    once:true
                }
            );


            button.appendChild(
                img
            );


            button.addEventListener(
                "click",
                function(){

                    setMainImage(
                        image,
                        index
                    );

                }
            );


            thumbnailContainer.appendChild(
                button
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
        .querySelectorAll(
            ".sj-premium-thumbnail"
        )
        .forEach(
            (button,index) => {

                button.classList.toggle(
                    "active",
                    index ===
                    currentImageIndex
                );

            }
        );

}


/* =========================================================
   MAIN IMAGE CLICK
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
   LIGHTBOX
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
        resolveImage(
            productImages[
                currentImageIndex
            ]
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
   CHANGE LIGHTBOX
========================================================= */

function changeLightboxImage(
    direction
){

    if(
        productImages.length <= 1
    ){

        return;
    }


    let next =
        currentImageIndex +
        direction;


    if(next < 0){

        next =
            productImages.length - 1;

    }


    if(
        next >= productImages.length
    ){

        next = 0;

    }


    currentImageIndex =
        next;


    const imagePath =
        resolveImage(
            productImages[
                currentImageIndex
            ]
        );


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
   LIGHTBOX BUTTONS
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
        typeof CONFIG !==
        "undefined" &&
        CONFIG.BUSINESS &&
        CONFIG.BUSINESS.phone
    ){

        phone =
            String(
                CONFIG.BUSINESS.phone
            )
            .replace(
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
        typeof CONFIG !==
        "undefined" &&
        CONFIG.BUSINESS &&
        CONFIG.BUSINESS.phone
    ){

        phone =
            String(
                CONFIG.BUSINESS.phone
            )
            .replace(
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


    const currentCategory =
        String(
            currentProduct.category || ""
        )
        .trim()
        .toLowerCase();


    const currentMetal =
        String(
            currentProduct.metal || ""
        )
        .trim()
        .toLowerCase();


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


                    const category =
                        String(
                            item.category || ""
                        )
                        .trim()
                        .toLowerCase();


                    const metal =
                        String(
                            item.metal || ""
                        )
                        .trim()
                        .toLowerCase();


                    return (
                        category ===
                        currentCategory
                        ||
                        metal ===
                        currentMetal
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


            card.className =
                "product-card sj-premium-related-card";


            card.href =
                `product.html?id=${encodeURIComponent(
                    product.id
                )}&source=${encodeURIComponent(
                    productSource.type
                )}`;


            const image =
                resolveImage(
                    product.image ||
                    (
                        Array.isArray(product.images)
                            ? product.images[0]
                            : ""
                    )
                );


            const name =
                product.name ||
                "Jewellery Product";


            const category =
                product.category ||
                "";


            card.innerHTML = `

                <div class="card-image">

                    ${
                        image
                        ?
                        `
                        <img
                            src="${escapeHtml(image)}"
                            alt="${escapeHtml(name)}"
                            loading="lazy"
                            decoding="async"
                        >
                        `
                        :
                        `
                        <div class="sj-related-fallback">
                            SUVARNA JEWELLERS
                        </div>
                        `
                    }

                </div>

                <div class="card-content">

                    <span class="sj-related-category">
                        ${escapeHtml(category)}
                    </span>

                    <h3>
                        ${escapeHtml(name)}
                    </h3>

                    <span class="sj-related-view">
                        View Product →
                    </span>

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
                        once:true
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

        <div class="sj-product-error">

            <span>
                SUVARNA JEWELLERS
            </span>

            <h1>
                ${escapeHtml(title)}
            </h1>

            <p>
                ${escapeHtml(message)}
            </p>

            <a
                href="${escapeHtml(
                    productSource.url
                )}"
            >
                ${escapeHtml(
                    productSource.label
                )}
            </a>

        </div>

    `;

}


/* =========================================================
   PREMIUM PRODUCT CSS
   VISUAL ONLY
========================================================= */

function injectPremiumProductStyles(){

    if(
        document.getElementById(
            "suvarna-product-premium-final-css"
        )
    ){

        return;
    }


    const style =
        document.createElement(
            "style"
        );


    style.id =
        "suvarna-product-premium-final-css";


    style.textContent = `

/* =====================================================
   PRODUCT IMAGE AREA
===================================================== */

.product-gallery,
.sj-product-image,
.product-image,
.product-media {

    position:relative;

}


/* Main image stage */

.product-gallery .card-image,
.sj-product-image,
.product-image {

    position:relative;

    display:flex;

    align-items:center;

    justify-content:center;

    width:100%;

    min-height:420px;

    aspect-ratio:1 / 1;

    overflow:hidden;

    padding:22px;

    border-radius:30px;

    background:
        linear-gradient(
            145deg,
            #fffdf9 0%,
            #f4eadc 100%
        );

    border:
        1px solid
        rgba(180,145,75,.22);

    box-shadow:
        0 18px 55px
        rgba(43,0,21,.10);

}


/* Inner luxury frame */

.product-gallery .card-image::before,
.sj-product-image::before,
.product-image::before {

    content:"";

    position:absolute;

    inset:18px;

    border-radius:
        25px;

    background:
        linear-gradient(
            145deg,
            #fffefa,
            #eee1cf
        );

    border:
        1px solid
        rgba(180,145,75,.12);

    box-shadow:
        inset 0 0 35px
        rgba(180,145,75,.06);

    pointer-events:none;

}


/* Main product image */

#mainImage {

    position:relative;

    z-index:2;

    display:block;

    width:100%;

    height:100%;

    min-height:370px;

    object-fit:contain;

    object-position:center;

    padding:30px;

    border-radius:24px;

    cursor:zoom-in;

    transition:
        opacity .35s ease,
        transform .5s ease;

}


/*
   IMPORTANT:
   Never use cover.
   Every product keeps its own
   natural proportions.
*/

#mainImage:hover {

    transform:
        scale(1.025);

}


/* =====================================================
   THUMBNAILS
===================================================== */

#thumbnailContainer {

    display:flex;

    align-items:center;

    justify-content:center;

    gap:10px;

    flex-wrap:wrap;

    margin-top:16px;

}


.sj-premium-thumbnail {

    position:relative;

    display:flex;

    align-items:center;

    justify-content:center;

    width:72px;

    height:72px;

    padding:5px;

    border-radius:15px;

    border:
        1px solid
        rgba(180,145,75,.20);

    background:
        linear-gradient(
            145deg,
            #fffdf9,
            #f3e8d9
        );

    cursor:pointer;

    overflow:hidden;

    transition:
        transform .3s ease,
        border-color .3s ease,
        box-shadow .3s ease;

}


.sj-premium-thumbnail img {

    width:100%;

    height:100%;

    object-fit:contain;

    object-position:center;

    border-radius:11px;

}


.sj-premium-thumbnail:hover {

    transform:
        translateY(-3px);

    border-color:
        rgba(180,145,75,.55);

}


.sj-premium-thumbnail.active {

    border-color:
        #d4af37;

    box-shadow:
        0 5px 18px
        rgba(180,145,75,.18);

}


/* =====================================================
   IMAGE FALLBACK
===================================================== */

.sj-product-image-fallback {

    position:absolute;

    inset:18px;

    z-index:4;

    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;

    text-align:center;

    border-radius:25px;

    color:#fff;

    background:
        linear-gradient(
            145deg,
            #3b071f,
            #160009
        );

}


.sj-product-image-fallback span {

    margin-bottom:10px;

    color:#d4af37;

    font-size:8px;

    letter-spacing:3px;

}


.sj-product-image-fallback strong {

    font-family:Cinzel,serif;

    font-size:22px;

}


/* =====================================================
   PRODUCT INFORMATION
===================================================== */

#productCategory {

    color:#a98235;

    font-family:Inter,sans-serif;

    font-size:9px;

    font-weight:600;

    letter-spacing:2px;

    text-transform:uppercase;

}


#productName {

    color:#2b0015;

    font-family:Cinzel,Georgia,serif;

    font-weight:600;

    line-height:1.25;

}


#productDescription {

    color:#6e6265;

    line-height:1.75;

}


/* =====================================================
   PRODUCT SPECIFICATIONS
===================================================== */

.product-specifications,
.product-specs {

    display:grid;

    grid-template-columns:
        repeat(2,minmax(0,1fr));

    gap:10px;

}


.product-specifications > *,
.product-specs > * {

    border:
        1px solid
        rgba(180,145,75,.15);

    border-radius:14px;

    background:
        rgba(255,253,248,.72);

}


/* =====================================================
   ACTION BUTTONS
===================================================== */

#whatsappButton,
#callButton,
.sj-product-action-collection {

    border-radius:999px;

    transition:
        transform .3s ease,
        box-shadow .3s ease;

}


#whatsappButton:hover,
#callButton:hover,
.sj-product-action-collection:hover {

    transform:
        translateY(-2px);

}


/* =====================================================
   RELATED PRODUCTS
===================================================== */

.sj-premium-related-card {

    overflow:hidden;

    border-radius:20px;

    background:
        linear-gradient(
            145deg,
            #fffdf9,
            #f5ecdf
        );

    border:
        1px solid
        rgba(180,145,75,.16);

    box-shadow:
        0 8px 28px
        rgba(43,0,21,.07);

    text-decoration:none;

    color:inherit;

    transition:
        transform .35s ease,
        box-shadow .35s ease;

}


.sj-premium-related-card:hover {

    transform:
        translateY(-5px);

    box-shadow:
        0 16px 38px
        rgba(43,0,21,.12);

}


.sj-premium-related-card .card-image {

    position:relative;

    display:flex;

    align-items:center;

    justify-content:center;

    aspect-ratio:1 / 1;

    padding:12px;

    overflow:hidden;

    background:#f2e8da;

}


.sj-premium-related-card .card-image img {

    width:100%;

    height:100%;

    object-fit:contain;

    object-position:center;

    padding:8px;

}


.sj-premium-related-card .card-content {

    padding:14px 15px 16px;

}


.sj-related-category {

    display:block;

    margin-bottom:5px;

    color:#a27b2c;

    font-size:8px;

    letter-spacing:1.5px;

    text-transform:uppercase;

}


.sj-premium-related-card h3 {

    margin:0 0 10px;

    color:#2b0015;

    font-family:Cinzel,serif;

    font-size:15px;

    line-height:1.35;

}


.sj-related-view {

    color:#76551d;

    font-size:8px;

    font-weight:600;

    letter-spacing:1.2px;

    text-transform:uppercase;

}


.sj-related-fallback {

    display:flex;

    align-items:center;

    justify-content:center;

    width:100%;

    height:100%;

    color:#d4af37;

    background:#2b0015;

    font-size:8px;

    letter-spacing:2px;

}


/* =====================================================
   PRODUCT ERROR
===================================================== */

.sj-product-error {

    min-height:420px;

    display:flex;

    flex-direction:column;

    align-items:center;

    justify-content:center;

    text-align:center;

    padding:40px 20px;

    border-radius:24px;

    background:
        linear-gradient(
            145deg,
            #fffdf9,
            #f5ecdf
        );

    border:
        1px solid
        rgba(180,145,75,.20);

}


.sj-product-error > span {

    margin-bottom:12px;

    color:#b18a38;

    font-size:8px;

    letter-spacing:3px;

}


.sj-product-error h1 {

    margin:0 0 10px;

    color:#2b0015;

    font-family:Cinzel,Georgia,serif;

}


.sj-product-error p {

    max-width:480px;

    margin:0 0 22px;

    color:#6d6165;

    line-height:1.7;

}


.sj-product-error a {

    display:inline-flex;

    align-items:center;

    justify-content:center;

    min-height:42px;

    padding:0 22px;

    border-radius:999px;

    color:#fff;

    background:#2b0015;

    text-decoration:none;

    font-size:9px;

    font-weight:600;

    letter-spacing:1.2px;

    text-transform:uppercase;

}


/* =====================================================
   FOOTER — ALWAYS CENTER
===================================================== */

footer,
.site-footer,
.main-footer,
.footer {

    text-align:center !important;

}


footer *,
.site-footer *,
.main-footer *,
.footer * {

    text-align:center !important;

}


footer .footer-container,
footer .footer-content,
footer .footer-inner,
.site-footer .footer-container,
.site-footer .footer-content,
.site-footer .footer-inner,
.main-footer .footer-container,
.main-footer .footer-content,
.main-footer .footer-inner {

    display:flex !important;

    flex-direction:column !important;

    align-items:center !important;

    justify-content:center !important;

    text-align:center !important;

}


footer ul,
.site-footer ul,
.main-footer ul,
.footer ul {

    display:flex !important;

    flex-direction:column !important;

    align-items:center !important;

    justify-content:center !important;

    padding-left:0 !important;

    margin-left:0 !important;

    list-style:none !important;

}


footer .footer-social,
.site-footer .footer-social,
.main-footer .footer-social {

    display:flex !important;

    align-items:center !important;

    justify-content:center !important;

    gap:12px;

}


footer .footer-bottom,
.site-footer .footer-bottom,
.main-footer .footer-bottom {

    display:flex !important;

    flex-direction:column !important;

    align-items:center !important;

    justify-content:center !important;

    text-align:center !important;

}


/* =====================================================
   MOBILE
===================================================== */

@media(max-width:700px){

    .product-gallery .card-image,
    .sj-product-image,
    .product-image {

        min-height:300px;

        aspect-ratio:1 / 1;

        padding:14px;

        border-radius:22px;

    }


    .product-gallery .card-image::before,
    .sj-product-image::before,
    .product-image::before {

        inset:12px;

        border-radius:18px;

    }


    #mainImage {

        min-height:270px;

        padding:22px;

        border-radius:18px;

    }


    #thumbnailContainer {

        gap:7px;

        margin-top:12px;

    }


    .sj-premium-thumbnail {

        width:58px;

        height:58px;

        border-radius:12px;

    }


    .product-specifications,
    .product-specs {

        grid-template-columns:
            repeat(2,minmax(0,1fr));

        gap:8px;

    }


    .sj-premium-related-card .card-image {

        padding:8px;

    }


    .sj-premium-related-card .card-image img {

        padding:6px;

    }


    footer,
    .site-footer,
    .main-footer,
    .footer {

        text-align:center !important;

    }

}


/* =====================================================
   EXTRA SMALL MOBILE
===================================================== */

@media(max-width:420px){

    .product-gallery .card-image,
    .sj-product-image,
    .product-image {

        min-height:260px;

    }


    #mainImage {

        min-height:230px;

        padding:18px;

    }


    .sj-premium-thumbnail {

        width:52px;

        height:52px;

    }

}

    `;


    document.head.appendChild(
        style
    );

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value){

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


/* =========================================================
   RETRY
========================================================= */

window.retryProduct =
    function(){

        initProductPage();

    };

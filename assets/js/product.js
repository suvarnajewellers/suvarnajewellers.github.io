/* ==========================================
   SUVARNA JEWELLERS
   PRODUCT.JS — PREMIUM PRODUCT PAGE
========================================== */

let currentProduct = null;
let products = [];
let productImages = [];
let currentImageIndex = 0;


/* ==========================
   INITIALIZE
========================== */

document.addEventListener("DOMContentLoaded", initProductPage);


async function initProductPage(){

    try{

        const params = new URLSearchParams(
            window.location.search
        );

        const productId = (params.get("id") || "").trim();


        /* ==========================
           MISSING PRODUCT ID
        ========================== */

        if(!productId){

            showProductError(
                "Product Not Found",
                "No product was selected."
            );

            return;

        }


        /* ==========================
           LOAD PRODUCTS
        ========================== */

        products = await getProducts();


        if(!Array.isArray(products) || !products.length){

            showProductError(
                "Products Unavailable",
                "We could not load the product catalogue right now."
            );

            return;

        }


        /* ==========================
           FIND PRODUCT
        ========================== */

        currentProduct = products.find(product =>
            String(product.id).trim() === productId
        );


        if(!currentProduct){

            showProductError(
                "Product Not Found",
                "The requested jewellery product could not be found."
            );

            return;

        }


        /* ==========================
           RENDER
        ========================== */

        renderProduct(currentProduct);

        renderRelatedProducts();

        updatePageMeta(currentProduct);

        bindLightbox();

    }

    catch(error){

        console.error(
            "Product Page Error:",
            error
        );

        showProductError(
            "Something Went Wrong",
            "Please return to the collections and try again."
        );

    }

}


/* ==========================
   GET ELEMENT
========================== */

function getEl(id){

    return document.getElementById(id);

}


/* ==========================
   RENDER PRODUCT
========================== */

function renderProduct(product){

    const mainImage =
        getEl("mainImage");

    const category =
        getEl("productCategory");

    const name =
        getEl("productName");

    const description =
        getEl("productDescription");

    const metal =
        getEl("productMetal");

    const grossWeight =
        getEl("productGrossWeight");

    const netWeight =
        getEl("productNetWeight");

    const size =
        getEl("productSize");


    if(category){

        category.textContent =
            product.category || "Jewellery";

    }


    if(name){

        name.textContent =
            product.name || "Suvarna Jewellers";

    }


    if(description){

        description.textContent =
            product.description ||
            "Premium jewellery crafted by Suvarna Jewellers.";

    }


    if(metal){

        metal.textContent =
            product.metal || "-";

    }


    if(grossWeight){

        grossWeight.textContent =
            product.grossWeight || "-";

    }


    if(netWeight){

        netWeight.textContent =
            product.netWeight || "-";

    }


    if(size){

        size.textContent =
            product.size || "-";

    }


    /* ==========================
       PRODUCT IMAGES
    ========================== */

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


    productImages = [
        ...new Set(
            productImages
                .filter(Boolean)
                .map(image =>
                    String(image).trim()
                )
                .filter(Boolean)
        )
    ];


    currentImageIndex = 0;


    if(mainImage){

        mainImage.alt =
            product.name ||
            "Jewellery product";

        mainImage.loading =
            "eager";

        mainImage.decoding =
            "async";


        if(productImages.length){

            mainImage.style.cursor =
                "zoom-in";

            setMainImage(
                0,
                false
            );

        }

        else{

            setImageFallback(
                mainImage
            );

        }

    }


    createThumbnails();

    createWhatsappButton(
        product
    );

    createCallButton(
        product
    );

}


/* ==========================
   IMAGE PATH
========================== */

function getSafeImagePath(path){

    if(typeof getImage === "function"){

        return getImage(path);

    }


    if(path){

        return path;

    }


    return "assets/images/no-image.jpg";

}


/* ==========================
   IMAGE FALLBACK
========================== */

function setImageFallback(
    imageElement
){

    if(!imageElement){

        return;

    }


    imageElement.onerror = null;

    imageElement.src =
        "assets/images/no-image.jpg";

    imageElement.alt =
        "Image unavailable";

}


/* ==========================
   SET MAIN IMAGE
========================== */

function setMainImage(
    index,
    animate = true
){

    const mainImage =
        getEl("mainImage");


    if(
        !mainImage ||
        !productImages[index]
    ){

        return;

    }


    currentImageIndex =
        index;


    const src =
        getSafeImagePath(
            productImages[index]
        );


    if(animate){

        mainImage.style.opacity =
            "0";

    }


    const preloader =
        new Image();


    preloader.onload = function(){

        mainImage.src =
            src;

        mainImage.alt =
            currentProduct?.name ||
            "Jewellery product";


        mainImage.style.opacity =
            "1";


        updateThumbnailState();

    };


    preloader.onerror = function(){

        setImageFallback(
            mainImage
        );

        mainImage.style.opacity =
            "1";

        updateThumbnailState();

    };


    preloader.src =
        src;

}


/* ==========================
   CREATE THUMBNAILS
========================== */

function createThumbnails(){

    const container =
        getEl("thumbnailContainer");


    if(!container){

        return;

    }


    container.innerHTML = "";


    if(!productImages.length){

        container.hidden = true;

        return;

    }


    container.hidden = false;


    productImages.forEach(
        (image,index)=>{

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "product-thumbnail";


            button.setAttribute(
                "aria-label",
                `View product image ${index + 1}`
            );


            const img =
                document.createElement(
                    "img"
                );


            img.src =
                getSafeImagePath(
                    image
                );


            img.alt =
                `${currentProduct?.name || "Product"} image ${index + 1}`;


            img.loading =
                index === 0
                    ? "eager"
                    : "lazy";


            img.decoding =
                "async";


            img.onerror =
                function(){

                    button.hidden =
                        true;

                };


            button.appendChild(
                img
            );


            button.addEventListener(
                "click",
                function(){

                    setMainImage(
                        index,
                        true
                    );

                }
            );


            container.appendChild(
                button
            );

        }
    );


    updateThumbnailState();

}


/* ==========================
   UPDATE THUMBNAIL STATE
========================== */

function updateThumbnailState(){

    const thumbnails =
        document.querySelectorAll(
            "#thumbnailContainer .product-thumbnail"
        );


    thumbnails.forEach(
        (button,index)=>{

            const active =
                index === currentImageIndex;


            button.classList.toggle(
                "active",
                active
            );


            button.setAttribute(
                "aria-current",
                active
                    ? "true"
                    : "false"
            );

        }
    );

}


/* ==========================
   WHATSAPP
========================== */

function createWhatsappButton(
    product
){

    const button =
        getEl("whatsappButton");


    if(!button){

        return;

    }


    let phone = "";


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


    if(!phone){

        phone =
            "917777991118";

    }


    const message =
`Hello SUVARNA JEWELLERS,

I am interested in this product.

Product: ${product.name || "-"}
Category: ${product.category || "-"}
Product ID: ${product.id || "-"}

Please share price and availability.`;


    const whatsappLink =
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


    button.href =
        whatsappLink;


    button.target =
        "_blank";


    button.rel =
        "noopener noreferrer";

}


/* ==========================
   CALL BUTTON
========================== */

function createCallButton(
    product
){

    const button =
        getEl("callButton");


    if(!button){

        return;

    }


    let phone = "";


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


    if(!phone){

        phone =
            "917777991118";

    }


    button.href =
        `tel:+${phone}`;


    button.setAttribute(
        "aria-label",
        `Call Suvarna Jewellers about ${product.name || "this product"}`
    );

}


/* ==========================
   RELATED PRODUCTS
========================== */

function renderRelatedProducts(){

    const container =
        getEl("relatedProducts");


    if(
        !container ||
        !currentProduct ||
        !Array.isArray(products)
    ){

        return;

    }


    container.innerHTML = "";


    const sameCategory =
        products.filter(
            product =>
                product.id !== currentProduct.id &&
                product.category ===
                    currentProduct.category
        );


    const sameMetal =
        products.filter(
            product =>
                product.id !== currentProduct.id &&
                product.metal ===
                    currentProduct.metal &&
                !sameCategory.some(
                    item =>
                        item.id === product.id
                )
        );


    const items =
        [
            ...sameCategory,
            ...sameMetal
        ].slice(0,4);


    if(!items.length){

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "no-products";


        empty.textContent =
            "No related products available.";


        container.appendChild(
            empty
        );


        return;

    }


    items.forEach(
        product => {

            const card =
                document.createElement(
                    "a"
                );


            card.href =
                `product.html?id=${encodeURIComponent(product.id)}`;


            card.className =
                "product-card";


            const imageWrap =
                document.createElement(
                    "div"
                );


            imageWrap.className =
                "card-image";


            const image =
                document.createElement(
                    "img"
                );


            image.src =
                getSafeImagePath(
                    product.image
                );


            image.alt =
                product.name ||
                "Jewellery product";


            image.loading =
                "lazy";


            image.decoding =
                "async";


            image.onerror =
                function(){

                    setImageFallback(
                        image
                    );

                };


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "card-content";


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                product.name ||
                "Jewellery";


            const category =
                document.createElement(
                    "p"
                );


            category.textContent =
                product.category ||
                "";


            imageWrap.appendChild(
                image
            );


            content.appendChild(
                title
            );


            content.appendChild(
                category
            );


            card.appendChild(
                imageWrap
            );


            card.appendChild(
                content
            );


            container.appendChild(
                card
            );

        }
    );

}


/* ==========================
   LIGHTBOX
========================== */

function bindLightbox(){

    const mainImage =
        getEl("mainImage");

    const lightbox =
        getEl("imageLightbox");

    const lightboxImage =
        getEl("lightboxImage");

    const close =
        getEl("lightboxClose");


    if(
        !mainImage ||
        !lightbox ||
        !lightboxImage
    ){

        return;

    }


    mainImage.addEventListener(
        "click",
        function(){

            if(
                !productImages.length ||
                !mainImage.src
            ){

                return;

            }


            lightboxImage.src =
                mainImage.src;


            lightboxImage.alt =
                mainImage.alt ||
                "Jewellery product";


            lightbox.classList.add(
                "show"
            );


            document.body.classList.add(
                "lightbox-open"
            );

        }
    );


    if(close){

        close.addEventListener(
            "click",
            closeLightbox
        );

    }


    lightbox.addEventListener(
        "click",
        function(event){

            if(
                event.target ===
                lightbox
            ){

                closeLightbox();

            }

        }
    );


    document.addEventListener(
        "keydown",
        function(event){

            if(
                !lightbox.classList.contains(
                    "show"
                )
            ){

                return;

            }


            if(
                event.key ===
                "Escape"
            ){

                closeLightbox();

            }


            if(
                event.key ===
                "ArrowLeft" &&
                currentImageIndex > 0
            ){

                setMainImage(
                    currentImageIndex - 1,
                    true
                );

                syncLightboxImage();

            }


            if(
                event.key ===
                "ArrowRight" &&
                currentImageIndex <
                    productImages.length - 1
            ){

                setMainImage(
                    currentImageIndex + 1,
                    true
                );

                syncLightboxImage();

            }

        }
    );

}


/* ==========================
   SYNC LIGHTBOX
========================== */

function syncLightboxImage(){

    const mainImage =
        getEl("mainImage");

    const lightboxImage =
        getEl("lightboxImage");


    if(
        mainImage &&
        lightboxImage
    ){

        lightboxImage.src =
            mainImage.src;


        lightboxImage.alt =
            mainImage.alt;

    }

}


/* ==========================
   CLOSE LIGHTBOX
========================== */

function closeLightbox(){

    const lightbox =
        getEl("imageLightbox");


    if(lightbox){

        lightbox.classList.remove(
            "show"
        );

    }


    document.body.classList.remove(
        "lightbox-open"
    );

}


/* ==========================
   PRODUCT ERROR
========================== */

function showProductError(
    title,
    message
){

    const pageShell =
        document.querySelector(
            ".product-page-shell"
        );


    if(!pageShell){

        return;

    }


    pageShell.innerHTML = "";


    const errorBox =
        document.createElement(
            "div"
        );


    errorBox.className =
        "product-error-state";


    const eyebrow =
        document.createElement(
            "span"
        );


    eyebrow.className =
        "product-error-eyebrow";


    eyebrow.textContent =
        "SUVARNA JEWELLERS";


    const heading =
        document.createElement(
            "h1"
        );


    heading.textContent =
        title;


    const text =
        document.createElement(
            "p"
        );


    text.textContent =
        message;


    const link =
        document.createElement(
            "a"
        );


    link.href =
        "collections.html";


    link.className =
        "btn btn-primary";


    link.textContent =
        "Back To Collections";


    errorBox.appendChild(
        eyebrow
    );


    errorBox.appendChild(
        heading
    );


    errorBox.appendChild(
        text
    );


    errorBox.appendChild(
        link
    );


    pageShell.appendChild(
        errorBox
    );

}


/* ==========================
   META
========================== */

function updatePageMeta(
    product
){

    if(!product){

        return;

    }


    const name =
        product.name ||
        "Jewellery Product";


    const category =
        product.category ||
        "Jewellery";


    document.title =
        `${name} | SUVARNA JEWELLERS`;


    const description =
        product.description ||
        `View ${name} from the ${category} collection at Suvarna Jewellers.`;


    let meta =
        document.querySelector(
            'meta[name="description"]'
        );


    if(!meta){

        meta =
            document.createElement(
                "meta"
            );


        meta.name =
            "description";


        document.head.appendChild(
            meta
        );

    }


    meta.content =
        description.slice(
            0,
            160
        );

                }

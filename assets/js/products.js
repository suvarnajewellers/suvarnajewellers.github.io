/* ==========================================
   SUVARNA JEWELLERS V8
   PRODUCT.JS
========================================== */


/* ==========================
   PRODUCT STATE
========================== */

let currentProduct = null;

let relatedProducts = [];

let productImages = [];



/* ==========================
   DOM ELEMENTS
========================== */

const mainImage = $("#mainImage");

const thumbnailContainer = $("#thumbnailContainer");

const productCategory = $("#productCategory");

const productName = $("#productName");

const productDescription = $("#productDescription");

const productMetal = $("#productMetal");

const productGrossWeight = $("#productGrossWeight");

const productNetWeight = $("#productNetWeight");

const productSize = $("#productSize");

const whatsappButton = $("#whatsappButton");

const relatedProductsGrid = $("#relatedProducts");

const imageLightbox = $("#imageLightbox");

const lightboxImage = $("#lightboxImage");

const lightboxClose = $("#lightboxClose");



/* ==========================
   GET PRODUCT ID
========================== */

const params = new URLSearchParams(window.location.search);

const productId = params.get("id");



/* ==========================
   INITIALIZE
========================== */

document.addEventListener("DOMContentLoaded", async () => {

    if(!productId){

        window.location.href = "collections.html";

        return;

    }

    await loadProduct();

});

/* ==========================
   LOAD PRODUCT
========================== */

async function loadProduct(){

    try{

        const products = await loadProducts();

        currentProduct = products.find(
            product => product.id === productId
        );


        if(!currentProduct){

            window.location.href = "collections.html";

            return;

        }


        renderProduct(currentProduct);


        loadRelatedProducts(
            products,
            currentProduct
        );


    }
    catch(error){

        console.error(
            "Product loading error:",
            error
        );

    }

}



/* ==========================
   RENDER PRODUCT
========================== */

function renderProduct(product){


    productCategory.textContent =
    product.category || "";


    productName.textContent =
    product.name || "";


    productDescription.textContent =
    product.description || "";


    productMetal.textContent =
    product.metal || "-";


    productGrossWeight.textContent =
    product.grossWeight || "-";


    productNetWeight.textContent =
    product.netWeight || "-";


    productSize.textContent =
    product.size || "-";


    productImages =
    getProductImages(product);


    setMainImage(
        productImages[0]
    );


    createThumbnails();


    createWhatsappLink(product);


       }

/* ==========================
   PRODUCT IMAGES
========================== */

function getProductImages(product){

    let images = [];


    if(product.image){

        images.push(product.image);

    }


    if(product.gallery && Array.isArray(product.gallery)){

        images = [
            ...images,
            ...product.gallery
        ];

    }


    return [
        ...new Set(images)
    ];

}



/* ==========================
   SET MAIN IMAGE
========================== */

function setMainImage(image){

    if(!image || !mainImage){

        return;

    }


    mainImage.src = image;

    mainImage.alt =
    currentProduct?.name || "Jewellery Product";

}



/* ==========================
   CREATE THUMBNAILS
========================== */

function createThumbnails(){

    if(!thumbnailContainer){

        return;

    }


    thumbnailContainer.innerHTML = "";


    productImages.forEach((image,index)=>{


        const thumb = document.createElement("img");


        thumb.src = image;

        thumb.alt =
        currentProduct.name;


        thumb.className =
        index === 0
        ?
        "active"
        :
        "";


        thumb.addEventListener(
            "click",
            ()=>{


                setMainImage(image);


                document
                .querySelectorAll(
                    ".product-thumbnails img"
                )
                .forEach(img=>{

                    img.classList.remove(
                        "active"
                    );

                });


                thumb.classList.add(
                    "active"
                );


            }
        );


        thumbnailContainer.appendChild(
            thumb
        );


    });


           }

/* ==========================
   WHATSAPP LINK
========================== */

function createWhatsappLink(product){


    if(!whatsappButton){

        return;

    }


    const message =

    `Hello SUVARNA JEWELLERS,

I am interested in:

Product: ${product.name}

Category: ${product.category}

Please share more details.`;



    const whatsappURL =

    `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(message)}`;



    whatsappButton.href = whatsappURL;


}



/* ==========================
   LOAD RELATED PRODUCTS
========================== */

function loadRelatedProducts(products, current){


    relatedProducts = products

    .filter(product =>

        product.category === current.category &&

        product.id !== current.id

    )

    .slice(0,4);



    renderRelatedProducts();


}



/* ==========================
   RENDER RELATED PRODUCTS
========================== */

function renderRelatedProducts(){


    if(!relatedProductsGrid){

        return;

    }


    relatedProductsGrid.innerHTML = "";


    relatedProducts.forEach(product=>{


        const card = document.createElement("a");


        card.href =
        `product.html?id=${product.id}`;


        card.className =
        "product-card";



        card.innerHTML = `

        <div class="card-image">

            <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
            >

        </div>


        <div class="card-content">

            <h3>
            ${product.name}
            </h3>

            <p>
            ${product.category}
            </p>

        </div>

        `;


        relatedProductsGrid.appendChild(card);


    });


}

/* ==========================
   IMAGE LIGHTBOX
========================== */

if(mainImage){

    mainImage.addEventListener(
        "click",
        ()=>{


            if(!imageLightbox || !lightboxImage){

                return;

            }


            lightboxImage.src =
            mainImage.src;


            imageLightbox.classList.add(
                "show"
            );


        }
    );

}



/* ==========================
   CLOSE LIGHTBOX
========================== */

if(lightboxClose){

    lightboxClose.addEventListener(
        "click",
        ()=>{


            imageLightbox.classList.remove(
                "show"
            );


        }
    );

}



/* ==========================
   CLOSE ON BACKGROUND CLICK
========================== */

if(imageLightbox){

    imageLightbox.addEventListener(
        "click",
        (event)=>{


            if(event.target === imageLightbox){


                imageLightbox.classList.remove(
                    "show"
                );


            }


        }
    );

}



/* ==========================
   ESC KEY CLOSE
========================== */

document.addEventListener(
"keydown",
(event)=>{


    if(event.key === "Escape" && imageLightbox){


        imageLightbox.classList.remove(
            "show"
        );


    }


});

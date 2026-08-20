/* ==========================================
   SUVARNA JEWELLERS V10 LUXURY
   READY-STOCK.JS
========================================== */

let readyProducts = [];
let filteredProducts = [];

let grid = null;
let searchInput = null;
let countElement = null;
let emptyState = null;


/* ==========================================
   DOM READY
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    initReadyStock
);


/* ==========================================
   INITIALIZE
========================================== */

async function initReadyStock(){

    grid =
    document.getElementById(
        "readyStockPageGrid"
    );

    searchInput =
    document.getElementById(
        "ready-search"
    );

    countElement =
    document.getElementById(
        "ready-count"
    );

    emptyState =
    document.getElementById(
        "empty-state"
    );

    if(
        !grid ||
        !searchInput ||
        !countElement ||
        !emptyState
    ){
        return;
    }

    showLoading();

    try{

        const products =
        await getProducts();

        readyProducts =
        products.filter(product =>
            product.readyStock === true
        );

        filteredProducts =
        [...readyProducts];

        updateCount();

        renderProducts(
            filteredProducts
        );

        initSearch();

    }

    catch(error){

        console.error(
            "Ready Stock Error:",
            error
        );

        grid.innerHTML = `
        <div class="error-box">
            Unable to load products.
        </div>
        `;

    }

}
/* ==========================================
   SEARCH
========================================== */

function initSearch(){

    searchInput.addEventListener(
        "input",
        function(){

            applyFilters();

        }
    );

}


/* ==========================================
   APPLY FILTERS
========================================== */

function applyFilters(){

    const keyword =
    searchInput.value
    .trim()
    .toLowerCase();

    filteredProducts =
    readyProducts.filter(product=>{

        const name =
        (product.name || "")
        .toLowerCase();

        const category =
        (product.category || "")
        .toLowerCase();

        const metal =
        (product.metal || "")
        .toLowerCase();

        return(

            name.includes(keyword)

            ||

            category.includes(keyword)

            ||

            metal.includes(keyword)

        );

    });

    updateCount();

    renderProducts(
        filteredProducts
    );

}


/* ==========================================
   UPDATE COUNT
========================================== */

function updateCount(){

    if(!countElement) return;

    countElement.textContent =
    filteredProducts.length;

}


/* ==========================================
   LOADING
========================================== */

function showLoading(){

    grid.innerHTML = "";

    for(let i=0;i<6;i++){

        grid.innerHTML += `

        <div class="product-card loading-card">

            <div class="product-image"></div>

            <div class="product-info">

                <div class="loading-line"></div>

                <div class="loading-line short"></div>

            </div>

        </div>

        `;

    }

        }
/* ==========================================
   RENDER PRODUCTS
========================================== */

function renderProducts(products){

    if(!grid) return;

    if(products.length===0){

        grid.innerHTML="";

        emptyState.style.display="block";

        return;

    }

    emptyState.style.display="none";

    grid.innerHTML=products.map(product=>`

    <article class="product-card">

        <div class="product-image">

            <img
                src="${product.image}"
                alt="${product.name}"
                loading="lazy"
                onerror="this.src='Logo.png'">

            <span class="product-badge">
                Ready Stock
            </span>

        </div>

        <div class="product-info">

            <span class="product-category">

                ${product.category || ""}

            </span>

            <h3>

                ${product.name}

            </h3>

            <p class="product-weight">

                Net Weight :
                ${product.netWeight || "-"}

            </p>

            <div class="product-buttons">

                <a
                    href="product.html?id=${encodeURIComponent(product.id)}&source=ready-stock"
                    class="btn btn-primary">

                    View Product

                </a>

                <a
                    href="https://wa.me/917777991118?text=${encodeURIComponent(
                        "Hello Suvarna Jewellers, I am interested in " + product.name
                    )}"
                    target="_blank"
                    class="btn btn-outline">

                    WhatsApp

                </a>

            </div>

        </div>

    </article>

    `).join("");

    animateCards();

}
/* ==========================================
   CARD ANIMATION
========================================== */

function animateCards(){

    const cards =
    document.querySelectorAll(
        ".product-card"
    );

    cards.forEach((card,index)=>{

        card.style.opacity="0";
        card.style.transform="translateY(30px)";

        setTimeout(()=>{

            card.style.transition=
            ".45s ease";

            card.style.opacity="1";
            card.style.transform=
            "translateY(0)";

        },index*70);

    });

}


/* ==========================================
   IMAGE FALLBACK
========================================== */

document.addEventListener(
"error",
function(event){

    if(
        event.target.tagName==="IMG"
    ){

        event.target.src="Logo.png";

    }

},
true);


/* ==========================================
   CATEGORY FILTER
========================================== */

function filterReadyStock(category){

    if(category==="all"){

        filteredProducts=
        [...readyProducts];

    }

    else{

        filteredProducts=
        readyProducts.filter(product=>

            (product.category||"")
            .toLowerCase()===category
            .toLowerCase()

        );

    }

    applyFilters();

}


/* ==========================================
   EXPORT
========================================== */

window.filterReadyStock =
filterReadyStock;

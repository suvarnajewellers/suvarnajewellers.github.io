/* ==========================================
   SUVARNA JEWELLERS V10
   READY-STOCK.JS
========================================== */

let readyProducts = [];
let filteredProducts = [];

document.addEventListener(
    "DOMContentLoaded",
    initReadyStock
);

async function initReadyStock(){

    const grid =
        document.getElementById("readyStockPageGrid");

    const search =
        document.getElementById("ready-search");

    const count =
        document.getElementById("ready-count");

    const empty =
        document.getElementById("empty-state");

    if(
        !grid ||
        !search ||
        !count ||
        !empty
    ){
        return;
    }

    try{

        const products =
            await getProducts();

        readyProducts =
            products.filter(product =>
                product.readyStock === true
            );

        filteredProducts =
            [...readyProducts];

        count.textContent =
            filteredProducts.length;

        renderProducts(
            filteredProducts
        );

        search.addEventListener(
            "input",
            function(){

                const keyword =
                    this.value
                    .trim()
                    .toLowerCase();

                filteredProducts =
                    readyProducts.filter(product=>{

                        return (

                            product.name
                            ?.toLowerCase()
                            .includes(keyword)

                            ||

                            product.category
                            ?.toLowerCase()
                            .includes(keyword)

                            ||

                            product.metal
                            ?.toLowerCase()
                            .includes(keyword)

                        );

                    });

                count.textContent =
                    filteredProducts.length;

                renderProducts(
                    filteredProducts
                );

            }
        );

    }

    catch(error){

        console.error(error);

        grid.innerHTML = `
        <p class="error-text">
        Unable to load products.
        </p>
        `;

    }

}
/* ==========================
   RENDER PRODUCTS
========================== */

function renderProducts(products){

    const grid =
        document.getElementById(
            "readyStockPageGrid"
        );

    const empty =
        document.getElementById(
            "empty-state"
        );

    if(!grid) return;

    if(products.length === 0){

        grid.innerHTML = "";

        if(empty){
            empty.style.display = "block";
        }

        return;

    }

    if(empty){
        empty.style.display = "none";
    }

    grid.innerHTML = products.map(product => `

        <div class="product-card">

            <div class="product-image">

                <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    onerror="this.src='Logo.png'">

            </div>

            <div class="product-info">

                <span class="product-category">

                    ${product.category || ""}

                </span>

                <h3>

                    ${product.name}

                </h3>

                <p>

                    ${product.netWeight || "-"}

                </p>

                <div class="product-buttons">

                    <a
                        href="product.html?id=${product.id}"
                        class="btn btn-primary">

                        View Product

                    </a>

                    <a
                        href="https://wa.me/917777991118?text=Hello%20Suvarna%20Jewellers,%20I%20am%20interested%20in%20${encodeURIComponent(product.name)}"
                        target="_blank"
                        class="btn">

                        WhatsApp

                    </a>

                </div>

            </div>

        </div>

    `).join("");

                           }
/* ==========================
   IMAGE PATH FIX
========================== */

document.addEventListener("error", function(event){

    if(event.target.tagName === "IMG"){

        event.target.src = "Logo.png";

    }

}, true);


/* ==========================
   FUTURE CATEGORY FILTER
========================== */

function filterReadyStock(category){

    if(category === "all"){

        renderProducts(readyProducts);

        const count =
        document.getElementById("ready-count");

        if(count){

            count.textContent =
            readyProducts.length;

        }

        return;

    }

    const filtered = readyProducts.filter(product =>

        product.category === category

    );

    renderProducts(filtered);

    const count =
    document.getElementById("ready-count");

    if(count){

        count.textContent =
        filtered.length;

    }

}


/* ==========================
   GLOBAL EXPORT
========================== */

window.filterReadyStock =
filterReadyStock;

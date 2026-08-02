/* ==========================================
   SUVARNA JEWELLERS V8
   READY-STOCK.JS
========================================== */

let allReadyStock = [];
let currentFilter = "All";

/* ==========================
   PAGE LOAD
========================== */

document.addEventListener("DOMContentLoaded", async function () {

    const grid = document.getElementById("readyStockPageGrid");

    if (!grid) return;

    allReadyStock = await getProducts();

    renderReadyStock(allReadyStock);

    updateProductCount(allReadyStock);

    initSearch();

    initFilters();

});


/* ==========================
   SEARCH
========================== */

function initSearch() {

    const input = document.getElementById("ready-search");

    if (!input) return;

    input.addEventListener("input", filterProducts);

}


/* ==========================
   FILTER BUTTONS
========================== */

function initFilters() {

    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach(button => {

        button.addEventListener("click", function () {

            buttons.forEach(btn => btn.classList.remove("active"));

            this.classList.add("active");

            currentFilter = this.dataset.filter;

            filterProducts();

        });

    });

}


/* ==========================
   FILTER PRODUCTS
========================== */

function filterProducts() {

    const keyword =
        document.getElementById("ready-search")
        ?.value
        .toLowerCase()
        .trim() || "";

    let filtered = allReadyStock.filter(product => {

        const matchesSearch =

            product.name.toLowerCase().includes(keyword) ||

            product.category.toLowerCase().includes(keyword) ||

            (product.metal || "")
                .toLowerCase()
                .includes(keyword);

        const matchesFilter =

            currentFilter === "All" ||

            product.category === currentFilter;

        return matchesSearch && matchesFilter;

    });

    renderReadyStock(filtered);

    updateProductCount(filtered);

}
/* ==========================
   RENDER READY STOCK
========================== */

function renderReadyStock(products) {

    const grid = document.getElementById("readyStockPageGrid");
    const empty = document.getElementById("empty-state");

    if (!grid) return;

    grid.innerHTML = "";

    if (products.length === 0) {

        if (empty) empty.style.display = "block";

        return;
    }

    if (empty) empty.style.display = "none";

    products.forEach(product => {

        grid.innerHTML += `

<div class="ready-stock-card">

    <div class="ready-stock-image">

        <img
            src="${getImage(product.image)}"
            alt="${product.name}"
            loading="lazy">

        <span class="stock-badge">
            Ready Stock
        </span>

    </div>

    <div class="ready-stock-info">

        <h3>${product.name}</h3>

        <p>${product.category}</p>

        ${product.metal ? `<small>${product.metal}</small>` : ""}

        <a
            href="product.html?id=${product.id}"
            class="btn btn-primary ready-stock-btn">
            View Product
        </a>

        <a
            href="${whatsappMessage(product)}"
            target="_blank"
            class="btn btn-outline ready-stock-btn">
            WhatsApp Enquiry
        </a>

    </div>

</div>

`;

    });

}


/* ==========================
   PRODUCT COUNT
========================== */

function updateProductCount(products) {

    const count = document.getElementById("ready-count");

    if (count) {

        count.textContent = products.length;

    }

}

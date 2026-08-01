/* ==========================================
   SUVARNA JEWELLERS V8
   COLLECTIONS.JS
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionPage);

async function initCollectionPage(){

    const grid = document.getElementById("productsGrid");

    if(!grid) return;

    const category = grid.dataset.category;

    if(!category) return;

    const products = await getProductsByCategory(category);

    grid.innerHTML = "";

    products.forEach(product => {

        grid.innerHTML += `
        <a href="../product.html?id=${product.id}" class="collection-link">

            <div class="collection-card">

    <img src="../${getImage(product.image)}"
         alt="${product.name}"
         loading="lazy">

    <div class="collection-overlay">

        <div>

            <span>${product.category}</span>

            <h3>${product.name}</h3>

        </div>

    </div>

</div>

        </a>
        `;

    });

}

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

            <div class="card">

                <img src="../${getImage(product.image)}"
                     alt="${product.name}"
                     loading="lazy">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <div class="card-btn">
                    View Details
                </div>

            </div>

        </a>
        `;

    });

}

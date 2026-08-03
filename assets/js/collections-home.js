/* ==========================================
   SUVARNA JEWELLERS V8
   COLLECTIONS-HOME.JS
========================================== */

document.addEventListener("DOMContentLoaded", initCollectionsHome);

let allProducts = [];

async function initCollectionsHome(){

    const grid = document.getElementById("collectionsGrid");

    if(!grid) return;

    try{

        allProducts = await getProducts();

        renderCollections(allProducts);

        initSearch();

    }catch(error){

        console.error(error);

        grid.innerHTML = `
        <div class="empty-state">
            <h3>Unable to load products.</h3>
        </div>
        `;

    }

}

function renderCollections(products){

    const grid = document.getElementById("collectionsGrid");
   
const count = document.getElementById("productCount");

if(count){
    count.textContent = products.length;
}
    grid.innerHTML = "";

    if(products.length === 0){

        grid.innerHTML = `
        <div class="empty-state">
            <h3>No Products Found</h3>
        </div>
        `;

        return;

    }

    products.forEach(product=>{

        grid.innerHTML += `

        <a
        href="product.html?id=${product.id}"
        class="collection-link">

            <div class="card">

                <img
                src="${getImage(product.image)}"
                alt="${product.name}"
                loading="lazy">

                <h3>${product.name}</h3>

                <p>${product.category}</p>

                <div class="card-btn">
                    View Product
                </div>

            </div>

        </a>

        `;

    });

}

function initSearch(){

    const search =
    document.getElementById("collectionSearch");

    if(!search) return;

    search.addEventListener("input", function(){

        const keyword =
        this.value.trim().toLowerCase();

        const filtered =
        allProducts.filter(product=>{

            return (
                product.name.toLowerCase().includes(keyword) ||
                product.category.toLowerCase().includes(keyword)
            );

        });

        renderCollections(filtered);

    });

              }

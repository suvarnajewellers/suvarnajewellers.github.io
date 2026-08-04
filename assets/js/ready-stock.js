/* ==========================================
   SUVARNA JEWELLERS V9
   READY-STOCK.JS
========================================== */

document.addEventListener("DOMContentLoaded", loadReadyStock);

async function loadReadyStock(){

    const grid = document.getElementById("readyStockGrid");

    if(!grid) return;

    try{

        const response = await fetch("products.json");
        const data = await response.json();

        const products = Array.isArray(data)
            ? data
            : (data.products || []);

        const readyStock = products
            .filter(product => product.isReadyStock === true)
            .slice(0,8);

        if(readyStock.length === 0){

            grid.innerHTML = `
                <p style="text-align:center;width:100%;">
                    No Ready Stock Available.
                </p>
            `;
            return;
        }

        grid.innerHTML = readyStock.map(product => `

            <div class="product-card">

                <img
                    src="${product.image}"
                    alt="${product.name}">

                <div class="product-info">

                    <h3>${product.name}</h3>

                    <p>${product.category || ""}</p>

                    <a
                        href="product.html?id=${product.id}"
                        class="btn btn-primary">

                        View Details

                    </a>

                </div>

            </div>

        `).join("");

    }

    catch(error){

        console.error(error);

        grid.innerHTML = `
            <p style="text-align:center;width:100%;">
                Unable to load Ready Stock.
            </p>
        `;

    }

}

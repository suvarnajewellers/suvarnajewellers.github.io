/* ==========================================
   SUVARNA JEWELLERS V10
   READY-STOCK.JS
========================================== */

document.addEventListener(
"DOMContentLoaded",
loadReadyStock
);


async function loadReadyStock(){

    const grid = document.getElementById(
        "readyStockPageGrid"
    );

    if(!grid) return;


    try{

        const products = await getProducts();


        const readyStock = products.filter(
    product => 
    product.isReadyStock == true ||
    product.isReadyStock == "true"
);

console.log("ALL PRODUCTS:", products);
console.log("READY STOCK:", readyStock);


        if(readyStock.length === 0){

            grid.innerHTML = `
            <p style="text-align:center;width:100%;">
            No Ready Stock Available.
            </p>
            `;

            return;
        }


        grid.innerHTML = readyStock.map(product => {


            return `

            <div class="product-card">

                <img 
                src="${product.image}"
                alt="${product.name}"
                loading="lazy">


                <div class="product-info">

                    <h3>
                    ${product.name}
                    </h3>


                    <p>
                    ${product.category || ""}
                    </p>


                    <a 
                    href="product.html?id=${product.id}"
                    class="btn btn-primary">

                    View Product

                    </a>


                    <a
                    href="https://wa.me/917777991118"
                    target="_blank"
                    class="btn">

                    WhatsApp

                    </a>

                </div>

            </div>

            `;


        }).join("");


    }

    catch(error){

        console.error(
            "Ready Stock Error:",
            error
        );


        grid.innerHTML = `
        <p style="text-align:center;width:100%;">
        Unable to load Ready Stock.
        </p>
        `;

    }

}

/* ==========================================
   SUVARNA JEWELLERS V8
   READY-STOCK.JS
========================================== */


/* ==========================
   READY STOCK PAGE LOAD
========================== */

document.addEventListener(
"DOMContentLoaded",
async function(){


    const grid =
    document.getElementById(
        "readyStockPageGrid"
    );


    if(!grid) return;



    const products = await getProducts();

renderReadyStock(products);


});



/* ==========================
   RENDER READY STOCK
========================== */

function renderReadyStock(products){


    const grid =
    document.getElementById(
        "readyStockPageGrid"
    );


    if(!grid) return;



    grid.innerHTML="";



    products.forEach(product=>{


        grid.innerHTML += `


        <div class="ready-stock-card">


            <div class="ready-stock-image">


            ${
                product.image &&
                product.image.endsWith(".mp4")

                ?

                `

                <video
                autoplay
                muted
                loop
                playsinline>

                    <source
                    src="${product.image}"
                    type="video/mp4">

                </video>

                `


                :


                `

                <img
                src="${getImage(product.image)}"
                alt="${product.name}">

                `

            }



            <span class="stock-badge">
                Ready Stock
            </span>



            </div>



            <div class="ready-stock-info">


                <h3>
                    ${product.name}
                </h3>


                <p>
                    ${product.category}
                </p>


                ${
                    product.metal

                    ?

                    `<small>
                    ${product.metal}
                    </small>`

                    :

                    ""

                }



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

/* ==========================================
   SUVARNA JEWELLERS V8
   PRODUCTS.JS
========================================== */


/* ==========================
   LOAD PRODUCT COLLECTIONS
========================== */

document.addEventListener(
"DOMContentLoaded",
async function(){


    await loadProducts();


    loadCollectionCards();


    loadReadyPreview();


});



/* ==========================
   COLLECTION DATA
========================== */

const COLLECTIONS = [

    {
        title:"Gold Jewellery",
        category:"Gold Jewellery",
        image:"assets/images/collections/gold.jpg",
        link:"gold.html"
    },


    {
        title:"Silver Jewellery",
        category:"Silver Jewellery",
        image:"assets/images/collections/silver.jpg",
        link:"silver.html"
    },


    {
        title:"Rudraksha Mala",
        category:"Rudraksha Mala",
        image:"assets/images/collections/rudraksha.jpg",
        link:"rudraksha-mala.html"
    },


    {
        title:"Rudraksha Bracelet",
        category:"Rudraksha Bracelet",
        image:"assets/images/collections/rudraksha-bracelet.jpg",
        link:"rudraksha-bracelet.html"
    },


    {
        title:"Premium Pendants",
        category:"Pendant",
        image:"assets/images/collections/pendant.jpg",
        link:"pendants.html"
    },


    {
        title:"Tulsi Mala",
        category:"Tulsi Mala",
        image:"assets/images/collections/tulsi.jpg",
        link:"tulsi-mala.html"
    }

];



/* ==========================
   LOAD COLLECTION CARDS
========================== */

function loadCollectionCards(){


    const grid =
    document.getElementById(
        "collectionGrid"
    );


    if(!grid) return;



    grid.innerHTML="";



    COLLECTIONS.forEach(item=>{


        grid.innerHTML += `

        <a href="${item.link}"
        class="collection-card">


            <img 
            src="${item.image}"
            alt="${item.title}">


            <div class="collection-overlay">

                <div>

                    <h3>
                    ${item.title}
                    </h3>

                    <span>
                    Explore Collection
                    </span>

                </div>

            </div>


        </a>

        `;


    });


}



/* ==========================
   READY PREVIEW
========================== */

function loadReadyPreview(){


    const grid =
    document.getElementById(
        "readyStockGrid"
    );


    if(!grid) return;



    const products =
    getProducts()
    .slice(0,8);



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


                <span class="category">

                ${product.category}

                </span>


                <br><br>


                <a
                href="product.html?id=${product.id}"
                class="btn btn-primary">

                View Details

                </a>


            </div>


        </div>

        `;


    });


}

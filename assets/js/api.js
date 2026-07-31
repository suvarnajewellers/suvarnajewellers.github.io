/* ==========================================
   SUVARNA JEWELLERS V8
   API.JS
========================================== */


/* ==========================
   PRODUCTS STORAGE
========================== */

let PRODUCTS = [];



/* ==========================
   LOAD PRODUCTS JSON
========================== */

async function loadProducts(){

    try{

        const response = await fetch(
            CONFIG.PRODUCTS_FILE || "products.json"
        );


        if(!response.ok){

            throw new Error(
                "Products file not found"
            );

        }


        const data = await response.json();


        /*
          Support both formats:

          [
            {product}
          ]

          OR

          {
            products:[
              {product}
            ]
          }
        */


        if(Array.isArray(data)){

            PRODUCTS = data;

        }

        else if(data.products){

            PRODUCTS = data.products;

        }

        else{

            PRODUCTS = [];

        }


        return PRODUCTS;


    }

    catch(error){

        console.error(
            "Product Loading Error:",
            error
        );


        PRODUCTS = [];

        return [];

    }

}



/* ==========================
   GET ALL PRODUCTS
========================== */

function getProducts(){

    return PRODUCTS;

}



/* ==========================
   GET BY CATEGORY
========================== */

function getProductsByCategory(category){

    return PRODUCTS.filter(

        product =>

        product.category === category

    );

}



/* ==========================
   GET SINGLE PRODUCT
========================== */

function getProductById(id){

    return PRODUCTS.find(

        product =>

        product.id === id

    );

}



/* ==========================
   SEARCH PRODUCTS
========================== */

function searchProducts(keyword){

    if(!keyword){

        return PRODUCTS;

    }


    keyword =
    keyword.toLowerCase();



    return PRODUCTS.filter(product => {


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

}



/* ==========================
   EXPORT GLOBAL
========================== */

window.PRODUCTS = PRODUCTS;

window.loadProducts = loadProducts;

window.getProducts = getProducts;

window.getProductsByCategory = getProductsByCategory;

window.getProductById = getProductById;

window.searchProducts = searchProducts;

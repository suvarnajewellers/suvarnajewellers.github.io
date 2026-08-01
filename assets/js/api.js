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

    if(PRODUCTS.length){

        return PRODUCTS;

    }

    try{

        const response = await fetch(
            CONFIG.PRODUCTS_FILE || "products.json"
        );

        if(!response.ok){

            throw new Error("Products file not found");

        }

        const data = await response.json();

        if(Array.isArray(data)){

            PRODUCTS = data;

        }

        else if(Array.isArray(data.products)){

            PRODUCTS = data.products;

        }

        else{

            PRODUCTS = [];

        }

        return PRODUCTS;

    }

    catch(error){

        console.error("Product Loading Error:", error);

        PRODUCTS = [];

        return [];

    }

}


/* ==========================
   GET ALL PRODUCTS
========================== */

async function getProducts(){

    if(!PRODUCTS.length){

        await loadProducts();

    }

    return PRODUCTS;

}


/* ==========================
   GET BY CATEGORY
========================== */

async function getProductsByCategory(category){

    const products = await getProducts();

    return products.filter(product =>
        product.category === category
    );

}


/* ==========================
   GET PRODUCT BY ID
========================== */

async function getProductById(id){

    const products = await getProducts();

    return products.find(product =>
        product.id === id
    );

}


/* ==========================
   SEARCH PRODUCTS
========================== */

async function searchProducts(keyword){

    const products = await getProducts();

    if(!keyword){

        return products;

    }

    keyword = keyword.toLowerCase();

    return products.filter(product =>

        product.name?.toLowerCase().includes(keyword) ||

        product.category?.toLowerCase().includes(keyword) ||

        product.metal?.toLowerCase().includes(keyword)

    );

}


/* ==========================
   EXPORT GLOBAL
========================== */

window.loadProducts = loadProducts;
window.getProducts = getProducts;
window.getProductsByCategory = getProductsByCategory;
window.getProductById = getProductById;
window.searchProducts = searchProducts;

/* ==========================================
   SUVARNA JEWELLERS V8
   API.JS
========================================== */

let products = [];

/* Load Products */

export async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.json");
        }

        products = await response.json();

        return products;

    } catch (error) {

        console.error(error);

        return [];

    }

}

/* All Products */

export function getProducts() {

    return products;

}

/* Ready Stock */

export function getReadyStock() {

    return products.filter(product => product.isReadyStock === true);

}

/* Product By ID */

export function getProduct(id) {

    return products.find(product =>

        String(product.id) === String(id)

    );

}

/* Category */

export function getCategory(category) {

    return products.filter(product =>

        product.category === category

    );

}

/* Sub Category */

export function getSubCategory(subCategory) {

    return products.filter(product =>

        product.subCategory === subCategory

    );

}

/* Search */

export function searchProducts(keyword) {

    keyword = keyword.toLowerCase();

    return products.filter(product =>

        product.name.toLowerCase().includes(keyword)

        ||

        (product.description || "")
        .toLowerCase()
        .includes(keyword)

        ||

        (product.code || "")
        .toLowerCase()
        .includes(keyword)

    );

}

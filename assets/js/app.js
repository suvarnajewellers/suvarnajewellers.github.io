/* ==========================================
   SUVARNA JEWELLERS V8
   APP.JS
========================================== */

import { loadProducts } from "./api.js";

import { initNavigation } from "./navigation.js";
import { initSearch } from "./search.js";
import { initReadyStock } from "./ready-stock.js";
import { initProductPage } from "./product-page.js";
import { initGallery } from "./gallery.js";
import { initUI } from "./ui.js";

document.addEventListener("DOMContentLoaded", async () => {

    try {

        await loadProducts();

        initNavigation();
        initUI();
        initSearch();
        initReadyStock();
        initProductPage();
        initGallery();

        console.log("✅ SUVARNA JEWELLERS V8 Loaded");

    } catch (error) {

        console.error("Application Error:", error);

    }

});

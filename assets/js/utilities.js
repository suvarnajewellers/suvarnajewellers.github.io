
/* ==========================================
   SUVARNA JEWELLERS V8
   UTILITIES.JS
========================================== */

export const Utils = {

    // Element by ID
    id(id) {
        return document.getElementById(id);
    },

    // Single Selector
    select(selector) {
        return document.querySelector(selector);
    },

    // Multiple Selectors
    all(selector) {
        return document.querySelectorAll(selector);
    },

    // URL Parameter
    getParam(name) {
        return new URLSearchParams(window.location.search).get(name);
    },

    // Check Video
    isVideo(file = "") {
        return file.toLowerCase().endsWith(".mp4");
    },

    // Safe Text
    text(value) {
        return value || "";
    },

    // Weight Format
    weight(value) {
        return value ? value + " g" : "-";
    },

    // Scroll Top
    scrollTop() {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    },

    // WhatsApp Link
    whatsappLink(number, message) {

        return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    }

};

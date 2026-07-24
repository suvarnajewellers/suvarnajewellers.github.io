/* =====================================
   SUVARNA JEWELLERS V5
   SCRIPT.JS
===================================== */

let products = [];

/* ===========================
   LOAD PRODUCTS.JSON
=========================== */

fetch("products.json")
  .then(response => response.json())
  .then(data => {
    products = data;

    loadCategoryProducts();
    loadProductDetails();
  })
  .catch(error => {
    console.error("Products not loaded:", error);
  });

/* ===========================
   LOAD CATEGORY PRODUCTS
=========================== */

function loadCategoryProducts() {

  const grid = document.getElementById("product-grid");

  if (!grid) return;

  let category = "";

  const page = window.location.pathname;

  if (page.includes("gold-jewellery"))
    category = "Gold Jewellery";

  else if (page.includes("silver-jewellery"))
    category = "Silver Jewellery";

  else if (page.includes("rudraksha-mala"))
    category = "Rudraksha Mala";

  else if (page.includes("tulsi-mala"))
    category = "Tulsi Mala";

  else if (page.includes("pendant-collection"))
    category = "Pendant Collection";

  else if (page.includes("bracelet-collection"))
    category = "Bracelet Collection";

  const filtered = products.filter(product =>
    product.category === category
  );

  grid.innerHTML = "";
     filtered.forEach(product => {

    grid.innerHTML += `

    <div class="collection-card">

      <img src="${product.image}" alt="${product.name}">

      <div class="collection-content">

        <h3>${product.name}</h3>

        <p>${product.description}</p>

        <a href="product.html?id=${product.id}" class="gallery-btn">

          View Details

        </a>

      </div>

    </div>

    `;

  });

}

/* ===========================
   LOAD PRODUCT DETAILS
=========================== */

function loadProductDetails() {

  const params = new URLSearchParams(window.location.search);

  const id = Number(params.get("id"));

  if (!id) return;

  const product = products.find(item => item.id === id);

  if (!product) return;

  document.getElementById("product-name").textContent = product.name;

  document.getElementById("product-category").textContent = product.category;

  document.getElementById("product-description").textContent = product.description;

  document.getElementById("main-image").src = product.image;

  document.getElementById("main-image").alt = product.name;

  document.getElementById("whatsapp-btn").href = product.whatsapp;

}
/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
  });

  document.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
    });
  });
}

/* =========================
   SCROLL TO TOP
========================= */

const scrollBtn = document.getElementById("scrollTopBtn");

if (scrollBtn) {

  window.addEventListener("scroll", function () {

    if (window.scrollY > 400) {

      scrollBtn.style.display = "block";

    } else {

      scrollBtn.style.display = "none";

    }

  });

  scrollBtn.addEventListener("click", function () {

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  });

}

/* =========================
   SMOOTH SCROLL
========================= */

document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {

  anchor.addEventListener("click", function (e) {

    const target = document.querySelector(this.getAttribute("href"));

    if (target) {

      e.preventDefault();

      target.scrollIntoView({

        behavior: "smooth"

      });

    }

  });

});

/* =========================
   FOOTER YEAR
========================= */

const footerCopy = document.querySelector(".footer-copy");

if (footerCopy) {

  footerCopy.innerHTML =
    "© " + new Date().getFullYear() +
    " SUVARNA JEWELLERS. All Rights Reserved.";

}
/* =========================
   Premium Sticky Navbar
========================= */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 40) {

        navbar.classList.add("nav-scrolled");

    } else {

        navbar.classList.remove("nav-scrolled");

    }

});

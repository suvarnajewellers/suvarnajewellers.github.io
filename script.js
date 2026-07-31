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
    loadReadyStock();
    loadProductDetails();

  })
  .catch(error => {
    console.error("Products not loaded:", error);
  });

/* ===========================
   LOAD CATEGORY PRODUCTS V2.0
=========================== */

function loadCategoryProducts() {

  const grid = document.getElementById("products-grid");

  if (!grid) return;

  let category = "";

  const page = window.location.pathname;


  if (page.includes("gold-jewellery")) {
  category = "Gold Jewellery";
}

else if (page.includes("silver-jewellery")) {
  category = "Silver Jewellery";
}
   
else if (page.includes("rudraksha-mala"))
    category = "Rudraksha Mala";

else if (page.includes("tulsi-mala"))
    category = "Tulsi Mala";

else if (page.includes("pendant-collection"))
    category = "Pendant Collection";

else if (page.includes("bracelet-collection"))
    category = "Bracelet Collection";


  const filtered = products.filter(product => {

    if (category === "Bracelet Collection") {
        return product.category === "Bracelet Collection" ||
               product.category === "Rudraksha Bracelet";
    }

    return product.category === category;

});

  grid.innerHTML = "";


  filtered.forEach(product => {

grid.innerHTML += `

<a href="product.html?id=${product.id}" class="collection-link">

<div class="card">

${
product.image.endsWith(".mp4")
?
`<video autoplay muted loop playsinline>
<source src="${product.image}" type="video/mp4">
</video>`
:
`<img src="${product.image}" alt="${product.name}">`
}

<h3>${product.name}</h3>

<p>${product.subCategory || ""}</p>

<p>${product.description}</p>

<div class="card-btn">
View Details →
</div>

</div>

</a>

`;

});

}
/* ===========================
   LOAD PRODUCT DETAILS
=========================== */

function loadProductDetails() {

  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");

const product = products.find(item => item.id == id);

  if (!id) return;

  const product = products.find(item => item.id === id);

  if (!product) return;

  document.getElementById("product-name").textContent = product.name;

  document.getElementById("product-category").textContent = product.category;
   document.getElementById("product-metal").textContent = product.metal || "";
document.getElementById("product-weight").textContent =
"Gross: " + (product.grossWeight || "") +
" | Net: " + (product.netWeight || "");

  document.getElementById("product-description").textContent = product.description;

  document.getElementById("main-image").src = product.image;

  document.getElementById("main-image").alt = product.name;

  document.getElementById("whatsapp-btn").href = product.whatsapp;

}
function loadReadyStock() {

  const grid = document.getElementById("ready-stock-grid");

  if (!grid) return;

  const buttons = document.querySelectorAll(".filter-btn");

  const readyProducts = products.filter(product => product.isReadyStock === true);

  function renderReadyStock(filter) {

    grid.innerHTML = "";

    const filtered = filter === "All"
      ? readyProducts
      : readyProducts.filter(product =>
          product.category === filter ||
          product.subCategory === filter
        );

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1;text-align:center;padding:40px;">
          <h3>No Ready Stock Available</h3>
        </div>
      `;
      return;
    }

    filtered.forEach(product => {

      grid.innerHTML += `

<a href="product.html?id=${product.id}" class="collection-link">

<div class="card">

${
product.image.endsWith(".mp4")
?
`<video autoplay muted loop playsinline>
<source src="${product.image}" type="video/mp4">
</video>`
:
`<img src="${product.image}" alt="${product.name}">`
}

<h3>${product.name}</h3>

<p>${product.subCategory || ""}</p>

<p>${product.description}</p>

<div class="card-btn">
View Details →
</div>

</div>

</a>

`;

    });

  }

  renderReadyStock("All");

  buttons.forEach(button => {

    button.addEventListener("click", () => {

      buttons.forEach(b => b.classList.remove("active"));

      button.classList.add("active");

      renderReadyStock(button.dataset.filter);

    });

  });

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
/* =========================
   SCROLL REVEAL
========================= */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {

    reveals.forEach(item => {

        const top = item.getBoundingClientRect().top;

        const windowHeight = window.innerHeight;

        if (top < windowHeight - 120) {

            item.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();
/* =========================
   SCROLL PROGRESS BAR
========================= */

const progressBar = document.getElementById("scrollProgress");

window.addEventListener("scroll", () => {

    const scrollTop = document.documentElement.scrollTop;

    const scrollHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const progress = (scrollTop / scrollHeight) * 100;

    progressBar.style.width = progress + "%";

});
const heroVideo = document.getElementById("heroVideo");
const heroImage = document.getElementById("heroImage");

if (heroVideo) {

    heroVideo.addEventListener("error", function () {
        heroVideo.style.display = "none";
        heroImage.style.display = "block";
    });

}

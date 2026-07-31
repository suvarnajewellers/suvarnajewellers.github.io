/* ==========================================
   SUVARNA JEWELLERS
   SCRIPT.JS V6 ENTERPRISE
========================================== */

"use strict";


/* ==========================================
   GLOBAL STORE
========================================== */

const SuvarnaApp = {

    products: [],

    currentProduct: null,

    readyStock: [],

    config: {

        whatsapp:
        "https://wa.me/917777991118"

    }

};


/* ==========================================
   DOM SELECTOR HELPERS
========================================== */

const DOM = {

    id(id){

        return document.getElementById(id);

    },


    select(selector){

        return document.querySelector(selector);

    },


    all(selector){

        return document.querySelectorAll(selector);

    }

};


/* ==========================================
   INITIALIZE WEBSITE
========================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{

    App.init();

});


const App = {


    async init(){

        await this.loadProducts();


        Router.init();


        ReadyStock.init();


        ProductPage.init();


        UI.init();


    }


};


/* ==========================================
   PRODUCTS DATA LOADER
========================================== */

App.loadProducts = async function(){


    try{


        const response =
        await fetch("products.json");


        if(!response.ok){

            throw new Error(
                "Products JSON loading failed"
            );

        }


        const data =
        await response.json();



        SuvarnaApp.products =
        Array.isArray(data)
        ?
        data
        :
        data.products || [];



        SuvarnaApp.readyStock =
        SuvarnaApp.products.filter(
            product =>
            product.isReadyStock === true
        );


        console.log(
            "Products Loaded:",
            SuvarnaApp.products.length
        );


    }

    catch(error){


        console.error(
            "Suvarna Error:",
            error
        );


    }


};


/* ==========================================
   ROUTER
========================================== */

const Router = {


    init(){

        this.page =
        window.location.pathname;


        console.log(
            "Current Page:",
            this.page
        );


    }


};


/* ==========================================
   END PART 1
   NEXT PART CONTINUES
========================================== */
/* ==========================================
   READY STOCK MODULE
========================================== */

const ReadyStock = {


    init(){

        const grid =
        DOM.id("ready-stock-grid");


        if(!grid){

            return;

        }


        this.grid = grid;


        this.buttons =
        DOM.all(".filter-btn");


        this.search =
        DOM.id("ready-search");


        this.activeFilter = "All";


        this.render();


        this.events();


    },



    events(){


        this.buttons.forEach(button=>{


            button.addEventListener(
            "click",
            ()=>{


                this.buttons.forEach(btn=>{

                    btn.classList.remove(
                        "active"
                    );

                });


                button.classList.add(
                    "active"
                );


                this.activeFilter =
                button.dataset.filter;


                this.render();


            });


        });



        if(this.search){


            this.search.addEventListener(
            "input",
            ()=>{

                this.render();

            });


        }


    },



    getFilteredProducts(){


        let products =
        SuvarnaApp.readyStock;



        if(this.activeFilter !== "All"){


            products =
            products.filter(product=>{


                return (

                    product.category ===
                    this.activeFilter

                    ||

                    product.subCategory ===
                    this.activeFilter

                );


            });


        }



        if(this.search){


            const keyword =
            this.search.value
            .toLowerCase()
            .trim();



            if(keyword){


                products =
                products.filter(product=>{


                    return (

                        product.name
                        .toLowerCase()
                        .includes(keyword)

                        ||

                        (product.description || "")
                        .toLowerCase()
                        .includes(keyword)


                    );


                });


            }


        }



        return products;


    },



    render(){


        const products =
        this.getFilteredProducts();



        ProductCard.render(
            products,
            this.grid
        );



        const count =
        DOM.id("ready-count");



        if(count){

            count.textContent =
            products.length;

        }


    }


};


/* ==========================================
   PRODUCT CARD COMPONENT
========================================== */

const ProductCard = {


    render(products, container){


        container.innerHTML = "";



        if(products.length === 0){


            container.innerHTML = `

            <div class="empty-product">

                No Products Available

            </div>

            `;


            return;


        }



        const html =
        products.map(product=>{


            return `


<a href="product.html?id=${product.id}"

class="collection-link">


<div class="card">


${this.media(product)}



<div class="card-content">


${

product.isReadyStock

?

`

<span class="ready-badge">

READY STOCK

</span>

`

:

""

}


<h3>

${product.name}

</h3>



<p>

${product.subCategory || ""}

</p>



<p>

${product.description || ""}

</p>



<div class="card-btn">

View Details →

</div>



</div>


</div>


</a>


`;



        }).join("");



        container.innerHTML =
        html;


    },



    media(product){


        if(
            product.image &&
            product.image.endsWith(".mp4")
        ){


            return `

            <video autoplay muted loop playsinline>

            <source src="${product.image}"

            type="video/mp4">

            </video>

            `;


        }



        return `

        <img

        src="${product.image}"

        alt="${product.name}"

        loading="lazy">

        `;


    }


};


/* ==========================================
   END PART 2
   NEXT PART CONTINUES
========================================== */
/* ==========================================
   CATEGORY PAGE MODULE
========================================== */

const CategoryPage = {


    init(){


        const grid =
        DOM.id("products-grid");


        if(!grid){

            return;

        }


        const category =
        this.detectCategory();



        const filtered =
        SuvarnaApp.products.filter(
            product=>{


                if(
                    category ===
                    "Bracelet Collection"
                ){

                    return (

                        product.category ===
                        "Bracelet Collection"

                        ||

                        product.category ===
                        "Rudraksha Bracelet"

                    );

                }


                return (

                    product.category ===
                    category

                );


            }

        );



        ProductCard.render(
            filtered,
            grid
        );


    },



    detectCategory(){


        const page =
        window.location.pathname
        .toLowerCase();



        if(page.includes("gold-jewellery"))

            return "Gold Jewellery";



        if(page.includes("silver-jewellery"))

            return "Silver Jewellery";



        if(page.includes("rudraksha-mala"))

            return "Rudraksha Mala";



        if(page.includes("tulsi-mala"))

            return "Tulsi Mala";



        if(page.includes("pendant-collection"))

            return "Pendant Collection";



        if(page.includes("bracelet-collection"))

            return "Bracelet Collection";



        return "";

    }


};



/* ==========================================
   PRODUCT DETAILS MODULE
========================================== */

const ProductPage = {


    init(){


        const id =
        new URLSearchParams(
            window.location.search
        ).get("id");



        if(!id){

            return;

        }



        const product =
        SuvarnaApp.products.find(
            item =>
            String(item.id) ===
            String(id)
        );



        if(!product){

            return;

        }



        SuvarnaApp.currentProduct =
        product;



        this.load(product);



    },



    load(product){



        this.text(
            "product-name",
            product.name
        );



        this.text(
            "product-category",
            product.category
        );



        this.text(
            "product-metal",
            product.metal
        );



        this.text(

            "product-weight",

            `Gross: ${
                product.grossWeight || "-"
            }

            |

            Net:
            ${
                product.netWeight || "-"
            }`

        );



        this.text(
            "product-description",
            product.description
        );



        const image =
        DOM.id("main-image");



        if(image){


            image.src =
            product.image;


            image.alt =
            product.name;


        }



        const whatsapp =
        DOM.id("whatsapp-btn");



        if(whatsapp){


            whatsapp.href =
            product.whatsapp ||
            SuvarnaApp.config.whatsapp;


        }



        RelatedProducts.load(
            product
        );


    },



    text(id,value){


        const element =
        DOM.id(id);



        if(element){


            element.textContent =
            value || "";


        }


    }


};


/* ==========================================
   END PART 3
   NEXT PART CONTINUES
========================================== */
/* ==========================================
   RELATED PRODUCTS MODULE
========================================== */

const RelatedProducts = {


    load(product){


        const grid =
        DOM.id("related-products");



        if(!grid){

            return;

        }



        const related =
        SuvarnaApp.products
        .filter(item =>

            item.category === product.category

            &&

            item.id !== product.id

        )

        .slice(0,4);



        ProductCard.render(
            related,
            grid
        );


    }


};



/* ==========================================
   MOBILE NAVIGATION
========================================== */

const MobileMenu = {


    init(){


        const button =
        DOM.id("menu-toggle");



        const menu =
        DOM.select(".nav-links");



        if(!button || !menu){

            return;

        }



        button.addEventListener(
        "click",
        ()=>{


            menu.classList.toggle(
                "active"
            );


        });



        DOM.all(
            ".nav-links a"
        )
        .forEach(link=>{


            link.addEventListener(
            "click",
            ()=>{


                menu.classList.remove(
                    "active"
                );


            });


        });


    }


};



/* ==========================================
   UI EFFECTS MODULE
========================================== */

const UI = {


    init(){


        MobileMenu.init();


        this.stickyNavbar();


        this.scrollReveal();


        this.scrollProgress();


        this.footerYear();


        this.lazyImages();


    },



    stickyNavbar(){


        const navbar =
        DOM.select(".navbar");



        if(!navbar){

            return;

        }



        window.addEventListener(
        "scroll",
        ()=>{


            if(window.scrollY > 40){


                navbar.classList.add(
                    "nav-scrolled"
                );


            }

            else{


                navbar.classList.remove(
                    "nav-scrolled"
                );


            }


        });


    },



    scrollReveal(){


        const items =
        DOM.all(".reveal");



        if(!items.length){

            return;

        }



        const observer =
        new IntersectionObserver(
        entries=>{


            entries.forEach(entry=>{


                if(entry.isIntersecting){


                    entry.target.classList.add(
                        "active"
                    );


                }


            });


        });



        items.forEach(item=>{

            observer.observe(item);

        });


    },



    scrollProgress(){


        const bar =
        DOM.id("scrollProgress");



        if(!bar){

            return;

        }



        window.addEventListener(
        "scroll",
        ()=>{


            const height =

            document.documentElement.scrollHeight

            -

            document.documentElement.clientHeight;



            const progress =

            (window.scrollY / height) * 100;



            bar.style.width =
            progress + "%";


        });


    },


/* ==========================================
   PART 5 STARTS FROM HERE
========================================== */
   /* ==========================================
   FOOTER YEAR
========================================== */

    footerYear(){


        const footer =
        DOM.select(".footer-copy");



        if(footer){


            footer.textContent =

            `© ${new Date().getFullYear()} 
            SUVARNA JEWELLERS. 
            All Rights Reserved.`;

        }


    },



/* ==========================================
   LAZY IMAGE LOADING
========================================== */

    lazyImages(){


        DOM.all("img")
        .forEach(image=>{


            image.loading =
            "lazy";


        });


    }


};


/* ==========================================
   IMAGE GALLERY MODULE
========================================== */

const Gallery = {


    init(){


        const main =
        DOM.id("main-image");



        const thumbs =
        DOM.all(".thumbnail");



        if(!main || !thumbs.length){

            return;

        }



        thumbs.forEach(image=>{


            image.addEventListener(
            "click",
            ()=>{


                main.src =
                image.src;



                thumbs.forEach(item=>{

                    item.classList.remove(
                        "active"
                    );

                });



                image.classList.add(
                    "active"
                );


            });


        });


    }


};



/* ==========================================
   HERO VIDEO FALLBACK
========================================== */

const HeroMedia = {


    init(){


        const video =
        DOM.id("heroVideo");



        const image =
        DOM.id("heroImage");



        if(!video || !image){

            return;

        }



        video.addEventListener(
        "error",
        ()=>{


            video.style.display =
            "none";


            image.style.display =
            "block";


        });


    }


};



/* ==========================================
   SMOOTH SCROLL
========================================== */

const SmoothScroll = {


    init(){


        DOM.all(
            'a[href^="#"]'
        )
        .forEach(anchor=>{


            anchor.addEventListener(
            "click",
            function(event){


                const target =
                document.querySelector(
                    this.getAttribute("href")
                );



                if(target){


                    event.preventDefault();



                    target.scrollIntoView({

                        behavior:"smooth"

                    });


                }


            });


        });


    }


};



/* ==========================================
   START ALL MODULES
========================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{


    CategoryPage.init();


    Gallery.init();


    HeroMedia.init();


    SmoothScroll.init();


});


/* ==========================================
   END PART 5
   NEXT PART CONTINUES
========================================== */
/* ==========================================
   SEARCH MODULE
========================================== */

const ProductSearch = {


    init(){


        const searchInput =
        DOM.id("product-search");



        const grid =
        DOM.id("products-grid");



        if(!searchInput || !grid){

            return;

        }



        searchInput.addEventListener(
        "input",
        ()=>{


            const keyword =
            searchInput.value
            .toLowerCase()
            .trim();



            const filtered =
            SuvarnaApp.products.filter(
            product=>{


                return (

                    product.name
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    (product.category || "")
                    .toLowerCase()
                    .includes(keyword)

                    ||

                    (product.description || "")
                    .toLowerCase()
                    .includes(keyword)

                );


            });



            ProductCard.render(
                filtered,
                grid
            );


        });


    }


};



/* ==========================================
   WHATSAPP SHARE
========================================== */

const WhatsAppShare = {


    init(){


        const buttons =
        DOM.all(".whatsapp-share");



        if(!buttons.length){

            return;

        }



        buttons.forEach(button=>{


            button.addEventListener(
            "click",
            ()=>{


                const url =
                window.location.href;



                const text =
                encodeURIComponent(

                "SUVARNA JEWELLERS Product\n\n"
                + url

                );



                window.open(

                `https://wa.me/?text=${text}`,

                "_blank"

                );


            });


        });


    }


};



/* ==========================================
   PRODUCT COUNTER
========================================== */

const ProductCounter = {


    init(){


        const counter =
        DOM.id("product-count");



        if(!counter){

            return;

        }



        let number =
        0;



        const total =
        SuvarnaApp.products.length;



        const timer =
        setInterval(
        ()=>{


            number +=
            Math.ceil(total / 40);



            if(number >= total){


                number = total;


                clearInterval(timer);


            }



            counter.textContent =
            number + "+";


        },
        40);



    }


};


/* ==========================================
   END PART 6
   NEXT PART CONTINUES
========================================== */
/* ==========================================
   PRODUCT FILTER ENGINE
========================================== */

const FilterEngine = {


    apply(products, filter){


        if(
            !filter ||
            filter === "All"
        ){

            return products;

        }



        return products.filter(
        product=>{


            return (

                product.category === filter

                ||

                product.subCategory === filter

            );


        });


    }


};



/* ==========================================
   READY STOCK AUTO REFRESH
========================================== */

const Inventory = {


    refresh(){


        SuvarnaApp.readyStock =

        SuvarnaApp.products.filter(
        product =>

        product.isReadyStock === true

        );


    }


};



/* ==========================================
   BACK TO TOP
========================================== */

const BackToTop = {


    init(){


        const button =
        DOM.id("scrollTopBtn");



        if(!button){

            return;

        }



        window.addEventListener(
        "scroll",
        ()=>{


            button.style.display =

            window.scrollY > 400

            ?

            "block"

            :

            "none";


        });



        button.addEventListener(
        "click",
        ()=>{


            window.scrollTo({

                top:0,

                behavior:"smooth"

            });


        });


    }


};



/* ==========================================
   ERROR HANDLING
========================================== */

window.addEventListener(
"error",
(event)=>{


    console.error(

        "Suvarna Website Error:",

        event.message

    );


});



/* ==========================================
   FINAL INITIALIZATION
========================================== */

document.addEventListener(
"DOMContentLoaded",
()=>{


    Inventory.refresh();


    ProductSearch.init();


    WhatsAppShare.init();


    ProductCounter.init();


    BackToTop.init();


});


/* ==========================================
   SUVARNA JEWELLERS V6
   SCRIPT END
========================================== */

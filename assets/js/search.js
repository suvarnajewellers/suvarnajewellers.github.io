/* ==========================================
   SUVARNA JEWELLERS V8
   SEARCH.JS
========================================== */


/* ==========================
   SEARCH INITIALIZE
========================== */

document.addEventListener(
"DOMContentLoaded",
function(){


    const searchInput =
    document.getElementById(
        "searchInput"
    );


    if(!searchInput) return;



    searchInput.addEventListener(

        "input",

        debounce(
            function(e){

                performSearch(
                    e.target.value
                );

            },
            300
        )

    );


});



/* ==========================
   SEARCH FUNCTION
========================== */

async function performSearch(keyword){

    const resultBox =
    document.getElementById(
        "searchResults"
    );

    if(!resultBox) return;

    resultBox.innerHTML = "";

    if(keyword.length < 2){

        resultBox.classList.remove(
            "active"
        );

        return;

    }

    const results =
    await searchProducts(keyword);

    if(results.length === 0){

        resultBox.innerHTML = `

        <div class="no-result">

            No jewellery found.

        </div>

        `;

        resultBox.classList.add(
            "active"
        );

        return;

    }

    results
    .slice(0,8)
    .forEach(product=>{

        resultBox.innerHTML += `

        <a
        href="product.html?id=${product.id}"
        class="search-item">

            <img
            src="${getImage(product.image)}"
            alt="${product.name}">

            <div>

                <h4>${product.name}</h4>

                <span>${product.category}</span>

            </div>

        </a>

        `;

    });

    resultBox.classList.add(
        "active"
    );

}


/* ==========================
   CLOSE SEARCH
========================== */

document.addEventListener(
"click",
function(e){


    const box =
    document.getElementById(
        "searchResults"
    );


    const input =
    document.getElementById(
        "searchInput"
    );



    if(

        box &&
        input &&
        !box.contains(e.target) &&
        e.target !== input

    ){

        box.classList.remove(
            "active"
        );

    }


});

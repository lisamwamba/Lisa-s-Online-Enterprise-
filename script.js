/* =========================================================
   LISA'S ONLINE ENTERPRISE
   COMPLETE WEBSITE JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       SHOPPING CART
    ===================================================== */

    let cart = JSON.parse(localStorage.getItem("lisaCart")) || [];


    /* =====================================================
       CREATE CART BUTTON
    ===================================================== */

    const cartButton = document.createElement("button");

    cartButton.id = "cart-button";
    cartButton.innerHTML = "🛒 Cart (<span id='cart-count'>0</span>)";

    document.body.appendChild(cartButton);


    /* =====================================================
       CREATE CART WINDOW
    ===================================================== */

    const cartModal = document.createElement("div");

    cartModal.id = "cart-modal";

    cartModal.innerHTML = `
        <div class="cart-content">

            <div class="cart-header">

                <h2>Your Shopping Cart</h2>

                <button id="close-cart">
                    ×
                </button>

            </div>

            <div id="cart-items"></div>

            <div class="cart-summary">

                <h3>
                    Total:
                    <span id="cart-total">K0</span>
                </h3>

                <button id="clear-cart">
                    Clear Cart
                </button>

                <button id="checkout-whatsapp">
                    Order on WhatsApp
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(cartModal);


    /* =====================================================
       GET PRODUCT BUTTONS
    ===================================================== */

    const addToCartButtons =
        document.querySelectorAll(".product-info button");


    /* =====================================================
       ADD PRODUCTS TO CART
    ===================================================== */

    addToCartButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productCard =
                button.closest(".product-card");


            if (!productCard) {
                return;
            }


            const productName =
                productCard.querySelector("h3").textContent.trim();


            const priceText =
                productCard.querySelector(".price").textContent.trim();


            const price =
                parseFloat(
                    priceText
                        .replace("K", "")
                        .replace(",", "")
                        .trim()
                );


            const imageElement =
                productCard.querySelector("img");


            const image =
                imageElement
                    ? imageElement.getAttribute("src")
                    : "";


            /* Find existing product */

            const existingProduct =
                cart.find(function (product) {

                    return product.name === productName;

                });


            if (existingProduct) {

                existingProduct.quantity++;

            } else {

                cart.push({

                    name: productName,

                    price: price,

                    image: image,

                    quantity: 1

                });

            }


            saveCart();

            updateCart();

            showMessage(
                productName + " added to your cart!"
            );

        });

    });


    /* =====================================================
       SAVE CART
    ===================================================== */

    function saveCart() {

        localStorage.setItem(
            "lisaCart",
            JSON.stringify(cart)
        );

    }


    /* =====================================================
       UPDATE CART
    ===================================================== */

    function updateCart() {

        const cartItems =
            document.getElementById("cart-items");

        const cartCount =
            document.getElementById("cart-count");

        const cartTotal =
            document.getElementById("cart-total");


        /* Calculate number of products */

        let totalItems = 0;

        cart.forEach(function (product) {

            totalItems += product.quantity;

        });


        cartCount.textContent = totalItems;


        /* Empty cart */

        if (cart.length === 0) {

            cartItems.innerHTML = `
                <div class="empty-cart">

                    <h3>Your cart is empty</h3>

                    <p>
                        Add some beautiful products
                        to your cart.
                    </p>

                </div>
            `;

            cartTotal.textContent = "K0";

            return;
        }


        /* Display cart products */

        cartItems.innerHTML = "";


        cart.forEach(function (product, index) {

            const item =
                document.createElement("div");

            item.className = "cart-item";


            item.innerHTML = `

                <img
                    src="${product.image}"
                    alt="${product.name}"
                >

                <div class="cart-item-info">

                    <h4>
                        ${product.name}
                    </h4>

                    <p>
                        Price: K${product.price}
                    </p>

                    <div class="quantity-controls">

                        <button
                            class="decrease"
                            data-index="${index}">
                            -
                        </button>

                        <strong>
                            ${product.quantity}
                        </strong>

                        <button
                            class="increase"
                            data-index="${index}">
                            +
                        </button>

                        <button
                            class="remove-item"
                            data-index="${index}">
                            Remove
                        </button>

                    </div>

                </div>
            `;


            cartItems.appendChild(item);

        });


        /* Calculate total */

        const total =
            calculateTotal();


        cartTotal.textContent =
            "K" + total.toFixed(2);


        addCartButtonEvents();

    }


    /* =====================================================
       CALCULATE TOTAL
    ===================================================== */

    function calculateTotal() {

        let total = 0;


        cart.forEach(function (product) {

            total +=
                product.price *
                product.quantity;

        });


        return total;

    }


    /* =====================================================
       QUANTITY BUTTONS
    ===================================================== */

    function addCartButtonEvents() {

        const increaseButtons =
            document.querySelectorAll(".increase");


        const decreaseButtons =
            document.querySelectorAll(".decrease");


        const removeButtons =
            document.querySelectorAll(".remove-item");


        /* Increase */

        increaseButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const index =
                    parseInt(
                        button.getAttribute("data-index")
                    );


                cart[index].quantity++;


                saveCart();

                updateCart();

            });

        });


        /* Decrease */

        decreaseButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const index =
                    parseInt(
                        button.getAttribute("data-index")
                    );


                if (cart[index].quantity > 1) {

                    cart[index].quantity--;

                } else {

                    cart.splice(index, 1);

                }


                saveCart();

                updateCart();

            });

        });


        /* Remove */

        removeButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const index =
                    parseInt(
                        button.getAttribute("data-index")
                    );


                cart.splice(index, 1);


                saveCart();

                updateCart();

            });

        });

    }


    /* =====================================================
       OPEN CART
    ===================================================== */

    cartButton.addEventListener("click", function () {

        cartModal.style.display = "block";

        updateCart();

    });


    /* =====================================================
       CLOSE CART
    ===================================================== */

    document
        .getElementById("close-cart")
        .addEventListener("click", function () {

            cartModal.style.display = "none";

        });


    /* =====================================================
       CLOSE CART WHEN CLICKING OUTSIDE
    ===================================================== */

    cartModal.addEventListener("click", function (event) {

        if (event.target === cartModal) {

            cartModal.style.display = "none";

        }

    });


    /* =====================================================
       CLEAR CART
    ===================================================== */

    document
        .getElementById("clear-cart")
        .addEventListener("click", function () {

            if (cart.length === 0) {

                return;

            }


            const confirmClear =
                confirm(
                    "Are you sure you want to clear your cart?"
                );


            if (confirmClear) {

                cart = [];

                saveCart();

                updateCart();

            }

        });


    /* =====================================================
       WHATSAPP CHECKOUT
    ===================================================== */

    document
        .getElementById("checkout-whatsapp")
        .addEventListener("click", function () {

            if (cart.length === 0) {

                alert(
                    "Your cart is empty. Please add products first."
                );

                return;

            }


            let message =
                "Hello Lisa's Online Enterprise!%0A%0A";

            message +=
                "I would like to order:%0A%0A";


            cart.forEach(function (product) {

                message +=
                    "• " +
                    product.name +
                    " x" +
                    product.quantity +
                    " - K" +
                    (
                        product.price *
                        product.quantity
                    ).toFixed(2) +
                    "%0A";

            });


            message +=
                "%0A";

            message +=
                "Total: K" +
                calculateTotal().toFixed(2);


            /* Your WhatsApp number */

            const whatsappNumber =
                "260973954592";


            const whatsappURL =
                "https://wa.me/" +
                whatsappNumber +
                "?text=" +
                message;


            window.open(
                whatsappURL,
                "_blank"
            );

        });


    /* =====================================================
       SIMPLE MESSAGE
    ===================================================== */

    function showMessage(message) {

        const notification =
            document.createElement("div");


        notification.textContent =
            message;


        notification.style.position =
            "fixed";


        notification.style.top =
            "20px";


        notification.style.right =
            "20px";


        notification.style.zIndex =
            "5000";


        notification.style.background =
            "#111";


        notification.style.color =
            "white";


        notification.style.padding =
            "15px 20px";


        notification.style.borderRadius =
            "8px";


        notification.style.boxShadow =
            "0 5px 20px rgba(0,0,0,0.25)";


        document.body.appendChild(
            notification
        );


        setTimeout(function () {

            notification.remove();

        }, 2500);

    }


    /* =====================================================
       INITIAL CART LOAD
    ===================================================== */

    updateCart();


    /* =====================================================
       SMOOTH NAVIGATION
    ===================================================== */

    const navigationLinks =
        document.querySelectorAll(
            '.navbar a[href^="#"]'
        );


    navigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetID =
                link.getAttribute("href");


            const target =
                document.querySelector(targetID);


            if (target) {

                event.preventDefault();


                target.scrollIntoView({

                    behavior: "smooth",

                    block: "start"

                });

            }

        });

    });

});
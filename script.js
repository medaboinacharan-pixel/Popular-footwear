document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       CART DATA
    ===================================================== */

    let cart = JSON.parse(localStorage.getItem("cart")) || [];


    /* =====================================================
       UPDATE CART COUNT
    ===================================================== */

    function updateCartCount() {

        const cartCounts =
            document.querySelectorAll(".cart-count");

        let totalItems = cart.reduce(function (total, item) {
            return total + Number(item.quantity);
        }, 0);

        cartCounts.forEach(function (count) {
            count.textContent = totalItems;
        });
    }


    /* =====================================================
       ADD TO CART
       Works with product/product.html
    ===================================================== */

    const addButtons =
        document.querySelectorAll(".add-to-cart");

    addButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const product =
                button.closest(".product");

            if (!product) {
                return;
            }


            /* Product name */

            const name =
                button.dataset.product ||
                product.querySelector("h3")?.textContent.trim() ||
                "Product";


            /* Product image */

            const imageElement =
                product.querySelector("img");

            const image =
                imageElement
                    ? imageElement.src
                    : "";


            /* Category */

            const categoryElement =
                product.querySelector(".category");

            const category =
                categoryElement
                    ? categoryElement.textContent.trim()
                    : "";


            /* Price */

            const priceElement =
                product.querySelector(".price");

            const priceText =
                priceElement
                    ? priceElement.textContent.trim()
                    : "0";


            const price =
                parseFloat(
                    priceText
                        .replace("$", "")
                        .replace(",", "")
                        .trim()
                ) || 0;


            /* Check if product already exists */

            const existingProduct =
                cart.find(function (item) {

                    return item.name === name;

                });


            if (existingProduct) {

                existingProduct.quantity += 1;

            } else {

                cart.push({

                    name: name,

                    image: image,

                    category: category,

                    price: price,

                    quantity: 1

                });

            }


            /* Save cart */

            localStorage.setItem(
                "cart",
                JSON.stringify(cart)
            );


            /* Button feedback */

            button.textContent = "✅";

            setTimeout(function () {

                button.textContent = "🛒";

            }, 1000);


            updateCartCount();

        });

    });


    /* =====================================================
       CART PAGE
    ===================================================== */

    const cartItems =
        document.querySelector(".cart-items");


    if (cartItems) {

        const subtotalElement =
            document.getElementById("subtotal");

        const discountElement =
            document.getElementById("discount");

        const totalElement =
            document.getElementById("total");

        const oldTotalElement =
            document.getElementById("oldTotal");


        let couponDiscount = 0;


        /* =================================================
           DISPLAY CART
        ================================================= */

        function displayCart() {

            cartItems.innerHTML = "";

            let subtotal = 0;

            let totalItems = 0;


            /* Empty cart */

            if (cart.length === 0) {

                cartItems.innerHTML = `
                    <div class="empty-cart">
                        Your cart is empty 🛒
                    </div>
                `;


                if (subtotalElement) {
                    subtotalElement.textContent =
                        "$0.00";
                }


                if (discountElement) {
                    discountElement.textContent =
                        "$0.00";
                }


                if (totalElement) {
                    totalElement.textContent =
                        "$0.00";
                }


                if (oldTotalElement) {
                    oldTotalElement.textContent =
                        "";
                }


                updateCartCount();

                return;
            }


            /* Display products */

            cart.forEach(function (item, index) {

                const itemPrice =
                    Number(item.price) || 0;

                const itemQuantity =
                    Number(item.quantity) || 1;


                subtotal +=
                    itemPrice * itemQuantity;


                totalItems +=
                    itemQuantity;


                const product =
                    document.createElement("div");

                product.className =
                    "cart-product";


                product.innerHTML = `

                    <div class="product-image">

                        <img
                            src="${item.image}"
                            alt="${item.name}"
                        >

                    </div>


                    <div class="product-details">

                        <h2>
                            ${item.name}
                        </h2>

                        <p>
                            ${item.category}
                        </p>

                        <p class="product-price">
                            $${itemPrice.toFixed(2)}
                        </p>

                        <button
                            class="remove-btn"
                            data-index="${index}">
                            REMOVE
                        </button>

                    </div>


                    <div class="quantity">

                        <button
                            class="quantity-btn plus"
                            data-index="${index}">
                            +
                        </button>


                        <div class="quantity-number">
                            ${itemQuantity}
                        </div>


                        <button
                            class="quantity-btn minus"
                            data-index="${index}">
                            −
                        </button>

                    </div>

                `;


                cartItems.appendChild(product);

            });


            /* Cart count */

            updateCartCount();


            /* Calculate total */

            const finalTotal =
                Math.max(
                    0,
                    subtotal - couponDiscount
                );


            if (subtotalElement) {

                subtotalElement.textContent =
                    `$${subtotal.toFixed(2)}`;

            }


            if (discountElement) {

                discountElement.textContent =
                    `$${couponDiscount.toFixed(2)}`;

            }


            if (totalElement) {

                totalElement.textContent =
                    `$${finalTotal.toFixed(2)}`;

            }


            if (oldTotalElement) {

                if (couponDiscount > 0) {

                    oldTotalElement.textContent =
                        `$${subtotal.toFixed(2)}`;

                } else {

                    oldTotalElement.textContent =
                        "";

                }

            }

        }


        /* =================================================
           CART BUTTONS
        ================================================= */

        cartItems.addEventListener(
            "click",
            function (event) {

                const target =
                    event.target;


                const index =
                    target.dataset.index;


                if (index === undefined) {
                    return;
                }


                /* PLUS */

                if (
                    target.classList.contains("plus")
                ) {

                    cart[index].quantity++;

                }


                /* MINUS */

                if (
                    target.classList.contains("minus")
                ) {

                    if (
                        cart[index].quantity > 1
                    ) {

                        cart[index].quantity--;

                    } else {

                        cart.splice(index, 1);

                    }

                }


                /* REMOVE */

                if (
                    target.classList.contains("remove-btn")
                ) {

                    cart.splice(index, 1);

                }


                /* Save */

                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );


                displayCart();

            }
        );


        /* =================================================
           DISCOUNT
        ================================================= */

        const discountArrow =
            document.getElementById(
                "discountArrow"
            );


        const discountBox =
            document.getElementById(
                "discountBox"
            );


        const applyDiscount =
            document.getElementById(
                "applyDiscount"
            );


        const discountCode =
            document.getElementById(
                "discountCode"
            );


        const discountMessage =
            document.getElementById(
                "discountMessage"
            );


        /* Open discount box */

        if (
            discountArrow &&
            discountBox
        ) {

            discountArrow.addEventListener(
                "click",
                function () {

                    discountBox.classList.toggle(
                        "active"
                    );

                }
            );

        }


        /* Apply discount */

        if (
            applyDiscount &&
            discountCode
        ) {

            applyDiscount.addEventListener(
                "click",
                function () {

                    const code =
                        discountCode.value
                            .trim()
                            .toUpperCase();


                    if (code === "SAVE10") {

                        couponDiscount = 10;


                        if (discountMessage) {

                            discountMessage.textContent =
                                "Discount applied successfully!";

                            discountMessage.style.color =
                                "green";

                        }

                    } else {

                        couponDiscount = 0;


                        if (discountMessage) {

                            discountMessage.textContent =
                                "Invalid discount code.";

                            discountMessage.style.color =
                                "red";

                        }

                    }


                    displayCart();

                }
            );

        }


        /* =================================================
           CHECKOUT
        ================================================= */

        const checkoutBtn =
            document.getElementById(
                "checkoutBtn"
            );


        if (checkoutBtn) {

            checkoutBtn.addEventListener(
                "click",
                function () {

                    if (cart.length === 0) {

                        alert(
                            "Your cart is empty!"
                        );

                        return;

                    }


                    window.location.href =
                        "checkout.html";

                }
            );

        }


        /* Initial cart display */

        displayCart();

    }


    /* =====================================================
       LOGIN
    ===================================================== */

    const loginForm =
        document.getElementById(
            "loginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const usernameElement =
                    document.getElementById(
                        "username"
                    );


                const passwordElement =
                    document.getElementById(
                        "password"
                    );


                const username =
                    usernameElement
                        ? usernameElement.value.trim()
                        : "";


                const password =
                    passwordElement
                        ? passwordElement.value.trim()
                        : "";


                if (
                    username &&
                    password
                ) {

                    alert(
                        "Login successful!"
                    );


                    /*
                       login.html is inside
                       components/
                    */

                    window.location.href =
                        "../index.html";

                } else {

                    alert(
                        "Please enter username and password."
                    );

                }

            }
        );

    }


    /* =====================================================
       SIGNUP
    ===================================================== */

    const signupForm =
        document.getElementById(
            "signupForm"
        );


    if (signupForm) {

        signupForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const username =
                    document.getElementById(
                        "new-username"
                    );


                const email =
                    document.getElementById(
                        "new-email"
                    );


                const password =
                    document.getElementById(
                        "new-password"
                    );


                const usernameValue =
                    username
                        ? username.value.trim()
                        : "";


                const emailValue =
                    email
                        ? email.value.trim()
                        : "";


                const passwordValue =
                    password
                        ? password.value.trim()
                        : "";


                if (
                    usernameValue &&
                    emailValue &&
                    passwordValue
                ) {

                    alert(
                        "Account created successfully!"
                    );


                    /*
                       signup.html and
                       login.html are in
                       the same components folder
                    */

                    window.location.href =
                        "login.html";

                } else {

                    alert(
                        "Please fill all fields."
                    );

                }

            }
        );

    }


    /* =====================================================
       CONTACT FORM
    ===================================================== */

    const contactForm =
        document.getElementById(
            "contactForm"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const name =
                    document.getElementById(
                        "name"
                    )?.value.trim();


                const email =
                    document.getElementById(
                        "email"
                    )?.value.trim();


                const message =
                    document.getElementById(
                        "message"
                    )?.value.trim();


                if (
                    name &&
                    email &&
                    message
                ) {

                    alert(
                        "Thank you! Your message has been sent."
                    );


                    contactForm.reset();

                } else {

                    alert(
                        "Please fill all required fields."
                    );

                }

            }
        );

    }


    /* =====================================================
       INITIAL CART COUNT
    ===================================================== */

    updateCartCount();

});

/* =====================================================
   PRODUCT DETAILS PAGE
===================================================== */

const productImage = document.getElementById("productImage");

if (productImage) {

    const params =
        new URLSearchParams(window.location.search);

    const productId =
        params.get("product");


    const products = {

        shoes: {
            name: "Shoes",
            category: "Men",
            price: 50,
            image: "../products/shoe.avif",
            description:
                "Comfortable and stylish shoes for everyday wear."
        },

        sneakers: {
            name: "Sneakers",
            category: "Women",
            price: 60,
            image: "../products/Sneakers.webp",
            description:
                "Trendy sneakers designed for comfort and style."
        },

        "kids-shoes": {
            name: "Kids Shoes",
            category: "Kids",
            price: 40,
            image: "../products/Kids Shoes.jpg",
            description:
                "Comfortable and durable shoes for kids."
        },

        "running-shoes": {
            name: "Running Shoes",
            category: "Unisex",
            price: 80,
            image: "../products/Running-Shoes.jpg",
            description:
                "Lightweight running shoes with excellent grip."
        },

        sandals: {
            name: "Sandals",
            category: "Men",
            price: 50,
            image: "../products/Sandals.webp",
            description:
                "Comfortable sandals for everyday use."
        },

        slippers: {
            name: "Slippers",
            category: "Women",
            price: 60,
            image: "../products/Slippers women.avif",
            description:
                "Soft and comfortable slippers for daily wear."
        },

        "kids-flips": {
            name: "Kids Flips",
            category: "Kids",
            price: 40,
            image: "../products/kids flips.jpg",
            description:
                "Fun and comfortable footwear for kids."
        }

    };


    const productData =
        products[productId];


    if (productData) {

        document.getElementById("productImage").src =
            productData.image;

        document.getElementById("productImage").alt =
            productData.name;

        document.getElementById("productName").textContent =
            productData.name;

        document.getElementById("productCategory").textContent =
            productData.category;

        document.getElementById("productPrice").textContent =
            `$${productData.price}`;

        document.getElementById("productDescription").textContent =
            productData.description;


        /* ==========================================
           QUANTITY
        ========================================== */

        let quantity = 1;

        const quantityElement =
            document.getElementById("quantity");

        document.getElementById("plusBtn")
            .addEventListener("click", function () {

                quantity++;

                quantityElement.textContent =
                    quantity;

            });


        document.getElementById("minusBtn")
            .addEventListener("click", function () {

                if (quantity > 1) {

                    quantity--;

                    quantityElement.textContent =
                        quantity;
                }

            });


        /* ==========================================
           ADD TO CART
        ========================================== */

        document
            .getElementById("detailAddToCart")
            .addEventListener("click", function () {

                const existingProduct =
                    cart.find(function (item) {

                        return item.name ===
                            productData.name;

                    });


                if (existingProduct) {

                    existingProduct.quantity +=
                        quantity;

                } else {

                    cart.push({

                        name: productData.name,

                        image: productData.image,

                        category: productData.category,

                        price: productData.price,

                        quantity: quantity

                    });

                }


                localStorage.setItem(
                    "cart",
                    JSON.stringify(cart)
                );


                updateCartCount();


                this.textContent =
                    "✅ Added to Cart";


                setTimeout(() => {

                    this.textContent =
                        "🛒 Add to Cart";

                }, 1500);

            });

    }

}
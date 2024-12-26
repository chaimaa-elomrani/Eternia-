const countryList = document.getElementById("country-list");
const selectedCountry = document.getElementById("selected-country");
const toggleButton = document.querySelector("#shipping_estimator button");
const mainContainer = document.querySelector(".flex.items-center.justify-between");
const pdf = document.getElementById("pdf")

const checkoutButton = document.getElementById("checkout");
const purchasedSection = document.getElementById("purchased");
const shippingEstimator = document.getElementById("shipping_estimator");
const purchaseAnimation = document.getElementById("purchase-animation");

const countries = ["Morocco", "United States", "Canada", "France", "Germany", "United Kingdom", "Australia", "Japan", "China", "India"];


// Shipping estimator country list start
countries.forEach(country => {
    const countryItem = document.createElement("div");
    countryItem.textContent = country;

    countryItem.addEventListener("click", () => {
        selectedCountry.textContent = country;
        countryList.classList.add("hidden");
    });

    countryList.appendChild(countryItem);
});

toggleButton.addEventListener("click", () => {
    countryList.classList.toggle("hidden");

    if (countryList.classList.contains("hidden")) {
        mainContainer.classList.add("rounded");
    } else {
        mainContainer.classList.remove("rounded"); 
    }
});
// Shipping estimator country list end


// Handling cart items start
document.addEventListener("DOMContentLoaded", function() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to format the price with spaces start
    function formatPrice(price) {
        return `$ ${price.toLocaleString()}`;
    }
    // Function to format the price with spaces end

    // Updating the total price function start
    function updateSubtotal() {
        const subtotalElement = document.getElementById("subtotal");
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        subtotalElement.textContent = ` ${formatPrice(subtotal)}`;
    }
    // Updating the total price function end

    // Function to delete cart items start
    function deleteCartItem(index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
    }
    // Function to delete cart items end

    // Handle empty Cart start
    function handleEmptyCart() {
        const container = document.getElementById("purchased-items-container");
        if (cart.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.classList.add("text-center", "text-gray-700", "my-8", "text-xl","mt-24");
            emptyMessage.textContent = "Your exquisite collection awaits... Embrace the allure of the finest.";

            const catalogLink = document.createElement("a");
            catalogLink.classList.add("underline", "text-center", "text-goldenrod", "text-lg", "mt-2", "mb-2", "block");
            catalogLink.href = "All_Products.html";
            catalogLink.textContent = "Explore Our Catalog";

            const subtotal = document.getElementById("rm-subtotal")
            const cart_buttons = document.getElementById("cart-buttons")
            container.classList.add("h-[300px]")
            subtotal.style.display="none"
            cart_buttons.style.display="none"

            container.appendChild(emptyMessage);
            container.appendChild(catalogLink);
        }
    }
    // Handle empty Cart end

    // creation of cart item start
    function renderCartItems() {
        const container = document.getElementById("purchased-items-container");
        container.innerHTML = "";

        const divider = document.createElement("div");
        divider.className = "w-full h-px bg-gray_used_in_divider_lines";
        container.appendChild(divider);

        if (cart.length > 0) {
            cart.forEach((item, index) => {
                const itemElement = document.createElement("article");
                itemElement.className = "py-11 h-min border-b border-gray_used_in_divider_lines flex flex-col 503:flex-row justify-between";

                itemElement.innerHTML = `
                    <div class="flex gap-4">
                        <img class="object-cover border border-[rgba(0,0,0,0.24)] mb-4" src="${item.selectedImage}" alt="${item.name}" width="148" height="200">
                        <div class="flex flex-col text-left pt-4">
                            <h1 class="text-xl md:text-4xl font-montaga">${item.name}</h1>
                            <p class="text-xl text-darkGolden">$ ${item.price}</p>
                        </div>
                    </div>
                    <div class="flex flex-col gap-4 self-center pr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" class="503:self-end 503:translate-x-0 translate-x-[5.5rem] cursor-pointer trash" height="20px" viewBox="0 -960 960 960" width="20px" onclick="deleteCartItem(${index})">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
                        </svg>
                        <div class="flex items-center gap-2">
                            <label class="text-gray_used_in_small_text text-nowrap">Qty :</label>
                            <div class="flex items-center border-2">
                                <button class="w-8 h-8 bg-button_divs_background flex items-center justify-center" onclick="updateQuantity(${index}, -1)">
                                    <img src="../images/Icons/minus.svg" alt="Decrease Quantity">
                                </button>
                                <input type="text" value="${item.quantity}" class="w-12 h-8 text-center" readonly>
                                <button class="w-8 h-8 bg-button_divs_background flex items-center justify-center" onclick="updateQuantity(${index}, 1)">
                                    <img src="../images/Icons/plus.svg" alt="Increase Quantity">
                                </button>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 self-end">
                            <label class="text-gray_used_in_small_text">Size :</label>
                            <div class="relative inline-block border-2">
                                <select class="w-24 h-8 pl-3 pr-8 bg-white cursor-pointer focus:outline-none" onchange="updateSize(${index}, this.value)">
                                    <option ${item.size === "6" ? "selected" : ""}>6</option>
                                    <option ${item.size === "7" ? "selected" : ""}>7</option>
                                    <option ${item.size === "8" ? "selected" : ""}>8</option>
                                    <option ${item.size === "9" ? "selected" : ""}>9</option>
                                    <option ${item.size === "10" ? "selected" : ""}>10</option>
                                </select>
                                <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none bg-button_divs_background">
                                    <img src="../images/Icons/arrow down.svg" alt="Dropdown arrow" class="w-4 h-4">
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                container.appendChild(itemElement);
            });
        } else {
            handleEmptyCart();
        }

        updateSubtotal();
    }
    // creation of cart item end


    // Update quantity function start
    window.updateQuantity = function(index, change) {
        if (cart[index].quantity + change > 0) {
            cart[index].quantity += change;
            localStorage.setItem("cart", JSON.stringify(cart));
            renderCartItems();
        }
    };
    // Update quantity function end


    // Update size function start
    window.updateSize = function(index, newSize) {
        cart[index].size = newSize;
        localStorage.setItem("cart", JSON.stringify(cart));
    };
    // Update size function end

    // Add delete function to window for inline use
    window.deleteCartItem = deleteCartItem;

    renderCartItems();
});
// Handling cart items end


// Redirecting to pdf page start
pdf.addEventListener("click",()=>{
    window.location.href = "../html/Estimate_pdf.html"
})
// Redirecting to pdf page end

// Redirecting to home after animation start
checkoutButton.addEventListener("click", (event) => {
    event.preventDefault();

    purchasedSection.style.display = "none";
    shippingEstimator.style.display = "none";

    purchaseAnimation.style.display = "flex";

    setTimeout(() => {
        window.location.href = "../../index.html";
    }, 7000);
});
// Redirecting to home after animation end


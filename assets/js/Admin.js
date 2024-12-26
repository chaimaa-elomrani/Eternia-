let products = JSON.parse(localStorage.getItem("products")) || [];

let currentFilters = {
    search: "",
    category: "all",
    gender: "all",
    sortBy: "none",
};

// Toggle form visibility start
function toggleForm() {
    const form = document.getElementById("productForm");
    const product_management_filter = document.getElementById("product-management-filter");

    if (form && product_management_filter) {
        form.classList.toggle("hidden");
        product_management_filter.classList.toggle("hidden");

        if (form.classList.contains("hidden")) {
        document.getElementById("productId").value = "";
        document.querySelector("form").reset();
        }
    } else {
        console.error("Required elements not found");
    }
}
// Toggle form visibility end

// Load products from JSON start
async function loadProductData() {
    try {
        const response = await fetch("../Data/products.json");
        const data = await response.json();

        products = [];

        products = (data.products || []).map((product) => ({
            id: product.id || generateUniqueId(),
            name: product.name || "",
            category: product.category || "other",
            price: parseFloat(product.price) || 0,
            description: product.description || "",
            inStock: Boolean(product.inStock),
            gender: product.gender || "unisex",
        }));
        
            localStorage.setItem("products", JSON.stringify(products));
            updateDashboard();
            displayProducts();
        } catch (error) {
            console.error("Error loading product data:", error);
        }
}
// Load products from JSON end


// Update dashboard stats start
function updateDashboard() {
    document.getElementById("totalProducts").textContent = products.length;
    document.getElementById("inStockCount").textContent = products.filter((p) => p.inStock).length;
    document.getElementById("outOfStockCount").textContent = products.filter(
        (p) => !p.inStock
    ).length;
}
// Update dashboard stats end


// Display products with filters start
function displayProducts() {
    const tableBody = document.getElementById("productTable");
    tableBody.innerHTML = "";

    let filteredProducts = [...products];

    // Search filter
    if (currentFilters.search) {
        filteredProducts = filteredProducts.filter((product) =>
            product.name.toLowerCase().includes(currentFilters.search.toLowerCase())
        );
    }

    // Category filter
    if (currentFilters.category !== "all") {
        filteredProducts = filteredProducts.filter(
            (product) => product.category.toLowerCase() === currentFilters.category.toLowerCase()
        );
    }

    // Gender filter
    if (currentFilters.gender !== "all") {
        filteredProducts = filteredProducts.filter(
            (product) => product.gender.toLowerCase() === currentFilters.gender.toLowerCase()
        );
    }

    // Sorting
    if (currentFilters.sortBy !== "none") {
        const [sortField, sortDirection] = currentFilters.sortBy.split("-");
        filteredProducts.sort((a, b) => {
            if (sortField === "name") {
            return sortDirection === "asc"
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
            } else if (sortField === "price") {
            return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
            }
            return 0;
        });
    }

    // Display filtered products start
    filteredProducts.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="ml-4">
                <div class="text-sm font-montaga font-bold text-gray-900">${product.name}</div>
                <div class="text-sm text-gray-500">${product.description?.substring(0, 50)}${product.description?.length > 50 ? "..." : ""}</div>
                </div>
            </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${product.category}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">${product.gender}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-900">$${product.price.toFixed(2)}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}">
                ${product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <button onclick="editProduct(${index})" class="text-blue-600 hover:text-blue-900 mr-4">
                <i class="fas fa-edit"></i> Edit
            </button>
            <button onclick="deleteProduct(${index})" class="text-red-600 hover:text-red-900">
                <i class="fas fa-trash"></i> Delete
            </button>
            </td>
        `;
        tableBody.appendChild(row);
    // Display filtered products end
    });
}
// Display products with filters end


// Handle filter changes start
function handleFilterChange() {
    currentFilters = {
        search: document.getElementById("searchInput").value,
        category: document.getElementById("categoryFilter").value,
        gender: document.getElementById("genderFilter").value,
        sortBy: document.getElementById("sortOptions").value,
    };

    displayProducts();
}
// Handle filter changes end


// Handle form submission start
function handleSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("productId").value || generateUniqueId();
    const name = document.getElementById("name").value.trim();
    const category = document.getElementById("category").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const description = document.getElementById("description").value.trim();
    const inStock = document.getElementById("inStock").value === "true";
    const gender = document.getElementById("gender").value.trim();

    const productData = { id, name, category, price, description, inStock, gender };

    if (isProductValid(productData)) {
        const productIndex = products.findIndex((p) => p.id === id);
        if (productIndex > -1) {
            products[productIndex] = productData;
    } else {
        products.push(productData);
    }

    localStorage.setItem("products", JSON.stringify(products));
    updateDashboard();
    displayProducts();
    document.querySelector("form").reset();
    toggleForm();
    } 
}

// Function to check product validity start
function isProductValid(product) {
    return product.name && product.category && !isNaN(product.price) && product.price >= 0 && product.description && product.gender;
}
// Function to check product validity end
// Handle form submission end


// Edit product start
function editProduct(index) {
    const product = products[index];
    if (!product) {
        console.error("Product not found at index:", index);
        return;
    }

    document.getElementById("productId").value = product.id || "";
    document.getElementById("name").value = product.name || "";
    document.getElementById("category").value = product.category || "";
    document.getElementById("price").value = product.price || "";
    document.getElementById("description").value = product.description || "";
    document.getElementById("inStock").value = product.inStock ? "true" : "false";
    document.getElementById("gender").value = product.gender || "unisex";

    const form = document.getElementById("productForm");
    if (form.classList.contains("hidden")) {
        toggleForm();
    }
}
// Edit product end


// Delete product start
function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
        products.splice(index, 1);
        localStorage.setItem("products", JSON.stringify(products));
        updateDashboard();
        displayProducts();
    }
}
// Delete product end


// Generate unique ID start
function generateUniqueId() {
    return "ETERNIA-" + Math.random().toString(36).slice(2, 11).toUpperCase();
}
// Generate unique ID end


// Initialize event listeners start
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchInput").addEventListener("input", handleFilterChange);
    document.getElementById("categoryFilter").addEventListener("change", handleFilterChange);
    document.getElementById("genderFilter").addEventListener("change", handleFilterChange);
    document.getElementById("sortOptions").addEventListener("change", handleFilterChange);

    const form = document.getElementById("productForm");
    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    loadProductData();
});
// Initialize event listeners end

// Redirect to main page start
function directBack(){
    window.location.href="../../index.html"
}
// Redirect to main page end
let productsData = null;

// Fetch products data from JSON file start
async function fetchProductData() {
    try {
        const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        const jsonPath = isRoot ? 'assets/Data/products.json' : '../Data/products.json';
        
        const response = await fetch(jsonPath);
        if (!response.ok) {
            throw new Error('Failed to load product data');
        }
        const data = await response.json();
        productsData = data;
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}
// Fetch products data from JSON file end


// Function to get cart items from local storage start
function getCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    function findCategoryById(productId) {
        const product = productsData.products.find(p => p.id === productId);
        return product.category;
    }

    const cartItemsByCategory = cartItems.reduce((acc, item) => {
        const category = findCategoryById(item.id);
        if (!acc[category]) {
            acc[category] = {};
        }
        if (!acc[category][item.name]) {
            acc[category][item.name] = { count: 0, total: 0, price: item.price };
        }
        acc[category][item.name].count += item.quantity;
        acc[category][item.name].total += item.price * item.quantity;
        return acc;
    }, {});

    return cartItemsByCategory;
}
// Function to get cart items from local storage end


// Function to format the price with spaces start
function formatPrice(price) {
    return `$ ${price.toLocaleString()}`;
}
// Function to format the price with spaces end


// Function to create and show the popup start
async function createPopup() {
    // Fetch products data if it hasn't been loaded yet start
    if (!productsData) {
        await fetchProductData();
    }
    // Fetch products data if it hasn't been loaded yet end


    const cartItemsByCategory = getCartItems();


    // Create the popup overlay start
    const popupOverlay = document.createElement('div');
    popupOverlay.classList.add('fixed', 'inset-0', 'flex', 'items-center', 'justify-center', 'bg-black', 'bg-opacity-50', 'z-50','fade-in');
    // Create the popup overlay end


    // Create the popup content start
    const popupContent = document.createElement('div');
    popupContent.classList.add('bg-white', 'rounded', 'shadow-lg', 'p-6', 'w-full', 'max-w-md', 'relative', 'font-inria');
    // Create the popup content end


    // Add the close button start
    const closeButton = document.createElement('button');
    closeButton.classList.add('absolute', 'top-2', 'right-2', 'text-gray-500', 'hover:text-gray-700', 'text-4xl', 'focus:outline-none');
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        popupOverlay.classList.add('fade-out');
        setTimeout(() => document.body.removeChild(popupOverlay), 500);
    });
    popupContent.appendChild(closeButton);
    // Add the close button end


    // Add Header start
    const header = document.createElement('h2');
    header.classList.add('text-lg', 'underline', 'mb-4', 'font-montaga');
    header.textContent = 'Own :';
    popupContent.appendChild(header);
    // Add Header end


    // Handle empty Cart start
    if (Object.keys(cartItemsByCategory).length === 0) {
        // Create the "empty" message
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('text-center', 'text-gray-700', 'my-8', 'text-xl');
        emptyMessage.textContent = "Your exquisite collection awaits... Embrace the allure of the finest.";
    
        // Create the catalog link
        const catalogLink = document.createElement('a');
        catalogLink.classList.add('underline', 'text-center', 'text-goldenrod', 'text-lg', 'mt-2', 'mb-2', 'block');
        
        // Determine the link based on the current path
        const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        catalogLink.href = isRoot ? 'assets/html/All_Products.html' : 'All_Products.html';
    
        // Set the link text
        catalogLink.textContent = 'Explore Our Catalog';
    
        // Append both the empty message and the catalog link to the popup content
        popupContent.appendChild(emptyMessage);
        popupContent.appendChild(catalogLink);
    
    
    // Handle empty Cart end
    } else {

        // Create a container for the scrollable items start
        const itemsContainer = document.createElement('div');
        itemsContainer.classList.add('overflow-y-auto', 'max-h-64', 'mb-6', 'pr-2');
        // Create a container for the scrollable items end


        // Loop through each category start
        for (const category in cartItemsByCategory) {
            const categoryTitle = document.createElement('div');
            categoryTitle.classList.add('font-semibold', 'text-left', 'text-gray-700', 'mt-4', 'mb-2');
            categoryTitle.textContent = category;
            itemsContainer.appendChild(categoryTitle);
            

            // Loop through each item in the category start
            for (const name in cartItemsByCategory[category]) {
                const { count, total } = cartItemsByCategory[category][name];
                
                const itemRow = document.createElement('div');
                itemRow.classList.add('flex', 'justify-between', 'items-center', 'py-2', 'border-b', 'border-gray-300', 'text-gray-700');
                
                itemRow.innerHTML = `
                <div class="text-left flex-1">${name}</div>
                <div class="text-center w-8">× ${count}</div>
                <div class="text-right flex-1">${formatPrice(total)}</div>
                `;
                itemsContainer.appendChild(itemRow);
            }
            // Loop through each item in the category end
        }
        // Loop through each category end


        popupContent.appendChild(itemsContainer);
    }

    // Create buttons container start
    const buttonsContainer = document.createElement('div');
    buttonsContainer.classList.add('flex', 'justify-between', 'mt-4');
    // Create buttons container end


    // Creating each button with styling start
    const esPdfButton = document.createElement('button');
    esPdfButton.classList.add('bg-button_divs_background', 'hover:bg-yellow-500', 'text-gray-800', 'py-2', 'px-12', 'rounded', 'font-semibold');
    esPdfButton.textContent = 'Es. Pdf';
    esPdfButton.addEventListener('click', () => {
        const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        window.location.href = isRoot ? 'assets/html/Estimate_pdf.html' : 'Estimate_pdf.html';
    });

    const goCartButton = document.createElement('button');
    goCartButton.classList.add('bg-button_divs_background', 'hover:bg-yellow-500', 'text-gray-800', 'py-2', 'px-12', 'rounded', 'font-semibold');
    goCartButton.textContent = 'Go Cart';
    goCartButton.addEventListener('click', () => {
        const isRoot = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
        window.location.href = isRoot ? 'assets/html/cart.html' : 'cart.html';
    });
    // Creating each button with styling end


    // Appending children inside proper parent start
    buttonsContainer.appendChild(esPdfButton);
    buttonsContainer.appendChild(goCartButton);
    popupContent.appendChild(buttonsContainer);
    // Appending children inside proper parent end


    // Appending pop_Up inside proper parent start
    popupOverlay.appendChild(popupContent);
    document.body.appendChild(popupOverlay);
    // Appending pop_Up inside proper parent end
}
// Function to create and show the popup end

// Add event listener for the cart icon click to trigger popup start
const cartIcon = document.querySelector('.cart-icon');
cartIcon.addEventListener('click', createPopup);
// Add event listener for the cart icon click to trigger popup end

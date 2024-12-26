const testimonials = document.querySelectorAll('.testimonial');
const quotes = document.querySelectorAll('.quote');

const mainImage = document.querySelector('article img');
const quantityInput = document.querySelector('input[type="text"]');
const minusButton = document.querySelector('button img[src*="minus"]').parentElement;
const plusButton = document.querySelector('button img[src*="plus"]').parentElement;
const sizeSelect = document.querySelector('select');
const addToCartButton = document.querySelector('.add-to-cart-btn');
const outOfStockTag = document.querySelector('.text-gray_used_in_small_text');
const categoryName = document.getElementById('category-name');

let currentIndex = 0;
let interval;
let isPaused = false;

let currentProduct;
let allProducts = [];


// Testimonials animation start
function showTestimonial(index) {
    testimonials.forEach(t => t.classList.remove('active'));
    quotes.forEach(q => q.classList.remove('active'));
    
    testimonials[index].classList.add('active');
    quotes[index].classList.add('active');
}

function nextTestimonial() {
    if (!isPaused) {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    }
}

testimonials.forEach((testimonial, index) => {
    testimonial.addEventListener('mouseenter', () => {
        isPaused = true;
        showTestimonial(index);
    });

    testimonial.addEventListener('mouseleave', () => {
        isPaused = false;
    });
    
    testimonial.addEventListener('click', () => {
        currentIndex = index;
        showTestimonial(index);
    });
});

interval = setInterval(nextTestimonial, 7000);

window.addEventListener('unload', () => {
    clearInterval(interval);
});
// Testimonials animation ends


// Get product ID from URL parameters start
function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    return productId || 'Eternia-9K1L7N2R';
}
// Get product ID from URL parameters end


// Product Details Section start

// Load product data from a JSON file start
async function loadProductData() {
    try {
        const response = await fetch('../Data/products.json');
        const data = await response.json();
        const productId = getProductIdFromUrl();
        
        currentProduct = data.products.find(p => p.id === productId);
        
        document.title = `ETERNIA || ${currentProduct.name}`;
        ProductDisplay();
    } catch (error) {
        console.error('Error loading product data:', error);
    }
}
// Load product data from a JSON file end


// Display product based on data start
function ProductDisplay() {
    document.querySelector('h1').textContent = currentProduct.name;
    document.querySelector('.text-darkGolden').textContent = `$ ${currentProduct.price}`;
    document.querySelector('.text-gray-700').textContent = currentProduct.description;
    outOfStockTag.style.display = currentProduct.inStock ? 'none' : 'block';

    if (currentProduct.images.length > 0) {
        mainImage.src = currentProduct.images[0];
    }

    const thumbnailContainer = document.querySelector('.flex.justify-center.gap-4');
    thumbnailContainer.innerHTML = '';
    
    currentProduct.images.slice(1).forEach((imageSrc, index) => {
        const button = document.createElement('button');
        button.classList.add('w-[80px]', 'h-[80px]', 'md:w-[110px]', 'md:h-[110px]', 'flex-shrink-0', 'thumbnail-btn');
        
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `Product view ${index + 2}`;
        img.width = 110;
        img.height = 110;
        img.classList.add('w-full', 'h-full', 'object-cover', 'border', 'border-[rgba(0,0,0,0.24)]');
        
        button.appendChild(img);
        thumbnailContainer.appendChild(button);
    });

    if (categoryName && currentProduct.category) {
        categoryName.textContent = currentProduct.category;
    }

    setupThumbnailClicks();
}
// Display product based on data end


// Thumbnail switching start
function setupThumbnailClicks() {
    const thumbnails = document.querySelectorAll('.thumbnail-btn img');
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', (e) => {
            e.stopPropagation();
            const newSrc = thumb.src;
            const mainSrc = mainImage.src;
            mainImage.src = newSrc;
            thumb.src = mainSrc;
        });
    });
}
// Thumbnail switching end


// Quantity handling start
function updateQuantity(value) {
    let quantity = parseInt(quantityInput.value);
    quantity = Math.max(1, Math.min(99, quantity + value));
    quantityInput.value = quantity; 
}

minusButton.addEventListener('click', () => {
    updateQuantity(-1);
});

plusButton.addEventListener('click', () => {
    updateQuantity(1);
});

quantityInput.addEventListener('change', () => {
    let value = parseInt(quantityInput.value) || 1;
    value = Math.max(1, Math.min(99, value));
    quantityInput.value = value; 
});
// Quantity handling end


// Size selection option start
sizeSelect.addEventListener('change', () => {});
// Size selection option end


// Local storage management start
function saveToLocalStorage() {
    const updatedQuantity = parseInt(quantityInput.value); 
    const productData = {
        id: currentProduct.id,
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: updatedQuantity,
        size: sizeSelect.value,
        selectedImage: mainImage.src
    };
    
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    console.log(productData.size);

    const existingItemIndex = cart.findIndex(item => 
        item.id === productData.id && item.size === productData.size
    );

    if (existingItemIndex !== -1) {
        cart[existingItemIndex].quantity = updatedQuantity;
        cart[existingItemIndex].selectedImage = mainImage.src;
    } else {
        cart.push(productData);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}
// Local storage management end


// Add to cart button start
function setupAddToCart() {
    addToCartButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!currentProduct.inStock) {
            alert('Sorry, this item is currently out of stock. Until 01/01/2025.');
            return;
        }

        saveToLocalStorage(); 
    });
}
// Add to cart button end 


// Image zoom effect start
function setupZoom() {
    if (!mainImage) return; 
    
    const zoomContainer = mainImage.parentElement; 
    
    mainImage.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = zoomContainer.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        
        mainImage.style.transform = 'scale(1.5)';
        mainImage.style.transformOrigin = `${x}% ${y}%`;
    });
    
    mainImage.addEventListener('mouseleave', () => {
        mainImage.style.transform = 'scale(1)';
    });
}
// Image zoom effect end


// Product suite section start
async function loadAllProducts() {
    try {
        if (allProducts.length === 0) {
            const response = await fetch('../Data/products.json');
            const data = await response.json();
            allProducts = data.products;

            if (allProducts.length > 0) {
                displayRelatedProducts();
            } 
        } else {
            displayRelatedProducts();
        }
    } catch (error) {
        console.error('Error loading all products:', error);
    }
}

function displayRelatedProducts() {
    if (!currentProduct) {
        console.error('Current product data is missing!');
        return;
    }

    const category = currentProduct.category;
    const gender = currentProduct.gender;

    let filteredProducts = allProducts.filter(product => 
        product.category === category && 
        product.gender === gender &&
        product.id !== currentProduct.id
    );

    if (filteredProducts.length === 0) {
        console.log('No related products found based on category and gender!');
        return;
    }

    for (let i = filteredProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
    }

    const randomProducts = filteredProducts.slice(0, 6);
    const relatedProductsContainer = document.getElementById('related-products');
    
    if (!relatedProductsContainer) {
        console.error('Related products container not found!');
        return;
    }

    relatedProductsContainer.innerHTML = '';
    randomProducts.forEach(product => {
        const article = document.createElement('article');
        article.classList.add('flex', 'flex-col', 'cursor-pointer');

        article.innerHTML = `
            <a href="javascript:void(0)" class="product-link" data-product-id="${product.id}">
                <figure class="relative w-full aspect-square bg-gray-50 mb-4 overflow-hidden shadow-lg transition-all duration-1000 ease-in-out">
                    <img src="${product.images[0]}" alt="${product.name}" data-hover-src="${product.images[1]}" class="product-image-desc object-cover w-full h-full transition-transform duration-500" loading="lazy">
                </figure>
                <div class="px-1">
                    <h2 class="text-sm font-light">${product.name}</h2>
                    <p class="text-sm text-darkGolden">$${product.price}</p>
                </div>
            </a>
        `;

        const imageElement = article.querySelector('.product-image-desc');
        const productLink = article.querySelector('.product-link');
        
        imageElement.addEventListener('mouseenter', () => {
            imageElement.src = imageElement.getAttribute('data-hover-src');
        });

        imageElement.addEventListener('mouseleave', () => {
            imageElement.src = product.images[0];
        });
 
        // Click handler for products in suite Start
        productLink.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = productLink.getAttribute('data-product-id');
            
            const newUrl = `${window.location.pathname}?id=${productId}`;
            window.history.pushState({ productId }, '', newUrl);
            
            await loadProductData();
            await loadAllProducts();
            
            // Scroll to top
            window.scrollTo(0, 0);
        });
        // Click handler for products in suite end

        relatedProductsContainer.appendChild(article);
    });
}

// Handle browser back/forward buttons (copy / paste) start
window.addEventListener('popstate', async (event) => {
    if (event.state && event.state.productId) {
        await loadProductData();
        await loadAllProducts();
    }
});
// Handle browser back/forward buttons (copy / paste) end 

// Load functions on window load start
document.addEventListener('DOMContentLoaded', async () => {
    await loadProductData();
    setupAddToCart();
    setupZoom();
    quantityInput.value = 1;

    setTimeout(() => {
        loadAllProducts();
    }, 100); 
});
// Load functions on window load end
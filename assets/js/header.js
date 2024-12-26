// Preload all products when the page loads
let productsDatas = null;

async function fetchProducts() {
    if (productsDatas) return productsDatas;
    
    try {
      const response = await fetch('../Data/products.json');
      if (!response.ok) throw new Error('Loading products failed');
      productsDatas = await response.json();
      return productsDatas;
    } catch (error) {
      console.error('Error fetching products:', error);
      return null;
    }
  }
  

function initializeNavbarLinks() {
  const navbarLinks = document.querySelectorAll('.navbar-link');
  let activeCategory = null;
  const mainContent = document.querySelector('main');
  const footer = document.querySelector('footer');

  // Add CSS for smooth transitions
  const style = document.createElement('style');
  style.textContent = `
    .elementOfNavbar {
      height: 0;
      overflow: hidden;
      transition: height .3s ease-out; /* Faster transition */
    }
    .elementOfNavbar.expanded {
      height: auto;
      margin-bottom: 2rem;
    }
    .product-section {
      display: none;
      opacity: 0;
      transform: translateY(0px);
      transition: opacity 0.3s ease-out, transform 0.3s ease-out;
    }
    .product-section.active {
      display: block;
      opacity: 1;
      transform: translateY(0);
    }
    main, footer { /* Ensure both main and footer move smoothly */
      transition: transform 0.5s ease-in;
    }
    main.shifted, footer.shifted {
      transform: translateY(var(--shift-amount, 0px));
    }
  `;
  document.head.appendChild(style);

  // Initially hide all product sections
  const productSections = document.querySelectorAll('.product-section');
  const navbarContainer = document.querySelector('.elementOfNavbar');
  
  productSections.forEach(section => {
    section.style.display = 'none';
    section.classList.remove('active');
  });

  navbarLinks.forEach(link => {
    link.addEventListener('click', async (e) => {
      e.preventDefault();
      const category = link.textContent.toLowerCase();
      
      // If clicking the same category, hide it
      if (activeCategory === category) {
        const activeSection = document.getElementById(`${category}-container`);
        
        // Hide the section with animation
        activeSection.classList.remove('active');
        navbarContainer.classList.remove('expanded');
        
        // Reset main content and footer position
        mainContent.style.setProperty('--shift-amount', '0px');
        footer.style.setProperty('--shift-amount', '0px');
        mainContent.classList.remove('shifted');
        footer.classList.remove('shifted');
        
        setTimeout(() => {
          activeSection.style.display = 'none';
        }, 300);
        
        activeCategory = null;
        return;
      }

      // Hide previously active category if exists
      if (activeCategory) {
        const previousSection = document.getElementById(`${activeCategory}-container`);
        previousSection.classList.remove('active');
        setTimeout(() => {
          previousSection.style.display = 'none';
        }, 300);
      }

      // Show new category
      const targetSection = document.getElementById(`${category}-container`);
      if (targetSection) {
        // First display the section
        targetSection.style.display = 'block';
        navbarContainer.classList.add('expanded');
        
        // Force reflow
        targetSection.offsetHeight;
        
        // Add active class for animation
        targetSection.classList.add('active');
        
        // Calculate height of the section and update main content and footer position
        setTimeout(() => {
          const sectionHeight = targetSection.offsetHeight;
          mainContent.style.setProperty('--shift-amount', `${sectionHeight}px`);
          footer.style.setProperty('--shift-amount', `${sectionHeight}px`);
          mainContent.classList.add('shifted');
          footer.classList.add('shifted');
        }, 50);
        
        activeCategory = category;
      }
    });
  });
}


async function loadProducts() {
  try {
    const data = await fetchProducts();
    console.log("enter")
    if (!data) return;
    
    const productsArray = Object.values(data).flat();
    const isInRoot = !window.location.pathname.includes('/assets/html/');
    
    const categories = ['bracelets', 'necklaces', 'rings', 'watches'];
    
    categories.forEach(category => {
      const categoryProducts = productsArray.filter(
        product => product.category && product.category.toLowerCase() === category
      ).slice(0, 4);
      console.log(categoryProducts)

      const container = document.querySelector(`#${category}-container .product-list`);
      if (!container) return;
      
      container.innerHTML = '';

      categoryProducts.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
          product.images = product.images.slice(0, 1).map(imagePath => {
            imagePath = imagePath.replace(/^\.{2}\//, '');
            return isInRoot ? `assets/${imagePath}` : `../${imagePath}`;
          });
        }

        const productCard = document.createElement('div');
        productCard.classList.add(
          'bg-white', 'p-4', 'rounded', 'flex', 'flex-col', 'items-center', 'shadow-md'
        );
        console.log(productCard)

        const productImageContainer = document.createElement('div');
        productImageContainer.classList.add('w-full', 'aspect-square', 'overflow-hidden', 'relative', 'rounded');

        // Preload image
        const img = new Image();
        img.src = product.images[0];
        
        const productImage = document.createElement('img');
        productImage.src = product.images[0];
        productImage.alt = product.name;
        productImage.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'object-cover');

        productImageContainer.appendChild(productImage);

        const productTitle = document.createElement('h3');
        productTitle.classList.add('font-inria', 'lg:text-lg', 'text-center', 'mt-4', 'text-gray-800');
        productTitle.textContent = product.name;

        const productLink = document.createElement('a');
        productLink.href = isInRoot 
          ? `assets/html/Descri_page.html?id=${product.id}`
          : `Descri_page.html?id=${product.id}`;
        productLink.classList.add('w-full');

        productCard.appendChild(productImageContainer);
        productCard.appendChild(productTitle);
        productLink.appendChild(productCard);
        container.appendChild(productLink);
      });
    });
  } catch (error) {
    console.error('Error loading products:', error);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await loadProducts();
  
  initializeNavbarLinks();
});
// navbar
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const mobileMenu = document.getElementById('mobileMenu');

  menuButton.addEventListener('click', () => {
    // Toggle mobile menu visibility
    mobileMenu.classList.toggle('hidden');

    // Optional: Add slide animation
    if (!mobileMenu.classList.contains('hidden')) {
      mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
    } else {
      mobileMenu.style.maxHeight = '0';
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (event) => {
    if (!menuButton.contains(event.target) && !mobileMenu.contains(event.target)) {
      mobileMenu.classList.add('hidden');
      mobileMenu.style.maxHeight = '0';
    }
  });
});

// caroussel
(function () {
  "use stict"
  const slideTimeout = 5000;
  const $slides = document.querySelectorAll('.slide');
  let $dots;
  let intervalId;
  let currentSlide = 1;
  function slideTo(index) {
    currentSlide = index >= $slides.length || index < 1 ? 0 : index;
    $slides.forEach($elt => $elt.style.transform = `translateX(-${currentSlide * 100}%)`);
    $dots.forEach(($elt, key) => $elt.classList = `dot ${key === currentSlide ? 'active' : 'inactive'}`);
  }
  function showSlide() {
    slideTo(currentSlide);
    currentSlide++;
  }
  for (let i = 1; i <= $slides.length; i++) {
    let dotClass = i == currentSlide ? 'active' : 'inactive';
    let $dot = `<span data-slidId="${i}" class="dot ${dotClass}"></span>`;
    document.querySelector('.carousel-dots').innerHTML += $dot;
  }
  $dots = document.querySelectorAll('.dot');
  $dots.forEach(($elt, key) => $elt.addEventListener('click', () => slideTo(key)));

  intervalId = setInterval(showSlide, slideTimeout)
  $slides.forEach($elt => {
    let startX;
    let endX;
    $elt.addEventListener('mouseover', () => {
      clearInterval(intervalId);
    }, false)
    $elt.addEventListener('mouseout', () => {
      intervalId = setInterval(showSlide, slideTimeout);
    }, false);
    $elt.addEventListener('touchstart', (event) => {
      startX = event.touches[0].clientX;
    });
    $elt.addEventListener('touchend', (event) => {
      endX = event.changedTouches[0].clientX;
      if (startX > endX) {
        slideTo(currentSlide + 1);
      } else if (startX < endX) {
        slideTo(currentSlide - 1);
      }
    });
  })
})();


// Sélectionner les liens et sections
const navbarLinks = document.querySelectorAll('.navbar-link');
const sections = document.querySelectorAll('.elementOfNavbar > div');

// Masquer toutes les sections
function hideAllSections() {
  sections.forEach(section => {
    section.classList.remove('visible');
  });
}

// Fonction pour afficher une section spécifique
function showSection(index) {
  hideAllSections();
  sections[index].classList.add('visible');
}

// Événements pour montrer/masquer les sections
navbarLinks.forEach((link, index) => {
  link.addEventListener('mouseenter', () => showSection(index));
});
document.querySelector('.elementOfNavbar').addEventListener('mouseleave', hideAllSections);


// Script pour la gestion du formulaire et des animations

document.addEventListener('DOMContentLoaded', function () {
  // Animation pour faire apparaître les éléments au scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('opacity-100');
        entry.target.classList.remove('opacity-0');
      }
    });
  }, observerOptions);

  // Observer les éléments avec animation
  document.querySelectorAll('.animate-fadeIn').forEach(el => {
    observer.observe(el);
  });

  // Gestion du formulaire newsletter
  const form = document.getElementById('newsletterForm');
  const confirmationMessage = document.getElementById('confirmationMessage');

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const email = form.email.value;

    // Simulation d'envoi (remplacer par votre logique d'envoi réelle)
    setTimeout(() => {
      form.reset();
      form.style.display = 'none';
      confirmationMessage.classList.remove('hidden');

      // Réinitialiser après 5 secondes
      setTimeout(() => {
        form.style.display = 'flex';
        confirmationMessage.classList.add('hidden');
      }, 5000);
    }, 1000);
  });
});
// -----------------------------------------------------------------
// Chargement des données depuis le fichier JSON
fetch('./assets/Data/products.json')
  .then(response => response.json())
  .then(data => {
    console.log(data)
    // Appeler la fonction pour créer les cartes
    createProductCards(data);
  })
  .catch(error => {
    console.error('Erreur lors du chargement des données :', error);
  });

// Fonction pour créer les cartes des produits
function createProductCards(products) {
  const cardContainer = document.getElementById('card-container');

  products.forEach(product => {
    if (product.bestsellers) {
      const card = document.createElement('div');
      card.classList.add('product-card', 'bg-black', 'p-4', 'rounded', 'shadow-lg', 'hover:shadow-xl', 'transition-shadow', 'duration-300');

      const cardImage = document.createElement('div');
      cardImage.classList.add('h-[200px]', 'sm:h-full');

      const img = document.createElement('img');
      img.src = product.imageUrl;
      img.alt = product.name;
      img.classList.add('w-full', 'h-full', 'object-cover', 'rounded');

      cardImage.appendChild(img);
      card.appendChild(cardImage);
      cardContainer.appendChild(card);
    }
  });
}

// ---------------- best sellers ----------------------
class CategoryGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.categories = ['Watches', 'Bracelets', 'Rings', 'Necklaces'];
    this.products = {};
    this.intervals = {};
    this.loadProducts();
  }

  async loadProducts() {
    try {
      const response = await fetch('assets/Data/products.json');
      if (!response.ok) throw new Error('Loading products failed');
      const data = await response.json();
      const productsArray = Object.values(data).flat();
     
      // Process image paths
      productsArray.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
          product.images = product.images.map(imagePath =>
            imagePath.replace(/^\.{2}/, 'assets')
          );
        }
      });

      // Group products by category
      this.categories.forEach(category => {
        this.products[category] = productsArray.filter(p =>
          p && p.category === category && p.images && p.images.length > 0
        );
      });

      this.initializeImages();
      this.setupClickHandlers(); // Add click handlers after loading products
    } catch (error) {
      console.error('Error:', error);
      this.container.innerHTML = `
        <div class="text-red-500 p-4">
          Load failed
        </div>
      `;
    }
  }

  initializeImages() {
    const cards = {
      'Watches': '.card-watches',
      'Bracelets': '.card-bracelets',
      'Rings': '.card-rings',
      'Necklaces': '.card-necklaces'
    };

    Object.entries(cards).forEach(([category, selector]) => {
      const card = this.container.querySelector(selector);
      const img = card.querySelector('img');
      if (!img) return;

      const categoryProducts = this.products[category];
      if (!categoryProducts?.length) {
        img.src = 'default-placeholder.jpg';
        return;
      }

      let currentIndex = 0;
      img.src = categoryProducts[0].images[0];

      // Store current product index in the card element
      card.dataset.currentIndex = currentIndex;

      if (this.intervals[category]) {
        clearInterval(this.intervals[category]);
      }

      this.intervals[category] = setInterval(() => {
        currentIndex = (currentIndex + 1) % categoryProducts.length;
        card.dataset.currentIndex = currentIndex; // Update stored index
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = categoryProducts[currentIndex].images[0];
          img.style.opacity = '1';
        }, 200);
      }, 5000);
    });
  }

  setupClickHandlers() {
    const cards = {
      'Watches': '.card-watches',
      'Bracelets': '.card-bracelets',
      'Rings': '.card-rings',
      'Necklaces': '.card-necklaces'
    };

    Object.entries(cards).forEach(([category, selector]) => {
      const card = this.container.querySelector(selector);
      if (!card) return;

      card.style.cursor = 'pointer'; // Make it clear it's clickable

      card.addEventListener('click', () => {
        const currentIndex = parseInt(card.dataset.currentIndex) || 0;
        const categoryProducts = this.products[category];
        
        if (categoryProducts && categoryProducts[currentIndex]) {
          const product = categoryProducts[currentIndex];
          // Navigate to description page with product ID
          window.location.href = `assets/html/Descri_page.html?id=${product.id}`;
        }
      });
    });
  }

  destroy() {
    Object.values(this.intervals).forEach(interval => clearInterval(interval));
  }
}

// Initialize gallery
document.addEventListener('DOMContentLoaded', () => {
  window.gallery = new CategoryGallery('card-container');
});

// Cleanup
window.addEventListener('beforeunload', () => {
  if (window.gallery) {
    window.gallery.destroy();
  }
});

// ------------------------------------------
async function loadProducts() {
  try {
    const response = await fetch('assets/Data/products.json');
    if (!response.ok) throw new Error('Loading products failed');

    const data = await response.json();
    const productsArray = Object.values(data).flat();

    // Categories
    const categories = ['bracelets', 'necklaces', 'rings', 'watches'];

    categories.forEach(category => {
      // Filter and limit to 4 products per category
      const categoryProducts = productsArray.filter(
        product => product.category && product.category.toLowerCase() === category
      ).slice(0, 4);

      // Get container for the category
      const container = document.querySelector(`#${category}-container .product-list`);
      container.innerHTML = ''; // Clear previous content

      // Create product cards
      categoryProducts.forEach(product => {
        if (product.images && Array.isArray(product.images)) {
          product.images = product.images.slice(0, 1).map(imagePath => imagePath.replace(/^\.{2}/, 'assets'));
        }

        // Create card
        const productCard = document.createElement('div');
        productCard.classList.add(
          'bg-white', 'p-4', 'rounded', 'flex', 'flex-col', 'items-center', 'shadow-md'
        );

        // Image container with aspect-square
        const productImageContainer = document.createElement('div');
        productImageContainer.classList.add('w-full', 'aspect-square', 'overflow-hidden', 'relative', 'rounded');

        // Image element
        const productImage = document.createElement('img');
        productImage.src = product.images[0];
        productImage.alt = product.name;
        productImage.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'object-cover');

        // Append image to its container
        productImageContainer.appendChild(productImage);

        // Title
        const productTitle = document.createElement('h3');
        productTitle.classList.add('font-inria', 'lg:text-lg', 'text-center', 'mt-4', 'text-gray-800');
        productTitle.textContent = product.name;

        // Link to product details
        const productLink = document.createElement('a');
        productLink.href = `assets/html/Descri_page.html?id=${product.id}`;
        productLink.classList.add('w-full');

        // Append elements
        productCard.appendChild(productImageContainer);
        productCard.appendChild(productTitle);
        productLink.appendChild(productCard);
        container.appendChild(productLink);
      });
    });
  } catch (error) {
    console.error('Erreur lors du chargement des produits:', error);
  }
}

// Load products on DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadProducts);
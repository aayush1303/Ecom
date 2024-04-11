document.addEventListener("DOMContentLoaded", function () {
    // Get the products container element
    const productsContainer = document.getElementById("products-container");
    const maleProductsContainer = document.getElementById("male-products-container");
    const kidProductsContainer = document.getElementById("kid-products-container")
    document.addEventListener('removeFromWishlist', function (event) {
        const productId = event.detail;
        // Call the toggleHeart function with the productId to remove it from the wishlist
        toggleHeart(productId);
    });
    // Fetch product data from product.json
    fetch('product.json')
        .then(response => response.json())
        .then(products => {
            // Render product containers
            products.forEach(product => {
                const productDiv = document.createElement("div");
                productDiv.className = "product";
                const reviewIcons = product.icons.map(icon => `<i class="${icon}"></i>`).join('');
                productDiv.innerHTML = `

                    <div class="image-container">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="info-strip">
                            <div class="product-info">
                                <h class="company">${product.company}</h>
                                <h class="product-name">${product.name}</h>
                                <h class="price">$${product.price.toFixed(2)}</h>
                            </div>
                            <p class="review">${reviewIcons}</p>
                        </div>
                        <div class="buttons-container">
                        <button id="details" data-product-id="${product.id}">
                        <i class="ri-eye-line"></i>
                    </button>                        <button class = "p-wish" id="wishlist-${product.id}" onclick="toggleHeart(${product.id})">
                                <i class="ri-heart-line"></i>
                            </button>
                            <button id = "share"><i class="ri-share-line"></i></button>
                        </div>
                        <div class="view">
                            <button-heart id="heart-${product.id}">
                                <i class="ri-heart-fill"></i>
                            </button-heart>
                        </div>
                        
                    </div>
                `;

                if (product.id < 5) {
                    productsContainer.appendChild(productDiv);
                } else if (product.id < 9){
                    maleProductsContainer.appendChild(productDiv);
                }else{
                    kidProductsContainer.appendChild(productDiv);
                }
                const shareButton = productDiv.querySelector("#share");

                shareButton.addEventListener("click", function () {
                    const productDetailsURL = `${window.location.origin}/product-details.html?id=${product.id}`;
        
                    // Create a temporary input element to copy the URL
                    const tempInput = document.createElement("input");
                    tempInput.value = productDetailsURL;
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand("copy");
                    document.body.removeChild(tempInput);
        
                    // Optionally, you can provide feedback to the user
                    alert("Link copied to clipboard!");
                });
        

                // Check if the product is in the wishlist and update the button state
                const wishlistButton = document.getElementById(`wishlist-${product.id}`);
                const heartIcon = wishlistButton.querySelector('i');
                const buttonHeart = document.querySelector(`#heart-${product.id}`);
                const isClicked = JSON.parse(localStorage.getItem(`wishlist-${product.id}`));

                if (isClicked) {
                    wishlistButton.classList.add('clicked');
                    heartIcon.className = 'ri-heart-fill';
                    buttonHeart.querySelector('i').style.color = 'red';
                }
                const detailsButton = productDiv.querySelector("#details");
                detailsButton.addEventListener("click", function () {
                    // Redirect to product-details.html
                    window.location.href = `product-details.html?id=${product.id}`;
                });
                
            });

        })
        .catch(error => console.error('Error fetching product data:', error));
});


function toggleHeart(productId) {
    const wishlistButton = document.getElementById(`wishlist-${productId}`);
    const heartIcon = wishlistButton.querySelector('i');
    const buttonHeart = document.querySelector(`#heart-${productId}`);

    // Check if the button is already clicked
    const isClicked = wishlistButton.classList.contains('clicked');

    wishlistButton.classList.toggle('clicked');

    // Save the wishlist state to localStorage
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (!isClicked) {
        wishlist.push(productId);
    } else {
        const index = wishlist.indexOf(productId);
        if (index !== -1) {
            wishlist.splice(index, 1);
        }
    }
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Update wishlist state on other pages
    updateWishlistState(productId, !isClicked);

    if (heartIcon.classList.contains('ri-heart-line')) {
        heartIcon.className = 'ri-heart-fill';
        buttonHeart.querySelector('i').style.color = 'red';
        
        console.log('ProductId sent to wishlist.html:', productId);

        // Fetch product data from product.json
        fetch('product.json')
            .then(response => response.json())
            .then(products => {
                // Find the selected product by id
                const selectedProduct = products.find(product => product.id === productId);

                if (selectedProduct) {
                    // Save the selected product to localStorage
                    localStorage.setItem(`wishlist-${productId}`, JSON.stringify(selectedProduct));

                    // Display a message indicating that details were sent
                    alert('Product details sent to wishlist.html');

                    // Log a message to the console indicating that details were sent
                    console.log('Product details sent to wishlist.html:', selectedProduct);
                } else {
                    // Display a message indicating that details were not found
                    alert('Product details not found.');

                    // Log a message to the console indicating that details were not found
                    console.error('Error: Product details not found for id', productId);
                }
            })
            .catch(error => console.error('Error fetching product data:', error));
    } else if (isClicked) {
        // If the button was already clicked and clicked again, ask for confirmation
        const removeConfirmation = confirm('Do you want to remove this item from wishlist?');

        // Reset the scale after a short delay (300ms)
        setTimeout(() => {
            wishlistButton.classList.remove('clicked');
        }, 300);

        if (removeConfirmation) {
            // Remove the item from localStorage
            localStorage.removeItem(`wishlist-${productId}`);
            localStorage.removeItem(`wishlist-${productId}`);

            // Reset the heart icon to line and set the color to white
            heartIcon.className = 'ri-heart-line';
            buttonHeart.querySelector('i').style.color = 'white';

            // Display a message indicating that the item was removed
            alert('Product removed from wishlist.');

            // Log a message to the console indicating that the item was removed
            console.log('Product removed from wishlist:', productId);
        }
    }
}

function updateWishlistState(productId, isClicked) {
    // Update wishlist state on other pages
    const wishlistButtons = document.querySelectorAll(`.wishlist-button[data-product-id="${productId}"]`);

    wishlistButtons.forEach(button => {
        if (isClicked) {
            button.classList.add('clicked');
            button.querySelector('i').className = 'ri-heart-fill';
            button.querySelector('i').style.color = 'red';
        } else {
            button.classList.remove('clicked');
            button.querySelector('i').className = 'ri-heart-line';
            button.querySelector('i').style.color = 'white';
        }
    });
}
// Function to initialize heart button states on page load
function updateWishlistCount() {
    // Fetch wishlist items from localStorage
    const storedProducts = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Update the wishlist count in the header
    const wishlistCountSpan = document.getElementById('wishlist-count');
    if (wishlistCountSpan) {
        wishlistCountSpan.textContent = storedProducts.length;
    }
}

// Initial update
updateWishlistCount();

// Periodically update every 2 seconds
setInterval(updateWishlistCount, 1000);

function updateHeaderWithCartCount() {
    // Retrieve cart data from local storage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
    // Calculate the total quantity of items in the cart
    const totalQuantity = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  
    // Display the total quantity in the header
    const headerCartCountSpan = document.getElementById('cartitems');
    if (headerCartCountSpan) {
      headerCartCountSpan.textContent = totalQuantity.toString();
    }
  }
  
  // Call the function initially when the DOM is loaded
  updateHeaderWithCartCount();
  
  // Set an interval to update the total quantity every second
  setInterval(updateHeaderWithCartCount, 1000);
  let currentSlide = 0;

function showSlide(index) {
    const carouselInner = document.querySelector('.carousel-inner');
    const slides = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    const translateValue = -currentSlide * 100 + '%';
    carouselInner.style.transform = 'translateX(' + translateValue + ')';

    dots.forEach((dot, index) => {
        dot.classList.remove('active');
        if (index === currentSlide) {
            dot.classList.add('active');
        }
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

function createPaginationDots() {
    const pagination = document.querySelector('.pagination');
    const slides = document.querySelectorAll('.carousel-item');

    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => showSlide(index));
        pagination.appendChild(dot);
    });

    showSlide(currentSlide);
}

document.addEventListener('DOMContentLoaded', createPaginationDots);
let prevScrollPos = window.pageYOffset;

window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;

    if (prevScrollPos > currentScrollPos) {
        document.querySelector('.header').style.top = '0';
    } else {
        document.querySelector('.header').style.top = '-50px'; // Height of the header
    }

    prevScrollPos = currentScrollPos;
};
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);

    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
const searchIcon = document.getElementById('searchIcon');
const searchInput = document.getElementById('searchInput');
let products;

const fetchData = async () => {
    try {
        const response = await fetch('product.json');
        products = await response.json();
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
};

fetchData();

function hideSearch() {
    searchIcon.style.opacity = 0;
    searchInput.style.opacity = 1;
    document.addEventListener('click', handleOutsideClick);
}

function showSearch() {
    searchIcon.style.opacity = 1;
    searchInput.style.opacity = 0;
    document.removeEventListener('click', handleOutsideClick); // Remove the event listener
}

function toggleSearch() {
    hideSearch();
}

function handleOutsideClick(event) {
    if (!event.target.closest('.search')) {
        showSearch();
    }
}

function handleSearch(event) {
    if (event.key === 'Enter') {
        const inputValue = searchInput.value.toLowerCase();
        const matchingProducts = products.filter(product => (
            product.name.toLowerCase().includes(inputValue) || product.company.toLowerCase().includes(inputValue)
        ));

        if (matchingProducts.length > 0) {
            const product = matchingProducts[0]; // Assuming the first matching product
            const isConfirmed = confirm(`Product found!\n\nName: ${product.name}\nCompany: ${product.company}\n\nOptions:\n1. Okay\n2. Visit`);

            if (isConfirmed) {
                const productDetailsURL = `${window.location.origin}/product-details.html?id=${product.id}`;
                window.location.href = productDetailsURL;
            } else {
                alert('Product not available.');
            }
        } else {
            alert('Product not available.');
        }

        // Reset the search input
        searchInput.value = '';
        showSearch();
    }
}

// Attach the event listener to the input

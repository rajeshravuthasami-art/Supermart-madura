// Madhura Supermarket - Shopping Cart Logic

const products = [
    {
        id: 1,
        name: "Fresh Kashmiri Apples",
        price: 199,
        originalPrice: 250,
        discount: 20,
        category: "Fruits",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Premium Basmati Rice",
        price: 450,
        originalPrice: 550,
        discount: 18,
        category: "Groceries",
        image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Organic A2 Milk",
        price: 80,
        originalPrice: 90,
        discount: 11,
        category: "Dairy",
        image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Farm Fresh Tomatoes",
        price: 45,
        originalPrice: 60,
        discount: 25,
        category: "Vegetables",
        image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = [];

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");

document.addEventListener("DOMContentLoaded", () => {
    renderProducts(products);
    setupEventListeners();
    updateCartUI();
});

function renderProducts(items) {
    if (!productGrid) return;

    productGrid.innerHTML = items.map(product => `
        <div class="product-card glass-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <span class="discount-badge">${product.discount}% OFF</span>
            </div>
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3>${product.name}</h3>
                <div class="product-price">
                    <span class="current-price">₹${product.price}</span>
                    <span class="original-price">₹${product.originalPrice}</span>
                </div>
                <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                    <i class="fa-solid fa-cart-plus"></i> Add to Cart
                </button>
            </div>
        </div>
    `).join("");
}

function addToCart(productId) {
    const product = products.find(p => p.id === Number(productId));
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartUI();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === Number(productId));
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    updateCartUI();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== Number(productId));
    updateCartUI();
}

function updateCartUI() {
    if (!cartCount || !cartItems || !cartTotal) return;

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = `₹${totalPrice.toLocaleString("en-IN")}`;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fa-solid fa-cart-shopping"></i>
                <p>Your cart is empty</p>
            </div>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <div class="quantity-controls">
                    <button onclick="updateQuantity(${item.id}, -1)">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    <button onclick="removeFromCart(${item.id})" class="remove-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");
}

function nextCheckoutStep() {
    const checkoutModal = document.getElementById("checkoutModal");
    if (checkoutModal) {
        checkoutModal.classList.add("active");
    }
}

function closeCheckout() {
    const checkoutModal = document.getElementById("checkoutModal");
    if (checkoutModal) {
        checkoutModal.classList.remove("active");
    }
}

function setupEventListeners() {
    document.addEventListener("click", event => {
        const addButton = event.target.closest(".add-to-cart");

        if (addButton) {
            addToCart(addButton.dataset.id);
        }
    });

    const categoryButtons = document.querySelectorAll("[data-category]");

    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            const category = button.dataset.category;

            if (!category || category === "All") {
                renderProducts(products);
            } else {
                renderProducts(
                    products.filter(product => product.category === category)
                );
            }
        });
    });
}

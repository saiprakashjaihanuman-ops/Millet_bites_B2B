// ========== GLOBAL VARIABLES ==========
let cart = [];

// ========== FETCH PRODUCTS ==========
async function fetchProducts() {
  try {
    const res = await fetch("get_products.php");
    const products = await res.json();
    displayProducts(products);
  } catch (err) {
    console.error("Error fetching products:", err);
  }
}

// ========== DISPLAY PRODUCTS ==========
function displayProducts(products) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("product-card");

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
      <button onclick="addToCart(${product.id}, '${product.name}', ${product.price})">Add to Cart</button>
    `;
    grid.appendChild(card);
  });
}

// ========== ADD TO CART ==========
function addToCart(id, name, price) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id, name, price, qty: 1 });
  }
  updateCart();
}

// ========== UPDATE CART ==========
function updateCart() {
  const cartItems = document.getElementById("panel-cart-items");
  const cartCount = document.getElementById("cartCount");
  const cartCount2 = document.getElementById("cartCount2");
  const cartSummary = document.querySelector(".cart-summary p");

  cartItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartItems.innerHTML = `<div class="empty-cart">Your cart is empty</div>`;
    cartSummary.textContent = "Total: ₹0.00";
    cartCount.textContent = 0;
    cartCount2.textContent = 0;
    return;
  }

  cart.forEach(item => {
    total += item.price * item.qty;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <span>${item.name} (x${item.qty})</span>
      <span>₹${item.price * item.qty}</span>
      <button onclick="removeFromCart(${item.id})">-</button>
    `;
    cartItems.appendChild(div);
  });

  cartSummary.textContent = `Total: ₹${total.toFixed(2)}`;
  cartCount.textContent = cart.length;
  cartCount2.textContent = cart.length;
}

// ========== REMOVE ITEM ==========
function removeFromCart(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    if (item.qty > 1) {
      item.qty--;
    } else {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCart();
}

// ========== CLEAR CART ==========
document.querySelector(".clear").addEventListener("click", () => {
  cart = [];
  updateCart();
});

// ========== TOGGLE CART PANEL ==========
document.getElementById("cartIcon").addEventListener("click", () => {
  document.getElementById("cartPanel").style.right = "0";
  document.getElementById("overlay").style.display = "block";
});
document.getElementById("cartIcon2").addEventListener("click", () => {
  document.getElementById("cartPanel").style.right = "0";
  document.getElementById("overlay").style.display = "block";
});
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("overlay").addEventListener("click", closeCart);

function closeCart() {
  document.getElementById("cartPanel").style.right = "-400px";
  document.getElementById("overlay").style.display = "none";
}

// ========== SEARCH FILTER ==========
function filterProducts() {
  const input = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll(".product-card");
  cards.forEach(card => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = title.includes(input) ? "block" : "none";
  });
}
function clearSearch() {
  document.getElementById("searchInput").value = "";
  filterProducts();
}

// ========== PAY NOW -> WHATSAPP ==========
function sendOrder() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "Hello, I would like to order:\n\n";
  let total = 0;

  cart.forEach(item => {
    message += `${item.name} x${item.qty} = ₹${item.price * item.qty}\n`;
    total += item.price * item.qty;
  });

  message += `\nTotal: ₹${total.toFixed(2)}`;

  const encodedMsg = encodeURIComponent(message);
  const phone = "919949840365"; // <-- your WhatsApp number (without +)
  const url = `https://wa.me/${phone}?text=${encodedMsg}`;

  window.open(url, "_blank");
}

// ========== INIT ==========
fetchProducts();

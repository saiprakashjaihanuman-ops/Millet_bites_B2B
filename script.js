/* ---------- Products ---------- */
const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, category: "combo" },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, category: "combo" },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, category: "combo" },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, category: "combo" },
  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 60, category: "hots" },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 60, category: "hots" },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 60, category: "hots" },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 60, category: "hots" },
  { name: "Jowar Murukkulu", image: "Jowar Murukkulu.jpeg", price: 60, category: "hots" },
  { name: "Jowar Ribbon Pakodi", image: "Jowar Ribbon Pakodi.jpeg", price: 60, category: "hots" },
  { name: "Foxtail Sev", image: "Foxtail Sev.jpeg", price: 60, category: "hots" },
  { name: "Arikalu Jantikalu", image: "Arikalu Jantikalu.jpeg", price: 60, category: "hots" },
  { name: "Samalu Boondi", image: "Samalu Boondi.jpeg", price: 60, category: "hots" },
  { name: "Dry Fruit Mixture", image: "Dry Fruit Mixture.jpeg", price: 180, category: "dryfruits" },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 300, category: "sweets" },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 200, category: "dryfruits" },
  { name: "Panchadara Gavvalu", image: "Panchadara Gavvalu.jpg", price: 100, category: "sweets" },
  { name: "Bellam Gavvalu", image: "Bellam Gavvalu.jpeg", price: 100, category: "sweets" },
  { name: "Hot Gavvalu", image: "Hot Gavvalu.jpeg", price: 100, category: "hots" }
];

/* ---------- Cart ---------- */
const cart = {};

/* ---------- Helper ---------- */
const safeId = (name) => name.replace(/\s+/g, '_').replace(/[^\w-]/g, '');

/* ---------- Render Categories ---------- */
function renderCategories() {
  const grid = document.getElementById("category-grid");
  grid.innerHTML = "";

  const categories = ["all", ...new Set(products.map(p => p.category))];

  categories.forEach(cat => {
    const div = document.createElement("div");
    div.className = "product-card";
    div.style.cursor = "pointer";
    div.innerHTML = `<h4>${cat === "all" ? "All Products" : cat.toUpperCase()}</h4>`;
    div.addEventListener("click", () => renderProducts(cat));
    grid.appendChild(div);
  });
}

/* ---------- Render Products ---------- */
function renderProducts(category) {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  const filtered = category === "all" ? products : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const id = safeId(product.name);
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
      <div class="quantity-controls">
        <button onclick="removeFromCart('${product.name}')">-</button>
        <span id="qty-${id}">${cart[product.name] ? cart[product.name].qty : 0}</span>
        <button onclick="addToCart('${product.name}', ${product.price})">+</button>
      </div>
    `;
    grid.appendChild(card);
  });
}

/* ---------- Cart Functions ---------- */
function addToCart(name, price) {
  if (!cart[name]) cart[name] = { price, qty: 0 };
  cart[name].qty++;
  updateCart();
  updateProductQty(name);
}

function removeFromCart(name) {
  if (cart[name]) {
    cart[name].qty--;
    if (cart[name].qty <= 0) delete cart[name];
    updateCart();
    updateProductQty(name);
  }
}

function updateProductQty(name) {
  const el = document.getElementById(`qty-${safeId(name)}`);
  if (el) el.textContent = cart[name] ? cart[name].qty : 0;
}

function updateCart() {
  const container = document.getElementById("panel-cart-items");
  const cartCount1 = document.getElementById("cartCount");
  const cartCount2 = document.getElementById("cartCount2");
  const summary = document.querySelector(".cart-summary p");

  container.innerHTML = "";
  let total = 0;

  if (Object.keys(cart).length === 0) {
    container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    summary.textContent = `Total: ₹0.00`;
    cartCount1.textContent = 0;
    cartCount2.textContent = 0;
    return;
  }

  for (let name in cart) {
    const item = cart[name];
    total += item.qty * item.price;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <span>${name} x${item.qty}</span>
      <span>₹${(item.qty * item.price).toFixed(2)}</span>
    `;
    container.appendChild(div);
  }

  summary.textContent = `Total: ₹${total.toFixed(2)}`;
  cartCount1.textContent = Object.keys(cart).length;
  cartCount2.textContent = Object.keys(cart).length;
}

/* ---------- Clear Cart ---------- */
document.querySelector(".clear").addEventListener("click", () => {
  for (let key in cart) delete cart[key];
  updateCart();
  renderProducts("all");
});

/* ---------- Search ---------- */
function filterProducts() {
  const query = document.getElementById("searchInput").value.toLowerCase();
  const cards = document.querySelectorAll("#product-grid .product-card");
  cards.forEach(card => {
    const title = card.querySelector("h4").textContent.toLowerCase();
    card.style.display = title.includes(query) ? "block" : "none";
  });
}
function clearSearch() {
  document.getElementById("searchInput").value = "";
  filterProducts();
}

/* ---------- Cart Panel Toggle ---------- */
function toggleCart() {
  const panel = document.getElementById("cartPanel");
  const overlay = document.getElementById("overlay");
  if (panel.style.right === "0px") {
    panel.style.right = "-400px";
    overlay.style.display = "none";
  } else {
    panel.style.right = "0px";
    overlay.style.display = "block";
  }
}
document.getElementById("cartIcon").addEventListener("click", toggleCart);
document.getElementById("cartIcon2").addEventListener("click", toggleCart);
document.getElementById("closeCart").addEventListener("click", toggleCart);
document.getElementById("overlay").addEventListener("click", toggleCart);

/* ---------- Pay Now → WhatsApp ---------- */
function sendOrder() {
  if (Object.keys(cart).length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let message = "Hello, I would like to order:\n\n";
  let total = 0;

  for (let name in cart) {
    const item = cart[name];
    message += `${name} x${item.qty} = ₹${(item.price * item.qty).toFixed(2)}\n`;
    total += item.price * item.qty;
  }

  message += `\nTotal: ₹${total.toFixed(2)}`;
  const encoded = encodeURIComponent(message);
  const phone = "919949840365";
  const url = `https://wa.me/${phone}?text=${encoded}`;
  window.open(url, "_blank");
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  renderCategories();
  renderProducts("all");
  updateCart();
});

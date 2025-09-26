// ---------- Product Data ----------
const products = [
  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 360, description: "Crunchy and wholesome Ragi mixture.", offer: "" },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 360, description: "Traditional chegodilu made from ragi.", offer: "Fast Selling" },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 360, description: "Crispy murukkulu with millet goodness.", offer: "" },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 360, description: "Light and tasty jowar mixture.", offer: "" },
  { name: "Jowar Murukkulu", image: "Jowar Murukkulu.jpeg", price: 360, description: "Light and tasty jowar mixture.", offer: "" },
  { name: "Jowar Ribbon Pakodi", image: "Jowar Ribbon Pakodi.jpeg", price: 360, description: "Light and tasty jowar mixture.", offer: "Fast Selling" },
  { name: "Arikalu Jantikalu", image: "Arikalu Jantikalu.jpeg", price: 360, description: "Light and tasty jowar mixture.", offer: "" },
  { name: "Samalu Boondi", image: "Samalu Boondi.jpeg", price: 360, description: "Light and tasty jowar mixture.", offer: "Fast Selling" },
  { name: "Foxtail Sev", image: "Foxtail Sev.jpeg", price: 360, description: "Light and tasty jowar mixture.", offer: "Fast Selling" },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 960, description: "Rich laddus with dry fruits.", offer: "Fast Selling" },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 150, description: "Crunchy cashew bars, great snack.", offer: "" }
];

const cart = {};
const safeId = name => name.replace(/\s+/g, '_');

// ---------- Render Products ----------
function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML = "";

  products.forEach(p => {
    const id = safeId(p.name);
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      ${p.offer ? `<div class="offer-badge">${p.offer}</div>` : ''}
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <div class="quantity-controls">
        <button onclick="removeFromCart('${p.name}')" aria-label="Remove one ${p.name}">-</button>
        <span id="qty-${id}">${cart[p.name] ? cart[p.name].qty : 0}</span>
        <button onclick="addToCart('${p.name}', ${p.price}, '${p.offer}')" aria-label="Add one ${p.name}">+</button>
      </div>`;
    grid.appendChild(card);

    card.querySelector('img').addEventListener('click', () => openProductModal(p));
    card.querySelector('h4').addEventListener('click', () => openProductModal(p));
  });
}

// ---------- Cart Functions ----------
function addToCart(name, price, offer = "") {
  if (!cart[name]) cart[name] = { qty: 0, price, offer };
  cart[name].qty++;
  updateCart();
  updateQty(name);
  flashButton(name, price);
}

function removeFromCart(name) {
  if (!cart[name]) return;
  cart[name].qty--;
  if (cart[name].qty <= 0) delete cart[name];
  updateCart();
  updateQty(name);
}

function updateQty(name) {
  const el = document.getElementById("qty-" + safeId(name));
  if (el) el.textContent = cart[name] ? cart[name].qty : 0;
}

function updateCart() {
  const container = document.getElementById("panel-cart-items");
  let html = "";
  let total = 0;
  const keys = Object.keys(cart);

  if (keys.length === 0) {
    container.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    document.querySelector(".cart-summary p").textContent = "Total: ₹0.00";
    updateCartCount();
    return;
  }

  keys.forEach(name => {
    const item = cart[name];
    let effectivePrice = item.price;

    if (item.offer && item.offer.includes('%')) {
      const percent = parseFloat(item.offer);
      effectivePrice = item.price * (1 - percent / 100);
    }

    if (item.offer && item.offer.includes('₹')) {
      const flat = parseFloat(item.offer.replace('₹',''));
      effectivePrice = item.price - flat;
    }

    const itemTotal = effectivePrice * item.qty;
    total += itemTotal;

    html += `
      <div class="cart-item">
        <span>${name}</span>
        <span>x${item.qty}</span>
        <span>₹${itemTotal.toFixed(2)}</span>
      </div>`;
  });

  container.innerHTML = html;
  document.querySelector(".cart-summary p").textContent = `Total: ₹${total.toFixed(2)}`;
  updateCartCount();
}

function updateCartCount() {
  const count = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
  document.querySelectorAll(".cart-count").forEach(el => el.textContent = count);
}

function toggleCartPanel() {
  document.getElementById("cartPanel").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
  document.body.style.overflow = document.getElementById("cartPanel").classList.contains("active") ? "hidden" : "";
}

// ---------- Product Modal ----------
const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalQty = document.getElementById("modalQty");
const modalAdd = document.getElementById("modalAddBtn");
const modalRemove = document.getElementById("modalRemoveBtn");
const closeModal = document.getElementById("closeProductModal");
let currentProduct = null;

function openProductModal(p) {
  currentProduct = p;
  modalImg.src = p.image;
  modalImg.alt = p.name;
  modalName.textContent = p.name;
  modalPrice.textContent = "₹" + p.price;
  modalDescription.textContent = p.description + (p.offer ? ` (${p.offer})` : '');
  modalQty.textContent = cart[p.name] ? cart[p.name].qty : 0;
  modal.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeProductModal() {
  modal.style.display = "none";
  document.body.style.overflow = "";
}

closeModal.addEventListener("click", closeProductModal);
window.addEventListener("click", e => { if(e.target === modal) closeProductModal(); });
modalAdd.addEventListener("click", () => { if(!currentProduct) return; addToCart(currentProduct.name, currentProduct.price, currentProduct.offer); modalQty.textContent = cart[currentProduct.name] ? cart[currentProduct.name].qty : 0; });
modalRemove.addEventListener("click", () => { if(!currentProduct) return; removeFromCart(currentProduct.name); modalQty.textContent = cart[currentProduct.name] ? cart[currentProduct.name].qty : 0; });

// ---------- DOM Ready ----------
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();

  document.getElementById("cartIcon").addEventListener("click", toggleCartPanel);
  document.getElementById("closeCart").addEventListener("click", toggleCartPanel);
  document.getElementById("overlay").addEventListener("click", toggleCartPanel);

  document.querySelector(".clear").addEventListener("click", () => {
    for (let k in cart) delete cart[k];
    updateCart();
    products.forEach(p => updateQty(p.name));
    toggleCartPanel();
  });

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if(targetId === '#') return;
      const targetElement = document.querySelector(targetId);
      if(targetElement) window.scrollTo({ top: targetElement.offsetTop - 80, behavior: 'smooth' });
    });
  });
});

// ---------- WhatsApp Pay ----------
function sendOrder() {
  if (Object.keys(cart).length === 0) { alert("Your cart is empty!"); return; }

  let text = "*Order from Millet Bites*\n\n";
  for (let name in cart) {
    const item = cart[name];
    text += `• ${name} x${item.qty} = ₹${(item.price*item.qty).toFixed(2)}${item.offer ? ` (${item.offer})` : ''}\n`;
  }

  const total = Object.keys(cart).reduce((sum,name) => sum + cart[name].price*cart[name].qty, 0);
  text += `\n*Total: ₹${total.toFixed(2)}*`;

  for (let k in cart) delete cart[k];
  updateCart();
  products.forEach(p => updateQty(p.name));
  toggleCartPanel();

  window.open(`https://wa.me/919949840365?text=${encodeURIComponent(text)}`, "_blank");
}

// ---------- Button flash ----------
function flashButton(name, price) {
  const button = document.querySelector(`button[onclick="addToCart('${name}', ${price})"]`);
  if(button) {
    button.style.backgroundColor = '#c4622a';
    setTimeout(()=>button.style.backgroundColor = '', 300);
  }
}

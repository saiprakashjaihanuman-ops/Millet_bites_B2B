const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, category: "combo", description:"Premium combo - assorted millet snacks." },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, category: "combo", description:"Tasty combo with crunchy favourites." },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, category: "combo", description:"Value combo for daily snacking." },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, category: "combo", description:"Assorted premium millet selections." },
  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 60, category: "hots", description:"Crunchy and wholesome Ragi mixture." },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 60, category: "hots", description:"Traditional chegodilu made from ragi." },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 60, category: "hots", description:"Crispy murukkulu with millet goodness." },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 60, category: "hots", description:"Light and tasty jowar mixture." },
  { name: "Dry Fruit Mixture", image: "Dry Fruit Mixture.jpeg", price: 180, category: "dryfruits", description:"Energy-dense dry fruit mix with millets." },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 300, category: "sweets", description:"Rich laddus with dry fruits." },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 200, category: "dryfruits", description:"Crunchy cashew bars, great snack." },
  { name: "Panchadara Gavvalu", image: "Panchadara Gavvalu.jpg", price: 100, category: "sweets", description:"Sweet gavvalu made with panchadara." },
  { name: "Bellam Gavvalu", image: "Bellam Gavvalu.jpeg", price: 100, category: "sweets", description:"Bellam (jaggery) gavvalu." },
  { name: "Hot Gavvalu", image: "Hot Gavvalu.jpeg", price: 100, category: "hots", description:"Spicy hot gavvalu." }
];

const cart = {};
const safeId = (name) => name.replace(/\s+/g,'_').replace(/[^\w-]/g,'');

function renderCategories() {
  const categoryGrid = document.getElementById("category-grid");
  categoryGrid.innerHTML = "";

  const allCard = document.createElement("div");
  allCard.className = "product-card";
  allCard.innerHTML = "<h4>All Products</h4>";
  allCard.addEventListener("click", () => renderProducts("all"));
  categoryGrid.appendChild(allCard);

  const categories = [...new Set(products.map(p=>p.category))];
  categories.forEach(cat=>{
    const div=document.createElement("div");
    div.className="product-card";
    div.innerHTML=`<h4>${cat.toUpperCase()}</h4>`;
    div.addEventListener("click",()=>renderProducts(cat));
    categoryGrid.appendChild(div);
  });
}

function renderProducts(category="all") {
  const grid = document.getElementById("product-grid");
  grid.innerHTML="";
  const filtered = category==="all"?products:products.filter(p=>p.category===category);

  filtered.forEach(product=>{
    const id = safeId(product.name);
    const card = document.createElement("div");
    card.className="product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h4>${product.name}</h4>
      <p>₹${product.price}</p>
      <div class="quantity-controls">
        <button onclick="removeFromCart('${product.name}')">-</button>
        <span id="qty-${id}">${cart[product.name]?cart[product.name].qty:0}</span>
        <button onclick="addToCart('${product.name}', ${product.price})">+</button>
      </div>
    `;
    grid.appendChild(card);

    card.querySelector('img').addEventListener('click',()=>openProductModal(product));
    card.querySelector('h4').addEventListener('click',()=>openProductModal(product));
  });
}

function addToCart(name, price) {
  if(!cart[name]) cart[name]={qty:0, price};
  cart[name].qty++;
  updateCart();
  updateProductQty(name);
}
function removeFromCart(name) {
  if(!cart[name]) return;
  cart[name].qty--;
  if(cart[name].qty<=0) delete cart[name];
  updateCart();
  updateProductQty(name);
}
function updateProductQty(name){
  const el=document.getElementById("qty-"+safeId(name));
  if(el) el.textContent = cart[name]?cart[name].qty:0;
}
function updateCart(){
  const container = document.getElementById("panel-cart-items");
  let html = "", total=0;
  const keys=Object.keys(cart);
  if(keys.length===0){ container.innerHTML='<div class="empty-cart">Your cart is empty</div>'; document.querySelector(".cart-summary p").textContent="Total: ₹0.00"; updateCartCount(); return;}
  keys.forEach(name=>{
    const item=cart[name];
    total+=item.price*item.qty;
    html+=`<div class="cart-item"><div>${name}</div><div>${item.qty}</div><div>₹${(item.price*item.qty).toFixed(2)}</div></div>`;
  });
  container.innerHTML=html;
  document.querySelector(".cart-summary p").textContent=`Total: ₹${total.toFixed(2)}`;
  updateCartCount();
}
function updateCartCount(){
  const count = Object.keys(cart).length;
  document.getElementById("cartCount").textContent=count;
  document.getElementById("cartCount2").textContent=count;
}

function toggleCartPanel(){
  document.getElementById("cartPanel").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
}

document.addEventListener("DOMContentLoaded",()=>{
  renderCategories();
  renderProducts();
  document.getElementById("cartIcon").addEventListener("click",toggleCartPanel);
  document.getElementById("cartIcon2").addEventListener("click",toggleCartPanel);
  document.getElementById("closeCart").addEventListener("click",toggleCartPanel);
  document.getElementById("overlay").addEventListener("click",toggleCartPanel);
  document.querySelector(".clear").addEventListener("click",()=>{
    for(let k in cart) delete cart[k];
    updateCart();
  });
});

/* ---------- Product Modal ---------- */
const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImage");
const modalName = document.getElementById("modalName");
const modalPrice = document.getElementById("modalPrice");
const modalDescription = document.getElementById("modalDescription");
const modalQty = document.getElementById("modalQty");
const modalAdd = document.getElementById("modalAddBtn");
const modalRemove = document.getElementById("modalRemoveBtn");
const closeModal = document.getElementById("closeProductModal");

let currentProduct=null;
function openProductModal(product){
  currentProduct=product;
  modalImg.src=product.image;
  modalName.textContent=product.name;
  modalPrice.textContent=`₹${product.price}`;
  modalDescription.textContent=product.description;
  modalQty.textContent=cart[product.name]?cart[product.name].qty:0;
  modal.style.display="flex";
}
closeModal.addEventListener("click",()=>{modal.style.display="none";});
modalAdd.addEventListener("click",()=>{
  if(!currentProduct) return;
  addToCart(currentProduct.name, currentProduct.price);
  modalQty.textContent=cart[currentProduct.name]?cart[currentProduct.name].qty:0;
});
modalRemove.addEventListener("click",()=>{
  if(!currentProduct) return;
  removeFromCart(currentProduct.name);
  modalQty.textContent=cart[currentProduct.name]?cart[currentProduct.name].qty:0;
});
window.addEventListener("click",(e)=>{if(e.target===modal) modal.style.display="none";});

/* ---------- WhatsApp Pay ---------- */
function sendOrder(){
  if(Object.keys(cart).length===0){ alert("Cart empty!"); return;}
  let text="*Order from Millet Bites*%0A";
  for(let name in cart){
    text+=`${name} x${cart[name].qty} = ₹${(cart[name].qty*cart[name].price).toFixed(2)}%0A`;
  }
  const total = Object.keys(cart).reduce((sum,name)=>sum+cart[name].qty*cart[name].price,0);
  text+=`Total: ₹${total.toFixed(2)}`;
  window.open(`https://wa.me/919949840365?text=${text}`,"_blank");
}

/* ---------- Search ---------- */
function filterProducts(){
  const q=document.getElementById("searchInput").value.toLowerCase();
  products.forEach(p=>{
    const el=document.querySelector(`.product-card h4:contains('${p.name}')`);
  });
}
function clearSearch(){ document.getElementById("searchInput").value=""; renderProducts();}

const products = [
  { name: "Combo Pack 1", image: "b1.jpeg", price: 999, description:"Premium combo - assorted millet snacks." },
  { name: "Combo Pack 2", image: "b2.jpeg", price: 299, description:"Tasty combo with crunchy favourites." },
  { name: "Combo Pack 3", image: "b3.jpeg", price: 399, description:"Value combo for daily snacking." },
  { name: "Combo Pack 4", image: "b4.jpeg", price: 599, description:"Assorted premium millet selections." },
  { name: "Ragi Mixture", image: "Ragi Mixture.jpeg", price: 60, description:"Crunchy and wholesome Ragi mixture." },
  { name: "Ragi Chegodilu", image: "Ragi Chegodilu.jpeg", price: 60, description:"Traditional chegodilu made from ragi." },
  { name: "Ragi Murukkulu", image: "Ragi Murukkulu.jpeg", price: 60, description:"Crispy murukkulu with millet goodness." },
  { name: "Jowar Mixture", image: "Jowar Mixture.jpeg", price: 60, description:"Light and tasty jowar mixture." },
  { name: "Dry Fruit Mixture", image: "Dry Fruit Mixture.jpeg", price: 180, description:"Energy-dense dry fruit mix with millets." },
  { name: "Dry Fruit Laddu", image: "Dry Fruit Laddu.jpeg", price: 300, description:"Rich laddus with dry fruits." },
  { name: "Cashew Bar", image: "Cashew Bar.jpeg", price: 200, description:"Crunchy cashew bars, great snack." },
  { name: "Panchadara Gavvalu", image: "Panchadara Gavvalu.jpg", price: 100, description:"Sweet gavvalu made with panchadara." },
  { name: "Bellam Gavvalu", image: "Bellam Gavvalu.jpeg", price: 100, description:"Bellam (jaggery) gavvalu." },
  { name: "Hot Gavvalu", image: "Hot Gavvalu.jpeg", price: 100, description:"Spicy hot gavvalu for spicy lovers." }
];

const cart = {};
const safeId = name => name.replace(/\s+/g,'_');

function renderProducts() {
  const grid = document.getElementById("product-grid");
  grid.innerHTML="";
  products.forEach(p=>{
    const id=safeId(p.name);
    const card=document.createElement("div");
    card.className="product-card";
    card.innerHTML=`<div class="badge">Best Offer</div>
      <img src="${p.image}" alt="${p.name}">
      <h4>${p.name}</h4>
      <p>₹${p.price}</p>
      <div class="quantity-controls">
        <button onclick="removeFromCart('${p.name}')">-</button>
        <span id="qty-${id}">${cart[p.name]?cart[p.name].qty:0}</span>
        <button onclick="addToCart('${p.name}',${p.price})">+</button>
      </div>`;
    grid.appendChild(card);
    card.querySelector('img').addEventListener('click',()=>openProductModal(p));
    card.querySelector('h4').addEventListener('click',()=>openProductModal(p));
  });
}

function addToCart(name,price){ 
  if(!cart[name]) cart[name]={qty:0,price}; 
  cart[name].qty++; 
  updateCart(); 
  updateQty(name);
}
function removeFromCart(name){ 
  if(!cart[name]) return; 
  cart[name].qty--; 
  if(cart[name].qty<=0) delete cart[name]; 
  updateCart(); 
  updateQty(name);
}
function updateQty(name){ 
  const el=document.getElementById("qty-"+safeId(name)); 
  if(el) el.textContent=cart[name]?cart[name].qty:0; 
}
function updateCart(){
  const container=document.getElementById("panel-cart-items"); 
  let html="",total=0;
  const keys=Object.keys(cart); 
  if(keys.length===0){ 
    container.innerHTML='<div class="empty-cart">Your cart is empty</div>'; 
    document.querySelector(".cart-summary p").textContent="Total: ₹0.00"; 
    updateCartCount(); 
    return;
  }
  keys.forEach(name=>{
    const item=cart[name]; 
    total+=item.price*item.qty; 
    html+=`
      <div class="cart-item">
        <span>${name}</span>
        <span>x${item.qty}</span>
        <span>₹${(item.price*item.qty).toFixed(2)}</span>
      </div>`;
  });
  container.innerHTML=html; 
  document.querySelector(".cart-summary p").textContent=`Total: ₹${total.toFixed(2)}`; 
  updateCartCount();
}
function updateCartCount(){ 
  const count=Object.values(cart).reduce((sum,item)=>sum+item.qty,0); 
  document.querySelectorAll(".cart-count").forEach(el=>el.textContent=count); 
}

function toggleCartPanel(){ 
  document.getElementById("cartPanel").classList.toggle("active"); 
  document.getElementById("overlay").classList.toggle("active"); 
}

document.addEventListener("DOMContentLoaded",()=>{
  renderProducts();
  document.querySelectorAll(".cart-icon").forEach(el=>el.addEventListener("click",toggleCartPanel));
  document.getElementById("closeCart").addEventListener("click",toggleCartPanel);
  document.getElementById("overlay").addEventListener("click",toggleCartPanel);
  document.querySelector(".clear").addEventListener("click",()=>{
    for(let k in cart) delete cart[k]; 
    updateCart(); 
    products.forEach(p=>updateQty(p.name));
  });
});

/* ---------- Product Modal ---------- */
const modal=document.getElementById("productModal");
const modalImg=document.getElementById("modalImage");
const modalName=document.getElementById("modalName");
const modalPrice=document.getElementById("modalPrice");
const modalDescription=document.getElementById("modalDescription");
const modalQty=document.getElementById("modalQty");
const modalAdd=document.getElementById("modalAddBtn");
const modalRemove=document.getElementById("modalRemoveBtn");
const closeModal=document.getElementById("closeProductModal");
let currentProduct=null;

function openProductModal(p){
  currentProduct=p;
  modalImg.src=p.image;
  modalImg.alt=p.name;
  modalName.textContent=p.name;
  modalPrice.textContent="₹"+p.price;
  modalDescription.textContent=p.description;
  modalQty.textContent=cart[p.name]?cart[p.name].qty:0;
  modal.style.display="flex";
}
closeModal.addEventListener("click",()=>modal.style.display="none");
modalAdd.addEventListener("click",()=>{ 
  if(!currentProduct) return; 
  addToCart(currentProduct.name,currentProduct.price); 
  modalQty.textContent=cart[currentProduct.name]?cart[currentProduct.name].qty:0; 
});
modalRemove.addEventListener("click",()=>{ 
  if(!currentProduct) return; 
  removeFromCart(currentProduct.name); 
  modalQty.textContent=cart[currentProduct.name]?cart[currentProduct.name].qty:0; 
});
window.addEventListener("click",e=>{ if(e.target===modal) modal.style.display="none"; });

/* ---------- WhatsApp Pay ---------- */
function sendOrder(){
  if(Object.keys(cart).length===0){ alert("Cart empty!"); return;}
  let text="*Order from Millet Bites*%0A";
  for(let name in cart){ 
    text+=`${name} x${cart[name].qty} = ₹${(cart[name].qty*cart[name].price).toFixed(2)}%0A`; 
  }
  const total=Object.keys(cart).reduce((sum,name)=>sum+cart[name].qty*cart[name].price,0);
  text+="Total: ₹"+total.toFixed(2);
  window.open(`https://wa.me/919949840365?text=${text}`,"_blank");
}

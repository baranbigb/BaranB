const products = [
  {id:1,name:"Penguin Wind-Up Toy",category:"Toys",price:1250,icon:"🐧",rating:"4.8 (320)",image:""},
  {id:2,name:"Remote Control Car",category:"Toys",price:2950,icon:"🚗",rating:"4.7 (210)",image:""},
  {id:3,name:"Kitchen Chopper",category:"Kitchen & Home",price:1850,icon:"🥣",rating:"4.6 (150)",image:""},
  {id:4,name:"Cute Keychain Set",category:"Keychains",price:650,icon:"🔑",rating:"4.9 (480)",image:""},
  {id:5,name:"Building Blocks",category:"Toys",price:1750,icon:"🧱",rating:"4.7 (300)",image:""},
  {id:6,name:"LED Night Lamp",category:"Kitchen & Home",price:1450,icon:"💡",rating:"4.8 (260)",image:""},
  {id:7,name:"Kids Toy",category:"Toys",price:0,icon:"🧸",rating:"New",image:""},
  {id:8,name:"Decorative Keychain",category:"Keychains",price:0,icon:"🧿",rating:"New",image:""},
  {id:9,name:"Smart Kitchen Gadget",category:"Kitchen & Home",price:0,icon:"🍳",rating:"New",image:""},
  {id:10,name:"Gift Toy",category:"Toys",price:0,icon:"🎁",rating:"New",image:""}
];

let cart=[];
const money = n => n ? "Rs. " + n.toLocaleString("en-PK") : "Price on request";

function card(p){
  const img = p.image ? `<img src="${p.image}" alt="${p.name}">` : p.icon;
  return `<article class="product">
    <div class="product-img">${img}</div>
    <h3>${p.name}</h3><p class="price">${money(p.price)}</p>
    <div class="rating">★ ${p.rating}</div>
    <button class="add" onclick="addToCart(${p.id})">🛒 Add to Cart</button>
  </article>`;
}
function render(){
  document.getElementById("productGrid").innerHTML=products.slice(0,6).map(card).join("");
  document.querySelectorAll(".category-products").forEach(el=>{
    const list=products.filter(p=>p.category===el.dataset.category);
    el.innerHTML=list.map(card).join("");
  });
}
function addToCart(id){const p=products.find(x=>x.id===id);cart.push(p);document.getElementById("cartCount").textContent=cart.length;renderCart();document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open")}
function renderCart(){document.getElementById("cartItems").innerHTML=cart.length?cart.map((p,i)=>`<div class="cart-row"><span>${p.name}</span><strong>${money(p.price)}</strong></div>`).join(""):"<p>Your cart is empty.</p>";document.getElementById("cartTotal").textContent=money(cart.reduce((s,p)=>s+(p.price||0),0))}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("open")}
document.getElementById("cartBtn").onclick=()=>{renderCart();document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("open")};
document.getElementById("closeCart").onclick=closeCart;document.getElementById("overlay").onclick=closeCart;
document.getElementById("searchBtn").onclick=()=>{const q=document.getElementById("search").value.toLowerCase();const results=products.filter(p=>(p.name+" "+p.category).toLowerCase().includes(q));document.getElementById("productGrid").innerHTML=(q?results:products.slice(0,6)).map(card).join("");document.getElementById("products").scrollIntoView({behavior:"smooth"})};
render();

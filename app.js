(function(){
const money = n => "Rs. " + Number(n).toLocaleString("en-PK");
const byId = id => PRODUCTS.find(p => p.id === id);
const page = (location.pathname.split("/").pop() || "index.html");
const qs = new URLSearchParams(location.search);
const $ = (s, r) => (r || document).querySelector(s);
const ICON = {
 search:'<svg class="i" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
 cart:'<svg class="i" viewBox="0 0 24 24"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.5L21 7H6"/></svg>',
 wa:'<svg class="i" viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.3L3 20l1.3-5.4A8.4 8.4 0 1 1 21 11.5Z"/></svg>',
 menu:'<svg class="i" viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
 x:'<svg class="i" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 truck:'<svg class="i" viewBox="0 0 24 24"><rect x="1" y="7" width="14" height="10" rx="1"/><path d="M15 10h4l3 3v4h-7z"/><circle cx="6" cy="19" r="1.6"/><circle cx="17.5" cy="19" r="1.6"/></svg>',
 tag:'<svg class="i" viewBox="0 0 24 24"><path d="M20.6 13.4l-7.2 7.2a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.3"/></svg>'
};
const WAFLOAT = '<svg viewBox="0 0 32 32"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.6.8 5 2.1 7L3 29l6.7-2.3c1.9 1 4 1.6 6.3 1.6 7 0 12.7-5.6 12.7-12.5S23 3 16 3Zm5.8 19.2c-.3.7-1.7 1.4-2.3 1.5-.6.1-1.3.1-2.1-.1-2-.6-3.8-1.8-5.2-3.5-1.8-2-3-4.3-3.4-6.4-.2-1.3.4-2.4 1.1-3.1.3-.3.6-.4.8-.4h.6c.2 0 .5-.1.7.5.3.6.9 2.2 1 2.4.1.2.1.4 0 .6-.2.4-.4.6-.7.9-.2.2-.4.4-.2.8.4.8 1 1.6 1.7 2.2.8.7 1.6 1.2 2.5 1.5.4.2.6.1.8-.1.3-.3.9-1 1.1-1.3.2-.3.5-.3.8-.2.3.1 1.9.9 2.2 1.1.3.2.5.3.6.4.1.2.1.8-.2 1.5Z"/></svg>';

/* ---------- cart ---------- */
function getCart(){ try{ return JSON.parse(localStorage.getItem("baranb_cart")) || []; }catch(e){ return []; } }
function setCart(c){ try{ localStorage.setItem("baranb_cart", JSON.stringify(c)); }catch(e){} refreshCart(); }
function addToCart(id, q){
  q = q || 1; const c = getCart(); const it = c.find(x => x.id === id);
  if(it) it.q += q; else c.push({id:id, q:q});
  setCart(c); toast("Added to cart"); openCart();
}
function changeQty(id, d){ const c = getCart(); const it = c.find(x => x.id === id); if(!it) return; it.q += d; setCart(c.filter(x => x.q > 0)); }
function removeItem(id){ setCart(getCart().filter(x => x.id !== id)); }
function cartTotal(){ return getCart().reduce((s, x) => { const p = byId(x.id); return s + (p ? p.price * x.q : 0); }, 0); }
function waLink(text){ return "https://wa.me/" + SITE.wa + "?text=" + encodeURIComponent(text); }
function cartMessage(){
  const lines = getCart().map(x => { const p = byId(x.id); return p ? "- " + p.name + " x" + x.q + " (" + money(p.price * x.q) + ")" : ""; }).filter(Boolean);
  return "Hi BaranB, I want to order:\n" + lines.join("\n") + "\nTotal: " + money(cartTotal());
}
function refreshCart(){
  const c = getCart(); const n = c.reduce((s, x) => s + x.q, 0);
  document.querySelectorAll(".cart-count").forEach(e => { e.textContent = n; e.style.display = n ? "flex" : "none"; });
  const b = $("#drawerBody"), f = $("#drawerFoot"); if(!b) return;
  if(!c.length){ b.innerHTML = '<div class="empty">Your cart is empty.<br><br><a class="btn btn-orange btn-sm" href="shop.html">Start shopping</a></div>'; f.style.display = "none"; return; }
  f.style.display = "grid";
  b.innerHTML = c.map(x => { const p = byId(x.id); if(!p) return ""; return '<div class="crow"><img src="'+p.images[0]+'" alt=""><div><b>'+p.name+'</b><small>'+money(p.price)+'</small><div class="q"><button data-d="-1" data-id="'+p.id+'">-</button><span>'+x.q+'</span><button data-d="1" data-id="'+p.id+'">+</button></div></div><button class="rm" data-rm="'+p.id+'">Remove</button></div>'; }).join("");
  $("#cartTotal").textContent = money(cartTotal());
  $("#cartOrder").href = waLink(cartMessage());
}
function openCart(){ $("#drawer").classList.add("open"); $("#ov").classList.add("open"); }
function closeCart(){ $("#drawer").classList.remove("open"); $("#ov").classList.remove("open"); }
function toast(t){ const e = $("#toast"); e.textContent = t; e.classList.add("show"); clearTimeout(toast.t); toast.t = setTimeout(() => e.classList.remove("show"), 1600); }

/* ---------- cards ---------- */
function cardHTML(p){
  const badges = (p.tag === "bestseller" ? '<span class="badge best">Best Seller</span>' : p.tag === "new" ? '<span class="badge new">New</span>' : "") + (p.oldPrice ? '<span class="badge sale">Sale</span>' : "");
  const link = "product.html?id=" + p.id;
  return '<article class="card"><a class="pic" href="'+link+'"><div class="badges">'+badges+'</div><img loading="lazy" src="'+p.images[0]+'" alt="'+p.name+'"></a>' +
    '<div class="info"><span class="cat-l">'+CATS[p.cat].name+'</span><h3><a href="'+link+'">'+p.name+'</a></h3>' +
    '<div class="price">'+money(p.price)+(p.oldPrice ? '<s>'+money(p.oldPrice)+'</s>' : '')+'</div>' +
    '<div class="acts"><button class="btn btn-orange" data-add="'+p.id+'">Add to Cart</button>' +
    '<a class="btn btn-wa wa" title="Order on WhatsApp" target="_blank" rel="noopener" href="'+waLink("Hi BaranB, I want to order: "+p.name+" ("+money(p.price)+")")+'">'+ICON.wa+'</a></div></div></article>';
}
function renderGrid(el, list){ el.innerHTML = list.length ? list.map(cardHTML).join("") : '<div class="empty" style="grid-column:1/-1">No products found. Try another search.</div>'; }

/* ---------- layout ---------- */
function layout(){
  const navs = [["index.html","Home"],["deals.html","Deals","em"],["new-arrivals.html","New Arrivals","emn"],["shop.html","Shop All"],["toys.html","Toys"],["kitchen.html","Kitchen & Home"],["beauty.html","Beauty & Personal Care"]];
  const nav = navs.map(n => '<a href="'+n[0]+'"'+(page===n[0] ? ' class="active"' : '')+'>'+n[1]+(n[2]==="em" ? '<em>Hot</em>' : n[2]==="emn" ? '<em class="n">New</em>' : '')+'</a>').join("");
  const h = $("#site-header"); if(h) h.innerHTML =
   '<div class="announce">Order on WhatsApp <b>'+SITE.phone+'</b> &nbsp;|&nbsp; Delivery across Pakistan &nbsp;|&nbsp; Factory-direct prices</div>' +
   '<header class="site-header"><div class="head-row"><a class="logo" href="index.html"><img src="images/logo.png" alt="BaranB"></a>' +
   '<form class="search" action="shop.html" method="get"><input name="q" placeholder="Search for toys, kitchen, beauty..." value="'+(qs.get("q")||"").replace(/"/g,"")+'"><button aria-label="Search">'+ICON.search+'</button></form>' +
   '<div class="head-actions"><a class="btn btn-wa btn-sm" target="_blank" rel="noopener" href="'+waLink("Hi BaranB, I have a question.")+'">'+ICON.wa+'<span>WhatsApp</span></a>' +
   '<button class="icon-btn" id="cartBtn" aria-label="Cart">'+ICON.cart+'<span class="count cart-count" style="display:none">0</span></button></div></div>' +
   '<nav class="nav"><div class="nav-in">'+nav+'</div></nav></header>';
  const f = $("#site-footer"); if(f) f.innerHTML =
   '<footer class="foot"><div class="wrap"><div class="foot-grid"><div><img class="fl" src="images/logo.png" alt="BaranB"><p>Toys, kitchen helpers and beauty care tools at factory-direct prices. Order on WhatsApp, delivered across Pakistan.</p>' +
   '<div class="socials"><a target="_blank" rel="noopener" href="'+SITE.insta+'">Instagram</a><a target="_blank" rel="noopener" href="'+SITE.fb+'">Facebook</a><a target="_blank" rel="noopener" href="'+SITE.yt+'">YouTube</a><a target="_blank" rel="noopener" href="'+SITE.tt+'">TikTok</a></div></div>' +
   '<div><h4>Shop</h4><ul><li><a href="shop.html">All Products</a></li><li><a href="new-arrivals.html">New Arrivals</a></li><li><a href="deals.html">Deals</a></li></ul></div>' +
   '<div><h4>Categories</h4><ul><li><a href="toys.html">Toys</a></li><li><a href="kitchen.html">Kitchen &amp; Home</a></li><li><a href="beauty.html">Beauty &amp; Personal Care</a></li></ul></div>' +
   '<div id="contact"><h4>Contact</h4><ul><li>Karachi, Pakistan</li><li>WhatsApp: <a href="'+waLink("Hi BaranB")+'" target="_blank" rel="noopener">'+SITE.phone+'</a></li><li>Instagram: @baranbigb</li></ul></div></div>' +
   '<div class="foot-bot"><span>&copy; 2026 BaranB. All rights reserved.</span><span>Toys, Kitchen &amp; Beauty essentials</span></div></div></footer>';
  document.body.insertAdjacentHTML("beforeend",
   '<div class="ov" id="ov"></div><aside class="drawer" id="drawer"><div class="drawer-h"><h3>Your Cart</h3><button class="icon-btn" id="closeCart" aria-label="Close">'+ICON.x+'</button></div><div class="drawer-b" id="drawerBody"></div>' +
   '<div class="drawer-f" id="drawerFoot"><div class="tot"><span>Total</span><span id="cartTotal">Rs. 0</span></div><a class="btn btn-wa" id="cartOrder" target="_blank" rel="noopener" href="#">'+ICON.wa+' Order on WhatsApp</a><a class="btn btn-outline" href="shop.html">Continue shopping</a></div></aside>' +
   '<a class="wa-float" target="_blank" rel="noopener" aria-label="Chat on WhatsApp" href="'+waLink("Hi BaranB, I have a question.")+'">'+WAFLOAT+'</a><div class="toast" id="toast"></div>');
  $("#cartBtn").onclick = openCart; $("#closeCart").onclick = closeCart; $("#ov").onclick = closeCart;
  document.addEventListener("click", e => {
    const a = e.target.closest("[data-add]"); if(a){ addToCart(a.dataset.add, 1); return; }
    const d = e.target.closest("[data-d]"); if(d){ changeQty(d.dataset.id, Number(d.dataset.d)); return; }
    const r = e.target.closest("[data-rm]"); if(r){ removeItem(r.dataset.rm); }
  });
  refreshCart();
}

/* ---------- page logic ---------- */
function sortList(list, s){
  const l = list.slice();
  if(s === "low") l.sort((a,b) => a.price - b.price);
  else if(s === "high") l.sort((a,b) => b.price - a.price);
  else if(s === "new") l.sort((a,b) => (b.tag==="new") - (a.tag==="new"));
  return l;
}
function initCollection(){
  const el = $("#grid"); if(!el) return;
  const fixed = el.dataset.cat || ""; const filter = el.dataset.filter || "";
  let cat = fixed || qs.get("cat") || "", q = (qs.get("q") || "").toLowerCase().trim(), sort = "";
  function base(){
    let l = PRODUCTS.slice();
    if(filter === "new") l = l.filter(p => p.tag === "new");
    if(filter === "deal") l = l.filter(p => p.oldPrice);
    if(cat) l = l.filter(p => p.cat === cat);
    if(q) l = l.filter(p => (p.name + " " + CATS[p.cat].name + " " + p.desc).toLowerCase().includes(q));
    return sortList(l, sort);
  }
  function draw(){
    const l = base(); renderGrid(el, l);
    const c = $("#count"); if(c) c.textContent = l.length + (l.length === 1 ? " product" : " products") + (q ? ' for "' + q + '"' : "");
    document.querySelectorAll(".chip").forEach(ch => ch.classList.toggle("on", (ch.dataset.cat || "") === cat));
  }
  document.querySelectorAll(".chip").forEach(ch => ch.onclick = () => { cat = ch.dataset.cat || ""; draw(); });
  const s = $("#sort"); if(s) s.onchange = () => { sort = s.value; draw(); };
  draw();
}
function initHome(){
  const s = $("#slides"); if(!s) return;
  const n = s.children.length; let i = 0, t;
  const dots = $("#dots");
  dots.innerHTML = Array.from({length:n}, (_, k) => '<button aria-label="Slide '+(k+1)+'"></button>').join("");
  function go(k){ i = (k + n) % n; s.style.transform = "translateX(-" + (i * 100) + "%)"; dots.querySelectorAll("button").forEach((b, j) => b.classList.toggle("on", j === i)); }
  dots.querySelectorAll("button").forEach((b, j) => b.onclick = () => { go(j); reset(); });
  $("#prev").onclick = () => { go(i - 1); reset(); }; $("#next").onclick = () => { go(i + 1); reset(); };
  function reset(){ clearInterval(t); t = setInterval(() => go(i + 1), 5500); }
  go(0); reset();
  renderGrid($("#newGrid"), PRODUCTS.filter(p => p.tag === "new").slice(0, 4));
  renderGrid($("#bestGrid"), PRODUCTS.filter(p => p.tag === "bestseller").slice(0, 8));
}
function initProduct(){
  const root = $("#pd"); if(!root) return;
  const p = byId(qs.get("id"));
  if(!p){ root.innerHTML = '<div class="empty" style="grid-column:1/-1">Product not found.<br><br><a class="btn btn-orange" href="shop.html">View all products</a></div>'; return; }
  document.title = p.name + " | BaranB";
  let qty = 1;
  const cat = CATS[p.cat];
  const badges = (p.tag === "bestseller" ? '<span class="badge best">Best Seller</span> ' : p.tag === "new" ? '<span class="badge new">New</span> ' : "") + (p.oldPrice ? '<span class="badge sale">Sale</span>' : "");
  root.innerHTML = '<div class="gal"><div class="main"><img id="mainImg" src="'+p.images[0]+'" alt="'+p.name+'"></div>' +
    (p.images.length > 1 ? '<div class="thumbs">' + p.images.map((u, k) => '<button class="'+(k===0?'on':'')+'" data-i="'+k+'"><img src="'+u+'" alt=""></button>').join("") + '</div>' : "") + '</div>' +
    '<div><div class="crumbs"><a href="index.html">Home</a> / <a href="'+cat.page+'">'+cat.name+'</a> / '+p.name+'</div>' + badges +
    '<h1>'+p.name+'</h1><div class="price">'+money(p.price)+(p.oldPrice ? '<s>'+money(p.oldPrice)+'</s>' : '')+'</div><p class="desc">'+p.desc+'</p>' +
    '<ul class="feat">'+p.features.map(f => '<li>'+f+'</li>').join("")+'</ul>' +
    '<div class="buyrow"><div class="qty"><button id="qm">-</button><span id="qv">1</span><button id="qp">+</button></div><button class="btn btn-orange" id="addBtn">Add to Cart</button></div>' +
    '<a class="btn btn-wa" id="waBtn" target="_blank" rel="noopener" href="#">'+ICON.wa+' Order on WhatsApp</a>' +
    (p.note ? '<div class="note warn"><b>Please note:</b> '+p.note+'</div>' : "") +
    '<div class="note">Message us on WhatsApp for delivery details to your city.</div></div>';
  function upd(){ $("#qv").textContent = qty; $("#waBtn").href = waLink("Hi BaranB, I want to order: "+p.name+" x"+qty+" ("+money(p.price*qty)+")"); }
  $("#qm").onclick = () => { qty = Math.max(1, qty - 1); upd(); }; $("#qp").onclick = () => { qty++; upd(); };
  $("#addBtn").onclick = () => addToCart(p.id, qty); upd();
  root.querySelectorAll(".thumbs button").forEach(b => b.onclick = () => { $("#mainImg").src = p.images[b.dataset.i]; root.querySelectorAll(".thumbs button").forEach(x => x.classList.toggle("on", x === b)); });
  const rel = PRODUCTS.filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const r = $("#related"); if(r && rel.length) renderGrid($("#relGrid"), rel); else if(r) r.style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => { layout(); initHome(); initCollection(); initProduct(); });
})();

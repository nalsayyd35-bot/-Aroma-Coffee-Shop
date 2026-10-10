// قائمة المنتجات المعروضة
const products = [
  { id: 1, name: "إسببريسو سينجل", category: "hot", price: 3.5, image: "images/espresso.jpg", desc: "جرعة إسببريسو مكثفة ونقية من أحدث الحبوب المحمصة." },
  { id: 2, name: "كورتادو أروما", category: "hot", price: 4.5, image: "images/cortado.jpg", desc: "توازن مثالي بين الإسببريسو والحليب المبخر بنعومة." },
  { id: 3, name: "سبانيش لاتيه بارد", category: "cold", price: 5.5, image: "images/spanish-latte.jpg", desc: "مشروب بارد مع الحليب المكثف والنكهة الغنية." },
  { id: 4, name: "V60 مقطرة باردة", category: "cold", price: 6.0, image: "images/v60.jpg", desc: "قهوة مقطرة ببطء لإبراز إيحاءات الفواكه والشوكولاتة." },
  { id: 5, name: "كرواسون بالزبدة", category: "bakery", price: 3.0, image: "images/croissant.jpg", desc: "هش وطازج يجهز يومياً في فرننا الخاص." },
  { id: 6, name: "كيكة الشوكولاتة والقهوة", category: "bakery", price: 4.5, image: "images/cake.jpg", desc: "طبقات من الشوكولاتة الداكنة بنكهة الإسببريسو." },
  { id: 7, name: "حبوب إثيوبيا سيدامو (250g)", category: "beans", price: 16.0, image: "images/coffee-beans.jpg", desc: "إيحاءات الزهور والياسمين مع حمضية ناعمة." }
];

let cart = [];
let selectedProduct = null;

// عناصر الـ DOM
const productsGrid = document.getElementById("productsGrid");
const cartBadge = document.getElementById("cartBadge");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const toast = document.getElementById("toast");

// عرض المنتجات
function renderProducts(filter = "all") {
  productsGrid.innerHTML = "";
  const filtered = filter === "all" ? products : products.filter(p => p.category === filter);
  
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <div class="product-info">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="product-bottom">
          <span class="price">${p.price.toFixed(2)} $</span>
          <button class="add-card-btn" onclick="openCustomModal(${p.id})">+</button>
        </div>
      </div>
    `;
    productsGrid.appendChild(card);
  });
}

// التصفية بالـ Tabs
document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    e.target.classList.add("active");
    renderProducts(e.target.dataset.category);
  });
});

// فتح نافذة التخصيص
function openCustomModal(id) {
  selectedProduct = products.find(p => p.id === id);
  document.getElementById("modalTitle").innerText = selectedProduct.name;
  document.getElementById("modalPrice").innerText = `${selectedProduct.price.toFixed(2)} $`;
  
  document.getElementById("customModal").classList.add("open");
}

function closeModal() {
  document.getElementById("customModal").classList.remove("open");
}

document.getElementById("closeModal").addEventListener("click", closeModal);

// التعامل مع اختيارات التخصيص
document.querySelectorAll("#sizeOptions .pill").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll("#sizeOptions .pill").forEach(p => p.classList.remove("active"));
    e.target.classList.add("active");
  });
});

document.querySelectorAll("#sugarOptions .pill").forEach(btn => {
  btn.addEventListener("click", (e) => {
    document.querySelectorAll("#sugarOptions .pill").forEach(p => p.classList.remove("active"));
    e.target.classList.add("active");
  });
});

// إضافة للسلة
document.getElementById("confirmAddBtn").addEventListener("click", () => {
  const activeSize = document.querySelector("#sizeOptions .pill.active");
  const sizeText = activeSize.dataset.size;
  const sizeExtra = parseFloat(activeSize.dataset.extra);

  const milkText = document.getElementById("milkOption").value;
  const sugarText = document.querySelector("#sugarOptions .pill.active").dataset.sugar;

  let finalPrice = selectedProduct.price + sizeExtra;
  if (milkText.includes("+1.0")) finalPrice += 1.0;

  const item = {
    id: Date.now(),
    name: selectedProduct.name,
    price: finalPrice,
    details: `${sizeText} | ${milkText.split(" ")[0]} | ${sugarText}`
  };

  cart.push(item);
  updateCart();
  closeModal();
  showToast(`تمت إضافة ${selectedProduct.name} إلى السلة ☕`);
});

// تحديث السلة
function updateCart() {
  cartBadge.innerText = cart.length;
  cartItems.innerHTML = "";
  
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>
        <h4>${item.name}</h4>
        <small>${item.details}</small>
        <strong>${item.price.toFixed(2)} $</strong>
      </div>
      <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; cursor:pointer;">&times;</button>
    `;
    cartItems.appendChild(div);
  });

  cartTotal.innerText = `${total.toFixed(2)} $`;
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

// التحكم بالسلة Drawer
const cartDrawer = document.getElementById("cartDrawer");
const cartOverlay = document.getElementById("cartOverlay");

document.getElementById("openCartBtn").addEventListener("click", () => {
  cartDrawer.classList.add("open");
  cartOverlay.classList.add("open");
});

function closeCartDrawer() {
  cartDrawer.classList.remove("open");
  cartOverlay.classList.remove("open");
}

document.getElementById("closeCart").addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

// إظهار التنبيه (Toast)
function showToast(msg) {
  toast.innerText = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3000);
}

// نموذج الحجز
document.getElementById("reserveForm").addEventListener("submit", (e) => {
  e.preventDefault();
  showToast("تم إرسال طلب الحجز بنجاح! ننتظرك بكل حب ✨");
  e.target.reset();
});

document.getElementById("checkoutBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    showToast("السلة فارغة حالياً!");
    return;
  }
  showToast("تم إرسال طلبك للمطبخ/المحمصة! شكراً لك ✨");
  cart = [];
  updateCart();
  closeCartDrawer();
});

// التشغيل الأولي
renderProducts();
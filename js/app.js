const products = [
  { id: 1, title: '蓝牙耳机', price: 199.00, img: 'https://via.placeholder.com/400x300?text=耳机' },
  { id: 2, title: '便携充电宝', price: 129.00, img: 'https://via.placeholder.com/400x300?text=充电宝' },
  { id: 3, title: '无线鼠标', price: 79.00, img: 'https://via.placeholder.com/400x300?text=鼠标' },
  { id: 4, title: '机械键盘', price: 599.00, img: 'https://via.placeholder.com/400x300?text=键盘' }
];

const $products = document.getElementById('products');
const $cartToggle = document.getElementById('cartToggle');
const $cartDrawer = document.getElementById('cartDrawer');
const $cartItems = document.getElementById('cartItems');
const $cartCount = document.getElementById('cartCount');
const $cartTotal = document.getElementById('cartTotal');
const $closeCart = document.getElementById('closeCart');
const $checkoutBtn = document.getElementById('checkoutBtn');

let cart = JSON.parse(localStorage.getItem('cart_v1') || '{}');

function saveCart(){ localStorage.setItem('cart_v1', JSON.stringify(cart)); }

function renderProducts(){
  $products.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <div class="product-title">${p.title}</div>
        <div class="product-price">¥${p.price.toFixed(2)}</div>
        <div style="margin-top:auto;"><button class="btn" data-id="${p.id}">加入购物车</button></div>
      </div>`;
    $products.appendChild(card);
  });
}

function addToCart(id){
  const p = products.find(x=>x.id===id); if(!p) return;
  if(!cart[id]) cart[id] = { ...p, qty:0 };
  cart[id].qty += 1;
  saveCart(); updateCartUI();
  // 新年学习计划动画增强
  window.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('.welcome-title');
    const items = document.querySelectorAll('.plan-item');
    const wish = document.querySelector('.wish');
    // 触发标题动画
    if (title) {
      title.style.opacity = '0';
      setTimeout(() => {
        title.style.opacity = '1';
      }, 200);
    }
    // 依次触发列表项动画
    items.forEach((item, idx) => {
      item.style.opacity = '0';
      setTimeout(() => {
        item.style.opacity = '1';
      }, 600 + idx * 300);
    });
    // 祝福文字动画已由CSS控制

    // 按钮交互功能
    const randomBtn = document.getElementById('randomBtn');
    const addBtn = document.getElementById('addBtn');
    const highlightAllBtn = document.getElementById('highlightAllBtn');
    const addPlanBox = document.getElementById('addPlanBox');
    const newPlanInput = document.getElementById('newPlanInput');
    const confirmAddBtn = document.getElementById('confirmAddBtn');
    const planList = document.querySelector('.plan-list');
    const msgBox = document.getElementById('msgBox');

    // 操作提示弹窗
    function showMsg(msg) {
      if (!msgBox) return;
      msgBox.textContent = msg;
      msgBox.style.display = 'block';
      msgBox.style.opacity = '1';
      setTimeout(() => {
        msgBox.style.opacity = '0';
        setTimeout(() => { msgBox.style.display = 'none'; }, 400);
      }, 1500);
    }
    // 按钮激活效果
    function activateBtn(btn) {
      btn.classList.add('active');
      setTimeout(() => { btn.classList.remove('active'); }, 400);
    }

    // 随机高亮一个计划项
    randomBtn.addEventListener('click', function() {
      const allItems = planList.querySelectorAll('.plan-item');
      allItems.forEach(item => item.classList.remove('highlight'));
      if (allItems.length === 0) return;
      const idx = Math.floor(Math.random() * allItems.length);
      allItems[idx].classList.add('highlight');
      activateBtn(randomBtn);
      showMsg('抽取结果：' + allItems[idx].textContent);
    });

    // 显示添加计划输入框
    addBtn.addEventListener('click', function() {
      addPlanBox.style.display = addPlanBox.style.display === 'none' ? 'block' : 'none';
      newPlanInput.value = '';
      activateBtn(addBtn);
      showMsg('请输入新计划内容');
    });

    // 确认添加新计划
    confirmAddBtn.addEventListener('click', function() {
      const val = newPlanInput.value.trim();
      if (val) {
        const li = document.createElement('li');
        li.className = 'plan-item';
        li.textContent = val;
        planList.appendChild(li);
        li.style.opacity = '0';
        setTimeout(() => { li.style.opacity = '1'; }, 100);
        addPlanBox.style.display = 'none';
        activateBtn(confirmAddBtn);
        showMsg('添加成功：' + val);
      }
    });

    // 全部高亮
    highlightAllBtn.addEventListener('click', function() {
      const allItems = planList.querySelectorAll('.plan-item');
      allItems.forEach(item => item.classList.add('highlight'));
      activateBtn(highlightAllBtn);
      showMsg('全部高亮完成！');
    });
  });
}

function removeFromCart(id){
  if(!cart[id]) return;
  delete cart[id]; saveCart(); updateCartUI();
}

function updateCartUI(){
  const entries = Object.values(cart);
  $cartItems.innerHTML = '';
  let total = 0; let count = 0;
  entries.forEach(item=>{
    total += item.price * item.qty; count += item.qty;
    const li = document.createElement('li'); li.className='cart-item';
    li.innerHTML = `
      <img src="${item.img}" alt="${item.title}">
      <div class="meta">
        <div class="name">${item.title}</div>
        <div class="qty">数量: ${item.qty} &nbsp; <button data-remove="${item.id}">移除</button></div>
      </div>`;
    $cartItems.appendChild(li);
  });
  $cartCount.textContent = count;
  $cartTotal.textContent = total.toFixed(2);
}

function toggleCart(show){
  if(show) $cartDrawer.classList.remove('hidden'); else $cartDrawer.classList.add('hidden');
}

document.addEventListener('click', (e)=>{
  if(e.target.matches('.btn')){
    const id = Number(e.target.dataset.id); addToCart(id);
  }
  if(e.target === $cartToggle) toggleCart(true);
  if(e.target.matches('[data-remove]')){
    const id = Number(e.target.getAttribute('data-remove')); removeFromCart(id);
  }
});

$closeCart.addEventListener('click', ()=>toggleCart(false));
$checkoutBtn.addEventListener('click', ()=>{
  if(Object.keys(cart).length===0){ alert('购物车为空'); return; }
  alert('模拟结算，付款成功'); cart = {}; saveCart(); updateCartUI(); toggleCart(false);
});

// init
renderProducts(); updateCartUI();

document.addEventListener('DOMContentLoaded', () => {
    // Initialize data
    let products = JSON.parse(localStorage.getItem('products')) || [
      { id: 1, name: 'ពោត (ធម្មជាតិ)', price: 3000, image: '../img/cornn.jpg' },
      { id: 2, name: 'ការ៉ុត (ធម្មជាតិ)', price: 3000, image: '../img/Carrot.jpg' },
      { id: 3, name: 'ស្រូវ (ធម្មជាតិ)', price: 5000, image: '../img/rice.jpg' },
      { id: 4, name: 'អង្ករ រំដួល (ធម្មជាតិ)', price: 3000, image: '../img/rice-bay.jpg' },
      { id: 5, name: 'ធូរេន (ធម្មជាតិ)', price: 3000, image: '../img/durian.jpg' },
      { id: 6, name: 'ល្ហុង (ធម្មជាតិ)', price: 3000, image: '../img/papaya.webp' },
      { id: 7, name: 'សាវម៉ៅ (ធម្មជាតិ)', price: 3000, image: '../img/saomao.jpg' },
      { id: 8, name: 'ស្ពៃ (ធម្មជាតិ)', price: 3000, image: '../img/spy.jpg' },
      { id: 9, name: 'ម្ទេសប្លោក (ធម្មជាតិ)', price: 3000, image: '../img/chilli.webp' },
      { id: 10, name: 'ល្ពៅ (ធម្មជាតិ)', price: 3000, image: '../img/Lapov.png' },
      { id: 11, name: 'ទំពាំងបាយជូរ (ធម្មជាតិ)', price: 3000, image: '../img/grape.jpg' },
      { id: 12, name: 'ប៉ោម (ធម្មជាតិ)', price: 3000, image: '../img/apple.png' },
      { id: 13, name: 'ននោង (ធម្មជាតិ)', price: 3000, image: '../img/nornong.webp' },
      { id: 14, name: 'ក្រូច (ធម្មជាតិ)', price: 3000, image: '../img/orange.jpg' },
      { id: 15, name: 'ឪឡឹក (ធម្មជាតិ)', price: 3000, image: '../img/watermelon.jpg' },
      { id: 16, name: 'ម្ឃុត (ធម្មជាតិ)', price: 3000, image: '../img/makhot.jpg' }
    ];
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let soldProducts = JSON.parse(localStorage.getItem('soldProducts')) || [];
  
    // Save data to localStorage
    function saveProducts() {
      localStorage.setItem('products', JSON.stringify(products));
    }
  
    function saveCart() {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  
    function saveSoldProducts() {
      localStorage.setItem('soldProducts', JSON.stringify(soldProducts));
    }
  
    // Create modals
    const cartModal = createCartModal();
    const historyModal = createHistoryModal();
    const successMessage = createSuccessMessage();
    document.body.appendChild(cartModal);
    document.body.appendChild(historyModal);
    document.body.appendChild(successMessage);
  
    function createCartModal() {
      const modal = document.createElement('div');
      modal.classList.add('modal', 'cart-modal');
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">×</span>
          <h2 style="font-family: 'Koulen', sans-serif;">កន្ត្រកទំនិញ</h2>
          <div class="cart-items"></div>
          <p class="cart-total" style="font-family: 'Preahvihear', serif;">សរុប: 0 ៛</p>
          <div class="cart-actions">
            <button class="btn btn-primary checkout-btn" style="background: orangered; border: none; font-family: 'Koulen', sans-serif;">បញ្ជាទិញ</button>
            <button class="btn btn-secondary close-btn" style="background: #2b3b67; border: none; font-family: 'Koulen', sans-serif;">បិទ</button>
          </div>
        </div>
      `;
      return modal;
    }
  
    function createHistoryModal() {
      const modal = document.createElement('div');
      modal.classList.add('modal', 'history-modal');
      modal.style.display = 'none';
      modal.innerHTML = `
        <div class="modal-content">
          <span class="close">×</span>
          <h2 style="font-family: 'Koulen', sans-serif;">ប្រវត្តិការលក់</h2>
          <div class="history-items"></div>
          <div class="text-center mt-3">
            <button class="btn btn-secondary close-btn" style="background: #2b3b67; border: none; font-family: 'Koulen', sans-serif;">បិទ</button>
          </div>
        </div>
      `;
      return modal;
    }
  
    function createSuccessMessage() {
      const message = document.createElement('div');
      message.classList.add('success-message');
      message.style.display = 'none';
      message.innerHTML = `
        <div class="success-content">
          <p style="font-family: 'Preahvihear', serif;"></p>
        </div>
      `;
      return message;
    }
  
    function showSuccessMessage(text) {
      successMessage.querySelector('p').textContent = text;
      successMessage.style.display = 'block';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 3000);
    }
  
    // Render history as cards with delete button
    function renderHistory() {
      const historyItemsContainer = historyModal.querySelector('.history-items');
      historyItemsContainer.innerHTML = '';
      if (soldProducts.length === 0) {
        historyItemsContainer.innerHTML = '<p style="font-family: \'Preahvihear\', serif; text-align: center;">មិនទាន់មានការលក់នៅឡើយ!</p>';
        return;
      }
      soldProducts.forEach((item, index) => {
        const card = document.createElement('div');
        card.classList.add('history-card');
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
          <div class="card mb-3" style="border-radius: 10px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
            <div class="card-body">
              <h5 class="card-title" style="font-family: 'Koulen', sans-serif;">${item.name}</h5>
              <p class="card-text" style="font-family: 'Preahvihear', serif;">ចំនួន: ${item.quantity}</p>
              <p class="card-text" style="font-family: 'Preahvihear', serif;">សរុប: ${item.price * item.quantity} ៛</p>
               <div class="delete-receipt">
              <p class="card-text" style="font-family: 'Preahvihear', serif;">កាលបរិច្ឆេទ: ${item.purchaseDate}</p>
              <button class="btn btn-danger delete-history-btn" data-index="${index}" style="background: red; border: none; font-family: 'Koulen', sans-serif; font-size: 14px; padding: 5px 10px;">លុប</button>
              </div>
            </div>
          </div>
        `;
        historyItemsContainer.appendChild(card);
      });
    }
  
    // Delete a history item
    function deleteHistoryItem(index) {
      if (confirm('តើអ្នកប្រាកដជាចង់លុបកំណត់ត្រានេះមែនទេ?')) {
        soldProducts.splice(index, 1);
        saveSoldProducts();
        renderHistory();
        showSuccessMessage('បានលុបកំណត់ត្រាជោគជ័យ!');
      }
    }
  
    // Cart management
    function addToCart(productId, quantity = 1) {
      const product = products.find(p => p.id === productId);
      if (!product) return;
      const cartItem = cart.find(item => item.id === productId);
      if (cartItem) {
        cartItem.quantity += quantity;
      } else {
        cart.push({ ...product, quantity });
      }
      saveCart();
      updateCartModal();
      showSuccessMessage('បានបន្ថែមទំនិញទៅកន្ត្រក!');
    }
  
    function updateCartModal() {
      const cartItemsContainer = cartModal.querySelector('.cart-items');
      const cartTotal = cartModal.querySelector('.cart-total');
      cartItemsContainer.innerHTML = '';
      let total = 0;
      cart.forEach((item, index) => {
        total += item.price * item.quantity;
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        itemElement.style.animationDelay = `${index * 0.1}s`;
        itemElement.innerHTML = `
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;">
          <div class="cart-item-details">
            <p style="font-family: 'Preahvihear', serif;">${item.name}</p>
            <p style="font-family: 'Preahvihear', serif;">${item.price} ៛</p>
          </div>
          <div class="cart-item-quantity">
            <button class="quantity-decrease" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="quantity-increase" data-id="${item.id}">+</button>
          </div>
          <p style="font-family: 'Preahvihear', serif;">${item.price * item.quantity} ៛</p>
          <button class="remove-cart-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
        `;
        cartItemsContainer.appendChild(itemElement);
      });
      cartTotal.textContent = `សរុប: ${total} ៛`;
    }
  
    function checkout() {
      if (cart.length === 0) {
        showSuccessMessage('កន្ត្រកទទេ! សូមបន្ថែមទំនិញ!');
        return;
      }
      const purchaseDate = new Date().toLocaleString('km-KH');
      cart.forEach(item => {
        soldProducts.push({
          ...item,
          purchaseDate
        });
      });
      cart = [];
      saveCart();
      saveSoldProducts();
      updateCartModal();
      cartModal.style.display = 'none';
      showSuccessMessage('បញ្ជាទិញជោគជ័យ!');
    }
  
    // Render products (for index.html and new-stock.html)
    function renderProducts(productList = products) {
      const productContainer = document.querySelector('.content-img');
      if (!productContainer) return;
      productContainer.innerHTML = '';
      productList.forEach(product => {
        const item = document.createElement('div');
        item.classList.add('item');
        item.innerHTML = `
          <div class="img-card">
            <img src="${product.image}" alt="${product.name}" class="detail-trigger" data-id="${product.id}">
          </div>
          <p class="product-name">${product.name}</p>
          <div class="btn-buy">
            <button class="add-to-cart" data-id="${product.id}">ទិញឥឡូវ</button>
            <p>${product.price} ៛</p>
          </div>
        `;
        productContainer.appendChild(item);
      });
    }
  
    // Event listeners
    document.addEventListener('click', (e) => {
      // Cart modal
      if (e.target.classList.contains('cart-btn')) {
        updateCartModal();
        cartModal.style.display = 'block';
      }
      // Add to cart
      if (e.target.classList.contains('add-to-cart')) {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
      }
      // Quantity increase
      if (e.target.classList.contains('quantity-increase')) {
        const id = parseInt(e.target.dataset.id);
        addToCart(id);
      }
      // Quantity decrease
      if (e.target.classList.contains('quantity-decrease')) {
        const id = parseInt(e.target.dataset.id);
        const cartItem = cart.find(item => item.id === id);
        if (cartItem && cartItem.quantity > 1) {
          cartItem.quantity--;
        } else {
          cart = cart.filter(item => item.id !== id);
        }
        saveCart();
        updateCartModal();
      }
      // Remove item
      if (e.target.classList.contains('remove-cart-item')) {
        const id = parseInt(e.target.dataset.id);
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartModal();
      }
      // Close modals
      if (e.target.classList.contains('close') || e.target.classList.contains('close-btn')) {
        cartModal.style.display = 'none';
        historyModal.style.display = 'none';
      }
      // Checkout
      if (e.target.classList.contains('checkout-btn')) {
        checkout();
      }
      // Delete history item
      if (e.target.classList.contains('delete-history-btn')) {
        const index = parseInt(e.target.dataset.index);
        deleteHistoryItem(index);
      }
    });
  
    // History button
    const historyButton = document.querySelector('.history-btn');
    if (historyButton) {
      historyButton.addEventListener('click', () => {
        renderHistory();
        historyModal.style.display = 'block';
      });
    }
  
    // Search functionality (for index.html and new-stock.html)
    const searchInput = document.querySelector('#second-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm));
        renderProducts(filteredProducts);
      });
    }
  
    // New stock page filter
    if (window.location.pathname.includes('new-stock.html')) {
      const newProducts = products.filter(p => p.id > 10);
      renderProducts(newProducts);
    }
  
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
      }
      .modal-content {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        width: 90%;
        max-width: 600px;
        max-height: 80vh;
        overflow-y: auto;
        position: relative;
        animation: zoomIn 0.3s ease;
      }
      .close {
        position: absolute;
        top: 10px;
        right: 20px;
        font-size: 24px;
        cursor: pointer;
      }
      .history-card {
        animation: slideIn 0.3s ease forwards;
      }
      .delete-history-btn {
        margin-top: 10px;
        font-size: 14px;
        padding: 5px 10px;
      }
      .success-message {
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: #fff;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 2000;
        animation: fadeIn 0.3s ease;
      }
      @keyframes zoomIn {
        from { transform: scale(0.5); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
      @keyframes slideIn {
        from { transform: translateY(20px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
     .delete-receipt{
        display:flex;
        justify-content:space-between;
        align-item :center;
     }
    `;
    document.head.appendChild(style);
  
    // Initialize cart modal on load
    updateCartModal();
  });
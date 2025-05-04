document.addEventListener('DOMContentLoaded', () => {
  // Product data
  let products = JSON.parse(localStorage.getItem('products')) || [
    { id: 1, name: 'ពោត (ធម្មជាតិ)', price: 3000, image: './img/cornn.jpg' },
    { id: 2, name: 'ការ៉ុត (ធម្មជាតិ)', price: 3000, image: './img/Carrot.jpg' },
    { id: 3, name: 'ស្រូវ (ធម្មជាតិ)', price: 5000, image: './img/rice.jpg' },
    { id: 4, name: 'អង្ករ រំដួល (ធម្មជាតិ)', price: 3000, image: './img/rice-bay.jpg' },
    { id: 5, name: 'ធូរេន (ធម្មជាតិ)', price: 3000, image: './img/durian.jpg' },
    { id: 6, name: 'ល្ហុង (ធម្មជាតិ)', price: 3000, image: './img/papaya.webp' },
    { id: 7, name: 'សាវម៉ៅ (ធម្មជាតិ)', price: 3000, image: './img/saomao.jpg' },
    { id: 8, name: 'ស្ពៃ (ធម្មជាតិ)', price: 3000, image: './img/spy.jpg' },
    { id: 9, name: 'ម្ទេសប្លោក (ធម្មជាតិ)', price: 3000, image: './img/chilli.webp' },
    { id: 10, name: 'ល្ពៅ (ធម្មជាតិ)', price: 3000, image: './img/Lapov.png' },
    { id: 11, name: 'ទំពាំងបាយជូរ (ធម្មជាតិ)', price: 3000, image: './img/grape.jpg' },
    { id: 12, name: 'ប៉ោម (ធម្មជាតិ)', price: 3000, image: './img/apple.png' },
    { id: 13, name: 'ននោង (ធម្មជាតិ)', price: 3000, image: './img/nornong =.webp' },
    { id: 14, name: 'ក្រូច (ធម្មជាតិ)', price: 3000, image: './img/orange.jpg' },
    { id: 15, name: 'ឪឡឹក (ធម្មជាតិ)', price: 3000, image: './img/watermelon.jpg' },
    { id: 16, name: 'ម្ឃុត (ធម្មជាតិ)', price: 3000, image: './img/makhot.jpg' }
  ];

  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // DOM Elements
  const productContainer = document.querySelector('.content-img');
  const cartModal = createCartModal();
  const productModal = createProductModal();
  const notification = createNotification();
  document.body.appendChild(cartModal);
  document.body.appendChild(productModal);
  document.body.appendChild(notification);

  // Render products
  function renderProducts() {
    productContainer.innerHTML = '';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('item');
      productElement.innerHTML = `
        <div class="img-card">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-name">
          <p class="item-name">${product.name}</p>
        </div>
        <div class="btn-buy">
          <button class="buy-btn" data-id="${product.id}">កុម៉្មង់ទិញ</button>
          <p>${product.price} ៛</p>
          <div class="dropdown">
            <button class="dropdown-toggle"><i class="fas fa-ellipsis-v"></i></button>
            <div class="dropdown-menu">
              <button class="edit-btn" data-id="${product.id}"><i class="fas fa-pencil-alt"></i> កែ</button>
              <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i> លុប</button>
            </div>
          </div>
        </div>
      `;
      productContainer.appendChild(productElement);
    });

    // Attach event listeners
    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent click from bubbling up
        const menu = toggle.nextElementSibling;
        const isVisible = menu.style.display === 'block';
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        menu.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
          menu.style.animation = 'slideDown 0.2s ease';
        }
      });
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id)));
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          menu.style.display = 'none';
        });
      }
    });
  }

  // Add to cart
  function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartModal();
    animateCartButton();
    showNotification(`${product.name} បានបន្ថែមដោយជោគជ័យ!`);
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Save products to localStorage
  function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
  }

  // Create notification
  function createNotification() {
    const div = document.createElement('div');
    div.classList.add('notification');
    div.style.display = 'none';
    return div;
  }

  // Show notification
  function showNotification(message) {
    notification.textContent = message;
    notification.style.display = 'block';
    notification.style.animation = 'slideInRight 0.3s ease, fadeOut 0.3s ease 1.7s forwards';
    setTimeout(() => {
      notification.style.display = 'none';
    }, 2000);
  }

  // Create cart modal
  function createCartModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'cart-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content cart-content">
        <span class="close-cart">×</span>
        <h2>កន្ត្រកទំនិញ</h2>
        <div class="cart-items"></div>
        <div class="cart-summary">
          <p class="cart-total">សរុប: 0 ៛</p>
          <button class="checkout-btn">បញ្ជាទិញ</button>
        </div>
      </div>
    `;
    modal.querySelector('.close-cart').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.querySelector('.checkout-btn').addEventListener('click', () => {
      if (cart.length > 0) {
        showReceiptModal();
      } else {
        showNotification('កន្ត្រកទទេ!');
      }
    });

    // Make cart modal draggable
    const modalContent = modal.querySelector('.cart-content');
    let isDragging = false;
    let currentX, currentY, initialX, initialY;
    modalContent.addEventListener('mousedown', (e) => {
      isDragging = true;
      initialX = e.clientX - currentX;
      initialY = e.clientY - currentY;
      modalContent.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        modalContent.style.left = `${currentX}px`;
        modalContent.style.top = `${currentY}px`;
        modalContent.style.transform = 'none';
      }
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      modalContent.style.cursor = 'grab';
    });

    return modal;
  }

  // Update cart modal
  function updateCartModal() {
    const cartItemsContainer = cartModal.querySelector('.cart-items');
    const cartTotal = cartModal.querySelector('.cart-total');
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const itemElement = document.createElement('div');
      itemElement.classList.add('cart-item');
      itemElement.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <p>${item.name}</p>
          <p>${item.price} ៛</p>
        </div>
        <div class="cart-item-quantity">
          <button class="quantity-decrease" data-id="${item.id}">-</button>
          <span>${item.quantity}</span>
          <button class="quantity-increase" data-id="${item.id}">+</button>
        </div>
        <p>${item.price * item.quantity} ៛</p>
        <button class="remove-cart-item" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      `;
      cartItemsContainer.appendChild(itemElement);
      itemElement.style.animation = 'slideIn 0.3s ease';
    });
    cartTotal.textContent = `សរុប: ${total} ៛`;
    cartItemsContainer.querySelectorAll('.quantity-increase').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), 1));
    });
    cartItemsContainer.querySelectorAll('.quantity-decrease').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(parseInt(btn.dataset.id), -1));
    });
    cartItemsContainer.querySelectorAll('.remove-cart-item').forEach(btn => {
      btn.addEventListener('click', () => {
        cart = cart.filter(item => item.id !== parseInt(btn.dataset.id));
        saveCart();
        updateCartModal();
      });
    });
  }

  // Update quantity
  function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity += change;
      if (cartItem.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
      }
      saveCart();
      updateCartModal();
    }
  }

  // Animate cart button
  function animateCartButton() {
    const cartButton = document.querySelector('.view-cart-btn');
    cartButton.classList.add('animate');
    setTimeout(() => cartButton.classList.remove('animate'), 500);
  }

  // Create product modal
  function createProductModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'product-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close-product">×</span>
        <h2>គ្រប់គ្រងផលិតផល</h2>
        <form id="product-form">
          <input type="hidden" id="product-id">
          <label>ឈ្មោះផលិតផល:</label>
          <input type="text" id="product-name" required>
          <label>តម្លៃ (៛):</label>
          <input type="number" id="product-price" required>
          <label>រូបភាព (URL):</label>
          <input type="text" id="product-image" required>
          <button type="submit">រក្សាទុក</button>
        </form>
      </div>
    `;
    modal.querySelector('.close-product').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.querySelector('#product-form').addEventListener('submit', (e) => {
      e.preventDefault();
      saveProduct();
    });
    return modal;
  }

  // Create receipt modal
  function createReceiptModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'receipt-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content receipt-content">
        <span class="close-receipt">×</span>
        <h2>បង្កាន់ដៃទិញ</h2>
        <div class="receipt-items"></div>
        <p class="receipt-total"></p>
        <div class="receipt-actions">
          <button class="okay-btn">យល់ព្រម</button>
          <button class="export-pdf-btn">នាំចេញជា PDF</button>
        </div>
      </div>
    `;
    return modal;
  }

  // Show receipt modal
  function showReceiptModal() {
    let receiptModal = document.querySelector('.receipt-modal');
    if (!receiptModal) {
      receiptModal = createReceiptModal();
      document.body.appendChild(receiptModal);
    }
    const receiptItems = receiptModal.querySelector('.receipt-items');
    const receiptTotal = receiptModal.querySelector('.receipt-total');
    receiptItems.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
      total += item.price * item.quantity;
      const itemElement = document.createElement('div');
      itemElement.classList.add('receipt-item');
      itemElement.innerHTML = `
        <p>${item.name}</p>
        <p>${item.quantity} x ${item.price} ៛ = ${item.price * item.quantity} ៛</p>
      `;
      receiptItems.appendChild(itemElement);
    });
    receiptTotal.textContent = `សរុប: ${total} ៛`;
    receiptModal.style.display = 'block';
    receiptModal.querySelector('.receipt-content').style.animation = 'fadeIn 0.3s ease';

    receiptModal.querySelector('.close-receipt').addEventListener('click', () => {
      receiptModal.style.display = 'none';
    });
    receiptModal.querySelector('.okay-btn').addEventListener('click', () => {
      receiptModal.style.display = 'none';
      cart = [];
      saveCart();
      updateCartModal();
      cartModal.style.display = 'none';
      showNotification('ការបញ្ជាទិញបានជោគជ័យ!');
    });
    receiptModal.querySelector('.export-pdf-btn').addEventListener('click', () => {
      exportReceiptAsPDF();
      receiptModal.style.display = 'none';
      cart = [];
      saveCart();
      updateCartModal();
      cartModal.style.display = 'none';
      showNotification('ការបញ្ជាទិញបានជោគជ័យ និង PDF បាននាំចេញ!');
    });
  }

  // Export receipt as PDF
  function exportReceiptAsPDF() {
    const latexContent = `
\\documentclass[a4paper,12pt]{article}
\\usepackage[utf8]{inputenc}
\\usepackage[khmer]{babel}
\\usepackage{geometry}
\\geometry{margin=1in}
\\usepackage{booktabs}
\\usepackage{noto}
\\setlength{\\parindent}{0pt}
\\begin{document}
\\begin{center}
  \\textbf{\\Large បង្កាន់ដៃទិញ - ផ្សារកសិករ}\\\\
  \\vspace{0.5cm}
  \\today
\\end{center}
\\vspace{1cm}
\\begin{tabular}{l r r r}
  \\toprule
  \\textbf{ឈ្មោះផលិតផល} & \\textbf{ចំនួន} & \\textbf{តម្លៃ (៛)} & \\textbf{សរុប (៛)} \\\\
  \\midrule
${cart.map(item => `${item.name.replace(/%/g, '\\%')} & ${item.quantity} & ${item.price} & ${item.price * item.quantity} \\\\`).join('')}
  \\bottomrule
\\end{tabular}
\\vspace{1cm}
\\textbf{សរុប: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)} ៛}
\\end{document}
    `;
    const blob = new Blob([latexContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'receipt.tex';
    a.click();
    URL.revokeObjectURL(url);
  }

  // Open product modal for add/edit
  function openProductModal(productId = null) {
    productModal.style.display = 'block';
    productModal.querySelector('.modal-content').style.animation = 'fadeIn 0.3s ease';
    const form = productModal.querySelector('#product-form');
    if (productId) {
      const product = products.find(p => p.id === productId);
      form.querySelector('#product-id').value = product.id;
      form.querySelector('#product-name').value = product.name;
      form.querySelector('#product-price').value = product.price;
      form.querySelector('#product-image').value = product.image;
    } else {
      form.reset();
      form.querySelector('#product-id').value = '';
    }
  }

  // Save product (add or edit)
  function saveProduct() {
    const id = parseInt(productModal.querySelector('#product-id').value) || null;
    const name = productModal.querySelector('#product-name').value;
    const price = parseInt(productModal.querySelector('#product-price').value);
    const image = productModal.querySelector('#product-image').value;

    if (id) {
      const productIndex = products.findIndex(p => p.id === id);
      products[productIndex] = { id, name, price, image };
    } else {
      const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
      products.push({ id: newId, name, price, image });
    }

    saveProducts();
    renderProducts();
    productModal.style.display = 'none';
  }

  // Delete product
  function deleteProduct(productId) {
    if (confirm('តើអ្នកប្រាកដជាចង់លុបផលិតផលនេះមែនទេ?')) {
      products = products.filter(p => p.id !== productId);
      cart = cart.filter(item => item.id !== productId);
      saveProducts();
      saveCart();
      renderProducts();
      updateCartModal();
    }
  }

  // Add product button in navbar
  const enrollLink = document.querySelector('#enroll');
  enrollLink.addEventListener('click', (e) => {
    e.preventDefault();
    openProductModal();
  });

  // View cart button
  const cartButton = document.createElement('button');
  cartButton.classList.add('view-cart-btn');
  cartButton.innerHTML = '<i class="fas fa-shopping-cart"></i> មើលកន្ត្រក';
  cartButton.style.margin = '10px';
  cartButton.style.padding = '10px 20px';
  cartButton.style.background = 'orangered';
  cartButton.style.color = '#fff';
  cartButton.style.border = 'none';
  cartButton.style.borderRadius = '5px';
  cartButton.style.cursor = 'pointer';
  cartButton.style.fontFamily = '"Koulen", sans-serif';
  document.querySelector('.second-main').appendChild(cartButton);
  cartButton.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'block';
    cartModal.querySelector('.cart-content').style.animation = 'slideInRight 0.3s ease';
  });

  // Search functionality
  document.querySelector('#second-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    productContainer.innerHTML = '';
    filteredProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('item');
      productElement.innerHTML = `
        <div class="img-card">
          <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="product-name">
          <p class="item-name">${product.name}</p>
        </div>
        <div class="btn-buy">
          <button class="buy-btn" data-id="${product.id}">កុម៉្មង់ទិញ</button>
          <p>${product.price} ៛</p>
          <div class="dropdown">
            <button class="dropdown-toggle"><i class="fas fa-ellipsis-v"></i></button>
            <div class="dropdown-menu">
              <button class="edit-btn" data-id="${product.id}"><i class="fas fa-pencil-alt"></i> កែ</button>
              <button class="delete-btn" data-id="${product.id}"><i class="fas fa-trash"></i> លុប</button>
            </div>
          </div>
        </div>
      `;
      productContainer.appendChild(productElement);
    });

    document.querySelectorAll('.buy-btn').forEach(btn => {
      btn.addEventListener('click', () => addToCart(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const menu = toggle.nextElementSibling;
        const isVisible = menu.style.display === 'block';
        document.querySelectorAll('.dropdown-menu').forEach(m => m.style.display = 'none');
        menu.style.display = isVisible ? 'none' : 'block';
        if (!isVisible) {
          menu.style.animation = 'slideDown 0.2s ease';
        }
      });
    });
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openProductModal(parseInt(btn.dataset.id)));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => deleteProduct(parseInt(btn.dataset.id)));
    });
  });

  // Modal and other styles
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    .cart-modal {
      display: flex;
      justify-content: flex-end;
      align-items: flex-start;
      padding: 20px;
    }
    .cart-content {
      background: #fff;
      padding: 30px;
      border-radius: 15px;
      max-width: 600px;
      width: 100%;
      position: relative;
      box-shadow: 0 10px 20px rgba(0,0,0,0.2);
      cursor: grab;
    }
    .cart-content:active {
      cursor: grabbing;
    }
    .close-cart, .close-product, .close-receipt {
      position: absolute;
      top: 15px;
      right: 20px;
      font-size: 28px;
      cursor: pointer;
      color: #333;
    }
    .cart-items {
      max-height: 500px;
      overflow-y: auto;
      margin-bottom: 20px;
    }
    .cart-item {
      display: grid;
      grid-template-columns: 60px 1fr 120px 80px 40px;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-bottom: 1px solid #eee;
      transition: background 0.2s;
    }
    .cart-item:hover {
      background: #f9f9f9;
    }
    .cart-item img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 5px;
    }
    .cart-item-details p {
      margin: 0;
      font-family: "Preahvihear", serif;
    }
    .cart-item-quantity {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .cart-item-quantity button {
      background: #007bff;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
    }
    .cart-item-quantity button:hover {
      background: #0056b3;
    }
    .remove-cart-item {
      background: none;
      border: none;
      color: red;
      font-size: 18px;
      cursor: pointer;
    }
    .cart-summary {
      text-align: right;
    }
    .cart-total {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      font-family: "Koulen", sans-serif;
    }
    .checkout-btn {
      background: orangered;
      color: #fff;
      border: none;
      padding: 12px 20px;
      border-radius: 5px;
      cursor: pointer;
      width: 100%;
      font-size: 18px;
      font-family: "Koulen", sans-serif;
      transition: background 0.3s, transform 0.2s;
    }
    .checkout-btn:hover {
      background: #e44d26;
      transform: scale(1.05);
    }
    .modal-content {
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      max-width: 500px;
      width: 90%;
      position: relative;
      margin: auto;
    }
    .receipt-content {
      max-width: 600px;
      width: 90%;
    }
    .receipt-items {
      margin-bottom: 20px;
    }
    .receipt-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #eee;
      font-family: "Preahvihear", serif;
    }
    .receipt-total {
      font-size: 20px;
      font-weight: bold;
      text-align: right;
      font-family: "Koulen", sans-serif;
    }
    .receipt-actions {
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }
    .okay-btn, .export-pdf-btn {
      background: #28a745;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-family: "Koulen", sans-serif;
      transition: background 0.3s, transform 0.2s;
    }
    .okay-btn:hover, .export-pdf-btn:hover {
      background: #218838;
      transform: scale(1.05);
    }
    #product-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    #product-form label {
      font-family: "Koulen", sans-serif;
    }
    #product-form input {
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 5px;
    }
    #product-form button {
      background: orangered;
      color: #fff;
      border: none;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
    }
    .dropdown {
      position: absolute;
      bottom: 5px;
      right: 5px;
      z-index: 10;
    }
    .dropdown-toggle {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      color: #333;
      padding: 5px;
      line-height: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .dropdown-toggle i {
      margin: 0;
    }
    .dropdown-toggle:hover {
      color: #007bff;
    }
    .dropdown-menu {
      display: none;
      position: absolute;
      right: 0;
      top: 100%;
      background: #fff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
      border-radius: 5px;
      min-width: 120px;
      z-index: 100;
    }
    .dropdown-menu button {
      display: flex;
      align-items: center;
      gap: 10px;
      background: none;
      border: none;
      padding: 10px;
      width: 100%;
      text-align: left;
      cursor: pointer;
      font-family: "Preahvihear", serif;
      color: #333;
    }
    .dropdown-menu button:hover {
      background: #f0f0f0;
    }
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 2000;
      font-family: "Koulen", sans-serif;
    }
    .view-cart-btn.animate {
      animation: bounce 0.5s;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes slideDown {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeOut {
      to { opacity: 0; }
    }
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    @media (max-width: 768px) {
      .cart-content {
        padding: 20px;
        max-width: 95%;
      }
      .cart-item {
        grid-template-columns: 50px 1fr 100px 60px 30px;
        gap: 5px;
      }
      .cart-item img {
        width: 40px;
        height: 40px;
      }
      .cart-item-details p {
        font-size: 14px;
      }
      .cart-item-quantity button {
        padding: 3px 8px;
        font-size: 14px;
      }
      .cart-total {
        font-size: 18px;
      }
      .checkout-btn {
        font-size: 16px;
        padding: 10px;
      }
      .notification {
        top: 10px;
        right: 10px;
        padding: 8px 15px;
        font-size: 14px;
      }
      .dropdown-toggle {
        font-size: 20px;
        padding: 3px;
      }
    }
    @media (max-width: 428px) {
      .cart-item {
        grid-template-columns: 40px 1fr 80px 50px 25px;
      }
      .cart-item img {
        width: 30px;
        height: 30px;
      }
      .cart-item-details p {
        font-size: 12px;
      }
      .cart-item-quantity span {
        font-size: 12px;
      }
      .receipt-content {
        padding: 15px;
      }
      .receipt-actions {
        flex-direction: column;
        gap: 5px;
      }
      .okay-btn, .export-pdf-btn {
        padding: 8px;
        font-size: 14px;
      }
      .dropdown-toggle {
        font-size: 18px;
        padding: 2px;
      }
    }
  `;
  document.head.appendChild(style);

  // Initial render
  renderProducts();
  updateCartModal();
});

// Function to toggle the menu visibility on mobile
function toggleMenu() {
  const menu = document.querySelector('.menu');
  menu.classList.toggle('show'); // Toggle the 'show' class to display or hide the menu
}

// GSAP animations
gsap.from('.footer-logo', {
  opacity: 0,
  y: -50,
  duration: 1,
  delay: 0.5
});

gsap.from('.footer-links', {
  opacity: 0,
  x: -50,
  duration: 1,
  delay: 0.7
});

gsap.from('.footer-social', {
  opacity: 0,
  x: 50,
  duration: 1,
  delay: 0.9
});

gsap.from('.footer-bottom', {
  opacity: 0,
  y: 50,
  duration: 1,
  delay: 1.1
});

// Back to Top Button visibility on scroll
const backToTop = document.getElementById("back-to-top");

window.onscroll = function () {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
    backToTop.style.display = "block";
  } else {
    backToTop.style.display = "none";
  }
};

backToTop.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
document.addEventListener('DOMContentLoaded', () => {
  // Product data with Khmer names and images
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
  const detailModal = createDetailModal();
  const successMessage = createSuccessMessage();
  document.body.appendChild(cartModal);
  document.body.appendChild(productModal);
  document.body.appendChild(detailModal);
  document.body.appendChild(successMessage);

  // Render products
  function renderProducts(filteredProducts = products) {
    productContainer.innerHTML = '';
    filteredProducts.forEach(product => {
      const productElement = document.createElement('div');
      productElement.classList.add('item');
      productElement.innerHTML = `
        <div class="img-card">
          <img src="${product.image}" alt="${product.name}" class="detail-trigger" data-id="${product.id}">
        </div>
        <div class="product-name">
          <p class="item-name">${product.name}</p>
        </div>
        <div class="btn-buy">
          <button class="buy-btn" data-id="${product.id}">កុម៉្មង់ទិញ</button>
          <p>${product.price} ៛</p>
        </div>
      `;
      productContainer.appendChild(productElement);
    });

    // Event delegation for product actions
    productContainer.addEventListener('click', (e) => {
      const target = e.target;
      const id = parseInt(target.dataset.id);
      if (target.classList.contains('buy-btn')) {
        addToCart(id);
      } else if (target.classList.contains('detail-trigger')) {
        openDetailModal(id);
      }
    });
  }

  // Add to cart with success message
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
    updateCartBadge();
    animateCartButton();
    showSuccessMessage(`${product.name} បានបន្ថែមទៅកន្ត្រក!`);
  }

  // Show animated success message
  function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.opacity = '1';
    successMessage.style.transform = 'translateY(0)';
    setTimeout(() => {
      successMessage.style.opacity = '0';
      successMessage.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        successMessage.style.display = 'none';
      }, 300);
    }, 2000);
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  // Save products to localStorage
  function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
  }

  // Create cart modal with animation
  function createCartModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'cart-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content cart-content">
        <span class="close-cart">×</span>
        <h2>កន្ត្រកទិញ</h2>
        <div class="cart-items"></div>
        <div class="cart-summary">
          <p class="cart-total">សរុប: 0 ៛</p>
          <button class="checkout-btn">បញ្ជាទិញ</button>
          <div class="checkout-actions" style="display: none; margin-top: 10px;">
            <button class="ok-btn">OK</button>
          </div>
        </div>
      </div>
    `;

    // Add event listeners for modal actions
    modal.querySelector('.close-cart').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.querySelector('.checkout-btn').addEventListener('click', () => {
      if (cart.length > 0) {
        showSuccessMessage('ការបញ្ជាទិញបានជោគជ័យ!');
        modal.querySelector('.checkout-btn').style.display = 'none';
        modal.querySelector('.checkout-actions').style.display = 'flex';
      } else {
        showSuccessMessage('កន្ត្រកទទេ!');
      }
    });
    modal.querySelector('.ok-btn').addEventListener('click', () => {
      cart = [];
      saveCart();
      updateCartModal();
      updateCartBadge();
      modal.style.display = 'none';
      modal.querySelector('.checkout-btn').style.display = 'block';
      modal.querySelector('.checkout-actions').style.display = 'none';
    });

    // Add event listener for cart actions only once
    const cartItemsContainer = modal.querySelector('.cart-items');
    cartItemsContainer.addEventListener('click', (e) => {
      const target = e.target;
      const id = parseInt(target.dataset.id);
      if (target.classList.contains('quantity-increase')) {
        updateQuantity(id, 1);
      } else if (target.classList.contains('quantity-decrease')) {
        updateQuantity(id, -1);
      } else if (target.classList.contains('remove-cart-item')) {
        cart = cart.filter(item => item.id !== id);
        saveCart();
        updateCartModal();
        updateCartBadge();
      }
    });

    return modal;
  }

  // Update cart modal with animations
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
        <button class="remove-cart-item" data-id="${item.id}"><i class="fas fa-times"></i></button>
      `;
      cartItemsContainer.appendChild(itemElement);
    });
    cartTotal.textContent = `សរុប: ${total} ៛`;
  }

  // Update cart item quantity
  function updateQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
      cartItem.quantity += change;
      if (cartItem.quantity < 1) {
        cartItem.quantity = 1;
      }
      saveCart();
      updateCartModal();
      updateCartBadge();
    }
  }

  // Update cart badge count
  function updateCartBadge() {
    const cartButton = document.querySelector('.view-cart-btn');
    const badge = cartButton.querySelector('.cart-badge') || document.createElement('span');
    badge.classList.add('cart-badge');
    const totalItems = cart.length > 0 ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;
    badge.textContent = totalItems;
    if (!cartButton.contains(badge)) {
      cartButton.appendChild(badge);
    }
    badge.style.display = totalItems > 0 ? 'inline-block' : 'none';
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
      <div class="modal-content sale">
        <span class="close-product">×</span>
        <h2>គ្រប់គ្រងផលិតផល</h2>
        <form id="product-form">
          <input type="hidden" id="product-id">
          <label>ឈ្មោះផលិតផល:</label>
          <input type="text" id="product-name" required>
          <label>តម្លៃ (៛):</label>
          <input type="number" id="product-price" required>
          <label>រូបភាព:</label>
          <input type="file" id="product-image" accept="image/*" required>
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

  // Create detail modal
  function createDetailModal() {
    const modal = document.createElement('div');
    modal.classList.add('modal', 'detail-modal');
    modal.style.display = 'none';
    modal.innerHTML = `
      <div class="modal-content detail-content">
        <span class="close-detail">×</span>
        <div class="detail-header">
          <h2>ព័ត៌មានលម្អិតផលិតផល</h2>
        </div>
        <div class="detail-view">
          <div class="detail-image-wrapper">
            <img id="detail-image" src="" alt="">
          </div>
          <div class="detail-info">
            <p id="detail-name" class="detail-name"></p>
            <p id="detail-price" class="detail-price"></p>
            <div class="quantity-input">
              <label>បរិមាណ:</label>
              <input type="number" id="detail-quantity" min="1" value="1">
            </div>
            <button class="buy-now-btn">ទិញឥឡូវ</button>
            <div class="detail-actions">
              <button class="edit-detail-btn" data-id=""><i class="fas fa-pencil-alt"></i> កែ</button>
              <button class="delete-detail-btn" data-id=""><i class="fas fa-trash"></i> លុប</button>
            </div>
          </div>
        </div>
      </div>
    `;
    modal.querySelector('.close-detail').addEventListener('click', () => {
      modal.style.display = 'none';
    });
    modal.querySelector('.buy-now-btn').addEventListener('click', () => {
      const id = parseInt(modal.dataset.id);
      const quantity = parseInt(modal.querySelector('#detail-quantity').value) || 1;
      addToCart(id, quantity);
      modal.style.display = 'none';
    });
    modal.querySelector('.edit-detail-btn').addEventListener('click', () => {
      const id = parseInt(modal.dataset.id);
      openProductModal(id);
      modal.style.display = 'none';
    });
    modal.querySelector('.delete-detail-btn').addEventListener('click', () => {
      const id = parseInt(modal.dataset.id);
      deleteProduct(id);
      modal.style.display = 'none';
    });
    return modal;
  }

  // Open detail modal
  function openDetailModal(productId) {
    const product = products.find(p => p.id === productId);
    detailModal.dataset.id = productId;
    detailModal.querySelector('#detail-image').src = product.image;
    detailModal.querySelector('#detail-name').textContent = product.name;
    detailModal.querySelector('#detail-price').textContent = `${product.price} ៛`;
    detailModal.querySelector('#detail-quantity').value = 1;
    detailModal.querySelector('.edit-detail-btn').dataset.id = productId;
    detailModal.querySelector('.delete-detail-btn').dataset.id = productId;
    detailModal.style.display = 'block';
    detailModal.classList.add('modal-animate');
  }

  // Open product modal for add/edit
  function openProductModal(productId = null) {
    productModal.style.display = 'block';
    const form = productModal.querySelector('#product-form');
    if (productId) {
      const product = products.find(p => p.id === productId);
      form.querySelector('#product-id').value = product.id;
      form.querySelector('#product-name').value = product.name;
      form.querySelector('#product-price').value = product.price;
      form.querySelector('#product-image').value = ''; // Clear file input
      // Display existing image preview
      let preview = form.querySelector('img');
      if (!preview) {
        preview = document.createElement('img');
        preview.style.maxWidth = '100px';
        preview.style.marginTop = '10px';
        form.appendChild(preview);
      }
      preview.src = product.image;
    } else {
      form.reset();
      form.querySelector('#product-id').value = '';
      // Remove any existing image preview
      const existingPreview = form.querySelector('img');
      if (existingPreview) existingPreview.remove();
    }
  }

  // Save product (add or edit)
  function saveProduct() {
    const id = parseInt(productModal.querySelector('#product-id').value) || null;
    const name = productModal.querySelector('#product-name').value;
    const price = parseInt(productModal.querySelector('#product-price').value);
    const fileInput = productModal.querySelector('#product-image');
    const file = fileInput.files[0];

    // Function to save the product with the image URL
    const saveWithImage = (imageUrl) => {
      if (id) {
        const productIndex = products.findIndex(p => p.id === id);
        products[productIndex] = { id, name, price, image: imageUrl };
        const cartItem = cart.find(item => item.id === id);
        if (cartItem) {
          cartItem.name = name;
          cartItem.price = price;
          cartItem.image = imageUrl;
        }
      } else {
        const newId = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, image: imageUrl });
      }

      saveProducts();
      saveCart();
      renderProducts();
      updateCartModal();
      productModal.style.display = 'none';
      showSuccessMessage(`${name} បានរក្សាទុកជោគជ័យ!`);
    };

    if (file) {
      // Convert the selected file to a data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target.result;
        saveWithImage(imageUrl);
      };
      reader.readAsDataURL(file);
    } else if (id) {
      // If editing and no new file is selected, keep the existing image
      const product = products.find(p => p.id === id);
      saveWithImage(product.image);
    } else {
      // If adding a new product without an image, show an error
      showSuccessMessage('សូមជ្រើសរើសរូបភាពផលិតផល!');
      return;
    }
  }

  // Delete product
  function deleteProduct(productId) {
    if (confirm('តើអ្នកប្រាកដជាចង់លុបផលិតផលនេះមែនទេ?')) {
      const product = products.find(p => p.id === productId);
      products = products.filter(p => p.id !== productId);
      cart = cart.filter(item => item.id !== productId);
      saveProducts();
      saveCart();
      renderProducts();
      updateCartModal();
      updateCartBadge();
      showSuccessMessage(`${product.name} បានលុបជោគជ័យ!`);
    }
  }

  // Create success message element
  function createSuccessMessage() {
    const message = document.createElement('div');
    message.classList.add('success-message');
    message.style.display = 'none';
    return message;
  }

  // Add product button in navbar
  const enrollLink = document.querySelector('#enroll');
  enrollLink.addEventListener('click', (e) => {
    e.preventDefault();
    openProductModal();
  });

  // View cart button with badge
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
  cartButton.style.position = 'relative';
  document.querySelector('.second-main').appendChild(cartButton);
  cartButton.addEventListener('click', () => {
    updateCartModal();
    cartModal.style.display = 'flex';
    cartModal.classList.add('modal-animate');
    setTimeout(() => cartModal.classList.remove('modal-animate'), 300);
  });

  // Search functionality
  document.querySelector('#second-search').addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm));
    renderProducts(filteredProducts);
  });

  // Modal and dropdown styles
  const style = document.createElement('style');
  style.textContent = `
    .modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    }
    .modal-animate .modal-content {
      animation: zoomIn 0.4s ease;
    }
    .cart-content, .detail-content {
      background: linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%);
      padding: 30px;
      max-width: 600px;
      width: 90%;
      position: relative;
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
      border-radius: 15px;
      border: 1px solid #e0e0e0;
    }
    .close-cart, .close-product, .close-detail {
      position: absolute;
      top: 15px;
      right: 20px;
      font-size: 28px;
      cursor: pointer;
      color: #555;
      transition: color 0.3s;
    }
    .close-cart:hover, .close-product:hover, .close-detail:hover {
      color: #000;
    }
    .cart-items {
      max-height: 400px;
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
      animation: slideIn 0.3s ease forwards;
      transition: background 0.2s;
    }
    .cart-item:hover {
      background: #f5f5f5;
    }
    .cart-item img {
      width: 50px;
      height: 50px;
      object-fit: cover;
      border-radius: 8px;
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
      padding: 4px 10px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.2s;
    }
    .cart-item-quantity button:hover {
      background: #0056b3;
    }
    .remove-cart-item {
      background: none;
      color: #666;
      border: none;
      padding: 0;
      cursor: pointer;
      font-size: 16px;
      transition: color 0.2s;
    }
    .remove-cart-item:hover {
      color: #333;
    }
    .cart-summary {
      text-align: right;
    }
    .cart-total {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 10px;
      font-family: "Koulen", sans-serif;
      color: #333;
    }
    .checkout-btn, .ok-btn, .pdf-btn, .buy-now-btn, .edit-detail-btn, .delete-detail-btn {
      border: none;
      padding: 8px 20px;
      border-radius: 25px;
      cursor: pointer;
      font-size: 16px;
      font-family: "Koulen", sans-serif;
      transition: transform 0.2s, box-shadow 0.3s;
    }
    .checkout-btn, .buy-now-btn {
      background: linear-gradient(90deg, #ff6f61, #ff8a65);
      color: #fff;
    }
    .buy-now-btn{
        width: 170px;
    }
    .ok-btn {
      background: linear-gradient(90deg, #1e90ff, #00b7eb);
      color: #fff;
    }
    .pdf-btn {
      background: linear-gradient(90deg, #28a745, #34c759);
      color: #fff;
    }
    .checkout-btn:hover, .ok-btn:hover, .pdf-btn:hover, .buy-now-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .edit-detail-btn {
      background:none;
      color: #000;
    }
    .delete-detail-btn {
      color:#ff4d4d;
      background:none;
      
    }
    .edit-detail-btn:hover, .delete-detail-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    }
    .checkout-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .modal-content {
      background: #fff;
      padding: 20px;
      max-width: 630px;
      width: 90%;
      position: relative;
      border-radius: 10px;
    }
    .sale{
      border-radius:0;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
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
    .detail-header {
      text-align: center;
      margin-bottom: 20px;
    }
    .detail-header h2 {
      font-family: "Koulen", sans-serif;
      color: #ff6f61;
      margin: 0;
      font-size: 24px;
      position: relative;
      display: inline-block;
    }
    .detail-header h2::after {
      content: '';
      width: 50%;
      height: 3px;
      background: linear-gradient(90deg, #ff6f61, #ff8a65);
      position: absolute;
      bottom: -5px;
      left: 25%;
      border-radius: 2px;
    }
      h2{
        font-family: "Koulen", sans-serif;
        text-align: center;
      }
    .detail-content{
      border-radius:0;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .detail-view {
      display: flex;
      gap: 55px;
      align-items: center;
      background: #fff;
      padding: 20px;
      justify-content:center;
      align-item:center;
    }
    .detail-image-wrapper {
      position: relative;
      overflow: hidden;
      border-radius: 15px;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      transition: transform 0.3s;
    }
    .detail-image-wrapper:hover {
      transform: scale(1.05);
    }
    .detail-image-wrapper::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.2));
      opacity: 0;
      transition: opacity 0.3s;
    }
    .detail-image-wrapper:hover::before {
      opacity: 1;
    }
    .detail-view img {
      width: 230px;
      height: 230px;
      object-fit: cover;
      border-radius: 15px;
      transition: transform 0.3s;
    }
    .detail-info {
      flex: 1;
      animation: fadeInRight 0.5s ease;
    }
    .detail-name {
      font-family: "Koulen", sans-serif;
      font-size: 22px;
      color: #333;
      margin: 0 0 10px;
      border-left: 4px solid #ff6f61;
      padding-left: 10px;
    }
    .detail-price {
      font-family: "Preahvihear", serif;
      font-size: 18px;
      color: #e44d26;
      margin: 0 0 15px;
      font-weight: bold;
    }
    .quantity-input {
      margin: 15px 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .quantity-input label {
      font-family: "Koulen", sans-serif;
      font-size: 16px;
      color: #555;
    }
    .quantity-input input {
      padding: 8px;
      width: 70px;
      border: 1px solid #ddd;
      border-radius: 25px;
      font-family: "Preahvihear", serif;
      font-size: 16px;
      text-align: center;
      transition: border-color 0.3s;
    }
    .quantity-input input:focus {
      border-color: #ff6f61;
      outline: none;
    }
    .detail-actions {
      margin-top: 15px;
      display: flex;
      justify-content:end;
      align-item:center;
    }
    .view-cart-btn {
      position: relative;
    }
    .cart-badge {
      position: absolute;
      top: -10px;
      right: -10px;
      background: 	#4CBB17 ;
      color: #fff;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-family: "Koulen", sans-serif;
    }
    .view-cart-btn.animate {
      animation: bounce 0.5s;
    }
    .success-message {
      position: fixed;
      top: 20px;
      right: 20px;
      background: #28a745;
      color: #fff;
      padding: 10px 20px;
      border-radius: 5px;
      font-family: "Koulen", sans-serif;
      z-index: 1001;
      transition: opacity 0.3s, transform 0.3s;
    }
    @keyframes zoomIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes fadeInRight {
      from { opacity: 0; transform: translateX(20px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }
    @media (max-width: 768px) {
      .cart-content, .detail-content {
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
      .checkout-btn, .ok-btn, .pdf-btn, .buy-now-btn, .edit-detail-btn, .delete-detail-btn {
        font-size: 14px;
        padding: 6px 15px;
      }
      .success-message {
        top: 10px;
        right: 10px;
        padding: 8px 15px;
        font-size: 14px;
      }
      .detail-view {
        flex-direction: column;
        align-items: center;
        padding: 15px;
      }
      .detail-view img {
        width: 120px;
        height: 120px;
      }
      .detail-image-wrapper {
        width: 120px;
        height: 120px;
      }
      .detail-name {
        font-size: 18px;
      }
      .detail-price {
        font-size: 16px;
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
      .detail-header h2 {
        font-size: 20px;
      }
    }
  `;
  document.head.appendChild(style);

  // Initial render
  renderProducts();
  updateCartModal();
  updateCartBadge();

  // Toggle menu for mobile
  window.toggleMenu = function() {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('show');
  };

  // GSAP animations for footer
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

  // Back to top button
  const backToTop = document.getElementById("back-to-top");
  window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      backToTop.style.display = "block";
    } else {
      backToTop.style.display = "none";
    }
  };
  backToTop.addEventListener("click", function() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // Generate PDF (LaTeX content is in a separate artifact)
  function generatePDF() {
    console.log('Generating PDF with cart contents:', cart);
    // LaTeX PDF generation is handled in the separate artifact
  }
});
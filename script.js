const API_URL = "http://127.0.0.1:5000";

// Datos del carrito
let cart = [];
let currentStudent = "";
let menuItems = [];

// Imágenes de productos (simuladas)
const productImages = {
  "Papas Fritas": "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Empanada": "https://images.unsplash.com/photo-1604467715878-83e57e8bc129?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Rabito": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Jugo Natural": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Sandwich": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Galleta": "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Agua": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
  "Chocolate": "https://images.unsplash.com/photo-1511381939415-e44015466834?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
};

// Categorías de productos (simuladas)
const productCategories = {
  "Papas Fritas": "snacks",
  "Empanada": "comidas",
  "Rabito": "postres",
  "Jugo Natural": "bebidas",
  "Sandwich": "comidas",
  "Galleta": "snacks",
  "Agua": "bebidas",
  "Chocolate": "snacks"
};

// Cargar menú con imágenes y categorías
async function loadMenu() {
  try {
    const res = await fetch(`${API_URL}/menu`);
    menuItems = await res.json();
    
    // Añadir imágenes y categorías a los productos
    menuItems = menuItems.map(item => {
      return {
        ...item,
        image: item.image || productImages[item.name] || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        category: productCategories[item.name] || "otros"
      };
    });
    
    displayProducts(menuItems);
  } catch (error) {
    console.error("Error al cargar el menú:", error);
    // Datos de ejemplo en caso de error
    menuItems = [
      { id: 1, name: "Papas Fritas", price: 2.50, image: productImages["Papas Fritas"], category: "snacks" },
      { id: 2, name: "Empanada", price: 3.00, image: productImages["Empanada"], category: "comidas" },
      { id: 3, name: "Rabito", price: 1.50, image: productImages["Rabito"], category: "postres" },
      { id: 4, name: "Jugo Natural", price: 2.00, image: productImages["Jugo Natural"], category: "bebidas" },
      { id: 5, name: "Sandwich", price: 3.50, image: productImages["Sandwich"], category: "comidas" },
      { id: 6, name: "Galleta", price: 1.00, image: productImages["Galleta"], category: "snacks" },
      { id: 7, name: "Agua", price: 1.50, image: productImages["Agua"], category: "bebidas" },
      { id: 8, name: "Chocolate", price: 2.00, image: productImages["Chocolate"], category: "snacks" }
    ];
    displayProducts(menuItems);
  }
}

// Mostrar productos en la grilla
function displayProducts(products) {
  const productsGrid = document.getElementById("products-grid");
  productsGrid.innerHTML = "";
  
  products.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.dataset.category = product.category;
    
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <div class="product-price">$${product.price.toFixed(2)}</div>
        <div class="product-category">${product.category}</div>
        <div class="product-actions">
          <div class="quantity-control">
            <button class="decrease">-</button>
            <span class="quantity">1</span>
            <button class="increase">+</button>
          </div>
          <button class="add-to-cart" data-id="${product.id}" data-name="${product.name}" data-price="${product.price}">
            <i class="fas fa-cart-plus"></i> Añadir
          </button>
        </div>
      </div>
    `;
    
    productsGrid.appendChild(productCard);
    
    // Eventos para controles de cantidad
    const quantitySpan = productCard.querySelector(".quantity");
    const decreaseBtn = productCard.querySelector(".decrease");
    const increaseBtn = productCard.querySelector(".increase");
    const addToCartBtn = productCard.querySelector(".add-to-cart");
    
    decreaseBtn.addEventListener("click", () => {
      let quantity = parseInt(quantitySpan.textContent);
      if (quantity > 1) {
        quantitySpan.textContent = quantity - 1;
      }
    });
    
    increaseBtn.addEventListener("click", () => {
      let quantity = parseInt(quantitySpan.textContent);
      quantitySpan.textContent = quantity + 1;
    });
    
    addToCartBtn.addEventListener("click", () => {
      const quantity = parseInt(quantitySpan.textContent);
      addToCart(product, quantity);
    });
  });
}

// Filtrar productos por categoría
document.addEventListener("DOMContentLoaded", () => {
  const categoryItems = document.querySelectorAll("#category-list li");
  
  categoryItems.forEach(item => {
    item.addEventListener("click", () => {
      // Actualizar clase activa
      categoryItems.forEach(cat => cat.classList.remove("active"));
      item.classList.add("active");
      
      const category = item.dataset.category;
      
      // Filtrar productos
      if (category === "all") {
        displayProducts(menuItems);
      } else {
        const filteredProducts = menuItems.filter(product => product.category === category);
        displayProducts(filteredProducts);
      }
    });
  });
  
  // Ordenar productos
  const sortSelect = document.getElementById("sort-options");
  sortSelect.addEventListener("change", () => {
    const sortValue = sortSelect.value;
    let sortedProducts = [...menuItems];
    
    switch (sortValue) {
      case "price-asc":
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // No ordenar
        break;
    }
    
    displayProducts(sortedProducts);
  });
  
  // Buscar productos
  const searchInput = document.getElementById("searchInput");
  searchInput.addEventListener("input", () => {
    const searchTerm = searchInput.value.toLowerCase();
    
    if (searchTerm.trim() === "") {
      displayProducts(menuItems);
    } else {
      const filteredProducts = menuItems.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.category.toLowerCase().includes(searchTerm)
      );
      displayProducts(filteredProducts);
    }
  });
  
  // Cargar pedidos al hacer clic en el botón
  const searchOrdersBtn = document.getElementById("searchOrders");
  searchOrdersBtn.addEventListener("click", () => {
    const student = document.getElementById("student").value;
    if (student.trim() !== "") {
      currentStudent = student;
      loadOrders(student);
    }
  });
  
  // Event listeners para autenticación
  document.getElementById('login-btn').addEventListener('click', function() {
    openModal('login-modal');
  });

  document.getElementById('register-btn').addEventListener('click', function() {
    openModal('register-modal');
  });

  document.getElementById('logout-btn').addEventListener('click', function() {
    logout();
  });

  document.getElementById('switch-to-register').addEventListener('click', function(e) {
    e.preventDefault();
    closeModal('login-modal');
    openModal('register-modal');
  });

  document.getElementById('switch-to-login').addEventListener('click', function(e) {
    e.preventDefault();
    closeModal('register-modal');
    openModal('login-modal');
  });

  document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    login(email, password);
  });

  document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;
    
    if (password !== confirmPassword) {
      showFormMessage('register-message', 'Las contraseñas no coinciden', 'error');
      return;
    }
    
    register(name, email, password);
  });
  
  // Eventos del carrito
  const cartIcon = document.querySelector(".cart-icon");
  const cartModal = document.getElementById("cart-modal");
  const closeCartBtn = cartModal.querySelector(".close");
  
  cartIcon.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = "block";
  });
  
  closeCartBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
  });
  
  window.addEventListener("click", (e) => {
    if (e.target === cartModal) {
      cartModal.style.display = "none";
    }
  });
  
  // Botones del carrito
  const clearCartBtn = document.getElementById("clear-cart");
  const checkoutBtn = document.getElementById("checkout");
  
  clearCartBtn.addEventListener("click", () => {
    cart = [];
    updateCartCount();
    updateCartModal();
  });
  
  checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    
    cartModal.style.display = "none";
    showCheckoutModal();
  });
  
  // Modal de checkout
  const checkoutModal = document.getElementById("checkout-modal");
  const closeCheckoutBtn = checkoutModal.querySelector(".close");
  const checkoutForm = document.getElementById("checkout-form");
  
  closeCheckoutBtn.addEventListener("click", () => {
    checkoutModal.style.display = "none";
  });
  
  window.addEventListener("click", (e) => {
    if (e.target === checkoutModal) {
      checkoutModal.style.display = "none";
    }
  });
  
  checkoutForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("checkout-name").value;
    
    // Procesar cada item del carrito como un pedido
    for (const item of cart) {
      try {
        await fetch(`${API_URL}/order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            student: name, 
            item: item.name, 
            quantity: item.quantity 
          })
        });
      } catch (error) {
        console.error("Error al procesar pedido:", error);
      }
    }
    
    alert("✅ Pedido enviado correctamente!");
    cart = [];
    updateCartCount();
    checkoutModal.style.display = "none";
    
    // Actualizar la lista de pedidos
    currentStudent = name;
    loadOrders(name);
  });
});

// Añadir al carrito
function addToCart(product, quantity) {
  const existingItem = cart.find(item => item.id === product.id);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });
  }
  
  updateCartCount();
  showAddedToCartMessage(product.name);
}

// Actualizar contador del carrito
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCount.textContent = totalItems;
}

// Mostrar mensaje de añadido al carrito
function showAddedToCartMessage(productName) {
  const message = document.createElement("div");
  message.className = "cart-message";
  message.textContent = `¡${productName} añadido al carrito!`;
  
  document.body.appendChild(message);
  
  setTimeout(() => {
    message.classList.add("show");
  }, 10);
  
  setTimeout(() => {
    message.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(message);
    }, 300);
  }, 2000);
}

// Actualizar modal del carrito
function updateCartModal() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  
  cartItemsContainer.innerHTML = "";
  
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Tu carrito está vacío</p>";
    cartTotal.textContent = "0.00";
    return;
  }
  
  let total = 0;
  
  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";
    
    cartItem.innerHTML = `
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
      </div>
      <div class="cart-item-quantity">
        <button class="decrease-cart">-</button>
        <span>${item.quantity}</span>
        <button class="increase-cart">+</button>
      </div>
      <div class="cart-item-remove" data-index="${index}">
        <i class="fas fa-trash"></i>
      </div>
    `;
    
    cartItemsContainer.appendChild(cartItem);
    
    // Eventos para botones de cantidad
    const decreaseBtn = cartItem.querySelector(".decrease-cart");
    const increaseBtn = cartItem.querySelector(".increase-cart");
    const removeBtn = cartItem.querySelector(".cart-item-remove");
    
    decreaseBtn.addEventListener("click", () => {
      if (item.quantity > 1) {
        item.quantity--;
        updateCartModal();
        updateCartCount();
      }
    });
    
    increaseBtn.addEventListener("click", () => {
      item.quantity++;
      updateCartModal();
      updateCartCount();
    });
    
    removeBtn.addEventListener("click", () => {
      cart.splice(index, 1);
      updateCartModal();
      updateCartCount();
    });
  });
  
  cartTotal.textContent = total.toFixed(2);
}

// Mostrar modal de checkout
function showCheckoutModal() {
  const checkoutModal = document.getElementById("checkout-modal");
  const orderItemsSummary = document.getElementById("order-items-summary");
  const orderTotal = document.getElementById("order-total");
  const checkoutName = document.getElementById("checkout-name");
  
  // Prellenar nombre si ya existe
  if (currentStudent) {
    checkoutName.value = currentStudent;
  }
  
  orderItemsSummary.innerHTML = "";
  
  let total = 0;
  
  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    
    const orderItem = document.createElement("div");
    orderItem.className = "order-item";
    
    orderItem.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>$${itemTotal.toFixed(2)}</span>
    `;
    
    orderItemsSummary.appendChild(orderItem);
  });
  
  orderTotal.textContent = total.toFixed(2);
  checkoutModal.style.display = "block";
}

// Cargar pedidos del estudiante
async function loadOrders(student) {
  if (!student) return;
  
  try {
    const res = await fetch(`${API_URL}/orders/${student}`);
    const orders = await res.json();

    const list = document.getElementById("ordersList");
    list.innerHTML = "";
    
    if (orders.length === 0) {
      list.innerHTML = "<p>No tienes pedidos recientes</p>";
      return;
    }
    
    orders.forEach(order => {
      const li = document.createElement("li");
      
      // Buscar imagen del producto
      const productImage = menuItems.find(item => item.name === order.item)?.image || 
                          productImages[order.item] || 
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";
      
      li.innerHTML = `
        <div class="order-item-details">
          <img src="${productImage}" alt="${order.item}" class="order-item-image">
          <div class="order-item-info">
            <h4>${order.item}</h4>
            <p>Cantidad: ${order.quantity}</p>
            <p class="order-status ${order.status.toLowerCase()}">${order.status}</p>
          </div>
        </div>
      `;
      
      list.appendChild(li);
    });
  } catch (error) {
    console.error("Error al cargar pedidos:", error);
    const list = document.getElementById("ordersList");
    list.innerHTML = "<p>Error al cargar pedidos. Intenta más tarde.</p>";
  }
}

// Cargar todo al iniciar
loadMenu();

// Variables para autenticación
let currentUser = null;

// Verificar sesión de usuario
function checkUserSession() {
  fetch('http://localhost:5000/check-session', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    if (data.authenticated) {
      // Usuario autenticado
      currentUser = data.user;
      updateUIForLoggedInUser(data.user);
    } else {
      // No hay sesión activa
      updateUIForLoggedOutUser();
    }
  })
  .catch(error => {
    console.error('Error al verificar sesión:', error);
    updateUIForLoggedOutUser();
  });
}

// Actualizar UI para usuario logueado
function updateUIForLoggedInUser(user) {
  document.getElementById('auth-buttons').style.display = 'none';
  document.getElementById('user-info').style.display = 'flex';
  document.getElementById('username-display').textContent = user.name;
  
  // Actualizar campo de estudiante en formularios
  if (document.getElementById('student')) {
    document.getElementById('student').value = user.name;
  }
  if (document.getElementById('checkout-name')) {
    document.getElementById('checkout-name').value = user.name;
  }
  
  // Cargar pedidos del usuario
  loadOrders(user.name);
}

// Actualizar UI para usuario no logueado
function updateUIForLoggedOutUser() {
  document.getElementById('auth-buttons').style.display = 'flex';
  document.getElementById('user-info').style.display = 'none';
  currentUser = null;
}

// Función para iniciar sesión
function login(email, password) {
  fetch('http://localhost:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      showFormMessage('login-message', data.error, 'error');
    } else {
      // Login exitoso
      currentUser = data.user;
      updateUIForLoggedInUser(data.user);
      closeModal('login-modal');
      showCartMessage('Inicio de sesión exitoso');
    }
  })
  .catch(error => {
    console.error('Error al iniciar sesión:', error);
    showFormMessage('login-message', 'Error al conectar con el servidor', 'error');
  });
}

// Función para registrarse
function register(name, email, password) {
  fetch('http://localhost:5000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  })
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      showFormMessage('register-message', data.error, 'error');
    } else {
      // Registro exitoso
      showFormMessage('register-message', 'Registro exitoso. Ahora puedes iniciar sesión.', 'success');
      setTimeout(() => {
        closeModal('register-modal');
        openModal('login-modal');
      }, 1500);
    }
  })
  .catch(error => {
    console.error('Error al registrarse:', error);
    showFormMessage('register-message', 'Error al conectar con el servidor', 'error');
  });
}

// Función para cerrar sesión
function logout() {
  fetch('http://localhost:5000/logout', {
    method: 'POST',
    credentials: 'include'
  })
  .then(response => response.json())
  .then(data => {
    updateUIForLoggedOutUser();
    showCartMessage('Sesión cerrada correctamente');
  })
  .catch(error => {
    console.error('Error al cerrar sesión:', error);
  });
}

// Mostrar mensaje en formularios
function showFormMessage(elementId, message, type) {
  const messageElement = document.getElementById(elementId);
  messageElement.textContent = message;
  messageElement.className = 'form-message ' + type;
  messageElement.style.display = 'block';
}

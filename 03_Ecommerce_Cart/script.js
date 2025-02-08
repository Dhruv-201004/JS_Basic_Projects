document.addEventListener("DOMContentLoaded", () => {
  // *Available Products with added images and descriptions*
  const products = [
    {
      id: 1,
      name: "Premium Headphones",
      price: 299.99,
      icon: "fas fa-headphones",
    },
    {
      id: 2,
      name: "Smart Watch",
      price: 199.99,
      icon: "fas fa-clock",
    },
    {
      id: 3,
      name: "Wireless Speaker",
      price: 159.99,
      icon: "fas fa-volume-up",
    },
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // *Get Required Elements*
  const productList = document.getElementById("product-list");
  const cartItems = document.getElementById("cart-items");
  const emptyCartMessage = document.getElementById("empty-cart");
  const cartTotalMessage = document.getElementById("cart-total");
  const totalPriceDisplay = document.getElementById("total-price");
  const checkOutBtn = document.getElementById("checkout-btn");

  // Create a separate container for cart items
  const cartItemsContainer = document.createElement("div");
  cartItemsContainer.id = "cart-items-container";
  cartItems.insertBefore(cartItemsContainer, cartItems.firstChild);

  // Display Products into ProductList
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");
    productDiv.innerHTML = `
      <i class="${product.icon} fa-2x"></i>
      <span>${product.name}</span>
      <span class="price">$${product.price.toFixed(2)}</span>
      <button data-id="${product.id}">
        <i class="fas fa-cart-plus"></i> Add to Cart
      </button>
    `;

    productList.appendChild(productDiv);
  });

  // *Display Cart Items from Local Storage*
  renderCart();

  // *Add to Cart*
  productList.addEventListener("click", (e) => {
    if (
      e.target.tagName === "BUTTON" ||
      e.target.parentElement.tagName === "BUTTON"
    ) {
      const button =
        e.target.tagName === "BUTTON" ? e.target : e.target.parentElement;
      const productID = parseInt(button.getAttribute("data-id"));
      const product = products.find((p) => p.id === productID);

      // *Add success animation to button*
      button.innerHTML = '<i class="fas fa-check"></i> Added!';
      button.style.background = "#22c55e";

      setTimeout(() => {
        button.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
        button.style.background = "";
      }, 1000);

      addToCart(product);
    }
  });

  // *Add to Cart Function*
  function addToCart(product) {
    cart.push(product);
    saveCart();
    renderCart();
  }

  // *Save Cart*
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // *Render Cart*
  function renderCart() {
    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;

    if (cart.length > 0) {
      emptyCartMessage.classList.add("hidden");
      cartTotalMessage.classList.remove("hidden");

      cart.forEach((item) => {
        totalPrice += item.price;
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
          <div>
            <i class="${item.icon}"></i>
            <span>${item.name} - $${item.price.toFixed(2)}</span>
          </div>
          <button data-id="${item.id}" class="remove-btn">
            <i class="fas fa-trash"></i>
          </button>
        `;
        cartItemsContainer.appendChild(cartItem);
      });

      totalPriceDisplay.textContent = `$${totalPrice.toFixed(2)}`;
    } else {
      emptyCartMessage.classList.remove("hidden");
      cartTotalMessage.classList.add("hidden");
    }
  }

  // *Remove from Cart*
  cartItemsContainer.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("remove-btn") ||
      e.target.parentElement.classList.contains("remove-btn")
    ) {
      const button = e.target.classList.contains("remove-btn")
        ? e.target
        : e.target.parentElement;
      const cartItem = button.parentElement;
      const productID = parseInt(button.getAttribute("data-id"));

      // Add remove animation
      cartItem.style.animation = "slideOut 0.3s ease forwards";

      setTimeout(() => {
        cart = cart.filter((item) => item.id !== productID);
        saveCart();
        renderCart();
      }, 300);
    }
  });

  // *Checkout*
  checkOutBtn.addEventListener("click", () => {
    if (cart.length > 0) {
      const total = cart.reduce((sum, item) => sum + item.price, 0);

      // Add success animation
      checkOutBtn.innerHTML = '<i class="fas fa-check"></i> Success!';
      checkOutBtn.style.background = "#22c55e";

      setTimeout(() => {
        alert(`Thank you for your purchase! Total: $${total.toFixed(2)}`);
        cart.length = 0;
        saveCart();
        renderCart();

        checkOutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Checkout';
        checkOutBtn.style.background = "";
      }, 1000);
    }
  });
});

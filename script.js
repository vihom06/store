// script.js

document.addEventListener("DOMContentLoaded", () => {
    // View Order History
window.viewOrderHistory = function () {
  const history = JSON.parse(localStorage.getItem(`orders_${loggedInUser}`) || "[]");

  if (history.length === 0) {
    alert("No previous orders found.");
    return;
  }

  let message = "🧾 Your Order History:\n\n";
  history.forEach((order, i) => {
    message += `Order ${i + 1} (${new Date(order.date).toLocaleString()}):\n`;
    order.order.forEach(item => {
      message += `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})\n`;
    });
    message += `Total: $${order.total.toFixed(2)}\n\n`;
  });

  alert(message);
};

  const loggedInUser = localStorage.getItem("vikram_store_logged_in");
  if (!loggedInUser) return; // already handled in shop.html

  let cart = JSON.parse(localStorage.getItem(`cart_${loggedInUser}`) || "[]");

  // Add product to cart
  window.addToCart = function (productName, productPrice) {
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name: productName, price: productPrice, quantity: 1 });
    }

    localStorage.setItem(`cart_${loggedInUser}`, JSON.stringify(cart));
    alert(`${productName} added to cart!`);
  };

  // Remove product from cart
  window.removeFromCart = function (index) {
    if (cart[index]) {
      const removedItem = cart.splice(index, 1);
      localStorage.setItem(`cart_${loggedInUser}`, JSON.stringify(cart));
      alert(`${removedItem[0].name} removed from cart!`);
    }
  };

  // Checkout
window.checkout = function () {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let summary = "🧾 Order Summary:\n\n";
  let total = 0;

  cart.forEach(item => {
    summary += `- ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})\n`;
    total += item.price * item.quantity;
  });

  summary += `\nTotal: $${total.toFixed(2)}\nRedirecting to payment gateway...`;
  alert(summary);

  // ✅ Save order to history
  let orders = JSON.parse(localStorage.getItem(`orders_${loggedInUser}`) || "[]");
  orders.push({
    date: new Date().toISOString(),
    order: cart,
    total
  });
  localStorage.setItem(`orders_${loggedInUser}`, JSON.stringify(orders));

  // ✅ Clear cart
  cart = [];
  localStorage.setItem(`cart_${loggedInUser}`, JSON.stringify(cart));

  // Redirect
  setTimeout(() => {
    window.location.href = "payment.html";
  }, 1000);
};


  // Logout
  window.logout = function () {
    localStorage.removeItem("vikram_store_logged_in");
    window.location.href = "index.html";
  };
});

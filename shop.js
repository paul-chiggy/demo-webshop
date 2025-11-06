const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
  strawberry: { name: "Strawberry", emoji: "🍓" },
};

const PRODUCT_CONFLICTS = {
  banana: ["strawberry"],
  strawberry: ["banana"],
};

const INCOMPATIBLE_ERROR_MESSAGE =
  "Strawberries and bananas cannot be combined.";

function showBasketError(message) {
  const errorEl = document.getElementById("basketError");
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.style.display = "block";
  } else {
    alert(message);
  }
}

function clearBasketError() {
  const errorEl = document.getElementById("basketError");
  if (errorEl) {
    errorEl.textContent = "";
    errorEl.style.display = "none";
  }
}

function isProductCompatible(product, basket) {
  const conflicts = PRODUCT_CONFLICTS[product];
  if (!conflicts) return true;
  return !basket.some((item) => conflicts.includes(item));
}

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product) {
  const basket = getBasket();
  if (!isProductCompatible(product, basket)) {
    showBasketError(INCOMPATIBLE_ERROR_MESSAGE);
    return false;
  }
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
  clearBasketError();
  return true;
}

function clearBasket() {
  localStorage.removeItem("basket");
  clearBasketError();
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((product) => {
    const item = PRODUCTS[product];
    if (item) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span>`;
      basketList.appendChild(li);
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  const result = origAddToBasket(product);
  renderBasketIndicator();
  return result;
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};

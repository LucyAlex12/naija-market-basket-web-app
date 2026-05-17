const prices = {
  Lagos: { Rice: 78000, Garri: 22000, Beans: 65000, Tomatoes: 18000, Plantain: 12000, Yam: 9500, Pepper: 7000, Eggs: 5200 },
  Abuja: { Rice: 82000, Garri: 24000, Beans: 69000, Tomatoes: 16000, Plantain: 13000, Yam: 10500, Pepper: 7500, Eggs: 5600 },
  "Port Harcourt": { Rice: 80000, Garri: 23000, Beans: 67000, Tomatoes: 19000, Plantain: 11000, Yam: 10000, Pepper: 8000, Eggs: 5400 },
  Enugu: { Rice: 76000, Garri: 21000, Beans: 62000, Tomatoes: 15000, Plantain: 10000, Yam: 9000, Pepper: 6500, Eggs: 5000 }
};

let basket = JSON.parse(localStorage.getItem("marketBasket")) || [];

const money = value => `₦${value.toLocaleString("en-NG")}`;
const save = () => localStorage.setItem("marketBasket", JSON.stringify(basket));

function currentCity() {
  return document.querySelector("#citySelect").value;
}

function renderProducts() {
  const query = document.querySelector("#search").value.toLowerCase();
  const cityPrices = prices[currentCity()];
  const products = Object.keys(cityPrices).filter(name => name.toLowerCase().includes(query));
  document.querySelector("#products").innerHTML = products.map(name => `
    <article class="product">
      <p class="eyebrow">${currentCity()}</p>
      <h2>${name}</h2>
      <strong>${money(cityPrices[name])}</strong>
      <button data-name="${name}" data-price="${cityPrices[name]}">Add to basket</button>
    </article>
  `).join("");
}

function renderBasket() {
  const total = basket.reduce((sum, item) => sum + item.price, 0);
  document.querySelector("#basketTotal").textContent = money(total);
  document.querySelector("#basketList").innerHTML = basket.length ? basket.map((item, index) => `
    <div class="basket-row">
      <span>${item.name}<br><small>${item.city}</small></span>
      <strong>${money(item.price)}</strong>
      <button data-index="${index}">Remove</button>
    </div>
  `).join("") : "<p>Your basket is empty.</p>";
}

document.querySelector("#products").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  basket.push({ name: button.dataset.name, price: Number(button.dataset.price), city: currentCity() });
  save();
  renderBasket();
});

document.querySelector("#basketList").addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  basket.splice(Number(button.dataset.index), 1);
  save();
  renderBasket();
});

document.querySelector("#clearBasket").addEventListener("click", () => {
  basket = [];
  save();
  renderBasket();
});

document.querySelector("#citySelect").addEventListener("change", renderProducts);
document.querySelector("#search").addEventListener("input", renderProducts);

renderProducts();
renderBasket();

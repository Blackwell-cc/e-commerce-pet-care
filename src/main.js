import "./style.css";
import {
  products,
  money,
  sanitizeCart,
  cartCount,
  subtotal,
  shipping,
  changeQuantity,
} from "./shop.js";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const paths = {
  arrow: '<path d="M4 12h15M13 5l7 7-7 7"/>',
  search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
  bag: '<path d="M5 7h14l1 14H4L5 7Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
  heart:
    '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z"/>',
  leaf: '<path d="M20 3C8 2 2 8 5 15s15 8 15-12ZM5 20 16 9"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  minus: '<path d="M5 12h14"/>',
};
const icon = (name, cls = "") =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]}</svg>`;
const paw = `<svg viewBox="0 0 64 64" fill="currentColor" aria-hidden="true"><ellipse cx="15" cy="25" rx="7" ry="10" transform="rotate(-25 15 25)"/><ellipse cx="30" cy="16" rx="7" ry="10"/><ellipse cx="47" cy="22" rx="7" ry="10" transform="rotate(25 47 22)"/><path d="M14 47c0-10 10-21 18-21s19 12 19 22c0 12-13 6-19 6S14 60 14 47"/></svg>`;
const star = '<span class="spark" aria-hidden="true">✳</span>';
const arrow = `<span class="button-arrow">${icon("arrow")}</span>`;
let cart = [];
try {
  cart = sanitizeCart(
    JSON.parse(localStorage.getItem("goodkind-cart") || "[]"),
  );
} catch {
  /* Storage is optional. */
}
let category = "All goodies";
let toastTimer;

document.querySelector("#app").innerHTML = `
  <div class="announcement"><span>GOOD CARE. GREAT COMPANY.</span><span>Little essentials. A whole lot of love. ${icon("heart")}</span><span>THE GOODKIND WAY</span></div>
  <header class="header">
    <a href="#" class="wordmark" aria-label="Goodkind home">goodkind<span class="logo-paw">${paw}</span></a>
    <nav class="desktop-nav" aria-label="Main navigation"><a href="#shop">Shop the goodies ${icon("arrow")}</a><a href="#story">Our kind of care</a><a href="#faq">Good to know</a></nav>
    <div class="header-actions"><button class="icon-button search-button" data-action="search" aria-label="Search products">${icon("search")}</button><button class="bag-button" data-action="cart" aria-label="Open shopping bag">${icon("bag")}<span class="bag-label">Bag</span><span id="cart-count" class="cart-count">${cartCount(cart)}</span></button><button class="icon-button mobile-menu" data-action="menu" aria-label="Open navigation">${icon("menu")}</button></div>
  </header>
  <main id="main">
    <section class="hero" aria-labelledby="hero-title">
      <img class="hero-image" src="${asset("images/hero.webp")}" alt="A happy golden retriever sitting against a soft olive green backdrop" width="1536" height="1024" fetchpriority="high" />
      <div class="hero-copy"><p class="eyebrow">FOR THE LOVE OF LITTLE PAWS</p><h1 id="hero-title">GOOD CARE.<br>GREAT<br><span>COMPANY.</span></h1><p class="hero-description">Everyday essentials for the ones<br>who make every day better.</p><a class="button button-lime" href="#shop">Find their feel-good ${arrow}</a><span class="hero-footnote">A little treat. A fresh start. A happier tail.</span></div>
      <div class="hero-stamp"><span>BIG LOVE FOR</span>${paw}<span>LITTLE PAWS</span></div>
      <div class="dog-caption"><span class="status-dot"></span> GOOD DOG ENERGY, ALWAYS.</div>
      <a class="hero-scroll" href="#shop" aria-label="Explore the collection">${icon("arrow")}</a>
    </section>
    <div class="ribbon" aria-label="Made for the good days"><div>GOOD FOOD ${star} FRESH FUR ${star} HAPPY PLAY ${star} MORE TAIL WAGS ${star} GOOD FOOD ${star} FRESH FUR ${star}</div></div>
    <section class="intro section-wrap" aria-label="The Goodkind philosophy"><p>For muddy paws.<br>And everything after.</p><div>${icon("leaf")}<span>Thoughtful essentials<br><small>A little less fuss. A little more care.</small></span></div><div>${icon("heart")}<span>Made for your best friend<br><small>From treat time to together time.</small></span></div><div>${icon("sun")}<span>Good in the everyday<br><small>Little rituals worth looking forward to.</small></span></div></section>
    <section class="shop section-wrap" id="shop" aria-labelledby="shop-title">
      <div class="section-heading"><div><p class="eyebrow">THE EVERYDAY, BUT BETTER</p><h2 id="shop-title">SMALL THINGS.<br><span>HAPPY TAILS.</span></h2></div><p>Meet their new favorite things.<br>Thoughtful care, from nose to tail.</p></div>
      <div class="shop-toolbar"><div class="filters" role="group" aria-label="Filter products">${["All goodies", "Treats", "Grooming", "Wellness", "Play"].map((name, i) => `<button data-filter="${name}" aria-pressed="${i === 0}">${name}${i === 0 ? "<span>4</span>" : ""}</button>`).join("")}</div><span id="product-count" aria-live="polite">4 good things</span></div>
      <div class="product-grid" id="products"></div>
      <p class="shop-note">A considered collection for dogs. All prices in USD. <span>Good things start here.</span></p>
    </section>
    <section class="routine section-wrap" aria-labelledby="routine-title"><div class="routine-paw">${paw}</div><div><p class="eyebrow">EVERY DOG HAS THEIR DAY</p><h2 id="routine-title">WHAT’S THEIR<br> KIND OF GOOD?</h2><p>Snack enthusiast? Mud magnet? Professional player?<br>Find a little something for their favorite routine.</p></div><button class="button button-dark" data-action="quiz">Find their good thing ${arrow}</button></section>
    <section class="story section-wrap" id="story" aria-labelledby="story-title"><div class="story-photo"><img src="${asset("images/story.webp")}" alt="A golden retriever resting its chin on a loved one's knee in a sunny meadow" width="1000" height="1000" loading="lazy" /><span class="photo-note">Their whole world? You.</span></div><div class="story-content"><p class="eyebrow">A LITTLE CARE GOES A LONG WAY</p><h2 id="story-title">THEY MAKE<br>LIFE BETTER.<br><span>LET’S RETURN<br>THE FAVOR.</span></h2><p>They’re our early-morning motivation. Our sofa companions. Our very best welcome home.</p><p>Goodkind is built around one simple idea: the love we get from our pets deserves a little love in return. Through good things, thoughtful rituals, and more time together.</p><a class="text-link" href="#shop">A little good for your best friend ${icon("arrow")}</a><div class="story-signature">With love, goodkind ${icon("heart")}</div></div></section>
    <section class="good-days section-wrap"><p class="eyebrow">LESS COMPLICATED. MORE CONNECTED.</p><h2>THE BEST PART OF THEIR DAY?<br><span>DOING LIFE WITH YOU.</span></h2><div class="ritual-grid"><article><span class="ritual-number">01 / REWARD</span><h3>Celebrate the little wins.</h3><p>A pocketful of treats. A new trick. That very proud look on their face.</p><button class="text-link" data-category="Treats">Make it treat time ${icon("arrow")}</button></article><article><span class="ritual-number">02 / REFRESH</span><h3>Fresh fur, fresh adventures.</h3><p>From the muddiest walk to the softest post-bath cuddle. All part of the fun.</p><button class="text-link" data-category="Grooming">Meet the bath-time edit ${icon("arrow")}</button></article><article><span class="ritual-number">03 / RECONNECT</span><h3>Make room for more play.</h3><p>Put down the phone. Pick up their favorite toy. The good stuff is right here.</p><button class="text-link" data-category="Play">Let the good times roll ${icon("arrow")}</button></article></div></section>
    <section class="faq section-wrap" id="faq" aria-labelledby="faq-title"><div><p class="eyebrow">GOOD QUESTIONS. STRAIGHT ANSWERS.</p><h2 id="faq-title">A LITTLE <br>GOOD TO <br><span>KNOW.</span></h2><p>Getting to know Goodkind?<br>Here’s a helpful head start.</p></div><div class="faq-list">
      <details><summary>What is Goodkind? <span>+</span></summary><p>Goodkind is a fictional pet care brand created as an interactive e-commerce portfolio project. You can explore the collection, try product filters, and build a shopping bag. No real purchases or deliveries take place.</p></details>
      <details><summary>Who is this collection for? <span>+</span></summary><p>This concept collection is designed around dogs and their everyday routines. Product descriptions and packaging are illustrative. Always check a real product’s species, age, ingredients, and safety guidance before use.</p></details>
      <details><summary>How does shipping work? <span>+</span></summary><p>The demo uses a $5 flat shipping fee and free shipping for bags of $50 or more. This is an example shopping experience; no physical products are shipped.</p></details>
      <details><summary>Can I place a real order? <span>+</span></summary><p>Not yet. The bag and checkout are interactive demonstrations. Checkout shows your order summary without asking for payment or personal information, and no order is sent to a store.</p></details>
      <details><summary>Will my shopping bag be saved? <span>+</span></summary><p>Yes, your bag is saved on this browser when local storage is available. Nothing is sent to a server. You can remove individual items or clear your bag at any time.</p></details>
    </div></section>
    <section class="newsletter section-wrap"><div><p class="eyebrow">A LITTLE GOOD IN YOUR INBOX</p><h2>JOIN THE<br>GOOD LIST.</h2><p>Fresh finds, little rituals, and a reason to wag.</p></div><form id="newsletter-form"><label for="email">Your email address</label><div class="email-field"><input type="email" id="email" name="email" placeholder="you@yourgoodplace.com" autocomplete="email" required maxlength="254" /><button type="submit" aria-label="Join the good list">${icon("arrow")}</button></div><p class="form-note" id="newsletter-feedback" aria-live="polite">Just a little demo. No emails are sent or saved.</p></form></section>
  </main>
  <footer class="footer"><div class="footer-top"><a class="wordmark" href="#" aria-label="Goodkind home">goodkind<span class="logo-paw">${paw}</span></a><p>Good care. Great company.<br>A little love, every single day.</p><div><a href="#shop">Shop the goodies</a><a href="#story">Our kind of care</a><a href="#faq">Good to know</a></div><div><button data-info="shipping">Shipping & returns</button><button data-info="privacy">Privacy</button><button data-info="about">About this project</button></div></div><div class="footer-word" aria-hidden="true">GOODKIND<span>®</span></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} Goodkind. A portfolio concept.</span><span>Made with care. For the love of paws. ${icon("heart")}</span><a href="#">Back to top ↑</a></div></footer>
  <dialog id="modal" class="modal" aria-labelledby="modal-title"><button class="icon-button modal-close" data-action="close" aria-label="Close dialog">${icon("close")}</button><div id="modal-content"></div></dialog>
  <dialog id="cart-dialog" class="cart-dialog" aria-labelledby="cart-title"></dialog>
  <div id="toast" class="toast" role="status" aria-live="polite"></div>
`;

const modal = document.querySelector("#modal");
const cartDialog = document.querySelector("#cart-dialog");
function toast(message) {
  const dialogFeedback = modal.open && modal.querySelector('.product-feedback');
  if (dialogFeedback) {
    dialogFeedback.textContent = message;
    return;
  }
  const element = document.querySelector("#toast");
  element.textContent = message;
  element.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove("visible"), 3500);
}
function renderProducts() {
  const shown = products.filter(
    (p) => category === "All goodies" || p.category === category,
  );
  document.querySelector("#products").innerHTML = shown
    .map(
      (p) =>
        `<article class="product-card"><button class="product-image" data-product="${p.id}" aria-label="View ${p.name}"><img src="${asset(`images/${p.image}`)}" alt="Goodkind ${p.name} — ${p.detail}" width="627" height="627" loading="lazy" /><span class="product-badge">${p.badge}</span><span class="quick-view">Take a closer look ${icon("arrow")}</span></button><div class="product-meta"><span>${p.category}</span><span>${money(p.price)}</span></div><h3><button data-product="${p.id}">${p.name}</button></h3><p>${p.detail}</p><button class="add-button" data-add="${p.id}">Add to bag ${icon("plus")}</button></article>`,
    )
    .join("");
  document.querySelector("#product-count").textContent =
    `${shown.length} good thing${shown.length === 1 ? "" : "s"}`;
  document
    .querySelectorAll("[data-filter]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.filter === category),
      ),
    );
}
function saveCart() {
  try {
    localStorage.setItem("goodkind-cart", JSON.stringify(cart));
  } catch {
    /* Continue without persistence. */
  }
  document.querySelector("#cart-count").textContent = cartCount(cart);
}
function addToCart(id) {
  if ((cart.find((item) => item.id === id)?.quantity || 0) >= 20)
    return toast("You can add up to 20 of each good thing.");
  cart = changeQuantity(cart, id, 1);
  saveCart();
  toast(`${products.find((p) => p.id === id).name} added to your bag.`);
  if (cartDialog.open) renderCart();
}
function openModal(content, type = "") {
  if (cartDialog.open) cartDialog.close();
  modal.className = `modal ${type}`;
  document.querySelector("#modal-content").innerHTML = content;
  if (!modal.open) modal.showModal();
  else modal.querySelector(".modal-close").focus();
}
function productModal(id) {
  const p = products.find((p) => p.id === id);
  if (!p) return;
  openModal(
    `<div class="product-detail"><img src="${asset(`images/${p.image}`)}" alt="${p.name} product packaging" width="627" height="627" /><div><p class="eyebrow">${p.category} / THE GOODKIND COLLECTION</p><h2 id="modal-title">${p.name}</h2><p>${p.detail}</p><p class="detail-price">${money(p.price)}</p><p>${p.description}</p><ul>${p.features.map((f) => `<li>${icon("check")}${f}</li>`).join("")}</ul><button class="button button-dark" data-add="${p.id}">Add to bag — ${money(p.price)} ${arrow}</button><p class="product-feedback" role="status"></p><button class="text-link view-bag" data-action="cart">View your bag ${icon("arrow")}</button><p class="concept-note">${p.note}</p></div></div>`,
    "product-modal",
  );
}
function renderCart() {
  const sum = subtotal(cart);
  cartDialog.innerHTML = `<div class="cart-header"><div><p class="eyebrow">GOOD THINGS INSIDE</p><h2 id="cart-title">YOUR BAG <span>(${cartCount(cart)})</span></h2></div><button class="icon-button" data-action="close-cart" aria-label="Close shopping bag">${icon("close")}</button></div>${
    cart.length
      ? `<div class="shipping-note"><p>${sum >= 5000 ? "Good news! Your demo bag has free shipping." : `${money(5000 - sum)} away from free demo shipping.`}</p><progress max="5000" value="${Math.min(sum, 5000)}" aria-label="Progress toward free demo shipping"></progress></div><div class="cart-items">${cart
          .map((item) => {
            const p = products.find((p) => p.id === item.id);
            return `<article class="cart-item"><img src="${asset(`images/${p.image}`)}" alt="${p.name}" width="100" height="100" /><div><h3>${p.name}</h3><p>${p.detail}</p><div class="quantity"><button data-change="${p.id}" data-delta="-1" aria-label="Decrease ${p.name} quantity">${icon("minus")}</button><span aria-label="Quantity">${item.quantity}</span><button data-change="${p.id}" data-delta="1" aria-label="Increase ${p.name} quantity" ${item.quantity === 20 ? "disabled" : ""}>${icon("plus")}</button></div><button class="remove-button" data-remove="${p.id}">Remove</button></div><strong>${money(p.price * item.quantity)}</strong></article>`;
          })
          .join(
            "",
          )}</div><div class="cart-summary"><div><span>Subtotal</span><span>${money(sum)}</span></div><div><span>Demo shipping</span><span>${shipping(cart) ? money(shipping(cart)) : "On us"}</span></div><div class="total"><strong>Total</strong><strong>${money(sum + shipping(cart))}</strong></div><button class="button button-lime" data-action="checkout">Try demo checkout ${arrow}</button><p>Portfolio demo · No payment or real order</p><button class="text-link" data-action="clear-cart">Clear bag</button></div>`
      : `<div class="empty-bag">${paw}<h3>A little empty.<br>A lot of possibility.</h3><p>Find a good thing for your best friend.</p><button class="button button-dark" data-action="continue">Explore the goodies ${arrow}</button></div>`
  }`;
}
function openCart() {
  if (modal.open) modal.close();
  renderCart();
  if (!cartDialog.open) cartDialog.showModal();
}
function searchModal() {
  openModal(
    `<p class="eyebrow">LET’S FIND A GOOD THING</p><h2 id="modal-title">Sniff it out.</h2><label for="search-input" class="search-label">Search products</label><input id="search-input" class="search-input" type="search" placeholder="Try treats, shampoo, or play…" autocomplete="off" /><p id="search-count" class="search-count" aria-live="polite"></p><div id="search-results"></div>`,
    "search-modal",
  );
  const input = document.querySelector("#search-input");
  const search = () => {
    const query = input.value.trim().toLowerCase();
    const found = products.filter((p) =>
      `${p.name} ${p.category} ${p.detail} ${p.description}`
        .toLowerCase()
        .includes(query),
    );
    document.querySelector("#search-count").textContent =
      `${found.length} good thing${found.length === 1 ? "" : "s"} found`;
    document.querySelector("#search-results").innerHTML = found.length
      ? found
          .map(
            (p) =>
              `<button class="search-result" data-product="${p.id}"><img src="${asset(`images/${p.image}`)}" alt="" width="72" height="72" /><span><strong>${p.name}</strong><small>${p.detail}</small></span><span>${money(p.price)}</span>${icon("arrow")}</button>`,
          )
          .join("")
      : '<div class="search-empty"><p>No goodies found. Try “treats”, “fur”, or “toy”.</p><button class="text-link" data-action="reset-search">See all goodies</button></div>';
  };
  input.addEventListener("input", search);
  search();
  input.focus();
}
function quizModal() {
  openModal(
    `<p class="eyebrow">A LITTLE ROUTINE FINDER</p><h2 id="modal-title">What’s their kind of good?</h2><p>Pick the moment you’d like to make a little better.</p><div class="quiz-options">${[
      {
        id: "bites",
        title: "The treat enthusiast",
        text: "Will sit for snacks.",
        icon: "heart",
      },
      {
        id: "fur",
        title: "The mud magnet",
        text: "Every puddle is an invitation.",
        icon: "leaf",
      },
      {
        id: "play",
        title: "The professional player",
        text: "One more game? Always.",
        icon: "sun",
      },
      {
        id: "tummy",
        title: "The routine lover",
        text: "Little rituals, every day.",
        icon: "check",
      },
    ]
      .map(
        (item) =>
          `<button data-product="${item.id}">${icon(item.icon)}<span><strong>${item.title}</strong><small>${item.text}</small></span>${icon("arrow")}</button>`,
      )
      .join(
        "",
      )}</div><p class="concept-note">A way to explore the concept collection, not a health or dietary assessment.</p>`,
    "quiz-modal",
  );
}
const information = {
  shipping: [
    "Shipping & returns",
    "This is a portfolio storefront, so no products are shipped and no return requests are processed. The bag demonstrates a $5 shipping fee, waived at $50. A live store would need fulfillment locations, delivery estimates, and an approved return policy before launch.",
  ],
  privacy: [
    "A little privacy, please.",
    "This demo does not send your information to a server, use analytics, or process payments. Your product IDs and quantities are saved in browser local storage so your bag can stay with you. Use “Clear bag” to remove them. Newsletter input is neither saved nor sent. Fonts and images are served locally.",
  ],
  about: [
    "A good little concept.",
    "Goodkind is an independent, fictional pet care brand and e-commerce portfolio project. The art direction takes inspiration from Voldog’s bold typography and green-and-lime palette. Branding, copy, layout, and generated campaign imagery were created for this project. It is not affiliated with Voldog. Products, prices, and policies are illustrative.",
  ],
};
function checkout() {
  if (!cart.length) return;
  const total = subtotal(cart) + shipping(cart);
  openModal(
    `<div class="checkout-success"><span class="success-icon">${icon("check")}</span><p class="eyebrow">THAT’S A BAG FULL OF GOOD</p><h2 id="modal-title">All the good.<br>Just a demo.</h2><p>You’ve reached the end of the shopping experience.<br>No payment was taken and no order was placed.</p><div class="order-summary">${cart.map((item) => `<div><span>${products.find((p) => p.id === item.id).name} × ${item.quantity}</span><strong>${money(products.find((p) => p.id === item.id).price * item.quantity)}</strong></div>`).join("")}<div><span>Demo shipping</span><strong>${money(shipping(cart))}</strong></div><div class="total"><span>Demo total</span><strong>${money(total)}</strong></div></div><button class="button button-dark" data-action="continue">Keep exploring ${arrow}</button></div>`,
    "checkout-modal",
  );
}
document.addEventListener("click", (event) => {
  const button = event.target.closest("button, a");
  if (!button) return;
  if (button.dataset.filter) {
    category = button.dataset.filter;
    renderProducts();
  }
  if (button.dataset.category) {
    category = button.dataset.category;
    renderProducts();
    document.querySelector("#shop").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  if (button.dataset.product) productModal(button.dataset.product);
  if (button.dataset.add) addToCart(button.dataset.add);
  if (button.dataset.change) {
    const { change, delta } = button.dataset;
    cart = changeQuantity(cart, change, Number(delta));
    saveCart();
    renderCart();
    (
      cartDialog.querySelector(
        `[data-change="${change}"][data-delta="${delta}"]:not(:disabled)`,
      ) ||
      cartDialog.querySelector(`[data-change="${change}"]:not(:disabled)`) ||
      cartDialog.querySelector('[data-action="close-cart"]')
    ).focus();
  }
  if (button.dataset.remove) {
    cart = cart.filter((item) => item.id !== button.dataset.remove);
    saveCart();
    renderCart();
    cartDialog.querySelector('[data-action="close-cart"]').focus();
  }
  if (button.dataset.info) {
    const [title, body] = information[button.dataset.info];
    openModal(
      `<p class="eyebrow">GOOD TO KNOW</p><h2 id="modal-title">${title}</h2><p>${body}</p>`,
      "info-modal",
    );
  }
  const actions = {
    cart: openCart,
    search: searchModal,
    quiz: quizModal,
    checkout,
    close: () => modal.close(),
    "close-cart": () => cartDialog.close(),
    "clear-cart": () => {
      cart = [];
      saveCart();
      renderCart();
      cartDialog.querySelector('[data-action="close-cart"]').focus();
    },
    continue: () => {
      modal.close();
      cartDialog.close();
      document.querySelector("#shop").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      document.querySelector("[data-filter]").focus({ preventScroll: true });
    },
    "reset-search": () => {
      const input = document.querySelector("#search-input");
      input.value = "";
      input.dispatchEvent(new Event("input"));
      input.focus();
    },
    menu: () =>
      openModal(
        `<p class="eyebrow">HELLO, GOOD COMPANY</p><h2 id="modal-title">Come on in.</h2><nav class="mobile-links" aria-label="Mobile navigation"><a href="#shop" data-nav>Shop the goodies ${icon("arrow")}</a><a href="#story" data-nav>Our kind of care ${icon("arrow")}</a><a href="#faq" data-nav>Good to know ${icon("arrow")}</a></nav>`,
        "menu-modal",
      ),
  };
  if (actions[button.dataset.action]) actions[button.dataset.action]();
  if (button.hasAttribute("data-nav")) modal.close();
});
for (const dialog of [modal, cartDialog]) {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        event.clientX < r.left ||
        event.clientX > r.right ||
        event.clientY < r.top ||
        event.clientY > r.bottom
      )
        dialog.close();
    }
  });
}
document
  .querySelector("#newsletter-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    document.querySelector("#newsletter-feedback").textContent =
      "You’re in good company! Demo complete — your email was not saved or sent.";
    event.target.reset();
  });
renderProducts();

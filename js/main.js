let products = [];

fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    if (document.getElementById('top-products-list')) renderTopProducts();
    if (document.getElementById('product-list')) renderAllProducts();
    if (document.getElementById('product-detail')) renderProductDetails();
  });

function renderTopProducts() {
  const container = document.getElementById('top-products-list');
  container.innerHTML = '';
  const top = products.slice(0, 4);
  top.forEach(product => {
    const card = createProductCard(product);
    container.appendChild(card);
  });
}

function renderAllProducts() {
  const container = document.getElementById('product-list');
  const spinner = document.getElementById('loading-spinner');
  const searchBar = document.getElementById('search-bar');
  const categoryButtons = document.querySelectorAll('.category-btn');

  if (!container || !searchBar || categoryButtons.length === 0) return;

  spinner?.classList.add('d-none');

  function updateList() {
    let filtered = [...products];
    const keyword = searchBar.value.toLowerCase();
    const selected = document.querySelector('.category-btn.active')?.dataset.category;

    if (selected && selected !== 'all') {
      filtered = filtered.filter(p => p.category === selected);
    }
    if (keyword) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(keyword));
    }

    container.innerHTML = '';
    filtered.forEach(product => {
      const card = createProductCard(product);
      container.appendChild(card);
    });

    truncateText('.card-text', 100);
  }

  searchBar.addEventListener('input', updateList);
  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateList();
    });
  });

  updateList();
}

function renderProductDetails() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const product = products.find(p => p.id == id);
  const container = document.getElementById('product-detail');
  if (!container) return;

  if (!product) {
    container.innerHTML = '<p>Product not found.</p>';
    return;
  }

  container.innerHTML = `
    <div class="col-md-6 text-center">
      <img src="${product.image}" class="img-fluid rounded shadow" alt="${product.name}" />
    </div>
    <div class="col-md-6">
      <h2>${product.name}</h2>
      <p class="text-muted">${product.category.toUpperCase()}</p>
      <p>${product.description}</p>
      <h4 class="text-success">€${product.price.toFixed(2)}</h4>
      <div class="d-flex flex-wrap gap-2 mt-4">
        <a href="https://wa.me/1234567890?text=I'm%20interested%20in%20${encodeURIComponent(product.name)}" class="btn btn-success">
          <i class="bi bi-whatsapp"></i> Buy via WhatsApp
        </a>
        <a href="products.html" class="btn btn-outline-secondary">
          <i class="bi bi-arrow-left"></i> Back to Products
        </a>
        <button class="btn btn-outline-primary" onclick="shareProduct('${product.name}', '${window.location.href}')">
          <i class="bi bi-share"></i> Share
        </button>
      </div>
    </div>
  `;
}

function createProductCard(product) {
  const col = document.createElement('div');
  col.className = 'col-sm-6 col-md-4 col-lg-3';

  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm';

  const link = document.createElement('a');
  link.href = `product.html?id=${product.id}`;
  link.className = 'text-decoration-none text-dark';

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  img.className = 'card-img-top';
  link.appendChild(img);
  card.appendChild(link);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex flex-column';

  const title = document.createElement('h5');
  title.className = 'card-title';

  const titleLink = document.createElement('a');
  titleLink.href = `product.html?id=${product.id}`;
  titleLink.className = 'text-decoration-none text-dark';
  titleLink.textContent = product.name;
  title.appendChild(titleLink);
  cardBody.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'card-text';
  desc.textContent = product.description;
  cardBody.appendChild(desc);

  const price = document.createElement('p');
  price.className = 'mt-auto fw-bold text-success';
  price.textContent = `€${product.price.toFixed(2)}`;
  cardBody.appendChild(price);

  if (product.whatsapp) {
    const waLink = document.createElement('a');
    waLink.href = product.whatsapp;
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.className = 'btn btn-success w-100 mt-2';
    waLink.innerHTML = '<i class="bi bi-whatsapp"></i> Contact via WhatsApp';
    cardBody.appendChild(waLink);
  }

  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}

function truncateText(selector, maxLength) {
  document.querySelectorAll(selector).forEach(el => {
    const original = el.textContent.trim();
    if (original.length > maxLength) {
      let truncated = original.slice(0, maxLength);
      truncated = truncated.slice(0, truncated.lastIndexOf(' '));
      el.textContent = truncated + '...';
    }
  });
}

function shareProduct(name, url) {
  if (navigator.share) {
    navigator.share({ title: name, url: url }).catch(console.error);
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const feedback = document.getElementById('share-feedback');
      if (feedback) {
        feedback.style.display = 'block';
        setTimeout(() => feedback.style.display = 'none', 2000);
      }
    });
  }
}

// Theme toggle (no change needed, your code is fine)
const toggleBtn = document.getElementById("toggleThemeBtn");
if (toggleBtn) {
  const icon = document.getElementById("themeIcon");
  const htmlTag = document.documentElement;

  const savedTheme = localStorage.getItem("theme") || "light";
  htmlTag.setAttribute("data-bs-theme", savedTheme);
  icon.className = savedTheme === "dark" ? "bi bi-sun" : "bi bi-moon";

  toggleBtn.addEventListener("click", () => {
    const currentTheme = htmlTag.getAttribute("data-bs-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlTag.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    icon.className = newTheme === "dark" ? "bi bi-sun" : "bi bi-moon";
  });
}
function createProductCard(product) {
  const col = document.createElement('div');
  col.className = 'col-sm-6 col-md-4 col-lg-3';

  const card = document.createElement('div');
  card.className = 'card h-100 shadow-sm';

  const img = document.createElement('img');
  img.src = product.image;
  img.alt = product.name;
  img.className = 'card-img-top';
  img.loading = 'lazy'; // optional for performance
  card.appendChild(img);

  const cardBody = document.createElement('div');
  cardBody.className = 'card-body d-flex flex-column';

  const title = document.createElement('h5');
  title.className = 'card-title';
  title.textContent = product.name;
  cardBody.appendChild(title);

  const desc = document.createElement('p');
  desc.className = 'card-text';
  desc.textContent = product.description;
  cardBody.appendChild(desc);

  const price = document.createElement('p');
  price.className = 'mt-auto fw-bold';
  price.textContent = `€${product.price.toFixed(2)}`;
  cardBody.appendChild(price);

  // Change WhatsApp link to product page link
  const detailLink = document.createElement('a');
  detailLink.href = `product.html?id=${product.id}`;
  detailLink.className = 'btn btn-primary w-100 mt-2';
  detailLink.textContent = 'View Details';
  cardBody.appendChild(detailLink);

  card.appendChild(cardBody);
  col.appendChild(card);

  return col;
}


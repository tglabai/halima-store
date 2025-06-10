
document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = parseInt(urlParams.get("id"));
  const productSection = document.getElementById("product-detail");
  const whatsappLink = document.getElementById("whatsapp-link");

  fetch("products.json")
    .then(response => response.json())
    .then(products => {
      const product = products.find(p => p.id === productId);

      if (!product) {
        productSection.innerHTML = `<div class="col-12"><p class="text-danger">Produit non trouvé.</p></div>`;
        whatsappLink.style.display = 'none';
        return;
      }

      const renderStars = (rating) => {
        let starsHTML = '';
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        for (let i = 0; i < fullStars; i++) {
          starsHTML += `<i class="bi bi-star-fill star"></i>`;
        }
        if (halfStar) {
          starsHTML += `<i class="bi bi-star-half star"></i>`;
        }
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
          starsHTML += `<i class="bi bi-star star"></i>`;
        }
        return starsHTML;
      };

      const renderReviews = (reviews) => {
        if (!Array.isArray(reviews) || reviews.length === 0) {
          return `<p class="text-muted fst-italic">Aucun avis pour le moment.</p>`;
        }

        return reviews.map(review => {
          const author = typeof review.user === "string" ? review.user.trim() : "Utilisateur anonyme";
          const rating = typeof review.rating === "number" ? review.rating : 0;
          const comment = typeof review.comment === "string" ? review.comment.trim() : "(Pas de commentaire)";

          return `
            <div class="review-card p-3 mb-3 fade-in">
              <div class="d-flex justify-content-between align-items-center mb-2">
                <strong>${author}</strong>
                <div>${renderStars(rating)}</div>
              </div>
              <p>${comment}</p>
            </div>
          `;
        }).join('');
      };

      const featuresHTML = product.features?.length
        ? `<h5>Caractéristiques</h5>
           <ul class="list-group mb-3">
             ${product.features.map(f => `<li class="list-group-item">${f}</li>`).join('')}
           </ul>`
        : '';

      const specificationsHTML = product.specifications && Object.keys(product.specifications).length
        ? `<h5>Spécifications</h5>
           <ul class="list-group mb-3">
             ${Object.entries(product.specifications).map(([key, value]) =>
               `<li class="list-group-item"><strong>${key}:</strong> ${value}</li>`).join('')}
           </ul>`
        : '';

      const stockStatus = product.stock > 0
        ? `<span class="stock-status stock-in">En stock (${product.stock} disponibles)</span>`
        : `<span class="stock-status stock-out">Rupture de stock</span>`;

      productSection.innerHTML = `
        <div class="col-md-6 d-flex justify-content-center align-items-center">
          <img src="${product.images[0]}" class="img-fluid product-img shadow-lg" alt="${product.name}" />
        </div>
        <div class="col-md-6">
          <h2 class="mb-2">${product.name}</h2>
          <p class="text-muted text-capitalize">${product.category}</p>
          <h4 class="text-success fw-bold mb-3">${product.price.toFixed(2)} €</h4>
          <p>${product.description}</p>

          ${featuresHTML}
          ${specificationsHTML}

          <div class="mb-3">
            <strong>Note:</strong>
            <span id="rating-stars">${renderStars(product.rating)}</span>
            <span class="ms-2">(${product.rating.toFixed(1)})</span>
          </div>

          <div class="mb-3">${stockStatus}</div>

          <a href="${product.whatsapp}" target="_blank" class="btn btn-success mb-4">
            <i class="bi bi-whatsapp"></i> Commander via WhatsApp
          </a>

          <h5>Avis des clients</h5>
          <div id="reviews-container" class="mb-3" style="max-height: 250px; overflow-y: auto;">
            ${renderReviews(product.reviews)}
          </div>
        </div>
      `;

      whatsappLink.href = product.whatsapp;
      whatsappLink.style.display = 'inline-block';

      const stars = document.querySelectorAll("#rating-stars .star");
      stars.forEach((star, i) => {
        setTimeout(() => star.classList.add('animate'), i * 150);
      });
    })
    .catch(error => {
      console.error("Erreur lors du chargement du produit:", error);
      productSection.innerHTML = `<p class="text-danger">Erreur de chargement du produit.</p>`;
    });

  // 🎨 Mode sombre / clair
  const toggleBtn = document.getElementById('toggleThemeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlTag = document.documentElement;

  const applyTheme = (theme) => {
    htmlTag.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);
    themeIcon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
  };

  const savedTheme = localStorage.getItem('theme') || 'light';
  applyTheme(savedTheme);

  toggleBtn.addEventListener('click', () => {
    const newTheme = htmlTag.getAttribute('data-bs-theme') === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
  });
});


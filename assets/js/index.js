fetch("includes/header_index.html")
  .then(response => response.text())
  .then(data => {
    document.getElementById('header-placeholder').innerHTML = data;
  });

fetch("assets/data/maj.json")
  .then(response => response.json())
  .then(data => {
    // Trie par date décroissante
    data.sort((a, b) => new Date(b.date) - new Date(a.date));

    // ✅ Ne garder que les 6 plus récents
    const recentCookies = data.slice(0, 22);

    const container = document.querySelector(".cartes-cookies");
    recentCookies.forEach(cookie => {
      const link = document.createElement("a");
      link.href = "pages/" + cookie.link;
      link.className = "carte-cookie-wrapper";

      const img = document.createElement("img");
      img.src = "assets/images/" + cookie.image;
      img.alt = cookie.name;
      img.className = "carte-cookie";

      link.appendChild(img);

      // Afficher l'icône NEW ou UP selon le type et la date
      const cookieDate = new Date(cookie.date);
      const today = new Date();
      const daysDifference = Math.floor((today - cookieDate) / (1000 * 60 * 60 * 24));

      if (daysDifference <= 30 && cookie.type) {
        const icon = document.createElement("img");
        if (cookie.type === "new") {
          icon.src = "assets/images/icones/icon_new.webp";
          icon.alt = "New";
        } else if (cookie.type === "update") {
          icon.src = "assets/images/icones/icon_up.webp";
          icon.alt = "Update";
        }
        icon.className = "icon-new";
        link.appendChild(icon);
      }

      container.appendChild(link);
    });
  });

// Animation de bouton pressé avec délai avant navigation
const buttons = document.querySelectorAll('.btn');

buttons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Si c'est un lien (pas juste un bouton)
    if (this.tagName === 'A' && this.href) {
      e.preventDefault(); // Empêcher la navigation immédiate
      const href = this.href;
      
      // Laisser le temps à l'animation de se jouer (150ms de descente)
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    }
  });
});

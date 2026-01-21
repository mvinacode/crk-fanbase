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

      // Afficher l'icône NEW uniquement si la date est dans les 30 derniers jours
      const cookieDate = new Date(cookie.date);
      const today = new Date();
      const daysDifference = Math.floor((today - cookieDate) / (1000 * 60 * 60 * 24));

      if (daysDifference <= 20) {
        const iconNew = document.createElement("img");
        iconNew.src = "assets/images/icones/icon_new.webp";
        iconNew.alt = "New";
        iconNew.className = "icon-new";
        link.appendChild(iconNew);
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

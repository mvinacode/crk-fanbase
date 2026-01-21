document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.querySelector('.btn-cookie-precedent');
  const nextBtn = document.querySelector('.btn-cookie-suivant');
  
  const log = (...args) => console.log('%c[Éveil LysBlanc]', 'color:#5eead4;font-weight:bold;', ...args);

  // Fonction qui résout le lien vers la bonne version (éveillé ou non)
  const resolveAwakenedLink = (href) => {
    if (!href) return href;
    
    // Vérifie si le lien concerne Cookie Lys Blanc
    const isLysBlanc = /cookie[_-]lys[_-]blanc(_eveil)?\.html$/i.test(href);
    if (!isLysBlanc) return href;

    // Vérifie si l'éveil est obtenu (les deux variantes possibles)
    const owned = localStorage.getItem('cookie-awakened-owned:cookie-lys-blanc') === '1'
               || localStorage.getItem('cookie-awakened-owned:cookie_lys_blanc') === '1';

    // Extrait le dossier du chemin
    const folder = href.includes('/') ? href.substring(0, href.lastIndexOf('/') + 1) : '';
    
    // Détermine la page cible
    const target = owned ? 'cookie_lys_blanc_eveil.html' : 'cookie_lys_blanc.html';
    const newHref = folder + target;

    log(`🔗 ${href} → ${newHref} (${owned ? 'éveillé' : 'non éveillé'})`);
    return newHref;
  };

  // Traite les deux boutons (précédent et suivant)
  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    
    const href = btn.getAttribute('href');
    if (!href) return;

    // Mise à jour initiale du href au chargement
    const newHref = resolveAwakenedLink(href);
    if (newHref !== href) {
      btn.setAttribute('href', newHref);
    }

    // Gestion du clic pour vérifier à nouveau l'état
    btn.addEventListener('click', (e) => {
      const current = btn.getAttribute('href');
      const resolved = resolveAwakenedLink(current);
      
      if (current !== resolved) {
        e.preventDefault();
        log(`🚀 Redirection corrigée au clic : ${resolved}`);
        location.href = resolved;
      }
    });
  });

  // Affichage de l'état actuel dans la console pour debug
  log('🧠 État actuel du localStorage :');
  log('cookie-awakened-owned:cookie-lys-blanc =', localStorage.getItem('cookie-awakened-owned:cookie-lys-blanc'));
  log('cookie-awakened-owned:cookie_lys_blanc =', localStorage.getItem('cookie-awakened-owned:cookie_lys_blanc'));
});

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.querySelector('.btn-cookie-precedent');
  const nextBtn = document.querySelector('.btn-cookie-suivant');
  
  const log = (...args) => console.log('%c[Éveil VanillePure]', 'color:#5eead4;font-weight:bold;', ...args);

  // Fonction qui résout le lien vers la bonne version (éveillé ou non)
  const resolveAwakenedLink = (href) => {
    if (!href) return href;
    
    // Vérifie si le lien concerne Cookie Lys Blanc
    const isVanillePure = /cookie[_-]vanille[_-]pure(_eveil)?\.html$/i.test(href);
    if (!isVanillePure) return href;

    // Vérifie si l'éveil est obtenu (les deux variantes possibles)
    const owned = localStorage.getItem('cookie-awakened-owned:cookie-vanille-pure') === '1'
               || localStorage.getItem('cookie-awakened-owned:cookie_vanille_pure') === '1';

    // Extrait le dossier du chemin
    const folder = href.includes('/') ? href.substring(0, href.lastIndexOf('/') + 1) : '';
    
    // Détermine la page cible
    const target = owned ? 'cookie_vanille_pure_eveil.html' : 'cookie_vanille_pure.html';
    const newHref = folder + target;

    log(`🔗 ${href} → ${newHref} (${owned ? 'éveillé' : 'non éveillé'})`);
    return newHref;
  };

  // Traite les deux boutons (précédent et suivant)
  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    
    const href = btn.getAttribute('href');
    if (!href) return;

    // Mise à jour initiale du href au chargement
    const newHref = resolveAwakenedLink(href);
    if (newHref !== href) {
      btn.setAttribute('href', newHref);
    }

    // Gestion du clic pour vérifier à nouveau l'état
    btn.addEventListener('click', (e) => {
      const current = btn.getAttribute('href');
      const resolved = resolveAwakenedLink(current);
      
      if (current !== resolved) {
        e.preventDefault();
        log(`🚀 Redirection corrigée au clic : ${resolved}`);
        location.href = resolved;
      }
    });
  });

  // Affichage de l'état actuel dans la console pour debug
  log('🧠 État actuel du localStorage :');
  log('cookie-awakened-owned:cookie-vanille-pure =', localStorage.getItem('cookie-awakened-owned:cookie-vanille-pure'));
  log('cookie-awakened-owned:cookie_vanille_pure =', localStorage.getItem('cookie-awakened-owned:cookie_vanille_pure'));
});

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.querySelector('.btn-cookie-precedent');
  const nextBtn = document.querySelector('.btn-cookie-suivant');
  
  const log = (...args) => console.log('%c[Éveil BaieHoux]', 'color:#5eead4;font-weight:bold;', ...args);

  // Fonction qui résout le lien vers la bonne version (éveillé ou non)
  const resolveAwakenedLink = (href) => {
    if (!href) return href;
    
    // Vérifie si le lien concerne Cookie Lys Blanc
    const isBaieHoux = /cookie[_-]baie[_-]de[_-]houx(_eveil)?\.html$/i.test(href);
    if (!isBaieHoux) return href;

    // Vérifie si l'éveil est obtenu (les deux variantes possibles)
    const owned = localStorage.getItem('cookie-awakened-owned:cookie-baie-de-houx') === '1'
               || localStorage.getItem('cookie-awakened-owned:cookie_baie_de_houx') === '1';

    // Extrait le dossier du chemin
    const folder = href.includes('/') ? href.substring(0, href.lastIndexOf('/') + 1) : '';
    
    // Détermine la page cible
    const target = owned ? 'cookie_baie_de_houx_eveil.html' : 'cookie_baie_de_houx.html';
    const newHref = folder + target;

    log(`🔗 ${href} → ${newHref} (${owned ? 'éveillé' : 'non éveillé'})`);
    return newHref;
  };

  // Traite les deux boutons (précédent et suivant)
  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    
    const href = btn.getAttribute('href');
    if (!href) return;

    // Mise à jour initiale du href au chargement
    const newHref = resolveAwakenedLink(href);
    if (newHref !== href) {
      btn.setAttribute('href', newHref);
    }

    // Gestion du clic pour vérifier à nouveau l'état
    btn.addEventListener('click', (e) => {
      const current = btn.getAttribute('href');
      const resolved = resolveAwakenedLink(current);
      
      if (current !== resolved) {
        e.preventDefault();
        log(`🚀 Redirection corrigée au clic : ${resolved}`);
        location.href = resolved;
      }
    });
  });

  // Affichage de l'état actuel dans la console pour debug
  log('🧠 État actuel du localStorage :');
  log('cookie-awakened-owned:cookie-baie-de-houx =', localStorage.getItem('cookie-awakened-owned:cookie-baie-de-houx'));
  log('cookie-awakened-owned:cookie_baie_de_houx =', localStorage.getItem('cookie-awakened-owned:cookie_baie_de_houx'));
});

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.querySelector('.btn-cookie-precedent');
  const nextBtn = document.querySelector('.btn-cookie-suivant');
  
  const log = (...args) => console.log('%c[Éveil CacaoNoir]', 'color:#5eead4;font-weight:bold;', ...args);

  // Fonction qui résout le lien vers la bonne version (éveillé ou non)
  const resolveAwakenedLink = (href) => {
    if (!href) return href;
    
    // Vérifie si le lien concerne Cookie Lys Blanc
    const isCacaoNoir = /cookie[_-]cacao[_-]noir(_eveil)?\.html$/i.test(href);
    if (!isCacaoNoir) return href;

    // Vérifie si l'éveil est obtenu (les deux variantes possibles)
    const owned = localStorage.getItem('cookie-awakened-owned:cookie-cacao-noir') === '1'
               || localStorage.getItem('cookie-awakened-owned:cookie_cacao_noir') === '1';

    // Extrait le dossier du chemin
    const folder = href.includes('/') ? href.substring(0, href.lastIndexOf('/') + 1) : '';
    
    // Détermine la page cible
    const target = owned ? 'cookie_cacao_noir_eveil.html' : 'cookie_cacao_noir.html';
    const newHref = folder + target;

    log(`🔗 ${href} → ${newHref} (${owned ? 'éveillé' : 'non éveillé'})`);
    return newHref;
  };

  // Traite les deux boutons (précédent et suivant)
  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    
    const href = btn.getAttribute('href');
    if (!href) return;

    // Mise à jour initiale du href au chargement
    const newHref = resolveAwakenedLink(href);
    if (newHref !== href) {
      btn.setAttribute('href', newHref);
    }

    // Gestion du clic pour vérifier à nouveau l'état
    btn.addEventListener('click', (e) => {
      const current = btn.getAttribute('href');
      const resolved = resolveAwakenedLink(current);
      
      if (current !== resolved) {
        e.preventDefault();
        log(`🚀 Redirection corrigée au clic : ${resolved}`);
        location.href = resolved;
      }
    });
  });

  // Affichage de l'état actuel dans la console pour debug
  log('🧠 État actuel du localStorage :');
  log('cookie-awakened-owned:cookie-cacao-noir =', localStorage.getItem('cookie-awakened-owned:cookie-cacao-noir'));
  log('cookie-awakened-owned:cookie_cacao_noir =', localStorage.getItem('cookie-awakened-owned:cookie_cacao_noir'));
});

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.querySelector('.btn-cookie-precedent');
  const nextBtn = document.querySelector('.btn-cookie-suivant');
  
  const log = (...args) => console.log('%c[Éveil FromageDore]', 'color:#5eead4;font-weight:bold;', ...args);

  // Fonction qui résout le lien vers la bonne version (éveillé ou non)
  const resolveAwakenedLink = (href) => {
    if (!href) return href;
    
    // Vérifie si le lien concerne Cookie Lys Blanc
    const isFromageDore = /cookie[_-]fromage[_-]dore(_eveil)?\.html$/i.test(href);
    if (!isFromageDore) return href;

    // Vérifie si l'éveil est obtenu (les deux variantes possibles)
    const owned = localStorage.getItem('cookie-awakened-owned:cookie-fromage-dore') === '1'
               || localStorage.getItem('cookie-awakened-owned:cookie_fromage_dore') === '1';

    // Extrait le dossier du chemin
    const folder = href.includes('/') ? href.substring(0, href.lastIndexOf('/') + 1) : '';
    
    // Détermine la page cible
    const target = owned ? 'cookie_fromage_dore_eveil.html' : 'cookie_fromage_dore.html';
    const newHref = folder + target;

    log(`🔗 ${href} → ${newHref} (${owned ? 'éveillé' : 'non éveillé'})`);
    return newHref;
  };

  // Traite les deux boutons (précédent et suivant)
  [prevBtn, nextBtn].forEach(btn => {
    if (!btn) return;
    
    const href = btn.getAttribute('href');
    if (!href) return;

    // Mise à jour initiale du href au chargement
    const newHref = resolveAwakenedLink(href);
    if (newHref !== href) {
      btn.setAttribute('href', newHref);
    }

    // Gestion du clic pour vérifier à nouveau l'état
    btn.addEventListener('click', (e) => {
      const current = btn.getAttribute('href');
      const resolved = resolveAwakenedLink(current);
      
      if (current !== resolved) {
        e.preventDefault();
        log(`🚀 Redirection corrigée au clic : ${resolved}`);
        location.href = resolved;
      }
    });
  });

  // Affichage de l'état actuel dans la console pour debug
  log('🧠 État actuel du localStorage :');
  log('cookie-awakened-owned:cookie-fromage-dore =', localStorage.getItem('cookie-awakened-owned:cookie-fromage-dore'));
  log('cookie-awakened-owned:cookie_fromage_dore =', localStorage.getItem('cookie-awakened-owned:cookie_fromage_dore'));
});

// Animation de bouton pressé avec délai avant navigation pour les boutons cookies
const cookieButtons = document.querySelectorAll('.btn-cookie-precedent, .btn-cookie-suivant');

cookieButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Si c'est un lien (pas juste un bouton) et qu'il n'y a pas déjà une gestion personnalisée
    if (this.tagName === 'A' && this.href && !e.defaultPrevented) {
      e.preventDefault(); // Empêcher la navigation immédiate
      const href = this.href;
      
      // Laisser le temps à l'animation de se jouer (150ms de descente)
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    }
  });
});
// Animation pour les boutons costumes
document.querySelectorAll('.btn-costume').forEach(button => {
  button.addEventListener('click', function(e) {
    if (this.tagName === 'A' && this.href && !e.defaultPrevented) {
      e.preventDefault();
      const href = this.href;
      
      setTimeout(() => {
        window.location.href = href;
      }, 150);
    }
  });
});
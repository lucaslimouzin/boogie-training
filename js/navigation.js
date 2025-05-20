// Fonction pour générer le HTML de la navigation
const createNavigation = (currentPage) => {
    const nav = document.createElement('nav');
    
    const links = [
        { href: 'index.html', text: 'En cours' },
        { href: 'motivation.html', text: 'Motivation' },
        { href: 'videotheque.html', text: 'Vidéothèque' }
    ];

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = link.text;
        if (link.href === currentPage) {
            a.classList.add('active');
        }
        nav.appendChild(a);
    });

    return nav;
};

// Fonction pour initialiser la navigation
const initializeNavigation = () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Créer le header
    const header = document.createElement('header');
    const container = document.createElement('div');
    container.className = 'container';
    
    // Ajouter le titre
    const h1 = document.createElement('h1');
    h1.textContent = 'Boogie Training';
    
    // Créer le bouton du menu mobile
    const menuToggle = document.createElement('button');
    menuToggle.className = 'menu-toggle';
    menuToggle.setAttribute('aria-label', 'Menu');
    menuToggle.innerHTML = '<span></span>';
    
    // Ajouter la navigation
    const nav = createNavigation(currentPage);
    
    // Assembler les éléments
    container.appendChild(h1);
    container.appendChild(menuToggle);
    container.appendChild(nav);
    header.appendChild(container);
    
    // Insérer le header au début du body
    document.body.insertBefore(header, document.body.firstChild);
    
    // Gérer le menu mobile
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Fermer le menu quand on clique en dehors
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
        }
    });
};

export { initializeNavigation }; 
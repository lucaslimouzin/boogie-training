class FloatingEmoji {
    constructor(type) {
        this.element = document.createElement('div');
        this.element.className = 'floating-emoji';
        this.element.textContent = type === 'potato' ? '🥔' : type === 'tomato' ? '🍅' : '❤️';
        this.element.style.position = 'fixed';
        this.element.style.cursor = 'pointer';
        this.element.style.fontSize = '2rem';
        this.element.style.zIndex = '9999';
        this.element.style.userSelect = 'none';
        
        // Animation initiale
        this.element.style.animation = `
            floatAnimation ${2 + Math.random() * 2}s ease-in-out infinite,
            twinkle ${1 + Math.random()}s ease-in-out infinite
        `;
        
        // Positionnement aléatoire initial
        this.moveToRandomPosition();
        
        // Gestionnaire d'événements
        this.element.addEventListener('click', () => this.onEmojiClick());
        
        // Ajouter au DOM
        document.body.appendChild(this.element);
    }
    
    moveToRandomPosition() {
        const maxX = window.innerWidth - 50;
        const maxY = window.innerHeight - 50;
        
        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;
        
        this.element.style.transition = 'none';
        this.element.style.opacity = '0';
        
        // Positionnement
        this.element.style.left = `${newX}px`;
        this.element.style.top = `${newY}px`;
        
        // Forcer le reflow
        this.element.offsetHeight;
        
        // Animation d'apparition
        this.element.style.transition = 'all 0.5s ease-in-out';
        this.element.style.opacity = '1';
    }
    
    onEmojiClick() {
        // Toujours déclencher l'effet spécial (100% au lieu de 10%)
        this.triggerSpecialEffect();
    }

    triggerSpecialEffect() {
        // Calculer le nombre de lignes et colonnes nécessaires pour remplir l'écran
        const size = 30; // Taille de chaque emoji
        const rows = Math.ceil(window.innerHeight / size);
        const cols = Math.ceil(window.innerWidth / size);
        const emojis = [];

        // Créer la grille
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const emoji = document.createElement('div');
                emoji.className = 'special-emoji';
                emoji.textContent = this.element.textContent;
                emoji.style.position = 'fixed';
                emoji.style.left = `${j * size}px`;
                emoji.style.top = `${i * size}px`;
                emoji.style.fontSize = '1.5rem';
                emoji.style.transition = 'all 0.5s ease-in-out';
                emoji.style.opacity = '0';
                emoji.style.transform = 'translateY(-50px) scale(0)';
                emoji.style.zIndex = '9999';
                // Délai d'apparition basé sur la ligne (de haut en bas)
                emoji.style.animationDelay = `${i * 0.1}s`;
                document.body.appendChild(emoji);
                emojis.push({ element: emoji, row: i });
            }
        }

        // Faire apparaître les emojis ligne par ligne
        requestAnimationFrame(() => {
            emojis.forEach((emoji, index) => {
                const row = Math.floor(index / cols);
                setTimeout(() => {
                    emoji.element.style.opacity = '1';
                    emoji.element.style.transform = 'translateY(0) scale(1)';
                }, row * 50); // Plus rapide pour un meilleur effet
            });
        });

        // Faire disparaître les emojis de haut en bas avec un effet de "vidage"
        setTimeout(() => {
            emojis.forEach((emoji, index) => {
                const row = Math.floor(index / cols);
                setTimeout(() => {
                    emoji.element.style.opacity = '0';
                    emoji.element.style.transform = 'translateY(100vh) scale(0.5)';
                    setTimeout(() => emoji.element.remove(), 1000);
                }, row * 50); // Plus rapide pour un meilleur effet
            });
        }, 2000);
    }
}

// Initialisation
export function initFloatingEmojis(count = { potato: 3, tomato: 3, heart: 3 }) {
    // Ajouter les styles nécessaires
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatAnimation {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
        }
        
        @keyframes twinkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        
        .floating-emoji {
            transition: all 0.3s ease-in-out;
        }
        
        .floating-emoji:hover {
            transform: scale(1.2) rotate(15deg);
            filter: brightness(1.2);
        }

        .special-emoji {
            position: fixed;
            z-index: 9999;
            user-select: none;
            animation: floatAnimation 2s ease-in-out infinite;
        }
    `;
    document.head.appendChild(style);
    
    // Créer les emojis flottants
    const emojis = [];
    
    // Créer les pommes de terre
    for (let i = 0; i < count.potato; i++) {
        emojis.push(new FloatingEmoji('potato'));
    }
    
    // Créer les tomates
    for (let i = 0; i < count.tomato; i++) {
        emojis.push(new FloatingEmoji('tomato'));
    }
    
    // Créer les cœurs
    for (let i = 0; i < count.heart; i++) {
        emojis.push(new FloatingEmoji('heart'));
    }
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        emojis.forEach(emoji => emoji.moveToRandomPosition());
    });
    
    return emojis;
} 
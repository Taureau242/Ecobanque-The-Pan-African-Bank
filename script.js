/* ============================================================
   ECOBANK – SCRIPT.JS (VERSION NETTOYÉE ET OPTIMISÉE)
   ============================================================ */

// Attendre que le HTML soit chargé
document.addEventListener('DOMContentLoaded', () => {

    /* --- Ici on gère les menus déroulants pour les langues et la connexion --- */
    const langBtn = document.getElementById("btn-langue");
    const langMenu = document.getElementById("menu-langue");
    const dropdown = document.querySelector(".dropdown");
    const loginBtn = document.querySelector(".header-action");

    // Menu Langue
    if (langBtn && langMenu) {
        langBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            langMenu.classList.toggle("hidden");
        });
    }

    // Menu Connexion (Dropdown)
    if (loginBtn && dropdown) {
        loginBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            dropdown.classList.toggle("active");
        });
    }

    // Fermeture automatique au clic à l'extérieur
    window.addEventListener("click", () => {
        if (langMenu) langMenu.classList.add("hidden");
        if (dropdown) dropdown.classList.remove("active");
    });

    /* --- Ici on fait des animations quand on scroll --- */
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        scrollObserver.observe(el);
    });

    /* --- Ici on anime les chiffres qui comptent --- */
    function animateCounter(el, target, suffix = '') {
        if (!el) return;
        let current = 0;
        const duration = 2000; // 2 secondes
        const stepTime = 25;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                el.textContent = target + suffix;
                clearInterval(timer);
            } else {
                el.textContent = Math.floor(current) + suffix;
            }
        }, stepTime);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(document.getElementById('cnt1'), 33);
                animateCounter(document.getElementById('cnt2'), 600, '+');
                animateCounter(document.getElementById('cnt3'), 29, 'M+');
                statsObserver.disconnect();
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.group-hero');
    if (statsSection) statsObserver.observe(statsSection);

    /* --- Ici on ajuste les grilles pour les petits écrans --- */
    function adjustGrids() {
        const width = window.innerWidth;
        
        // Hero Grid
        const heroGrid = document.getElementById('hero-grid');
        if (heroGrid) heroGrid.style.gridTemplateColumns = width < 768 ? '1fr' : '1fr 1fr';

        // Invest Grid
        const investGrid = document.getElementById('invest-grid');
        if (investGrid) {
            investGrid.style.gridTemplateColumns = width < 640 ? '1fr' : width < 900 ? '1fr 1fr' : 'repeat(3,1fr)';
        }

        // Form Cols
        const formCols = document.querySelectorAll('.form-two-cols');
        formCols.forEach(col => {
            col.style.gridTemplateColumns = width < 600 ? '1fr' : '1fr 1fr';
        });
    }

    window.addEventListener('resize', adjustGrids);
    adjustGrids(); // Appel initial

});
document.addEventListener('DOMContentLoaded', () => {

    /* --- Ici on gère les menus pour la langue et la connexion --- */
    // On cible tous les boutons qui doivent ouvrir un menu
    const menuButtons = document.querySelectorAll('.btn-langue, .header-action, #btn-langue');

    menuButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // On trouve le container parent le plus proche
            const container = button.closest('.lang-selector, .dropdown, .header-item');
            // On cherche le menu à l'intérieur de CE container uniquement
            const targetMenu = container.querySelector('.menu-langue, .dropdown-content, #menu-langue');

            // Fermer tous les autres menus ouverts pour éviter les bugs
            document.querySelectorAll('.menu-langue, .dropdown-content, #menu-langue').forEach(m => {
                if (m !== targetMenu) m.classList.add('hidden');
            });

            // On affiche ou cache le menu ciblé
            if (targetMenu) {
                targetMenu.classList.toggle('hidden');
            }
        });
    });

    // Fermer les menus si on clique ailleurs sur la page
    window.addEventListener('click', () => {
        document.querySelectorAll('.menu-langue, .dropdown-content, #menu-langue').forEach(m => {
            m.classList.add('hidden');
        });
    });

    /* --- Ici on gère le slider qui défile --- */
    let slideIndex = 0;
    const slides = document.querySelectorAll('.slide');

    function showNextSlide() {
        if (slides.length > 1) {
            slides[slideIndex].classList.remove('active');
            slideIndex = (slideIndex + 1) % slides.length;
            slides[slideIndex].classList.add('active');
        }
    }

    if (slides.length > 0) {
        setInterval(showNextSlide, 5000); // Change toutes les 5 secondes
    }

    /* --- Ici on fait des animations quand on scroll --- */
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});
/* --- Fonctions pour les boutons HTML --- */
function togglePays(id) {
    const menu = document.getElementById(id);
    if (menu) menu.classList.toggle("hidden");
}

function togglePassword() {
    const pwd = document.getElementById('password');
    const icon = document.getElementById('eyeIcon');
    if (pwd && pwd.type === 'password') {
        pwd.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else if (pwd) {
        pwd.type = 'password';
        icon.className = 'fas fa-eye';
    }
}
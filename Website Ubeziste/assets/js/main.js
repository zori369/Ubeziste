document.addEventListener("DOMContentLoaded", () => {
    const languageSwitcher = document.getElementById("languageSwitcher");
    const languageSwitcherMobile = document.getElementById("languageSwitcherMobile");
    let currentLanguage = localStorage.getItem("lang") || "en";
    let translations = {}; // globally available

    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Toggle menu open/close
    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('show');
    });

    // Function to apply translations to elements
    function applyTranslations(container = document) {
        const elements = container.querySelectorAll("[data-translate]");
        elements.forEach(el => {
            const key = el.getAttribute("data-translate");
            if (translations[currentLanguage] && translations[currentLanguage][key]) {
                el.innerHTML = translations[currentLanguage][key]; // allows <br>
            }
        });
    }

    // Function to load translations
    function loadLanguage(lang) {
        return fetch("assets/js/translations.json")
            .then(response => response.json())
            .then(data => {
                translations = data;
                applyTranslations(); // Apply to static layout
            })
            .catch(error => console.error("Failed to load translations:", error));
    }

    // Function to load page content dynamically
    function loadPage(page) {
        fetch(`pages/${page}.html`)
            .then(res => {
                if (!res.ok) throw new Error("Page not found");
                return res.text();
            })
            .then(html => {
                const container = document.getElementById("main-content");
                if (container) {
                    container.innerHTML = html;

                    // Apply translations to dynamically loaded content
                    applyTranslations(container);

                    history.pushState(null, "", `#${page}`);
                }
            })
            .catch(err => {
                const container = document.getElementById("main-content");
                if (container) {
                    container.innerHTML = "<p>Page not found.</p>";
                }
                console.error(err);
            });
    }

    // Sync both switchers
    function updateLanguageButtons() {
        const nextLang = currentLanguage === "en" ? "BG" : "EN";
        if (languageSwitcher) languageSwitcher.textContent = nextLang;
        if (languageSwitcherMobile) languageSwitcherMobile.textContent = nextLang;
    }

    // Handle language toggle
    function toggleLanguage() {
        currentLanguage = currentLanguage === "en" ? "bg" : "en";
        localStorage.setItem("lang", currentLanguage);
        updateLanguageButtons();
        loadLanguage(currentLanguage).then(() => {
            const container = document.getElementById("main-content");
            applyTranslations(container);
        });
    }

    // Set initial language switcher text
    updateLanguageButtons();

    // Event listeners for both language switchers
    if (languageSwitcher) {
        languageSwitcher.addEventListener("click", toggleLanguage);
    }
    if (languageSwitcherMobile) {
        languageSwitcherMobile.addEventListener("click", toggleLanguage);
    }

    // Load translation file first, then the initial page
    loadLanguage(currentLanguage).then(() => {
        const initialPage = location.hash.slice(1) || "home";
        loadPage(initialPage);
    });

    // Listen to hash change for page routing
    window.addEventListener("hashchange", () => {
        const page = location.hash.slice(1);
        loadPage(page);
    });
});

const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const menuToggle = document.getElementById("menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");
const THEME_KEY = "blademirPortfolioTheme";

function renderThemeIcon(isDark) {
    if (!themeIcon) return;

    themeIcon.innerHTML = isDark
        ? `
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        `
        : `
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        `;

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.setAttribute(
        "title",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

function setTheme(isDark) {
    document.body.classList.toggle("dark-mode", isDark);

    try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (error) {
        console.warn("Unable to save theme preference.", error);
    }

    renderThemeIcon(isDark);
}

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const isDark = document.body.classList.contains("dark-mode");
        setTheme(!isDark);
    });
}

function setMenu(open) {
    if (!menuToggle || !primaryNavigation) return;

    primaryNavigation.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
    );
    menuToggle.setAttribute(
        "title",
        open ? "Close navigation menu" : "Open navigation menu"
    );
}

if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        setMenu(!isOpen);
    });

    primaryNavigation.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setMenu(false));
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            setMenu(false);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            setMenu(false);
        }
    });
}

let savedTheme = null;

try {
    savedTheme = localStorage.getItem(THEME_KEY);
} catch (error) {
    savedTheme = null;
}

setTheme(savedTheme === "dark");

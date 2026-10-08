const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const menuToggle = document.getElementById("menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");
const THEME_KEY = "blademirPortfolioTheme";

function renderThemeIcon(isDark) {
    if (!themeIcon || !themeToggle) return;

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
    document.documentElement.toggleAttribute("data-theme", isDark);

    try {
        localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    } catch (error) {
        console.warn("Unable to save theme preference.", error);
    }

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) {
        themeColor.setAttribute("content", isDark ? "#0e130f" : "#90b27c");
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
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

            if (isOpen) {
                setMenu(false);
                menuToggle.focus();
            }
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


/* Auto-hide the main navigation while scrolling down. */
const siteNav = document.querySelector(".site-nav");

if (siteNav) {
    let lastScrollY = window.scrollY;
    let scrollTicking = false;
    const scrollThreshold = 8;
    const revealAt = 80;

    function updateNavigationVisibility() {
        const currentScrollY = window.scrollY;

        if (currentScrollY <= revealAt) {
            siteNav.classList.remove("header-hidden");
        } else if (Math.abs(currentScrollY - lastScrollY) >= scrollThreshold) {
            if (currentScrollY > lastScrollY) {
                siteNav.classList.add("header-hidden");
                if (primaryNavigation) setMenu(false);
            } else {
                siteNav.classList.remove("header-hidden");
            }

            lastScrollY = currentScrollY;
        }

        scrollTicking = false;
    }

    window.addEventListener("scroll", () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(updateNavigationVisibility);
            scrollTicking = true;
        }
    }, { passive: true });
}

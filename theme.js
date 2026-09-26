// =========================
// STATHUT GLOBAL THEME
// =========================

(() => {

    const STORAGE_KEY = "stathut-theme";

    const root = document.documentElement;

    function getSavedTheme() {

        const savedTheme =
            localStorage.getItem(STORAGE_KEY);

        if (
            savedTheme === "light" ||
            savedTheme === "dark"
        ) {
            return savedTheme;
        }

        return null;
    }

    function getPreferredTheme() {

        const savedTheme = getSavedTheme();

        if (savedTheme) {
            return savedTheme;
        }

        // StatHut now defaults to the dark "esports" theme
        // for every visitor unless they explicitly switch to
        // light mode via the toggle (which is then remembered).
        return "dark";
    }

    function applyTheme(theme) {

        root.setAttribute(
            "data-theme",
            theme
        );

        document
            .querySelectorAll(
                "[data-stathut-theme-toggle]"
            )
            .forEach(button => {

                const icon =
                    button.querySelector(
                        "[data-stathut-theme-icon]"
                    );

                if (icon) {
                    icon.textContent =
                        theme === "dark"
                            ? "☀️"
                            : "🌙";
                }

                button.setAttribute(
                    "aria-label",
                    theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                );

                button.setAttribute(
                    "title",
                    theme === "dark"
                        ? "Switch to light mode"
                        : "Switch to dark mode"
                );

            });
    }

    function toggleTheme() {

        const currentTheme =
            root.getAttribute("data-theme");

        const nextTheme =
            currentTheme === "dark"
                ? "light"
                : "dark";

        localStorage.setItem(
            STORAGE_KEY,
            nextTheme
        );

        applyTheme(nextTheme);
    }

    function initializeTheme() {

        applyTheme(
            getPreferredTheme()
        );

        document
            .querySelectorAll(
                "[data-stathut-theme-toggle]"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    toggleTheme
                );

            });
    }

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializeTheme
        );

    } else {

        initializeTheme();

    }

})();

const themeToggle = document.querySelector(".theme-toggle");

if (themeToggle) {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
  }

  function updateThemeButton() {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
      themeToggle.textContent = "☀️ Light Mode";
      themeToggle.setAttribute("aria-label", "Switch to light mode");
      themeToggle.setAttribute("aria-pressed", "true");
    } else {
      themeToggle.textContent = "🌙 Dark Mode";
      themeToggle.setAttribute("aria-label", "Switch to dark mode");
      themeToggle.setAttribute("aria-pressed", "false");
    }
  }

  updateThemeButton();

  themeToggle.addEventListener("click", function () {
    const currentTheme =
      document.documentElement.getAttribute("data-theme");

    if (currentTheme === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }

    updateThemeButton();
  });
}

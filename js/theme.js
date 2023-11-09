document.addEventListener('DOMContentLoaded', () => {

  const applyTheme = (theme) => {
    // Add or remove theme attribute to html element
    if (theme) {
      document.documentElement.dataset.theme = theme;
    } else {
      delete document.documentElement.dataset.theme;
    }
    // Make <picture> <source> elements with media="(prefers-color-scheme:)" respect theme preference
    const pictures = document.querySelectorAll('picture');
    pictures.forEach((picture) => {
      const sources = picture.querySelectorAll(`
        source[media*="prefers-color-scheme"], 
        source[data-media*="prefers-color-scheme"]
      `);
      sources.forEach((source) => {
        if (source?.media.includes('prefers-color-scheme')) {
          source.dataset.media = source.media;
        }
        if (source?.dataset.media.includes(theme)) {
          source.media = 'all';
        } else if (source) {
          source.media = 'none';
        }
      })
    })
  };

  // Get MediaQueryList for dark mode
  const darkQuery = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  // Set handler to toggle theme
  const toggle = document.querySelector('.toggle-theme');
  if (toggle) {
    toggle.addEventListener('click', (event) => {
      const theme = (document.documentElement.dataset.theme == 'dark') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
    });
  }

  // Set handler for system preference changes
  if (darkQuery) {
    darkQuery.addEventListener('change', (event) => {
      const theme = event.matches ? 'dark' : null;
      localStorage.removeItem('theme');
      applyTheme(theme);
    });
  }

  // Check if the user has a system preference for dark mode
  let theme = (darkQuery && darkQuery.matches) ? 'dark' : null;
  // Check if the user has saved a theme preference, if so, override system preference
  theme = localStorage.getItem('theme') || theme;
  // Set initial theme
  applyTheme(theme);

});

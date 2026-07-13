/* Main page: hydrate hero, discography, and footer from data.json.
   Each album carries a 5-color palette applied inline as CSS variables:
   --c-bg, --c-panel, --c-heading, --c-text, --c-accent. */

const SOCIAL_ICONS = {
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  soundcloud: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M2.5 15.5v-3a.5.5 0 0 1 1 0v3a.5.5 0 0 1-1 0zm2 1v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 1-1 0zm2 1v-7a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0V9a.5.5 0 0 1 1 0v8.5a.5.5 0 0 1-1 0zm2 0V7a.5.5 0 0 1 1 0v10.5a.5.5 0 0 1-1 0zm2.5.5c-.28 0-.5-.22-.5-.5V6a.5.5 0 0 1 1 0v11.5c0 .28-.22.5-.5.5zm7-8c-.36 0-.71.05-1.04.15C18.35 6.36 15.86 4 12.9 4c-.4 0-.79.05-1.15.13-.2.05-.35.23-.35.44V17.5c0 .28.22.5.5.5H20a3.5 3.5 0 0 0 0-7z"/></svg>',
  spotify: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.36 14.42c-.19.3-.58.4-.88.22-2.4-1.47-5.42-1.8-8.98-.99-.34.08-.68-.14-.76-.48-.08-.34.14-.68.48-.76 3.88-.88 7.21-.5 9.9 1.14.3.19.4.58.22.88zm1.17-2.6c-.24.37-.73.49-1.1.25-2.74-1.68-6.92-2.17-10.16-1.19-.42.13-.86-.11-.98-.53-.13-.42.11-.86.53-.98 3.72-1.13 8.32-.58 11.47 1.35.37.24.49.73.25 1.1zm.1-2.71c-3.28-1.95-8.7-2.13-11.83-1.18-.5.15-1.03-.14-1.17-.64-.15-.5.14-1.03.64-1.17 3.6-1.09 9.58-.88 13.35 1.36.45.27.6.85.33 1.3-.27.45-.85.6-1.32.33z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.2 31.2 0 0 0 0 12a31.2 31.2 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.2 31.2 0 0 0 24 12a31.2 31.2 0 0 0-.5-5.8zM9.6 15.6V8.4l6.3 3.6-6.3 3.6z"/></svg>',
  bandcamp: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 5h14l-6 14H3l6-14z"/></svg>',
  twitter: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 3H22l-7.5 8.6L23 21h-6.9l-5.4-6.5L4.5 21H1.4l8-9.2L1 3h7l4.9 6L18.9 3zm-1.2 16.2h1.8L6.3 4.7H4.4l13.3 14.5z"/></svg>',
  apple: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.05 12.04c-.03-3.03 2.47-4.48 2.58-4.55-1.4-2.05-3.6-2.33-4.38-2.36-1.86-.19-3.64 1.1-4.59 1.1-.96 0-2.4-1.07-3.96-1.04-2.03.03-3.92 1.18-4.97 3-2.12 3.67-.54 9.09 1.52 12.07 1 1.46 2.19 3.1 3.76 3.04 1.51-.06 2.08-.98 3.9-.98 1.82 0 2.34.98 3.94.95 1.63-.03 2.66-1.48 3.65-2.95 1.15-1.68 1.62-3.34 1.65-3.42-.04-.02-3.17-1.22-3.2-4.85zm-3-8.9c.83-1 1.4-2.4 1.24-3.79-1.2.05-2.66.8-3.52 1.8-.77.88-1.44 2.3-1.26 3.66 1.34.1 2.71-.68 3.55-1.67z"/></svg>',
  generic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>',
  patreon: '<svg viewBox="0 0 512 512" fill="currentColor" aria-hidden="true"><path d="M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z"/></svg>',};

const CHEVRON = '<svg class="album__toggle-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"/></svg>';
const ARROW   = '<svg class="song-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>';
const DOWNLOAD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

function socialButton(s) {
  const icon = SOCIAL_ICONS[s.platform] || SOCIAL_ICONS.generic;
  const label = s.platform.charAt(0).toUpperCase() + s.platform.slice(1);
  return `<a class="social-btn" href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(label)}">${icon}</a>`;
}

function paletteToStyle(colors) {
  if (!colors) return "";
  return [
    colors.background ? `--c-bg:${colors.background}`      : "",
    colors.panel      ? `--c-panel:${colors.panel}`        : "",
    colors.heading    ? `--c-heading:${colors.heading}`    : "",
    colors.text       ? `--c-text:${colors.text}`          : "",
    colors.accent     ? `--c-accent:${colors.accent}`      : ""
  ].filter(Boolean).join(";");
}

function applyPaletteToRoot(colors) {
  if (!colors) return;
  const root = document.documentElement;
  if (colors.background) root.style.setProperty("--c-bg",      colors.background);
  if (colors.panel)      root.style.setProperty("--c-panel",   colors.panel);
  if (colors.heading)    root.style.setProperty("--c-heading", colors.heading);
  if (colors.text)       root.style.setProperty("--c-text",    colors.text);
  if (colors.accent)     root.style.setProperty("--c-accent",  colors.accent);

  const themeMeta = document.getElementById("themeColor");
  if (themeMeta && colors.background) themeMeta.setAttribute("content", colors.background);
}

function renderArtist(artist) {
  document.title = artist.name;
  applyPaletteToRoot(artist.colors);

  const hero = document.getElementById("hero");
  hero.style.backgroundImage = `url("${artist.heroImage}")`;

  // Italicize the last name-word for the editorial flourish
  const parts = artist.name.split(" ");
  const nameHtml = parts.length > 1
    ? `${esc(parts.slice(0, -1).join(" "))} <em>${esc(parts.at(-1))}</em>`
    : esc(artist.name);
  document.getElementById("artistName").innerHTML = nameHtml;

  const socials = (artist.socials || []).map(socialButton).join("");
  document.getElementById("socials").innerHTML = socials;
  document.getElementById("footerSocials").innerHTML = socials;
}

function renderAlbums(albums) {
  const container = document.getElementById("albumList");
  container.innerHTML = albums.map(album => {
    const style = paletteToStyle(album.colors);

    const songs = (album.songs || []).map((song, i) => `
      <li class="song-item">
        <a class="song-link" href="song.html?album=${encodeURIComponent(album.id)}&song=${encodeURIComponent(song.id)}">
          <span class="song-num">${String(i + 1).padStart(2, "0")}</span>
          <span class="song-name">${esc(song.name)}</span>
          ${ARROW}
        </a>
      </li>
    `).join("");

    return `
      <article class="album" data-open="false" style="${style}">
        <div class="album__header">
          <img class="album__cover" src="${esc(album.coverImage)}" alt="${esc(album.name)} cover" loading="lazy" />
          <div class="album__meta">
            <h3 class="album__name">${esc(album.name)}</h3>
            <button class="album__toggle" type="button" aria-expanded="false" aria-controls="album-body-${esc(album.id)}">
              <span></span>${CHEVRON}
            </button>
          </div>
          <a class="album__download" href="${esc(album.downloadPath)}" download aria-label="Download ${esc(album.name)}">
            ${DOWNLOAD_ICON}
          </a>
        </div>
        <div class="album__body" id="album-body-${esc(album.id)}">
          <div class="album__body-inner">
            <div class="album__body-content">
              <p class="album__description">${esc(album.description)}</p>
              <ol class="song-list">${songs}</ol>
            </div>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll(".album").forEach(el => {
    const toggle = el.querySelector(".album__toggle");
    toggle.addEventListener("click", () => {
      const open = el.getAttribute("data-open") === "true";
      el.setAttribute("data-open", (!open).toString());
      toggle.setAttribute("aria-expanded", (!open).toString());
    });
  });
}

function renderFooter(footer) {
  document.getElementById("footerCredits").textContent = footer.credits || "";
  document.getElementById("footerCopyright").textContent = footer.copyright || "";
}

async function init() {
  try {
    const res = await fetch("data.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`data.json returned ${res.status}`);
    const data = await res.json();
    renderArtist(data.artist || {});
    renderAlbums(data.albums || []);
    renderFooter(data.footer || {});
  } catch (err) {
    console.error(err);
    document.body.innerHTML = `
      <div style="padding:48px 24px; font-family: system-ui; color: #f5f0e8; background:#0a0a0a; min-height:100vh;">
        <h1 style="font-family:'Instrument Serif',serif; font-weight:400; font-size:2rem;">Couldn't load site content</h1>
        <p style="opacity:.7; max-width:52ch;">The <code>data.json</code> file failed to load. If you're opening <code>index.html</code> directly from disk, browsers block <code>fetch()</code> on <code>file://</code> URLs. Run a local server (e.g. <code>python3 -m http.server</code>) or deploy to GitHub Pages.</p>
        <p style="opacity:.5; font-size:.85rem; margin-top:16px;">${esc(err.message)}</p>
      </div>`;
  }
}

init();

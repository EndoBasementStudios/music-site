/* Song page. URL: song.html?album=<id>&song=<id> */

function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[c]));
}

const DOWNLOAD_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>';
const PLAY_ICON     = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON    = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z"/></svg>';

function applyPalette(colors) {
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

function getYouTubeId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/|music\.youtube\.com\/watch\?v=)([\w-]{11})/);
  return m ? m[1] : null;
}

function loadYouTubeAPI() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) return resolve();
    if (window._ytApiLoading) {
      const iv = setInterval(() => {
        if (window.YT && window.YT.Player) { clearInterval(iv); resolve(); }
      }, 50);
      return;
    }
    window._ytApiLoading = true;
    window.onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
}

function recordPlayerHTML(videoId, album) {
  if (!videoId) return "";
  return `
    <section class="song-section record-player-section">
      <p class="song-section-label">Now Playing</p>
      <div class="record-player">
        <div class="record" data-playing="false" role="button" tabindex="0" aria-label="Play or pause">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <clipPath id="coverClip"><circle cx="100" cy="100" r="60"/></clipPath>
              <radialGradient id="vinylShine" cx="30%" cy="30%" r="80%">
                <stop offset="0%" stop-color="#2c2c2c"/>
                <stop offset="45%" stop-color="#0a0a0a"/>
                <stop offset="100%" stop-color="#000"/>
              </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="98" fill="url(#vinylShine)"/>
            <g fill="none" stroke="#1a1a1a" stroke-width="0.6" opacity="0.85">
              <circle cx="100" cy="100" r="94"/><circle cx="100" cy="100" r="88"/>
              <circle cx="100" cy="100" r="82"/><circle cx="100" cy="100" r="76"/>
              <circle cx="100" cy="100" r="70"/>
            </g>
            <path d="M 22 66 A 82 82 0 0 1 82 22" fill="none" stroke="rgba(255,255,255,0.18)" stroke-width="2.5"/>
            <circle cx="100" cy="100" r="64" fill="var(--c-accent, #c9a961)"/>
            <circle cx="100" cy="100" r="64" fill="none" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>
            <image href="${esc(album.coverImage)}" x="40" y="40" width="120" height="120"
                   clip-path="url(#coverClip)" preserveAspectRatio="xMidYMid slice"/>
            <circle cx="100" cy="100" r="60" fill="none" stroke="rgba(0,0,0,0.4)" stroke-width="1"/>
            <circle cx="100" cy="100" r="5" fill="#000"/>
            <circle cx="100" cy="100" r="3" fill="#333"/>
          </svg>
        </div>
        <button class="record-player__toggle" type="button">
          ${PLAY_ICON}<span>PLAY</span>
        </button>
        <div id="yt-player" aria-hidden="true"></div>
      </div>
    </section>`;
}

let ytPlayer = null;

async function setupRecordPlayer(videoId) {
  if (!videoId) return;
  await loadYouTubeAPI();

  const record = document.querySelector(".record");
  const btn    = document.querySelector(".record-player__toggle");
  if (!record || !btn) return;

  ytPlayer = new YT.Player("yt-player", {
    height: "1",
    width:  "1",
    videoId,
    playerVars: { controls: 0, disablekb: 1, playsinline: 1 },
    events: {
      onStateChange: (e) => {
        const playing = e.data === 1 || e.data === 3;
        const wasPlaying = record.getAttribute("data-playing") === "true";

        // Pausing: freeze at current rotation
        if (wasPlaying && !playing) {
          const svg = record.querySelector("svg");
          const m = window.getComputedStyle(svg).transform;
          let angle = 0;
          if (m && m !== "none") {
            const values = m.match(/matrix\(([^)]+)\)/);
            if (values) {
              const [a, b] = values[1].split(",").map(parseFloat);
              angle = Math.atan2(b, a) * 180 / Math.PI;
            }
          }
          // normalize to 0–360
          angle = ((angle % 360) + 360) % 360;
          record.style.setProperty("--spin-angle", angle + "deg");
        }

        record.setAttribute("data-playing", String(playing));
        btn.innerHTML = playing
          ? PAUSE_ICON + "<span>PAUSE</span>"
          : PLAY_ICON  + "<span>PLAY</span>";
      }
    }
  });

  const toggle = () => {
    if (!ytPlayer || !ytPlayer.getPlayerState) return;
    const s = ytPlayer.getPlayerState();
    if (s === 1) ytPlayer.pauseVideo(); else ytPlayer.playVideo();
  };
  btn.addEventListener("click", toggle);
  record.addEventListener("click", toggle);
  record.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
  });
}

function renderError(message) {
  document.getElementById("songRoot").innerHTML = `
    <div class="song-error">
      <div>
        <h1>Song not found</h1>
        <p style="opacity:.75; margin:0 0 16px;">${esc(message)}</p>
        <a href="index.html">Back to all music</a>
      </div>
    </div>`;
}

function renderSong(album, song, artistName) {
  applyPalette(album.colors);

  document.title = `${song.name} — ${artistName || ""}`.trim().replace(/[—-]\s*$/, "");
  document.getElementById("navAlbum").textContent = album.name;

  const videoId = getYouTubeId(song.youtubeUrl);

  document.getElementById("songRoot").innerHTML = `
    <header class="song-hero">
      <img class="song-hero__cover" src="${esc(album.coverImage)}" alt="${esc(album.name)} cover" />
      <div class="song-hero__text">
        <p class="song-eyebrow">${esc(album.name)}</p>
        <h1 class="song-title">${esc(song.name)}</h1>
      </div>
    </header>

    <div class="song-body">
      ${recordPlayerHTML(videoId, album)}

      ${song.description ? `
        <section class="song-section">
          <p class="song-section-label">About</p>
          <p class="song-description">${esc(song.description)}</p>
        </section>` : ""}

      ${song.lyrics ? `
        <section class="song-section">
          <p class="song-section-label">Lyrics</p>
          <p class="song-lyrics">${esc(song.lyrics)}</p>
        </section>` : ""}
    </div>
  `;

  setupRecordPlayer(videoId);
}

async function init() {
  const params  = new URLSearchParams(window.location.search);
  const albumId = params.get("album");
  const songId  = params.get("song");

  if (!albumId || !songId) {
    return renderError("Missing ?album and ?song URL parameters.");
  }

  try {
    const res = await fetch("data.json", { cache: "no-cache" });
    if (!res.ok) throw new Error(`data.json returned ${res.status}`);
    const data = await res.json();

    const album = (data.albums || []).find(a => a.id === albumId);
    if (!album) return renderError(`No album with id "${albumId}".`);

    const song = (album.songs || []).find(s => s.id === songId);
    if (!song) return renderError(`No song "${songId}" in album "${album.name}".`);

    renderSong(album, song, data.artist?.name);
  } catch (err) {
    console.error(err);
    renderError(err.message);
  }
}

init();
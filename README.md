# Your Music Site — the manual

Everything you need to know to keep this site up to date, written for a text editor, not a code editor. If you can copy, paste, and save a file, you can update every part of this site.

---

## 1. What you're looking at

Your website is a **single-page artist site** — everything the visitor sees (the hero image with your name, the row of album bars, the footer) is on one page. When a visitor clicks a specific song, they go to a **song page** that shows lyrics, description, and a spinning record player that plays the song from YouTube.

Under the hood, the site is nothing fancy: it's a folder of files. Most of what you'll ever want to change lives in **one file**: `data.json`. That's the "brain" of the site — it holds every album name, every song, every lyric, the artist name, social links, and the colors. If you change it and save, the site changes.

**Two other files** you might touch:
- `styles.css` — controls how things look. This is where you go to change fonts and tweak colors.
- The `assets/` folder — where images (hero photo, album covers) and audio files (MP3s, album ZIPs) live.

Everything else (`.html` and `.js` files) is code that assembles the site from the above. You can leave those alone.

---

## 2. The file map

```
/
├── index.html         ← the front page (don't touch)
├── song.html          ← the individual song page (don't touch)
├── styles.css         ← ★ fonts + fine visual details
├── main.js            ← code (don't touch)
├── song.js            ← code (don't touch)
├── data.json          ← ★ ALL YOUR CONTENT lives here
├── README.md          ← this file
└── assets/
    ├── hero/hero.jpg              ← your main background photo
    ├── favicon/                   ← the little tab icon
    └── albums/
        ├── midnight-reveries/
        │   ├── cover.jpg          ← album cover
        │   ├── track-1.mp3        ← song files
        │   ├── track-2.mp3
        │   └── album.zip          ← full-album download
        ├── paperweight/
        └── long-way-home/
```

Files marked with ★ are the ones you'll edit. The rest of this manual is about how to edit them.

---

## 3. Simple changes

### Change the artist name

Open `data.json`. Near the very top you'll see:

```json
"artist": {
  "name": "John Doe",
```

Change the text between the double quotes. Save. Done — it updates both the big hero title AND the browser tab title everywhere on the site.

### Change social media links

Also near the top of `data.json`:

```json
"socials": [
  { "platform": "instagram", "url": "https://instagram.com/YOUR_HANDLE" },
  { "platform": "youtube",   "url": "https://youtube.com/@YOUR_HANDLE" },
  { "platform": "patreon",   "url": "https://patreon.com/YOUR_HANDLE" }
]
```

**To change a URL:** replace what's inside the quotes after `"url":`. 

**To add a new one:** copy an existing line, paste it right after, and change the platform and URL. Make sure every line except the last one ends with a comma.

**Supported platform names** (built-in icons available): `instagram`, `youtube`, `soundcloud`, `spotify`, `patreon`, `bandcamp`, `twitter`, `apple`. If you use anything else, you'll get a generic globe icon.

### Change the footer credits and copyright

At the very bottom of `data.json`:

```json
"footer": {
  "copyright": "© 2026 John Doe. All rights reserved.",
  "credits": "All songs produced, written, performed, and mixed by John Doe."
}
```

Edit the text inside the quotes.

### Change the hero image

Replace the file at `assets/hero/hero.jpg` with your new photo. **Keep the same filename** (`hero.jpg`) — that way you don't need to update any references in the JSON.

If you want to use a different filename (like `assets/hero/tour-2026.jpg`), you can — but then you also need to update the `heroImage` line in `data.json`:

```json
"heroImage": "assets/hero/tour-2026.jpg",
```

---

## 4. Adding an album

An album is a full block in `data.json`. Here's what a complete album looks like — you can copy this whole block, paste it after an existing album, and modify it:

```json
{
  "id": "your-new-album",
  "name": "Your New Album",
  "description": "One or two sentences that show up when someone clicks 'Details'.",
  "coverImage":   "assets/albums/your-new-album/cover.jpg",
  "downloadPath": "assets/albums/your-new-album/album.zip",
  "colors": {
    "background": "#1a1f2e",
    "panel":      "#232a3b",
    "heading":    "#f5f0e8",
    "text":       "#c8c2b4",
    "accent":     "#c9a961"
  },
  "songs": [
    {
      "id": "first-song",
      "name": "First Song",
      "description": "",
      "lyrics": "First line of lyrics\nSecond line\n\nSecond verse first line",
      "downloadPath": "assets/albums/your-new-album/track-1.mp3",
      "youtubeUrl": "https://www.youtube.com/watch?v=XXXXXXXXXXX"
    }
  ]
}
```

Then:

1. **Create the folder** `assets/albums/your-new-album/` (matching the `id` above).
2. **Drop the cover art** into that folder as `cover.jpg` (or use a different name, and update `coverImage` above to match).
3. **Drop the audio files** into that folder — one MP3 per song (`track-1.mp3`, `track-2.mp3`, and so on) and a ZIP of all of them called `album.zip`.
4. **Save `data.json`.**

**A few things worth noting about the JSON:**

- Every field with quotes must have quotes at BOTH ends: `"like this"`. Missing a quote breaks the whole page.
- Every line in a list must end with a **comma**, EXCEPT the last one in that list. So the last song in an album has no comma after it, and the last album has no comma either.
- Text with `\n` in it (like in the lyrics field) means "line break". Two of them together (`\n\n`) makes a blank line — that's how you get verse spacing.
- The `id` is what shows up in the web address for that song's page. Keep it lowercase, use hyphens instead of spaces, no special characters.

### Using the songs converter tool

Typing lyrics into JSON by hand is tedious. There's a tool called **`songs-to-json.html`** that does it for you:

1. Open the file in your browser (double-click it).
2. Paste all your songs in the big text box on the left, using this format:
   ```
   First Song Name
   First line of lyrics
   Second line

   New verse
   ===
   Second Song Name
   Its lyrics here
   ```
   The `===` separates songs. Line 1 of each block = song name. Everything after = lyrics.
3. Fill in the YouTube URL for each song in the little input boxes that appear.
4. Click **Copy JSON** and paste the result into the `songs: [ ... ]` area of your album in `data.json`.

---

## 5. Colors — the 5-color palette

Each album has its own **5-color palette**. When someone opens an album (or a song from that album), the whole page shifts to those colors. It's the site's main visual feature.

The five colors:

| Color name | Where it appears |
|---|---|
| `background` | The main body color of the album bar and each song page |
| `panel` | Subtle color used for the atmospheric "wash" glow around the cover |
| `heading` | Album name, song titles, headings |
| `text` | Body text (description, lyrics) |
| `accent` | Buttons, arrows, the highlight around the album cover, the record label |

They're written as **hex codes** (colors expressed as `#` plus six characters). For example, `#c9a961` is a warm gold.

### Where to get hex codes

Easiest way: **[coolors.co](https://coolors.co)** — click "Generate" until you find a palette you like, then copy the hex codes.

Or Google "color picker" and any browser will give you one. Or, if you have a photo whose colors you want to steal, upload it to [imagecolorpicker.com](https://imagecolorpicker.com) and click any pixel to get the hex.

### Picking palettes that work

A few rules of thumb:

- **`background` should be dark and moody.** Deep navy, forest, rust, plum. It sets the whole page tone.
- **`panel` should be a slightly-lighter version of `background`** (about 10% lighter). It shows up subtly as an atmospheric glow, so it should feel like the same color, just brighter.
- **`heading` should be very light** (near white / cream / pale). It needs to be readable against the dark background.
- **`text` sits between the two** — brighter than the background, dimmer than the heading.
- **`accent` should pop.** It's the eye-catch color. Gold, amber, sage, dusty pink. It's the one warm/interesting note against the dark palette.

Here are the three palettes already in your site as reference:

**Midnight (deep blue, gold accent)** — nocturnal, quiet
```
background: #1a1f2e    panel: #232a3b    heading: #f5f0e8
text:       #c8c2b4    accent: #c9a961
```

**Paperweight (warm brown, amber accent)** — dusty, warm
```
background: #3a2820    panel: #48332a    heading: #f5eadb
text:       #d8c4ac    accent: #e8a765
```

**Long Way Home (forest green, sage accent)** — outdoorsy, alive
```
background: #1e2e28    panel: #2a3d35    heading: #f0f5ec
text:       #bfd0be    accent: #a9c896
```

To change an album's colors, find the `"colors":` block for that album in `data.json` and swap the hex codes. Save. Reload the page.

---

## 6. Fonts

The site uses **two font "slots"**:

- **`--serif`** — used for big editorial pieces: the artist name in the hero, album titles, song titles, the italic footer credits. Currently `Instrument Serif`.
- **`--sans`** — used for smaller everyday text: buttons, descriptions, lyrics. Currently `Arial`.

Both are declared in `styles.css`, right at the top:

```css
:root {
  --serif:     'Instrument Serif', 'Iowan Old Style', Georgia, serif;
  --sans:      Arial, 'Helvetica Neue', Helvetica, sans-serif;
  ...
}
```

### Browsing the font options

Open **`font-gallery.html`** in your browser. It shows 55+ font options grouped by mood — dramatic serifs, retro typewriter fonts, handwritten scripts, and so on. Each card shows:

- The font name and vibe
- What "John Doe" looks like in it, at hero size
- What a paragraph of body text looks like
- A **Copy CSS** button — click it and the two lines you need are on your clipboard

### Swapping a font

Once you've picked one and clicked Copy:

1. Open `styles.css` in your text editor.
2. **Paste the `@import` line at the very top of the file** (above `:root {`). If the file already has an `@import` line at the top, replace it — you can only have ONE `@import` unless you know what you're doing.
3. **Replace the matching line** inside `:root { }`. If your copied line starts with `--serif:`, replace the existing `--serif:` line. Same for `--sans:`.
4. Save. Reload the page.

**Example** — say you want to swap from Instrument Serif to Playfair Display for the artist name. In `styles.css`, the current lines are:

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --serif:     'Instrument Serif', 'Iowan Old Style', Georgia, serif;
  --sans:      Arial, 'Helvetica Neue', Helvetica, sans-serif;
  ...
```

After swapping to Playfair:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap');

:root {
  --serif:     'Playfair Display', Georgia, serif;
  --sans:      Arial, 'Helvetica Neue', Helvetica, sans-serif;
  ...
```

Save. Reload. Everything that used the serif — hero name, album names, song titles, footer credits — is now Playfair.

### Loading multiple Google Fonts

The single `@import` line only imports one font. If you want to use *two* Google Fonts (say, Playfair as serif AND Manrope as sans), you need to combine them into a single `@import` — Google supports this with `&family=`:

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Manrope:wght@200..800&display=swap');
```

Copy the two `family=Xxx` chunks from your two Copy CSS results, and glue them together with `&`. If this feels finicky, ping me — I'll build the exact `@import` line for whichever two fonts you want.

### Pairing tips

Almost any dramatic serif goes well with any clean sans. But if you want deliberate pairings from the gallery:

| Vibe | Serif | Sans |
|---|---|---|
| Editorial magazine | Playfair Display | Inter |
| Warm & personal | Fraunces | Manrope |
| Retro / old internet | Special Elite | VT323 |
| Fashion / runway | Italiana | Karla |
| Book / literary | EB Garamond | Lora |
| Punchy / rock | Anton | Space Grotesk |
| Coffee-shop / soft | Cormorant Infant | Figtree |

---

## 7. Seeing your changes locally

Because of how browsers work, you can't just double-click `index.html` to preview your changes — some features (like the JSON loading) need a real web server. Here's the easy way:

1. Make sure Python is installed on your computer. On Mac and Linux it's pre-installed. On Windows, install it from [python.org](https://python.org) — check "Add Python to PATH" during setup.
2. Open your terminal / command prompt.
3. `cd` into your site folder. For example: `cd Desktop/johndoe-site`
4. Run: `python3 -m http.server 8000` (or `python -m http.server 8000` on Windows).
5. Open your browser to **http://localhost:8000**

Now every time you save a file, refresh the browser tab to see your change.

To stop the server when you're done, press `Ctrl+C` in the terminal.

If you make a change and don't see it, **hard-refresh**: `Cmd+Shift+R` on Mac, `Ctrl+Shift+R` on Windows. Browsers cache aggressively and sometimes need to be told to fetch a fresh copy.

---

## 8. Publishing to the internet (GitHub Pages)

Your site is set up to be hosted for free on GitHub Pages. Once you've made changes locally and confirmed they work:

1. Sign in to [github.com](https://github.com) and go to your site's repository.
2. On the repository page, drag your updated files onto the browser window to upload them. GitHub will let you drag folders. If it asks to "commit" the changes, just click the green button at the bottom.
3. GitHub Pages usually publishes the change within a minute or two. Your site is live at whatever `.github.io` address you set up.

If your site doesn't update within 5 minutes:
- Check the **Actions** tab at the top of the GitHub repo — you'll see a green ✓ if it published, a red ✗ if it didn't. Click the red ✗ to see what broke.
- If it's a JSON error, the culprit is usually a missing comma or an extra one. Paste your `data.json` into [jsonlint.com](https://jsonlint.com) and it'll tell you exactly which line is bad.

---

## 9. Common problems

**"The site is blank / totally broken after I edited data.json."**
JSON is fussy about punctuation. Paste `data.json` into [jsonlint.com](https://jsonlint.com) and it'll tell you the exact line that's wrong. Usually it's a missing comma, an extra comma at the end of a list, or a missing quote.

**"I updated a font but nothing changed."**
Hard-refresh (Cmd+Shift+R / Ctrl+Shift+R). Browsers cache the CSS. If it *still* doesn't change, double-check that the `@import` line is at the very top of `styles.css` and starts with `@import url(`.

**"I updated an album cover but the old one is still showing."**
Same thing — hard-refresh. Images are cached even more aggressively than CSS. If you're still seeing the old one, try opening the page in an incognito / private browser window.

**"The record player doesn't spin / show up."**
It only appears on songs that have a `youtubeUrl` field. Songs without one just get the description and lyrics — that's by design. If you added a URL and it still doesn't show, check that the URL is a real YouTube link (starts with `https://www.youtube.com/watch?v=` or `https://youtu.be/`).

**"The lyrics are all on one line."**
In JSON, line breaks are written as `\n` (backslash-n), not by actually hitting Enter. If you use the `songs-to-json.html` converter tool, this happens automatically.

---

## 10. Things worth NOT touching

Unless you know what you're doing:
- Don't rename or delete the `.html` and `.js` files.
- Don't change the *structure* of `data.json` — the `"artist":`, `"albums":`, `"footer":` labels and their curly braces `{ }` and square brackets `[ ]`. Change the values inside quotes, not the names on the left of the colons.
- Don't remove the `@import` line at the top of `styles.css` unless you're replacing it with a new one.

If something breaks and you can't figure out what changed, restore the last working version — either from a backup, or from the GitHub repo (right-click any file in the browser and hit "History" to see previous versions).

---

## Quick reference

| I want to... | Open this file | Find this |
|---|---|---|
| Change artist name | `data.json` | `"name":` near the top |
| Change social links | `data.json` | `"socials":` |
| Add / edit / remove albums | `data.json` | `"albums":` |
| Add / edit / remove songs | `data.json` | `"songs":` inside an album |
| Change album colors | `data.json` | `"colors":` inside an album |
| Swap fonts | `styles.css` | `@import` at the top + `--serif` / `--sans` in `:root` |
| Replace hero photo | `assets/hero/hero.jpg` | Replace file |
| Replace album cover | `assets/albums/[slug]/cover.jpg` | Replace file |
| Add YouTube record player | `data.json` | Add `"youtubeUrl":` to a song |
| Preview locally | terminal | `python3 -m http.server 8000` |

That's the whole site. Everything else is polish.

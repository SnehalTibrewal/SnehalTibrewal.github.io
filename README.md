# snehaltibrewal.github.io

Plain HTML, CSS and a little JavaScript. No build step, no framework.

## Pages

| File | Page |
|---|---|
| `index.html` | Home: name, intro, photo and the orbit drawing |
| `research.html` | Research: the two main projects with figures, other papers, LVK papers |
| `cv.html` | CV: timeline, awards, download button (serves `cv.pdf`) |
| `off-orbit.html` | Off-orbit: life outside research |
| `contact.html` | Contact: emails with Copy buttons, profile links |
| `404.html` | Shown for any address that doesn't exist |

Shared files: `style.css` (all styling), `site.js` (Copy buttons), `images/` (photo and figures).

## Common edits

- **Colours:** the first lines of `style.css`, under "Colours and fonts".
  `--bg` is the background, `--ink` the text, `--accent` the coral decoration,
  `--hover` the link hover colour. Change those and every page updates.
- **Fonts:** same place, `--display` (headings) and `--body` (text). If you switch
  to another Google Font, also update the `fonts.googleapis.com` link in each page's `<head>`.
- **Text on a page:** open that page's `.html` file and edit the words between the tags.
- **Add a paper:** in `research.html`, copy one `<li>…</li>` under "Other papers" and edit it.
  For a main project with a figure, copy a whole `<article class="project">…</article>` block.
- **Swap an image:** replace the file in `images/` with one of the same name.
- **New CV:** replace `cv.pdf` with the new file, same name.
- **Add a page:** copy `off-orbit.html`, rename it, change its content, and add a link to it
  in the `<nav>` of every page (and in `sitemap.xml`).

## Put it online

1. On GitHub, create a public repository named exactly `SnehalTibrewal.github.io`.
2. Upload everything in this folder (Add file → Upload files), then Commit.
3. Settings → Pages → "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
4. After a minute or two it's live at `https://snehaltibrewal.github.io`.

To edit later on GitHub, open a file and click the pencil icon; changes go live about a minute after you commit.

## Being found

- Add the site URL to your GitHub profile, Google Scholar, ORCID, INSPIRE, your department page
  and your email signature. Links from those pages are what get it ranked for your name.
- Optional: verify the site in Google Search Console and submit `sitemap.xml`.

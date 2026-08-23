# stephanbredenhann.dev

Personal CV and portfolio site for Stephan Bredenhann — third-year BIT (Information Science)
student at the University of Pretoria.

**Live:** <https://stephanbredenhann.dev>

## Built with

No build step, no dependencies, no bundler — hand-written HTML, CSS and vanilla JavaScript,
served straight off GitHub Pages. That is deliberate: the whole site is a few files you can
read top to bottom, it has nothing to install, and it cannot break because a toolchain moved
underneath it.

- Dark and light themes via CSS custom properties and a `data-theme` attribute, with the
  choice persisted to `localStorage`
- Fraunces (display) and IBM Plex Sans (body) from Google Fonts
- Scroll-spy navigation, reveal-on-scroll and an interactive particle background, all
  driven by `IntersectionObserver` and a single `requestAnimationFrame` loop
- `prefers-reduced-motion` respected throughout; every touch and wheel listener is passive
- Structured data (JSON-LD `Person` + `WebSite`), Open Graph and Twitter card metadata

## Layout

```
index.html      markup and metadata for the whole single-page site
style.css       design tokens, layout, both themes, print styles
main.js         theme toggle, mobile nav, particles, scroll behaviour
sitemap.xml     search-engine sitemap
bg-remover/     Background Remover tool
qr-maker/       Free QR Code Maker tool
radar/          ADS-B Flight Tracker (build output from a separate repo)
```

## Apps and tools hosted here

**[ADS-B Flight Tracker (South Africa)](https://stephanbredenhann.dev/radar/)** — Live
aircraft on a map using public ADS-B data, built with Angular and Leaflet and hosted on
GitHub Pages. Coverage centred on South Africa. The airplanes.live API is used to get
aircraft information and the planespotters.net API is used to gather aircraft images.
Source: [Radar---South-Africa-ADS-B-Radar](https://github.com/stephanbredenhann/Radar---South-Africa-ADS-B-Radar)

**[Background Remover](https://stephanbredenhann.dev/bg-remover/)** — Remove image
backgrounds entirely in your browser, on device.

**[Free QR Code Maker](https://stephanbredenhann.dev/qr-maker/)** — Generate QR codes for a
website URL, contact card (vCard), or plain text. Runs entirely in the browser.

## Running locally

There is nothing to install. Serve the directory over HTTP so that the fonts, module
scripts and sub-apps resolve correctly:

```bash
python3 -m http.server 8899
```

Then open <http://localhost:8899>. Opening `index.html` directly via `file://` will work for
the layout but breaks the sub-app links.

## Licence

Source code is free to learn from. The CV content, personal details and project write-ups
are not for reuse.

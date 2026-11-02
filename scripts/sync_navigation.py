"""Regenerate the shared static navigation without changing page content or URLs.

Run from the repository root: python scripts/sync_navigation.py
Each page keeps its existing Hungarian/English route pair in data-lang-url.
"""

from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def language_buttons(current, routes):
    return "\n".join(
        f'            <button type="button" class="lang-btn{" is-active" if lang == current else ""}" '
        f'data-lang-btn="{lang}" data-lang-url="{routes[lang]}" '
        f'aria-pressed="{str(lang == current).lower()}">{lang.upper()}</button>'
        for lang in ("hu", "en")
    )


def navigation(current, routes):
    english = current == "en"
    home = "/en/" if english else "/"
    prefix = "/en" if english else ""
    labels = (
        ("About", "Services", "Pricing", "Projects", "Blog", "Contact")
        if english else
        ("Rólam", "Szolgáltatások", "Árazás", "Projektek", "Blog", "Kapcsolat")
    )
    hrefs = (
        home + "#about", home + "#services",
        prefix + ("/pricing" if english else "/arazas"),
        prefix + ("/projects" if english else "/projektek"),
        prefix + "/blog", prefix + ("/contact" if english else "/kapcsolat"),
    )
    keys = ("about", "services", "pricing", "projects", "blog", "contact")
    links = "\n".join(
        f'              <a href="{href}" data-i18n="nav.{key}">{label}</a>'
        for href, key, label in zip(hrefs, keys, labels)
    )
    switch_label = "Language switcher" if english else "Nyelvválasztó"
    nav_label = "Primary navigation" if english else "Fő navigáció"
    mobile_label = "Mobile navigation" if english else "Mobil navigáció"
    open_label = "Open navigation" if english else "Navigáció megnyitása"
    close_label = "Close menu" if english else "Menü bezárása"
    theme_label = "Switch theme" if english else "Téma váltása"
    buttons = language_buttons(current, routes)

    header = f'''<header class="topbar site-header">
  <div class="container topbar-inner">
    <a href="{home}" class="portfolio-logo">Pataki Attila Bence</a>
    <nav class="nav" id="siteNav" aria-label="{nav_label}">
      <div class="nav-links">
{links}
      </div>
    </nav>
    <div class="header-actions">
      <div class="language-switcher" role="group" aria-label="{switch_label}">
{buttons}
      </div>
      <button type="button" class="theme-toggle" id="themeToggle" aria-label="{theme_label}">
        <span class="theme-icon theme-icon-sun" aria-hidden="true">☼</span>
        <span class="theme-icon theme-icon-moon" aria-hidden="true">◐</span>
      </button>
      <button type="button" class="nav-toggle" id="navToggle" aria-label="{open_label}" aria-expanded="false" aria-controls="mobileNavOverlay">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>'''

    overlay = f'''<div class="mobile-nav-overlay site-mobile-nav" id="mobileNavOverlay" aria-hidden="true" inert>
  <div class="mobile-nav-shell">
    <div class="mobile-nav-header">
      <a href="{home}" class="portfolio-logo">Pataki Attila Bence</a>
      <button type="button" class="mobile-nav-close" id="mobileNavClose" aria-label="{close_label}"><span></span><span></span></button>
    </div>
    <nav class="mobile-nav-links" aria-label="{mobile_label}">
{links}
    </nav>
    <div class="mobile-nav-footer">
      <div class="language-switcher" role="group" aria-label="{switch_label}">
{buttons}
      </div>
    </div>
  </div>
</div>'''
    return header, overlay


def overlay_span(source):
    match = re.search(r'<div\s+class="mobile-nav-overlay[^\"]*"[^>]*>', source)
    if not match:
        return None
    depth = 1
    for tag in re.finditer(r'</?div\b[^>]*>', source[match.end():], re.I):
        depth += -1 if tag.group().startswith("</") else 1
        if depth == 0:
            return match.start(), match.end() + tag.end()
    raise ValueError("Unclosed mobile navigation overlay")


def update_page(path):
    source = path.read_text(encoding="utf-8")
    current = "en" if path.relative_to(ROOT).parts[0] == "en" else "hu"
    found = dict(re.findall(r'data-lang-btn="(hu|en)"[^>]*data-lang-url="([^"]+)"', source))
    routes = {"hu": found.get("hu", "/"), "en": found.get("en", "/en/")}
    header, overlay = navigation(current, routes)

    header_match = re.search(r'<header\s+class="topbar(?: site-header)?">[\s\S]*?</header>', source)
    span = overlay_span(source)
    if header_match and span:
        # Replace from the end backwards so the original offsets stay valid.
        replacements = [(header_match.start(), header_match.end(), header), (span[0], span[1], overlay)]
        for start, end, text in sorted(replacements, reverse=True):
            source = source[:start] + text + source[end:]
    elif path.name == "404.html":
        source = re.sub(r'(<body[^>]*>)', r'\1\n' + header + '\n' + overlay, source, count=1)
        source = source.replace('href="assets/styles/base.css"', 'href="/assets/styles/base.css"')
        source = source.replace('href="assets/styles/home.css"', 'href="/assets/styles/home.css"')
        source = source.replace('  </body>', '    <script type="module" src="/assets/scripts/main.js"></script>\n  </body>', 1)
    else:
        raise ValueError(f"Cannot find both navigation blocks: {path}")
    path.write_text(source, encoding="utf-8")


if __name__ == "__main__":
    pages = sorted(ROOT.rglob("*.html"))
    for page in pages:
        if ".git" not in page.parts:
            update_page(page)
    print(f"Synchronized navigation on {len(pages)} pages")

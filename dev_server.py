"""Local static preview with the same clean URLs as vercel.json.

Run: python dev_server.py
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parent


class PortfolioHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        relative = urlsplit(path).path.lstrip("/")
        candidate = (ROOT / relative).resolve()
        if not candidate.is_relative_to(ROOT):
            return str(ROOT / "404.html")
        if not candidate.suffix and candidate.with_suffix(".html").is_file():
            candidate = candidate.with_suffix(".html")
        elif candidate.is_dir():
            candidate /= "index.html"
        return str(candidate)


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5500"))
    print(f"Preview: http://127.0.0.1:{port}", flush=True)
    ThreadingHTTPServer(("127.0.0.1", port), PortfolioHandler).serve_forever()

#!/usr/bin/env python3
"""
Lightweight development server for Wadhwani Foundation Certificate Clone
Supports:
  - http://localhost:3000/
  - http://localhost:3000/en/certificate?certificateId=6ae0ca9dfa09ff77a70fd003
"""

import http.server
import socketserver
import urllib.parse
import os

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_HEAD(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path.lstrip("/")
        file_path = os.path.join(DIRECTORY, clean_path)
        if os.path.isfile(file_path):
            self.path = "/" + clean_path
            return super().do_HEAD()

        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        clean_path = parsed.path.lstrip("/")
        file_path = os.path.join(DIRECTORY, clean_path)
        
        # If static asset exists, serve it
        if os.path.isfile(file_path):
            self.path = "/" + clean_path
            return super().do_GET()

        # SPA route fallback to index.html
        self.send_response(200)
        self.send_header("Content-type", "text/html; charset=utf-8")
        self.end_headers()
        with open(os.path.join(DIRECTORY, "index.html"), "rb") as f:
            self.wfile.write(f.read())

if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"🚀 Certificate Clone running at http://localhost:{PORT}/")
        print(f"📄 Target Demo URL: http://localhost:{PORT}/en/certificate?certificateId=6ae0ca9dfa09ff77a70fd003")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server.")

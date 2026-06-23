# run_server.py

import subprocess
import os
import sys
from waitress import serve
from django.contrib.staticfiles.handlers import StaticFilesHandler
from school_erp.wsgi import application

# Start WhatsApp automation background service (Node.js)
service_dir = os.path.join(os.path.dirname(__file__), 'whatsapp_service')
print("Launching WhatsApp automation service background process...")
try:
    # Run 'node server.js' from the whatsapp_service directory
    subprocess.Popen(
        ["node", "server.js"],
        cwd=service_dir,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
        creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == 'win32' else 0
    )
    print("WhatsApp automation service launched successfully.")
except Exception as e:
    print(f"Warning: Failed to launch WhatsApp automation service: {e}")

# Wrap WSGI application to serve static files
application = StaticFilesHandler(application)

serve(
    application,
    host="127.0.0.1",
    port=8000
)
import urllib.request, json
try:
    resp = urllib.request.urlopen("http://localhost:8000/health", timeout=5)
    data = json.loads(resp.read().decode())
    print("STATUS:", json.dumps(data, indent=2))
except Exception as e:
    print("FAILED:", e)

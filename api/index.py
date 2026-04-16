import sys
import os

# Bridge: Resolve the absolute path to the backend folder
# This ensures Vercel's serverless runtime can find the modules even when mounted differently
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'backend'))

if backend_path not in sys.path:
    sys.path.append(backend_path)

# Import the FastAPI app from the backend
try:
    from main import app
except ImportError:
    # Fallback for alternative mounting structures
    from backend.main import app

# Vercel needs the 'app' object for serverless execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

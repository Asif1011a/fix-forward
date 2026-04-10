import sys
import os

# Bridge: Add the backend directory to the system path so imports work correctly in serverless
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

from main import app

# Vercel needs the app object to be imported for serverless execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

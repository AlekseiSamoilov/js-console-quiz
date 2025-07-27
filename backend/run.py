#!/usr/bin/env python3
"""
Development server runner for JS Console Quiz API
"""
import uvicorn
import os
from pathlib import Path

# Add the current directory to Python path
import sys
sys.path.append(str(Path(__file__).parent))

if __name__ == "__main__":
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    # Run the server
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
"""
Agent Autopsy - FastAPI Application Entry Point.
Mounts all routers, connects MongoDB on startup, and provides a /health check.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.db.mongodb import connect_db, close_db, is_memory_fallback
from backend.app.api.runs import router as runs_router
from backend.app.api.autopsy import router as autopsy_router
from backend.app.api.experiments import router as experiments_router
from backend.app.api.fixes import router as fixes_router
from backend.app.api.reports import router as reports_router

# Initialize FastAPI app with metadata
app = FastAPI(
    title="Agent Autopsy API",
    description="Forensic investigation backend for multi-step AI agent failure analysis.",
    version="1.0.0"
)

# Allow the React frontend (default: http://localhost:5173) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    """Connect to MongoDB on server start. Falls back to in-memory if unavailable."""
    await connect_db()


@app.on_event("shutdown")
async def shutdown():
    """Close MongoDB connection cleanly on server shutdown."""
    await close_db()


@app.get("/health")
async def health():
    """
    Health check endpoint.
    Returns OK with storage mode: 'mongodb' if connected, 'memory' if in fallback.
    """
    return {
        "status": "ok",
        "version": "1.0.0",
        "storage": "memory" if is_memory_fallback() else "mongodb"
    }


# Mount all API route groups
app.include_router(runs_router)
app.include_router(autopsy_router)
app.include_router(experiments_router)
app.include_router(fixes_router)
app.include_router(reports_router)

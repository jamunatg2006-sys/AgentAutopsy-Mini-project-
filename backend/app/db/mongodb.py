"""
MongoDB connection and client lifecycle management.
Supports live async Motor client with graceful in-memory fallback.
"""

import os
import logging
from typing import Optional

logger = logging.getLogger("agent_autopsy.db")

# Default MongoDB URI from environment or localhost
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "agent_autopsy")

_client = None
_db = None
_use_memory_fallback = False


async def connect_db():
    """
    Connect to MongoDB. If MongoDB is not running, falls back safely to in-memory mode.
    """
    global _client, _db, _use_memory_fallback
    try:
        from motor.motor_asyncio import AsyncIOMotorClient
        
        # Connect with a quick 1.5s server selection timeout
        _client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=1500)
        # Ping the server to check connectivity
        await _client.admin.command('ping')
        _db = _client[DATABASE_NAME]
        _use_memory_fallback = False
        logger.info(f"Connected to MongoDB at {MONGODB_URI} (DB: {DATABASE_NAME})")
    except Exception as exc:
        logger.warning(f"MongoDB not available ({exc}). Falling back to in-memory repository storage.")
        _use_memory_fallback = True
        _client = None
        _db = None


async def close_db():
    """Close MongoDB connection on server shutdown."""
    global _client, _db
    if _client is not None:
        _client.close()
        _client = None
        _db = None
        logger.info("Closed MongoDB connection.")


def get_db():
    """Returns database instance or None if using in-memory mode."""
    return _db


def is_memory_fallback() -> bool:
    """Returns True if the backend is operating in in-memory fallback mode."""
    return _use_memory_fallback

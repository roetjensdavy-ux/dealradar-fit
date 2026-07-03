"""Redis caching layer"""

import os
import json
from datetime import datetime
from decimal import Decimal
from uuid import UUID

from redis.asyncio import Redis

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/1")

_redis: Redis | None = None


class JSONEncoder(json.JSONEncoder):
    """Custom JSON encoder for UUID, Decimal, and datetime."""
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, Decimal):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


def json_dumps(obj) -> str:
    return json.dumps(obj, cls=JSONEncoder)


def json_loads(s: str):
    return json.loads(s)


async def get_redis() -> Redis:
    """Get or create the Redis client."""
    global _redis
    if _redis is None:
        _redis = Redis.from_url(REDIS_URL, decode_responses=True)
    return _redis


async def close_redis() -> None:
    """Close the Redis connection."""
    global _redis
    if _redis is not None:
        await _redis.close()
        _redis = None


async def get_cache(key: str) -> str | None:
    """Get a cached value by key."""
    redis = await get_redis()
    return await redis.get(key)


async def set_cache(key: str, value: str, ttl: int = 300) -> None:
    """Set a cached value with TTL in seconds."""
    redis = await get_redis()
    await redis.setex(key, ttl, value)


async def delete_cache(key: str) -> None:
    """Delete a cached value by key."""
    redis = await get_redis()
    await redis.delete(key)


async def invalidate_pattern(pattern: str) -> None:
    """Delete all keys matching a pattern."""
    redis = await get_redis()
    cursor = 0
    while True:
        cursor, keys = await redis.scan(cursor=cursor, match=pattern, count=100)
        if keys:
            await redis.delete(*keys)
        if cursor == 0:
            break

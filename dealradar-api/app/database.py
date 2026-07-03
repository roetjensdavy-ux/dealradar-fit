"""Async PostgreSQL connection pool using asyncpg"""

import os

import asyncpg

DB_DSN = os.getenv("DATABASE_URL", "postgresql://james:Kraaienhof42bX@postgres:5432/jamesai")

_pool: asyncpg.Pool | None = None


async def get_pool() -> asyncpg.Pool:
    """Get or create the connection pool."""
    global _pool
    if _pool is None:
        _pool = await asyncpg.create_pool(
            dsn=DB_DSN,
            min_size=5,
            max_size=20,
            command_timeout=60,
        )
    return _pool


async def close_pool() -> None:
    """Close the connection pool."""
    global _pool
    if _pool is not None:
        await _pool.close()
        _pool = None


async def fetch(query: str, *args):
    """Execute a SELECT query and return all rows."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetch(query, *args)


async def fetchrow(query: str, *args):
    """Execute a SELECT query and return a single row."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetchrow(query, *args)


async def fetchval(query: str, *args):
    """Execute a query and return a single value."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.fetchval(query, *args)


async def execute(query: str, *args):
    """Execute an INSERT/UPDATE/DELETE query."""
    pool = await get_pool()
    async with pool.acquire() as conn:
        return await conn.execute(query, *args)

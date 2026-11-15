"""
WORLD RUSH — optional LOCAL TikTok LIVE bridge (unofficial).
Relays public chat/gift events only to ws://127.0.0.1:8765.
No login cookie, password, or other credentials requested or stored.
Use only for an account/stream you are authorized to monitor.
"""
from __future__ import annotations

import argparse
import asyncio
import json
import logging
from typing import Any

from TikTokLive import TikTokLiveClient
from TikTokLive.events import CommentEvent, ConnectEvent, DisconnectEvent, GiftEvent
from websockets.asyncio.server import serve

LOG = logging.getLogger("world-rush")
CLIENTS: set[Any] = set()
STATE = {"type": "status", "connected": False, "note": "Waiting for LIVE"}
COUNTER = 0


def bounded(text: object, n: int) -> str:
    return str(text or "")[:n]


def gift_points(gift: object) -> int:
    # The unofficial client often exposes diamond_count, NOT official coins.
    # Points are only used to categorize boosts; they are NEVER shown as cash.
    for key in ("diamond_count", "diamondCount", "coin_cost", "coinCost"):
        value = getattr(gift, key, None)
        try:
            number = int(value)
            if number > 0:
                return min(number, 100000)
        except (TypeError, ValueError, OverflowError):
            pass
    info = getattr(gift, "info", None)
    for key in ("diamond_count", "diamondCount"):
        value = getattr(info, key, None) if info is not None else None
        try:
            number = int(value)
            if number > 0:
                return min(number, 100000)
        except (TypeError, ValueError, OverflowError):
            pass
    return 0


async def broadcast(payload: dict) -> None:
    if not CLIENTS:
        return
    encoded = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    for connection in list(CLIENTS):
        try:
            await connection.send(encoded)
        except Exception:
            CLIENTS.discard(connection)


async def set_status(connected: bool, note: str) -> None:
    STATE.update({"type": "status", "connected": connected, "note": note})
    await broadcast(STATE)


async def handle_browser(websocket: Any) -> None:
    CLIENTS.add(websocket)
    LOG.info("WORLD RUSH browser connected")
    await websocket.send(json.dumps(STATE, ensure_ascii=False))
    try:
        async for _ in websocket:
            # Read-only bridge: the browser cannot control the TikTok connection.
            pass
    finally:
        CLIENTS.discard(websocket)


async def main(unique_id: str) -> None:
    global COUNTER
    unique_id = unique_id.strip().lstrip("@")
    if not unique_id:
        raise ValueError("TikTok username is required.")
    client = TikTokLiveClient(unique_id="@" + unique_id)

    @client.on(ConnectEvent)
    async def on_connected(event: ConnectEvent):
        LOG.info("TikTok LIVE connected: @%s", unique_id)
        await set_status(True, "TikTok LIVE connected")

    @client.on(DisconnectEvent)
    async def on_disconnected(event: DisconnectEvent):
        LOG.info("TikTok LIVE disconnected")
        await set_status(False, "TikTok LIVE disconnected")

    @client.on(CommentEvent)
    async def on_comment(event: CommentEvent):
        user = event.user
        await broadcast({
            "type": "comment",
            "userId": bounded(getattr(user, "unique_id", None) or getattr(user, "user_id", None), 100),
            "nickname": bounded(getattr(user, "nickname", None), 50),
            "text": bounded(getattr(event, "comment", None), 200),
        })

    @client.on(GiftEvent)
    async def on_gift(event: GiftEvent):
        global COUNTER
        gift = getattr(event, "gift", None)
        if gift is None:
            return
        if bool(getattr(event, "streaking", False)):
            return  # Ignore intermediate updates; count a gift streak only once.
        COUNTER += 1
        user = event.user
        count = getattr(event, "repeat_count", 1) or 1
        try:
            count = max(1, min(1000, int(count)))
        except (TypeError, ValueError):
            count = 1
        evt_id = getattr(event, "msg_id", None) or getattr(event, "message_id", None)
        await broadcast({
            "type": "gift",
            "eventId": bounded(evt_id, 140) or f"bridge-{COUNTER}",
            "userId": bounded(getattr(user, "unique_id", None) or getattr(user, "user_id", None), 100),
            "nickname": bounded(getattr(user, "nickname", None), 50),
            "giftName": bounded(getattr(gift, "name", None), 80),
            "value": gift_points(gift),
            "quantity": count,
        })
        LOG.info("Gift event: %s x%s (metadata points %s)",
                 bounded(getattr(gift, "name", None), 80), count, gift_points(gift))

    async with serve(handle_browser, "127.0.0.1", 8765, max_size=16384):
        LOG.info("Local event relay: ws://127.0.0.1:8765")
        LOG.info("Waiting for TikTok LIVE @%s — keep this console running.", unique_id)
        while True:
            try:
                await client.connect(fetch_gift_info=True)
            except asyncio.CancelledError:
                raise
            except Exception as exc:
                LOG.warning("Connection not ready (%s). Retrying in 10s.", exc)
            await set_status(False, "Waiting / retrying TikTok LIVE")
            await asyncio.sleep(10)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Local WORLD RUSH TikTok LIVE event relay")
    parser.add_argument("--user", required=True, help="TikTok LIVE creator username, e.g. @yourname")
    args = parser.parse_args()
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    try:
        asyncio.run(main(args.user))
    except KeyboardInterrupt:
        print("\nBridge stopped.")

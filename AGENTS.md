# Technical Decisions

- Telegram QR notifications use the project's own bot @wohnmobil_berlin_bot via secret `TELEGRAM_BOT_TOKEN` (direct Bot API in `qr-scan`), with the old connector gateway bot only as 403 fallback. Why: user wanted a dedicated bot for this site, separate from the personal "Ingo's Telegram" connection used elsewhere.

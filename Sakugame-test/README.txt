Sakugame — TEST BUILD (sandbox)
==============================

A full copy of the website that CANNOT touch the public database.

What is faked
-------------
* Firebase Realtime Database  -> an in-memory tree saved in this browser's
  localStorage (key "sakuTestDB"). Listeners, transactions and pushes behave
  like the real thing; every write stays local.
* The Discord OAuth redirect   -> Discord refuses file:// redirect URIs, so the
  popup is skipped: the panel writes the "#access_token=..." return URL itself
  and the REAL return code in app.js runs untouched (it parses the hash, calls
  /users/@me through the stub, then creates the account).
* cdn.discordapp.com avatars    -> rewritten to the local test-avatars/ files,
  so Discord profile pictures are visible.

How to use it
-------------
1. Open index.html (double-click — no server, no build step needed).
2. Use the 🧪 TEST BUILD panel, bottom-right:
   - Discord accounts : sign in as Ninja Tester / Sakura / Ghost, play as a
     guest, log out, or wipe the accounts.
   - Room helpers     : add bot players (they arrive ready), fill the room,
     flip their ready state, hand the host badge to a bot, let the bots pick a
     character in Detective Showdown, seed public rooms for the browser.
   - Solo launch      : host any game in one click, then add bots to play it.
   - Screens / view   : jump to any screen, open the profile menu, switch the
     phone / tablet frame, switch language, toggle admin mode.
   - Data             : reset the whole fake database.
3. The status block shows your account, room, player count and admin state.

Refreshing after a change
-------------------------
Run  python3 tools/build_test_site.py  again — it rebuilds Sakugame-test from
the current live files (index.html, app.js, lang.js, style.css, …) and only
re-injects the stub, the panel and the badge. Your saved test data survives
(it lives in the browser, not in the folder).

Notes
-----
* The real site is untouched: no GitHub upload, no Firebase write, no rules
  change needed to use this.
* "Wipe accounts" / "Reset ALL test data" only clear the LOCAL fake data.
* AniList sync still calls the real AniList API (read-only, public) — that part
  works exactly as online.

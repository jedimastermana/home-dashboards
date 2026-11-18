# Home Dashboards

Two wall-screen dashboards that replaced DAKboard.

- `lounge.html` — kitchen/lounge screen (1280×800 landscape) — runs on the Fire Stick
- `study.html` — Study Board (1600×2560 portrait) — add `?rotate=90` if the display can't rotate itself
- `config.js` — the only settings file (feed address, locations, night dimming, teams)
- `lore-data.js` — Study Board's lore library and constellations
- `apps-script/` — reference copy of the "Home Dashboards Feed" Google Apps Script (the live one is deployed from script.google.com)

Data comes from the "Home Dashboards Feed" Google Apps Script (read-only: next 3 weeks of
calendar events, Concerts · Movies · Shows, the two Drive photo folders, and gate/door sensor states).
Weather: Open-Meteo. Sports: ESPN.

## Lounge features

- **Gate warning** — polls the feed's `?part=sensors` every 20 s. Any open `gate` sensor takes over
  the screen with a ~1 Hz pulsing red warning (gate name, "open since h:mm (N min)"), above the night
  dim. Open garage doors get a small chip at the top of the photo instead.
- **Sports** — two tiles per team: the last result and the next game for ~18 h after a game (the same
  window as the win celebration), then the next two games. During a game the next-game tile turns live
  (score, period, clock) and refreshes every 60 s from the ESPN scoreboard.
- **Win celebration** — for ~18 h after a Jets or 76ers win the board switches to that team's colors,
  shows a banner at the foot of the photo and fires an occasional confetti burst. It is derived from
  the schedule data, so it survives reloads.
- **Sun-based dimming** — full brightness by day, a gentle dim easing in over 45 min after sunset,
  the deep dim from `nightDim.deepStart` (22:45), and back to full over the half hour before sunrise.
- **Seasonal themes** — accent colors plus a few ambient particles by date (autumn leaves, Halloween
  bats at night, Thanksgiving, December string lights and snow sparkle, New Year fireworks at midnight,
  winter frost, Valentine hearts, St. Patrick's shamrocks, spring petals, summer fireflies at night,
  July 4th fireworks after dark). Weather effects take priority: rain, snow, fog and storms hide them.

## Previewing the Lounge

Add `?test=` with one or more comma-separated items:

| item | shows |
| --- | --- |
| `gate` | the gate warning (Driveway Gate open) plus a garage-door chip |
| `win` or `win:nyj` / `win:phi` | the win celebration for that team |
| `live` | the first team's next game as a live game |
| `season:NAME` | a season: `autumn halloween thanksgiving december newyear winter valentine stpatrick spring summer july4` |
| `night` | treat it as night (bats, fireflies) |
| `fireworks` | New Year style fireworks |
| `dim:0.5` | force the night-dim opacity |

Example: `lounge.html?test=season:halloween,night` or `lounge.html?test=gate`.

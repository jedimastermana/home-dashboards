# Home Dashboards

Two wall-screen dashboards that replaced DAKboard.

- `lounge.html` — kitchen/lounge screen (drawn 1280×800; on a wider screen it widens to the screen's shape, up to
  1600, and the photo takes the extra width) — runs on the Fire Stick in Fully Kiosk Browser. Add `?zoom=0.92` if
  the TV crops the edges, `?width=1280` to pin the old shape
- `study.html` — Study Board (1600×2560 portrait) — add `?rotate=90` if the display can't rotate itself
- `config.js` — the only settings file (feed address, locations, night dimming, teams)
- `lore-data.js` — Study Board's lore library and constellations
- Your own quotes: the Google Sheet "Study Board - My Lore" (columns Category | Title | Text | Attribution,
  shared anyone-with-link). `config.loreSheet` names it; it holds the whole library (the original entries were
  copied in), so add, edit or delete rows freely; the board re-reads it hourly. `lore-data.js` is only the
  fallback when the sheet can't be reached, plus the constellations.
- `apps-script/` — reference copy of the "Home Dashboards Feed" Google Apps Script (the live one is deployed from script.google.com)

Data comes from the "Home Dashboards Feed" Google Apps Script (read-only: next 3 weeks of
calendar events, Concerts · Movies · Shows, the two Drive photo folders, and gate/door sensor states).
Weather: Open-Meteo. Sports: ESPN.

## Lounge features

- **Gate warning** — polls the feed's `?part=sensors` every 20 s. Any open `gate` sensor takes over
  the screen with a ~1 Hz pulsing red warning (gate name, "open since h:mm (N min)"), above the night
  dim. Open garage doors get a small chip at the top of the photo instead.
- **Sports** — four tiles in time order across both teams: any result from the last ~18 h (the same
  window as the win celebration), then the next games as they come. During a game its tile turns live
  (score, period, clock) and refreshes every 60 s from the ESPN scoreboard.
- **Win celebration** — for ~18 h after a Jets or 76ers win the board switches to that team's colors,
  shows a banner at the foot of the photo and fires an occasional confetti burst. It is derived from
  the schedule data, so it survives reloads.
- **Sun-based dimming** — full brightness by day, a gentle dim easing in over 45 min after sunset,
  the deep dim from `nightDim.deepStart` (22:45), and back to full over the half hour before sunrise.
- **Weather extras** — the day and date under the clock; a National Weather Service alert strip in the
  weather card when a watch, warning or advisory covers the house; "Rain in ~20 min" / "Rain until ~3:15pm"
  from Open-Meteo's 15-minute data; and when no shows are on this month, the shows card shows the next
  show with a countdown plus the next 12 hours of weather.
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
| `alert` | a Winter Storm Warning strip in the weather card |
| `rain` | the "Rain in ~30 min" line |

Example: `lounge.html?test=season:halloween,night` or `lounge.html?test=gate`.

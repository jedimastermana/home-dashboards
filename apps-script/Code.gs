/**
 * Home Dashboards feed
 * Sends the Lounge and Study Board screens only what they display:
 * the next 3 weeks of events, the Concerts/Movies/Shows list, and photo links.
 * Deployed as a web app: Execute as = Me, Who has access = Anyone.
 */
var CONFIG = {
  days: 21,
  tz: 'America/New_York',
  calendars: {
    // 'main' is your primary calendar ("Events")
    household: 'Household Calendar',
    dinner: 'Dinner',
    concerts: 'Concerts, Movies, Shows'
  },
  photoFolders: {
    lounge: 'Dashboard Photos - Lounge',
    study: 'Dashboard Photos - Study'
  },
  cacheSeconds: 300
};

function doGet(e) {
  var p = (e && e.parameter) || {};
  if (p.sensor && p.state) return out_(JSON.stringify(recordSensor_(p.sensor, p.state)));
  if (p.part === 'sensors') return out_(JSON.stringify({ now: fmt_(new Date()), sensors: readSensors_() }));
  var cache = CacheService.getScriptCache();
  var hit = cache.get('feed');
  if (hit) return out_(hit);
  var json = JSON.stringify(buildFeed_());
  if (json.length < 95000) cache.put('feed', json, CONFIG.cacheSeconds);
  return out_(json);
}

function out_(s) {
  return ContentService.createTextOutput(s).setMimeType(ContentService.MimeType.JSON);
}

function buildFeed_() {
  var tz = CONFIG.tz;
  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd');
  var start = parseLocal_(today + 'T00:00:00');
  var end = new Date(start.getTime() + CONFIG.days * 86400000);

  var events = [];
  var cals = [
    ['main', CalendarApp.getDefaultCalendar()],
    ['household', byName_(CONFIG.calendars.household)],
    ['dinner', byName_(CONFIG.calendars.dinner)]
  ];
  cals.forEach(function (pair) {
    if (!pair[1]) return;
    pair[1].getEvents(start, end).forEach(function (ev) { events.push(toItem_(ev, pair[0])); });
  });

  var concerts = [];
  var cc = byName_(CONFIG.calendars.concerts);
  if (cc) {
    cc.getEvents(start, new Date(start.getTime() + 400 * 86400000)).slice(0, 25)
      .forEach(function (ev) { concerts.push(toItem_(ev, 'concerts')); });
  }

  return {
    updated: Utilities.formatDate(new Date(), tz, "yyyy-MM-dd'T'HH:mm:ss"),
    events: events,
    concerts: concerts,
    photos: { lounge: photos_(CONFIG.photoFolders.lounge), study: photos_(CONFIG.photoFolders.study) },
    sensors: readSensors_()
  };
}

function toItem_(ev, cal) {
  var allDay = ev.isAllDayEvent();
  return {
    cal: cal,
    title: ev.getTitle() || '(No title)',
    allDay: allDay,
    start: fmt_(allDay ? ev.getAllDayStartDate() : ev.getStartTime()),
    end: fmt_(allDay ? ev.getAllDayEndDate() : ev.getEndTime())
  };
}

function fmt_(d) { return Utilities.formatDate(d, CONFIG.tz, "yyyy-MM-dd'T'HH:mm:ss"); }

function parseLocal_(s) {
  // midnight in New York as a real Date
  var guess = new Date(s + 'Z');
  var shown = Utilities.formatDate(guess, CONFIG.tz, "yyyy-MM-dd'T'HH:mm:ss");
  return new Date(guess.getTime() - (new Date(shown + 'Z').getTime() - guess.getTime()));
}

function byName_(name) {
  var list = CalendarApp.getCalendarsByName(name);
  return list && list.length ? list[0] : null;
}

/** Image links from a Drive folder. The two photo folders are shared "anyone with the link
    can view", so the TV can load the photos without signing in. */
function photos_(folderName) {
  var it = DriveApp.getFoldersByName(folderName);
  if (!it.hasNext()) return [];
  var files = it.next().getFiles(), urls = [];
  while (files.hasNext() && urls.length < 500) {
    var f = files.next();
    if (f.getMimeType().indexOf('image/') !== 0) continue;
    // Optional focus point saved in the photo's Drive description, e.g. "focus: 0.30, 0.45"
    // (0–1 across, 0–1 down). The screen crops around that spot.
    // ...or in the file name, e.g. "dogs-on-dock__f30x45.jpg" (30% across, 45% down).
    var fx = 0.5, fy = 0.5, n = /__f(\d{1,3})x(\d{1,3})/.exec(f.getName());
    var m = /focus:\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(f.getDescription() || '');
    if (n) { fx = +n[1] / 100; fy = +n[2] / 100; } else if (m) { fx = +m[1]; fy = +m[2]; }
    urls.push({ u: 'https://lh3.googleusercontent.com/d/' + f.getId() + '=w1600', fx: fx, fy: fy, focused: !!(n || m) });
  }
  return urls;
}

/* ── Gates & doors ──
   A SharpTools rule calls this web app whenever a gate or door opens or closes:
     ...exec?sensor=Driveway%20Gate&state=open
   The latest state of each sensor is kept here and handed to the screens. */
function recordSensor_(name, state) {
  name = String(name).trim().slice(0, 60);
  state = String(state).toLowerCase().indexOf('open') === 0 ? 'open' : 'closed';
  var lock = LockService.getScriptLock();
  lock.waitLock(5000);
  try {
    var props = PropertiesService.getScriptProperties(), key = 'sensor:' + name;
    var prev = JSON.parse(props.getProperty(key) || 'null');
    var now = fmt_(new Date());
    var rec = { state: state, since: (prev && prev.state === state) ? prev.since : now, seen: now };
    props.setProperty(key, JSON.stringify(rec));
  } finally { lock.releaseLock(); }
  return { ok: true, name: name, state: state };
}

function readSensors_() {
  var all = PropertiesService.getScriptProperties().getProperties(), list = [];
  Object.keys(all).forEach(function (k) {
    if (k.indexOf('sensor:') !== 0) return;
    var r = JSON.parse(all[k]), name = k.slice(7);
    var kind = /gate/i.test(name) ? 'gate' : (/garage/i.test(name) ? 'garage' : 'door');
    list.push({ name: name, kind: kind, open: r.state === 'open', since: r.since, seen: r.seen });
  });
  return list.sort(function (a, b) { return a.name < b.name ? -1 : 1; });
}

/** Run this once from the editor to grant access and check the output. */
function testFeed() {
  Logger.log(JSON.stringify(buildFeed_()).slice(0, 2000));
}

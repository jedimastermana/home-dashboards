/*
  Dashboard settings — the only file that should ever need editing.
  Both screens read this file.
*/
window.DASH_CONFIG = {
  // Your Google Apps Script feed ("Home Dashboards Feed"):
  // next 3 weeks of events, Concerts · Movies · Shows, photo links, and gate/door sensors.
  feed: 'https://script.google.com/macros/s/AKfycbx9IFbVS2_nbzaYsrNMkza0GOVTkc2SRFeDs3F6CCyMxZp7NRTl4Yz7MvMJ75jIStAX/exec',

  // Location for weather, sunrise/sunset
  lounge: { lat: 41.685, lon: -73.733 },
  study:  { lat: 41.65026, lon: -73.76439 },
  timezone: 'America/New_York',

  // Lounge: sun-based dimming. Full brightness by day; after sunset a gentle dim (duskOpacity)
  // eases in over duskMinutes; the deep dim (deepOpacity) starts at deepStart; back to full
  // over the wakeMinutes before sunrise. (start/end/opacity are the old fixed-schedule fallback,
  // used only until the sunrise/sunset times have loaded.)
  nightDim: { enabled: true, duskOpacity: 0.25, duskMinutes: 45, deepStart: '22:45', deepOpacity: 0.81, wakeMinutes: 30, start: '22:45', end: '06:30', opacity: 0.81 },

  // Lounge: animated weather layer over the screen. Set to false if the Fire Stick struggles.
  weatherEffects: true,

  // Sports card. colors = [primary, secondary] for the win celebration.
  sportsTitle: "Chris' Next Games",
  teams: [
    { name: 'Jets',  abbr: 'NYJ', sport: 'football',   league: 'nfl', espnId: 20, cls: 'nfl',     colors: ['#125740', '#ffffff'] },
    { name: '76ers', abbr: 'PHI', sport: 'basketball', league: 'nba', espnId: 20, cls: 'nba-phi', colors: ['#006BB6', '#ED174C'] }
  ]
};

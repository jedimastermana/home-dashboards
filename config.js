/*
  Dashboard settings — the only file that should ever need editing.
  Both screens read this file.
*/
window.DASH_CONFIG = {
  // Your Google Apps Script feed ("Home Dashboards Feed"):
  // next 3 weeks of events, Concerts · Movies · Shows, and photo links.
  feed: 'https://script.google.com/macros/s/AKfycbx9IFbVS2_nbzaYsrNMkza0GOVTkc2SRFeDs3F6CCyMxZp7NRTl4Yz7MvMJ75jIStAX/exec',

  // Location for weather, sunrise/sunset
  lounge: { lat: 41.685, lon: -73.733 },
  study:  { lat: 41.65026, lon: -73.76439 },
  timezone: 'America/New_York',

  // Lounge: dim the whole screen overnight (24h times, local)
  nightDim: { enabled: true, start: '22:45', end: '06:30', opacity: 0.81 },

  // Lounge: animated weather layer over the screen. Set to false if the Fire Stick struggles.
  weatherEffects: true,

  // Sports card
  sportsTitle: "Chris' Next Games",
  teams: [
    { name: 'Jets',  abbr: 'NYJ', sport: 'football',   league: 'nfl', espnId: 20, cls: 'nfl' },
    { name: '76ers', abbr: 'PHI', sport: 'basketball', league: 'nba', espnId: 20, cls: 'nba-phi' }
  ]
};

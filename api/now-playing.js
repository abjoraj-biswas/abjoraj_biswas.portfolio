const querystring = require('querystring');

const {
  SPOTIFY_CLIENT_ID: client_id,
  SPOTIFY_CLIENT_SECRET: client_secret,
  SPOTIFY_REFRESH_TOKEN: refresh_token,
} = process.env;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const getAccessToken = async () => {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: querystring.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  });

  return response.json();
};

const getNowPlaying = async () => {
  const { access_token } = await getAccessToken();
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();
  return fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};

module.exports = async (req, res) => {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
  if (req.method === 'OPTIONS') {
      return res.status(200).end();
  }

  try {
    let response = await getNowPlaying();

    if (response.status === 204 || response.status > 400) {
      // If nothing is currently playing, fetch recently played
      response = await getRecentlyPlayed();
      if (response.status === 204 || response.status > 400) {
          return res.status(200).json({ isPlaying: false });
      }
      
      const recentData = await response.json();
      if (!recentData.items || recentData.items.length === 0) {
          return res.status(200).json({ isPlaying: false });
      }
      
      const track = recentData.items[0].track;
      return res.status(200).json({
          isPlaying: false,
          title: track.name,
          artist: track.artists.map((_artist) => _artist.name).join(', '),
          album: track.album.name,
          albumImageUrl: track.album.images[0].url,
          songUrl: track.external_urls.spotify,
      });
    }

    const song = await response.json();

    if (song.item === null) {
      return res.status(200).json({ isPlaying: false });
    }

    const isPlaying = song.is_playing;
    const title = song.item.name;
    const artist = song.item.artists.map((_artist) => _artist.name).join(', ');
    const album = song.item.album.name;
    const albumImageUrl = song.item.album.images[0].url;
    const songUrl = song.item.external_urls.spotify;

    res.setHeader(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=30'
    );

    return res.status(200).json({
      album,
      albumImageUrl,
      artist,
      isPlaying,
      songUrl,
      title,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch Spotify status' });
  }
};

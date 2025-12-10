import { NextResponse } from "next/server";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const NOW_PLAYING_ENDPOINT = "https://api.spotify.com/v1/me/player/currently-playing";
const RECENTLY_PLAYED_ENDPOINT = "https://api.spotify.com/v1/me/player/recently-played?limit=1";

async function getAccessToken() {
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token || "",
    }),
  });

  return response.json();
}

async function getNowPlaying(access_token: string) {
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 0 },
  });

  if (response.status === 204 || response.status > 400) {
    return null;
  }

  return response.json();
}

async function getRecentlyPlayed(access_token: string) {
  const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    console.error("Recently played error:", response.status, await response.text());
    return null;
  }

  return response.json();
}

export async function GET() {
  const { access_token } = await getAccessToken();
  const data = await getNowPlaying(access_token);

  if (data && data.item) {
    const isPlaying = data.is_playing;
    const title = data.item.name;
    const artist = data.item.artists.map((a: { name: string }) => a.name).join(", ");
    const album = data.item.album.name;
    const albumImageUrl = data.item.album.images[0]?.url;
    const songUrl = data.item.external_urls.spotify;

    return NextResponse.json({
      isPlaying,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    });
  }

  // Fallback to recently played
  const recentData = await getRecentlyPlayed(access_token);

  if (recentData && recentData.items && recentData.items.length > 0) {
    const track = recentData.items[0].track;
    const title = track.name;
    const artist = track.artists.map((a: { name: string }) => a.name).join(", ");
    const album = track.album.name;
    const albumImageUrl = track.album.images[0]?.url;
    const songUrl = track.external_urls.spotify;

    return NextResponse.json({
      isPlaying: false,
      title,
      artist,
      album,
      albumImageUrl,
      songUrl,
    });
  }

  return NextResponse.json({ isPlaying: false });
}

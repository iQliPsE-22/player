"use client";
import React, { useRef } from "react";
import Player from "../components/Player";

export default function Home() {
  const streamUrl =
    "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8";

  const playerRef = useRef(null);

  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: streamUrl,
        type: "application/x-mpegURL",
      },
    ],
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here
    player.on("waiting", () => {
      videojs.log("Player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("Player will dispose");
    });
  };

  return (
    <main className="min-h-dvh flex flex-col gap-8 items-center justify-center">
      <h1 className="text-2xl">HLS Video Player</h1>
      <Player options={videoJsOptions} onReady={handlePlayerReady} />
    </main>
  );
}

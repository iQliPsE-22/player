"use client";
import React, { useRef } from "react";
import Player from "../components/Player";

const markers = [
  { time: 5, text: "Intro", color: "#FF6900" },
  { time: 15, text: "Checkpoint 1", color: "#00d084" },
  { time: 45, text: "Important scene", color: "#FF6900" },
  { time: 100, text: "Important scene", color: "#4c00ffff" },
];

const rects = [
  {
    time: 5,
    start: {
      x: 0.13228962519397475,
      y: 0.24425086576348815,
    },
    end: {
      x: 0.4551859069943661,
      y: 0.6972125382373557,
    },
    label: "apple",
    color: "#FF6900",
  },
  {
    time: 15,
    start: {
      x: 0.5810945283121137,
      y: 0.37738358525109134,
    },
    end: {
      x: 0.8335820905011685,
      y: 0.6567627426790292,
    },
    label: "cat",
    color: "#FF6900",
  },
  {
    time: 45,
    start: {
      x: 0.47288557308823315,
      y: 0.10909090232426205,
    },
    end: {
      x: 0.6208955233369894,
      y: 0.1955654034329095,
    },
    label: "tree",
    color: "#00d084",
  },
  {
    time: 100,
    start: {
      x: 0.5810945283121137,
      y: 0.37738358525109134,
    },
    end: {
      x: 0.8335820905011685,
      y: 0.6567627426790292,
    },
    label: "cat",
    color: "#00d084",
  },
];

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
        spriteThumbnails: {
          // This is passed per-source
          url: "/thumb.jpg",
          width: 160,
          height: 90,
          columns: 10,
          interval: 1,
        },
      },
    ],
    plugins: {
      // Defaults for any source that has no spriteThumbnails set
      spriteThumbnails: {
        url: "/thumb.jpg",
        width: 160,
        height: 90,
        columns: 10,
        interval: 1,
      },
    },
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here
    player.on("waiting", () => {
      console.log("Player is waiting");
    });

    player.on("dispose", () => {
      console.log("Player will dispose");
    });
  };

  return (
    <main className="min-h-dvh flex flex-col gap-8 items-center justify-center">
      <h1 className="text-2xl">HLS Video Player</h1>
      <Player
        options={videoJsOptions}
        onReady={handlePlayerReady}
        markers={markers}
        rects={rects}
      />
    </main>
  );
}

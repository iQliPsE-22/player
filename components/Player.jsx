"use client";
import React, { useRef, useEffect } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import RectCanvas from "./RectCanvas";

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
    time: 10,

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
    time: 15,

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
];

export const Player = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && !playerRef.current) {
      // Create Video.js player instance
      const player = videojs(videoRef.current, options, () => {
        videojs.log("Player is ready");
        if (onReady) onReady(player);
      });

      playerRef.current = player;
    } else {
      // If player already exists, just update the source
      const player = playerRef.current;
      if (player) {
        player.autoplay(options.autoplay);
        player.src(options.sources);
      }
    }

    // Dispose of the Video.js player on cleanup
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <RectCanvas rects={rects}>
      <div data-vjs-player>
        <video ref={videoRef} className="video-js vjs-big-play-centered" />
      </div>
    </RectCanvas>
  );
};

export default Player;

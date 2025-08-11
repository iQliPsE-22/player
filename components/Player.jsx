"use client";
import React, { useRef, useEffect, useState } from "react";
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
  {
    time: 30,
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

export const Player = ({ options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      const videojs = (await import("video.js")).default;
      // load the sprite thumbnails plugin only on client
      await import("videojs-sprite-thumbnails");

      if (!isMounted || !videoRef.current || playerRef.current) return;

      const player = videojs(videoRef.current, options, () => {
        videojs.log("Player is ready");
        onReady?.(player);
      });

      playerRef.current = player;

      // your timeupdate logic for RectCanvas
      const onTime = () => setCurrentTime(player.currentTime());
      player.on("timeupdate", onTime);

      // --- Thumbnails: pick ONE of the configs below ---

      // A) Single sprite image (thumbnails at 1s interval, 10 columns)
      player.spriteThumbnails({
        url: "/thumb.jpg",
        width: 160,
        height: 90,
        columns: 10, // REQUIRED
        interval: 1, // default is 1s; set if your sprite cadence differs
      });

      // B) Multiple sprites via template (e.g., thumbs-0.jpg, thumbs-1.jpg, ...)
      // player.spriteThumbnails({
      //   url: "/thumbs-{index}.jpg",
      //   columns: 5,
      //   rows: 5,        // rows>0 signals a sequence
      //   width: 160,
      //   height: 90,
      //   interval: 3,    // one thumb every 3s
      // });

      // C) Explicit list of images
      // player.spriteThumbnails({
      //   urlArray: ["/t-0001.jpg", "/t-0002.jpg", "/t-0003.jpg"],
      //   columns: 5,
      //   rows: 5,
      //   width: 160,
      //   height: 90,
      // });

      // cleanup
      player.one("dispose", () => player.off("timeupdate", onTime));
    })();

    return () => {
      isMounted = false;
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [options, onReady]);

  return (
    <RectCanvas rects={rects} currentTime={currentTime}>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered"
          playsInline
        />
      </div>
    </RectCanvas>
  );
};

export default Player;

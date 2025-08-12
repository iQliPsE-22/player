"use client";
import React, { useRef, useEffect, useState } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import RectCanvas from "./RectCanvas";

export const Player = ({ options, onReady, markers, rects }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const markersContainerRef = useRef(null);
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
      const buildMarkers = () => {
        const duration = player.duration();
        if (!duration || !isFinite(duration)) return;

        // Find the seek bar DOM
        const seekBarEl = player.controlBar?.progressControl?.seekBar?.el?.();
        if (!seekBarEl) return;

        // Container (we recreate each render to keep it simple)
        // Remove old container if any
        if (markersContainerRef.current?.parentNode) {
          markersContainerRef.current.parentNode.removeChild(
            markersContainerRef.current
          );
        }

        const container = document.createElement("div");
        container.className = "vjs-custom-markers";
        markersContainerRef.current = container;

        // Absolute overlay inside the seek bar
        Object.assign(container.style, {
          position: "absolute",
          left: "0",
          right: "0",
          top: "0",
          bottom: "0",
          pointerEvents: "none", // markers themselves will set pointer events
        });

        // Ensure seekBar is positioned
        const seekBarStyle = seekBarEl.style;
        if (!seekBarStyle.position) seekBarStyle.position = "relative";

        // Add each marker
        markers.forEach((m) => {
          if (m.time < 0 || m.time > duration) return;

          const pct = (m.time / duration) * 100;

          const mark = document.createElement("div");
          mark.className = "vjs-custom-marker";
          Object.assign(mark.style, {
            position: "absolute",
            left: `calc(${pct}% - 2px)`,
            top: "0",
            width: "4px",
            height: "100%",
            background: m.color || "red",
            borderRadius: "2px",
            pointerEvents: "auto",
            cursor: "pointer",
          });

          // Tooltip
          const tip = document.createElement("div");
          tip.className = "vjs-custom-marker-tip";
          tip.textContent = m.text ?? `${Math.round(m.time)}s`;
          Object.assign(tip.style, {
            position: "absolute",
            bottom: "100%",
            left: "50%",
            transform: "translate(-50%, -6px)",
            whiteSpace: "nowrap",
            padding: "4px 6px",
            fontSize: "12px",
            borderRadius: "4px",
            background: "rgba(0,0,0,0.8)",
            color: "#fff",
            opacity: "0",
            pointerEvents: "none",
            transition: "opacity 120ms ease",
          });

          mark.addEventListener("mouseenter", () => (tip.style.opacity = "1"));
          mark.addEventListener("mouseleave", () => (tip.style.opacity = "0"));
          mark.addEventListener("click", (e) => {
            e.stopPropagation();
            player.currentTime(m.time);
          });

          mark.appendChild(tip);
          container.appendChild(mark);
        });

        seekBarEl.appendChild(container);
      };

      // Build once ready
      const onLoadedMeta = () => buildMarkers();
      const onDurationChange = () => buildMarkers();
      player.on("loadedmetadata", onLoadedMeta);
      player.on("durationchange", onDurationChange);

      // Rebuild on resize (progress bar width changes)
      const onPlayerResize = () => buildMarkers();
      player.on("playerresize", onPlayerResize);

      // Cleanup
      player.one("dispose", () => {
        player.off("loadedmetadata", onLoadedMeta);
        player.off("durationchange", onDurationChange);
        player.off("playerresize", onPlayerResize);
      });
      buildMarkers();
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

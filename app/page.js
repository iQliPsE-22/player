"use client";
import React, { useRef } from "react";
import Player from "../components/Player";
import { Video, User } from "lucide-react";
import Image from "next/image";
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

const sidebar = ["Live Camera View", "Camera Feed", "Heatmap View"];

const data = [
  {
    name: "Prashanth",
    id: "#1253",
    incident: "Hardhat Missing",
    time: "2025-08-11 16:00:34",
    risk: "Low Risk",
  },
  {
    name: "Karthik",
    id: "#1125",
    incident: "No Vest",
    time: "2025-08-11 16:00:34",
    risk: "Medium Risk",
  },
  {
    name: "Prashanth",
    id: "#1253",
    incident: "Fall Incident",
    time: "2025-08-11 16:00:34",
    risk: "High Risk",
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
    <main className="min-h-dvh flex flex-row bg-white">
      <aside className="bg-[#f5f5f5] hidden lg:block w-fit border-r border-[#E9EAEB] overflow-y-auto hide-scrollbar">
        <div className="pt-8 h-full w-[268px] flex flex-col gap-1 font-semibold ">
          <div className="px-4 py-3 text-[#A4A7AE] flex flex-row gap-2 items-center">
            <Video size={20} />
            <h4>Monitoring</h4>
          </div>
          {sidebar.map((item, index) => (
            <div
              key={index}
              className="pl-[42px] py-2 pr-3 text-[#535862] text-base p-4"
            >
              {item}
            </div>
          ))}
        </div>
      </aside>
      <div className="flex-1 w-full h-full bg-white px-[34px]">
        <h4 className="font-semibold text-[24px] text-black mb-3">
          Camera - 15 Packaging Area
        </h4>
        <Player
          options={videoJsOptions}
          onReady={handlePlayerReady}
          markers={markers}
          rects={rects}
        />
        <div
          className="p-5 mt-3 rounded-[12px] border border-[#E9EAEB]"
          style={{ boxShadow: "0 1px 2px 0 rgba(10, 13, 18, 0.05)" }}
        >
          <h4 className="font-semibold text-[20px] text-black">
            Violation Feed
          </h4>
          <table className="mt-3 w-full border-collapse">
            <tbody className="text-sm">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className="border font-medium border-[#E9EAEB] rounded-[8px] bg-[#FDFDFD]"
                >
                  <td className="py-4 px-8 text-[#252B37] font-semibold min-w-[120px]">
                    {item.name}
                    <p className="text-[#535862] font-medium">ID {item.id}</p>
                  </td>
                  <td className="py-4 px-8 text-[#535862]">{item.incident}</td>
                  <td className="py-4 px-8 text-[#535862]">{item.time}</td>
                  <td
                    className={`py-4 px-8 ${
                      item.risk === "Low Risk"
                        ? "text-[#F79009]"
                        : item.risk === "Medium Risk"
                        ? "text-[#DC6803]"
                        : "text-[#B42318]"
                    }`}
                  >
                    {item.risk}
                  </td>
                  <td>
                    <button className="px-3 py-2 border border-[#D5D7DA]  rounded-[8px]">
                      <User size={16} className="text-[#535862]" />
                    </button>
                    <button className="ml-4 px-3 py-2 bg-[#7D48DF] rounded-[8px] border-2">
                      <Image
                        src="/CircleCheck.svg"
                        alt="Circle Check"
                        height={16}
                        width={16}
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}

"use client";

import { useEffect, useRef } from "react";
import "./playground.css";
import { useRedBallStore } from "@/app/stores/redBallStore";
import { usePlaygroundStore } from "@/app/stores/playgroundStore";

export default function Playground(){
  const playgroundContainer = useRef<HTMLDivElement>(null);
  const { width: playgroundWidth, height: playgroundHeight, setSize: setPlaygroundSize } = usePlaygroundStore();
  const { x: ballX, y: ballY } = useRedBallStore();

  function updatePlaygroundSize(){
    const rect = playgroundContainer.current!.getBoundingClientRect();
    setPlaygroundSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
  }

  useEffect(() => {
    if (!playgroundContainer.current) return;

    const resizeObserver = new ResizeObserver(updatePlaygroundSize);
    resizeObserver.observe(playgroundContainer.current);

    return () => resizeObserver.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div id="playground" className="bg-slate-900 grow w-full h-screen relative overflow-hidden" ref={playgroundContainer}>
      <div className="fixed top-2 right-2 text-white border border-slate-600 bg-slate-800 p-2" id="data">
        <p><span>Playground Width</span>{playgroundWidth}</p>
        <p><span>Playground Height</span>{playgroundHeight}</p>
        <p><span>Ball X</span>{ballX}</p>
        <p><span>Ball Y</span>{ballY}</p>
      </div>
      
      <div id="ball"
        style={{
          left: `${ballX}px`,
          top: `${ballY}px`,
        }}></div>
    </div>
  )
}
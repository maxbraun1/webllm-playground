"use client";

import { useEffect } from "react";
import Playground from "./_components/playground/playground";
import Sidebar from "./_components/sidebar";
import { initEngine } from "./lib/engine/engine";
import { useEngineStore } from "./stores/engineStore";
import { LoaderCircle } from "lucide-react";

export default function Home() {
  useEffect(() => {
    initEngine();
  }, []);

  const loading = useEngineStore(state => state.loading);
  const progressData = useEngineStore(state => state.progressData);

  if(loading) return (
    <div className="bg-slate-800 absolute top-0 bottom-0 left-0 right-0 w-full flex flex-col items-center justify-center gap-2 px-12 text-white">
      <LoaderCircle className="animate-spin" size={25} />
      <p className="text-center text-sm opacity-80">{progressData?.text || "Loading..."}</p>
    </div>
  )

  return (
    <div>
      <main className="flex w-full">
        <Sidebar />
        <Playground />
      </main>
    </div>
  );
}

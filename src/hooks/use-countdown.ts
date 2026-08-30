import { useEffect } from "react";

import { useGameStore } from "@/store/game-store";

export function useCountdown(active: boolean) {
  const syncTimer = useGameStore((state) => state.syncTimer);

  useEffect(() => {
    if (!active) return;

    const update = () => syncTimer(Date.now());
    update();
    const intervalId = window.setInterval(update, 200);
    document.addEventListener("visibilitychange", update);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", update);
    };
  }, [active, syncTimer]);
}

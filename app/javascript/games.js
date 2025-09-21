// 共通処理を読み込む
import { startGame } from "./game_common";

document.addEventListener("turbo:load", () => {
  const path = window.location.pathname;

  if (path.includes("/games/sanma")){
    startGame(() => 10, {modeName: "sanma", showIdeal: true, realtimeImage: true, kuriMode: false });
  }

  if (path.includes("/games/yakiimo")) {
    startGame(() => 10, { modeName: "yakiimo", showIdeal: false, realtimeImage: false, kuriMode: false });
  }

  if (path.includes("/games/kuri")) {
    const randomKuriTime = () => {
      // 配列を直接列挙してる、要リファクタリング
      const steps = [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];
      return steps[Math.floor(Math.random() * steps.length)];
    };
    startGame(randomKuriTime, {
      modeName: "kuri",
      showIdeal: false,
      realtimeImage: false,
    });
  }
});
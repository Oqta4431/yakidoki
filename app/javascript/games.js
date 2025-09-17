// 共通処理を読み込む
import { startGame } from "./game_common";

document.addEventListener("turbo:load", () => {
  const path = window.location.pathname;

  if (path.includes("/games/sanma")){
    startGame(() => 10, {modeName: "サンマ🐟", showIdeal: true, realtimeImage: true });
  }

  if (path.includes("/games/yakiimo")) {
    startGame(() => 10, { modeName: "焼き芋🍠", showIdeal: false, realtimeImage: false });
  }
} );
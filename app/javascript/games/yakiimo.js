// 共通処理を読み込む
import { startGame } from "../game_common"

// DOM読み込みが完了したら焼き芋モードを開始する
document.addEventListener("DOMContentLoaded", () => {
  // 設定時間10秒、モード名「焼き芋🍠」、目標秒数を表示しない設定
  startGame(() => 10, { modeName: "焼き芋🍠", showIdeal: false });
});

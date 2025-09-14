// 共通処理を読み込む
import { startGame } from "../game_common"

// DOM読み込みがか完了したらサンマモードを開始する
document.addEventListener("DOMContentLoaded", () => {
  // 設定時間10秒、モード名「サンマ🐟」、目標秒数を表示する設定
  startGame(() => 10, { modeName: "サンマ🐟", showIdeal: true });
});

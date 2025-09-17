// 他のモードからも共通で呼び出せる関数をエクスポートする
export function startGame(getIdealTime, { modeName, showIdeal = false, realtimeImage = true }) {
  console.log("DEBUG: startGame triggered"); //デバッグ用
  // ボタン、表示用要素を取得
  const button = document.getElementById("start-btn");
  const result = document.getElementById("result");
  const idealDisplay = document.getElementById("ideal-time");
  const timerDisplay = document.getElementById("timer"); // 経過時間表示用
  const image = document.getElementById("food-image");   // 画像表示用

  // 計測開始時刻、タイマーID、スペースキー押下フラグを保持する変数
  let startTime;
  let intervalId;
  let isSpacePressed = false;

  // // 目標秒数を画面に表示する（showIdeal = true のときだけ）
  // if (showIdeal && idealDisplay) {
  //   idealDisplay.textContent = `目標: ${getIdealTime()} 秒`;
  // }
  // else{
  //   idealDisplay.textContent = `目標: ?? 秒`;
  // }

  // ↑のデバッグ用
  console.log("DEBUG showIdeal:", showIdeal, "idealDisplay:", idealDisplay);
  if (showIdeal && idealDisplay) {
    console.log("DEBUG -> setting real value");
    idealDisplay.textContent = `目標: ${getIdealTime()} 秒`;
  }
  else {
    console.log("DEBUG -> setting ?? 秒");
    idealDisplay.textContent = `目標: ?? 秒`;
  }


  // ボタン押下開始時の処理
  const startHandler = () => {
    console.log("DEBUG: startHandler triggered"); //デバッグ用
    startTime = performance.now();        // 現在時刻を保存
    result.textContent = "焼き中…🔥";      // 状態メッセージを表示
    button.classList.add("bg-amber-700"); // 押下中にボタンの色を変更

    // 画像の初期化
    if(image)   image.src = image.dataset.raw;

    let currentState = null; // いま表示している状態を保持

    // 経過時間を0.01秒単位で更新するタイマーを起動
    intervalId = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000; // 経過秒数
      timerDisplay.textContent = `${elapsed.toFixed(2)} 秒`;  // 画面に表示

      if (realtimeImage && image) {
        // 経過時間によって画像ステータスを変更
        let newState;
        if (elapsed < 8.0)        newState = "raw";
        else if (elapsed < 9.5)   newState = "half";
        else if (elapsed <= 10.5) newState = "good";
        else if (elapsed <= 12.0) newState = "almost";
        else                      newState = "burnt";

        // 状態が変わったときだけsrcを更新
        if (newState !== currentState){
          image.src = image.dataset[newState];
          currentState = newState;
        }
      }
    }, 10); // 10msごとに更新（=0.01秒単位）
  };

  // ボタン押下終了時の処理
  const endHandler = () => {
    clearInterval(intervalId);                // タイマーを止める
    button.classList.remove("bg-amber-700");  // 押下中の色を解除

    // 実際に押していた時間を計算
    const endTime = performance.now();
    const diff = (endTime - startTime) / 1000;
    const ideal = getIdealTime();
    const gap = Math.abs(diff - ideal);

    // 誤差に応じて結果メッセージを決定
    let message;
    if (gap < 0.5) {
      message = `✨ 大成功！ ${diff.toFixed(2)}秒`;
    } else if (gap < 2) {
      message = `まぁまぁ… ${diff.toFixed(2)}秒`;
    } else {
      message = `💀 失敗！ ${diff.toFixed(2)}秒`;
    }

    // 結果を画面に表示
    result.innerHTML = message;

    if (!realtimeImage && image) {
      let newState;
      // TODO：焼き芋画像が出来たら名前を修正
      if (diff < 8.0)       newState = "raw";
      else if(diff < 9.5)   newState = "half";
      else if(diff < 10.5)  newState = "good";
      else if(diff < 12.0)  newState = "almost";
      else                  newState = "burnt";
      image.src = image.dataset[newState];
    }
  };

  // ---イベント登録---
  // マウス操作
  button.addEventListener("mousedown", startHandler);
  button.addEventListener("mouseup", endHandler);

  // スマホタッチ操作
  button.addEventListener("touchstart", startHandler);
  button.addEventListener("touchend", endHandler);

  // スペースキー押下開始
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isSpacePressed) {
      isSpacePressed = true;
      startHandler();
      e.preventDefault();
    }
  });

  // スペースキー押下終了
  document.addEventListener("keyup", (e) => {
    if (e.code === "Space" && isSpacePressed) {
      isSpacePressed = false;
      endHandler();
      e.preventDefault();
    }
  });
}

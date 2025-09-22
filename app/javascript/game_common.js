export function startGame(getIdealTime, {

  modeName,
  showIdeal = false,
  showTimer = true,
  realtimeImage = true

}) {

  const button = document.getElementById("start-btn");
  const result = document.getElementById("result");
  const idealDisplay = document.getElementById("ideal-time");
  const timerDisplay = document.getElementById("timer");
  const image = document.getElementById("food-image");
  let totalElapsed = 0;
  let simulatedElapsed;

  let startTime = null;
  let intervalId =  null;
  let isSpacePressed = false;
  let currentIdeal = getIdealTime();

  if (showIdeal && idealDisplay) {
    idealDisplay.textContent = `目標: ${currentIdeal} 秒`;
  }
  else {
    if (modeName === "kuri"){
      idealDisplay.textContent = `目標: ランダム(8~12秒)`;
      timerDisplay.textContent = `焼いてみよう！`;
    }
    else if(modeName === "yakiimo"){
      idealDisplay.textContent = `目標: ?? 秒`;
      timerDisplay.textContent = `焼いてみよう！`;
    }
  }

  const resetForNext = () =>{
    clearInterval(intervalId);
    startTime = null;
    intervalId = null;
    totalElapsed = 0;
    simulatedElapsed = 0;
    if (image) image.src = image.dataset.raw;
    if (timerDisplay) timerDisplay.textContent = "0.00 秒";
    if (result) result.textContent = "";
    currentIdeal = getIdealTime();
    if (showIdeal && idealDisplay) {
      idealDisplay.textContent = `目標: ${currentIdeal} 秒`;
    }
  };

  const startHandler = () => {
    if (startTime === null && result?.textContent) {
      resetForNext();
    }

    if (intervalId) return;
    startTime = performance.now();
    result.textContent = "焼き中…🔥";
    button.classList.add("bg-amber-700");
    button.textContent = "🔥 長押しして焼こう！";

    if (image)   image.src = image.dataset.raw;
    if (modeName === "yakiimo" && image ) image.src = image.dataset.burning;
    if (modeName === "kuri" && image ) image.src = image.dataset.burning;

    let currentState = null;

    intervalId = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      simulatedElapsed = totalElapsed + elapsed;

      if (showTimer){
        if (timerDisplay) timerDisplay.textContent = `${simulatedElapsed.toFixed(2)} 秒`;
      }
      else timerDisplay.textContent = "焼き中...🔥";

      if ((modeName === "kuri") && simulatedElapsed > currentIdeal) {
        clearInterval(intervalId);
        intervalId = null;
        if (image) image.src = image.dataset.burnt;
        result.textContent = "💥 爆発！";
        timerDisplay.textContent = "💥 爆発！";
        button.classList.remove("bg-amber-700");
        button.textContent = "🔥 もう一度焼いてみよう！";
        startTime = null;
        totalElapsed = 0;
        return;
      }

      if ((modeName !== "kuri") && realtimeImage && image) {
        let newState;
        if (elapsed < 8.0)        newState = "raw";
        else if (elapsed < 9.5)   newState = "half";
        else if (elapsed <= 10.5) newState = "good";
        else if (elapsed <= 12.0) newState = "almost";
        else                      newState = "burnt";

        if (newState !== currentState){
          image.src = image.dataset[newState];
          currentState = newState;
        }
      }
    }, 10);
  };

  const endHandler = () => {
    if (!startTime) return;
    clearInterval(intervalId);
    intervalId = null;
    button.classList.remove("bg-amber-700");

    const endTime = performance.now();
    const diff = (endTime - startTime) / 1000;

    totalElapsed += diff;

    if (modeName === "kuri") {
      if (totalElapsed < currentIdeal - 0.5) {
        timerDisplay.textContent = `まだ焼ける！(${totalElapsed.toFixed(2)}秒)`;
        if (image) image.src = image.dataset.raw;
      }
      else if (totalElapsed <= currentIdeal) {
        timerDisplay.textContent = "✨ 美味しそう！";
        startTime = null;
        if (image) image.src = image.dataset.good;
        button.textContent = "🔥 もう一度焼いてみよう！";
      }

      return;
    }

    let message;

    if (diff < 8.0){
      message = `🙅  生すぎ！\n${diff.toFixed(2)}秒`;
    }
    else if(diff < 9.5){
      message = `🤏 半生！\n${diff.toFixed(2)}秒`;
    }
    else if(diff < 10.5){
      message = `✨ 美味しそう！\n${diff.toFixed(2)}秒`;
    }
    else if(diff < 12.0){
      message = `🤨 ちょい焦げ！\n${diff.toFixed(2)}秒`;
    }
    else{
      message = `💀 黒焦げ\n${diff.toFixed(2)}秒`;
    }

    timerDisplay.textContent = message;
    button.textContent = "🔥 もう一度焼いてみよう！";
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

    startTime = null;
  };

  // ---イベント登録---
  // ↓touchイベントとmouseイベントはどちらも書くと同時発火するので使用しない
  // // マウス操作
  // button.addEventListener("mousedown", startHandler);
  // button.addEventListener("mouseup", endHandler);

  // // スマホタッチ操作
  // button.addEventListener("touchstart", startHandler);
  // button.addEventListener("touchend", endHandler);

  // pointerイベントに統一する↓
  // ---イベント登録（Pointer Events に一本化）---
  // 指/マウス/ペンすべてこれで対応
  button.addEventListener("pointerdown", (e) => {
    // スクロール・長押しメニュー抑制
    e.preventDefault();
    startHandler();
  });

  button.addEventListener("pointerup", (e) => {
    e.preventDefault();
    endHandler();
  });

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

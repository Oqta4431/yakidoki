export function startGame(getIdealTime, {

  modeName,
  showIdeal = false,
  realtimeImage = true

}) {

  console.log("DEBUG: startGame triggered"); //デバッグ用
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

  console.log("DEBUG showIdeal:", showIdeal, ", idealDisplay:", idealDisplay);
  if (showIdeal && idealDisplay) {
    console.log("DEBUG -> setting real value");
    idealDisplay.textContent = `目標: ${currentIdeal} 秒`;
  }
  else {
    console.log("DEBUG -> setting ?? 秒");
    if (modeName === "kuri") idealDisplay.textContent = `目標: ランダム(8~12秒)`;
    else if(modeName === "yakiimo") idealDisplay.textContent = `目標: ?? 秒`;
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
    console.log("currentIdeal:", currentIdeal)
    if (startTime === null && result?.textContent) {
      resetForNext();
    }

    if (intervalId) return;
    console.log("DEBUG: startHandler triggered");
    startTime = performance.now();
    result.textContent = "焼き中…🔥";
    button.classList.add("bg-amber-700");

    if (image)   image.src = image.dataset.raw;

    let currentState = null;

    intervalId = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      simulatedElapsed = totalElapsed + elapsed;
      if (timerDisplay) timerDisplay.textContent = `${simulatedElapsed.toFixed(2)} 秒`;

      if ((modeName === "kuri") && simulatedElapsed > currentIdeal) {
        console.log("DEBUG startHandler -> kuriMode");
        clearInterval(intervalId);
        intervalId = null;
        if (image) image.src = image.dataset.burnt;
        result.textContent = "💥 爆発！";
        button.classList.remove("bg-amber-700");
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

    console.log("DEBUG endHandler totalElapsed:",totalElapsed);

    if (modeName === "kuri") {
      console.log("DEBUG endHandler -> kuriMode");
      if (totalElapsed < currentIdeal - 0.5) {
        result.textContent = "まだ焼ける！";
        if (image) image.src = image.dataset.raw;
      }
      else if (totalElapsed <= currentIdeal) {
        result.textContent = "✨ 美味しそう！";
        startTime = null;
        if (image) image.src = image.dataset.good;
      }

      return;
    }

    let message;

    if (diff < 8.0)       message = `🐟️  生すぎ！ ${diff.toFixed(2)}秒`;
    else if(diff < 9.5)   message = `🤏 半生！ ${diff.toFixed(2)}秒`;
    else if(diff < 10.5)  message = `✨ 美味しそう！ ${diff.toFixed(2)}秒`;
    else if(diff < 12.0)  message = `🔥 ちょい焦げ！ ${diff.toFixed(2)}秒`;
    else                  message = `💀 黒焦げ ${diff.toFixed(2)}秒`;

    result.innerHTML = message;

    if (!realtimeImage && image) {
      console.log("DEBUG -> elseMode");
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

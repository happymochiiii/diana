const copyBtn2 = document.getElementById("copyBtn2");
const copyMsg2 = document.getElementById("copyMsg2");
const voucherCode2 = document.getElementById("voucherCode2");

const flames = document.getElementById("flames");
const song = document.getElementById("birthdaySong");
const blowBtn = document.getElementById("blowBtn");
const redeemBtn = document.getElementById("redeemBtn");

const cakeCandles = document.getElementById("cakeCandles");
const cakeScreen = document.getElementById("cakeScreen");
const giftScreen = document.getElementById("giftScreen");

const copyBtn = document.getElementById("copyBtn");
const copyMsg = document.getElementById("copyMsg");
const voucherCode = document.getElementById("voucherCode");

let songStarted = false;
let scratchReady = false;

document.body.addEventListener("click", () => {
  if (!songStarted) {
    song.play();
    songStarted = true;
  }
});

let candleBlown = false;
let micStarted = false;

function blowOutCandle() {
  if (candleBlown) return;

  candleBlown = true;

  flames.classList.add("out");
  blowBtn.classList.add("hidden");

  setTimeout(() => {
    redeemBtn.classList.remove("hidden");
  }, 900);
}

blowBtn.addEventListener("click", async () => {
  if (micStarted) return;

  micStarted = true;
  blowBtn.textContent = "💨 Blow now...";

  // paksa lagu start masa button ditekan
  song.play();

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    await audioContext.resume();

    const microphone = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 256;
    microphone.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);

      let total = 0;

      for (let i = 0; i < dataArray.length; i++) {
        total += dataArray[i];
      }

      const volume = total / dataArray.length;

      console.log("volume:", volume);

      if (volume > 25) {
        blowOutCandle();
        stream.getTracks().forEach(track => track.stop());
        return;
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();

  } catch (error) {
    console.log(error);
    blowBtn.textContent = "Click to Blow Candle";
    blowBtn.addEventListener("click", blowOutCandle, { once: true });
  }
});

redeemBtn.addEventListener("click", () => {

  cakeScreen.classList.remove("active");
  giftScreen.classList.add("active");

  if (!scratchReady) {
    setupScratchCard("scratchCanvas");
    setupScratchCard("scratchCanvas2");
    scratchReady = true;
  }

});

copyBtn.addEventListener("click", () => {

  navigator.clipboard.writeText(voucherCode.textContent);

  copyMsg.classList.remove("hidden");

  setTimeout(() => {
    copyMsg.classList.add("hidden");
  }, 1800);

});

copyBtn2.addEventListener("click", () => {

  navigator.clipboard.writeText(voucherCode2.textContent);

  copyMsg2.classList.remove("hidden");

  setTimeout(() => {
    copyMsg2.classList.add("hidden");
  }, 1800);

});


function setupScratchCard(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const card = canvas.parentElement;

  canvas.width = card.offsetWidth;
  canvas.height = card.offsetHeight;

  const img = new Image();

img.onload = () => {

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 248, 230, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

};

img.src = "floral.jpg";

  let isDrawing = false;

  function getPosition(e) {
    const rect = canvas.getBoundingClientRect();

    if (e.touches && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  }

  function scratch(e) {
    if (!isDrawing) return;

    e.preventDefault();

    const pos = getPosition(e);

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
    ctx.fill();
  }

  canvas.addEventListener("mousedown", () => {
    isDrawing = true;
  });

  canvas.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
  });

  canvas.addEventListener("mousemove", scratch);

  canvas.addEventListener("touchstart", () => {
    isDrawing = true;
  });

  canvas.addEventListener("touchend", () => {
    isDrawing = false;
  });

  canvas.addEventListener("touchmove", scratch);
}
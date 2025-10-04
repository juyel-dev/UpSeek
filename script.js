const wheel = document.getElementById('wheel');
const speedInput = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');

let rotation = 0;
let speed = parseInt(speedInput.value);

// রিয়েল টাইমে ঘূর্ণন
function rotateWheel() {
  rotation += speed;
  rotation %= 360; // 360 ডিগ্রি পার হলে আবার শুরু হবে
  wheel.style.transform = `rotate(${rotation}deg)`;
  requestAnimationFrame(rotateWheel);
}

// স্পিড পরিবর্তন
speedInput.addEventListener('input', () => {
  speed = parseInt(speedInput.value);
  speedValue.textContent = speed;
});

rotateWheel();

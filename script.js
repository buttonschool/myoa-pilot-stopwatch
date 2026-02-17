(function () {
  const display = document.getElementById('display');
  const startPauseBtn = document.getElementById('startPause');
  const resetBtn = document.getElementById('reset');
  const lapBtn = document.getElementById('lap');
  const lapListEl = document.getElementById('lapList');

  let running = false;
  let accumulatedMs = 0;
  let startedAt = 0;
  let intervalId = null;
  let laps = [];

  function formatTime(totalMs) {
    const cs = Math.floor((totalMs / 10) % 100);
    const sec = Math.floor((totalMs / 1000) % 60);
    const min = Math.floor(totalMs / 60000);
    return (
      String(min).padStart(2, '0') + ':' +
      String(sec).padStart(2, '0') + '.' +
      String(cs).padStart(2, '0')
    );
  }

  function refreshDisplay() {
    const totalMs = running
      ? accumulatedMs + (Date.now() - startedAt)
      : accumulatedMs;
    display.textContent = formatTime(totalMs);
  }

  function renderLapList() {
    lapListEl.innerHTML = '';
    laps.forEach(function (timeMs, index) {
      const li = document.createElement('li');
      const label = document.createElement('span');
      label.textContent = 'Lap ' + (index + 1);
      const timeSpan = document.createElement('span');
      timeSpan.className = 'lap-time';
      timeSpan.textContent = formatTime(timeMs);
      li.appendChild(label);
      li.appendChild(timeSpan);
      lapListEl.appendChild(li);
    });
  }

  function start() {
    if (running) return;
    startedAt = Date.now();
    running = true;
    lapBtn.disabled = false;
    startPauseBtn.textContent = 'Pause';
    intervalId = setInterval(refreshDisplay, 10);
  }

  function pause() {
    if (!running) return;
    running = false;
    lapBtn.disabled = true;
    accumulatedMs += Date.now() - startedAt;
    startPauseBtn.textContent = 'Start';
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    refreshDisplay();
  }

  function reset() {
    running = false;
    accumulatedMs = 0;
    laps = [];
    lapBtn.disabled = true;
    startPauseBtn.textContent = 'Start';
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
    display.textContent = '00:00.00';
    renderLapList();
  }

  lapBtn.disabled = true;

  startPauseBtn.addEventListener('click', function () {
    if (running) pause();
    else start();
  });
  resetBtn.addEventListener('click', reset);
  lapBtn.addEventListener('click', function () {
    if (!running) return;
    const totalMs = accumulatedMs + (Date.now() - startedAt);
    laps.push(totalMs);
    renderLapList();
  });
})();

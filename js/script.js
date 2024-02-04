// state
let count, errors, curRow, prevLen, caps, focused, startTime;

const checkEnd = () => {
  if (startTime == 0) return true;
};

const checkDone = () => {
  const len = document.getElementById('bar').value.length;
  if (len < max) return;
  const time = (Date.now() - startTime) / 60000;
  startTime = 0;

  document.getElementById('acc').textContent = `acc - ${(((len - errors) / max) * 100).toFixed(2)}%`;
  document.getElementById('raw').textContent = `raw - ${(max / 5 / time).toFixed(1)} WPM`;
  document.getElementById('net').textContent = `net - ${((len - errors) / 5 / time).toFixed(1)} WPM`;
  results.style.display = 'flex';

  document.querySelectorAll('.pressed').forEach((key) => key.classList.remove('pressed'));
};

const generate = () => {
  input.innerHTML = bar.value = '';
  bar.focus();

  count = errors = curRow = prevLen = 0;
  caps = false;
  focused = true;
  startTime = null;
  results.style.display = 'none';

  populate().then(() => {
    prev = document.getElementById('0');
    prev.classList.add('current', 'flash');
  });
};

generate();

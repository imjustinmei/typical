// state
let count = 0;
let errors = 0;
let curRow = 0;
let prevLen = 0;
let caps = false;
let focused = false;
let startTime = null;

// initialize
let max;
let prev;
let words;
const style = document.getElementById('style');
const bar = document.getElementById('bar');
const input = document.getElementById('input');
const keys = ['qwertyuiop', 'asdfghjkl', 'zxvcbnm'];
const keyboard = document.getElementById('keyboard');

// theme
let theme = localStorage.getItem('theme');
if (!theme) {
  localStorage.setItem('theme', 'light');
  theme = 'light';
}
style.href = 'css/' + theme + '.css';
document.getElementById('theme').textContent = theme;
document.getElementById('theme').addEventListener('click', () => {
  localStorage.setItem('theme', theme == 'light' ? 'dark' : 'light');
  location.reload();
});

(async () => {
  words = await fetch('https://random-word-api.herokuapp.com/word?number=25').then((res) => res.json());
  max = words.reduce((acc, str) => acc + str.length, 0) + words.length - 1;
  for (const word of words) {
    const wordDiv = document.createElement('div');
    wordDiv.className = 'word';

    for (let i = 0; i < word.length; i++) {
      const item = document.createElement('div');
      item.id = count + i;
      item.className = 'item';
      item.textContent = word[i];
      wordDiv.appendChild(item);
    }
    count += word.length + 1;

    const space = document.createElement('div');
    space.textContent = '\u00A0';
    space.id = count - 1;
    space.classList = 'item';

    wordDiv.appendChild(space);
    input.append(wordDiv);
  }
})().then(() => {
  prev = document.getElementById('0');
  prev.classList.add('current', 'flash');
});

for (let i = 0; i < keys.length; i++) {
  const row = document.createElement('div');
  row.className = 'row';
  row.id = 'row' + i;

  for (let j = 0; j < keys[i].length; j++) {
    const key = document.createElement('div');
    key.textContent = keys[i][j];
    key.className = 'key';
    key.id = keys[i][j];

    row.appendChild(key);
  }

  keyboard.appendChild(row);
}

document.body.addEventListener('keydown', (e) => {
  if (checkEnd()) return;

  let code = e.code;
  if (code == 'CapsLock') return toggleCaps((caps = !caps));
  else if (code.substring(0, 3) != 'Key') return;

  code = code.substring(3, 4).toLowerCase();
  const key = document.getElementById(code.toLowerCase());
  if (key != null) key.classList.add('pressed');
});

document.body.addEventListener('keyup', (e) => {
  if (checkEnd()) return;

  let code = e.code;
  if (code.substring(0, 3) != 'Key') return;
  code = code.substring(3, 4).toLowerCase();
  const key = document.getElementById(code.toLowerCase());

  if (key != null) key.classList.remove('pressed');
});

const toggleCaps = (upper) => {
  const keys = document.getElementsByClassName('key');
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const value = key.textContent;

    if (upper) key.textContent = value.toUpperCase();
    else key.textContent = value.toLowerCase();
  }
};

document.addEventListener('click', (e) => {
  const target = e.target;

  if (target == input || target.className == 'item') {
    focused = true;
    prev.classList.add('flash');
    bar.focus();
  } else {
    focused = false;
    prev.classList.remove('flash');
  }
});

const scroll = (n) => {
  const wordDivs = document.getElementsByClassName('word');
  for (const word of wordDivs) word.style.transform = `translateY(-${n * 45}px)`;
};

bar.addEventListener('input', (e) => {
  if (checkEnd()) return;
  if (!startTime) startTime = Date.now();

  const text = e.target.value;
  const row = Math.floor(text.length / 51);
  if (Math.abs(row - curRow) > 0) {
    curRow = row;
    scroll(row - 1);
  }
  if (prevLen - e.target.value.length > 1) for (let i = 0; i < prevLen - text.length; i++) document.getElementById(prevLen - i).classList.remove('right', 'wrong');
  prevLen = e.target.value.length;

  let cur = e.data;
  if (cur == ' ') cur = '\u00A0';

  if (text.length > prev.id) {
    if (cur == prev.textContent) prev.classList.add('right');
    else {
      prev.classList.add('wrong');
      errors += 1;
    }
  }
  prev.classList.remove('current', 'flash');

  prev = document.getElementById(text.length);
  prev.classList.add('current', 'flash');
  prev.classList.remove('right', 'wrong');

  checkDone();
});

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

// start
bar.focus();
focused = true;

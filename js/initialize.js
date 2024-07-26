// initialize
let max;
let prev;
let words;
const keys = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];
const keyboard = document.getElementById('keyboard');
const style = document.getElementById('style');
const bar = document.getElementById('bar');
const input = document.getElementById('input');

// populate text
const populate = async () => {
  try {
    const response = await fetch('https://random-word-api.herokuapp.com/word?number=25');
    words = await response.json();
  } catch (err) {
    if (!words) return false;
  }
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

  return true;
};

// keyboard display
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
  let code = e.code;
  if (code == 'CapsLock') return toggleCaps((caps = !caps));
  else if (code.substring(0, 3) != 'Key') return;

  code = code.substring(3, 4).toLowerCase();
  const key = document.getElementById(code.toLowerCase());
  if (key != null) key.classList.add('pressed');
});

document.body.addEventListener('keyup', (e) => {
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

// handle input
const scroll = (n) => {
  const wordDivs = document.getElementsByClassName('word');
  for (const word of wordDivs) word.style.transform = `translateY(-${n * 45}px)`;
};

bar.addEventListener('paste', (e) => e.preventDefault());

bar.addEventListener('input', (e) => {
  if (checkEnd()) return;
  if (!startTime) startTime = Date.now();

  const text = e.target.value;
  const row = Math.floor(text.length / 51);
  if (Math.abs(row - curRow) > 0) {
    curRow = row;
    scroll(row - 1);
  }
  if (prevLen - e.target.value.length > 1) for (let i = 0; i < prevLen - text.length; i++) document.getElementById(prevLen - i).classList.remove('right', 'wrong', 'wrong-space');
  prevLen = e.target.value.length;

  let cur = e.data;
  if (cur == ' ') cur = '\u00A0';

  if (text.length > prev.id) {
    if (cur == prev.textContent) {
      prev.classList.add('right');
    } else {
      if (prev.textContent == '\u00A0') prev.classList.add('wrong-space');
      prev.classList.add('wrong');
      errors += 1;
    }
  }

  prev.classList.remove('current', 'flash');
  prev = document.getElementById(text.length);
  prev.classList.add('current', 'flash');
  prev.classList.remove('right', 'wrong', 'wrong-space');

  checkDone();
});

document.addEventListener('click', (e) => {
  const target = e.target;

  if (target == input || target.classList == 'word' || target.classList.contains('item')) {
    focused = true;
    prev.classList.add('flash');
    bar.focus();
    input.style.filter = 'blur()';
  } else {
    focused = false;
    prev.classList.remove('flash');
    input.style.filter = 'blur(3px)';
  }
});

document.getElementById('restart').addEventListener('click', () => {
  generate();
  setTimeout(() => {
    input.style.filter = 'blur()';
  }, 1);
});

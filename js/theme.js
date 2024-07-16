const initialTheme = localStorage.getItem('theme') || 'light';
style.href = 'css/' + initialTheme + '.css';
document.getElementById('theme').textContent = initialTheme == 'light' ? 'dark' : 'light';

const handleTheme = () => {
  const theme = localStorage.getItem('theme') || 'light';
  const inverse = theme == 'light' ? 'dark' : 'light';

  document.getElementById('theme').textContent = theme;
  localStorage.setItem('theme', inverse);
  style.href = 'css/' + inverse + '.css';
};

document.getElementById('theme').addEventListener('click', () => {
  handleTheme();
});

setTimeout(() => {
  document.body.style.transition = 'background-color 0.4s, color 0.4s';
}, 500);

// fake captcha behavior -> redirect to Rickroll after "verification"
const checkboxLabel = document.getElementById('fakeCheckbox');
const cb = document.getElementById('cb');
const imageGrid = document.getElementById('imageGrid');
const images = Array.from(document.querySelectorAll('.img'));
const verifyBtn = document.getElementById('verifyBtn');
const status = document.getElementById('status');

let imagesSelected = 0;
let isChecked = false;

checkboxLabel.addEventListener('click', toggleCheck);
checkboxLabel.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleCheck(); } });

function toggleCheck() {
  isChecked = !isChecked;
  checkboxLabel.setAttribute('aria-pressed', isChecked ? 'true' : 'false');
  cb.checked = isChecked;
  imageGrid.setAttribute('aria-hidden', !isChecked);
  status.textContent = isChecked ? 'Wähle alle passenden Bilder aus.' : '';
  updateButtonState();
}

images.forEach(img => {
  img.addEventListener('click', () => {
    img.classList.toggle('selected');
    imagesSelected = document.querySelectorAll('.img.selected').length;
    status.textContent = `Ausgewählt: ${imagesSelected}`;
    updateButtonState();
  });
});

function updateButtonState(){
  if(isChecked && imagesSelected >= 2){
    verifyBtn.disabled = false;
    verifyBtn.classList.add('enabled');
  } else {
    verifyBtn.disabled = true;
    verifyBtn.classList.remove('enabled');
  }
}

verifyBtn.addEventListener('click', startVerification);

function startVerification(){
  if(verifyBtn.disabled) return;
  // Fake verification animation sequence
  verifyBtn.disabled = true;
  verifyBtn.classList.remove('enabled');
  status.textContent = 'Überprüfung läuft…';
  showProgress(0);
}

function showProgress(p){
  // simple staged messages, then redirect
  const stages = [
    {t:900, msg:'Überprüfe Antworten…'},
    {t:1400, msg:'Verbindung zum Server wird hergestellt…'},
    {t:900, msg:'Letzte Sicherheitsprüfung…'},
    {t:600, msg:'Fast fertig…'}
  ];

  let i = 0;
  function next() {
    if(i >= stages.length){
      status.textContent = 'Erfolgreich verifiziert! Du wirst weitergeleitet…';
      // kurz warten, dann rickroll
      setTimeout(() => {
        // Ziel: Rickroll YouTube
        window.location.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      }, 900);
      return;
    }
    status.textContent = stages[i].msg;
    setTimeout(()=>{ i++; next(); }, stages[i].t);
  }
  next();
}

// keyboard accessibility: allow selecting images via keyboard
images.forEach((img, idx) => {
  img.setAttribute('tabindex', '0');
  img.addEventListener('keydown', (e) => {
    if(e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      img.click();
    }
  });
});

// Cloudflare-like fake check -> then show gallery of local videos from videos.json
const captchaBox = document.getElementById('captchaBox');
const check = document.getElementById('check');
const loader = document.getElementById('loader');
const status = document.getElementById('status');

const galleryOverlay = document.getElementById('galleryOverlay');
const playerOverlay = document.getElementById('playerOverlay');
const videoGrid = document.getElementById('videoGrid');
const closeGallery = document.getElementById('closeGallery');

const player = document.getElementById('player');
const playerTitle = document.getElementById('playerTitle');
const closePlayer = document.getElementById('closePlayer');

let done = false;
let videos = [];

// accessibility: allow Enter/Space to trigger
captchaBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); captchaBox.click(); }
});

captchaBox.addEventListener('click', async () => {
  if (done) return;
  done = true;
  captchaBox.setAttribute('aria-pressed', 'true');
  check.classList.add('checked');
  status.textContent = 'Checking…';
  loader.style.display = 'block';

  try {
    // staged messages
    await wait(900); status.textContent = 'Verifying your connection…';
    await wait(1100); status.textContent = 'Almost there…';
    await wait(900); status.textContent = 'Preparing gallery…';

    // load manifest
    videos = await fetchVideosManifest();
    await wait(400);

    loader.style.display = 'none';
    status.textContent = '';
    // open gallery overlay
    openGallery();
  } catch (err) {
    loader.style.display = 'none';
    status.textContent = 'Fehler beim Laden der Galerie.';
    console.error(err);
  }
});

function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

async function fetchVideosManifest(){
  // videos.json muss existieren im gleichen Ordner
  const res = await fetch('videos.json', {cache: 'no-store'});
  if (!res.ok) throw new Error('videos.json konnte nicht geladen werden');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function openGallery(){
  populateGrid();
  galleryOverlay.setAttribute('aria-hidden', 'false');
  galleryOverlay.style.display = 'flex';
  // lock scroll
  document.body.style.overflow = 'hidden';
}

function closeGalleryFn(){
  galleryOverlay.setAttribute('aria-hidden', 'true');
  galleryOverlay.style.display = 'none';
  document.body.style.overflow = '';
}
closeGallery.addEventListener('click', closeGalleryFn);
galleryOverlay.addEventListener('click', (e) => {
  if (e.target === galleryOverlay) closeGalleryFn();
});

// fill grid
function populateGrid(){
  videoGrid.innerHTML = '';
  if (!videos.length){
    videoGrid.innerHTML = '<p style="color:#666">Keine Videos in der Gallery gefunden. Füge Einträge in videos.json hinzu.</p>';
    return;
  }
  videos.forEach((v, idx) => {
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.tabIndex = 0;
    tile.setAttribute('role','button');
    tile.setAttribute('aria-label', v.title || `Video ${idx+1}`);

    const img = document.createElement('img');
    img.src = v.thumb || 'thumbs/placeholder.jpg';
    img.alt = v.title || `Thumbnail ${idx+1}`;

    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = v.title || `Video ${idx+1}`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = v.description || '';

    tile.appendChild(img);
    tile.appendChild(title);
    tile.appendChild(meta);

    // open player on click
    tile.addEventListener('click', () => openPlayer(v));
    tile.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openPlayer(v); }});

    videoGrid.appendChild(tile);
  });
}

// Player overlay
function openPlayer(videoItem){
  playerOverlay.setAttribute('aria-hidden', 'false');
  playerOverlay.style.display = 'flex';
  playerTitle.textContent = videoItem.title || '';
  // set source and play
  player.pause();
  player.removeAttribute('src');
  while (player.firstChild) player.removeChild(player.firstChild);

  // support multiple formats: prefer file field
  const src = videoItem.file;
  const source = document.createElement('source');
  source.src = src;
  // try to infer type from extension
  if (src.endsWith('.mp4')) source.type = 'video/mp4';
  else if (src.endsWith('.webm')) source.type = 'video/webm';
  player.appendChild(source);
  player.load();
  player.play().catch(()=>{ /* autoplay may be blocked; user can press play */ });
  document.body.style.overflow = 'hidden';
}

function closePlayerFn(){
  player.pause();
  player.removeAttribute('src');
  while (player.firstChild) player.removeChild(player.firstChild);
  playerOverlay.setAttribute('aria-hidden', 'true');
  playerOverlay.style.display = 'none';
  document.body.style.overflow = '';
}
closePlayer.addEventListener('click', closePlayerFn);
playerOverlay.addEventListener('click', (e) => {
  if (e.target === playerOverlay) closePlayerFn();
});

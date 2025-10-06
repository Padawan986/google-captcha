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

// Captcha Klick
captchaBox.addEventListener('click', async () => {
  if (done) return;
  done = true;
  check.classList.add('checked');
  status.textContent = "Checking…";
  loader.style.display = "block";

  try {
    await wait(900); status.textContent = "Verifying your connection…";
    await wait(1100); status.textContent = "Almost there…";
    await wait(900); status.textContent = "Preparing gallery…";

    // videos.json laden
    videos = await fetchVideosManifest();
    await wait(400);

    loader.style.display = "none";
    status.textContent = "";
    openGallery();
  } catch (err) {
    loader.style.display = "none";
    status.textContent = "Fehler beim Laden.";
    console.error(err);
  }
});

function wait(ms){ return new Promise(res => setTimeout(res, ms)); }

async function fetchVideosManifest(){
  const res = await fetch("videos.json", {cache:"no-store"});
  if (!res.ok) throw new Error("videos.json konnte nicht geladen werden");
  return await res.json();
}

function openGallery(){
  populateGrid();
  galleryOverlay.setAttribute("aria-hidden", "false");
  galleryOverlay.style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeGalleryFn(){
  galleryOverlay.setAttribute("aria-hidden", "true");
  galleryOverlay.style.display = "none";
  document.body.style.overflow = "";
}
closeGallery.addEventListener("click", closeGalleryFn);
galleryOverlay.addEventListener("click", e => { if (e.target === galleryOverlay) closeGalleryFn(); });

function populateGrid(){
  videoGrid.innerHTML = "";
  videos.forEach((v, i) => {
    const tile = document.createElement("div");
    tile.className = "tile";

    const img = document.createElement("img");
    img.src = v.thumb;
    img.alt = v.title;

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = v.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = v.description || "";

    tile.appendChild(img);
    tile.appendChild(title);
    tile.appendChild(meta);

    tile.addEventListener("click", () => openPlayer(v));
    videoGrid.appendChild(tile);
  });
}

function openPlayer(videoItem){
  playerOverlay.setAttribute("aria-hidden","false");
  playerOverlay.style.display = "flex";
  playerTitle.textContent = videoItem.title;
  player.src = videoItem.file;
  player.load();
  player.play().catch(()=>{});
}

function closePlayerFn(){
  player.pause();
  player.removeAttribute("src");
  playerOverlay.setAttribute("aria-hidden","true");
  playerOverlay.style.display = "none";
}
closePlayer.addEventListener("click", closePlayerFn);
playerOverlay.addEventListener("click", e => { if (e.target === playerOverlay) closePlayerFn(); });

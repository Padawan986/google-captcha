const captchaBox = document.getElementById('captchaBox');
const check = document.getElementById('check');
const loader = document.getElementById('loader');
const status = document.getElementById('status');

const galleryOverlay = document.getElementById('galleryOverlay');
const videoGrid = document.getElementById('videoGrid');
const closeGallery = document.getElementById('closeGallery');

let done = false;

// Fake-Captcha Klick
captchaBox.addEventListener('click', async () => {
  if(done) return;
  done = true;
  check.classList.add('checked');
  status.textContent = "Checking…";
  loader.style.display = "block";

  try {
    await wait(1000); status.textContent="Verifying your browser…";
    await wait(1000); status.textContent="Almost done…";
    await wait(1000); status.textContent="Loading gallery…";

    loader.style.display = "none";
    status.textContent = "";
    openGallery();
  } catch(err){
    loader.style.display = "none";
    status.textContent="Error.";
    console.error(err);
  }
});

function wait(ms){ return new Promise(res=>setTimeout(res, ms)); }

async function openGallery(){
  videoGrid.innerHTML="";

  try {
    const res = await fetch("videos.json");
    const videos = await res.json();

    videos.forEach(v=>{
      const tile = document.createElement("div");
      tile.className="videoTile";
      tile.innerHTML=`
        <h4>${v.title}</h4>
        <video controls>
          <source src="./${v.filename}" type="video/mp4">
          Dein Browser unterstützt kein Video.
        </video>
        <p>Uploader: ${v.uploader}</p>
        <a class="download-btn" href="./${v.filename}" download>⬇️ Download</a>
      `;
      videoGrid.appendChild(tile);
    });

    galleryOverlay.style.display="flex";
    galleryOverlay.setAttribute("aria-hidden","false");
  } catch(err){
    console.error("Fehler beim Laden der Videos:", err);
    videoGrid.innerHTML = "<p>Fehler: Videos konnten nicht geladen werden.</p>";
  }
}

closeGallery.addEventListener('click', ()=>{
  galleryOverlay.style.display="none";
  galleryOverlay.setAttribute("aria-hidden","true");
});

const box = document.getElementById("captchaBox");
const check = document.getElementById("check");
const loader = document.getElementById("loader");
const status = document.getElementById("status");

let done = false;

box.addEventListener("click", () => {
  if (done) return;
  done = true;
  check.classList.add("checked");
  status.textContent = "Checking browser…";
  loader.style.display = "block";

  setTimeout(() => status.textContent = "Verifying your connection…", 1200);
  setTimeout(() => status.textContent = "Almost there…", 2400);
  setTimeout(() => {
    status.textContent = "Redirecting…";
    loader.style.display = "none";
    window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  }, 4000);
});

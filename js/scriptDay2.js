const progress = document.getElementById("progress");
const circles = document.querySelectorAll(".circle");
const next = document.getElementById("next");
const prev = document.getElementById("prev");

let currentActive = 0;

next.addEventListener("click", () => {
  currentActive++;
  currentActive =
    currentActive >= circles.length - 1 ? circles.length - 1 : currentActive;
  update();
});

prev.addEventListener("click", () => {
  currentActive--;
  currentActive =
    currentActive <= 0 ? 0 : currentActive;
  update();
});

function update() {
  circles.forEach((circle, idx) => {
    idx <= currentActive
      ? circle.classList.add("active")
      : circle.classList.remove("active");
  });

  progress.style.width = `${currentActive*100/(circles.length-1)}%`

  prev.disabled = currentActive === 0;
  next.disabled = currentActive === circles.length - 1;
}

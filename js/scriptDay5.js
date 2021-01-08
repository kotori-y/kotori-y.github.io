const bgD5 = document.querySelector(".bg-day5");
const txtD5 = document.querySelector(".loading-text");
const btnD5 = document.querySelector(".btn-day5 button");
const progressD5 = document.querySelector(".btnD5-progress");

// https://stackoverflow.com/questions/10756313/javascript-jquery-map-a-range-of-numbers-to-another-range-of-numbers
const scale = (num, in_min, in_max, out_min, out_max) => {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

btnD5.addEventListener("click", function () {
  btnD5.disabled = true;
  btnD5.innerHTML = "Loading";
  progressD5.style.width = "0%";

  let timer = setInterval(loadBackground, 50);
  let numD5 = 0;

  function loadBackground() {
    numD5++;

    if (numD5 > 99) {
      clearInterval(timer);
      btnD5.disabled = null;
      btnD5.innerHTML = "Reload";
    }

    bgD5.style.filter = `blur(${scale(numD5, 0, 100, 30, 0)}px)`;
    txtD5.innerHTML = `${numD5}%`;
    txtD5.style.opacity = scale(numD5, 0, 100, 1, 0);
    progressD5.style.width = `${numD5}%`;
  }
});

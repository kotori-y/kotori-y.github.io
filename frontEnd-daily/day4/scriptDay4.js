const containerSearchD4 = document.querySelector(".container.search.day4");
const btnD4 = document.querySelector(".container.search.day4 button");
const inputD4 = document.querySelector(".search-day4");

btnD4.addEventListener("click", () => {
  containerSearchD4.classList.toggle("active");
  inputD4.focus();
});

inputD4.addEventListener("keyup", (event) => {
  // Number 13 is the "Enter" key on the keyboard
  if (event.keyCode === 13) {
    inputD4.value = null
    var temp = inputD4.value
    alert(`Words you input: ${temp}`);
  }
});
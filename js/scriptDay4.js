const containerSearchD4 = document.querySelector(".container.search.day4");
const btnD4 = document.querySelector(".container.search.day4 button");
const inputD4 = document.querySelector(".search-day4");

btnD4.addEventListener("click", () => {
  containerSearchD4.classList.toggle("active");
  inputD4.focus();
});

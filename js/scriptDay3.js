const open = document.getElementById("open");
const close = document.getElementById("close");
const containerD3 = document.querySelector(".row.day3");
const containerD3Main = document.querySelector(".mainPageDay3");

open.addEventListener("click", () => {
  containerD3.classList.add("show-nav");
  containerD3Main.style["background-image"] =
    "url('https://gitee.com/kotori-y/image/raw/master/hello.jpg')";
});

close.addEventListener("click", () => {
  containerD3.classList.remove("show-nav");
  containerD3Main.style["background-image"] = null;
});

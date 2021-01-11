/* a part of my blog */
/* for generating contents of daily front-end*/
/* pagination component*/

const itemNumPerPage = 3;
// const dayFilter = document.querySelector("#apply");

// dayFilter.addEventListener("click", function () {
//   document.querySelector(".container-frontend").innerHTML = null;
//   endDay = parseInt(document.getElementById("filterPros").value);
//   render(1, endDay)();
// });

function render(day, end) {

  $(".container-frontend .container.dayX").slideUp(500, function() {
    $(this).remove();})

  function renderTemplate(title, height, jsCode, cssCode) {
    var aim = document.querySelector(".container-frontend");
    var temp = document.querySelector("#dailyFrontend");

    var effect = temp.content.querySelector(".show-effect");
    var js = temp.content.querySelector(".javascript");
    var css = temp.content.querySelector(".css");

    temp.content.querySelector(
      ".container.dayX"
    ).className = `container dayX day${day}`;
    temp.content.querySelector("h2").innerText = `Day ${day}. ${title}`;

    effect.innerHTML = `<iframe align="center" width=100%" height=${height} src="/frontEnd-daily/day${day}/day${day}.html"  frameborder="no" border="0"></iframe>`;
    // console.log(jsCode)
    js.innerHTML = jsCode;
    css.innerHTML = cssCode;

    clone = document.importNode(temp.content, true);
    aim.appendChild(clone);
    day++;
  }

  const renderCode = () => {
    return new Promise(async (resolve, reject) => {
      var respJS = await fetch(`/frontEnd-daily/day${day}/scriptDay${day}.js`);
      var js = await respJS.text();
      // console.log(js);

      var respCSS = await fetch(`/frontEnd-daily/day${day}/styleDay${day}.css`);
      var css = await respCSS.text();
      try {
        resolve([js, css]);
      } catch (error) {
        reject(error);
      }
    });
  };

  const generatePage = (data) => {
    return new Promise((resolve) => {
      renderCode().then((code) => {
        var title = data[day]["title"];
        var height = data[day]["height"];
        renderTemplate(title, height, code[0], code[1]);
        if (day <= end) {
          resolve(generatePage(data));
        } else {
          resolve();
        }
      });
    });
  };

  function render() {
    $.getJSON("/frontEnd-daily/dayDate.json", function (data) {
      generatePage(data).then(function () {
        // console.log(123);
        document.querySelectorAll("code").forEach((block) => {
          // then highlight each
          hljs.highlightBlock(block);
          // console.log(456);
        });
      });
    });
  }
  return render;
}

// const currentPage = 1

function renderPagniation(itemNum) {
  var currentPage = 1;
  var pageNum = Math.ceil(itemNum / itemNumPerPage);
  var prev = document.querySelector(".page-item.prev");
  var next = document.querySelector(".page-item.next");
  var pagination = document.querySelector(".pagination");

  for (let page = 1; page <= pageNum; page++) {
    var button = document.createElement("button");
    button.classList =
      page === 1 ? ["page-item num active"] : ["page-item num"];
    button.innerHTML = page;
    pagination.insertBefore(button, next);
  }
  var pages = document.querySelectorAll(".page-item.num");

  function update() {
    pages.forEach((ele) => ele.classList.remove("active"));
    pages[currentPage-1].classList.add('active')
    var left = (currentPage - 1) * 3 + 1;
    var right = left + 2;
    right = right <= itemNum ? right : itemNum;
    prev.disabled = currentPage === 1;
    next.disabled = currentPage === pages.length;
    render(left, right)();
    window.scrollTo(0, 0);
  }

  pages.forEach((ele) => {
    ele.addEventListener("click", function () {
      currentPage = parseInt(ele.innerHTML);
      update();
    });
  });

  prev.addEventListener("click", function () {
    currentPage--;
    currentPage = currentPage < 1 ? 1 : currentPage;
    update();
  });

  next.addEventListener("click", function () {
    currentPage++;
    currentPage = currentPage > pages.length ? pages.length : currentPage;
    update();
  });
}

render(1, itemNumPerPage)();
renderPagniation(5);


$('#delete').click();

// $('#add').click(function (e) {
//   $(".notifications").append("<div class='notification'></div>");
// });
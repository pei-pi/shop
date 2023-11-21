var $ = document.querySelector.bind(document);
var $$ = document.createElement.bind(document);
// var apiUrl = "http://127.0.0.1:7001/api";
var apiUrl = "https://you.baige.me/inquiry";
var products = [];
var cart = [];
var userId = 109269;
var bookId = 148470;
var bannerUsers = [
  "13012342321",
  "13012342322",
  "13012342323",
  "13012342324",
  "13012342325",
  "13012342326",
  "13012342327",
  "13012342328",
];
var addBefore = "index";
var page = 1,
  total = 0,
  addId = null,
  flag = true;
function getProducts() {
  console.log("-------------product" + page);
  var loadMoreBlock = $("#load-more");
  window.addEventListener(
    "scroll",
    function () {
      if (flag && isElementInViewport(loadMoreBlock)) {
        getProducts();
        flag = false;
      }
    },
    true
  );

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  fetch(apiUrl + "/getListProductByUser?userId=" + userId + "&page=" + page)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      var count = res.count;
      var productsStr = res.products;
      total = count;
      JSON.parse(productsStr).forEach(function (productStr) {
        var product = JSON.parse(productStr);
        var productBlock = $$("li");
        productBlock.style.cssText =
          "padding:0.575rem 0;display:flex;justify-content:space-between;align-items:center;";
        productBlock.innerHTML =
          '<div style="min-width:6.25rem;max-width:6.25rem;width:6.25rem;min-height:4.3125rem;max-height:4.3125rem;height:4.3125rem;border-radius:0.25rem;overflow:hidden;cursor:pointer;"><img style="width:100%;height:100%;object-fit:cover;" src="' +
          product.image +
          '" /></div>';
        var contentBlock = $$("div");
        contentBlock.style.cssText =
          "flex-grow:1;padding:0 0.35rem;font-size:0.7rem;color:#909090;display:flex;flex-direction:column;justify-content:space-between;align-self:stretch;";
        contentBlock.innerHTML =
          '<p style="height:1.3125rem;font-size:0.95rem;color:#000;text-overflow:ellipsis;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;cursor:pointer;">' +
          product.title +
          '</p><p style="height:2rem;text-overflow:ellipsis;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;cursor:pointer;">' +
          product.profile +
          "</p>";
        product.quantity = 1;
        product.sumQuantity = 1;
        var counter = $$("p");
        counter.style.cssText = "display:flex;align-items:center;";
        var decreaseButton = $$("button");
        decreaseButton.style.width = "1.2rem";
        decreaseButton.style.height = "1.2rem";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function (e) {
          e.stopPropagation();
          if (product.quantity > 1) {
            product.quantity--;
            quantityBlock.innerText = product.quantity;
          }
        });
        var quantityBlock = $$("span");
        quantityBlock.style.cssText = "margin:0 0.47rem";
        quantityBlock.innerText = product.quantity;
        var increaseButton = $$("button");
        increaseButton.style.width = "1.2rem";
        increaseButton.style.height = "1.2rem";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function (e) {
          e.stopPropagation();
          product.quantity++;
          quantityBlock.innerText = product.quantity;
        });

        var detailBlock = $$("span");
        detailBlock.innerText = "了解更多";
        detailBlock.classList.add("toDetail");
        detailBlock.style.cssText =
          "font-size:0.8rem;cursor:pointer;margin-right:1rem";
        productBlock.addEventListener("click", function (e) {
          addBefore = "index";
          addId = product.id;
          show("add");
        });
        counter.append(detailBlock);
        counter.append(decreaseButton, quantityBlock, increaseButton);
        contentBlock.appendChild(counter);
        productBlock.appendChild(contentBlock);
        var addButton = $$("button");
        addButton.style.cssText =
          "min-width:3.5rem;font-size:0.935rem;font-weight:bold;line-height:2.5rem;background-color:#FFF;color:rgb(42, 102, 162);border:1px solid rgb(42, 102, 162);border-radius:0.25rem";
        addButton.innerText = "加入";
        addButton.addEventListener("click", function (e) {
          e.stopPropagation();
          var cartArr = [];
          for (var i = 0; i < cart.length; i++) {
            cartArr.push(cart[i].id);
          }
          if (cartArr.indexOf(product.id) !== -1) {
            product.sumQuantity += product.quantity;
          } else {
            product.sumQuantity = product.quantity;
            cart.push(product);
          }
          $("#cart").style.color = "inherit";
          $("#cart").innerText = cart.length + "件产品";
        });
        productBlock.appendChild(addButton);
        loadMoreBlock.parentNode.insertBefore(productBlock, loadMoreBlock);
        products.push(product);
      });
      loadMoreBlock.style.display = "list-item";
      var rest = page * 10 > total ? 0 : total - page * 10;
      loadMoreBlock.querySelector("button").innerText = "还有" + rest + "个";
      page++;
      if (rest === 0) {
        loadMoreBlock.style.display = "none";
      } else {
        flag = true;
      }
    });
}

var searchTotal = 0,
  searchFlag = true,
  searchPage = 1;
function querySearch() {
  var searchLoadMoreBlock = $("#search-load-more");
  window.addEventListener(
    "scroll",
    function () {
      if (
        $("#searchPage").display === "block" &&
        searchFlag &&
        isElementInViewport(searchLoadMoreBlock)
      ) {
        querySearch();
        searchFlag = false;
      }
    },
    true
  );

  function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
  var searchValue = $("#searchInput").value;
  fetch(
    apiUrl +
      "/queryListProductByUser?userId=" +
      userId +
      "&kw=" +
      searchValue +
      "&page=" +
      searchPage
  )
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      console.log(res);
      var count = res.count;
      var productsStr = res.products;
      searchTotal = count;
      JSON.parse(productsStr).forEach(function (productStr) {
        var product = JSON.parse(productStr);
        var productBlock = $$("li");
        productBlock.style.cssText =
          "padding:0.575rem 0;display:flex;justify-content:space-between;align-items:center;";
        productBlock.innerHTML =
          '<div style="min-width:6.25rem;max-width:6.25rem;width:6.25rem;min-height:4.3125rem;max-height:4.3125rem;height:4.3125rem;border-radius:0.25rem;overflow:hidden;cursor:pointer;"><img style="width:100%;height:100%;object-fit:cover;" src="' +
          product.image +
          '" /></div>';
        var contentBlock = $$("div");
        contentBlock.style.cssText =
          "flex-grow:1;padding:0 0.35rem;font-size:0.7rem;color:#909090;display:flex;flex-direction:column;justify-content:space-between;align-self:stretch;";
        contentBlock.innerHTML =
          '<p style="height:1.3125rem;font-size:0.95rem;color:#000;text-overflow:ellipsis;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;cursor:pointer;">' +
          product.title +
          '</p><p style="height:2rem;text-overflow:ellipsis;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;cursor:pointer;">' +
          product.profile +
          "</p>";
        product.quantity = 1;
        product.sumQuantity = 1;
        var counter = $$("p");
        counter.style.cssText = "display:flex;align-items:center;";
        var decreaseButton = $$("button");
        decreaseButton.style.width = "1.2rem";
        decreaseButton.style.height = "1.2rem";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function (e) {
          e.stopPropagation();
          if (product.quantity > 1) {
            product.quantity--;
            quantityBlock.innerText = product.quantity;
          }
        });
        var quantityBlock = $$("span");
        quantityBlock.style.cssText = "margin:0 0.47rem";
        quantityBlock.innerText = product.quantity;
        var increaseButton = $$("button");
        increaseButton.style.width = "1.2rem";
        increaseButton.style.height = "1.2rem";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function (e) {
          e.stopPropagation();
          product.quantity++;
          quantityBlock.innerText = product.quantity;
        });

        var detailBlock = $$("span");
        detailBlock.innerText = "了解更多";
        detailBlock.style.cssText =
          "font-size:0.8rem;cursor:pointer;margin-right:1rem;";
        productBlock.addEventListener("click", function () {
          addBefore = "search";
          addId = product.id;
          show("add");
        });
        counter.append(detailBlock);
        counter.append(decreaseButton, quantityBlock, increaseButton);
        contentBlock.appendChild(counter);
        productBlock.appendChild(contentBlock);
        var addButton = $$("button");
        addButton.style.cssText =
          "min-width:3.5rem;font-size:0.935rem;font-weight:bold;line-height:2.5rem;background-color:#FFF;color:rgb(42, 102, 162);border:1px solid rgb(42, 102, 162);border-radius:0.25rem";
        addButton.innerText = "加入";
        addButton.addEventListener("click", function (e) {
          e.stopPropagation();
          var cartArr = [];
          for (var i = 0; i < cart.length; i++) {
            cartArr.push(cart[i].id);
          }
          if (cartArr.indexOf(product.id) !== -1) {
            cart[cartArr.indexOf(product.id)].sumQuantity += product.quantity;
          } else {
            product.sumQuantity = product.quantity;
            cart.push(product);
          }
          $("#cart").style.color = "inherit";
          $("#cart").innerText = cart.length + "件产品";
        });
        productBlock.appendChild(addButton);
        searchLoadMoreBlock.parentNode.insertBefore(
          productBlock,
          searchLoadMoreBlock
        );
        products.push(product);
      });
      searchLoadMoreBlock.style.display = "list-item";
      var rest =
        searchPage * 10 > searchTotal ? 0 : searchTotal - searchPage * 10;
      searchLoadMoreBlock.querySelector("button").innerText =
        "还有" + rest + "个";
      searchPage++;
      if (rest === 0) {
        searchLoadMoreBlock.style.display = "none";
      } else {
        flag = true;
      }
    });
}

function displayProducts(res) {}
var routes = ["index", "searchPage", "add", "inquiry", "padding", "cartAdd"];
var state = "index";
var oldSearchValue = "";
var mounted = false;
var timer = null;
function show(name, obj) {
  if (!obj) obj = {};
  state = name;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  routes.forEach(function (route) {
    var el = $("#" + route);
    if (route === name) {
      el.style.display = "block";
    } else {
      el.style.display = "none";
    }
  });

  var page = $("#" + name);
  var title = $("#title");
  var search = $("#search");
  var bottom = $("#bottom");
  var banner = $("#banner");
  switch (name) {
    case "index":
      document.querySelector("i").style.visibility = "hidden";
      title.innerText = "询价";
      search.style.display = "flex";
      banner.style.display = "none";
      bottom.style.display = "flex";
      $("#cart").style.display = "block";
      $("#cart").style.color = "inherit";
      $("#cart").innerText = cart.length + "件产品";
      $("#to-inquiry-button").style.display = "block";
      $("#inquiry-button").style.display = "none";
      if (!mounted) {
        mounted = true;
        getProducts();
      }
      break;
    case "searchPage":
      document.querySelector("i").style.visibility = "visible";
      title.innerText = "询价";
      search.style.display = "flex";
      banner.style.display = "none";
      bottom.style.display = "flex";
      $("#cart").style.display = "block";
      $("#cart").style.color = "inherit";
      $("#cart").innerText = cart.length + "件产品";
      $("#to-inquiry-button").style.display = "block";
      $("#inquiry-button").style.display = "none";
      if ($("#searchInput").value !== oldSearchValue) {
        var liNum = $("#searchPage").querySelectorAll("li").length;
        for (var i = 0; i < liNum - 1; i++) {
          $("#searchPage li:first-child").remove();
        }
        searchPage = 1;
        oldSearchValue = $("#searchInput").value;
        querySearch();
      }
      turnBack(page);
      break;
    case "add":
      document.querySelector("i").style.visibility = "visible";
      title.innerText = "详情";
      search.style.display = "none";
      banner.style.display = "none";
      bottom.style.display = "none";
      var product = products.find(function (p) {
        return p.id == addId;
      });
      if (product) {
        page.innerHTML =
          '<div id="list" style="height:9.35rem;display:flex;justify-content:center;"><img class="item" src="' +
          product.image +
          '" /></div><p style="padding-top:1.475rem;font-size:1.375rem;text-overflow:ellipsis;overflow:hidden;-webkit-line-clamp:1;display:-webkit-box;-webkit-box-orient:vertical;">' +
          product.title +
          '</p><hr style="margin:0.47rem 0;" /><p style="color:#909090;font-size:0.95rem;">' +
          product.description.replace(/\n/g, "<br />") +
          "</p>";
        var quantitySettingBlock = $$("div");
        quantitySettingBlock.style.cssText =
          "width:100%;margin:0.94rem 0;display:flex;";
        quantitySettingBlock.innerHTML =
          '<span style="colro:#909090;font-size:0.95rem;">数量：</span>';
        var counter = $$("div");
        counter.style.cssText = "display:flex;flex-grow:1;";
        var decreaseButton = $$("button");
        decreaseButton.style.cssText =
          "margin:0 0.47rem;width:1.2rem;height:1.2rem;";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function () {
          if (product.quantity > 1) {
            product.quantity--;
            quantityBlock.innerText = product.quantity;
          }
        });
        var quantityBlock = $$("span");
        quantityBlock.innerText = product.quantity;
        var increaseButton = $$("button");
        increaseButton.style.cssText =
          "margin:0 0.47rem;width:1.2rem;height:1.2rem;";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function () {
          product.quantity++;
          quantityBlock.innerText = product.quantity;
        });
        counter.append(decreaseButton, quantityBlock, increaseButton);
        quantitySettingBlock.appendChild(counter);
        page.appendChild(quantitySettingBlock);
        var addButton = $$("button");
        addButton.style.cssText =
          "width:100%;font-size:1.25rem;line-height:3.5rem;background-color:#FF0000;color:#FFF;border:none;";
        addButton.innerText = "加入";
        addButton.addEventListener("click", function () {
          var cartArr = [];
          for (var i = 0; i < cart.length; i++) {
            cartArr.push(cart[i].id);
          }
          if (cartArr.indexOf(product.id) !== -1) {
            cart[cartArr.indexOf(product.id)].sumQuantity += product.quantity;
          } else {
            product.sumQuantity = product.quantity;
            cart.push(product);
          }
          show("index");
        });
        page.appendChild(addButton);
      } else {
        show("index");
      }
      var list = document.getElementById("list");
      moveImg(list);

      var touchStartX = 0;
      var touchEndX = 0;

      page.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].pageX;
      });

      page.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].pageX;
        handleSwipe(e);
      });

      function handleSwipe(e) {
        var swipeThreshold = 70; // 设置滑动阈值
        if (touchEndX - touchStartX > swipeThreshold) {
          if (addBefore === "index") {
            show("index");
          } else {
            show("searchPage");
          }
        }
      }

      break;
    case "inquiry":
      document.querySelector("i").style.visibility = "visible";
      title.innerText = "详情";
      search.style.display = "none";
      banner.style.display = "block";
      bottom.style.display = "flex";
      $("#cart").style.display = "block";
      $("#to-inquiry-button").style.display = "none";
      $("#inquiry-button").style.display = "block";
      var cartListBlock = page.querySelector("ul");
      cartListBlock.innerHTML = "";

      cart.forEach(function (p, index) {
        var productBlock = $$("li");
        productBlock.style.cssText =
          "padding:0.575rem 0;display:flex;justify-content:space-between;align-items:center;";
        productBlock.innerHTML =
          '<div style="min-width:6.25rem;max-width:6.25rem;width:6.25rem;min-height:4.3125rem;max-height:4.3125rem;height:4.3125rem;border-radius:0.25rem;overflow:hidden;cursor:pointer;"><img style="width:100%;height:100%;object-fit:cover;" src="' +
          p.image +
          '" /></div>';
        var contentBlock = $$("div");
        contentBlock.style.cssText =
          "flex-grow:1;padding:0 0.35rem;font-size:0.7rem;color:#909090;display:flex;flex-direction:column;justify-content:space-between;align-self:stretch;";
        contentBlock.innerHTML =
          '<p style="height:1.3125rem;font-size:0.95rem;color:#000;text-overflow:ellipsis;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;cursor:pointer;">' +
          p.title +
          '</p><p style="height:2rem;text-overflow:ellipsis;-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;cursor:pointer;">' +
          p.profile +
          "</p>";
        var counter = $$("p");
        counter.style.cssText = "display:flex;align-items:center;";
        var decreaseButton = $$("button");
        decreaseButton.style.cssText = "width:1.2rem;height:1.2rem;";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function () {
          if (p.sumQuantity > 1) {
            p.sumQuantity--;
            quantityBlock.innerText = p.sumQuantity;
          }
        });
        var quantityBlock = $$("span");
        quantityBlock.style.cssText = "margin:0 0.47rem";
        quantityBlock.innerText = p.sumQuantity;
        var increaseButton = $$("button");
        increaseButton.style.cssText = "width:1.2rem;height:1.2rem;";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function () {
          p.sumQuantity++;
          quantityBlock.innerText = p.sumQuantity;
        });

        var detailBlock = $$("span");
        detailBlock.innerText = "了解更多";
        detailBlock.style.cssText =
          "font-size:0.8rem;cursor:pointer;margin-right:1rem;";
        detailBlock.addEventListener("click", function () {
          addId = p.id;
          show("cartAdd");
        });
        counter.append(detailBlock);
        counter.append(decreaseButton, quantityBlock, increaseButton);
        contentBlock.appendChild(counter);
        productBlock.appendChild(contentBlock);

        var deleteButton = $$("button");
        deleteButton.innerHTML = '<i class="iconfont icon-lajitong"></i>';
        deleteButton.style.cssText =
          "border:none;background:none;outline:none;color:#767676;";
        deleteButton.addEventListener("click", function () {
          cart.splice(index, 1);
          toInquiry();
          cartListBlock.removeChild(productBlock);
        });
        productBlock.appendChild(deleteButton);
        cartListBlock.appendChild(productBlock);
      });

      turnBack(page);
      break;
    case "padding":
      document.querySelector("i").style.visibility = "visible";
      title.innerText = "立即询价";
      search.style.display = "none";
      banner.style.display = "none";
      bottom.style.display = "none";
      page.innerHTML =
        '<p style="margin-top:1rem;font-size:1.2rem;color:#000;">发送成功</p>' +
        "<p>询价单已成功发送⾄</p>" +
        "<p>" +
        (obj.contact || "contact") +
        "</p>" +
        "<p>" +
        (obj.company || "company") +
        "</p>" +
        '<p style="margin-top:1.875rem;">我们已经收到询价，将在⼀个⼯作⽇与您</p>' +
        "<p>联系或直接联系" +
        (obj.feedback || "feedback") +
        "</p>" +
        '<p style="margin-top:1.175rem"></p>';
      var countdownBlock = page.lastElementChild;
      var count = 5;
      countdownBlock.innerText = "跳转" + count-- + "...";
      timer = setInterval(function () {
        if (count === 0) {
          cart.length = 0;
          clearInterval(timer);
          timer = null;
          show("index");
        }
        countdownBlock.innerText = "跳转" + count-- + "...";
      }, 1000);
      break;
    case "cartAdd":
      addBefore = "inquiry";
      document.querySelector("i").style.visibility = "visible";
      title.innerText = "详情";
      search.style.display = "none";
      banner.style.display = "none";
      bottom.style.display = "none";
      var cartProduct = cart.find(function (p) {
        return p.id == addId;
      });
      if (cartProduct) {
        page.innerHTML =
          '<div id="cartList" style="height:9.35rem;display:flex;justify-content:center;"><img class="item" src="' +
          cartProduct.image +
          '" /></div><p style="font-size:1.375rem;text-overflow:ellipsis;overflow:hidden;-webkit-line-clamp:1;display:-webkit-box;-webkit-box-orient:vertical;">' +
          cartProduct.title +
          '</p><hr style="margin:0.47rem 0;" /><p style="color:#909090;font-size:0.95rem;">' +
          cartProduct.description.replace(/\n/g, "<br />") +
          "</p>";
        var quantitySettingBlock = $$("div");
        quantitySettingBlock.style.cssText =
          "width:100%;margin:0.94rem 0;display:flex;";
        quantitySettingBlock.innerHTML =
          '<span style="colro:#909090;font-size:0.95rem;">数量：</span>';
        var counter = $$("div");
        counter.style.cssText = "display:flex;flex-grow:1;";
        var decreaseButton = $$("button");
        decreaseButton.style.cssText =
          "margin:0 0.47rem;width:1.2rem;height:1.2rem";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function () {
          if (cartProduct.quantity > 1) {
            cartProduct.quantity--;
            quantityBlock.innerText = cartProduct.quantity;
          }
        });
        var quantityBlock = $$("span");
        quantityBlock.innerText = cartProduct.quantity;
        var increaseButton = $$("button");
        increaseButton.style.cssText =
          "margin:0 0.47rem;width:1.2rem;height:1.2rem";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function () {
          cartProduct.quantity++;
          quantityBlock.innerText = cartProduct.quantity;
        });
        counter.append(decreaseButton, quantityBlock, increaseButton);
        quantitySettingBlock.appendChild(counter);
        page.appendChild(quantitySettingBlock);
        var addButton = $$("button");
        addButton.style.cssText =
          "width:100%;font-size:1.25rem;line-height:3.5rem;background-color:#FF0000;color:#FFF;border:none;";
        addButton.innerText = "加入";
        addButton.addEventListener("click", function () {
          var cartArr = [];
          for (var i = 0; i < cart.length; i++) {
            cartArr.push(cart[i].id);
          }
          if (cartArr.indexOf(cartProduct.id) !== -1) {
            cart[cartArr.indexOf(cartProduct.id)].sumQuantity += cartProduct.quantity;
          } else {
            cartProduct.sumQuantity = cartProduct.quantity;
            cart.push(cartProduct);
          }
          show("inquiry");
        });
        page.appendChild(addButton);
      } else {
        show("index");
      }

      // 右滑返回
      var touchStartX = 0;
      var touchEndX = 0;

      page.addEventListener("touchstart", function (e) {
        touchStartX = e.touches[0].pageX;
      });

      page.addEventListener("touchend", function (e) {
        touchEndX = e.changedTouches[0].pageX;
        handleSwipe(e);
      });

      function handleSwipe(e) {
        var swipeThreshold = 70; // 设置滑动阈值
        if (touchEndX - touchStartX > swipeThreshold) {
          if (addBefore === "index") {
            show("index");
          } else if (addBefore === "search") {
            show("searchPage");
          } else {
            show("inquiry");
          }
        }
      }

      var cartList = document.getElementById("cartList");
      moveImg(cartList);
      break;
  }
}

function back() {
  switch (state) {
    case "inquiry":
      show("index");
      break;
    case "searchPage":
      searchPage = 1;
      show("index");
      break;
    case "add":
      if (addBefore === "index") {
        show("index");
      } else if (addBefore === "search") {
        show("searchPage");
      }
      break;
    case "padding":
      show("index");
      break;
    case "cartAdd":
      show("inquiry");
      break;
    default:
      // show("index");
      break;
  }
}

var openBtn;
function closeApp() {
  var app = $("#app");
  var parentNode = app.parentNode;
  parentNode.removeChild(app);
  parentNode.insertBefore(openBtn, parentNode.firstChild);
  mounted = false;
  page = 1;
  total = 0;
  products.length = 0;
  cart.length = 0;
  addId = null;
}

function openApp(e) {
  openBtn = e;
  var parentNode = e.parentNode;
  parentNode.removeChild(e);
  var app = $$("div");
  app.id = "app";
  fetch(apiUrl + "/getByUser?userId=" + userId)
    .then(function (res) {
      return res.json();
    })
    .then(function (res) {
      var post = res.post > 10 ? "已有" + res.post + "+人询价" : "立即询价";
      var contact = res.contact;
      var company = res.company;

      app.innerHTML =
        '<div style="width:100%;padding:0.475rem 1.17rem 0.95rem;left:0;top:0;font-size:1.175rem;">' +
        '<div class="topM" style="display:flex;justify-content:space-between;align-items:center;">' +
        '<i class="iconfont icon-fanhui" onclick="back()"></i>' +
        '<span id="title"></span>' +
        '<i class="iconfont icon-guanbi" onclick="closeApp()" style="font-size:1.4rem;"></i>' +
        "</div>" +
        '<hr style="margin:0.7rem 0;" />' +
        '<div id="search" style="padding:1px 0.825rem 1px 1.175rem;border:1px solid #909090;border-radius:2.5rem;outline-style:solid;outline-width:1px;outline-color:#909090;display:none;align-items:center;">' +
        '<input id="searchInput" style="width:100%;padding-right:4px;font-size:1.2rem;line-height:2.9rem;border:none;outline:none;" placeholder="搜索" type="text" />' +
        '<i class="iconfont icon-sousuoxiao" style="color:#909090;font-size:1.75rem;" onclick=' +
        "show('searchPage')" +
        "></i>" +
        "</div>" +
        '<div id="banner" style="overflow:hidden;display:none;">' +
        '<div style="color:#909090;font-size:0.7rem;white-space:nowrap;animation:scrollBanner 10s linear infinite;">' +
        bannerUsers
          .map(function (user) {
            return (
              '<span style="margin-right:1rem;">' +
              user.replace(user.substring(3, 7), "****") +
              " 已发送</span>"
            );
          })
          .join("") +
        "</div>" +
        "<style>@-ms-keyframes scrollBanner{from{-ms-transform:translate3d(0,0,0);}to{-ms-transform:translate3d(-ms-calc(-100% - 0.8rem),0,0);}}@keyframes scrollBanner{from{transform:translate3d(0,0,0);}to{transform:translate3d(calc(-100% - 0.8rem),0,0);}}</style>" +
        "</div></div>" +
        '<div id="content" style="flex-grow:1;padding:0 1.17rem;overflow:auto;">' +
        '<ul id="index" style="list-style-type:none;display:none;">' +
        '<li id="load-more" style="padding:2.35rem 0;text-align:center;display:none;">' +
        '<button style="padding:0 1.27rem;font-size:0.935rem;color:#909090;line-height:2.225rem;background-color:#FFF;border:1px solid #909090;" onclick="getProducts()">' +
        "</button>" +
        "</li>" +
        "</ul>" +
        '<ul id="searchPage" style="list-style-type:none;display:none;height:100%">' +
        '<li id="search-load-more" style="padding:2.35rem 0;text-align:center;display:none;">' +
        '<button style="padding:0 1.27rem;font-size:0.935rem;color:#909090;line-height:2.225rem;background-color:#FFF;border:1px solid #909090;" onclick="querySearch()">' +
        "</button>" +
        "</li>" +
        "</ul>" +
        '<div id="add"  style="display:none;height:100%"></div>' +
        '<div id="inquiry" style="display:none;height:100%">' +
        '<ul style="list-style-type:none;margin:-0.575rem 0 0.575rem;"></ul>' +
        '<form style="padding:0.47rem;border:1px solid #b1b1b1;border-radius:1rem;font-size:1.175rem;color:#7b7b7b;">' +
        '<div style="margin-left:0.47rem;line-height:1.875rem;">联系信息</div>' +
        '<hr style="margin:0 0.47rem" />' +
        '<div style="padding-left:0.47rem;display:flex;">' +
        '<span style="width:30%;line-height:1.875rem;">公司</span>' +
        '<div style="flex-grow:1;display:flex;flex-direction:column;">' +
        '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="请输入公司名" type="text" name="company" />' +
        '<span style="color:#FF0000;font-size:0.7rem;display:none;"></span>' +
        "</div>" +
        "</div>" +
        '<div style="padding-left:0.47rem;display:flex;">' +
        '<span style="width:30%;line-height:1.875rem;">联系⼈</span>' +
        '<div style="flex-grow:1;display:flex;flex-direction:column;">' +
        '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="请输入联系人姓名" type="text" name="name" />' +
        '<span style="color:#FF0000;font-size:0.7rem;display:none;"></span>' +
        "</div>" +
        "</div>" +
        '<div style="padding-left:0.47rem;display:flex;">' +
        '<span style="width:30%;line-height:1.875rem;">电话</span>' +
        '<div style="flex-grow:1;display:flex;flex-direction:column;">' +
        '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="请输入电话" type="tel" name="mobile" />' +
        '<span style="color:#FF0000;font-size:0.7rem;display:none;"></span>' +
        "</div>" +
        "</div>" +
        '<div style="padding-left:0.47rem;display:flex;">' +
        '<span style="width:30%;line-height:1.875rem;">邮箱</span>' +
        '<div style="flex-grow:1;display:flex;flex-direction:column;">' +
        '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="请输入邮箱" type="email" name="email" />' +
        '<span style="color:#FF0000;font-size:0.7rem;display:none;"></span>' +
        "</div>" +
        "</div>" +
        '<div style="padding-left:0.47rem;display:flex;">' +
        '<span style="width:30%;line-height:1.875rem;">留⾔</span>' +
        '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="我的留言" type="text" name="message" />' +
        "</div>" +
        "</form>" +
        "</div>" +
        '<div id="padding" style="font-size:0.95rem;color:#a3a3a3;text-align:center;display:none;"></div>' +
        '<div id="cartAdd" style="display:none;height:100%;"></div>' +
        "</div>" +
        '<div id="bottom" style="color:#909090;margin:0.925rem 0;padding:0 1.17rem;display:none;align-items:stretch;">' +
        '<div style="width:60%;font-size:0.95rem;">' +
        "<p style='font-size:0.6rem'>" +
        post +
        "</p>" +
        "<p style='text-overflow:ellipsis;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;'>" +
        contact +
        "</p>" +
        "<p style='text-overflow:ellipsis;-webkit-line-clamp:1;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden;'>" +
        company +
        "</p>" +
        "</div>" +
        '<div style="width:40%;display:flex;flex-direction:column;justify-content:space-between;align-items:center;">' +
        '<div style="font-size:0.7rem" id="cart">0件产品</div>' +
        '<button id="to-inquiry-button" style="width:100%;font-size:0.935rem;line-height:2.925rem;background-color:#FF0000;color:#FFF;border:1px solid #FFF;" onclick="toInquiry()">' +
        "询价" +
        "</button>" +
        '<button id="inquiry-button" style="width:100%;height:100%;line-height:2.925rem;font-size:0.935rem;background-color:#FF0000;color:#FFF;border:1px solid #FFF;display:none;" onclick="validate(this)">' +
        "发送询价" +
        "</button>" +
        "</div>" +
        "</div>";
      $(".icon-sousuoxiao"),
        addEventListener("keyup", function (e) {
          if (e.key === "Enter" || e.keyCode === 13) {
            show("searchPage");
          }
        });

      parentNode.insertBefore(app, parentNode.firstChild);
      show("index");

      // 设置媒体查询
      var mediaQuery = window.matchMedia("(max-width: 600px)");
      function handleMediaChange(e) {
        if (e.matches) {
          app.style.cssText =
            "width:100%;height:100vh;display:flex;flex-direction:column;border:1px solid #00000080;border-radius:1rem;box-shadow: 0 0 1rem 0.1rem #0000004d;";
        } else {
          app.style.cssText =
            "width:375px;height:667px;display:flex;flex-direction:column;border:1px solid #00000080;border-radius:1rem;box-shadow: 0 0 1rem 0.1rem #0000004d;";
        }
      }
      mediaQuery.addListener(handleMediaChange);
      handleMediaChange(mediaQuery);

      // 下滑关闭
      var touchStartY = 0;
      var touchEndY = 0;

      document
        .querySelector("div.topM")
        .addEventListener("touchstart", function (e) {
          touchStartY = e.touches[0].pageY;
        });

      document
        .querySelector("div.topM")
        .addEventListener("touchend", function (e) {
          touchEndY = e.changedTouches[0].pageY;
          handleSwipe(e);
        });

      function handleSwipe(e) {
        var swipeThreshold = 290; // 设置滑动阈值
        if (touchEndY - touchStartY > swipeThreshold) {
          closeApp();
        }
      }
    });
}

function moveImg(list) {
  var scale = 1;
  var offset = { left: 0, top: 0 };
  var origin = "center";
  var initialData = { offset: {}, origin: "center", scale: 1 };
  var startPoint = { x: 0, y: 0 }; // 记录初始触摸点位
  var isTouching = false; // 标记是否正在移动
  var isMove = false; // 正在移动中，与点击做区别
  var touches = new Map(); // 触摸点数组
  var lastDistance = 0;
  var lastScale = 1; // 记录下最后的缩放值
  var scaleOrigin = { x: 0, y: 0 };

  var winWidth = document.getElementById("app").style.width;
  winHeight =
    parseFloat(document.getElementById("list").style.height) + 1.4 + "rem";
  var cloneEl = null;
  var originalEl = null;

  var lastClickTime = 0;

  list.addEventListener("touchend", function (e) {
    e.preventDefault();
    var currentTime = new Date().getTime();
    var timeDiff = currentTime - lastClickTime;
    if (timeDiff < 300) {
      if (e.target.classList.contains("item")) {
        originalEl = e.target;
        cloneEl = originalEl.cloneNode(true);
        originalEl.style.opacity = 0;
        openPreview();
      }
    }
    lastClickTime = currentTime;
  });

  list.addEventListener("dblclick", function (e) {
    if (state === "add" || state === "cartAdd") {
      if (e.preventDefault) {
        e.preventDefault(); // 非IE浏览器
      } else {
        e.returnValue = false; // IE浏览器
      }
    }
    if (e.target.classList.contains("item")) {
      originalEl = e.target;
      cloneEl = originalEl.cloneNode(true);
      originalEl.style.opacity = 0;
      openPreview();
    }
  });

  function openPreview() {
    scale = 1;
    var maskWidth = document.getElementById("app").style.width;
    var maskHeight =
      parseFloat(document.getElementById("list").style.height) + 1.4 + "rem";
    var offsetWidth = originalEl.offsetWidth,
      offsetHeight = originalEl.offsetHeight;

    var rect = originalEl.getBoundingClientRect();
    var top = rect.top,
      left = rect.left;
    // 创建蒙层
    var mask = document.createElement("div");

    mask.classList.add("modal");
    // 添加在body下
    document.body.appendChild(mask);
    mask.style.height = maskHeight;
    mask.style.width = maskWidth;
    mask.style.overflow = "hidden";
    // 注册事件
    mask.addEventListener("click", clickFunc);
    mask.addEventListener("mousewheel", zoom, { passive: false });
    // 遮罩点击事件
    function clickFunc() {
      setTimeout(function () {
        if (isMove) {
          isMove = false;
        } else {
          changeStyle(cloneEl, [
            "transition: all .3s",
            "left:" + left + "px",
            "top:" + top + "px",
            "transform: translate(0,0)",
            "width:" + offsetWidth + "px",
          ]);
          setTimeout(function () {
            document.body.removeChild(mask);
            originalEl.style.opacity = 1;
            mask.removeEventListener("click", clickFunc);
          }, 300);
        }
      }, 280);
    }
    mask.appendChild(cloneEl);
  }

  // 滚轮缩放
  function zoom(event) {
    if (!event.deltaY) {
      return;
    }
    if (event.preventDefault) {
      event.preventDefault(); // 非IE浏览器
    } else {
      event.returnValue = false; // IE浏览器
    }
    origin = event.offsetX + "px " + event.offsetY + "px";
    // 缩放执行
    if (event.deltaY < 0) {
      scale += 0.1; // 放大
    } else if (event.deltaY > 0) {
      if (scale > 1) {
        scale >= 0.2 && (scale -= 0.1); // 缩小
      }
    }
    if (scale < initialData.scale) {
      reduction();
    }
    offset = getOffsetCorrection(event.offsetX, event.offsetY);
    if (cloneEl) {
      changeStyle(cloneEl, [
        "transition: all .15s",
        "transform-origin:" + origin,
        "transform: translate(" +
          offset.left +
          "px," +
          offset.top +
          "px) scale(" +
          scale +
          ")",
      ]);
    }
  }

  // 获取中心改变的偏差
  function getOffsetCorrection(x, y) {
    var touchArr = Array.from(touches);
    if (touchArr.length === 2) {
      var start = touchArr[0][1];
      var end = touchArr[1][1];
      x = (start.offsetX + end.offsetX) / 2;
      y = (start.offsetY + end.offsetY) / 2;
    }
    origin = x + "px " + y + "px";
    var offsetLeft = (scale - 1) * (x - scaleOrigin.x) + offset.left;
    var offsetTop = (scale - 1) * (y - scaleOrigin.y) + offset.top;
    scaleOrigin = { x: x, y: y };
    return { left: offsetLeft, top: offsetTop };
  }
  // 操作事件
  window.addEventListener("pointerdown", function (e) {
    if (state === "add" || state === "cartAdd") {
      if (e.preventDefault) {
        e.preventDefault(); // 非IE浏览器
      } else {
        e.returnValue = false; // IE浏览器
      }
    }
    touches.set(e.pointerId, e); // TODO: 点击存入触摸点
    isTouching = true;
    startPoint = { x: e.clientX, y: e.clientY };
    if (touches.size === 2) {
      // TODO: 判断双指触摸，并立即记录初始数据
      lastDistance = getDistance();
      lastScale = scale;
    }
  });
  window.addEventListener("pointerup", function (e) {
    touches.delete(e.pointerId); // TODO: 抬起移除触摸点
    if (touches.size <= 0) {
      isTouching = false;
    } else {
      var touchArr = Array.from(touches);
      // 更新点位
      startPoint = { x: touchArr[0][1].clientX, y: touchArr[0][1].clientY };
    }
    setTimeout(function () {
      isMove = false;
    }, 300);
  });
  window.addEventListener("pointermove", function (e) {
    if (e.preventDefault) {
      e.preventDefault(); // 非IE浏览器
    } else {
      e.returnValue = false; // IE浏览器
    }
    if (isTouching) {
      isMove = true;
      if (touches.size < 2) {
        // 单指滑动
        offset = {
          left: offset.left + (e.clientX - startPoint.x),
          top: offset.top + (e.clientY - startPoint.y),
        };
        if (cloneEl) {
          changeStyle(cloneEl, [
            "transition: all 0s",
            "transform: translate(" +
              offset.left +
              "px," +
              offset.top +
              "px) scale(" +
              scale +
              ")",
            "transform-origin:" + origin,
          ]);
        }

        // 更新点位
        startPoint = { x: e.clientX, y: e.clientY };
      } else {
        // 双指缩放
        touches.set(e.pointerId, e);
        var ratio = getDistance() / lastDistance;
        scale = ratio * lastScale;
        offset = getOffsetCorrection(0, 0);
        if (scale < initialData.scale) {
          reduction();
        }
        if (cloneEl) {
          changeStyle(cloneEl, [
            "transition: all 0s",
            "transform: translate(" +
              offset.left +
              "px," +
              offset.top +
              "px) scale(" +
              scale +
              ")",
            "transform-origin:" + origin,
          ]);
        }
      }
    }
  });
  window.addEventListener("pointercancel", function (e) {
    touches.clear(); // 可能存在特定事件导致中断，真机操作时 pointerup 在某些边界情况下不会生效，所以需要清空
  });

  // 修改样式，减少回流重绘
  function changeStyle(el, arr) {
    var original = el.style.cssText.split(";");
    original.pop();
    el.style.cssText = original.concat(arr).join(";") + ";";
  }

  // 计算自适应屏幕的缩放值
  function adaptScale() {
    var w = originalEl.offsetWidth,
      h = originalEl.offsetHeight;
    var scale = 0;
    scale = winWidth / w;
    if (h * scale > winHeight - 80) {
      scale = (winHeight - 80) / h;
    }
    return scale;
  }

  // 获取距离
  function getDistance() {
    var touchArr = Array.from(touches);
    if (touchArr.length < 2) {
      return 0;
    }
    var start = touchArr[0][1];
    var end = touchArr[1][1];
    return Math.hypot(end.x - start.x, end.y - start.y);
  }

  // 记录初始化数据
  function record() {
    initialData = Object.assign(
      {},
      { offset: offset, origin: origin, scale: scale }
    );
  }

  // 还原记录，用于边界处理
  var timer = null;
  function reduction() {
    timer && clearTimeout(timer);
    timer = setTimeout(function () {
      offset = initialData.offset;
      origin = initialData.origin;
      scale = initialData.scale;
      changeStyle(cloneEl, [
        "transform: translate(" +
          offset.left +
          "px," +
          offset.top +
          "px) scale(" +
          scale +
          ")",
        "transform-origin:" + origin,
      ]);
    }, 300);
  }
}

function turnBack(page) {
  // 右滑返回
  var touchStartX = 0;
  var touchEndX = 0;

  page.addEventListener("touchstart", function (e) {
    touchStartX = e.touches[0].pageX;
  });

  page.addEventListener("touchend", function (e) {
    touchEndX = e.changedTouches[0].pageX;
    handleSwipe(e);
  });

  function handleSwipe(e) {
    var swipeThreshold = 70; // 设置滑动阈值
    if (touchEndX - touchStartX > swipeThreshold) {
      back();
    }
  }
}

function toInquiry() {
  if (cart.length > 0) {
    $("#cart").style.color = "inherit";
    $("#cart").innerText = cart.length + "件产品";
    show("inquiry");
  } else {
    $("#cart").style.color = "#FF0000";
    $("#cart").innerText = "请选择产品！";
    var form = document.querySelector("form");
    var emptyBlock = $$("p");
    emptyBlock.style.cssText = "text-align:center;color:gray;margin:2rem 0;";
    emptyBlock.innerHTML = "暂无产品";
    $("#inquiry").insertBefore(emptyBlock, form);
  }
}

var validating = false;
function validate(btn) {
  if (!validating) {
    validating = true;

    var form = $("#inquiry form");
    var validated = true;
    setTimeout(function () {
      if (form.scrollIntoView) {
        if ("scrollBehavior" in document.documentElement.style) {
          form.scrollIntoView({ block: "end", inline: "nearest" });
        } else {
          form.scrollIntoView(false);
        }
      }
    }, 0);
    for (var i = 0; i < form.elements.length; i++) {
      var input = form.elements[i];
      switch (input.name) {
        case "company":
        case "name":
          if (input.value === "") {
            validated = false;
            input.nextElementSibling.style.display = "block";
            input.nextElementSibling.innerText = "必填";
          } else {
            input.nextElementSibling.style.display = "none";
          }
          continue;
        case "mobile":
          if (input.value.length !== 11) {
            validated = false;
            input.nextElementSibling.style.display = "block";
            input.nextElementSibling.innerText = "手机长度为11位";
          } else {
            input.nextElementSibling.style.display = "none";
          }
          continue;
        case "email":
          if (!/^([a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,})$/i.test(input.value)) {
            validated = false;
            input.nextElementSibling.style.display = "block";
            input.nextElementSibling.innerText = "邮箱格式错误";
          } else {
            input.nextElementSibling.style.display = "none";
          }
          continue;
      }
    }

    if (validated) {
      btn.innerText = "正在发送";
      var formData = new FormData(form);
      var data = {
        bookId: bookId,
        products: cart
          .map(function (p) {
            return p.id + "," + p.quantity;
          })
          .join(";"),
      };
      formData.forEach(function (value, key) {
        data[key] = value;
      });
      fetch(apiUrl + "/saveProduct", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then(function (res) {
          return res.json();
        })
        .then(function (res) {
          btn.innerText = "发送询价";
          show("padding", res);
          validating = false;
        })
        .catch(function () {
          validating = false;
        });
    } else {
      validating = false;
    }
  }
}

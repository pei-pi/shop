const $ = document.querySelector.bind(document);
const $$ = document.createElement.bind(document);
// const apiUrl = "http://127.0.0.1:7001/api";
const apiUrl = "https://you.baige.me/inquiry";
const products = [];
const cart = [];
const bannerUsers = [
  "13012342321",
  "13012342322",
  "13012342323",
  "13012342324",
  "13012342325",
  "13012342326",
  "13012342327",
  "13012342328",
];
let page = 1,
  total = 0,
  addId = null;
async function getProducts() {
  try {
    const loadMoreBlock = $("#load-more");
    const { count, products: productsStr } = await (
      await fetch(apiUrl + "/getListProductByUser?userId=109269&page=" + page)
    ).json();
    total = count;
    JSON.parse(productsStr).forEach(function (productStr) {
      const product = JSON.parse(productStr);
      const { image, title, description, profile, id } = product;
      const productBlock = $$("li");
      productBlock.style.cssText =
        "padding:0.575rem 0;display:flex;justify-content:space-between;align-items:center;";
      productBlock.innerHTML =
        '<img style="height:5.825rem;" src="' +
        image +
        '" /><div style="flex-grow:1;padding:0 0.35rem;font-size:0.7rem;color:#909090;"><p style="font-size:0.95rem;color:#000;">' +
        title +
        "</p><p>" +
        description +
        "</p><p>- " +
        profile +
        "+</p><p>详情: " +
        id +
        '</p></div><button style="min-width:4.7rem;font-size:0.935rem;line-height:3.375rem;background-color:#FFF;border:1px solid #909090;">加入</button>';
      productBlock
        .querySelector("button")
        .addEventListener("click", function () {
          addId = id;
          show("add");
        });
      loadMoreBlock.parentNode.insertBefore(productBlock, loadMoreBlock);
      products.push(product);
    });
    loadMoreBlock.style.display = "list-item";
    const rest = page * 10 > total ? 0 : total - page * 10;
    loadMoreBlock.querySelector("button").innerText = "还有" + rest + "个";
    page++;
    if (rest === 0) loadMoreBlock.style.display = "none";
  } catch (e) {
    console.error(e);
  }
}

async function search() {
  const loadMoreBlock = $("#load-more");
  let searchValue = $("#searchInput").value;
  console.log(searchValue);
  console.log(page);
  $("#index").innerHTML = " ";
  try {
    const { data } = await (
      await fetch(
        apiUrl +
          "/inquiry/queryListProductByUser/?userId=109269&kw=" +
          searchValue +
          "&page=" +
          page
      )
    ).json();
    for (const { image, title, description, profile, id } of data) {
      const productBlock = $$("li");
      productBlock.style.cssText =
        "padding:0.575rem 0;display:flex;justify-content:space-between;align-items:center;";
      productBlock.innerHTML =
        '<img style="height:5.825rem;" src="' +
        image +
        '" /><div style="padding:0 0.35rem;flex-grow:1;font-size:0.7rem;color:#909090;"><p style="font-size:0.95rem;color:#000;">' +
        title +
        "</p><p>" +
        description +
        "</p><p>- " +
        profile +
        " +</p><p>详情: " +
        id +
        '</p></div><button style="width:4.7rem;font-size:0.935rem;line-height:3.375rem;background-color:#FFF;border:1px solid #909090;">加入</button>';
      productBlock
        .querySelector("button")
        .addEventListener("click", function () {
          show("add");
        });
      $("#index").appendChild(productBlock);
    }
    products.push(...data);
  } catch {}
}

const routes = ["index", "add", "inquiry", "padding", "cartAdd"];
let state = "index";
let mounted = false;
let timer = null;
function show(name) {
  state = name;
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
  routes.forEach(function (route) {
    const el = $("#" + route);
    if (route === name) el.style.display = "block";
    else el.style.display = "none";
  });
  const page = $("#" + name);
  const title = $("#title");
  const search = $("#search");
  const bottom = $("#bottom");
  const banner = $("#banner");
  switch (name) {
    case "index":
      title.innerText = "询价";
      search.style.display = "flex";
      banner.style.display = "none";
      bottom.style.display = "flex";
      $("#cart").style.display = "block";
      $("#cart").innerText = cart.length + "件产品";
      $("#to-inquiry-button").style.display = "block";
      $("#inquiry-button").style.display = "none";
      if (!mounted) {
        mounted = true;
        getProducts();
      }
      break;
    case "add":
      title.innerText = "详情";
      search.style.display = "none";
      banner.style.display = "none";
      bottom.style.display = "none";
      const product = products.find(function (p) {
        return p.id == addId;
      });
      if (product) {
        page.innerHTML =
          '<div id="list" style="height:9.35rem;display:flex;justify-content:center;"><img class="item" src="' +
          product.image +
          '" /></div><p style="font-size:1.875rem;">' +
          product.title +
          '</p><hr style="margin:0.47rem 0;" /><p style="color:#909090;font-size:0.95rem;">' +
          product.description +
          "</p>";
        const quantitySettingBlock = $$("div");
        quantitySettingBlock.style.cssText =
          "width:100%;margin:0.94rem 0;display:flex;";
        quantitySettingBlock.innerHTML =
          '<span style="colro:#909090;font-size:0.95rem;">数量：</span>';
        const counter = $$("div");
        counter.style.cssText = "display:flex;flex-grow:1;";
        product.quantity = 1;
        const decreaseButton = $$("button");
        decreaseButton.style.cssText = "margin:0 0.47rem;";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function () {
          if (product.quantity > 1) {
            product.quantity--;
            quantityBlock.innerText = product.quantity;
          }
        });
        const quantityBlock = $$("span");
        quantityBlock.innerText = product.quantity;
        const increaseButton = $$("button");
        increaseButton.style.cssText = "margin:0 0.47rem";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function () {
          product.quantity++;
          quantityBlock.innerText = product.quantity;
        });
        counter.append(decreaseButton, quantityBlock, increaseButton);
        quantitySettingBlock.appendChild(counter);
        page.appendChild(quantitySettingBlock);
        const addButton = $$("button");
        addButton.style.cssText =
          "width:100%;font-size:1.25rem;line-height:3.5rem;background-color:#ee5353;color:#FFF;border:none;";
        addButton.innerText = "加入";
        addButton.addEventListener("click", function () {
          cart.push(product);
          show("index");
        });
        page.appendChild(addButton);
      } else {
        show("index");
      }
      let list = document.getElementById("list");
      moveImg(list);

      turnBack(page);

      break;
    case "inquiry":
      title.innerText = "详情";
      search.style.display = "none";
      banner.style.display = "block";
      bottom.style.display = "flex";
      $("#cart").style.display = "none";
      $("#to-inquiry-button").style.display = "none";
      $("#inquiry-button").style.display = "block";
      page.querySelector("ul").innerHTML = cart
        .map(function ({ image, title, description, profile, id }) {
          return (
            '<li style="padding:0.575rem 0;display:flex;justify-content:space-between;align-items:center;"><img style="height:5.825rem;" class="cli" src="' +
            image +
            '" /><div style="padding:0 0.35rem;flex-grow:1;font-size:0.7rem;color:#909090;" class="cli"><p style="font-size:0.95rem;color:#000;">' +
            title +
            "</p><p>" +
            description +
            "</p><p> - " +
            profile +
            "</p><p>详情: " +
            id +
            '</p></div><i class="iconfont icon-lajitong"></i></li>'
          );
        })
        .join("");
      page.querySelectorAll("i").forEach(function (i, index) {
        i.addEventListener("click", function () {
          cart.splice(index, 1);
          show("inquiry");
        });
      });
      page.querySelectorAll("li").forEach(function (item, index) {
        let subitem = item.querySelectorAll(".cli");
        console.log(subitem);
        subitem.forEach(function (sub) {
          sub.addEventListener("click", function () {
            addId = cart[index].id;
            show("cartAdd");
          });
        });
      });

      turnBack(page);
      break;
    case "padding":
      title.innerText = "立即询价";
      search.style.display = "none";
      banner.style.display = "none";
      bottom.style.display = "none";
      const countdownBlock = page.lastElementChild;
      let count = 5;
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
      title.innerText = "详情";
      search.style.display = "none";
      banner.style.display = "none";
      bottom.style.display = "none";
      const cartProduct = cart.find(function (p) {
        return p.id == addId;
      });
      if (cartProduct) {
        page.innerHTML =
          '<div id="cartList" style="height:9.35rem;display:flex;justify-content:center;"><img class="item" src="' +
          cartProduct.image +
          '" /></div><p style="font-size:1.875rem;">' +
          cartProduct.title +
          '</p><hr style="margin:0.47rem 0;" /><p style="color:#909090;font-size:0.95rem;">' +
          cartProduct.description +
          "</p>";
        const quantitySettingBlock = $$("div");
        quantitySettingBlock.style.cssText =
          "width:100%;margin:0.94rem 0;display:flex;";
        quantitySettingBlock.innerHTML =
          '<span style="colro:#909090;font-size:0.95rem;">数量：</span>';
        const counter = $$("div");
        counter.style.cssText = "display:flex;flex-grow:1;";
        const decreaseButton = $$("button");
        decreaseButton.style.cssText = "margin:0 0.47rem;";
        decreaseButton.innerText = "-";
        decreaseButton.addEventListener("click", function () {
          if (cartProduct.quantity > 1) {
            cartProduct.quantity--;
            quantityBlock.innerText = cartProduct.quantity;
          }
        });
        const quantityBlock = $$("span");
        quantityBlock.innerText = cartProduct.quantity;
        const increaseButton = $$("button");
        increaseButton.style.cssText = "margin:0 0.47rem";
        increaseButton.innerText = "+";
        increaseButton.addEventListener("click", function () {
          cartProduct.quantity++;
          quantityBlock.innerText = cartProduct.quantity;
        });
        counter.append(decreaseButton, quantityBlock, increaseButton);
        quantitySettingBlock.appendChild(counter);
        page.appendChild(quantitySettingBlock);
        const addButton = $$("button");
        addButton.style.cssText =
          "width:100%;font-size:1.25rem;line-height:3.5rem;background-color:#ee5353;color:#FFF;border:none;";
        addButton.innerText = "加入";
        addButton.addEventListener("click", function () {
          show("inquiry");
        });
        page.appendChild(addButton);
      } else {
        show("index");
      }

      var touchStartX = 0;
      var touchEndX = 0;

      page.addEventListener("touchstart", function (e) {
        e.stopPropagation();
        touchStartX = e.touches[0].pageX;
      });

      page.addEventListener("touchend", function (e) {
        e.stopPropagation();
        touchEndX = e.changedTouches[0].pageX;
        handleSwipe(e);
      });

      function handleSwipe(e) {
        var swipeThreshold = 70; // 设置滑动阈值
        if (touchEndX - touchStartX > swipeThreshold) {
          show("inquiry");
        }
      }

      let cartList = document.getElementById("cartList");
      moveImg(cartList);

      break;
  }
}

function back() {
  switch (state) {
    case "inquiry":
      show("index");
      break;
    case "add":
      show("index");
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

function closeApp() {
  const app = document.getElementById("app");
  if (app) {
    app.parentNode.removeChild(app);
  }
}

function openApp(e) {
  const parentNode = e.parentNode;
  parentNode.removeChild(e);
  const app = $$("div");
  app.id = "app";
  app.style =
    "width:375px;height:667px;display:flex;flex-direction:column;border:1px solid #00000080;border-radius:1rem;box-shadow: 0 0 1rem 0.1rem #0000004d;";
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
    '<i class="iconfont icon-sousuoxiao" style="color:#909090;font-size:1.75rem;" onclick="search()"></i>' +
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
    "<style>@keyframes scrollBanner{from{transform:translate3d(0,0,0);}to{transform:translate3d(calc(-100% - 0.8rem),0,0);}}</style>" +
    "</div></div>" +
    '<div style="flex-grow:1;padding:0 1.17rem;overflow:auto;">' +
    '<ul id="index" style="list-style-type:none;display:none;">' +
    '<li id="load-more" style="padding:2.35rem 0;text-align:center;display:none;">' +
    '<button style="padding:0 1.27rem;font-size:0.935rem;color:#909090;line-height:2.225rem;background-color:#FFF;border:1px solid #909090;" onclick="getProducts()">' +
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
    '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="请输入电话" type="text" name="mobile" />' +
    '<span style="color:#FF0000;font-size:0.7rem;display:none;"></span>' +
    "</div>" +
    "</div>" +
    '<div style="padding-left:0.47rem;display:flex;">' +
    '<span style="width:30%;line-height:1.875rem;">邮箱</span>' +
    '<div style="flex-grow:1;display:flex;flex-direction:column;">' +
    '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="请输入邮箱" type="text" name="email" />' +
    '<span style="color:#FF0000;font-size:0.7rem;display:none;"></span>' +
    "</div>" +
    "</div>" +
    '<div style="padding-left:0.47rem;display:flex;">' +
    '<span style="width:30%;line-height:1.875rem;">留⾔</span>' +
    '<input style="font-size:1.175rem;line-height:1.875rem;border:none;outline:none;" placeholder="我的留言" type="text" name="message" />' +
    "</div>" +
    "</form>" +
    "</div>" +
    '<div id="padding" style="font-size:0.95rem;color:#a3a3a3;text-align:center;display:none;">' +
    '<p style="margin-top:1rem;font-size:1.2rem;color:#000;">发送成功</p>' +
    "<p>询价单已成功发送⾄</p>" +
    "<p>李永乐 销售经理</p>" +
    "<p>上海乐图商务有限公司</p>" +
    '<p style="margin-top:1.875rem;">我们已经收到询价，将在⼀个⼯作⽇与您</p>' +
    "<p>联系或直接联系400-1800-166</p>" +
    '<p style="margin-top:1.175rem"></p>' +
    "</div>" +
    '<div id="cartAdd" style="display:none;height:100%;"></div>' +
    "</div>" +
    '<div id="bottom" style="color:#909090;margin:0.925rem 0;padding:0 1.17rem;display:none;align-items:stretch;">' +
    '<div style="width:50%;font-size:0.95rem;">' +
    "<div>已有3⼈询价(⽴即询价)</div>" +
    "<div>李永乐 销售经理</div>" +
    "<div>GENELEC有限公司</div>" +
    "</div>" +
    '<div style="width:50%;display:flex;flex-direction:column;justify-content:space-between;align-items:center;">' +
    '<div style="font-size:0.7rem" id="cart">0件产品</div>' +
    '<button id="to-inquiry-button" style="width:100%;font-size:0.935rem;line-height:2.625rem;background-color:#FF0000;color:#FFF;border:1px solid #FFF;" onclick="show(\'inquiry\')">' +
    "询价" +
    "</button>" +
    '<button id="inquiry-button" style="width:100%;height:100%;font-size:0.935rem;background-color:#FF0000;color:#FFF;border:1px solid #FFF;display:none;" onclick="validate(this)">' +
    "发起询价" +
    "</button>" +
    "</div>" +
    "</div>";
  parentNode.insertBefore(app, parentNode.firstChild);
  show("index");

  // 下滑关闭
  var touchStartY = 0;
  var touchEndY = 0;

  document
    .querySelector("div.topM")
    .addEventListener("touchstart", function (e) {
      touchStartY = e.touches[0].pageY;
    });

  document.querySelector("div.topM").addEventListener("touchend", function (e) {
    touchEndY = e.changedTouches[0].pageY;
    handleSwipe(e);
  });

  function handleSwipe(e) {
    var swipeThreshold = 290; // 设置滑动阈值
    if (touchEndY - touchStartY > swipeThreshold) {
      closeApp();
    }
  }
}

function moveImg(list, page) {
  let scale = 1;
  let offset = { left: 0, top: 0 };
  let origin = "center";
  let initialData = { offset: {}, origin: "center", scale: 1 };
  let startPoint = { x: 0, y: 0 }; // 记录初始触摸点位
  let isTouching = false; // 标记是否正在移动
  let isMove = false; // 正在移动中，与点击做区别
  let touches = new Map(); // 触摸点数组
  let lastDistance = 0;
  let lastScale = 1; // 记录下最后的缩放值
  let scaleOrigin = { x: 0, y: 0 };

  const { innerWidth: winWidth, innerHeight: winHeight } = window;
  let cloneEl = null;
  let originalEl = null;

  list.addEventListener("click", function (e) {
    if (e.target.classList.contains("item")) {
      originalEl = e.target;
      cloneEl = originalEl.cloneNode(true);
      originalEl.style.opacity = 0;
      openPreview();
    }
  });

  function openPreview() {
    scale = 1;
    const { offsetWidth, offsetHeight } = originalEl;
    const { top, left } = originalEl.getBoundingClientRect();
    // 创建蒙层
    const mask = document.createElement("div");
    mask.classList.add("modal");
    // 添加在body下
    document.body.appendChild(mask);
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
            document.body.removeChild(this);
            originalEl.style.opacity = 1;
            mask.removeEventListener("click", clickFunc);
          }, 300);
        }
      }, 280);
    }
    // 添加图片
    changeStyle(cloneEl, ["left:" + left + "px", "top:" + top + "px"]);
    mask.appendChild(cloneEl);
    // 移动图片到屏幕中心位置
    const originalCenterPoint = {
      x: offsetWidth / 2 + left,
      y: offsetHeight / 2 + top,
    };
    const winCenterPoint = { x: winWidth / 2, y: winHeight / 2 };
    console.log(winCenterPoint);
    const offsetDistance = {
      left: winCenterPoint.x - originalCenterPoint.x + left,
      top: winCenterPoint.y - originalCenterPoint.y + top,
    };
    const diffs = {
      left: ((adaptScale() - 1) * offsetWidth) / 2,
      top: ((adaptScale() - 1) * offsetHeight) / 2,
    };
    changeStyle(cloneEl, [
      "transition: all 0.3s",
      "width:" + offsetWidth * adaptScale() + "px",
      "transform: translate(" +
        (offsetDistance.left - left - diffs.left) +
        "px," +
        (offsetDistance.top - top - diffs.top) +
        "px)",
    ]);
    // 消除偏差
    setTimeout(function () {
      changeStyle(cloneEl, [
        "transition: all 0s",
        "left: 0",
        "top: 0",
        "transform: translate(" +
          offsetDistance.left -
          diffs.left +
          "px," +
          (offsetDistance.top - diffs.top) +
          "px)",
      ]);
      offset = {
        left: offsetDistance.left - diffs.left,
        top: offsetDistance.top - diffs.top,
      }; // 记录值
      record();
    }, 300);
  }

  // 滚轮缩放
  function zoom(event) {
    if (!event.deltaY) {
      return;
    }
    origin = event.offsetX + "px " + event.offsetY + "px";
    // 缩放执行
    if (event.deltaY < 0) {
      scale += 0.1; // 放大
    } else if (event.deltaY > 0) {
      scale >= 0.2 && (scale -= 0.1); // 缩小
    }
    if (scale < initialData.scale) {
      reduction();
    }
    offset = getOffsetCorrection(event.offsetX, event.offsetY);
    if (cloneEl) {
      changeStyle(cloneEl, [
        "transition: all .15s",
        "transform-origin:" + origin,
        "transform: translate" +
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
  function getOffsetCorrection(x = 0, y = 0) {
    const touchArr = Array.from(touches);
    if (touchArr.length === 2) {
      const start = touchArr[0][1];
      const end = touchArr[1][1];
      x = (start.offsetX + end.offsetX) / 2;
      y = (start.offsetY + end.offsetY) / 2;
    }
    origin = x + "px " + y + "px";
    const offsetLeft = (scale - 1) * (x - scaleOrigin.x) + offset.left;
    const offsetTop = (scale - 1) * (y - scaleOrigin.y) + offset.top;
    scaleOrigin = { x, y };
    return { left: offsetLeft, top: offsetTop };
  }
  // 操作事件
  window.addEventListener("pointerdown", function (e) {
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
      const touchArr = Array.from(touches);
      // 更新点位
      startPoint = { x: touchArr[0][1].clientX, y: touchArr[0][1].clientY };
    }
    setTimeout(function () {
      isMove = false;
    }, 300);
  });
  window.addEventListener("pointermove", function (e) {
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
        const ratio = getDistance() / lastDistance;
        scale = ratio * lastScale;
        offset = getOffsetCorrection();
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
    const original = el.style.cssText.split(";");
    original.pop();
    el.style.cssText = original.concat(arr).join(";") + ";";
  }

  // 计算自适应屏幕的缩放值
  function adaptScale() {
    const { offsetWidth: w, offsetHeight: h } = originalEl;
    let scale = 0;
    scale = winWidth / w;
    if (h * scale > winHeight - 80) {
      scale = (winHeight - 80) / h;
    }
    return scale;
  }

  // 获取距离
  function getDistance() {
    const touchArr = Array.from(touches);
    if (touchArr.length < 2) {
      return 0;
    }
    const start = touchArr[0][1];
    const end = touchArr[1][1];
    return Math.hypot(end.x - start.x, end.y - start.y);
  }

  // 记录初始化数据
  function record() {
    initialData = Object.assign({}, { offset, origin, scale });
  }

  // 还原记录，用于边界处理
  let timer = null;
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

let validating = false;
async function validate(btn) {
  if (!validating) {
    validating = true;

    const form = $("#inquiry form");
    let validated = true;
    for (const input of form.elements) {
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
      try {
        btn.innerText = "正在发送";
        const formData = new FormData(form);
        formData.append("bookId", "148470");
        formData.append(
          "products",
          cart
            .map(function ({ id, quantity }) {
              return id + "," + quantity;
            })
            .join(";")
        );
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }
        const res = await (
          await fetch(apiUrl + "/save", {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
          })
        ).json();
        console.log(res);
        // if (...) {
        //   btn.innerText = "发送询价";
        //   show("padding");
        // }
        validating = false;
      } catch {}
    } else {
      validating = false;
    }
  }
}

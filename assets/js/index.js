import axios from "axios";
import Swal from "sweetalert2";

const api_path = "fendy";

// 所有商品
let data = [];
// 購物車商品
let cartProducts = [];

// 初始化
function init() {
    getProductList();
    getCartList();
}

// 取得產品列表
function getProductList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/products`).
        then(function (response) {
            //console.log(response.data);
            data = response.data.products;
            renderProductList(data);
        })
        .catch(function (error) {
            Swal.fire({
                title: "取得產品列表失敗",
                text: error.response.data,
                icon: "error"
            });
        })
}

// 取得購物車列表
function getCartList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
        then(function (response) {
            //console.log(response.data);
            cartProducts = response.data;
            renderShoppingCart(cartProducts);
        })
}

init();


// 渲染產品列表
function renderProductList(data) {
    const productWrap = document.querySelector(".productWrap");
    let str = "";

    data.forEach((item) => {
        str += ` <li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${item.images}"
            alt=""
          />
          <a data-id="${item.id}" href="#" class="addCardBtn">加入購物車</a>
          <h3>"${item.title}"</h3>
          <del class="originPrice">NT$${formatNumber(item.origin_price)}</del>
          <p class="nowPrice">NT$${formatNumber(item.price)}</p>
        </li>`;
    });

    productWrap.innerHTML = str;

    // 加入購物車
    document.querySelectorAll(".addCardBtn").forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            addCartItem(e.target.dataset.id);
        });
    });
}

// 渲染產品列表
function renderShoppingCart(data) {
    const shoppingCartTable = document.querySelector(".shoppingCart-table");
    let str = ` <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>`;

    data.carts.forEach((item) => {
        str += `
          <tr>
            <td>
              <div class="cardItem-title">
                <img src="${item.product.images}" alt="" />
                <p>${item.product.title}</p>
              </div>
            </td>
            <td>NT$${formatNumber(item.product.price)}</td>
            <td>${formatNumber(item.quantity)}</td>
            <td>NT$${formatNumber(item.product.price * item.quantity)}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons"> clear </a>
            </td>
          </tr>`;
    });
    str += `<tr>
            <td>
              <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
            <td>${formatNumber(data.finalTotal)}</td>
          </tr>`;

    shoppingCartTable.innerHTML = str;

    //刪除所有品項
    document.querySelector(".discardAllBtn").addEventListener("click", (e) => {
        e.preventDefault();
        deleteAllCartList();
    });

    //刪除特定品項
    document.querySelectorAll(".discardBtn").forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            //console.log(data.carts);
            deleteCartItem(data.carts[index]);
        });
    });
}

//千分位
function formatNumber(number) {
    let parts = number.toString().split('.'); // 分割整數和小數部分
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ','); // 格式化整數部分
    return parts.length > 1 ? parts.join('.') : parts[0]; // 拼接小數部分
}


//搜尋
const productSelect = document.querySelector(".productSelect");
productSelect.addEventListener("change", function (e) {
    let filterResult = [];
    data.forEach(function (item) {
        if (item.category === productSelect.value) {
            filterResult.push(item);
        } else if (productSelect.value == "全部") {
            filterResult.push(item);
        }
    });

    renderProductList(filterResult);
});



// 新增商品
const addCartItem = (id) => {
    const product = cartProducts.carts.filter((item) => item.product.id == id);
    const data = {};
    data.productId = id;
    data.quantity = product.length == 0 ? 1 : product[0].quantity + 1;
    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`, {
        data,
    })
        .then((response) => {
            cartProducts = response.data;
            renderShoppingCart(cartProducts);
            Swal.fire({
                icon: 'success',
                title: '新增商品成功',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        })
        .catch(() => {
            Swal.fire({
                icon: 'error',
                title: '新增商品失敗',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        });
};

// 清除購物車內全部產品
function deleteAllCartList() {
    Swal.fire({
        title: '確定要刪除所有產品嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，刪除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts`).
                then(function (response) {
                    //console.log(response.data);
                    cartProducts = response.data;
                    renderShoppingCart(cartProducts);
                    Swal.fire({
                        title: "刪除購物車內全部產品成功",
                        icon: "success"
                    });
                })
                .catch(function (error) {
                    Swal.fire({
                        title: "刪除購物車內全部產品失敗",
                        icon: "error"
                    });
                })
        }
    });
}

// 刪除購物車內特定產品
function deleteCartItem(cartId) {
    Swal.fire({
        title: `確定要刪除品項：【${cartId.product.title}】嗎？`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，刪除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/carts/${cartId.id}`).
                then(function (response) {
                    //console.log(response.data);
                    cartProducts = response.data;
                    renderShoppingCart(cartProducts);
                    Swal.fire({
                        icon: 'success',
                        title: '刪除購物車內產品成功',
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                })
                .catch(function () {
                    Swal.fire({
                        icon: 'error',
                        title: '刪除購物車內產品失敗',
                        toast: true,
                        position: 'bottom-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                    });
                })
        }
    });
}


// 送出購買訂單
const orderInfo = document.querySelector(".orderInfo-btn");
orderInfo.addEventListener("click", function (e) {
    e.preventDefault();
    createOrder();
});

function createOrder() {
    const orderInfoForm = document.querySelector(".orderInfo-form");
    const customerName = document.querySelector("#customerName");
    const customerPhone = document.querySelector("#customerPhone");
    const customerEmail = document.querySelector("#customerEmail");
    const customerAddress = document.querySelector("#customerAddress");
    const tradeWay = document.querySelector("#tradeWay");

    if (!customerEmail.validity.valid) {
        customerEmail.setCustomValidity("請輸入有效的電子信箱地址");
    } else {
        customerEmail.setCustomValidity("");
    }

    orderInfoForm.reportValidity();

    if (!customerName.value || !customerPhone.value || !customerEmail.value || !customerAddress.value || !tradeWay.value) {
        Swal.fire({
            title: "表單不得有空白",
            icon: "error"
        });
        return;
    }

    if (cartProducts.carts.length == 0) {
        Swal.fire({
            title: "購物車不得為空",
            icon: "error"
        });
        return;
    }

    // 清除自訂義錯誤訊息
    customerEmail.addEventListener("input", function () {
        customerEmail.setCustomValidity("");
    });

    axios.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}/orders`,
        {
            "data": {
                "user": {
                    "name": customerName.value,
                    "tel": customerPhone.value,
                    "email": customerEmail.value,
                    "address": customerAddress.value,
                    "payment": tradeWay.value
                }
            }
        }
    ).
        then(function () {
            orderInfoForm.reset();
            getCartList();
            Swal.fire({
                title: "訂單送出成功",
                icon: "success"
            });
        })
        .catch(function (error) {
            Swal.fire({
                title: "訂單送出失敗",
                text: error.response,
                icon: "error"
            });
        })
}

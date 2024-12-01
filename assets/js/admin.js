// C3.js
import c3 from "c3";
import axios from "axios";
import Swal from "sweetalert2";

const api_path = "fendy";
const token = "bIT6zoJ2i7d6yTZFWZXzvJwaFJC3";

// 訂單
let orders = [];

// 初始化
function init() {
    getOrderList();
}

// 取得訂單列表
function getOrderList() {
    axios.get(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            //console.log(response.data);
            orders = response.data.orders;
            renderOrderList(orders);
        })
}

// 渲染訂單列表
function renderOrderList(data) {
    const orderPageTable = document.querySelector(".orderPage-table");
    let str = ` <thead>
            <tr>
              <th>訂單編號</th>
              <th>聯絡人</th>
              <th>聯絡地址</th>
              <th>電子郵件</th>
              <th>訂單品項</th>
              <th>訂單日期</th>
              <th>訂單狀態</th>
              <th>操作</th>
            </tr>
          </thead>`;

    data.forEach((item) => {
        // 取得訂單日期
        let timeStamp = new Date(item.createdAt * 1000);
        let orderTime = `${timeStamp.getFullYear()}/${timeStamp.getMonth() + 1
            }/${timeStamp.getDate()}`;

        // 取得訂單狀態
        let orderStatus = "";
        if (item.paid) {
            orderStatus = "已處理";
        } else {
            orderStatus = "未處理";
        }


        str += `
          <tr>
            <td>${item.id}</td>
            <td>
              <p>${item.user.name}</p>
              <p>${item.user.tel}</p>
            </td>
            <td>${item.user.address}</td>
            <td>${item.user.email}</td>
            <td>
              <p>${item.products[0].title}*${item.products[0].quantity}</p>
            </td>
            <td>${orderTime}</td>
            <td class="orderStatus">
              <a href="#">${orderStatus}</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除" />
            </td>
          </tr>`;
    });

    orderPageTable.innerHTML = str;

    // 圓餅圖
    chart(data);

    // 訂單狀態
    document.querySelectorAll(".orderStatus").forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            editOrderList(data[index].id);
        });
    });

    // 刪除特定訂單
    document.querySelectorAll(".delSingleOrder-Btn").forEach((item, index) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            deleteOrderItem(data[index].id);
        });
    });
}

// 圓餅圖
function chart(data) {
    let obj = {};
    data.forEach((item) => {
        item.products.forEach((productItem) => {
            if (obj[productItem.title] === undefined) {
                obj[productItem.title] = productItem.quantity;
            } else {
                obj[productItem.title] += productItem.quantity;
            }
        });
    });

    let newData = [];
    let keys = Object.keys(obj);
    keys.forEach((item) => {
        let ary = [];
        ary.push(item);
        ary.push(obj[item]);
        newData.push(ary);
    });

    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: newData,
        },
    });
}

init();

// 修改訂單狀態
function editOrderList(orderId) {
    axios.put(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
        {
            "data": {
                "id": orderId,
                "paid": true
            }
        },
        {
            headers: {
                'Authorization': token
            }
        })
        .then(function (response) {
            //console.log(response.data);
            orders = response.data.orders;
            renderOrderList(orders);
            Swal.fire({
                icon: 'success',
                title: '更新訂單狀態成功',
                toast: true,
                position: 'bottom-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        })
}

// 刪除全部訂單
document.querySelectorAll(".discardAllBtn").forEach((item) => {
    item.addEventListener("click", (e) => {
        e.preventDefault();
        deleteAllOrder();
    });
});
function deleteAllOrder() {
    if (orders.length === 0) {
        Swal.fire({
            title: "目前無訂單",
            icon: "warning"
        });
        return;
    }
    Swal.fire({
        title: '確定要刪除全部訂單嗎？',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，刪除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders`,
                {
                    headers: {
                        'Authorization': token
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    orders = response.data.orders;
                    renderOrderList(orders);
                    Swal.fire({
                        title: "刪除全部訂單成功",
                        icon: "success"
                    });
                })
        }
    });
}

// 刪除特定訂單
function deleteOrderItem(orderId) {
    Swal.fire({
        title: `確定要刪除訂單編號${orderId}嗎？`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: '是的，刪除',
        cancelButtonText: '取消'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/${api_path}/orders/${orderId}`,
                {
                    headers: {
                        'Authorization': token
                    }
                })
                .then(function (response) {
                    //console.log(response.data);
                    orders = response.data.orders;
                    renderOrderList(orders);
                    Swal.fire({
                        icon: 'success',
                        title: '刪除訂單成功',
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
                        title: '刪除訂單失敗',
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
import{S as i,a}from"./sweetalert2.esm.all-76dfd3af.js";const l="fendy";let h=[],c=[];function y(){g(),p()}function g(){a.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${l}/products`).then(function(e){h=e.data.products,m(h)}).catch(function(e){i.fire({title:"取得產品列表失敗",text:e.response.data,icon:"error"})})}function p(){a.get(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${l}/carts`).then(function(e){c=e.data,u(c)})}y();function m(e){const r=document.querySelector(".productWrap");let o="";e.forEach(t=>{o+=` <li class="productCard">
          <h4 class="productType">新品</h4>
          <img
            src="${t.images}"
            alt=""
          />
          <a data-id="${t.id}" href="#" class="addCardBtn">加入購物車</a>
          <h3>"${t.title}"</h3>
          <del class="originPrice">NT$${s(t.origin_price)}</del>
          <p class="nowPrice">NT$${s(t.price)}</p>
        </li>`}),r.innerHTML=o,document.querySelectorAll(".addCardBtn").forEach(t=>{t.addEventListener("click",n=>{n.preventDefault(),$(n.target.dataset.id)})})}function u(e){const r=document.querySelector(".shoppingCart-table");let o=` <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
          </tr>`;e.carts.forEach(t=>{o+=`
          <tr>
            <td>
              <div class="cardItem-title">
                <img src="${t.product.images}" alt="" />
                <p>${t.product.title}</p>
              </div>
            </td>
            <td>NT$${s(t.product.price)}</td>
            <td>${s(t.quantity)}</td>
            <td>NT$${s(t.product.price*t.quantity)}</td>
            <td class="discardBtn">
              <a href="#" class="material-icons"> clear </a>
            </td>
          </tr>`}),o+=`<tr>
            <td>
              <a href="#" class="discardAllBtn">刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
              <p>總金額</p>
            </td>
            <td>${s(e.finalTotal)}</td>
          </tr>`,r.innerHTML=o,document.querySelector(".discardAllBtn").addEventListener("click",t=>{t.preventDefault(),B()}),document.querySelectorAll(".discardBtn").forEach((t,n)=>{t.addEventListener("click",d=>{d.preventDefault(),C(e.carts[n])})})}function s(e){let r=e.toString().split(".");return r[0]=r[0].replace(/\B(?=(\d{3})+(?!\d))/g,","),r.length>1?r.join("."):r[0]}const f=document.querySelector(".productSelect");f.addEventListener("change",function(e){let r=[];h.forEach(function(o){(o.category===f.value||f.value=="全部")&&r.push(o)}),m(r)});const $=e=>{const r=c.carts.filter(t=>t.product.id==e),o={};o.productId=e,o.quantity=r.length==0?1:r[0].quantity+1,a.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${l}/carts`,{data:o}).then(t=>{c=t.data,u(c),i.fire({icon:"success",title:"新增商品成功",toast:!0,position:"bottom-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0})}).catch(()=>{i.fire({icon:"error",title:"新增商品失敗",toast:!0,position:"bottom-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0})})};function B(){i.fire({title:"確定要刪除所有產品嗎？",icon:"warning",showCancelButton:!0,confirmButtonText:"是的，刪除",cancelButtonText:"取消"}).then(e=>{e.isConfirmed&&a.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${l}/carts`).then(function(r){c=r.data,u(c),i.fire({title:"刪除購物車內全部產品成功",icon:"success"})}).catch(function(r){i.fire({title:"刪除購物車內全部產品失敗",icon:"error"})})})}function C(e){i.fire({title:`確定要刪除品項：【${e.product.title}】嗎？`,icon:"warning",showCancelButton:!0,confirmButtonText:"是的，刪除",cancelButtonText:"取消"}).then(r=>{r.isConfirmed&&a.delete(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${l}/carts/${e.id}`).then(function(o){c=o.data,u(c),i.fire({icon:"success",title:"刪除購物車內產品成功",toast:!0,position:"bottom-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0})}).catch(function(){i.fire({icon:"error",title:"刪除購物車內產品失敗",toast:!0,position:"bottom-end",showConfirmButton:!1,timer:3e3,timerProgressBar:!0})})})}const S=document.querySelector(".orderInfo-btn");S.addEventListener("click",function(e){e.preventDefault(),q()});function q(){const e=document.querySelector(".orderInfo-form"),r=document.querySelector("#customerName"),o=document.querySelector("#customerPhone"),t=document.querySelector("#customerEmail"),n=document.querySelector("#customerAddress"),d=document.querySelector("#tradeWay");if(t.validity.valid?t.setCustomValidity(""):t.setCustomValidity("請輸入有效的電子信箱地址"),e.reportValidity(),!r.value||!o.value||!t.value||!n.value||!d.value){i.fire({title:"表單不得有空白",icon:"error"});return}if(c.carts.length==0){i.fire({title:"購物車不得為空",icon:"error"});return}t.addEventListener("input",function(){t.setCustomValidity("")}),a.post(`https://livejs-api.hexschool.io/api/livejs/v1/customer/${l}/orders`,{data:{user:{name:r.value,tel:o.value,email:t.value,address:n.value,payment:d.value}}}).then(function(){e.reset(),p(),i.fire({title:"訂單送出成功",icon:"success"})}).catch(function(v){i.fire({title:"訂單送出失敗",text:v.response,icon:"error"})})}

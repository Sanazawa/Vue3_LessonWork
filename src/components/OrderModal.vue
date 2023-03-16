<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="modifyModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="modifyModalLabel">
            <span>訂單內容</span>
          </h5>
          <button
            type="button"
            class="btn-close-white btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <h3>用戶資料</h3>
                <table class="table table-group-divider table-hover mt-4">
                  <tr>
                    <th scope="row">姓名</th>
                    <td>
                      {{ tempOrder.user.name }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Email</th>
                    <td>
                      {{ tempOrder.user.email }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">電話</th>
                    <td>
                      {{ tempOrder.user.tel }}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">地址</th>
                    <td>
                      {{ tempOrder.user.address }}
                    </td>
                  </tr>
                  <tr class="align-top">
                    <th scope="row">客戶留言</th>
                    <td>
                      <textarea
                        rows="5"
                        style="width:250px;"
                        class="form-control"
                        :value="tempOrder.message"
                        disabled
                      ></textarea>
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="col">
              <div class="mb-3">
                <h3>訂單細節</h3>
                <table class="table table-group-divider table-hover mt-4">
                  <tr>
                    <th scope="row">訂單編號</th>
                    <td>{{ tempOrder.id }}</td>
                  </tr>
                  <tr>
                    <th scope="row">下單時間</th>
                    <td>{{ date(tempOrder.create_at) }}</td>
                  </tr>
                  <tr v-if="tempOrder.is_paid">
                    <th scope="row">付款時間</th>
                    <td>{{ date(tempOrder.paid_date) }}</td>
                  </tr>
                  <tr>
                    <th scope="row">付款狀態</th>
                    <td v-if="tempOrder.is_paid">已付款</td>
                    <td v-else>未付款</td>
                  </tr>
                  <tr>
                    <th scope="row">總金額</th>
                    <td>{{ tempOrder.total }}</td>
                  </tr>
                </table>
                <h3>選購商品</h3>
                <table class="table table-group-divider table-hover mt-4">
                  <tr v-for="(order, i) in tempOrder.products" :key="i">
                    <th scope="row">{{ order.product.title }}</th>
                    <td>{{ `${order.qty} / ${order.product.unit}` }}</td>
                    <td class="text-end">{{ `${order.total} 元` }}</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { date } from '../methods/filters';
import modalMixin from '../mixins/modalMixin';

export default {
  props: {
    order: {
      type: Object,
      default() { return {}; },
    },
  },
  watch: {
    order() {
      this.tempOrder = this.order;
    },
  },
  data() {
    return {
      modal: {},
      tempOrder: {
        user: {},
        products: {},
      },
    };
  },
  methods: {
    date,
  },
  mixins: [
    modalMixin,
  ],
};
</script>

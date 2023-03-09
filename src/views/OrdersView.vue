<template>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">購買時間</th>
        <th>Email</th>
        <th>購買款項</th>
        <th width="120">應付金額</th>
        <th width="120">是否付款</th>
        <th width="120">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in orders" :key="item.id">
        <td class="text-right">
          {{ date(item.create_at) }}
        </td>
        <td>
          {{ item.user.email }}
        </td>
        <td>
          <ul>
            <li v-for="(product, i) in item.products" :key="i">
              {{ product.product.title }} 數量：{{ product.qty }}
              {{ product.product.unit }}
            </li>
          </ul>
        </td>
        <td>{{ item.total }}</td>
        <td>{{ item.is_paid }}</td>
        <td>
          <div class="btn-group">
            <button
              class="btn btn-outline-primary btn-sm"
              @click.prevent="openModal(false, item)"
            >檢視</button>
            <button
              class="btn btn-outline-danger btn-sm"
              @click.prevent="deleteOrder"
            >刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <OrderModal
    ref="orderModal"
    :order = "tempOrder"
  ></OrderModal>
</template>

<script>
import { date } from '../methods/filters';
import OrderModal from '../components/OrderModal.vue';

export default {
  data() {
    return {
      orders: [],
      tempOrder: {},
      isLoading: false,
      isNew: false,
    };
  },
  components: {
    OrderModal,
  },
  methods: {
    date,
    getOrders() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders`;
      this.$http.get(api, this.user).then((res) => {
        this.orders = res.data.orders;
        console.log(res.data.orders);
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempOrder = {};
      } else {
        this.tempOrder = { ...item };
      }

      this.isNew = isNew;
      const OrderComponent = this.$refs.orderModal;
      OrderComponent.showModal();
    },
    deleteOrder() {
      console.log('刪除按鍵測試');
    },
  },
  created() {
    this.getOrders();
  },
};
</script>

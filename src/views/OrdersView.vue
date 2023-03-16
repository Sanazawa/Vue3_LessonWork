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
              @click.prevent="openDelModal(item)"
            >刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <Pagination
    :pages="pagination"
    @emit-pages="getOrders"
  ></Pagination>
  <OrderModal
    ref="orderModal"
    :order = "tempOrder"
  ></OrderModal>
  <DelModal
    ref="delModal"
    :item="tempOrder"
    @del-component="deleteOrder"
  ></DelModal>
</template>

<script>
import { date } from '../methods/filters';
import OrderModal from '../components/OrderModal.vue';
import DelModal from '../components/DelModal.vue';
import Pagination from '../components/PaginationComponent.vue';

export default {
  data() {
    return {
      orders: [],
      tempOrder: {},
      pagination: {},
      isLoading: false,
      isNew: false,
    };
  },
  components: {
    OrderModal,
    DelModal,
    Pagination,
  },
  inject: ['$httpMessageState'],
  methods: {
    date,
    getOrders(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders?page=${page}`;
      this.$http.get(api, this.user).then((res) => {
        this.orders = res.data.orders;
        this.pagination = res.data.pagination;
        console.log(res.data);
      });
    },
    deleteOrder() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/order/${this.tempOrder.id}`;
      const delComponent = this.$refs.delModal;

      this.$http.delete(api).then((res) => {
        console.log(res);
        this.getOrders();
        this.$httpMessageState(res, '刪除訂單');
        delComponent.hideModal();
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
    openDelModal(item) {
      this.tempOrder = {
        ...item,
        title: `訂單 ${item.id}`,
      };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
  },
  created() {
    this.getOrders();
  },
};
</script>

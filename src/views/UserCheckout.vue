<template>
  <PageLoading :active="isLoading"></PageLoading>
  <div class="my-5 row justify-content-center">
    <form class="col-6">
      <h3>訂單商品</h3>
      <table class="table align-middle table-bordered text-end">
        <thead class="table-light">
          <tr>
            <th scope="col" class="text-center">品名</th>
            <th scope="col" >數量</th>
            <th scope="col">小計</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in order.products" :key="`buyList_${i}`">
            <td class="text-start">{{ item.product.title }}</td>
            <td>{{ `${item.qty}/${item.product.unit}` }}</td>
            <td>{{ `${item.total} 元` }}</td>
          </tr>
        </tbody>
        <tfoot>
          <tr lass="align-middle">
            <td colspan="2" class="text-start">總計</td>
            <td>{{ `${order.total} 元` }}</td>
        </tr>
        </tfoot>
      </table>

      <h3>客戶資訊</h3>
      <table class="table table-bordered align-middle">
        <tr>
          <th scope="row" class="table-light">信箱</th>
          <td><div>{{ order.user.email }}</div></td>
        </tr>
        <tr>
          <th scope="row" class="table-light">姓名</th>
          <td><div>{{ order.user.name }}</div></td>
        </tr>
        <tr>
          <th scope="row" class="table-light">收件人電話</th>
          <td><div>{{ order.user.tel }}</div></td>
        </tr>
        <tr>
          <th scope="row" class="table-light">收件人地址</th>
          <td><div>{{ order.user.address }}</div></td>
        </tr>
        <tr>
          <th scope="row" class="table-light">付款狀態</th>
          <td>
            <div v-if="order.is_paid" class="text-success">已付款</div>
            <div v-else class="text-danger">待付款</div>
          </td>
        </tr>
      </table>
      <div v-if="!order.is_paid" class="text-center">
        <button type="button" class="btn btn-success" @click.prevent="payOrder">前往付款</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      order: {
        user: {},
      },
      orderId: '',
      isLoading: false,
    };
  },
  methods: {
    getOrderInfo() {
      this.orderId = this.$route.params.orderId;
      this.getOrder();
    },
    getOrder() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order/${this.orderId}`;
      this.isLoading = true;

      this.$http.get(api).then((res) => {
        console.log(res);
        this.order = res.data.order;
        this.isLoading = false;
      });
    },
    payOrder() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/pay/${this.orderId}`;
      this.isLoading = true;

      this.$http.post(api).then((res) => {
        if (res.data.success) {
          this.isLoading = false;
          this.getOrder();
        }
      });
    },
  },
  created() {
    this.getOrderInfo();
  },
};
</script>

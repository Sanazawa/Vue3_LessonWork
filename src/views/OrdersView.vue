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
      <tr>
        <td class="text-right">2023/1/6</td>
        <td>test123@123.com</td>
        <td>測試 12300元</td>
        <td>12300</td>
        <td>false</td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm">修改</button>
            <button class="btn btn-outline-danger btn-sm">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      isLoading: false,
    };
  },
  methods: {
    getOrders() {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/orders`;
      this.$http.get(api, this.user).then((res) => {
        console.log(res);
      });
    },
  },
  created() {
    this.getOrders();
  },
};
</script>

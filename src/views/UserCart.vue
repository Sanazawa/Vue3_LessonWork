<template>
  <PageLoading :active="isLoading"></PageLoading>
  <div class="col-8">
    <table class="table">
      <thead>
        <tr>
          <th scope="col">圖片</th>
          <th scope="col">商品名稱</th>
          <th scope="col">價格</th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody class="table-group-divider">
        <tr v-for="item in products" :key="item.id">
          <th>1</th>
          <td>{{ item.title }}</td>
          <td>{{ `${item.price} 元` }}</td>
          <td>
            <div class="btn-group">
              <button
                class="btn btn-outline-primary btn-sm"
                @click.prevent="getProduct(item.id)"
              >查看更多</button>
              <button class="btn btn-outline-danger btn-sm">加入購物車</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <Pagination
      :pages="pagination"
      @emit-pages="getProducts"
    ></Pagination>
  </div>
</template>

<script>
import Pagination from '../components/PaginationComponent.vue';

export default {
  data() {
    return {
      products: [],
      pagination: {},
      isLoading: false,
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products?page=${page}`;
      this.isLoading = true;
      this.$http.get(api).then((res) => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
        this.isLoading = false;
      });
    },
    getProduct(id) {
      this.$router.push(`/user/product/${id}`);
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

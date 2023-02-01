<template>
  <PageLoading :active="isLoading"></PageLoading>
  <div class="container">
    <div class="row">
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
              <td style="width: 100px">
                <div
                  style="height: 100px; background-size: cover; background-position: center"
                  :style="{backgroundImage: `url(${item.imageUrl})`}"
                ></div>
              </td>
              <td>{{ item.title }}</td>
              <td>{{ `${item.price} 元` }}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click.prevent="getProduct(item.id)"
                  >查看更多</button>
                  <button
                    class="btn btn-outline-danger btn-sm"
                    @click.prevent="addCart(item.id)"
                    :disabled="status.loadingItem === item.id"
                  >
                    <span
                      v-if="status.loadingItem === item.id"
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    加入購物車
                  </button>
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
      <div class="col-4">
        <h4>購物車</h4>
        <table class="table">
          <thead>
            <tr>
              <td>品名</td>
              <td>數量</td>
              <td>單價</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in carts" :key="item.id">
              <td>{{ item.product.title }}</td>
              <td style="width:100px">
                <div class="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    class="form-control"
                    :aria-label="`${item.id}_unit`"
                    aria-describedby="inputGroup-sizing-sm"
                    v-model="item.qty"
                  />
                  <span
                    class="input-group-text"
                    :id="`${item.id}_unit`"
                  >{{ item.product.unit }}</span>
                </div>
              </td>
              <td>{{ item.total }}</td>
              <td>
                <button class="btn btn-outline-danger btn-sm">
                  <i class="bi bi-x-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '../components/PaginationComponent.vue';

export default {
  data() {
    return {
      products: [],
      carts: [],
      pagination: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
    };
  },
  components: {
    Pagination,
  },
  methods: {
    getProducts(page = 1) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/products?page=${page}`;
      this.isLoading = true;
      this.$http.get(url).then((res) => {
        this.products = res.data.products;
        this.pagination = res.data.pagination;
        this.isLoading = false;
      });
    },
    getProduct(id) {
      this.$router.push(`/user/product/${id}`);
    },
    getCartList() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.$http.get(url).then((res) => {
        this.carts = res.data.data.carts;
      });
    },
    addCart(id) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      this.status.loadingItem = id;
      const cart = {
        product_id: id,
        qty: 1,
      };

      this.$http.post(url, { data: cart }).then((res) => {
        console.log(res);
        this.status.loadingItem = '';
        this.getCartList();
      });
    },
  },
  created() {
    this.getProducts();
    this.getCartList();
  },
};
</script>

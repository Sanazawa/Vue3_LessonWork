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
              <th scope="col">品名</th>
              <th scope="col">數量</th>
              <th scope="col">單價</th>
            </tr>
          </thead>
          <tbody class="table-group-divider">
            <tr v-for="item in carts" :key="item.id">
              <td>{{ item.product.title }}</td>
              <td style="width:120px">
                <div class="input-group input-group-sm mb-3">
                  <input
                    type="number"
                    min="1"
                    :disabled="item.id === status.loadingItem"
                    class="form-control"
                    :aria-label="`${item.id}_unit`"
                    aria-describedby="inputGroup-sizing-sm"
                    v-model="item.qty"
                    @change="updateCart(item)"
                  />
                  <span
                    class="input-group-text"
                    :id="`${item.id}_unit`"
                  >{{ `/ ${item.product.unit}` }}</span>
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
          <tfoot>
            <tr>
              <td></td>
              <td>金額總計</td>
              <td>{{ cartsTotal.total }}</td>
            </tr>
          </tfoot>
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
      cartsTotal: [],
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
      this.isLoading = true;
      this.$http.get(url).then((res) => {
        this.carts = res.data.data.carts;
        this.cartsTotal = {
          final_total: res.data.data.final_total,
          total: res.data.data.total,
        };
        this.isLoading = false;
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
    updateCart(item) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart/${item.id}`;
      const cart = {
        product_id: item.product_id,
        qty: item.qty,
      };

      this.status.loadingItem = item.id;
      this.$http.put(url, { data: cart }).then((res) => {
        console.log(res);
        this.getCartList();
        this.status.loadingItem = '';
      });
    },
  },
  created() {
    this.getProducts();
    this.getCartList();
  },
};
</script>

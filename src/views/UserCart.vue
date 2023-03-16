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
                  :style="{ backgroundImage: `url(${item.imageUrl})` }"
                ></div>
              </td>
              <td>{{ item.title }}</td>
              <td>{{ `${item.price} 元` }}</td>
              <td>
                <div class="btn-group">
                  <button
                    class="btn btn-outline-primary btn-sm"
                    @click.prevent="getProduct(item.id)"
                  >
                    查看更多
                  </button>
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
        <Pagination :pages="pagination" @emit-pages="getProducts"></Pagination>
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
              <td>
                <div>{{ item.product.title }}</div>
                <div class="fs-6 text-success" v-if="item.coupon">已套用優惠券</div>
              </td>
              <td style="width: 120px">
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
                  <span class="input-group-text" :id="`${item.id}_unit`">{{
                    `/ ${item.product.unit}`
                  }}</span>
                </div>
              </td>
              <td>
                <div class="fs-6 text-success" v-if="item.coupon">折扣價：</div>
                {{ item.final_total }}
              </td>
              <td>
                <button class="btn btn-outline-danger btn-sm">
                  <i class="bi bi-x-lg"></i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot class="table-group-divider">
            <tr>
              <td></td>
              <td>
                金額總計
                <div v-if="cartsTotal.final_total < cartsTotal.total" class="fs-6 text-success">
                  折扣價：
                </div>
              </td>
              <td>
                {{ `${cartsTotal.total} 元` }}
                <div v-if="cartsTotal.final_total < cartsTotal.total" class="fs-6 text-success">
                  {{ cartsTotal.final_total }}
                </div>
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
        <div class="input-group mb-3">
          <input
            type="text"
            class="form-control"
            aria-label="請輸入優惠代碼"
            placeholder="請輸入優惠代碼"
            aria-describedby="button-coupon"
            v-model="coupon_code"
          />
          <button
            type="button"
            class="btn btn-outline-secondary"
            id="button-coupon"
            @click="useCoupon"
          >
            使用優惠代碼
          </button>
        </div>
      </div>
      <hr />

      <div class="my-5 row justify-content-center">
        <v-form class="col-md-6" v-slot="{ errors }" @submit="createOrder">
          {{ errors }}

          <div class="mb-3">
            <span for="name" class="form-label"
              >電子信箱
              <v-field
                id="email"
                name="電子信箱"
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors['電子信箱'] }"
                placeholder="請輸入電子信箱"
                rules="required|email"
                v-model="form.user.email"
              ></v-field>
              <error-message name="電子信箱" class="invalid-feedback"></error-message>
            </span>
          </div>
          <div class="mb-3">
            <span for="name" class="form-label"
              >收件人姓名
              <v-field
                id="name"
                name="姓名"
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors['姓名'] }"
                placeholder="請輸入名字"
                rules="required"
                v-model="form.user.name"
              ></v-field>
              <error-message name="姓名" class="invalid-feedback"></error-message>
            </span>
          </div>
          <div class="mb-3">
            <span for="tel" class="form-label"
              >收件人電話
              <v-field
                id="tel"
                name="電話"
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors['電話'] }"
                placeholder="請輸入電話"
                rules="required"
                v-model="form.user.tel"
              ></v-field>
              <error-message name="電話" class="invalid-feedback"></error-message>
            </span>
          </div>
          <div class="mb-3">
            <span for="address" class="form-label"
              >收件人地址
              <v-field
                id="address"
                name="地址"
                type="text"
                class="form-control"
                :class="{ 'is-invalid' : errors['地址'] }"
                placeholder="請輸入地址"
                rules="required"
                v-model="form.user.address"
              ></v-field>
              <error-message name="地址" class="invalid-feedback"></error-message>
            </span>
          </div>
          <div class="mb-3">
            <label for="message" class="form-label"
              >留言
              <textarea
                id="message"
                type="text"
                class="form-control"
                cols="50" rows="10"
                v-model="form.message">
              </textarea>
            </label>
          </div>
          <button class="btn btn-primary" type="submit">送出表單</button>
        </v-form>
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
      coupon_code: '',
      isLoading: false,
      status: {
        loadingItem: '',
      },
      form: {
        user: {
          email: '',
          name: '',
          tel: '',
          address: '',
        },
        message: '',
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
        console.log(res);
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
    useCoupon() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/coupon`;
      const coupon = {
        code: this.coupon_code,
      };

      this.$http.post(url, { data: coupon }).then((res) => {
        console.log(res);
        this.getCartList();
      });
    },
    createOrder() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/order`;
      const order = this.form;

      this.$http.post(url, { data: order }).then((res) => {
        if (res.data.success) {
          this.$router.push(`/user/checkout/${res.data.orderId}`);
        }
      });
    },
  },
  created() {
    this.getProducts();
    this.getCartList();
  },
};
</script>

<template>
  <PageLoading :active="isLoading"></PageLoading>
  <div class="container">
    <nav aria-label="breadcrumb">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><router-link to="/user/cart">購物車</router-link></li>
        <li class="breadcrumb-item active" aria-current="page">{{ product.title }}</li>
      </ol>
    </nav>
    <div class="row justify-content-center">
      <article class="col-8">
        <h2>{{ product.title }}</h2>
        <div>{{ product.content }}</div>
        <div>{{ product.description }}</div>
        <img :src="product.imageUrl" alt="" class="img-fluid mb-3">
      </article>
      <div class="col-4">
        <div class="h5" v-if="!product.price">{{ product.origin_price }} 元</div>
        <del class="h6" v-if="product.price">原價 {{ product.origin_price }} 元</del>
        <div class="h5" v-if="product.price">現在只要 {{ product.price }} 元</div>
        <hr>
        <button
          type="button"
          class="btn btn-outline-danger"
          @click.prevent="addCart(product.id)"
          :disabled="status.loadingItem === product.id"
        >
          <span
            v-if="status.loadingItem === product.id"
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          加到購物車
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      productId: '',
      product: {},
      isLoading: false,
      status: {
        loadingItem: '',
      },
    };
  },
  methods: {
    getProductInfo() {
      this.isLoading = true;
      this.productId = this.$route.params.productId;
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/product/${this.productId}`;

      this.$http.get(api).then((res) => {
        this.product = res.data.product;
        this.isLoading = false;
      });
    },
    addCart(id) {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/cart`;
      const cart = {
        product_id: id,
        qty: 1,
      };

      this.status.loadingItem = id;
      this.$http.post(url, { data: cart }).then((res) => {
        console.log(res);
        this.status.loadingItem = '';
      });
    },
  },
  created() {
    this.getProductInfo();
  },
};
</script>

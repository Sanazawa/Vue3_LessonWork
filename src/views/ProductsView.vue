<template>
  <PageLoading :active="isLoading"></PageLoading>
  <div class="text-end">
    <button class="btn btn-primary" type="button" @click.prevent="openModal(true)">
      增加一個產品
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th width="120">分類</th>
        <th>產品名稱</th>
        <th width="120">原價</th>
        <th width="120">售價</th>
        <th width="100">是否啟用</th>
        <th width="200">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in products" :key="item.id">
        <td>{{ item.category }}</td>
        <td>{{ item.title }}</td>
        <td class="text-right">{{ $filters.currency(item.origin_price) }}</td>
        <td class="text-right">{{ $filters.currency(item.price) }}</td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button class="btn btn-outline-primary btn-sm" @click="openModal(false, item)">
              編輯
            </button>
            <button class="btn btn-outline-danger btn-sm" @click="openDelModal(item)">刪除</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <Pagination
    :pages="pagination"
    @emit-pages="getProducts"
  ></Pagination>
  <ProductModal
    ref="productModal"
    :product="tempProduct"
    @update-product="updateProduct"
  ></ProductModal>
  <DelModal ref="delModal" :item="tempProduct" @del-component="delProduct"></DelModal>
</template>

<script>
import ProductModal from '../components/ProductModal.vue';
import DelModal from '../components/DelModal.vue';
import Pagination from '../components/PaginationComponent.vue';
// import { currency } from '../methods/filters'; //只宣告區域

export default {
  data() {
    return {
      products: [],
      pagination: {},
      tempProduct: {},
      isNew: false,
      isLoading: false,
    };
  },
  components: {
    ProductModal,
    DelModal,
    Pagination,
  },
  inject: ['$httpMessageState'],
  methods: {
    // currency,  //如果只宣告區域就請加在這裡
    getProducts(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/products?page=${page}`;
      this.isLoading = true;
      this.$http.get(api, this.user).then((res) => {
        this.isLoading = false;
        console.log(res.data);
        if (!res.data.success) {
          const toastTitle = '取得產品資訊';
          this.$httpMessageState(res, toastTitle);
        }
        this.products = res.data.products;
        this.pagination = res.data.pagination;
      });
    },
    // Modal
    openModal(isNew, item) {
      if (isNew) {
        this.tempProduct = {};
      } else {
        this.tempProduct = { ...item };
      }

      this.isNew = isNew;
      const productComponent = this.$refs.productModal;
      productComponent.showModal();
    },
    openDelModal(item) {
      this.tempProduct = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    // API Data Update
    updateProduct(item) {
      this.tempProduct = item;

      // 新增
      let url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product`;
      let httpMethod = 'post';
      let toastTitle = '新增產品資訊';

      // 修改
      if (!this.isNew) {
        url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${item.id}`;
        httpMethod = 'put';
        toastTitle = '更新產品資訊';
      }

      const productComponent = this.$refs.productModal;
      this.$http[httpMethod](url, { data: this.tempProduct }).then((res) => {
        console.log(res);
        this.getProducts();
        this.$httpMessageState(res, toastTitle);
        productComponent.hideModal();
      });
    },
    delProduct() {
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/product/${this.tempProduct.id}`;
      const delComponent = this.$refs.delModal;

      this.$http.delete(url).then((res) => {
        console.log(res);
        this.getProducts();
        this.$httpMessageState(res, '刪除產品資訊');
        delComponent.hideModal();
      });
    },
  },
  created() {
    this.getProducts();
  },
};
</script>

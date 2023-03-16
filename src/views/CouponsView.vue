<template>
  <PageLoading :active="isLoading"></PageLoading>
  <div class="text-end">
    <button
      class="btn btn-primary"
      type="button"
      @click.prevent="openModal(true)"
    >
      新增優惠券
    </button>
  </div>
  <table class="table mt-4">
    <thead>
      <tr>
        <th>名稱</th>
        <th width="120">折扣百分比</th>
        <th width="120">到期日</th>
        <th width="120">是否啟用</th>
        <th width="120">編輯</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in coupons" :key="item.id">
        <td class="text-right">
          {{ item.title }}
        </td>
        <td>{{ item.percent }}%</td>
        <td>
          {{ date(item.due_date) }}
        </td>
        <td>
          <span class="text-success" v-if="item.is_enabled">啟用</span>
          <span class="text-muted" v-else>未啟用</span>
        </td>
        <td>
          <div class="btn-group">
            <button
              class="btn btn-outline-primary btn-sm"
              @click.prevent="openModal(false, item)"
            >修改</button>
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
    @emit-pages="getCoupons"
  ></Pagination>
  <CouponModal
    ref="couponModal"
    :coupon="tempCoupon"
    @update-coupon="updateCoupon"
  ></CouponModal>
  <DelModal ref="delModal" :item="tempCoupon" @del-component="delCoupon"></DelModal>
</template>

<script>
import { date } from '../methods/filters';
import Pagination from '../components/PaginationComponent.vue';
import CouponModal from '../components/CouponModal.vue';
import DelModal from '../components/DelModal.vue';

export default {
  data() {
    return {
      coupons: [],
      pagination: {},
      tempCoupon: {},
      isNew: false,
      isLoading: false,
    };
  },
  components: {
    Pagination,
    CouponModal,
    DelModal,
  },
  inject: ['$httpMessageState'],
  methods: {
    date,
    getCoupons(page = 1) {
      const api = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupons?page=${page}`;
      this.isLoading = true;

      this.$http.get(api, this.user).then((res) => {
        console.log(res);
        if (res.data.success) {
          this.pagination = res.data.pagination;
          this.coupons = res.data.coupons;
        } else {
          console.log('error:', res);
        }
        this.isLoading = false;
      });
    },
    openModal(isNew, item) {
      if (isNew) {
        this.tempCoupon = {
          due_date: new Date().getTime() / 1000,
          is_enabled: 0,
        };
      } else {
        this.tempCoupon = { ...item };
      }

      this.isNew = isNew;
      const couponComponent = this.$refs.couponModal;
      couponComponent.showModal();
    },
    openDelModal(item) {
      this.tempCoupon = { ...item };
      const delComponent = this.$refs.delModal;
      delComponent.showModal();
    },
    updateCoupon(item) {
      this.tempCoupon = item;

      // 新增優惠券
      let url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon`;
      let httpMethod = 'post';
      let toastTitle = '新增優惠券';

      // 編輯優惠券
      if (!this.isNew) {
        url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${item.id}`;
        httpMethod = 'put';
        toastTitle = '修改優惠券';
      }

      const couponComponent = this.$refs.couponModal;
      this.$http[httpMethod](url, { data: this.tempCoupon }).then((res) => {
        console.log(res);
        this.getCoupons();
        this.$httpMessageState(res, toastTitle);
        couponComponent.hideModal();
      });
    },
    delCoupon() {
      // 刪除優惠券
      const url = `${process.env.VUE_APP_API}api/${process.env.VUE_APP_PATH}/admin/coupon/${this.tempCoupon.id}`;
      const delComponent = this.$refs.delModal;

      this.$http.delete(url).then((res) => {
        console.log(res);
        this.getCoupons();
        this.$httpMessageState(res, '刪除優惠券資訊');
        delComponent.hideModal();
      });
    },
  },
  created() {
    this.getCoupons();
  },
};
</script>

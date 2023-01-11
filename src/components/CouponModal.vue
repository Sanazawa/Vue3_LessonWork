<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="modifyModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="modifyModalLabel">
            <span>優惠券</span>
          </h5>
          <button
            type="button"
            class="btn-close-white btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="title" class="form-label row g-3 align-items-center">
              <div class="col-3">名稱</div>
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  id="title"
                  placeholder="請輸入名稱"
                  v-model.trim="tempCoupon.title"
                />
              </div>
            </label>
          </div>
          <div class="mb-3">
            <label for="code" class="form-label row g-3 align-items-center">
              <div class="col-3">優惠代碼</div>
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  placeholder="請輸入優惠代碼"
                  v-model.trim="tempCoupon.code"
                />
              </div>
            </label>
          </div>
          <div class="mb-3">
            <label for="percent" class="form-label row g-3 align-items-center">
              <div class="col-3">折扣百分比</div>
              <div class="col">
                <input
                  type="range"
                  class="form-range"
                  id="percent"

                  min="1"
                  step="1"
                  max="100"
                  v-model.number="tempCoupon.percent"
                />
              </div>
              <div class="col-3">
                <input
                  type="number"
                  class="form-control"
                  placeholder="%數"
                  min="1"
                  max="100"
                  v-model="tempCoupon.percent"
                />
              </div>
            </label>
          </div>
          <div class="mb-3">
            <label for="due_date" class="form-label row g-3 align-items-center">
              <div class="col-3">使用期限</div>
              <div class="col">
                <input
                  type="date"
                  class="form-control"
                  id="due_date"
                  v-model="due_date"
                />
              </div>
            </label>
          </div>
          <div class="mb-3">
            <label for="is_enabled" class="form-check-label row g-3 align-items-center">
              <div class="col-3">是否啟用</div>
              <div class="col">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  value=0
                  id="is_enabled"
                  v-model="tempCoupon.is_enabled"
                />
              </div>
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="$emit('update-coupon', tempCoupon)"
          >確認</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '../mixins/modalMixin';

export default {
  props: {
    coupon: {
      type: Object,
      default() { return {}; },
    },
  },
  emits: ['update-coupon'],
  watch: {
    coupon() {
      this.tempCoupon = this.coupon;
      const dateAndTime = new Date(this.tempCoupon.due_date * 1000)
        .toISOString().split('T');
      [this.due_date] = dateAndTime;
    },
    due_date() {
      this.tempCoupon.due_date = Math.floor(new Date(this.due_date) / 1000);
    },
  },
  data() {
    return {
      tempCoupon: {},
      due_date: '',
    };
  },
  mixins: [
    modalMixin,
  ],
};
</script>

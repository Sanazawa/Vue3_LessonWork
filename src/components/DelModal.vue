<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="delModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header bg-danger text-white">
          <h5 class="modal-title" id="delModalLabel">
            <span>刪除 {{item.title}}</span>
          </h5>
          <button
            type="button"
            class="btn-close-white btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <span>
            你確認是真的要刪除<strong class="text-danger">{{item.title}}</strong>嗎?<br>
            刪除後將會無法復原
          </span>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-danger"
            @click="$emit('del-component')"
          >
            確認刪除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '../mixins/modalMixin';

export default {
  props: {
    item: {},
  },
  data() {
    return {
      modal: '',
    };
  },
  mixins: [
    modalMixin,
  ],
};
</script>

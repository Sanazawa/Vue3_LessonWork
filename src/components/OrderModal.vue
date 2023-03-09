<template>
  <div
    class="modal fade"
    id="exampleModal"
    tabindex="-1"
    aria-labelledby="modifyModalLabel"
    aria-hidden="true"
    ref="modal"
  >
    <div class="modal-dialog modal-xl" role="document">
      <div class="modal-content border-0">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="modifyModalLabel">
            <span>訂單內容</span>
          </h5>
          <button
            type="button"
            class="btn-close-white btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-4">
              <div class="mb-3">
                <h2>用戶資料</h2>
                <table>
                  <tr>
                    <td>姓名</td>
                    <td>
                      {{ tempOrder.user.name }}
                    </td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>
                      {{ tempOrder.user.email }}
                    </td>
                  </tr>
                  <tr>
                    <td>電話</td>
                    <td>
                      {{ tempOrder.user.tel }}
                    </td>
                  </tr>
                  <tr>
                    <td>地址</td>
                    <td>
                      {{ tempOrder.user.address }}
                    </td>
                  </tr>
                </table>
              </div>
            </div>
            <div class="col">
              <div class="mb-3">
                <h2>訂單細節</h2>

              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import modalMixin from '../mixins/modalMixin';

export default {
  props: {
    order: {
      type: Object,
      default() { return {}; },
    },
  },
  watch: {
    order() {
      this.tempOrder = this.order;
    },
  },
  data() {
    return {
      modal: {},
      tempOrder: {
        user: {},
        products: {},
      },
    };
  },
  methods: {
  },
  mixins: [
    modalMixin,
  ],
};
</script>

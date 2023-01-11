<template>
  <nav class="navbar navbar-dark bg-dark navbar-expand-lg bg-body-tertiary">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/user/cart">用戶端試作</router-link>
    </div>
  </nav>
  <div class="container-fluid mt-3 position-relative">
    <router-view />
  </div>
</template>

<script>
import emitter from '@/methods/emitter';
// import ToastMessage from '@/components/ToastComponent.vue';

export default {
  components: {

  },
  provide() {
    return {
      emitter,
    };
  },
  created() {

  },
};
</script>

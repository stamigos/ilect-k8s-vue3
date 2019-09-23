<template>
    <transition name="fade">
        <section v-if="loading || load" :style='`color: "#000"`' class="loader fixed pin flex justify-center items-center bg-white transition-opacity" data-id="spinner">
          <b-spinner class="spinner" variant="primary" style="width: 3rem; height: 3rem;" label="Large Spinner"></b-spinner>
        </section>
    </transition>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  props: ['load'],
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.loader {
  z-index: 110;
  width: 100%;
  height: 100%;
  position: fixed;
  overflow-y: hidden;
  opacity: 0.5;
}
.spinner {
  position: absolute;
  left: 50%;
  top: 50%;
}
</style>

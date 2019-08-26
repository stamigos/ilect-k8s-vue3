<template>
  <div class="dashboard">
    <app-header></app-header>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'

export default {
  name: 'Dashboard',
  components: { AppHeader },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style scoped>
  #dashboard {}
</style>

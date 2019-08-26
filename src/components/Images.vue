<template>
  <div id="">
    <app-header></app-header>
    <div class="alert alert-dismissible alert-info alert-main">
      <p class="normal-text">目的に応じたイメージをご利用ください。</p>
    </div>
    <div class="image-cards">
      <div v-for="image in images" v-bind:key="image.id" class="card image-card">
        <img class="card-img-top image-top" :src="image.imagePath">
        <div class="card-body">
          <h5 class="card-title">{{ image.title }}</h5>
          <p class="card-text">{{ image.description }}</p>
          <a href="#" class="btn btn-info">Detail</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
export default {
  name: 'Images',
  components: { AppHeader },
  data () {
    return {
      images: [
        { name: 'python', title: 'python Image', description: 'Python 3.6系 の実行環境', imagePath: require('../assets/python.png') },
        { name: 'TensorFlow', title: 'TensorFlow Image', description: 'TensorFlow 1.12.X の実行環境', imagePath: require('../assets/tensorflow.png') },
        { name: 'PyTorch', title: 'PyTorch Image', description: 'PyTorch 1.0.X の実行環境', imagePath: require('../assets/pytorch.png') }
      ]
    }
  }
}
</script>

<style scoped>
  .alert-main {
    position: relative;
    top: 3vh;
    left: 20vw;
    width: 60vw;
    padding-top: 3vh;
  }
  .image-cards {
    position: relative;
    top: 8vh;
    left: 10vw;
    width: 80vw;
    display: flex;
    flex-direction: row;
  }
  .image-card {
    position: relative;
    width: 20vw;
    margin-left: 3vw;
    padding-top: 1vh;
    padding-bottom: 1vh;
    padding-left: 1vw;
  }
  .image-top {
    height: 8vh;
  }

</style>

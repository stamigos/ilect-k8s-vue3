<template>
  <div>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
    </div>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import CourseSideBar from './inc/CourseSideBar'

export default {
  name: 'CoursePodList',
  data () {
    return {
      courseId: ''
    }
  },
  components: {CourseSideBar, AppHeader},
  created () {
    this.courseId = this.$route.params.courseId
  }
}
</script>

<style scoped>

</style>

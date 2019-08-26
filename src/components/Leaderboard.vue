<template>
  <div>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 pt-5">
        <div class="container">
          <div>
            <p class="text-secondary header">Assignment name</p>
            <p>{{assignmentId}}</p>
            <div class="pt-3">
              <b-table
                class="table-responsive"
                :items="submissions"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                @row-clicked="scoreSubmission"
              >
              <template slot="HEAD_crown" slot-scope="data">
                <span></span>
              </template>
                <template slot="crown" slot-scope="data">
                  <i class="fas fa-crown" :style="{color: data.item.color}"></i>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import CourseSideBar from './inc/CourseSideBar'
import ScoreService from './service/ScoreService'
// import CourseService from './service/CourseService'

export default {
  name: 'Leaderboard',
  components: { CourseSideBar, AppHeader },
  data () {
    return {
      createSuccess: false,
      buttonMessage: 'Score All',
      clicked: false,
      sortBy: 'username',
      sortDesc: false,
      fields: [
        {key: 'crown', sortable: false},
        {key: 'username', sortable: true},
        {key: 'score', sortable: true}
      ],
      submissions: [],
      courseId: ''
    }
  },
  methods: {
    changeClick () {
      if (this.clicked) {
        this.clicked = false
        this.buttonMessage = 'Create Assignment'
      } else {
        this.clicked = true
        this.buttonMessage = 'Cancel'
      }
    },
    getRandomColor () {
      var letters = '0123456789ABCDEF'
      var color = '#'
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)]
      }
      return color
    },
    loadSubmissions () {
      ScoreService.scoreSubmissions(this.courseId, this.assignmentId, (response) => {
        console.log(response)
        this.submissions = response.data.payload.submission
        this.submissions.forEach((item) => {
          item.color = this.getRandomColor()
        })
      }, (error) => {
        console.error(error)
      })
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.assignmentId = this.$route.params.assignmentId
    this.loadSubmissions()
  }
}
</script>

<style scoped>
  .el-button-right {
    position: relative;
    left: 0vw;
    width: 12vw;
  }
  .form-group {
    position: relative;
    padding: 2vh 0vw 2vh 0vw;
  }

</style>

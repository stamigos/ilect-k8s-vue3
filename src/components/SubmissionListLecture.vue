<template>
  <div>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 pt-5">
        <div class="container">
          <p class="text-secondary header">Assignment name</p>
          <p>{{assignment_name}}</p>
          <div class="col-sm-6 p-0">
            <b-input-group>
              <b-form-input id="form-search-input"
                     type="text"
                     name="search"
                     v-model="searchUser"
                     autocomplete="off"
                     placeholder="Search Registration Name">
              </b-form-input>
              <b-input-group-append>
                <b-button disabled="disabled"><i class="fas fa-search"></i></b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="pt-3">
            <div class="alert alert-dismissible alert-success" v-show="scoreSuccess">
              <button type="button" class="close" @click="scoreSuccess = null">&times;</button>
              <strong>Successfully scored!</strong>
            </div>
            <b-table
              class="table-responsive"
              :items="filteredList"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @row-clicked="rowClicked"
            >
              <template slot="HEAD_score_all" slot-scope="score_all">
                <b-button variant="primary" size="sm" @click="scoreUserAll">Score All</b-button>
              </template>
              <template slot="score_all" slot-scope="score_all">
                  <b-button variant="primary" size="sm" @click="scoreUser(score_all.item)">Score</b-button>
              </template>
            </b-table>
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

export default {
  name: 'CourseAssignmentList',
  components: { CourseSideBar, AppHeader },
  data () {
    return {
      createSuccess: false,
      buttonMessage: 'Score All',
      clicked: false,
      sortBy: 'username',
      sortDesc: false,
      fields: [
        { key: 'username', sortable: true },
        { key: 'score', sortable: true },
        { key: 'last_scored_time', sortable: true },
        { key: 'score_all', sortable: false }
      ],
      submissions: [],
      searchUser: '',
      courseId: '',
      assignment_name: null,
      assignmentId: '',
      scoreSuccess: null
    }
  },
  computed: {
    filteredList () {
      if (this.searchUser === '') return this.submissions
      return this.submissions.filter(submission => {
        return submission.username.toLowerCase().includes(this.searchUser.toLowerCase())
      })
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
    rowClicked (row) {
      this.$router.push(`/courses/${this.courseId}/assignments/${this.assignmentId}/submissions/${row.id}`)
    },
    scoreUser (item) {
      this.submissionId = item.id
      ScoreService.scoreSubmission(this.courseId, this.assignmentId, this.submissionId, (response) => {
        console.log(response)
        this.scoreSuccess = true
        this.loadSubmissions()
      }, (error) => {
        console.error(error)
      })
    },
    scoreUserAll () {
      ScoreService.scoreSubmissions(this.courseId, this.assignmentId, (response) => {
        console.log(response)
        this.scoreSuccess = true
        this.loadSubmissions()
      }, (error) => {
        console.error(error)
      })
    },
    loadSubmissions () {
      ScoreService.loadSubmissions(this.courseId, this.assignmentId, (response) => {
        console.log(response)
        this.submissions = response.data.payload.submission
        this.assignment_name = response.data.payload.assignment_name
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

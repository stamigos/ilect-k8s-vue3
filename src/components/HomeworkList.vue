<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-10 pt-5">
        <div class="container">
            <p class="text-secondary header">Course Name</p>
            <p>{{course_name}}</p>
            <b-table
              class="table table-hover table-responsive mt-5"
              :items="homeworkList"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @row-clicked="rowClicked"
            >
              <template v-slot:head(assignment_type)="assignment_type">
                  Type
              </template>
              <template v-slot:head(submission_status)="submission_status">
                  Status
              </template>
              <template v-slot:cell(deadline)="deadline">
                  {{ formatDate(deadline.item.deadline) }}
              </template>
            </b-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import CourseSideBar from './inc/CourseSideBar'
import CourseService from './service/CourseService'

export default {
  name: 'HomeworkList',
  components: { CourseSideBar, AppHeader },
  data () {
    return {
      courseId: '',
      course_name: null,
      sortBy: 'id',
      sortDesc: false,
      fields: [
        { key: 'id', sortable: true },
        { key: 'name', sortable: true },
        { key: 'description', sortable: true },
        { key: 'assignment_type', sortable: true },
        { key: 'command', sortable: true },
        { key: 'deadline', sortable: true },
        { key: 'submission_status', sortable: true },
        { key: 'last_scored_time', sortable: true }
      ],
      homeworkList: []
    }
  },
  methods: {
    rowClicked (row) {
      console.log(row)
      this.$router.push(`/courses/${this.courseId}/homework/${row.id}`)
    },
    formatDate (dateString) {
      var dateObj = new Date(dateString)
      var date = dateObj.getDate()
      var month = dateObj.getMonth() + 1
      var year = dateObj.getFullYear()
      var hours = dateObj.getHours()
      var minutes = dateObj.getMinutes()
      if (hours < 10) {
        hours = `0${hours}`
      }
      if (minutes < 10) {
        minutes = `0${minutes}`
      }
      return `${date}/${month}/${year}`
    },
    loadHomeworkList () {
      CourseService.findHomeworkList(this.courseId, (response) => {
        console.log(response)
        this.homeworkList = response.data.payload.homework
        this.course_name = response.data.payload.course_name
      }, (error) => {
        console.error(error)
      })
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.loadHomeworkList()
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

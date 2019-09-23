<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 pt-5">
        <div class="container">
          <p class="text-secondary header">Course Name</p>
          <p v-if="assignments[0]">{{course_name}}</p>
          <button class="btn btn-outline-info mt-3" v-b-modal.assignment-modal>Create Assignment</button>
          <div class="col-sm-12 pt-4">
            <b-table
              class="table-responsive"
              :items="assignments"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @row-clicked="rowClicked"
            >
              <template slot="leader_board" slot-scope="leader_board">
                <div @click="toggleDisplayLeaderboard($event, leader_board.item)">
                  <i class="fa fa-eye" v-if="leader_board.item.show_lb === true" aria-hidden="true"></i>
                  <i class="fa fa-eye-slash" v-else="" aria-hidden="true"></i>
                </div>
              </template>
            </b-table>
          </div>
        </div>
      </div>
    </div>
    <!-- add course modal -->
    <b-modal ref="addAssignmentModal"
             id="assignment-modal"
             title="Add a new assignment"
             hide-footer>
      <b-form @submit="createAssignment" @reset="onReset" class="w-100">
        <b-form-group id="form-name-group"
                      label="Assignment name:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="form.name"
                          required
                          placeholder="Enter assignment name">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-description-group"
                  label="Description:"
                  label-for="form-description-input">
        <b-form-textarea id="form-description-input"
                         v-model="form.description"
                         placeholder="Enter description..."
                         rows="3"
                         max-rows="6"
                         required
        ></b-form-textarea>
        </b-form-group>
        <b-form-group id="form-deadline-group"
                      label="Deadline:"
                      label-for="form-deadline-input">
            <flat-pickr id="form-deadline-input"
                        class="form-control"
                        placeholder="Select deadline"
                        v-model="form.deadline">
            </flat-pickr>
        </b-form-group>
        <b-form-group id="form-command-group"
                      label="Command:"
                      label-for="form-command-input">
            <b-form-input id="form-command-input"
                          type="text"
                          v-model="form.command"
                          placeholder="Enter command">
            </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import CourseSideBar from './inc/CourseSideBar'
import CourseService from './service/CourseService'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'

export default {
  name: 'CourseAssignmentList',
  components: { CourseSideBar, AppHeader, 'flat-pickr': flatPickr },
  data () {
    return {
      createSuccess: false,
      buttonMessage: 'Create Assignment',
      clicked: false,
      sortBy: 'id',
      sortDesc: false,
      fields: [
        { key: 'id', sortable: true },
        { key: 'name', sortable: true },
        { key: 'description', sortable: true },
        { key: 'command', sortable: true },
        { key: 'deadline', sortable: true },
        { key: 'leader_board', sortable: true }
      ],
      assignments: [],
      form: {
        name: '',
        description: '',
        command: '',
        deadline: ''
      },
      courseId: '',
      courseName: ''
    }
  },
  methods: {
    toggleDisplayLeaderboard (e, item) {
      e.stopPropagation()
      const params = {
        show_lb: !item.show_lb
      }
      CourseService.updateAssignment(this.courseId, item.id, params, (response) => {
        console.log(response)
        this.loadAssignments()
      }, (error) => {
        console.error(error)
      })
    },
    rowClicked (row) {
      console.log(row)
      this.$router.push(`/courses/${this.courseId}/assignments/${row.id}/submissions`)
    },
    changeClick () {
      if (this.clicked) {
        this.clicked = false
        this.buttonMessage = 'Create Assignment'
      } else {
        this.clicked = true
        this.buttonMessage = 'Cancel'
      }
    },
    createAssignment (evt) {
      evt.preventDefault()
      this.$refs.addAssignmentModal.hide()
      console.log(this.form)
      const params = this.form
      CourseService.createAssignment(this.courseId, params, (response) => {
        console.log(response)
        this.createSuccess = true
        this.clicked = false
        this.loadAssignments()
      }, (error) => {
        console.error(error)
      })
    },
    loadAssignments () {
      CourseService.findAssignments(this.courseId, (response) => {
        console.log(response)
        this.assignments = response.data.payload.assignments
        this.course_name = response.data.payload.course_name
      }, (error) => {
        console.error(error)
      })
    },
    initForm () {
      this.form.name = ''
      this.form.description = ''
      this.form.start = ''
      this.form.end = ''
    },
    onReset (evt) {
      evt.preventDefault()
      this.$refs.addAssignmentModal.hide()
      this.initForm()
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.loadAssignments()
  }
}
</script>

<style scoped>
  .btn-left {
    position: relative;
    left: 0vw;
    width: 12vw;
  }
  .form-group {
    position: relative;
    padding: 2vh 0vw 2vh 0vw;
  }

</style>

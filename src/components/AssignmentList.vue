<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-10 pt-5">
        <div class="container">
          <p class="text-secondary header">Course Name</p>
          <p v-if="assignments[0]">{{course_name}}</p>
          <button class="btn btn-outline-info mt-3" v-b-modal.assignment-modal>Create Assignment</button>
          <div class="col-sm-12 pt-4">
            <div class="table-responsive">
              <b-table
                :items="assignments"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                @row-clicked="rowClicked"
              >
                <template slot="HEAD_cron" slot-scope="HEAD_cron">
                  Cron
                </template>
                <template slot="deadline" slot-scope="deadline">
                  {{formatDate(deadline.item.deadline)}}
                </template>
                <template slot="cron" slot-scope="data">
                  {{data.item.cron.minutes}} {{data.item.cron.hours}} {{data.item.cron.day}} {{data.item.cron.month}} {{data.item.cron.day_of_the_week}}
                </template>
                <template slot="HEAD_assignment_type" slot-scope="HEAD_assignment_type">
                  Type
                </template>
                <template slot="leader_board" slot-scope="leader_board">
                  <div @click="toggleDisplayLeaderboard($event, leader_board.item)">
                    <i class="fa fa-eye" v-if="leader_board.item.show_lb === true" aria-hidden="true"></i>
                    <i class="fa fa-eye-slash" v-else="" aria-hidden="true"></i>
                  </div>
                </template>
                <template slot="actions" slot-scope="data">
                    <a class="mr-2" @click="selectAssignment($event, data.item)" v-b-modal.update-assignment-modal>
                      <i class="fas fa-edit text-primary"></i>
                    </a>
                </template>
              </b-table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- add course modal -->
    <b-modal ref="addAssignmentModal"
             id="assignment-modal"
             title="Add a new assignment"
             @show="initForm"
             @hidden="initForm"
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
                      label-for="form-deadline-input"
                      style="position: relative;margin-bottom: 50px;">
            <flat-pickr id="form-deadline-input"
                        class="form-control"
                        placeholder="Select deadline"
                        v-model="form.deadline"
                        style="position: absolute; top:40px; left:0;z-index: 2">
            </flat-pickr>
            <b-form-input style="position: absolute; top:40px; left:0;z-index: 1" type="text" name="deadline" v-model="form.deadline" required>
            </b-form-input>
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
        <b-form-group id="form-assignment-type-group"
                      label="Assignment Type:"
                      label-for="form-assignment-type-select">
          <b-form-select id="form-assignment-type-select" v-model="form.assignment_type" :options="assignmentTypeOptions"></b-form-select>
        </b-form-group>
        <b-form-group id="form-cron-setting-group"
                      label="Cron setting (Optional - minutes, hours, day, month, day of the week):"
                      label-for="form-cron-setting-input">
            <b-row>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.minutes">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.hours">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.day">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.month">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.day_of_the_week">
                </b-form-input>
              </b-col>
            </b-row>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.is_cron_activated" id="form-is-cron-activated-input" name="check-button" switch>
            Is cron activated
          </b-form-checkbox>
        </b-form-group>
        <b-button type="submit" class="mr-3" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>

    <!-- update course modal -->
    <b-modal ref="updateAssignmentModal"
             id="update-assignment-modal"
             title="Update assignment"
             hide-footer>
      <b-form @submit="updateAssignment" @reset="onResetUpdateAssignment" class="w-100">
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
                      label-for="form-deadline-input"
                      style="position: relative;margin-bottom: 50px;">
            <flat-pickr id="form-deadline-input"
                        class="form-control"
                        placeholder="Select deadline"
                        v-model="form.deadline"
                        style="position: absolute; top:40px; left:0;z-index: 2">
            </flat-pickr>
            <b-form-input style="position: absolute; top:40px; left:0;z-index: 1" type="text" name="deadline" v-model="form.deadline" required>
            </b-form-input>
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
        <b-form-group id="form-assignment-type-group"
                      label="Assignment Type:"
                      label-for="form-assignment-type-select">
          <b-form-select id="form-assignment-type-select" v-model="form.assignment_type" :options="assignmentTypeOptions"></b-form-select>
        </b-form-group>
        <b-form-group id="form-cron-setting-group"
                      label="Cron setting (minutes, hours, day, month, day of the week):"
                      label-for="form-cron-setting-input">
            <b-row>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.minutes">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.hours">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.day">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.month">
                </b-form-input>
              </b-col>
              <b-col sm="2">
                <b-form-input id="form-cron-setting-input"
                              type="text"
                              v-model="form.cron.day_of_the_week">
                </b-form-input>
              </b-col>
            </b-row>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox v-model="form.is_cron_activated" id="form-is-cron-activated-input" name="check-button" switch>
            Is cron activated
          </b-form-checkbox>
        </b-form-group>
        <b-button type="submit" class="mr-3" variant="primary">Submit</b-button>
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
        { key: 'assignment_type', sortable: true },
        { key: 'command', sortable: true },
        { key: 'deadline', sortable: true },
        { key: 'cron', sortable: true },
        { key: 'leader_board', sortable: true },
        { key: 'actions', sortable: false }
      ],
      assignments: [],
      form: {
        name: '',
        description: '',
        command: '',
        assignment_type: 0,
        deadline: '',
        cron: {
          minutes: '',
          hours: '',
          day: '',
          month: '',
          day_of_the_week: ''
        },
        is_cron_activated: null
      },
      courseId: '',
      courseName: '',
      assignmentTypeOptions: [
        { value: 0, text: 'Python' },
        { value: 1, text: 'CSV' }
      ]
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
      const cron = this.form.cron
      console.log('form.is_cron_activated:', this.form.is_cron_activated)
      const isCronActivated = this.form.is_cron_activated
      var _cronString = ''
      if (cron.minutes !== '' && cron.hours !== '' && cron.day !== '' &&
          cron.month !== '' && cron.day_of_the_week !== '') {
        _cronString = `${cron.minutes} ${cron.hours} ${cron.day} ${cron.month} ${cron.day_of_the_week}` // * * * * *
      }
      const params = {
        name: this.form.name,
        deadline: this.form.deadline,
        command: this.form.command,
        description: this.form.description,
        assignment_type: this.form.assignment_type === 0 ? 'Python' : 'CSV',
        cron: _cronString,
        is_cron_activated: isCronActivated
      }
      CourseService.createAssignment(this.courseId, params, (response) => {
        console.log(response)
        this.createSuccess = true
        this.clicked = false
        this.loadAssignments()
      }, (error) => {
        console.error(error)
      })
    },
    updateAssignment (evt) {
      evt.preventDefault()
      this.$refs.updateAssignmentModal.hide()
      const cron = this.form.cron
      console.log('form.is_cron_activated:', this.form.is_cron_activated)
      const isCronActivated = this.form.is_cron_activated
      var _cronString = ''
      if (cron.minutes !== '' && cron.hours !== '' && cron.day !== '' &&
          cron.month !== '' && cron.day_of_the_week !== '') {
        _cronString = `${cron.minutes} ${cron.hours} ${cron.day} ${cron.month} ${cron.day_of_the_week}` // * * * * *
      }
      const params = {
        name: this.form.name,
        deadline: this.form.deadline,
        command: this.form.command,
        description: this.form.description,
        assignment_type: this.form.assignment_type === 0 ? 'Python' : 'CSV',
        cron: _cronString,
        is_cron_activated: isCronActivated
      }
      CourseService.updateAssignment(this.courseId, this.assignmentId, params, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Assignment successfully updated!'
        this.loadAssignments()
      }, (error) => {
        console.error(error)
      })
    },
    selectAssignment (evt, assignment) {
      this.assignmentId = assignment.id
      this.form.deadline = assignment.deadline
      this.form.command = assignment.command
      this.form.name = assignment.name
      this.form.description = assignment.description
      if (assignment.cron === '') {
        this.form.cron = {
          minutes: '',
          hours: '',
          day: '',
          month: '',
          day_of_the_week: ''
        }
      } else {
        this.form.cron = assignment.cron
      }
      this.form.is_cron_activated = assignment.is_cron_activated
      this.form.assignment_type = assignment.assignment_type === 'Python' ? 0 : 1
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
      this.form.deadline = ''
      this.form.command = ''
      this.form.start = ''
      this.form.end = ''
      this.form.cron = {
        minutes: '',
        hours: '',
        day: '',
        month: '',
        day_of_the_week: ''
      }
      this.form.assignment_type = 0
      this.form.is_cron_activated = false
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
    onReset (evt) {
      evt.preventDefault()
      this.$refs.addAssignmentModal.hide()
      this.initForm()
    },
    onResetUpdateAssignment (evt) {
      evt.preventDefault()
      this.$refs.updateAssignmentModal.hide()
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

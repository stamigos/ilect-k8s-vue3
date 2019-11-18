<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 offset-sm-1 pt-5">
        <div class="alert alert-dismissible alert-warning" v-if="assignmentExpired">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Warning: Due date passed</strong><a v-if="!isPermissionRequested && !rejected" class="text-info" href="" @click="requestPermission"> -> Request permission of late submit </a><span v-if="submission && submission.late_submit === 'Requested'"> -> Late Submit: Waiting for approval</span>
        </div>
        <div class="alert alert-dismissible alert-success" v-if="!rejected && submission && submission.late_submit === 'Approved'">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Allowed late submit due date: {{ submission.late_submit_due_date }}</strong>
        </div>
        <div class="alert alert-dismissible alert-warning" v-if="rejected">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>Permission request rejected</strong>
        </div>
        <div class="alert alert-dismissible alert-success" v-if="successMessage">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>{{successMessage}}</strong>
        </div>
        <div class="alert alert-dismissible alert-danger" v-if="errorMessage">
          <button type="button" class="close" data-dismiss="alert">&times;</button>
          <strong>{{errorMessage}}</strong>
        </div>
        <div class="container">
          <b-button type="button"
                    variant="info"
                    style="float:right;"
                    @click="goToLeaderBoard($event)"
                    v-if="submission && assignment_show_lb === true">
              Go to LeaderBoard >
          </b-button>
          <p class="text-secondary header">Assignment name</p>
          <p>{{assignment_name}}</p>
          <p class="text-secondary header">Student name</p>
          <p v-if="submission">{{submission.user_name}}</p>
          <p v-else="">{{$user.get()['username']}}</p>
          <p class="text-secondary header">Score</p>
          <p v-if="submission">{{submission.score}}</p>
          <p class="text-secondary header">Last Scored Time</p>
          <p v-if="submission">{{submission.last_scored_time}}</p>
          <p class="text-secondary header">Scored output logs</p>
          <p v-if="submission" class="logs">{{submission.output}}</p>
          <p class="text-secondary header">Add Your Submission</p>
          <div class="editor-submission">
            <editor id="editor" v-model="content" minLines="5" maxLines="10" showGutter="true" showLineNumbers="false" @init="editorInit" lang="python" theme="dracula" width="750px" height="300px"></editor>
          </div>
          <div class="mt-4 mb-5">
            <b-button variant="info"
                      class="mr-3"
                      v-if="!rejected && !assignmentExpired || submission && submission.late_submit === 'Approved'"
                      v-on:click="createUpdateSubmission">
                    Save
            </b-button>
            <b-button variant="info"
                      class="mr-3"
                      v-if="assignment_type === 'CSV'"
                      @click="downloadCSV">
                    Download CSV
            </b-button>
            <b-button v-if="assignment_type === 'CSV' && !assignmentExpired || submission && submission.late_submit === 'Approved'"
                      type="button"
                      variant="info"
                      class="mr-3"
                      @click="$refs.fileSubmission.click()">
                    Upload Submission CSV
                    <input type="file" ref="fileSubmission" id="inputGroupFile01" v-on:change="uploadCSV()" style="display: none;" aria-describedby="inputGroupFileAddon01">
            </b-button>
          </div>
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
  name: 'HomeworkDetail',
  components: { CourseSideBar, AppHeader, editor: require('vue2-ace-editor') },
  data () {
    return {
      courseId: '',
      assignmentId: '',
      content: '',
      submission: null,
      assignment_name: null,
      assignment_type: null,
      assignment_deadline: null,
      assignmentExpired: null,
      assignment_show_lb: null,
      successMessage: false,
      errorMessage: false,
      isPermissionRequested: null,
      rejected: null
    }
  },
  methods: {
    loadSubmission () {
      CourseService.findSubmission(this.courseId, this.assignmentId, (response) => {
        console.log(response)
        this.assignment_name = response.data.payload.assignment_name
        this.assignment_type = response.data.payload.assignment_type
        this.assignment_deadline = response.data.payload.assignment_deadline
        this.assignment_show_lb = response.data.payload.assignment_show_lb

        this.checkDeadline()

        if (response.data.payload.submission) {
          this.content = response.data.payload.submission.content
          this.submission = {}
          this.submission.user_id = response.data.payload.submission.user_id
          this.submission.user_name = response.data.payload.submission.username
          this.submission.score = response.data.payload.submission.score
          this.submission.output = response.data.payload.submission.output
          this.submission.last_scored_time = response.data.payload.submission.last_scored_time
          this.submission.late_submit = response.data.payload.submission.late_submit
          this.submission.late_submit_due_date = response.data.payload.submission.late_submit_due_date
          this.checkDeadline(this.submission.late_submit)
          this.isPermissionRequested = this.submission.late_submit === 'Requested'
        }
      }, (error) => {
        console.error(error)
      })
    },
    checkDeadline (lateSubmit) {
      var deadline = new Date(this.assignment_deadline)
      var today = new Date()
      if (lateSubmit === 'Approved') {
        this.assignmentExpired = null
        return
      }
      if (lateSubmit === 'Rejected') {
        this.assignmentExpired = null
        this.rejected = true
        return
      }
      if (deadline < today) {
        this.assignmentExpired = true
      }
    },
    goToLeaderBoard (event) {
      event.stopPropagation()
      this.$router.push(`/courses/${this.courseId}/assignments/${this.assignmentId}/leaderboard`)
    },
    editorInit (editor) {
      require('brace/mode/html')
      require('brace/mode/python')
      require('brace/mode/less')
      require('brace/ext/language_tools')
      require('brace/theme/chrome')
      require('brace/theme/dracula')
      require('brace/theme/idle_fingers')
      editor.setOption('fontSize', '13pt')
      editor.setOption('vScrollBarAlwaysVisible', true)
      editor.setOption('theme', 'ace/theme/textmate')
      // https://github.com/thlorenz/brace/issues/81
      /*
      const ace = require('brace')
      require('brace/keybinding/vim')
      ace.config.loadModule('ace/keyboard/vim', module => {
        const VimApi = module.CodeMirror.Vim
        VimApi.defineEx('write', 'w', (cm, input) => {
          console.log('write')
        })
      })
      editor.setKeyboardHandler('ace/keyboard/vim')
      */
    },
    editorRender (output) {
      require('brace/mode/html')
      require('brace/mode/python')
      require('brace/mode/less')
      require('brace/ext/language_tools')
      require('brace/theme/chrome')
      require('brace/theme/chaos')
      require('brace/theme/idle_fingers')
      output.setOption('fontSize', '13pt')
      output.setOption('vScrollBarAlwaysVisible', true)
      output.setOption('theme', 'ace/theme/textmate')
    },
    createUpdateSubmission () {
      console.log('create/update')
      console.log(this.content)
      const params = {
        content: this.content
      }
      CourseService.addSubmission(this.courseId, this.assignmentId, params, (response) => {
        console.log(response)
        if (response.data.status === 'ok') {
          this.successMessage = 'Assignment submited!'
        }
      }, (error) => {
        this.errorMessage = error
        console.error(error)
      })
    },
    downloadCSV () {
      CourseService.downloadSubmissionCSV(this.courseId, this.assignmentId, this.fileSubmission)
    },
    uploadCSV () {
      this.fileSubmission = this.$refs.fileSubmission.files[0]
      CourseService.uploadSubmissionCSV(this.courseId, this.assignmentId, this.fileSubmission, (response) => {
        console.log(response)
        this.loadSubmission()
      })
    },
    requestPermission (e) {
      e.preventDefault()
      CourseService.requestPermission(this.courseId, this.assignmentId, (response) => {
        console.log('response:', response)
        this.isPermissionRequested = true
        this.successMessage = 'Permission requested'
        window.location.reload()
      }, (error) => {
        console.log('error:', error)
        this.errorMessage = error
        console.error(error)
      })
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.assignmentId = this.$route.params.assignmentId
    this.loadSubmission()
  }
}
</script>

<style scoped>
  .editor-submission-group {
    position: relative;
    left: 3vw;
    display: flex;
    flex-direction: column;
  }
  .editor-submission {
    position: relative;
    top: 2vh;
    margin-bottom: 20px;
  }
  .button-submission {
    position: relative;
    top: 5vh;
    width: 10vw;
    margin: 0 0 0 auto;
  }

</style>

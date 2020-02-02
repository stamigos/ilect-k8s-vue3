<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 offset-sm-1 pt-5">
        <div class="container">
          <div class="alert alert-dismissible alert-success mb-3" v-if="!isRejected && submission && submission.late_submit === 'Requested' && !isApproved">
            <p>Student requested permission of late submit:</p>
            <b-button type="submit" variant="primary" class="mr-2" v-b-modal.late-submit-modal>Approve</b-button>
            <b-button type="reset" variant="danger" @click="onRejectLateSubmit">Reject</b-button>
          </div>
          <div class="alert alert-dismissible alert-success mb-3" v-if="isApproved">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Request approved!</strong>
          </div>
          <div class="alert alert-dismissible alert-success mb-3" v-if="isRejected">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Request rejected!</strong>
          </div>
          <p class="text-secondary header">Assignment name</p>
          <p>{{assignment_name}}</p>
          <p class="text-secondary header">Student name</p>
          <p>{{submission.user_name}}</p>
          <p class="text-secondary header">Score</p>
          <p class="logs">{{submission.score}}</p>
          <p class="text-secondary header">Last Scored Time</p>
          <p v-if="submission">{{submission.last_scored_time}}</p>
          <p class="text-secondary header">Scored output logs</p>
          <p class="logs">
            {{submission.output}}
          </p>
          <p class="text-secondary header">Student Submission</p>
          <div class="editor-submission">
            <editor id="editor" v-model="content" @init="editorInit" lang="python" theme="dracula" width="750px" height="300px"></editor>
          </div>
        </div>
      </div>
    </div>
    <!-- late submit approval -->
    <b-modal ref="lateSubmitModal"
             id="late-submit-modal"
             title="Late Submit Modal"
             hide-footer>
      <b-form @submit="onApproveLateSubmit" class="w-100">
        <b-form-group id="form-late-submit-group"
                      label="Due to date:"
                      label-for="form-deadline-input"
                      style="position: relative;margin-bottom: 80px;">
            <flat-pickr id="form-late-submit-input"
                        class="form-control"
                        placeholder="Select due date"
                        v-model="lateSubmitForm.lateSubmitDue"
                        style="position: absolute; top:40px; left:0;z-index: 2">
            </flat-pickr>
            <b-form-input style="position: absolute; top:40px; left:0;z-index: 1" type="text" name="due-date" v-model="lateSubmitForm.lateSubmitDue" required>
            </b-form-input>
        </b-form-group>
        <div slot="modal-footer" class="mt-5 w-100">
          <b-button type="submit" variant="primary" class="mr-2">Approve</b-button>
        </div>
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
  name: 'SubmissionDetailLecture',
  components: { CourseSideBar, AppHeader, editor: require('vue2-ace-editor'), 'flat-pickr': flatPickr },
  data () {
    return {
      courseId: '',
      assignmentId: '',
      submissionId: '',
      content: '',
      assignment_name: null,
      submission: {
        user_id: null,
        score: null,
        output: null
      },
      lateSubmitForm: {
        lateSubmitDue: null
      },
      isApproved: null,
      isRejected: null
    }
  },
  methods: {
    loadSubmission () {
      CourseService.findSubmissionByLecturer(this.courseId, this.assignmentId, this.submissionId, (response) => {
        console.log(response)
        this.content = response.data.payload.submission.content
        this.submission.score = response.data.payload.submission.score
        this.submission.output = response.data.payload.submission.output
        this.submission.user_id = response.data.payload.submission.user_id
        this.submission.user_name = response.data.payload.submission.username
        this.submission.last_scored_time = response.data.payload.submission.last_scored_time
        this.submission.late_submit = response.data.payload.submission.late_submit
        this.assignment_name = response.data.payload.assignment_name
      }, (error) => {
        console.error(error)
      })
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
    addSubmission () {
      console.log('create')
      console.log(this.content)
      const params = {
        content: this.content
      }
      CourseService.addSubmission(this.courseId, this.assignmentId, params, (response) => {
        console.log(response)
      }, (error) => {
        console.error(error)
      })
    },
    onApproveLateSubmit (e, item) {
      e.preventDefault()
      this.$refs.lateSubmitModal.hide()
      const dueDate = this.lateSubmitForm.lateSubmitDue
      const params = {
        due_date: dueDate,
        user_id: this.submission.user_id
      }
      CourseService.approveRequest(this.courseId, this.assignmentId, params, (response) => {
        console.log(response)
        this.isApproved = true
      }, (error) => {
        console.error(error)
      })
    },
    onRejectLateSubmit (e) {
      e.preventDefault()
      this.$refs.lateSubmitModal.hide()
      const params = {
        user_id: this.submission.user_id
      }
      CourseService.rejectRequest(this.courseId, this.assignmentId, params, (response) => {
        console.log(response)
        this.isApproved = false
        this.isRejected = true
      }, (error) => {
        console.error(error)
      })
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.assignmentId = this.$route.params.assignmentId
    this.submissionId = this.$route.params.submissionId
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
  }
  .button-submission {
    position: relative;
    top: 5vh;
    width: 10vw;
    margin: 0 0 0 auto;
  }

</style>

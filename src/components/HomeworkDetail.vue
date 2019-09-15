<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 offset-sm-1 pt-5">
        <div class="container">
          <p class="text-secondary header">Assignment name</p>
          <p>{{assignment_name}}</p>
          <p class="text-secondary header">Student name</p>
          <p>{{submission.user_name}}</p>
          <p class="text-secondary header">Score</p>
          <p>{{submission.score}}</p>
          <p class="text-secondary header">Scored output logs</p>
          <p class="logs">{{submission.output}}</p>
          <p class="text-secondary header">Add Your Submission</p>
          <div class="editor-submission">
            <editor id="editor" v-model="content" minLines="5" maxLines="10" showGutter="true" showLineNumbers="false" @init="editorInit" lang="python" theme="dracula" width="750px" height="300px"></editor>
          </div>
          <button class="btn btn-info button-submission" v-on:click="addSubmission">Save</button>
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
      submission: {},
      assignment_name: null
    }
  },
  methods: {
    loadSubmission () {
      CourseService.findSubmission(this.courseId, this.assignmentId, (response) => {
        console.log(response)
        this.content = response.data.payload.submission.content
        this.submission.user_id = response.data.payload.submission.user_id
        this.submission.user_name = response.data.payload.submission.username
        this.submission.score = response.data.payload.submission.score
        this.submission.output = response.data.payload.submission.output
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
      let params = {
        content: this.content
      }
      CourseService.addSubmission(this.courseId, this.assignmentId, params, (response) => {
        console.log(response)
      }, (error) => {
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
  }
  .button-submission {
    position: relative;
    top: 5vh;
    width: 10vw;
    margin: 0 0 0 auto;
  }

</style>

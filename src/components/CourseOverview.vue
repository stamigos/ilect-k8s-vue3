<template>
  <div>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 pt-5">
        <div class="container">
          <div class="alert alert-dismissible alert-success" v-show="successFlag">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>{{ successMessage }}</strong>
          </div>
          <div class="alert alert-dismissible alert-danger" v-show="errorFlag">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>{{ errorMessage }}</strong>
          </div>
          <b-row class="col-sm-4">
            <b-col>
              <h5 class="text-dark">Instance Type</h5>
              <b-form-select v-model="instanceType" :options="instanceOptions"></b-form-select>
            </b-col>
          </b-row>
          <hr>
          <b-row class="col-sm-4">
            <b-col>
              <b-button-group>
                <button class="btn btn-info btn-lg" v-on:click="startPod">
                  <span v-if="!isLoadingStart">Start</span>
                  <b-spinner v-if="isLoadingStart" variant="primary" label="Spinning"></b-spinner>
                </button>
                <button class="btn btn-danger btn-lg" v-on:click="stopPod">
                  <span v-if="!isLoadingStop">Stop</span>
                  <b-spinner v-if="isLoadingStop" variant="primary" label="Spinning"></b-spinner>
                </button>
              </b-button-group>
            </b-col>
          </b-row>
          <hr>
          <b-row class="col-sm-3">
            <b-col>
              <b-form-select v-model="updateRegistrationForm.deadline" :options="extendOptions"></b-form-select>
            </b-col>
            <b-col>
              <button class="btn btn-info btn-md mt-3" v-on:click="extend">Extend</button>
            </b-col>
          </b-row>
          <hr>
          <b-row class="col-sm-4" v-if="resttime">
            <b-col>
              <h5 class="text-dark">Rest time Jupyter</h5>
              <h6 class="text-info">{{resttime}} min</h6>
            </b-col>
          </b-row>
          <hr v-if="resttime">
          <b-row class="col-sm-6">
            <div class="alert alert-dismissible alert-success" v-show="showAlert">
              <button type="button" class="close" @click="showAlert = false">&times;</button>
              <strong>{{ alertMessage }}</strong>
            </div>
          </b-row>
          <b-row class="col-sm-7" v-if="Object.keys(routes).length > 0 && podStatus === 'Running'">
            <b-col>
                <button class="btn btn-primary"><a :href="`https://${routes['notebook']}`" target="_blank" referrerpolicy="unsafe-url">Open NoteBook</a></button>
                <button class="btn btn-primary"><a :href="`https://${routes['vnc']}`" target="_blank" referrerpolicy="unsafe-url">Open VNC</a></button>
            </b-col>
          </b-row>
          <hr v-if="Object.keys(routes).length > 0 && podStatus === 'Running'">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import PodService from './service/PodService'
import CourseService from './service/CourseService'
import CourseSideBar from './inc/CourseSideBar'

export default {
  name: 'CourseOverview',
  components: { CourseSideBar, AppHeader },
  data () {
    return {
      successFlag: false,
      errorFlag: false,
      successMessage: '',
      alertMessage: '',
      showAlert: false,
      errorMessage: '',
      courseId: '',
      routes: [],
      podStatus: {},
      updateRegistrationForm: {
        deadline: 20
      },
      extendOptions: [
        {value: 10, text: '10 min'},
        {value: 20, text: '20 min'},
        {value: 60, text: '60 min'}
      ],
      isLoadingStart: false,
      isLoadingStop: false,
      resttime: null,
      instanceOptions: [
        {value: 0, text: 'CPU'},
        {value: 1, text: 'GPU'}
      ],
      instanceType: 0
    }
  },
  mounted () {
    this.getResttime()
  },
  methods: {
    startPod () {
      let params = {user: this.userName}
      this.isLoadingStart = true
      PodService.startPod(this.courseId, params, (response) => {
        console.log(response)
        PodService.findRoutes(this.courseId, (routeRes) => {
          this.routes = routeRes.data
        })
        var self = this;
        var timerId = setTimeout(() => {
          PodService.findStatus(self.courseId, (podRes) => {
            console.log(podRes)
            self.podStatus = podRes.data.pod_status
            if (podRes.data.pod_status === 'Running') {
              self.isLoadingStart = false
              clearInterval(timerId);
            }
          }, (error) => {
            self.isLoadingStart = false
            this.errorFlag = true
            this.errorMessage = error.response.data.reason
            clearInterval(timerId);
            console.error(error)
          })
         }, 5000);
      }, (error) => {
        console.error(error)
        this.errorFlag = true
        this.errorMessage = error.response.data.reason
      })
    },
    stopPod () {
      let params = {user: this.userName}
      PodService.stopPod(this.courseId, params, (response) => {
        console.log(response)
        PodService.findRoutes(this.courseId, (routeRes) => {
          this.routes = routeRes.data
        })
        PodService.findStatus(this.courseId, (podRes) => {
          console.log(podRes)
          this.podStatus = podRes.data.pod_status
        }, (error) => {
          console.error(error)
        })
      }, (error) => {
        console.error(error)
      })
    },
    getResttime() {
      PodService.getResttime(this.courseId, (response) => {
        console.log(response)
        this.resttime = response.data.payload.resttime
      }, (error) => {
        console.error(error)
      })
    },
    extend (evt) {
      evt.preventDefault()
      let params = {
        deadline: this.updateRegistrationForm.deadline
      }
      CourseService.extendDeadline(this.courseId, params, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Deadline successfully extended!'
      }, (error) => {
        console.error(error)
      })
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    console.log(this.courseId)
    PodService.findStatus(this.courseId, (podRes) => {
      console.log('podRes:', podRes)
      this.podStatus = podRes.data.pod_status
      PodService.findRoutes(this.courseId, (routeRes) => {
        console.log(routeRes)
        this.routes = routeRes.data
      })
    }, (error) => {
      console.error(error)
    })
  }
}
</script>

<style scoped>
</style>
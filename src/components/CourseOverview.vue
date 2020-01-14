<template>
  <div>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-8 pt-5">
        <div class="container">
          <b-row class="col-sm-6">
            <div class="alert alert-dismissible alert-success" v-show="showAlert">
              <button type="button" class="close" @click="showAlert = false">&times;</button>
              <strong>{{ alertMessage }}</strong>
            </div>
          </b-row>
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
              <b-form-select style="width: 180px;" :disabled="Object.keys(routes).length > 0 && podStatus === 'Running' || runningState === true" v-model="instanceType" :options="instanceOptions"></b-form-select>
            </b-col>
          </b-row>
          <hr>
          <b-row class="col-sm-8">
            <b-col>
              <div class="d-inline-block">
                <b-button-group>
                  <button class="btn btn-info btn-lg" v-on:click="startPod" :disabled="isLoadingStart || runningStateStop === true">
                    <span v-if="!isLoadingStart">Start</span>
                    <b-spinner v-if="isLoadingStart" variant="primary" label="Spinning"></b-spinner>
                  </button>
                  <button class="btn btn-danger btn-lg" v-on:click="stopPod" :disabled="isLoadingStop || runningStateStart === true">
                    <span v-if="!isLoadingStop">Stop</span>
                    <b-spinner v-if="isLoadingStop" variant="primary" label="Spinning"></b-spinner>
                  </button>
                </b-button-group>
              </div>
              <div class="d-inline-block ml-2">
                <b-badge variant="warning" v-if="podStatus !== '{}'">Status: <span v-if="statusLoading">{{ podStatus }}</span><b-spinner v-if="!statusLoading" variant="primary" type="grow" small label="Spinning"></b-spinner></b-badge>
              </div>
            </b-col>
          </b-row>
          <hr>
          <b-row class="col-sm-3">
            <b-col>
              <b-form-select style="width: 100px;" v-model="updateRegistrationForm.duration" :options="extendOptions"></b-form-select>
              <br>
              <button class="btn btn-info btn-md mt-3" v-on:click="extend">Extend</button>
            </b-col>
          </b-row>
          <hr>
          <b-row class="col-sm-4" v-if="resttime">
            <b-col class="rest-time">
              <h5 class="text-dark">Rest time Jupyter</h5>
              <circular-count-down-timer
                      :initial-value="resttime"
                      :stroke-width="4"
                      :seconds-stroke-color="'#17a2b8'"
                      :minutes-stroke-color="'#17a2b8'"
                      :hours-stroke-color="'##17a2b8'"
                      :underneath-stroke-color="'lightgrey'"
                      :size="100"
                      :padding="4"
                      :hour-label="'hours'"
                      :minute-label="'minutes'"
                      :second-label="'seconds'"
                      :paused="stopTimer"
                      :show-second="true"
                      :show-minute="true"
                      :show-hour="true"
                      :show-negatives="true"
                      :notify-every="'minute'"
              ></circular-count-down-timer>
            </b-col>
          </b-row>
          <hr v-if="resttime">
          <b-row class="col-sm-7" v-if="Object.keys(routes).length > 0 && podStatus === 'Running'">
            <b-col>
                <button class="btn btn-info mr-3">
                  <a v-if="!isNotebookLoading" class="jupyter-link" :href="`https://${routes['notebook']}`" target="_blank" referrerpolicy="unsafe-url">Open NoteBook</a>
                  <b-spinner v-if="isNotebookLoading" variant="primary" label="Spinning"></b-spinner>
                </button>
                <button class="btn btn-info">
                  <a v-if="!isNotebookLoading" class="jupyter-link" :href="`https://${routes['vnc']}`" target="_blank" referrerpolicy="unsafe-url">Open VNC</a>
                  <b-spinner v-if="isNotebookLoading" variant="primary" label="Spinning"></b-spinner>
                </button>
            </b-col>
          </b-row>
          <hr v-if="Object.keys(routes).length > 0 && podStatus === 'Running'">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
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
        duration: 20
      },
      extendOptions: [
        { value: 10, text: '10 min' },
        { value: 20, text: '20 min' },
        { value: 60, text: '60 min' },
        { value: 90, text: '90 min' },
        { value: 120, text: '120 min' }
      ],
      isLoadingStart: false,
      isLoadingStop: false,
      statusLoading: false,
      resttime: null,
      instanceOptions: [
        { value: 0, text: 'CPU' },
        { value: 1, text: 'GPU' }
      ],
      instanceType: 0,
      isNotebookLoading: false,
      runningStateStart: false,
      runningStateStop: false,
      runningState: false,
      stopTimer: true
    }
  },
  mounted () {
    var self = this

    this.getStatus()
    PodService.findRoutes(this.courseId, (routeRes) => {
      var self = this
      self.routes = routeRes.data
      self.isNotebookLoading = true
      self.isNotebookLoading = false
    })
    this.getResttime()
  },
  sockets: {
    connect () {
      console.log('connect')
      this.connectionLost = false
    },
    connect_error () {
      console.log('connection error')
      this.connectionLost = true
    }
  },
  methods: {
    startPod () {
      const isGpu = (this.instanceType === 1)
      const params = { user: this.userName, is_gpu: isGpu }
      this.runningStateStart = true
      this.runningState = true
      this.isLoadingStart = true
      PodService.startPod(this.courseId, params, (response) => {
        console.log(response)
        PodService.findRoutes(this.courseId, (routeRes) => {
          var self = this
          self.routes = routeRes.data
          self.isNotebookLoading = true
          setTimeout(() => {
            self.isNotebookLoading = false
          }, 3000)
        })
        var self = this
        var timerId = setInterval(() => {
          PodService.findStatus(self.courseId, (podRes) => {
            self.podStatus = podRes.data.pod_status
            if (podRes.data.pod_status === 'Running') {
              self.isLoadingStart = false
              self.runningStateStart = false
              self.runningState = false
              self.stopTimer = false
              clearInterval(timerId)
            }
          }, (error) => {
            self.isLoadingStart = false
            self.runningStateStart = false
            self.runningState = false
            self.errorFlag = true
            self.stopTimer = true
            self.errorMessage = error.response.data.reason
            console.error(error)
            clearInterval(timerId)
          })
        }, 3000)
      }, (error) => {
        console.error(error)
        this.errorFlag = true
        this.errorMessage = error.response.data.reason
      })
    },
    stopPod () {
      const params = { user: this.userName }
      this.runningStateStop = true
      this.runningState = true
      this.isLoadingStop = true
      PodService.stopPod(this.courseId, params, (response) => {
        console.log(response)
        PodService.findRoutes(this.courseId, (routeRes) => {
          this.routes = routeRes.data
        })
        var self = this
        var timerId = setInterval(() => {
          PodService.findStatus(this.courseId, (podRes) => {
            console.log(podRes)
            self.podStatus = podRes.data.pod_status
            console.log(podRes)
            if (podRes.data.pod_status === 'Stop') {
              self.isLoadingStop = false
              self.runningStateStop = false
              self.runningState = false
              self.stopTimer = true
              window.location.reload()
              clearInterval(timerId)
            }
          }, (error) => {
            self.isLoadingStop = false
            self.runningStateStop = false
            self.runningState = false
            self.errorFlag = true
            self.errorMessage = error.response.data.reason
            console.error(error)
          })
        }, 3000)
      }, (error) => {
        console.error(error)
      })
    },
    getResttime () {
      PodService.getResttime(this.courseId, (response) => {
        console.log('getResttime:', response)
        this.resttime = response.data.payload.resttime * 60
      }, (error) => {
        console.error(error)
      })
    },
    getStatus () {
      PodService.findStatus(this.courseId, (podRes) => {
        console.log(podRes)
        this.podStatus = podRes.data.pod_status
        if (this.podStatus === 'Running') {
          // this.subscribe()
          this.stopTimer = false
          this.getResttime()
        } else {
          this.stopTimer = true
          this.getResttime()
        }
        this.statusLoading = true
      }, (error) => {
        this.errorFlag = true
        this.alertMessage = error
        console.error(error)
      })
    },
    getCourse () {
      CourseService.getCourse(this.courseId, (response) => {
        console.log('getCourse:', response)
        this.course = response.data
        this.instanceType = response.data.container.gpu
        if (this.course.is_gpu_selectable === true) {
          this.instanceOptions = [
            { value: 0, text: 'CPU' },
            { value: 1, text: 'GPU' }
          ]
        } else {
          this.instanceOptions = [
            { value: 0, text: 'CPU' }
          ]
        }
      }, (error) => {
        console.error(error)
      })
    },
    extend (evt) {
      evt.preventDefault()
      const params = {
        duration: this.updateRegistrationForm.duration
      }
      CourseService.extendDeadline(this.courseId, params, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Deadline successfully extended!'
      }, (error) => {
        console.error(error)
      })
    },
    async subscribe () {
      console.log('resttime')
      const targetPath = `${process.env.VUE_APP_API_BASE_URL}/courses/${this.courseId}/resttime`
      try {
        var response = await axios.get(targetPath)
      } catch (error) {
        this.connectionLost = true
        // Reconnect in 100 miliseconds
        await new Promise(resolve => setTimeout(resolve, 100))
        // Call subscribe() again to get the next message
        await this.subscribe()
      }
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.getCourse()
    console.log(this.courseId)
    PodService.findStatus(this.courseId, (podRes) => {
      this.podStatus = podRes.data.pod_status
    }, (error) => {
      console.error(error)
    })
  }
}
</script>

<style scoped>
  .jupyter-link {
    color: #fff;
  }

/*  #countdown {
    position: relative;
    height: 100px;
    width: 100px;
    text-align: center;
  }

  #countdown-number {
    color: #17a2b8;
    display: inline-block;
    line-height: 100px;
  }

  svg {
    position: absolute;
    top: 0;
    right: 0;
    width: 100px;
    height: 100px;
    transform: rotateY(-180deg) rotateZ(-90deg);
  }

  svg circle {
    stroke-dasharray: 314.1592px;
    stroke-dashoffset: 0px;
    stroke-linecap: round;
    stroke-width: 3px;
    stroke: #17a2b8;
    fill: none;
    animation: countdown 7120s linear infinite forwards;
  }

  @keyframes countdown {
    from {
      stroke-dashoffset: 0px;
    }
    to {
      stroke-dashoffset: 314.1592px;
    }
  }*/
</style>
<style>
  .rest-time #wrapper {
    justify-content: left !important;
  }
  .rest-time #container .item {
    color: #17a2b8;
    text-align: center;
  }
  .rest-time #container {
    margin: 0 !important;
  }
</style>

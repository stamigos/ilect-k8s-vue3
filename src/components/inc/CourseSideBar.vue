<template>
  <div class="col-sm-2">
    <transition name="el-fade-in-linear">
      <div class="menu bg-light pt-4" v-show="!$store.state.sideBarFlag">
        <div class="menu-item">
          <h5 v-if="course" id="tooltip-target-1">{{text_truncate(course.name, 16, '...')}}</h5>
            <b-tooltip v-if="course" target="tooltip-target-1" triggers="hover">
              {{course.name}}
            </b-tooltip>
        </div>
        <div class="menu-item">
          <eva-icon name="globe" animation="pulse" fill="#263238"></eva-icon>
          <router-link :to="`/courses/${courseId}`">
            <a style="color: #263238;" :class="$route.name === 'CourseOverview' ? 'active-link': null">Top</a>
          </router-link>
        </div>
        <div class="menu-item">
          <eva-icon name="star" animation="pulse" fill="#263238"></eva-icon>
          <router-link :to="`/courses/${courseId}/homework`">
            <a style="color: #263238; line-height: 1;" :class="$route.name === 'HomeworkList' ? 'active-link': null">
              Homework
            </a>
          </router-link>
        </div>
        <div class="menu-item" v-if="user.role === 'lecturer'">
          <eva-icon name="book-open" animation="pulse" fill="#263238"></eva-icon>
          <router-link :to="`/courses/${courseId}/assignments`">
            <a style="color: #263238; line-height: 1;" :class="$route.name === 'AssignmentList' ? 'active-link': null">
              Assignments
            </a>
          </router-link>
        </div>
        <div class="menu-item" v-if="user.role === 'lecturer'">
          <eva-icon name="people" animation="pulse" fill="#263238"></eva-icon>
          <router-link :to="`/courses/${courseId}/registrations`" :class="$route.name === 'CourseRegistrationList' ? 'active-link': null">
            <a style="color: #263238;" v-bind:class="{'is-active': isActive}">
              Registrations
            </a>
          </router-link>
        </div>
        <div class="menu-item" v-if="user.role === 'lecturer'">
          <eva-icon name="cube" animation="pulse" fill="#263238"></eva-icon>
          <router-link :to="`/courses/${courseId}/containers`">
            <a style="color: #263238;" :class="$route.name === 'CoursePodList' ? 'active-link': null">Containers</a>
          </router-link>
        </div>
        <div class="menu-item" v-if="user.role === 'lecturer'">
          <eva-icon name="settings" animation="pulse" fill="#263238"></eva-icon>
          <router-link :to="`/courses/${courseId}/settings`">
            <a style="color: #263238;">Settings</a>
          </router-link>
        </div>
        <hr>
      </div>
    </transition>
  </div>
</template>

<script>
import CourseService from '../service/CourseService'

export default {
  name: 'CourseSideBar',
  props: ['courseId'],
  data () {
    return {
      isActive: false,
      course: null
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    hideBar () {
      if (this.$store.state.sideBarFlag) {
        this.$store.commit('updateSideBarFlag', false)
      } else {
        this.$store.commit('updateSideBarFlag', true)
      }
    },
    loadCourse () {
      CourseService.updateToken(this.$store.state.authHeader)
      CourseService.getCourse(this.courseId, (response) => {
        console.log('findCourses:', response)
        this.course = response.data
      }, (error) => {
        console.error(error)
      })
    },
    text_truncate (str, length, ending) {
      if (length == null) {
        length = 100
      }
      if (ending == null) {
        ending = '...'
      }
      if (str.length > length) {
        return str.substring(0, length - ending.length) + ending
      } else {
        return str
      }
    }
  },
  created () {
    console.log(this.courseId)
    if (this.$route.path.endsWith('/registrations')) {
      this.isActive = true
    }
    this.loadCourse()
  }
}
</script>

<style>
  .course-side-bar {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 15vw;
  }
  #tooltip-target-1 {
    cursor: pointer;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    .menu {
      width: 100%;
      height: 100%;
      padding-top: 15px;
      padding-bottom: 15px;
    }
  }
  @media (min-width: 481px) {
    .menu {
      width: 15vw;
      height: 100%;
      min-height: 100vh;
    }
  }
  .menu-item {
    padding: 1vh 0vw 1vh 1vw;
  }
  .active-link {
    font-weight: bold;
  }
</style>

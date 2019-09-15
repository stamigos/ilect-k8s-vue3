<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/">iLect</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/courses">Courses</b-nav-item>
        <b-nav-item href="#" disabled>Info</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">

        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template slot="button-content"><em>{{userName}}</em></template>
          <b-dropdown-item href="#">Profile</b-dropdown-item>
          <b-dropdown-item href="#" @click="apiSignOut">Sign Out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import ApiClient from '../utils/ApiClient'
import AuthService from '../service/AuthService'
import PodService from '../service/PodService'

export default {
  name: 'AppHeader',
  data () {
    return {
      isNavHide: false,
      routes: {},
      // routes: {'notebook': '', 'vnc': ''}
      podStatus: 'None',
      userName: 'irration'
    }
  },
  methods: {
    signOut () {
      console.log('signOut')
    },
    hideNavBar () {
      if (this.isNavHide) {
        this.isNavHide = false
      } else {
        this.isNavHide = true
      }
    },
    startPod () {
      alert('start pods!')
      this.isNavHide = false
      let params = {user: this.userName}
      PodService.startPod(this.courseId, params, (response) => {
        console.log(response)
        PodService.findRoutes(this.courseId, (routeRes) => {
          this.routes = routeRes.data
        })
        PodService.findStatus(this.courseId, params, (podRes) => {
          console.log(podRes)
          this.podStatus = podRes.data.pod_status
        }, (error) => {
          console.error(error)
        })
      }, (error) => {
        console.error(error)
      })
    },
    stopPod () {
      alert('start pods!')
      let params = {user: this.userName}
      this.isNavHide = false
      PodService.stopPod(this.courseId, params, (response) => {
        console.log(response)
      }, (error) => {
        console.error(error)
      })
    },
    apiSignOut () {
      AuthService.signOut((response) => {
        this.$router.push('/sign-in')
      }, (error) => {
        console.log('error:', error)
      })
    }
  },
  created () {
    let token = this.$store.state.authHeader
    AuthService.updateToken(token)
    AuthService.authCheck((response) => {
      ApiClient.updateToken(token)
      this.userName = response.data.username
      this.$store.commit('updateUser', response.data)
      this.$user.set(Object.assign(response.data))
      console.log(response)
    }, (error) => {
      console.error(error)
      this.$router.push('/sign-in')
    })

    /*
    let params = {user: this.userName}
    PodService.findStatus(this.courseId, params, (podRes) => {
      console.log(podRes)
      this.podStatus = podRes.data.pod_status
    }, (error) => {
      console.error(error)
    })
    PodService.findRoutes(this.courseId, (routeRes) => {
      this.routes = routeRes.data
    }, (error) => {
      console.error(error)
    })
    */
  }
}
</script>

<style>
  .app-header {
    position: fixed;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 8vh;
    z-index: 1;
  }
  .navbar {
    min-height: 8vh;
  }
</style>

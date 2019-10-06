<template>
  <b-navbar toggleable="lg" type="dark" variant="info">
    <b-navbar-brand href="/">iLect</b-navbar-brand>

    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item href="/courses">Courses</b-nav-item>
        <b-nav-item href="#" disabled>Info</b-nav-item>
        <b-nav-item href="#" disabled>
          <div class="alert alert-dismissible alert-danger" v-show="connectionLost">
            <strong>Connection lost.</strong>
          </div>
        </b-nav-item>
<!--           <div class="alert alert-dismissible alert-success" v-show="!connectionLost">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            <strong>Connection renewed.</strong>
          </div> -->
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
import axios from 'axios'

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
      userName: 'irration',
      connectionLost: false
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
      const params = { user: this.userName }
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
      const params = { user: this.userName }
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
    },
    async subscribe () {
      console.log('connection check')
      const targetPath = `${process.env.VUE_APP_API_BASE_URL}/health`
      try {
        var response = await axios.get(targetPath)
      } catch (error) {
        this.connectionLost = true
        // Reconnect in 3 seconds
        await new Promise(resolve => setTimeout(resolve, 6000))
        // Call subscribe() again to get the next message
        await this.subscribe()
      }

      if (response.status === 502) {
        await new Promise(resolve => setTimeout(resolve, 6000))
        await this.subscribe()
      } else if (response.status !== 200) {
        this.connectionLost = true
        await new Promise(resolve => setTimeout(resolve, 6000))
        await this.subscribe()
      } else {
        // let message = await response.text()
        this.connectionLost = false
        await new Promise(resolve => setTimeout(resolve, 6000))
        await this.subscribe()
      }
    }
  },
  created () {
    this.subscribe()
    const token = this.$store.state.authHeader
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

<style scoped>
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
  .alert {
    padding: 0px 15px;
    margin: 0;
  }
</style>

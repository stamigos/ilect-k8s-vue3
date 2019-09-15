<template>
  <div id="container">
      <div class="card login-form">
        <div class="card-body">
            <div class="login-form-btn text-center">
              <button class="btn btn-info btn-github" v-on:click="goToGitHubAuth">
                <i class="fab fa-github"></i>
                Login with GitHub
              </button>
              <hr>
              <span>or sign in with email/password:</span>
              <b-input-group prepend="Email" class="mt-3">
                <b-form-input type="email" v-model="form.email"></b-form-input>
              </b-input-group>
              <b-input-group prepend="Password" class="mt-3">
                <b-form-input type="password" v-model="form.password"></b-form-input>
              </b-input-group>
              <b-input-group class="mt-3">
                <button class="btn btn-info" @click="loginWithEmail()">
                  Login
                </button>
              </b-input-group>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import AuthService from './service/AuthService'
import ApiClient from './utils/ApiClient'

export default {
  name: 'SignIn',
  data () {
    return {
      gitHubSignInPath: '',
      authPath: 'auth/login',
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    goToGitHubAuth () {
      console.log('enter')
      this.$router.push('/github/auth/redirect')
    },
    loginWithEmail () {
      AuthService.loginWithEmail(this.form, (response) => {
        console.log('response:', response)
        let token = response.data.token
        console.log('token:', token)
        // this.$cookies.set('token', token, null, null, '*.v2.ilect.net')
        if (response.data.message === "Ok") {
          this.$store.commit('updateAuthHeader', `Bearer ${token}`)
          ApiClient.updateToken(token)
          this.$router.replace('/dashboard')
        } else {
          self.$router.replace('/sign-in')
        }
      }, (error) => {
        console.log(error)
        alert(error)
        self.$router.replace('/sign-in')
      })
    }
  },
  created () {
    this.gitHubSignInPath = `${process.env.VUE_APP_API_BASE_URL}/${this.authPath}`
    console.log(this.gitHubSignInPath)
  }
}
</script>

<style scoped lang="scss">
  .login-form {
    position: relative;
    padding: 5vh 10vw 5vh 10vw;
    left: 10%;
    width: 80%;
    top: 10%;
  }
  .login-form-btn {
    position: relative;
    padding: 2vh 1vw 2vh 1vw;
  }
  .btn-github {
    background-color: black;
    boader: black;
    width: 60%;
  }
  .separate-line {
    position: relative;
    top: 3vh;
    left: 8%;
    width: 84%;
    border: solid 1px #f7f7f7;
  }
  .user-sign-in-form {
    padding: 5vh 10vw 5vh 10vw;
  }
  .input-sign-in {
    position: relative;
    padding: 2vh 0vw 2vh 0vw;
    left: 10%;
    width: 80%;
  }
  .btn-sign-in {
    position: relative;
    left: 20%;
    right: 20%;
    width: 60%;
    height: 6vh;
  }
</style>

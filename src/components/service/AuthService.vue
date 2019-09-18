<script>
import ApiClient from '../utils/ApiClient'
import axios from 'axios'

const baseUrl = process.env.VUE_APP_API_BASE_URL

export default {
  name: 'AuthService',
  data () {
    return {
      token: ''
    }
  },
  updateToken: function (token) {
    this.token = token
    ApiClient.updateToken(this.token)
  },
  authCheck: function (callback, errorHandler) {
    const targetPath = '/is-authenticated'
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  loginWithEmail: function (params, callback, errorHandler) {
    const path = '/auth/login'
    const targetPath = baseUrl + path
    console.log(targetPath)
    console.log(params)

    axios.post(targetPath, params, {}).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  verifyApi: function (params, callback, errorHandler) {
    const path = '/auth/verify'
    const targetPath = baseUrl + path
    console.log(targetPath)
    console.log(params)

    axios.post(targetPath, params, {}).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  signOut: function (callback, errorHandler) {
    const targetPath = `${baseUrl}/auth/logout`
    axios.get(targetPath).then((response) => {
      console.log('response:', response)
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  githubSignIn: function () {}
}
</script>

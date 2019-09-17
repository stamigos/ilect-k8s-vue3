<template>
  <div></div>
</template>

<script>
import AuthService from './service/AuthService'
import ApiClient from './utils/ApiClient'

export default {
  name: 'Callback',
  created () {
    const oauthCode = this.$route.query.code
    const params = {
      code: oauthCode
    }
    const self = this
    AuthService.verifyApi(params, (response) => {
      const token = response.data.token
      this.$store.commit('updateGitHubCode', oauthCode)
      this.$store.commit('updateAuthHeader', `Bearer ${token}`)
      // this.$cookies.set('token', token, null, null, '*.v2.ilect.net')
      ApiClient.updateToken(token)
      this.$router.replace('/dashboard')
    }, (error) => {
      console.log(error)
      alert(error)
      self.$router.replace('/sign-in')
    })
  }
}
</script>

<style scoped>

</style>

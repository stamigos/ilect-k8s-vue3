<script>
import ApiClient from '../utils/ApiClient'

export default {
  name: 'Container',
  data () {
    return {
      token: ''
    }
  },
  updateToken: function (token) {
    this.token = token
    ApiClient.updateToken(this.token)
  },
  getCourseContainers: function (courseId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/containers`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  }
}
</script>

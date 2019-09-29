<script>
import ApiClient from '../utils/ApiClient'

export default {
  name: 'ScoreService',
  data () {
    return {
      token: ''
    }
  },
  updateToken: function (token) {
    this.token = token
    ApiClient.updateToken(this.token)
  },
  scoreSubmission: function (courseId, assignmentId, submissionId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/score/assignments/${assignmentId}/submissions/${submissionId}`
    const params = {}
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  scoreSubmissions: function (courseId, assignmentId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/score/assignments/${assignmentId}/submissions`
    const params = {}
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  loadSubmissions: function (courseId, assignmentId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/score/assignments/${assignmentId}/submissions`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  downloadCSV: function (courseId, assignmentId) {
    const baseApi = process.env.VUE_APP_API_BASE_URL
    const targetPath = `${baseApi}/courses/${courseId}/score/assignments/${assignmentId}/submissions/download-csv`
    window.open(targetPath)
  }
}
</script>

<style scoped>

</style>

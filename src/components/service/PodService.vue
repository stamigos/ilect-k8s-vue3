<script>
import ApiClient from '../utils/ApiClient'

export default {
  name: 'PodService',
  startPod: function (courseId, params, callback, errorHandler) {
    const targetPath = `/course/${courseId}/start`
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  stopPod: function (courseId, params, callback, errorHandler) {
    const targetPath = `/course/${courseId}/stop`
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findRoutes: function (courseId, callback, errorHandler) {
    const targetPath = `/course/${courseId}/routes`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findStatus: function (courseId, callback, errorHandler) {
    const targetPath = `/course/${courseId}/status`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  getResttime: function (courseId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/resttime`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  }
}
</script>

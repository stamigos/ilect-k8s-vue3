<script>
import ApiClient from '../utils/ApiClient'

export default {
  name: 'CourseService',
  data () {
    return {
      token: ''
    }
  },
  updateToken: function (token) {
    this.token = token
    ApiClient.updateToken(this.token)
  },
  findCourses: function (callback, errorHandler) {
    const targetPath = '/courses'
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  getCourse: function (courseId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  createCourse: function (params, callback, errorHandler) {
    const targetPath = '/courses'
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findStatus: function (courseId, params, callback, errorHandler) {
    const targetPath = `/course/${courseId}/status`
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findAssignments: function (courseId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/assignments`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  createAssignment: function (courseId, params, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/assignments`
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findRegistrations: function (courseId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/registrations`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  addRegistration: function (courseId, params, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/registrations`
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  updateRegistration: function (courseId, userId, params, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/registrations/${userId}`
    ApiClient.update(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  registrationsFromCSV: function (courseId, file, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/upload-github-csv`
    ApiClient.uploadFromCSVFile(targetPath, file, (response) => {
      console.log('rresponse:', response)
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  emailsFromCSV: function (courseId, file, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/upload-emails-csv`
    ApiClient.uploadFromCSVFile(targetPath, file, (response) => {
      console.log('rresponse:', response)
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  updateAssignment: function (courseId, assignmentId, params, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/assignments/${assignmentId}`
    ApiClient.update(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  extendDeadline: function (courseId, params, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/deadline`
    ApiClient.update(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  deleteRegistration: function (courseId, userId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/registrations/${userId}`
    ApiClient.destroyWithPath(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findHomeworkList: function (courseId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/homework`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  findSubmission: function (courseId, assignmentId, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/assignments/${assignmentId}/submissions`
    ApiClient.search(targetPath, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  addSubmission: function (courseId, assignmentId, params, callback, errorHandler) {
    const targetPath = `/courses/${courseId}/assignments/${assignmentId}/submissions`
    ApiClient.create(targetPath, params, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  }
}
</script>

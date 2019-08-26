<script>
import axios from 'axios'
axios.defaults.withCredentials = true

const baseUrl = process.env.VUE_APP_API_BASE_URL

export default {
  data () {
    return {}
  },
  updateToken: function (token) {
    axios.defaults.headers.common['HTTP_AUTHORIZATION'] = token
  },
  find: function (path, id, callback, errorHandler) {
    let targetPath = baseUrl + path + id

    axios.get(targetPath).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  search: function (pathWithQuery, callback, errorHandler, params) {
    let targetPath = baseUrl + pathWithQuery

    axios.get(targetPath, params).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  update: function (path, params, callback, errorHandler) {
    let targetPath = baseUrl + path

    axios.put(targetPath, params).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  uploadFile: function (path, file, params, callback, errorHandler) {
    let targetPath = baseUrl + path
    let formData = new FormData()
    formData.append('product_data', file)
    let config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    console.log(formData)
    console.log(params)

    axios.post(targetPath, formData, config, (response) => {
      callback(response)
    }, (error) => {
      errorHandler(error)
    })
  },
  create: function (path, params, callback, errorHandler) {
    let targetPath = baseUrl + path
    console.log(params)
    console.log(targetPath)

    axios.post(targetPath, params).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  destroy: function (path, id, callback, errorHandler) {
    let targetPath = baseUrl + path + '/' + id

    axios.delete(targetPath).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  },
  // TODO refactor to use HTTP Methods configurations
  destroyWithPath: function (path, callback, errorHandler) {
    let targetPath = baseUrl + path

    axios.delete(targetPath).then((response) => {
      callback(response)
    }).catch(function (error) {
      errorHandler(error)
    })
  }
}
</script>

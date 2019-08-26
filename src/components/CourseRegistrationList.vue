<template>
  <div id="">
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-9 pt-5">
          <b-form @submit.prevent inline>
            <div class="col-sm-3">
                  <button v-if="user.role === 'lecturer'" type="button" class="btn btn-outline-info mr-3" v-b-modal.registration-modal>Add Registration</button>
            </div>
            <div class="col-sm-7">
              <b-input-group>
                <b-form-input id="form-search-input"
                       type="text"
                       name="search"
                       v-model="githubId"
                       autocomplete="off"
                       placeholder="GitHub ID" >
                </b-form-input>
                <b-input-group-append>
                  <b-button disabled="disabled"><i class="fas fa-search"></i></b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
          </b-form>
          <div class="col-sm-10 pt-5">
            <div class="alert alert-dismissible alert-success" v-show="showAlert">
              <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>{{alertMessage}}</strong>
            </div>
            <b-table
              class="table-responsive"
              :items="handleRegistrationsList(filteredList)"
              :fields="fields"
              :sort-by.sync="sortBy"
              :sort-desc.sync="sortDesc"
              @row-clicked="rowClicked"
            >
              <template slot="HEAD_actions" slot-scope="actions">

              </template>
              <template slot="actions" slot-scope="data">
                  <a @click="selectRegistration($event, data.item)" v-b-modal.update-registration-modal>
                    <i class="fas fa-edit text-primary"></i>
                  </a>
                  <a @click="selectRegistration($event, data.item)" v-b-modal.delete-registration-modal>
                    <i class="fas fa-trash-alt text-danger"></i>
                  </a>
              </template>
            </b-table>
            <div class="text-center" v-if="!isLoadMore">
              <hr>
              <b-button variant="btn btn-info" @click="loadMore">Load more</b-button>
              <hr>
            </div>
          </div>
      </div>
    </div>
    <!-- add registration modal -->
    <b-modal ref="addRegistrationModal"
             id="registration-modal"
             title="Add registration"
             hide-footer>
      <b-form @submit="createRegistration" @reset="onReset" class="w-100">
        <b-form-group id="form-name-group"
                      label="Github ID:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="addRegistrationForm.githubId"
                          required
                          placeholder="Enter github ID">
            </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <!-- delete registration modal -->
    <b-modal ref="deleteRegistrationModal"
             id="delete-registration-modal"
             title="Delete registration">
        <p class="my-4">{{warningMessage || 'Are you sure?'}}</p>
        <div slot="modal-footer" class="w-100">
          <b-form @submit="deleteRegistration" @reset="onResetDelete" class="w-100">
            <b-button type="submit" variant="primary">Yes</b-button>
            <b-button type="reset" variant="danger">No</b-button>
          </b-form>
        </div>
    </b-modal>

    <!-- update registration modal -->
    <b-modal ref="updateRegistrationModal"
             id="update-registration-modal"
             title="Update registration"
             hide-footer>
      <b-form @submit="updateRegistration" @reset="onResetUpdate" class="w-100">
        <b-form-group>
          <b-form-checkbox
            id="checkbox-is-active"
            v-model="updateRegistrationForm.is_active"
            name="checkbox-is-active"
            :value="true"
            :unchecked-value="false"
          >
            Is Active
          </b-form-checkbox>
        </b-form-group>
        <b-form-group>
          <b-form-select v-model="roleSelected" :options="roles"></b-form-select>
        </b-form-group>
        <div slot="modal-footer" class="w-100">
          <b-button type="submit" variant="primary">Update</b-button>
          <b-button type="reset" variant="danger">Reset</b-button>
        </div>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import CourseSideBar from './inc/CourseSideBar'
import CourseService from './service/CourseService'

export default {
  name: 'CourseRegistrationList',
  data () {
    return {
      courseId: '',
      githubId: '',
      user_id: null,
      isLoadMore: false,
      showAlert: false,
      alertMessage: '',
      warningMessage: '',
      registrations: [],
      sortBy: 'id',
      sortDesc: false,
      fields: [
        {key: 'id', sortable: true},
        {key: 'user_name', sortable: true},
        {key: 'role', sortable: true},
        {key: 'acc_runtime', sortable: true},
        {key: 'active', sortable: true},
        {key: 'actions', sortable: false}
      ],
      addRegistrationForm: {
        githubId: null
      },
      updateRegistrationForm: {
        is_active: null
      },
      roles: [
        {value: 'lecturer', text: 'lecturer'},
        {value: 'student', text: 'student'}
      ],
      roleSelected: null
    }
  },
  computed: {
    filteredList () {
      if (this.githubId === '') return this.registrations
      return this.registrations.filter(registration => {
        return registration.user_name.toLowerCase().includes(this.githubId.toLowerCase())
      })
    },
    user () {
      return this.$store.state.user
    }
  },
  components: {CourseSideBar, AppHeader},
  methods: {
    rowClicked (row) {
      this.$router.push(`/courses/${row.id}`)
    },
    loadMore () {
      this.isLoadMore = true
    },
    handleRegistrationsList (registrations) {
      if (registrations.length <= 5) {
        this.isLoadMore = false
        return registrations
      }

      return this.isLoadMore ? registrations : registrations.slice(0, 5)
    },
    cellValueRenderer (row, column, cellValue) {
      const isBool = typeof row[column.property] === 'boolean'
      return !isBool ? cellValue : String(cellValue)
    },
    createRegistration (evt) {
      evt.preventDefault()
      this.$refs.addRegistrationModal.hide()
      let params = {
        account_name: this.addRegistrationForm.githubId
      }
      CourseService.addRegistration(this.courseId, params, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Registration successfully created!'
        this.loadRegistrations()
        this.initForm()
      }, (error) => {
        console.error(error)
      })
    },
    selectRegistration (evt, registration) {
      this.updateRegistrationForm.is_active = registration.active
      this.user_id = registration.user_id
      this.status = registration.status
      this.roleSelected = registration.role
      if (registration.status === 1) {
        this.warningMessage = 'Containter is running. Are you sure?'
      }
    },
    deleteRegistration (evt) {
      evt.preventDefault()
      this.$refs.deleteRegistrationModal.hide()
      CourseService.deleteRegistration(this.courseId, this.user_id, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Registration successfully removed!'
        this.loadRegistrations()
      }, (error) => {
        console.error(error)
      })
    },
    onResetDelete () {
      this.user_id = null
      this.$refs.deleteRegistrationModal.hide()
    },
    updateRegistration (evt) {
      evt.preventDefault()
      this.$refs.updateRegistrationModal.hide()
      let params = {
        is_active: Boolean(this.updateRegistrationForm.is_active),
        role: this.roleSelected
      }
      CourseService.updateRegistration(this.courseId, this.user_id, params, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Registration successfully updated!'
        this.loadRegistrations()
        this.initForm()
      }, (error) => {
        console.error(error)
      })
    },
    onResetUpdate () {
      this.user_id = null
      this.$refs.updateRegistrationModal.hide()
    },
    loadRegistrations () {
      CourseService.findRegistrations(this.courseId, (response) => {
        console.log(response)
        this.registrations = response.data.payload.registrations
      }, (error) => {
        console.error(error)
      })
    },
    initForm () {
      this.addRegistrationForm.githubId = ''
    },
    onReset (evt) {
      evt.preventDefault()
      this.$refs.addRegistrationModal.hide()
      this.initForm()
    }
  },
  created () {
    this.courseId = this.$route.params.courseId
    this.loadRegistrations()
  }
}
</script>

<style scoped>
</style>
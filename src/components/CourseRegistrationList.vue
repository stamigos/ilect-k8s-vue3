<template>
  <div id="">
    <Loader v-if='isLoading' :load='isLoading'/>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-9 pt-5">
          <div class="alert alert-dismissible alert-success" v-show="registeredSuccess.length > 0">
            <button type="button" class="close" @click="closeAlertSuccess()">&times;</button>
            <h4>Success: {{registeredSuccess.length}}</h4>
            <hr>
            <div class="scroll-bar" :class="isExpandSuccess ? 'no-max-height' : ''">
              <strong v-for="(r, index) in registeredSuccess" :key="index"><p>{{r}}</p></strong>
            </div>
            <span @click="expandSuccess()" v-if="registeredSuccess.length > 4 && isExpandSuccess !== true" class="pointer" style="margin: 0 auto;"><i class='fas fa-angle-double-down'></i></span>
          </div>
          <div class="alert alert-dismissible alert-warning" v-show="registeredFailed.length > 0">
            <button type="button" class="close" @click="closeAlertFailed()">&times;</button>
            <h4>Warning: {{registeredFailed.length}} – Account already exists</h4>
            <hr>
            <div class="scroll-bar" :class="isExpandFailed ? 'no-max-height' : ''">
              <strong v-for="(r, index) in registeredFailed" :key="index"><p>{{r}}</p></strong>
            </div>
            <span @click="expandFailed()" v-if="registeredFailed.length > 4 && isExpandFailed !== true" class="pointer" style="margin: 0 auto;"><i class='fas fa-angle-double-down'></i></span>
          </div>
          <b-form @submit.prevent inline>
            <div class="col-sm-5">
              <b-input-group>
                <b-form-input id="form-search-input"
                       type="text"
                       name="search"
                       v-model="githubId"
                       autocomplete="off"
                       placeholder="GitHub ID">
                </b-form-input>
                <b-input-group-append>
                  <b-button disabled="disabled"><i class="fas fa-search"></i></b-button>
                </b-input-group-append>
              </b-input-group>
            </div>
            <b-row class="col-sm-6">
                <b-col>
                  <b-button v-if="user.role === 'lecturer'" type="button" variant="outline-info" v-b-modal.registration-modal>Add Registration</b-button>
                </b-col>
                <b-col>
                  <b-dropdown id="dropdown-buttons" text="Upload CSV..." variant="outline-info" class="m-2" style="margin:0 !important;">
                    <b-dropdown-item-button>
                      <b-button v-if="user.role === 'lecturer'" type="button" variant="outline-info" @click="$refs.fileGithub.click()">Github Users
                        <input type="file" ref="fileGithub" id="inputGroupFile01" v-on:change="handleFileUploadGithub()" style="display: none;" aria-describedby="inputGroupFileAddon01">
                      </b-button>
                    </b-dropdown-item-button>
                    <b-dropdown-item-button>
                      <b-button v-if="user.role === 'lecturer'" type="button" variant="outline-info" @click="$refs.fileEmail.click()">Email Users
                        <input type="file" ref="fileEmail" id="inputGroupFile02" v-on:change="handleFileUploadEmails()" style="display: none;" aria-describedby="inputGroupFileAddon01">
                      </b-button>
                    </b-dropdown-item-button>
                  </b-dropdown>
                </b-col>
            </b-row>
          </b-form>
          <div class="col-sm-12 pt-5">
            <div class="alert alert-dismissible alert-success" v-show="showAlert">
              <button type="button" class="close" data-dismiss="alert">&times;</button>
              <strong>{{alertMessage}}</strong>
            </div>
            <div class="table-responsive">
              <b-table
                :items="handleRegistrationsList(filteredList)"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
              >
                <template slot="HEAD_actions" slot-scope="actions">

                </template>
                <template slot="actions" slot-scope="data">
                    <a class="mr-2" @click="selectRegistration($event, data.item)" v-b-modal.update-registration-modal>
                      <i class="fas fa-edit text-primary"></i>
                    </a>
                    <a class="mr-2" @click="selectRegistration($event, data.item)" v-b-modal.delete-registration-modal>
                      <i class="fas fa-trash-alt text-danger"></i>
                    </a>
                    <a class="mr-2" v-if="data.item.provider === 'Email'" @click="selectRegistration($event, data.item)" v-b-modal.change-password-modal>
                      <i class="fas fa-lock text-secondary"></i>
                    </a>
                </template>
              </b-table>
            </div>
            <div class="text-center" v-if="!isLoadMore && filteredList.length > 5">
              <hr>
              <b-button variant="btn btn-info" @click="loadMore">Load more (Total: {{filteredList.length}})</b-button>
              <hr>
            </div>
            <div class="text-center" v-if="isLoadMore && filteredList.length > 5">
              <hr>
              <b-button variant="btn btn-info" @click="collapse">Collapse (Total: {{filteredList.length}})</b-button>
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
        <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>

    <!-- change password modal -->
    <b-modal ref="changePasswordModal"
             id="change-password-modal"
             title="Change password"
             hide-footer>
      <b-form @submit="changePassword" @reset="onResetUpdatePassword" class="w-100">
        <b-form-group id="form-old-password-group"
                      label="Old Password:"
                      label-for="form-old-password-input">
            <b-form-input id="form-old-password-input"
                          type="password"
                          v-model="changePasswordForm.old_password"
                          required
                          placeholder="Old Password">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="New Password:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="password"
                          v-model="changePasswordForm.new_password"
                          required
                          placeholder="New Password">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-repeat-password-group"
                      label="Repeat Password:"
                      label-for="form-repeat-password-input">
            <b-form-input id="form-repeat-password-input"
                          type="password"
                          v-model="changePasswordForm.repeat_password"
                          required
                          placeholder="Repeat Password">
            </b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary" class="mr-2">Submit</b-button>
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
            <b-button type="submit" variant="primary" class="mr-2">Yes</b-button>
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
          <b-button type="submit" variant="primary" class="mr-2">Update</b-button>
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
import Loader from '@/components/Loader'

export default {
  name: 'CourseRegistrationList',
  data () {
    return {
      isLoading: false,
      courseId: '',
      githubId: '',
      user_id: null,
      isLoadMore: false,
      showAlert: false,
      alertMessage: '',
      warningMessage: '',
      registeredSuccess: [],
      registeredFailed: [],
      registrations: [],
      sortBy: 'id',
      sortDesc: false,
      fields: [
        { key: 'id', sortable: true },
        { key: 'user_name', sortable: true },
        { key: 'role', sortable: true },
        { key: 'acc_runtime', sortable: true },
        { key: 'provider', sortable: true },
        { key: 'active', sortable: true },
        { key: 'actions', sortable: false }
      ],
      addRegistrationForm: {
        githubId: null
      },
      updateRegistrationForm: {
        is_active: null
      },
      changePasswordForm: {
        old_password: null,
        new_password: null,
        repeat_password: null
      },
      roles: [
        { value: 'lecturer', text: 'lecturer' },
        { value: 'student', text: 'student' }
      ],
      roleSelected: null,
      isExpandFailed: false,
      isExpandSuccess: false
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
  components: { CourseSideBar, AppHeader, Loader },
  methods: {
    loadMore () {
      this.isLoadMore = true
    },
    collapse () {
      this.isLoadMore = false
    },
    expandFailed () {
      this.isExpandFailed = true
    },
    expandSuccess () {
      this.isExpandSuccess = true
    },
    closeAlertSuccess () {
      this.registeredSuccess = []
    },
    closeAlertFailed () {
      this.registeredFailed = []
    },
    changePassword (evt) {
      evt.preventDefault()
      this.$refs.changePasswordModal.hide()
      const params = {
        old_password: this.changePasswordForm.old_password,
        new_password: this.changePasswordForm.new_password,
        repeat_password: this.changePasswordForm.repeat_password
      }
      CourseService.updateRegistrationPassword(this.courseId, this.user_id, params, (response) => {
        console.log('updateRegistrationPassword:', response)
        if (response.data.payload.success === true) {
          this.showAlert = true
          this.alertMessage = 'Password successfully updated!'
          this.loadRegistrations()
          this.initForm()
        } else {
          console.error(response)
        }
      }, (error) => {
        console.error(error)
      })
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
      const params = {
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
      console.log('registration:', registration)
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
      const params = {
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
    onResetUpdatePassword () {
      this.user_id = null
      this.$refs.changePasswordModal.hide()
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
    handleFileUploadGithub () {
      this.isLoading = true
      this.fileGithub = this.$refs.fileGithub.files[0]
      CourseService.registrationsFromCSV(this.courseId, this.fileGithub, (response) => {
        this.isLoading = false
        this.registeredSuccess = response.data.payload.result.registered_success
        this.registeredFailed = response.data.payload.result.registered_failed
        this.loadRegistrations()
      })
    },
    handleFileUploadEmails () {
      this.isLoading = true
      this.fileEmail = this.$refs.fileEmail.files[0]
      CourseService.emailsFromCSV(this.courseId, this.fileEmail, (response) => {
        this.isLoading = false
        this.registeredSuccess = response.data.payload.result.registered_success
        this.registeredFailed = response.data.payload.result.registered_failed
        this.loadRegistrations()
      })
    },
    initForm () {
      this.addRegistrationForm.githubId = ''
      this.updateRegistrationForm.is_active = ''
      this.changePasswordForm.old_password = ''
      this.changePasswordForm.new_password = ''
      this.changePasswordForm.repeat_password = ''
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
.scroll-bar {
    max-height: 150px;
    overflow-y: auto;
}
.alert {
  text-align: center;
}
.alert h4 {
  text-align: left;
}
.alert .scroll-bar {
  text-align: left;
}
.no-max-height {
  max-height: none !important;
}
.pointer {
  cursor: pointer;
}
</style>

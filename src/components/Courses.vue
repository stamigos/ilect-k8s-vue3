<template>
  <div id="">
    <app-header></app-header>
    <div class="container pt-5">
      <div class="row w-100">
        <div class="col-sm-12">
          <div class="col-sm-10 offset-sm-1 dropdown">
            <b-form @submit.prevent inline>
              <div class="col-sm-3">
                <button v-if="user.role === 'lecturer'"
                        type="button"
                        class="btn btn-outline-info mr-3"
                        @click="createCourseInitial" v-b-modal.course-modal>
                      {{ buttonMessage }}
                </button>
              </div>
              <div class="col-sm-9">
                <b-input-group>
                  <b-form-input id="form-search-input"
                         type="text"
                         name="search"
                         v-model="searchCourse"
                         autocomplete="off"
                         placeholder="Search">
                  </b-form-input>
                  <b-input-group-append>
                    <b-button disabled="disabled"><i class="fas fa-search"></i></b-button>
                  </b-input-group-append>
                </b-input-group>
              </div>
            </b-form>
          </div>

          <div class="col-sm-12 offset-sm-2 pt-5">
              <div class="alert alert-dismissible alert-success" v-show="createSuccess">
                <button type="button" class="close" data-dismiss="alert">&times;</button>
                <strong>Course Created!</strong>
              </div>
              <b-table
                class="table-responsive"
                :items="handleCoursesList(filteredList)"
                :fields="fields"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                @row-clicked="handleCourseClicked"
              >
                <template slot="notifications">
                    <i class="far fa-bell"></i>
                </template>
                <template slot="actions" slot-scope="data">
                    <a class="mr-2" @click="selectCourse($event, data.item)" v-b-modal.update-course-modal>
                      <i class="fas fa-edit text-primary"></i>
                    </a>
                </template>
              </b-table>
              <div class="text-center" v-if="!isLoadMore && filteredList.length > 5">
                <hr>
                <b-button variant="btn btn-info" @click="loadMore">Load more</b-button>
                <hr>
              </div>
          </div>
        </div>
      </div>
    </div>
    <!-- add course modal -->
    <b-modal ref="addCourseModal"
             id="course-modal"
             title="Add a new course"
             hide-footer>
      <b-form @submit="createCourse" @reset="onReset" class="w-100">
        <b-form-group id="form-name-group"
                      label="Name:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="form.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-description-group"
                      label="Description:"
                      label-for="form-description-input">
            <b-form-textarea id="form-description-input"
                             v-model="form.description"
                             placeholder="Enter description..."
                             rows="3"
                             max-rows="6"
                             required
            ></b-form-textarea>
        </b-form-group>
        <b-form-group id="form-start-group"
                      label="Start Date:"
                      label-for="form-start-input">
            <flat-pickr id="form-start-input"
                        class="form-control"
                        placeholder="Select start date"
                        v-model="form.start">
            </flat-pickr>
        </b-form-group>
        <b-form-group id="form-end-group"
                      label="End Date:"
                      label-for="form-end-input">
            <flat-pickr id="form-end-input"
                        class="form-control"
                        placeholder="Select end date"
                        v-model="form.end">
            </flat-pickr>
        </b-form-group>
        <b-form-group id="form-billing-tag-group"
                      label="Billing tag:"
                      label-for="form-billing-tag-input">
            <b-form-input id="form-billing-tag-input"
                          type="text"
                          v-model="form.billing_tag"
                          required
                          placeholder="Enter billing tag">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-duration-group"
                      label="Duration:"
                      label-for="form-duration-input">
            <b-form-select v-model="form.duration" :options="durations"></b-form-select>
        </b-form-group>
        <b-form-group id="form-duration-group"
                      label="Is GPU selectable:"
                      label-for="form-duration-input">
            <b-form-select v-model="form.is_gpu_selectable" :options="is_gpu_selectable_variants"></b-form-select>
        </b-form-group>
        <b-button type="submit" class="mr-3" variant="primary">Submit</b-button>
        <b-button type="reset" class="mr-3" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <!-- update course modal -->
    <b-modal ref="updateCourseModal"
             id="update-course-modal"
             title="Update course"
             hide-footer>
      <b-form @submit="updateCourse" @reset="onReset" class="w-100">
        <b-form-group id="form-name-group"
                      label="Name:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="form.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-description-group"
                      label="Description:"
                      label-for="form-description-input">
            <b-form-textarea id="form-description-input"
                             v-model="form.description"
                             placeholder="Enter description..."
                             rows="3"
                             max-rows="6"
                             required
            ></b-form-textarea>
        </b-form-group>
        <b-form-group id="form-start-group"
                      label="Start Date:"
                      label-for="form-start-input">
            <flat-pickr id="form-start-input"
                        class="form-control"
                        placeholder="Select start date"
                        v-model="form.start">
            </flat-pickr>
        </b-form-group>
        <b-form-group id="form-end-group"
                      label="End Date:"
                      label-for="form-end-input">
            <flat-pickr id="form-end-input"
                        class="form-control"
                        placeholder="Select end date"
                        v-model="form.end">
            </flat-pickr>
        </b-form-group>
        <b-form-group id="form-billing-tag-group"
                      label="Billing tag:"
                      label-for="form-billing-tag-input">
            <b-form-input id="form-billing-tag-input"
                          type="text"
                          v-model="form.billing_tag"
                          required
                          placeholder="Enter billing tag">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-duration-group"
                      label="Duration:"
                      label-for="form-duration-input">
            <b-form-select v-model="form.duration" :options="durations"></b-form-select>
        </b-form-group>
        <b-form-group id="form-duration-group"
                      label="Is GPU selectable:"
                      label-for="form-duration-input">
            <b-form-select v-model="form.is_gpu_selectable" :options="is_gpu_selectable_variants"></b-form-select>
        </b-form-group>
        <b-button type="submit" class="mr-3" variant="primary">Submit</b-button>
        <b-button type="reset" class="mr-3" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import AppHeader from './utils/AppHeader'
import CourseService from './service/CourseService'
import Loader from '@/components/Loader'

export default {
  name: 'Courses',
  components: { AppHeader, flatPickr },
  data () {
    return {
      sortBy: 'name',
      sortDesc: false,
      fields: [
        { key: 'name', sortable: true },
        { key: 'description', sortable: true },
        { key: 'start', sortable: true },
        { key: 'end', sortable: true },
        { key: 'billing_tag', sortable: true },
        { key: 'duration', sortable: true, label: 'Duration (min)' },
        { key: 'notifications', sortable: false },
        { key: 'actions', sortable: false }
      ],
      courses: [],
      clicked: false,
      buttonMessage: 'Create Course',
      form: {
        name: '',
        description: '',
        start: '',
        end: '',
        duration: 30,
        is_gpu_selectable: true
      },
      searchCourse: '',
      createSuccess: false,
      isLoadMore: false,
      durations: [
        { value: 30, text: '30 min' },
        { value: 60, text: '60 min' },
        { value: 90, text: '90 min' },
        { value: 120, text: '120 min' },
        { value: 150, text: '150 min' },
        { value: 180, text: '180 min' },
        { value: 210, text: '210 min' },
        { value: 240, text: '240 min' },
        { value: 270, text: '270 min' },
        { value: 300, text: '300 min' },
        { value: 330, text: '330 min' },
        { value: 360, text: '360 min' },
        { value: 390, text: '390 min' },
        { value: 420, text: '420 min' },
        { value: 450, text: '450 min' },
        { value: 480, text: '480 min' }
      ],
      is_gpu_selectable_variants: [
        { value: false, text: 'False' },
        { value: true, text: 'True' }
      ]
    }
  },
  created () {
    this.loadCourses()
  },
  computed: {
    filteredList () {
      if (this.searchCourse === '') return this.courses
      return this.courses.filter(course => {
        return course.name.toLowerCase().includes(this.searchCourse.toLowerCase())
      })
    },
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    createCourseInitial () {
      this.initForm()
    },
    changeClick () {
      if (this.clicked) {
        this.clicked = false
        this.buttonMessage = 'Create Course'
      } else {
        this.clicked = true
        this.buttonMessage = 'Cancel'
      }
    },
    loadMore () {
      this.isLoadMore = true
    },
    handleCoursesList (courses) {
      if (courses.length <= 5) {
        this.isLoadMore = false
        return courses
      }
      return this.isLoadMore ? courses : courses.slice(0, 5)
    },
    initForm () {
      this.form.name = ''
      this.form.description = ''
      this.form.start = ''
      this.form.end = ''
      this.form.billing_tag = ''
      this.form.duration = 30
      this.form.is_gpu_selectable = true
    },
    onReset (evt) {
      evt.preventDefault()
      this.$refs.addCourseModal.hide()
      this.initForm()
    },
    createCourse (evt) {
      evt.preventDefault()
      this.$refs.addCourseModal.hide()
      console.log(this.form)
      const params = this.form
      CourseService.createCourse(params, (response) => {
        console.log(response)
        this.createSuccess = true
        this.clicked = false
        this.loadCourses()
        this.initForm()
      }, (error) => {
        console.error(error)
      })
    },
    updateCourse (evt) {
      evt.preventDefault()
      this.$refs.updateCourseModal.hide()
      console.log(this.form)
      const params = this.form
      CourseService.updateCourse(this.courseId, params, (response) => {
        console.log(response)
        this.updateSuccess = true
        this.clicked = false
        this.loadCourses()
        this.initForm()
      }, (error) => {
        console.error(error)
      })
    },
    loadCourses () {
      CourseService.updateToken(this.$store.state.authHeader)
      CourseService.findCourses((response) => {
        this.courses = response.data.payload.courses
      }, (error) => {
        console.error(error)
      })
    },
    handleCourseClicked (course) {
      this.$router.push(`/courses/${course.id}`)
    },
    selectCourse (evt, course) {
      this.courseId = course.id
      this.form.name = course.name
      this.form.description = course.description
      this.form.start = course.start
      this.form.end = course.end
      this.form.billing_tag = course.billing_tag
      this.form.duration = course.duration
      this.form.is_gpu_selectable = course.is_gpu_selectable
    }
  }
}
</script>

<style lang="scss" scoped>
  .header-form-group {
    position: relative;
    padding: 2vh 10vw 2vh 10vw;
  }
  .base-content {
    position: relative;
    padding: 2vh 10vw 2vh 10vw;
    left: 15vw;
    width: 70vw;
    right: 15vw;
  }
  .form-group {
    position: relative;
    // padding: 2vh 10vw 2vh 10vw;
    /*width: 80vw;*/
  }
  .content-group {
    position: relative;
    padding: 2vh 10vw 2vh 10vw;
    /*width: 80vw;*/
  }
</style>

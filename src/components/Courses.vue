<template>
  <div id="">
    <app-header></app-header>
    <div class="container pt-5">
      <div class="row w-100">
        <div class="col-sm-12">
          <div class="col-sm-10 offset-sm-1 dropdown">
            <b-form @submit.prevent inline>
              <div class="col-sm-3">
                <button v-if="user.role === 'lecturer'" type="button" class="btn btn-outline-info mr-3" v-b-modal.course-modal>{{ buttonMessage }}</button>
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

          <div class="col-sm-10 offset-sm-2 pt-5">
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
                          v-model="addCourseForm.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-description-group"
                      label="Description:"
                      label-for="form-description-input">
            <b-form-textarea id="form-description-input"
                             v-model="addCourseForm.description"
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
                        v-model="addCourseForm.start">
            </flat-pickr>
        </b-form-group>
        <b-form-group id="form-end-group"
                      label="End Date:"
                      label-for="form-end-input">
            <flat-pickr id="form-end-input"
                        class="form-control"
                        placeholder="Select end date"
                        v-model="addCourseForm.end">
            </flat-pickr>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
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
        { key: 'notifications', sortable: false }
      ],
      courses: [],
      clicked: false,
      buttonMessage: 'Create Course',
      addCourseForm: {
        name: '',
        description: '',
        start: '',
        end: ''
      },
      searchCourse: '',
      createSuccess: false,
      isLoadMore: false
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
      this.addCourseForm.name = ''
      this.addCourseForm.description = ''
      this.addCourseForm.start = ''
      this.addCourseForm.end = ''
    },
    onReset (evt) {
      evt.preventDefault()
      this.$refs.addCourseModal.hide()
      this.initForm()
    },
    createCourse (evt) {
      evt.preventDefault()
      this.$refs.addCourseModal.hide()
      console.log(this.addCourseForm)
      const params = this.addCourseForm
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
    loadCourses () {
      CourseService.updateToken(this.$store.state.authHeader)
      CourseService.findCourses((response) => {
        console.log('findCourses:', response)
        this.courses = response.data.payload.courses
      }, (error) => {
        console.error(error)
      })
    },
    handleCourseClicked (course) {
      this.$store.commit('COURSE_NAME', course.name)
      this.$router.push(`/courses/${course.id}`)
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
    padding: 2vh 10vw 2vh 10vw;
    /*width: 80vw;*/
  }
  .content-group {
    position: relative;
    padding: 2vh 10vw 2vh 10vw;
    /*width: 80vw;*/
  }
</style>

<template>
  <div>
    <app-header></app-header>
    <div class="row w-100">
      <course-side-bar :course-id="courseId"></course-side-bar>
      <div class="col-sm-10 pt-5">
        <div class="container">
          <div class="row">
              <b-card class="text-center">
                <b-card-sub-title class="mb-2"></b-card-sub-title>
                <b-card-text style="height: 100%;">
                  <a href="#" @click="addContainer" v-b-modal.add-container-modal><i class="fa fa-plus text-muted add-container"></i></a>
                </b-card-text>
              </b-card>
              <b-card v-for="(container, index) in containers" header-tag="header" footer-tag="footer" :key="index" class="text-center">
                <template v-slot:header>
                  <h6 class="mb-0">{{container.name}}
                    <a href="#" @click="preUpdateContainer($event, container)" v-b-modal.update-container-modal><i class="fa fa-cog edit-container" aria-hidden="true"></i></a>
                  </h6>
                </template>
                <b-card-text><i class="fa fa-cube text-muted cube-container" aria-hidden="true"></i></b-card-text>
                <b-card-text class="text-left"><b>Image:</b> {{container.image}}</b-card-text>
                <b-card-text class="text-left"><b>Description:</b> {{container.description}}</b-card-text>
                <b-card-text class="text-left"><b>Command:</b> {{container.command}}</b-card-text>
                <b-card-text class="text-left"><b>GPU:</b> {{container.gpu}}</b-card-text>
                <b-card-text class="text-left"><b>Env:</b> {{container.env}}</b-card-text>
                <template v-slot:footer>
                  <b-button href="#" @click="preDeleteContainer($event, container.id)" variant="danger" v-b-modal.delete-container-modal>Delete</b-button>
                </template>
              </b-card>
          </div>
        </div>
      </div>
    </div>
    <!-- add container modal -->
    <b-modal ref="addContainerModal"
             id="add-container-modal"
             title="Add a new container"
             hide-footer>
      <b-form @submit="createContainer" @reset="onReset" class="w-100">
        <b-form-group id="form-name-group"
                      label="Name:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="addContainerForm.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-description-group"
                      label="Description:"
                      label-for="form-description-input">
            <b-form-textarea id="form-description-input"
                             v-model="addContainerForm.description"
                             placeholder="Enter description..."
                             rows="3"
                             max-rows="6"
                             required
            ></b-form-textarea>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Image:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="addContainerForm.image"
                          placeholder="Enter image">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Command:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="addContainerForm.command"
                          placeholder="Enter command">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Gpu:"
                      label-for="form-name-input">
            <b-form-select v-model="addContainerForm.gpu" :options="instanceOptions"></b-form-select>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Env:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="addContainerForm.env"
                          required
                          placeholder="Enter env">
            </b-form-input>
        </b-form-group>
        <b-button type="submit" class="mr-3" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>
    <!-- edit container modal -->
    <b-modal ref="updateContainerModal"
             id="update-container-modal"
             title="Update container"
             hide-footer>
      <b-form @submit="updateContainer" @reset="onUpdateReset" class="w-100">
        <b-form-group id="form-name-group"
                      label="Name:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="updateContainerForm.name"
                          required
                          placeholder="Enter name">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-description-group"
                      label="Description:"
                      label-for="form-description-input">
            <b-form-textarea id="form-description-input"
                             v-model="updateContainerForm.description"
                             placeholder="Enter description..."
                             rows="3"
                             max-rows="6"
                             required
            ></b-form-textarea>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Image:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="updateContainerForm.image"
                          placeholder="Enter image">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Command:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="updateContainerForm.command"
                          placeholder="Enter command">
            </b-form-input>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Gpu:"
                      label-for="form-name-input">
            <b-form-select v-model="updateContainerForm.gpu" :options="instanceOptions"></b-form-select>
        </b-form-group>
        <b-form-group id="form-name-group"
                      label="Env:"
                      label-for="form-name-input">
            <b-form-input id="form-name-input"
                          type="text"
                          v-model="updateContainerForm.env"
                          required
                          placeholder="Enter env">
            </b-form-input>
        </b-form-group>
        <b-button type="submit" class="mr-3" variant="primary">Submit</b-button>
        <b-button type="reset" variant="danger">Reset</b-button>
      </b-form>
    </b-modal>

    <!-- delete container modal -->
    <b-modal ref="deleteContainerModal"
             id="delete-container-modal"
             title="Delete container">
        <p class="my-4">Are you sure?</p>
        <div slot="modal-footer" class="w-100">
          <b-form @submit="deleteContainer" @reset="onDeleteReset" class="w-100">
            <b-button type="submit" variant="primary" class="mr-2">Yes</b-button>
            <b-button type="reset" variant="danger">No</b-button>
          </b-form>
        </div>
    </b-modal>
  </div>
</template>

<script>
import AppHeader from './utils/AppHeader'
import CourseSideBar from './inc/CourseSideBar'
import CourseService from './service/CourseService'
import ContainerService from './service/ContainerService'

export default {
  name: 'CoursePodList',
  data () {
    return {
      courseId: '',
      containers: [],
      addContainerForm: {
        name: null,
        description: null,
        image: null,
        command: null,
        gpu: 0,
        env: null
      },
      updateContainerForm: {
        name: null,
        description: null,
        image: null,
        command: null,
        gpu: 0,
        env: null
      },
      instanceOptions: [
        { value: 0, text: 'CPU' },
        { value: 1, text: 'GPU' }
      ],
      container_id: null
    }
  },
  components: { CourseSideBar, AppHeader },
  created () {
    this.courseId = this.$route.params.courseId
    this.loadContainers()
  },
  methods: {
    loadContainers () {
      ContainerService.updateToken(this.$store.state.authHeader)
      ContainerService.getCourseContainers(this.courseId, (response) => {
        console.log('getContainers:', response)
        this.containers = response.data.payload.containers
      }, (error) => {
        console.error(error)
      })
    },
    addContainer (e) {
      e.preventDefault()
    },
    preUpdateContainer (e, container) {
      e.preventDefault()
      this.container_id = container.id
      this.updateContainerForm.name = container.name
      this.updateContainerForm.description = container.description
      this.updateContainerForm.command = container.command
      this.updateContainerForm.image = container.image
      this.updateContainerForm.gpu = container.gpu
      this.updateContainerForm.env = container.env
    },
    preDeleteContainer (e, containerId) {
      e.preventDefault()
      this.container_id = containerId
    },
    createContainer (e) {
      e.preventDefault()
      this.$refs.addContainerModal.hide()
      console.log(this.addContainerForm)
      const params = {
        name: this.addContainerForm.name,
        description: this.addContainerForm.description,
        command: this.addContainerForm.command,
        image: this.addContainerForm.image,
        gpu: this.addContainerForm.gpu,
        env: this.addContainerForm.env
      }
      CourseService.createCourseContainer(this.courseId, params, (response) => {
        console.log(response)
        this.createSuccess = true
        this.loadContainers()
        this.initForm()
      }, (error) => {
        console.error(error)
      })
    },
    updateContainer (e) {
      e.preventDefault()
      this.$refs.updateContainerModal.hide()
      console.log(this.updateContainerForm)
      const params = {
        name: this.updateContainerForm.name,
        description: this.updateContainerForm.description,
        command: this.updateContainerForm.command,
        image: this.updateContainerForm.image,
        gpu: this.updateContainerForm.gpu,
        env: this.updateContainerForm.env
      }
      CourseService.updateCourseContainer(this.courseId, this.container_id, params, (response) => {
        console.log(response)
        this.createSuccess = true
        this.loadContainers()
        this.initForm()
      }, (error) => {
        console.error(error)
      })
    },
    deleteContainer (evt) {
      evt.preventDefault()
      this.$refs.deleteContainerModal.hide()
      CourseService.deleteCourseContainer(this.courseId, this.container_id, (response) => {
        console.log(response)
        this.showAlert = true
        this.alertMessage = 'Container successfully removed!'
        this.loadContainers()
      }, (error) => {
        console.error(error)
      })
    },
    onReset (e) {
      e.preventDefault()
      this.$refs.addContainerModal.hide()
      this.initForm()
    },
    onUpdateReset (e) {
      e.preventDefault()
      this.$refs.updateContainerModal.hide()
      this.initForm()
    },
    onDeleteReset (e) {
      this.container_id = null
      this.$refs.deleteContainerModal.hide()
    },
    initForm () {
      this.addContainerForm = {
        name: null,
        description: null,
        image: null,
        command: null,
        gpu: 0,
        env: null
      }
    }
  }
}
</script>

<style scoped>
  .add-container {
    position: relative;
    top: calc(50% - 35px);
    font-size: 64px;
  }
  .cube-container {
    font-size: 64px;
    margin: 25px;
  }
  .edit-container {
    float: right;
    font-size: 24px;
  }
  .card {
    width: 30%;
    margin-right: 20px;
    margin-bottom: 20px;
  }
</style>

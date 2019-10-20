import Vue from 'vue'
import Router from 'vue-router'

import Dashboard from '../components/Dashboard'
import SignIn from '../components/SignIn'
import Courses from '../components/Courses'
import CourseOverview from '../components/CourseOverview'
import CourseRegistrationList from '../components/CourseRegistrationList'
import AssignmentList from '../components/AssignmentList'
import HomeworkList from '../components/HomeworkList'
import HomeworkDetail from '../components/HomeworkDetail'
import CoursePodList from '../components/CoursePodList'
import SubmissionDetailLecture from '../components/SubmissionDetailLecture'
import SubmissionListLecture from '../components/SubmissionListLecture'
import Leaderboard from '../components/Leaderboard'
import Images from '../components/Images'
import Callback from '../components/Callback'

// eslint-disable-next-line
import jQuery from 'jquery'
import 'bootstrap/dist/js/bootstrap'
import 'bootswatch/dist/sandstone/bootstrap.css'

Vue.use(Router)

const baseUrl = process.env.VUE_APP_API_BASE_URL

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/sign-in',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/github/auth/redirect',
      beforeEnter () { location.href = `${baseUrl}/auth/login/redirect` }
    },
    {
      path: '/courses',
      name: 'Courses',
      component: Courses
    },
    {
      path: '/courses/:courseId',
      name: 'CourseOverview',
      component: CourseOverview
    },
    {
      path: '/courses/:courseId/homework',
      name: 'HomeworkList',
      component: HomeworkList
    },
    {
      path: '/courses/:courseId/homework/:assignmentId',
      name: 'HomeworkDetail',
      component: HomeworkDetail
    },
    {
      path: '/courses/:courseId/registrations',
      name: 'CourseRegistrationList',
      component: CourseRegistrationList,
      meta: {
        permissions: [
          {
            role: 'student',
            access: false,
            redirect: 'Courses'
          }
        ]
      }
    },
    {
      path: '/courses/:courseId/assignments',
      name: 'AssignmentList',
      component: AssignmentList,
      meta: {
        permissions: [
          {
            role: 'student',
            access: false,
            redirect: 'Courses'
          }
        ]
      }
    },
    // {
    //   path: '/courses/:courseId/assignments/:assignmentId',
    //   name: 'AssignmentDetail',
    //   component: AssignmentDetail
    // },
    {
      path: '/courses/:courseId/assignments/:assignmentId/leaderboard',
      name: 'Leaderboard',
      component: Leaderboard
    },
    {
      path: '/courses/:courseId/assignments/:assignmentId/submissions',
      name: 'SubmissionListLecture',
      component: SubmissionListLecture,
      meta: {
        permissions: [
          {
            role: 'student',
            access: false,
            redirect: 'Courses'
          }
        ]
      }
    },
    {
      path: '/courses/:courseId/assignments/:assignmentId/submissions/:submissionId',
      name: 'SubmissionDetailLecture',
      component: SubmissionDetailLecture,
      meta: {
        permissions: [
          {
            role: 'student',
            access: false,
            redirect: 'Courses'
          }
        ]
      }
    },
    {
      path: '/courses/:courseId/containers',
      name: 'CoursePodList',
      component: CoursePodList,
      meta: {
        permissions: [
          {
            role: 'student',
            access: false,
            redirect: 'Courses'
          }
        ]
      }
    },
    {
      path: '/images',
      name: 'Images',
      component: Images
    },
    {
      path: '/github/callback',
      name: 'Callback',
      component: Callback
    }
  ]
})

import type {
  RouteRecordRaw,
} from 'vue-router';
import {
  createRouter, createWebHistory,
} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ReportView from '../views/ReportView.vue';
import SubmitView from '../views/SubmitView.vue';
import ReportsView from '../views/ReportsView.vue';
import UserView from '../views/UserView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/submit',
    name: 'Submit',
    component: SubmitView,
  },
  {
    path: '/user/registration',
    name: 'UserRegistration',
    component: UserView,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: ReportsView,
  },
  {
    path: '/report/:id',
    name: 'Report',
    component: ReportView,
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "terms" */ '../views/TermsView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: [{
    path: '/:locale?',
    children: routes,
  }],
});

export default router;

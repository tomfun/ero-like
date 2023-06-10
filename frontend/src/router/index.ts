import type {
  RouteRecordRaw,
} from 'vue-router';
import {
  createRouter, createWebHistory,
} from 'vue-router';
import AboutView from '../views/AboutView.vue';
import HomeView from '../views/HomeView.vue';
import ReportView from '../views/ReportView.vue';
import SubmitView from '../views/SubmitView.vue';
import ReportsView from '../views/ReportsView.vue';
import TermsView from '../views/TermsView.vue';
import UserView from '../views/UserView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/:locale?/submit',
    name: 'Submit',
    component: SubmitView,
  },
  {
    path: '/:locale?/user/registration',
    name: 'UserRegistration',
    component: UserView,
  },
  {
    path: '/:locale?/reports',
    name: 'Reports',
    component: ReportsView,
  },
  {
    path: '/:locale?/report/:id',
    name: 'Report',
    component: ReportView,
  },
  {
    path: '/:locale?/about',
    name: 'About',
    component: AboutView,
  },
  {
    path: '/:locale?/terms',
    name: 'Terms',
    component: TermsView,
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

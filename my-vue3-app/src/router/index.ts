import {
  createRouter, createWebHistory, RouteRecordRaw,
} from 'vue-router';
import Home from '../views/Home.vue';
import Submit from '../views/Submit.vue';
import Reports from '../views/Reports.vue';
import ReportsTab from '../views/ReportsTab.vue';
import User from '../views/User.vue';

// const reportTab: RouteRecordRaw = {
//   template: ReportsTab,
//   async beforeRouteUpdate(to: RouteComponent, from: RouteComponent) {
//     // react to route changes...
//     console.log(to, from);
//   },
// };

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/submit',
    name: 'Submit',
    component: Submit,
  },
  {
    path: '/user/registration',
    name: 'UserRegistration',
    component: User,
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
  },
  {
    path: '/reportsTab',
    name: 'ReportsTab',
    component: ReportsTab,
    beforeEnter: (to, from) => {
      console.log('TO:', to, 'From:', from);
    },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/terms',
    name: 'Terms',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "terms" */ '../views/Terms.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

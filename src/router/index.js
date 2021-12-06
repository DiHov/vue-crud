import Vue from 'vue';
import Router from 'vue-router';
import Ping from '@/components/Ping';
import Employees from '@/components/Employees';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Employees',
      component: Employees,
    },
    {
      path: '/',
      name: 'Ping',
      component: Ping,
    },
  ],
  mode: 'history',
});

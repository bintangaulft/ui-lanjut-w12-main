// Create '@/router.js'

import { createRouter, createWebHistory } from 'vue-router';

import Todo from './views/Todo.vue';
import Completed from '@/views/Completed.vue';

const routes = createRouter({
  history: createWebHistory(),
  routes: [
    { path:'/', component: Todo },
    { path:'/completed', component: Completed }
  ]
})

export default routes;
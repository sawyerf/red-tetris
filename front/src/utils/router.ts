import { createRouter, createWebHistory } from 'vue-router'
import GameView from '@/views/GameView.vue';
import ListView from '@/views/ListView.vue';
import UserView from '@/views/UserView.vue';
import CreateRoomView from '@/views/CreateRoomView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'userName',
      component: UserView,
    },
    {
      path: '/list',
      name: 'list',
      component: ListView
    },
    {
      path: '/create',
      name: 'create',
      component: CreateRoomView
    },
    {
      path: '/game',
      name: 'game',
      component: GameView
    },
  ]
})

export default router

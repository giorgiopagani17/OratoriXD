import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/HomePage.vue') }],
  },
  {
    path: '/users',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UsersPage.vue') }],
  },
  {
    path: '/events',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EventsActivities/HomeEventsActivities.vue'), props: { type: 'events' } }],
  },
  {
    path: '/activities',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EventsActivities/HomeEventsActivities.vue'), props: { type: 'activities' } }],
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'create', component: () => import('@/pages/EventsActivities/Create/CreateEventsActivities.vue'), props: (route) => ({ type: route.query.type, section: route.params.section }) }]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: 'view', component: () => import('@/pages/EventsActivities/View/AllEventsActivities.vue'), props: (route) => ({ type: route.query.type, section: route.params.section }) }]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'view/:id',
        component: () => import('@/pages/EventsActivities/View/SingleEventActivity.vue'),
        props: (route) => ({
          id: Number(route.params.id),
          section: route.params.section
        })
      }
    ]
  },
  {
    path: '/:section(activities|events)',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'view/:id/subscriptions',
        component: () => import('@/pages/Subscriptions/View/AllSubscriptions.vue'),
        props: (route) => ({
          id: Number(route.params.id),
          section: route.params.section
        })
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;

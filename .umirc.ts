import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '星驰国际影城',
  },
  routes: [
    {
      name: '首页',
      title: '设置影片',
      path: '/',
      component: './Home',
    },
  ],
  npmClient: 'pnpm',
});

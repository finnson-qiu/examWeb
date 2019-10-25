// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import "./assets/font/kaiti/Aa楷体v2.1.css";
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);    // 即可直接使用文档

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

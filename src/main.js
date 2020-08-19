import Vue from 'vue'
import App from './App.vue'
import UUID from "vue-uuid";
import vuetify from 'vuetify';
import VueRouter from 'vue-router';


//routes
import routes from './router.js';

const router = new VueRouter({
  routes // short for `routes: routes`
})

import 'vuetify/dist/vuetify.min.css';

Vue.use(vuetify);
Vue.use(UUID);
Vue.use(VueRouter);

new Vue({
  vuetify : new vuetify(),
  render: h => h(App),
  router
}).$mount('#app')

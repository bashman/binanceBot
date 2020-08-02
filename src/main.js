import Vue from 'vue'
import App from './App.vue'
import UUID from "vue-uuid";
import vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';

Vue.use(vuetify);
Vue.use(UUID);

new Vue({
  vuetify : new vuetify(),
  render: h => h(App)
}).$mount('#app')

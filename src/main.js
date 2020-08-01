import Vue from 'vue'
import App from './App.vue'
import vuetify from 'vuetify';

import 'vuetify/dist/vuetify.min.css';

Vue.use(vuetify);

new Vue({
  vuetify : new vuetify(),
  render: h => h(App)
}).$mount('#app')

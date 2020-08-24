import Vue from 'vue'
import App from './App.vue'
import UUID from "vue-uuid";
import vuetify from 'vuetify';
import VueRouter from 'vue-router';
import store from './store.js';


//routes
import routes from './router.js';

const router = new VueRouter({
  routes // short for `routes: routes`
})

router.beforeEach((to, from, next) => {
	if (to.matched.some(record => record.meta.requiresAuth)) {
		// this route requires auth, check if logged in
		// if not, redirect to login page.
		if (!store.state.user.loggedIn) {
			next({ name: 'Login' })
		} else {
			next() // go to wherever I'm going
		}
	} else {
		next() // does not require auth, make sure to always call next()!
	}
})

import 'vuetify/dist/vuetify.min.css';

Vue.use(vuetify);
Vue.use(UUID);
Vue.use(VueRouter);

new Vue({
  vuetify : new vuetify(),
  store,
  render: h => h(App),
  router
}).$mount('#app')

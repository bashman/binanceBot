<template>
	<v-row>
		<v-col>
			<input v-model="username" type="text" style="backgroundColor: white !important;">
			<input v-model="password" type="password" style="backgroundColor: white !important;">
			<v-btn @click="signup()">Signup</v-btn>
		</v-col>
	</v-row>
  
</template>

<script>
import axios from 'axios';

export default {
	data() {
		return {
			username: null,
			password: null
		}
	},
	methods: {
		async signup() {
			let jwt = await axios.post('/api/user/signup', { username: this.username, password: this.password});

			console.log(jwt)
		}
	},
	created() {
	}
}
</script>

<style>

</style>
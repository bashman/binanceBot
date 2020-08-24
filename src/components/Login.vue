<template>
	<v-row>
		<v-col v-if="!register">
			<input v-model="username" type="text" style="backgroundColor: white !important;">
			<input v-model="password" type="password" style="backgroundColor: white !important;">
			<v-btn @click="login()">Login</v-btn>
			<v-btn @click="register = true;"> Register </v-btn>
		</v-col>
		<v-col v-else>
			<Signup />
		</v-col>
	</v-row>
  
</template>

<script>
import axios from 'axios';
import Signup from './Signup';
import jwt from 'jsonwebtoken';

export default {
	components : {
		Signup
	},
	data() {
		return {
			username: null,
			password: null,
			register: false
		}
	},
	methods: {
		async login() {
			try {
				const { data: token } = await axios.post('/api/user/login', { username: this.username, password: this.password});

				localStorage.token = token;
				let userData = jwt.decode(token);

				this.$store.commit('updateAuth', userData);
				this.$router.push('/balances');

				console.log(this.$store.state)

			} catch(error) {
				console.log(error);
			}

		}
	},
	created() {
	}
}
</script>

<style>

</style>
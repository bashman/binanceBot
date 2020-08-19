<template>
	<div class="NavContainer">
		<v-row class="NavBar">
			<v-col @click="routeTo('balances')" cols="12" :style="tabStyling('balances')">
				Balances
			</v-col>
			<v-col @click="routeTo('transactions')" cols="12" :style="tabStyling('transactions')">
				<span>Transactions</span>
			</v-col>
			<v-col @click="routeTo('stochrsi')" cols="12" :style="tabStyling('stochrsi')">
				<span>StochRSI</span>
			</v-col>
		</v-row>
	</div>

</template>

<script>
export default {
	data() {
		return {
			currentTab: 'balances'
		}
	},
	methods: {
		routeTo(route) {
			this.currentTab = route;
			this.$router.push(route);
		},
		tabStyling(tab) {

			let defaultCss = {
				'color':'rgb(207, 207, 207)',
				'text-align': 'center',
				'font-family': 'Nunito',
				'font-size': '20px',
				'padding': '10px 0 10px 0',
				'transition': '0.4s'
			};
			
			if (tab === this.currentTab) {
				return {
					...defaultCss,
					color:'rgb(27, 116, 0)'
				}
			} else {
				return {
					...defaultCss,
					color: 'rgb(207, 207, 207)'
				}
			}
		}
	}

}
</script>

<style scoped>

.NavContainer {
	background-color: rgb(22, 22, 22);
	height:100vh;
}

.NavBar {
	margin: 0 0 0 0 !important;
}

.NavTab {
	color:rgb(207, 207, 207);
	text-align: center;
	font-family: 'Nunito';
	font-size: 20px;
	padding: 10px 0 10px 0;
	transition: 0.3s;
}

.NavTab:hover {
	color:rgb(27, 116, 0);
	cursor: pointer;
}

</style>
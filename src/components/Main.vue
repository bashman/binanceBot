<template>
    <v-template>
		<v-row style="margin:0 0 0 0 !important;">
			<v-col cols="2" class="noPadding">
				<Navbar />
			</v-col>
			<v-col cols="10" class="main">
				<router-view></router-view>
			</v-col>
		</v-row>
	</v-template>
  
</template>

<script>
import Navbar from './Navbar';

export default {
    components: { Navbar }
}
</script>

<style>

.noPadding {
	padding:0 0 0 0 !important;
	margin:0 0 0 0 !important;
}

.main {
	background-color: rgb(22, 22, 22);
	padding: 0 0 0 10px !important;
	margin:0 0 0 0 !important;
}

</style>
<template>
	<v-row>
		<v-col cols="12">
			<span class="transactionsHeader">Transaction History</span>
		</v-col>
		<v-col cols="11">
			<v-card dark>
				<table>
					<tr>
						<th class="tableRowHeader">TYPE</th>
						<th class="tableRowHeader">Asset</th>
						<th class="tableRowHeader">Price</th>
						<th class="tableRowHeader">Quantity</th>
						<th class="tableRowHeader">Date</th>
					</tr>
					<tr v-for="transaction in transactions" :key="transaction.createdAt" class="tableRow">
						<td class="tableCell" :style="color(transaction.type)">
							{{ transaction.type }}
						</td>
						<td class="tableCell">
							{{ transaction.symbol }}
						</td>
						<td class="tableCell">
							$ {{ Number(transaction.price).toFixed(2) }}
						</td>
						<td class="tableCell">
							{{ transaction.quantity }}
						</td>
						<td class="tableCell">
							{{ moment.utc(transaction.createdAt).local().format('MMMM Do YY, h:mm a') }}
						</td>
					</tr>
				</table>
			</v-card>
		</v-col>
	</v-row>
</template>

<script>
import axios from 'axios';
import moment from 'moment';

export default {
	data() {
		return {
			transactions: [],
			moment: moment
		}
	},
	methods: {
		async getTransactionData() {
			const { data } = await axios({
				method: 'GET',
				url: '/api/account/transactions'
			});


			this.transactions = data;
		},
		color(type) {
			return type === 'BUY' ? { color: 'green' } : { color: 'red' };
		}
	},
	created() {
		this.getTransactionData();
	}

}
</script>

<style scoped>
.transactionsHeader {
	font-size: 40px;
	font-family: 'Nunito';
	border-bottom: 1px solid antiquewhite;
	margin-left: 10px;
	padding: 0 100px 5px 5px;
	color:rgb(250, 235, 215);
}


.buyHeader {
	border-bottom: 1px solid green;
	color: green;
	font-family: 'Nunito';
	font-size: 20px;
}

.sellHeader {
	border-bottom: 1px solid rgb(202, 18, 18);
	color: rgb(202, 18, 18);
	font-family: 'Nunito';
	font-size: 20px;
}

.tableRowHeader {
	width: 20%
}

.tableRow {
	height: 35px;
	border-bottom: 1px solid rgb(116, 109, 100);
}

.tableCell {
	text-align: center;
}

table {
	font-family: 'Nunito';
	width:100%;
}





</style>
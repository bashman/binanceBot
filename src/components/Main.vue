<template>
    <v-container v-if="dataCollection" >
        <LineChart :chart-data="dataCollection" :options="{responsive: true, maintainAspectRatio: false}"/>
        
        <v-row>
            <v-col>
                <v-radio-group v-model="chartCurrency">
                    <v-radio
                        label="BTC"
                        value="BTC"
                    ></v-radio>
                    <v-radio
                        label="USD"
                        value="USD"
                    ></v-radio>
                </v-radio-group>
            </v-col>
        </v-row>

    </v-container >
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import LineChart from './LineChart.js';

export default {
    components: {
        LineChart
    },
    data() {
        return {
            balanceData: null,
            dataCollection: null,
            chartCurrency: 'BTC'
        }
    },
    async created() {
        this.getBalanceData();
    },
    methods: {
        async getBalanceData() {
            try {
                let { data } = await axios.get('http://localhost:3000/api/user/balanceData');

                this.balanceData = data
                this.structureChartData(this.balanceData);

            }catch(error) {
                console.log(error);
            }
        },
        structureChartData() {

            let newData = {
                labels:[],
                datasets: [{
                    label: `Balance ${this.chartCurrency}`,
                    backgroundColor: '#f87979',
                    data: []
                }]
            }

            this.balanceData.forEach(balances => {
                newData.labels.push(moment.utc(balances.createdAt).local().format('MMM Do YY'));


                if (this.chartCurrency === 'BTC') {
                    newData.datasets[0].data.push(Math.round(1000 * balances.balanceBTC) / 1000);
                } else {
                    newData.datasets[0].data.push(Math.round(balances.balanceUSD));
                }
            })

            this.dataCollection = newData;
        }
    },
    watch: {
        chartCurrency() {
            this.structureChartData();
        }
    }
}
</script>

<style scoped>

.chartContainer {
    /* width:200px; */
    height:200px;
}
</style>
<template>
    <div v-if="dataCollection" class="chartContainer">

        <LineChart :chart-data="dataCollection" :options="{responsive: true, maintainAspectRatio: false}"/>

    </div>
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
            dataCollection2: {
                labels:[1,2],
                datasets: [{
                    label:'stupid',
                    data:[1,2]
                }]
            }
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
                    label: 'Balance USD',
                    backgroundColor: '#f87979',
                    data: []
                }]
            }

            this.balanceData.forEach(balances => {
                newData.labels.push(moment.utc(balances.createdAt).local().format('MMM Do YY'));
                newData.datasets[0].data.push(Math.round(balances.balanceUSD));
            })

            this.dataCollection = newData;
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
<template>
    <v-container v-if="dataCollection" class="mainContainer">
        <LineChart :chart-data="dataCollection" :css-classes="'chart'" :options="{responsive: true, maintainAspectRatio: false}"/>
        
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
// import moment from 'moment';
import LineChart from './LineChart.js';
// import { uuid } from 'vue-uuid'

export default {
    components: {
        LineChart
    },
    data() {
        return {
            balanceData: null,
            dataCollection:null,
            // dataCollection: {
            //     labels:['1','2','3','4'],
            //     datasets:[
            //         {
            //             stack: '1',
            //             label: 'today',
            //             backgroundColor: '#FF6633',
            //             data: [1,1,1,1]
            //         },
            //         {
            //             stack: '1',
            //             label: 'today',
            //             backgroundColor: '#FFB399',
            //             data: [1,2,3,4]
            //         },
            //         {
            //             stack: '1',
            //             label: 'today',
            //             backgroundColor: '#FF33FF',
            //             data: [2,2,2,2]
            //         },
            //     ]
            // },
            chartCurrency: 'BTC',
            colorArray: ['#ff584d','#ff944d','#6bbd59','#59bdab','#595ebd','#b359bd','#babd59','#59acbd','#9c59bd'],
            coinColors: {}
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

                this.assignCoinColors(this.balanceData);
                this.structureChartData(this.balanceData);

            }catch(error) {
                console.log(error);
            }
        },
        structureChartData() {

            let newData = {
                labels:['whatever','whatever'],
                datasets: []
            }

            let allAssets = {};

            // newData.labels.push(moment.utc(balances.createdAt).local().format('MMM Do YY'));

            this.balanceData.forEach(balances => {

                balances.assets.forEach(asset => {
                    if (allAssets[asset.symbol]) {

                        if (this.chartCurrency === 'BTC') {
                            allAssets[asset.symbol].push(Math.round(1000 * asset.balanceBTC) / 1000);
                        } else {
                            allAssets[asset.symbol].push(Math.round(asset.balanceUSD));
                        }
                    } else {
                        if (this.chartCurrency === 'BTC') {
                            allAssets[asset.symbol] = [Math.round(1000 * asset.balanceBTC) / 1000]
                        } else {
                            allAssets[asset.symbol] = [Math.round(1000 * asset.balanceUSD) / 1000]
                        }

                    }
                })

                // let stackID = uuid.v1();

                // balances.assets.forEach(asset => {
                //     let dataset = {
                //         stack: stackID,
                //         backgroundColor: this.coinColors[asset.symbol],
                //         data: []
                //     };




                //     newData.datasets.push(dataset);
                //     // console.log(dataset)
                // })
            })

            for (const symbol in allAssets) {
                

                let dataset = {
                     label: symbol,
                     stack: 1,
                     backgroundColor: this.coinColors[symbol],
                     data: []
                 };

                allAssets[symbol].forEach(amount => {
                    dataset.data.push(amount);
                })

                newData.datasets.push(dataset)
            }

            console.log(newData)

            this.dataCollection = newData;
            // console.log(newData)
        },
        assignCoinColors(balances) {

            let mostAssetsBalance = {};
            balances.forEach(balance => {
                if (balance.assets.length > 0) {
                    mostAssetsBalance = balance;
                }
            });

            for (const asset of mostAssetsBalance.assets) {
                this.coinColors[asset.symbol] = this.colorArray.pop();
            }

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
.chart {
    background-color:rgb(226, 226, 226) !important;
    /* padding: 0 0 10px 0 */
    width:100vw;
}

.mainContainer {
    margin:0
}
</style>
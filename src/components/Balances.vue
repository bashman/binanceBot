<template>
    <v-container v-if="dataCollection" class="mainContainer">
        <BarChart :chart-data="dataCollection" :styles="chartStyles" :options="{responsive: true, maintainAspectRatio: false}"/>

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
import BarChart from './charts/BarChart.js';

export default {
    components: {
        BarChart
    },
    data() {
        return {
            balanceData: null,
            dataCollection:null,
            chartCurrency: 'BTC',
            colorArray: null,
            coinColors: {},
            chartData: {}
        }
    },
    async created() {
        this.getBalanceData();
    },
    methods: {
        async getBalanceData() {
            try {
                let { data } = await axios.get('http://localhost:3000/api/account/balances');

                this.balanceData = data

                this.assignCoinColors(this.balanceData);
                this.structureChartData(this.balanceData);

            }catch(error) {
                console.log(error);
            }
        },
        structureChartData() {

            let newData = {
                labels:[],
                datasets: []
            }


            this.balanceData.forEach(balances => {

                newData.labels.push(moment.utc(balances.createdAt).local().format('MMM Do YY'));

                        
                for (const assetStored in this.chartData) {
                    let assetExistsInBalance = false;
                    balances.assets.forEach(asset => {
                        if (asset.symbol === assetStored) {
                            if (this.chartCurrency === 'BTC') {
                                this.chartData[asset.symbol].push(Math.round(1000 * asset.balanceBTC) / 1000);
                            } else {
                                this.chartData[asset.symbol].push(Math.round(asset.balanceUSD));
                            }

                            assetExistsInBalance = true;
                        }            
                    });

                    if (!assetExistsInBalance) {
                        this.chartData[assetStored].push(0);
                    }
                }
            })

            for (const symbol in this.chartData) {

                

                let dataset = {
                     label: symbol,
                     stack: 1,
                     backgroundColor: this.coinColors[symbol],
                     data: []
                 };

                this.chartData[symbol].forEach(amount => {
                    dataset.data.push(amount);
                })

                newData.datasets.push(dataset)
            }

            this.dataCollection = newData;
        },
        assignCoinColors(balances) {

            this.colorArray = ['#ff584d','#ff944d','#6bbd59','#59bdab','#595ebd','#b359bd','#babd59','#59acbd','#9c59bd'];

            let mostAssetsBalance = {};
            let mostAssets = 0;
            balances.forEach(balance => {
                if (balance.assets.length > mostAssets) {
                    mostAssetsBalance = balance;
                    mostAssets = balance.assets.length;
                }
            });

            for (const asset of mostAssetsBalance.assets) {

                this.chartData[asset.symbol] = [];
                this.coinColors[asset.symbol] = this.colorArray.pop();
            }

        }
    },
    computed: {
        chartStyles() {
            return {
                height: '400px',
                width:'95vw',
                paddingLeft:'30px'
            }
        }
    },
    watch: {
        chartCurrency() {
            this.getBalanceData();
        }
    }
}
</script>

<style scoped>

.mainContainer {
    margin:0;
    width:100vw;
}
</style>
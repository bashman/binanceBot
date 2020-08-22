import Balances from '../src/components/Balances';
import StochRSI from '../src/components/StochRSI';
import Transactions from '../src/components/Transactions';

const routes = [
	{
		path: '*',
		redirect: '/balances'
	},
    { 
		path: '/balances', 
		component: Balances 
	},
	{
		path: '/stochrsi', 
		component: StochRSI 
	},
	{ 
		path: '/transactions', 
		component: Transactions 
	}
]

export default routes;

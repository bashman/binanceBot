import Balances from '../src/components/Balances';
import StochRSI from '../src/components/StochRSI';
import Transactions from '../src/components/Transactions';
import Login from '../src/components/Login';

const routes = [
	{
		path: '/',
		redirect: '/login'
	},
	{ 
		path: '/login', 
		component: Login 
	},
    { 
		path: '/balances', 
		component: Balances,
		meta: {
			requiresAuth: true
		} 
	},
	{
		path: '/stochrsi', 
		component: StochRSI,
		meta: {
			requiresAuth: true
		} 
	},
	{ 
		path: '/transactions', 
		component: Transactions,
		meta: {
			requiresAuth: true
		} 
	}
]

export default routes;

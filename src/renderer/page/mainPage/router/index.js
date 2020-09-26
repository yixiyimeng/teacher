import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/page/mainPage/pages/Main';
Vue.use(Router);

export default new Router({
	// mode: 'hash',
	// base: __dirname,
	name: 'mainPage',
	routes: [{
			path: '/',
			name: 'mainPage',
			component: Main,
			redirect: '/login',
			children: [{
					path: '/testiframe',
					name: 'testiframe',
					component: require('@/page/mainPage/components/testiframe').default
				}, {
					path: '/login',
					name: 'login',
					component: require('@/page/mainPage/components/login/login').default
				}, {
					path: '/classroom',
					name: 'classroom',
					component: require('@/page/mainPage/components/classroom/classroom').default,
				}, {
					path: '/titleList',
					name: 'titleList',
					component: require('@/page/mainPage/components/titleList/titleList').default,
				},


				// 			{
				// 				path: '/upload',
				// 				name: 'upload',
				// 				component: require('@/page/mainPage/components/upload/upload').default,
				// 			}
				// 			,
				{
					path: '/teacherroom',
					name: 'teacherroom',
					component: require('@/page/mainPage/components/teacherroom/teacherroom').default,
				},
				{
					path: '/redpack',
					name: 'redpack',
					component: require('@/page/mainPage/components/redpack/redpack').default,
				}
			]
		},
		{
			path: '/mainPage',
			name: 'mainPage',
			component: Main
		}
	]
});

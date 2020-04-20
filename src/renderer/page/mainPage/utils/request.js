import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import message from 'ant-design-vue/es/message'
import router from '../router'
import {
	VueAxios
} from './axios'
import {
	urlPath
} from './base'
axios.defaults.withCredentials = true;
// 创建 axios 实例
// 
const service = axios.create({
	baseURL: urlPath, // api base_url
	timeout: 6000 * 3 // 请求超时时间
})

// axios.defaults.transformRequest = [data => qs.stringify(data)];
let pending = []; //声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken; //取消接口请求
let removePending = (config) => {
	for (let p in pending) {
		if (pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
			pending[p].f(); //执行取消操作
			pending.splice(p, 1); //把这条记录从数组中移除
		}
	}
}
const err = (error) => {
	if (error && error.message && error.message.includes('timeout')) { // 判断请求异常信息中是否含有超时timeout字符串
		message.error('请求超时了');
	}
	return Promise.reject(error)
};

// request 拦截器
service.interceptors.request.use(config => {
	/* 设置请求头部 */
	//config.headers['Cookie'] = 'Basic token=' + token // 让每个请求携带自定义 token 请根据实际情况自行修改
	
	if (config.url.indexOf('mergeFile') >= 0) {
		return config
	}
	removePending(config); //在一个ajax发送前执行一下取消操作
	config.cancelToken = new cancelToken((c) => {
		// 这里的ajax标识我是用请求地址&请求方式拼接的字符串，当然你可以选择其他的一些方式
		pending.push({
			u: config.url + '&' + config.method,
			f: c
		});
	});
	return config
}, err)

// response 拦截器
service.interceptors.response.use((response) => {
	//console.log(response)
	removePending(response.config); //在一个ajax响应后再执行一下取消操作，把已经完成的请求从pending中移除
// 	if (response.data.ret == 'success') {
// 		return response.data;
// 	} else {
// 		message.error(response.data.message ? response.data.message : '发生错误了！');
// 
// 	}
return response.data;


}, err)

const installer = {
	vm: {},
	install(Vue) {
		Vue.use(VueAxios, service)
	}
}

export {
	installer as VueAxios,
	service as axios
}

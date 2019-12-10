import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {
	urlPath,
	urlwsPath
} from '@/page/mainPage/utils/base';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		webpath: '', //服务器地址
		platformpath: '', //平台地址
		foundationpath: '', //信息管理地址
		interactiopath: '', //数据管理地址
		isShowbg: true,
		isminimizeAppState: false, //最小化
		isstartClass: '', //直播间code
		selectWordList: [],
		selectSentenceList: [],
		websock: null,
		eventlist: [],
		alertCont: [],
		danmuinfolist: [],
		countDown:localStorage.getItem('countDown')||0,
		isCountDown:localStorage.getItem('isCountDown')||0,//是否启用倒计时

	},
	getters: {
		GET_WEBPATH: (state) => {
			return state.webpath
		},
		GET_PLATFORMPATH: (state) => {
			return state.platformpath
		},
		getisminimizeApp: (state) => {
			return state.isminimizeAppState
		},
		STAFF_UPDATE(state) {
			return state.websock
		},
		onEvent(state) {
			return function() {
				if (state.eventlist.length > 0) {
					let result = state.eventlist[0];
					state.eventlist.splice(0, 1);
					return result;
				}
				return null;
			}
		},
		onalertCont(state) {
			return function() {
				if (state.alertCont.length > 0) {
					let result = state.alertCont[0];
					state.alertCont.splice(0, 1);
					return result;
				}
				return null;
			}
		}

	},
	mutations: {
		SET_WEBPATH: (state, webpath) => {
			state.webpath = webpath;
			state.platformpath = webpath.teacher_platform;
			state.foundationpath = webpath.foundation;
			state.interactiopath = webpath.inte;
		},
		SET_isShowbg: (state, isShowbg) => {
			state.isShowbg = isShowbg
		},
		SET_isminimizeApp: (state, isminimize) => {
			state.isminimizeAppState = isminimize
		},
		SET_startClass: (state, flag) => {
			//console.log(directBroadcastCode);
			state.isstartClass = flag
		},
		SET_selectWordList: (state, selectWordList) => {
			state.selectWordList = selectWordList
		},
		SET_selectSentenceList: (state, selectSentenceList) => {
			state.selectSentenceList = selectSentenceList
		},
		STAFF_UPDATEWEBSOCKET(state, websock) {
			/* 更新websock */
			state.websock = websock
		},
		SET_danmuinfolist(state, danmuinfolist){
			state.danmuinfolist = danmuinfolist;
			localStorage.setItem('danmuinfolist', JSON.stringify(danmuinfolist));
		},
		SET_countDown(state, countDown){
			state.countDown = countDown;
			localStorage.setItem('countDown', countDown);
		},
		SET_isCountDown(state, isCountDown){
			state.isCountDown = isCountDown;
			localStorage.setItem('isCountDown', isCountDown);
		}
		
	},
	actions: {
		getApiPath({
			commit
		}, url) {
			return new Promise((resolve, reject) => {

				axios({
					url: url + 'teacher-client/common/getIp',
					method: 'post',
				}).then(da => {
					if (da.data.ret == 'success') {
						commit('SET_WEBPATH', da.data.data);

						resolve(da.data.data);
					} else {

						reject()
					}
				}).catch(() => {
					reject()
				})
			})
		},
		STAFF_WEBSOCKET({
			commit
		}) {
			let that = this;
			commit('STAFF_UPDATEWEBSOCKET', new WebSocket(urlwsPath + 'teacher-client/websocket'))
			// 只有定义了onopen方法，才能继续实现接收消息，即在使用的地方调用onmessage方法。
			this.state.websock.onopen = function() {

			}
			that.state.websock.onmessage = function(evt) {
				var received_msg = evt.data;
				var data = '';
				if (received_msg == '连接成功') {
					data = received_msg;
					that.state.eventlist.push({
						timeStr: new Date().getTime(),
						data: received_msg
					})
					that.state.alertCont.push({
						timeStr: new Date().getTime(),
						data: received_msg
					})
				} else {
					var msg = JSON.parse(received_msg);
					if (msg.reqType == 3) {
						that.state.alertCont.push({
							timeStr: new Date().getTime(),
							data: msg
						})
					} else {
						that.state.eventlist.push({
							timeStr: new Date().getTime(),
							data: msg
						})
					}
				}

			}

		}
	}
});

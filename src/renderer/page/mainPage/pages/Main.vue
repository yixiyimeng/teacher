<template>
	<div class="main-page" style="overflow: hidden;">
		<transition :name="transitionName">
			<router-view class="Router"></router-view>
		</transition>
		<div class="exitappWin animated fadeIn" v-if="isexit">
			<div class="confirm">
				<div>
					<div class="title">是否关闭程序？</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="isexit = !isexit">暂不</a>
						<a href="javascript:;" class="comfirmBtn" @click="exitApp">关闭</a>
					</div>
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import {
		urlPath
	} from '@/page/mainPage/utils/base';
	import upload from '@/page/mainPage/components/upload/upload';
	import {
		mapState,
		mapGetters
	} from 'vuex';
	export default {
		data() {
			return {
				transitionName: 'slide-right',
				isexit: false,
				isCloseUpload: false
			};
		},
		components: {
			upload,
		},
		computed: {
			...mapState(['isShowbg', 'isminimizeAppState', 'directBroadcastCode']),
			alertCont() {
				return this.$store.getters.onalertCont();
			}
		},
		methods: {
			exitApp: function() {
				const _this = this;
				this.$loading('正在退出软件...');
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/exit'
				});
				setTimeout(function() {
					_this.$loading.close();
					_this.$electron.ipcRenderer.send('exitApp');
				}, 100);
			},
			uploadTitle: function() {
				const _this = this;
				this.$loading('正在上传题目...');
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/xxxxxxxxxx'
				});
				setTimeout(function() {
					_this.$loading.close();
					_this.$electron.ipcRenderer.send('uploadTitle');
					_this.isupload = false;
				}, 100);
			},
			exitBtn: function() {
				const $me = this;

				var param = {
					code: this.directBroadcastCode
				};
				this.$loading('正在下课...');
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/endClass'
				}).then(da => {
					//$me.$loading.close();
					/* 跳转到选择直播间页面 */
					//$me.$router.go(-1); //返回上一层
				});
				setTimeout(function() {
					$me.$router.go(-1); //返回上一层
					// $me.$router.push({
					// 	path: 'classroom',
					// 	query: {
					// 		sendInfo: localStorage.getItem('sendInfo')
					// 	}
					// });

					$me.$loading.close();
				}, 5000);

				this.$store.commit('SET_startClass', false);
				/* 通知悬浮窗 退出直播间成功 */
				this.$electron.ipcRenderer.send('onlinedirebro', false);
			},
			// onmessage() {
			// 	let that = this
			// 	this.$store.getters.STAFF_UPDATE.onmessage = function(evt) {
			// 		var received_msg = evt.data;
			// 		console.log('前期ee'+received_msg)
			// 	}
			// }
		},
		watch: {
			//使用watch 监听$router的变化
			$route(to, from) {
				//如果to索引大于from索引,判断为前进状态,反之则为后退状态
				if (to.meta.index > from.meta.index) {
					//设置动画名称
					this.transitionName = 'slide-left';
				} else {
					this.transitionName = 'slide-right';
				}
			},

			alertCont: {
				handler(newName, oldName) {
					if (newName && newName != oldName)
						console.log("123343newName:" + JSON.stringify(newName));
				},
				immediate: true
			}

		},
		created() {
			/* 连接websock */
			this.$store.dispatch('STAFF_WEBSOCKET')

			const _this = this;
			/* 主进程 通知是否关闭软件 */
			_this.$electron.ipcRenderer.on('isexitApp', event => {
				_this.isexit = true;
			});
			/* 主进程 通知是否上传 */
			_this.$electron.ipcRenderer.on('isuploadTitle', event => {
				_this.isCloseUpload = true;
			});
			/* 主进程 通知是最小化 成功*/
			_this.$electron.ipcRenderer.on('isminimizeApp', (event, flag) => {
				_this.$store.commit('SET_isminimizeApp', flag);
			});
			
			/* 监听页面刷新的时候，存储store */
			window.addEventListener('beforeunload', () => {
				localStorage.setItem('messageStore', JSON.stringify(this.$store.state));
			});
			//在页面加载时读取localStorage里的状态信息
			localStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(
				localStorage.getItem('messageStore'))));

		}
	};
</script>

<style lang="less" scoped>
	.rightBtnlist {}

	.rightBtnlist .exitApp,
	.rightBtnlist .minApp,
	.rightBtnlist .exitBtn {
		opacity: 0;
		transition: all 0.3s;
	}

	.rightBtnlist:hover .exitApp,
	.rightBtnlist:hover .minApp,
	.rightBtnlist:hover .exitBtn {
		opacity: 1;
	}

	.rightBtnlist .kjbtn {
		opacity: 1;
		transition: all 0.3s;
	}

	.rightBtnlist:hover .kjbtn {
		opacity: 0;
	}

	.Router {
		position: absolute;
		width: 100%;
		transition: all 0.8s ease;
		z-index: 1;
		top: 0;
		height: 100%;
	}

	.slide-right-enter-active,
	.slide-right-leave-active,
	.slide-left-enter-active,
	.slide-left-leave-active {
		will-change: transform;
		transition: all 500ms;
		position: absolute;
	}

	.slide-right-enter {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}

	.slide-right-leave-active {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	.slide-left-enter {
		opacity: 0;
		transform: translate3d(100%, 0, 0);
	}

	.slide-left-leave-active {
		opacity: 0;
		transform: translate3d(-100%, 0, 0);
	}

	.bgimg {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
	}

	.bg {
		// background: rgba(0,0,0,.6)
	}
</style>

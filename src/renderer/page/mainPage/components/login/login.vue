<template>
	<div>
		<div class="modbox" ref="TopImg">
			<div>
				<form @keyup.enter="login">
					<div class="fromcontrol flex">
						<label>用户名</label>
						<input type="text" name="" id="" value="" placeholder="请输入用户名" v-model.trim="username" class="flex-1" />
						<dropmenu :reftitletypelist="loginInfolist" @selTalkName="selName" v-if="loginInfolist.length>0">
							<template slot-scope="item">
								{{ item.data.username }}
							</template></dropmenu>
					</div>
					<div class="fromcontrol flex">
						<label>密码</label>
						<input type="password" name="" id="" value="" placeholder="请输入密码" v-model.trim="password" class="flex-1" />

					</div>
					<div style="text-align: left; margin-top: 10px;">
						<div class="ant-checkbox-group">
							<label class="ant-checkbox-group-item ant-checkbox-wrapper" style="width: 20em;">
								<span class="ant-checkbox">
									<input type="checkbox" class="ant-checkbox-input" v-model="isRemeber" />
									<span class="ant-checkbox-inner"></span>
								</span>
								<span style="color:#1890ff;font-size:20px ;">记住密码</span>
							</label>
						</div>
					</div>
					<a href="javascript:;" class="loginBtn mt20" @click="login()">登录</a>
				</form>
			</div>
		</div>
		<!-- <div @click="saveImg">1233333333333333333</div>
		<div style="height:300px; width: 100%;">
			<vue-cropper ref="cropper" :img="htmlUrl" :info="true" :autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth"
			 :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox" @realTime="realTime">
			</vue-cropper>
		</div> -->
		
		<!-- <count-down :setTimer="20*1000" @stopCountDown="stopCountDown" ref="countdown"></count-down> -->
	</div>
</template>

<script>
	import {
		htmlescpe,
		urlPath
	} from '@/page/mainPage/utils/base';
	import {
		mapState,
		mapGetters,
		mapMutations,
		mapActions
	} from 'vuex';
	import html2canvas from 'html2canvas'
	// import CountDown from '@/page/mainPage/components/CountDown';
	import VueCropper from '@/page/mainPage/components/cropper/vue-cropper'
	import {
		dropmenu
	} from '@/page/mainPage/components';
	export default {
		components: {
			dropmenu,
			// CountDown,
			VueCropper
		},
		data() {
			return {
				username: '',
				password: '',
				sendInfo: '',
				clientType: 'directBroadcast',
				tips: '',
				downloadPercent: 0,
				version: '0.0.4',
				isShowversion: false,
				remark: '',
				isRemeber: true,
				htmlUrl: null,
				options: {
					img: '',
					autoCrop: true,
					autoCropWidth: 200,
					autoCropHeight: 200,
					fixedBox: true
				},
				loginInfolist: []
			};
		},
		created() {
			const _this = this;
			this.getApiPath(urlPath);
			this.$electron.ipcRenderer.send('uploadfile', false);
			try {
				var userinfo = JSON.parse(localStorage.getItem('loginStore'));
				if (userinfo && userinfo.length > 0) {
					this.username = userinfo[0].username;
					this.password = userinfo[0].password;
					this.loginInfolist = userinfo;
				}
			} catch (e) {
				//TODO handle the exception
			}
		},
		mounted() {
			// this.toImage();
			// this.$refs.countdown.startCount()
		},
		methods: {
			...mapActions(['getApiPath']),
			login() {
				if (this.username && this.password) {
					if (htmlescpe.test(this.username)) {
						this.$toast.center('账户中包含特殊字符!');
						return;
					}
					if (htmlescpe.test(this.password)) {
						this.$toast.center('密码中包含特殊字符!');
						return;
					}
					var param = {
						username: this.username,
						password: this.password,
						clientType: this.clientType
					};
					const $me = this;

					this.$loading('正在登陆...');
					this.$http({
							url: urlPath + '/teacher-client/platform/login',
							method: 'post',
							headers: {
								'Content-Type': 'application/json; charset=UTF-8'
							},
							data: JSON.stringify(param)
						})
						.then(da => {
							$me.$loading.close();
							if (da.data.ret == 'success') {
								if ($me.isRemeber) {
									var useritem = {
										username: $me.username,
										password: $me.password
									}
									if ($me.loginInfolist && $me.loginInfolist.length > 0) {
										const index = $me.loginInfolist.findIndex(item => item.username == $me.username);
										if (index > -1) {
											$me.loginInfolist[index] = useritem
										} else {
											$me.loginInfolist.unshift(useritem)
											if ($me.loginInfolist.length > 10) {
												$me.loginInfolist.pop();
											}

										}
									} else {
										$me.loginInfolist = [useritem]
									}

									localStorage.setItem(
										'loginStore',
										JSON.stringify($me.loginInfolist)
									);
								} else {
									localStorage.removeItem('loginStore')
								}
								$me.sendInfo = {
									schoolCode: da.data.data.schoolCode,
									schoolName: da.data.data.schoolName,
									teacAssistantCode: da.data.data.userId,
									teacAssistantName: da.data.data.name,
									teacherCode: da.data.data.userId,
									teacherName: da.data.data.name
								};
								localStorage.setItem('loginSendInfo',JSON.stringify($me.sendInfo))
								$me.$router.push({
									//页面跳转
									path: 'classroom',
									query: {
										sendInfo: JSON.stringify($me.sendInfo)
									}
								});
							} else {
								this.$toast.center(da.data.message);
							}
						})
						.catch(function(err) {
							$me.$toast.center('登录失败');
							$me.$loading.close();
						});
				} else {
					this.$toast.center('请输入正确的用户名和密码');
				}
			},
			toImage() {
				// 第一个参数是需要生成截图的元素,第二个是自己需要配置的参数,宽高等
				html2canvas(this.$refs.TopImg, {
					backgroundColor: null
				}).then((canvas) => {
					let url = canvas.toDataURL('image/png');
					this.htmlUrl = url;
					console.log(this.htmlUrl)

				})
			},
			realTime(data) {
				console.log(data)
				// this.previews = data
			},
			// saveImg(){
			// 	this.$refs.cropper.getCropData(data => {
			// 		console.log(data)
			// 		/* 获取头像base64 */
			// 		var imgdata = data.split(',')[1];
			// 		var fileType = data.split(';')[0].split('/')[1];
			// 		
			// 		
			// 	
			// 	});
			// },
			selName(userInfo) {
				this.username = userInfo.username;
				this.password = userInfo.password
			},
			stopCountDown() {
				console.log('12223');
			}
		}
	};
</script>

<style scoped="scoped"></style>

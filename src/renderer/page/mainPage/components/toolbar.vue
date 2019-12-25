<template>
	<div class="toolbox" ref="TopImg">

		<!-- <a href="javascript:;" class="settoolbar" ref="TopImg" @click="isShow=!isShow;type=0"></a> -->
		<div class="toolbar" v-if="isShow">
			<div>

				<a href="javascript:;" class="countDown" @click.stop="show(2)">
					<i></i>
					<p>倒计时</p>
					<div class="state" @click.stop="onChange" :class="{'active':isCountDown==1}"></div>
				</a>
				<a href="javascript:;" class="whiteblock" @click.stop="show(4)">
					<i></i>
					<p>电子白板</p>
					<div class="state" :class="{'active':type==4}"></div>
				</a>
				<!-- <a href="javascript:;" class="printScreen" @click.stop="saveImgFullScreen">
					<i></i>
					<p>截图</p>
				</a> -->
				<a href="javascript:;" class="rollCall">
					<i></i>
					<p>点名</p>
				</a>
				<a href="javascript:;" class="pickName">
					<i></i>
					<p>随机</p>
				</a>
				<a href="javascript:;" class="barrage" @click="show(1)">
					<i></i>
					<p>弹幕</p>
				</a>

				<a href="javascript:;" class="more">
					<i></i>
					<p>更多</p>
				</a>
			</div>
		</div>
		<div class="printScreenbox" v-show="type==3">
			<div style="height:100%; width: 100%;">
				<vue-cropper ref="cropper" :img="htmlUrl" :info="true" :autoCrop="options.autoCrop" :autoCropWidth="options.autoCropWidth"
				 :autoCropHeight="options.autoCropHeight" :fixedBox="options.fixedBox">
				</vue-cropper>
			</div>
			<div class="optionbtn">
				<a href="javascript:;" @click="type=0;$emit('close')">取消</a>
				<a href="javascript:;" class="savebtn" @click="saveImg">保存</a>
			</div>
		</div>
		<setDanmu @close="close" v-if="isShow&&type==1"></setDanmu>
		<timeswiper ref="timeswiper" @cancelcountDown="close" v-if="isShow&&type==2"></timeswiper>
		<draw ref="draw" v-if="type==4"></draw>
	</div>
</template>

<script>
	import setDanmu from '@/page/mainPage/components/setDanmu.vue';
	import timeswiper from '@/page/mainPage/components/timeswiper';
	import draw from '@/page/mainPage/components/draw';
	import VueCropper from '@/page/mainPage/components/cropper/vue-cropper'
	import {
		urlPath,
	} from '@/page/mainPage/utils/base';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	import html2canvas from 'html2canvas'
	export default {
		data() {
			return {
				type: 0,
				isShow: false,
				htmlUrl: '',
				options: {
					img: '',
					autoCrop: true,
					autoCropWidth: 200,
					autoCropHeight: 200,
					fixedBox: false
				},
			}
		},
		computed: {
			...mapState(['isCountDown'])
		},
		components: {
			setDanmu,
			timeswiper,
			VueCropper,
			draw
		},
		mounted() {
			document.addEventListener('click', e => {
				if (this.$refs.TopImg) {
					if (!this.$refs.TopImg.contains(e.target)) {
						this.isShow = false;
						this.type = 0;
						this.$emit('close')
					}
				} else {

				}

			});
		},
		methods: {
			...mapMutations(['SET_isCountDown']),
			close: function() {
				this.type = 0
			},
			showSet() {
				this.isShow = true
			},
			hide() {
				this.isShow = false
			},
			show(type) {
				const $me = this;
				if (this.type == type) {
					this.type = 0;
					// $me.$refs.timeswiper.cancelcountDown();
				} else {
					this.type = type;
					switch (type) {
						case 1:
							{
								break;
							}
						case 2:
							{
								// $me.$refs.timeswiper.show();
								break;
							}
						case 4:
							{
								$me.isShow = false;
								this.$emit('close')
								break;
							}

					}
				}

			},
			onChange() {
				let isCountDown = this.isCountDown == 1 ? 0 : 1;
				this.SET_isCountDown(isCountDown)
			},
			saveImgFullScreen() {
				/* 全屏截图 */
				const $me = this;

				$me.type = 3;
				$me.isShow = false;
				// 				html2canvas(this.$refs.TopImg, {
				// 					backgroundColor: null
				// 				}).then((canvas) => {
				// 					let url = canvas.toDataURL('image/png');
				// 					this.htmlUrl = url;
				// 					console.log(this.htmlUrl)
				// 
				// 				})
				$me.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/saveImgFullScreen'
				}).then(da => {
					if (da.data.ret == 'success') {
						/* 截图保存给后端 */
						$me.htmlUrl = 'data:image/jpg;base64,' + da.data.data;
						// console.log(this.htmlUrl)
					} else {
						$me.$toast.center(da.data.message);
					}
				});
			},
			saveImg() {
				this.$refs.cropper.getCropData(data => {
					console.log(data)
					this.type = 0;
					this.$emit('close')
				})
			}

		}
	}
</script>

<style scoped="scoped" lang="less">
	.settoolbar {
		position: fixed;
		left: 50%;
		margin-left: -163px;
		bottom: 40px;
		background: #1890ff url(../assets/set.png) no-repeat center center;
		background-size: 32px auto;
		border-radius: 100%;
		height: 63px;
		width: 63px;
		box-shadow: 0 0 10px rgba(24, 114, 255, 0.4);
		z-index: 9999;
		border: 3px solid #fff;
	}

	.toolbar {
		left: 230px;
		// transform: translateX(-100%);
		// margin-left: -180px;
		position: fixed;
		bottom: 40px;
		z-index: 99999;

		// display:none;
		&:before {
			content: '';
			display: block;
			left: -8px;
			bottom: 20px;
			position: absolute;
			height: 30px;
			width: 40px;
			border-radius: 20px;
			background: #fff;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			z-index: 1;
		}

		&:after {
			content: '';
			display: block;
			left: 0;
			bottom: 10px;
			position: absolute;
			height: 50px;
			width: 36px;
			background: #fff;
			z-index: 1;
		}

		&>div {
			position: relative;

			background: #fff;
			border-radius: 10px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			padding: 30px 20px;

			&>a {
				display: inline-block;
				color: #333;
				font-size: 16px;
				text-align: center;
				position: relative;
				margin: 0 15px;

				&>i {
					display: block;
					margin: 0 auto 18px;
					width: 61px;
					height: 61px;
					background: no-repeat center center;
					border-radius: 15px;
				}

				&.countDown {
					i {
						background-color: #77b19a;
						background-image: url(../assets/icon8.png);
						box-shadow: 3px 3px 10px rgba(119, 177, 154, .5);
					}


				}

				&.rollCall {
					i {
						background-color: #1890ff;
						background-image: url(../assets/icon9.png);
						box-shadow: 3px 3px 10px rgba(24, 144, 255, .5);
					}
				}

				&.pickName {
					i {
						background-color: #f1c16b;
						background-image: url(../assets/icon10.png);
						box-shadow: 3px 3px 10px rgba(241, 193, 107, .5);
					}
				}

				&.barrage {
					i {
						background-color: #7b6dfb;
						background-image: url(../assets/icon11.png);
						box-shadow: 3px 3px 10px rgba(123, 109, 251, .5);
					}
				}

				&.more {
					i {
						background-color: #5777a6;
						background-image: url(../assets/icon12.png);
						box-shadow: 3px 3px 10px rgba(87, 119, 166, .5);
					}
				}

				&.whiteblock {
					i {
						background-color: #4a5169;
						background-image: url(../assets/icon20.png);
						box-shadow: 3px 3px 10px rgba(87, 119, 166, .5);
					}
				}

				&.printScreen {
					i {
						background-color: #3970af;
						background-image: url(../assets/icon19.png);
						box-shadow: 3px 3px 10px rgba(87, 119, 166, .5);
					}
				}

				div.state {
					height: 20px;
					width: 20px;
					position: absolute;
					background: url(../assets/off1.png) no-repeat center center;
					left: 45px;
					top: 50px;

					&.active {
						background-image: url(../assets/on1.png)
					}
				}
			}
		}
	}

	.printScreenbox {
		position: fixed;
		top: 20%;
		bottom: 20%;
		left: 20%;
		right: 20%;
		background: rgba(255, 255, 255, .5);
		border: 4px solid #1890ff;
		border-radius: 8px;
		z-index: 9999;
	}

	.printScreenbox .optionbtn {
		position: absolute;
		bottom: -20px;
		left: 0;
		right: 0;
		text-align: center;
	}

	.printScreenbox .optionbtn a {
		display: inline-block;
		height: 40px;
		line-height: 40px;
		width: 120px;
		border-radius: 50px;
		background: #6b6b6b;
		color: #fff;
		margin: 0 20px;
	}

	.printScreenbox .optionbtn a.savebtn {
		background: #1890ff;
	}
</style>

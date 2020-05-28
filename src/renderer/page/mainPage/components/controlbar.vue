<template>
	<div class="bottommenu">
		<a href="javascript:;" class="start" @click="startRace" v-show="isSubject && isAddSubject"></a>
		<a href="javascript:;" class="stopBtn" @click="stopRace" v-if="isStop"></a>
		<a href="javascript:;" class="send" @click="sendtitle" v-show="isSendtitle"></a>
		<a href="javascript:;" class="prev" @click="prevQuestion" v-show="isSubject && !isAddSubject">
			<i></i>
		</a>
		<a href="javascript:;" class="next" @click="nextQuestion" v-show="isSubject && !isAddSubject">
			<!-- <span>下一题</span> -->
			<i></i>
		</a>
		<!-- 点名 -->
		<a href="javascript:;" class="rollCall" @click="callname(0)" v-if="(subjecttitle==6||subjecttitle==7||subjecttitle==9)&&isAnswering">
			<i></i>
			<p>点名</p>
		</a>
		<!-- 随机抽答 -->
		<a href="javascript:;" class="pickName" @click="callname(1)" v-if="(subjecttitle==6||subjecttitle==7||subjecttitle==9)&&isAnswering">
			<i></i>
			<p>随机</p>
		</a>
		<!-- 添加题目 -->
		<a href="javascript:;" class="addSubject" @click="addSubject" v-show="isSubject"></a>

	</div>
</template>

<script>
	import {
		urlPath,
	} from '@/page/mainPage/utils/base';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {

			}
		},
		computed: {},
		components: {

		},
		props: {
			isAddSubject: {
				/* 是否打开了新增临时题弹窗 */
				type: Boolean,
				default: false
			},
			isSubject: {
				/* 是否是准备发题状态 */
				type: Boolean,
				default: false
			},
			isStop: {
				/* 是否是停止状态 */
				type: Boolean,
				default: false
			},
			isSendtitle: {
				/* 是否是统计状态 */
				type: Boolean,
				default: false
			},
			isAnswering: {
				/* 是否是答题状态 */
				type: Boolean,
				default: false
			},
			subjecttitle: {
				/* 发题类型 */
				type: [String, Number],
				default: 0
			}
		},
		mounted() {

		},
		watch: {},
		methods: {
			startRace() {
				this.$emit('startRace')
			},
			stopRace() {
				this.$emit('stopRace')
			},
			sendtitle() {
				this.$emit('sendtitle')
			},
			prevQuestion() {
				this.$emit('prevQuestion')
			},
			nextQuestion() {
				this.$emit('nextQuestion')
			},
			callname(type) {
				this.$emit('callname', type)
			},
			addSubject(){
				this.$emit('addSubject',!this.isAddSubject)
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.mask {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

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
		top: 0%;
		bottom: 0%;
		left: 0%;
		right: 0%;
		// background: rgba(255, 255, 255, .5);
		// border: 4px solid #1890ff;
		// border-radius: 8px;
		z-index: 100001;
	}

	.printScreenbox .optionbtn {
		position: absolute;
		bottom: 10px;
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

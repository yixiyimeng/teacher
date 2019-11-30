<template>
	<div class="toolbox">
		<a href="javascript:;" class="settoolbar"></a>
		<div class="toolbar">
			<div><a href="javascript:;" class="countDown" @click="show(2)">
					<i></i>
					<p>倒计时</p>
				</a>
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
				</a></div>
		</div>
		<setDanmu @close="close" v-if="type==1"></setDanmu>
		<timeswiper v-if="type==2"></timeswiper>
	</div>
</template>

<script>
	import setDanmu from '@/page/mainPage/components/setDanmu.vue';
	import timeswiper from '@/page/mainPage/components/timeswiper';
	export default {
		data() {
			return {
				type: 0,
			}
		},
		components: {
			setDanmu,
			timeswiper
		},
		methods: {
			close: function() {
				this.type = 0
			},
			show(type) {
				if (this.type == type) {
					this.type = 0;
				}else{
					this.type=type
				}
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.settoolbar {
		position: fixed;
		left: 50%;
		margin-left: -129px;
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
		left: 50%;
		transform: translateX(-100%);
		margin-left: -150px;
		position: fixed;
		bottom: 50px;
		z-index: 9999;
		display:none;
		&:before {
			content: '';
			display: block;
			right: -8px;
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
			right: 0;
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
			}
		}
	}
</style>

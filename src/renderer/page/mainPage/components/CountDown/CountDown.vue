<template>
	<div class="timecheckboxbar">
		<span @click="checkshowcountDown" v-if="isCountdown">{{ countDownTime | format}}</span>
		<div class="timecheckbox" :class="{ active: isCountdown }" @click="checkcountDown"></div>
		<timeswiper @countDown="countDown" @cancelcountDown="cancelcountDown" v-if="isCountdown && showcountDown" class="countDownbox"></timeswiper>
	</div>
</template>

<script>
	import timeswiper from '@/page/mainPage/components/timeswiper';

	function fixedZero(val) {
		return val * 1 < 10 ? `0${val}` : val;
	}
	export default {
		name: 'CountDown',
		components: {
			timeswiper
		},
		data() {
			return {
				isCountdown: false, //是否倒计时
				showcountDown: false, //是否显示设置倒计时
				countDownTime: '',
				timer: null
			};
		},
		props: {
			isAnswering: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			isAnswering(newval, oldval) {
				if ((newval != oldval) && newval) {
					if (this.showcountDown) {
						if (this.countDownTime == 0) {
							this.isCountdown = false;
						}
						this.showcountDown = false
					}
				}
			}
		},
		methods: {
			/* 设置倒计时 */
			countDown(time) {
				this.countDownTime = time;
				this.showcountDown = false;

			},
			//* 取消设置倒计时 */
			cancelcountDown() {
				this.showcountDown = false;
			},
			// 是否倒计时
			checkcountDown() {
				if (this.isAnswering) {
					return false
				}
				this.isCountdown = this.showcountDown = !this.isCountdown;
			},
			// 是否显示设置倒计时
			checkshowcountDown() {
				if (this.isAnswering) {
					return false
				}
				this.showcountDown = !this.showcountDown;
			},
			startCountDown() {
				if (this.timer) {
					return;
				}
				this.countDownTime = localStorage.getItem('countDown');
				if (this.countDownTime > 0) {
					this.timer = setInterval(() => {
						if (this.countDownTime > 0) {
							this.countDownTime--;
							if (this.countDownTime == 0) {
								this.stopCountDown();
								this.$emit('stopCountDown')
							}
						}
					}, 1000)
				}
			},
			stopCountDown() {
				if (this.timer) {
					clearInterval(this.timer);
					this.timer = null;
				}
			},
			getTime() {
				return {
					isCountdown: this.isCountdown,
					countDownTime: this.countDownTime
				}
			}
		},
		filters: {
			format(time) {
				const hours = 60 * 60;
				const minutes = 60;

				const h = Math.floor((time / hours) % 24);
				const m = Math.floor((time / minutes) % 60);
				const s = Math.floor(time % 60);
				return `${fixedZero(h)}:${fixedZero(m)}:${fixedZero(s)}`;
			}
		},
		created() {
			//this.initTime();
			//this.tick();
		},

	};
</script>

<style scoped lang="less">
	.timecheckboxbar {
		position: absolute;
		left: 0;
		bottom: 0;

		span {
			line-height: 40px;
			vertical-align: middle;
			font-size: 20px;
		}

		.timecheckbox {
			width: 100px;
			height: 40px;
			// background: url(../../assets/img/off.png) no-repeat center center;
			cursor: pointer;
			display: inline-block;
			vertical-align: middle;

			&.active {
				// background-image: url(../../assets/img/on.png);
			}
		}

		.countDownbox {
			position: absolute;
			right: 0;
			bottom: 50px;
			width: 270px;
			z-index: 9999;
		}
	}
</style>

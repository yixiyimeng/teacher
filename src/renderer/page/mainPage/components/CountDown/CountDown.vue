<template>
	<div @mousedown="move" ref="count" class="countDownbox">
		<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" :width="width" :height="width">
			<circle cx="100" cy="100" :r="100 - border / 2" fill="none" opacity="0.4" :stroke="color" :stroke-width="border" />
			<circle cx="100" cy="100" :r="100 - border / 2" fill="none" transform="rotate(270,100,100)" :stroke="color"
			 :stroke-width="border" :stroke-dasharray="dashLen" :stroke-dashoffset="dashOffset" style="transition: stroke-dashoffset 0.4s" />
			<text x="100" y="130" text-anchor="middle" :font-size="fontSize" :fill="fontColor">
				{{ countDown }}
			</text>
			<!-- <text x="100" y="150" text-anchor="middle" :font-size="fontSize" fill="#d4d4d4">
				剩余
			</text> -->
		</svg>
	</div>
</template>

<script>
	import timeswiper from '@/page/mainPage/components/timeswiper';

	function fixedZero(val) {
		return val * 1 < 10 ? `0${val}` : val;
	}
	export default {
		// propsData: {setTimer: 20 * 1000},
		props: {
			setTimer: {
				type: Number,
				required: true
			},
			width: {
				type: Number,
				default: 160
			},
			border: {
				type: Number,
				default: 10
			},
			color: {
				type: String,
				default: '#2995f9'
			},
			fontColor:{
				type: String,
				default: '#ec6d64'
			},
			fontSize: {
				type: Number,
				default: 70
			}
		},
		data() {
			return {
				timeLeft: this.setTimer,
				dashLen: (100 - this.border / 2) * Math.PI * 2,
				positionX: 0,
				positionY: 0,
			}
		},
		computed: {
			countDown() {
				let time = this.timeLeft
				if (time <= 0) {
					// return '00:00:00'
					return '0s'
				} else {
					let result = []
					result.push(Math.floor(time / 3.6e+6))
					result.push(Math.floor(time % 3.6e+6 / 60000))
					result.push(Math.floor(time % 60000 / 1000))
					// return result.map(x => x < 10 ? '0' + x : x).join(':')
					return time / 1000 + 's'
				}
			},
			dashOffset() {
				return this.dashLen - this.timeLeft / this.setTimer * this.dashLen
			}
		},
		mounted() {
			
		},
		methods: {
			move(e) {
				let odiv = this.$refs.count; //获取目标元素
				console.log('odiv.offsetLeft', odiv.offsetLeft)
				//算出鼠标相对元素的位置
				let disX = e.clientX - odiv.offsetLeft;
				let disY = e.clientY - odiv.offsetTop;
				document.onmousemove = (e) => { //鼠标按下并移动的事件
					//用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
					let left = e.clientX - disX;
					let top = e.clientY - disY;

					//绑定元素位置到positionX和positionY上面
					this.positionX = top;
					this.positionY = left;

					//移动当前元素
					odiv.style.left = left + 'px';
					odiv.style.top = top + 'px';
				};
				document.onmouseup = (e) => {
					document.onmousemove = null;
					document.onmouseup = null;
				};
			},
			startCount(){
				this.timeLeft=this.setTimer;
				this.lastDate = Date.now();
				if(this.interval){
					clearInterval(this.interval)
					this.interval=null
				}
				this.interval = setInterval(() => {
					let curDate = Date.now()
					let diff = Math.round((curDate - this.lastDate) / 1000) * 1000
					this.timeLeft -= diff
					if (this.timeLeft <= 0) {
						this.$emit('stopCountDown');
						clearInterval(this.interval)
						this.interval=null
					}
					if (diff >= 1000) {
						this.lastDate = curDate
					}
				}, 1000)
			},
			clearCount(){
				if(this.interval){
					clearInterval(this.interval)
					this.interval=null
				}
			}
		}

	};
</script>

<style scoped lang="less">
	.countDownbox {
		position: absolute;
		cursor: move;
		-webkit-user-select: none;

	}
</style>

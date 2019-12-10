<template>
	<div class="timeswiper clearfix">
		<div>
			<div class="timeswiper-hd"><span>计时器</span>
				<a href="javascript:;" class="close" @click="cancelcountDown"></a>
			</div>
			<div class="swiperlist">
				<div class="shadowMask"></div>
				<div class="timemark">
					<em>时</em>
					<em>分</em>
					<em>秒</em>
				</div>
				<swiper :options="swiperOption" ref="mySwiper" class="swiper">
					<!-- slides -->
					<swiper-slide v-for="(item, index) in hourlist" :key="index">{{ item }}</swiper-slide>
				</swiper>
				<swiper :options="swiperOption1" ref="mySwiper2" class="swiper">
					<!-- slides -->
					<swiper-slide v-for="(item, index) in minlist" :key="index">{{ item }}</swiper-slide>
				</swiper>
				<swiper :options="swiperOption2" ref="mySwiper3" class="swiper">
					<swiper-slide v-for="(item, index) in seclist" :key="index">{{ item }}</swiper-slide>
				</swiper>
			</div>

		</div>

		<div class="timebtnlist clearfix">
			<a href="javascript:;" @click="cancelcountDown">取消</a>
			<a href="javascript:;" @click="getTime">确定</a>
		</div>
	</div>
</template>

<script>
	import 'swiper/dist/css/swiper.css';
	import {
		swiper,
		swiperSlide
	} from 'vue-awesome-swiper';
	export default {
		components: {
			swiper,
			swiperSlide
		},
		data() {
			return {
				selhour: '00',
				selmin: '00',
				selsec: '00',
				swiperOption: {
					direction: 'vertical',
					loop: true,
					slidesPerView: '5',
					mousewheel: true,
					centeredSlides: true
				},
				swiperOption1: {
					direction: 'vertical',
					loop: true,
					slidesPerView: '5',
					mousewheel: true,
					centeredSlides: true
				},
				swiperOption2: {
					direction: 'vertical',
					loop: true,
					slidesPerView: '5',
					mousewheel: true,
					centeredSlides: true
				},
				hourlist: [],
				minlist: [],
				seclist: [],
				plainOptions: [{
						label: '单题单选',
						value: '1'
					}, {
						label: '单题多选',
						value: '2'
					},
					{
						label: '判断题',
						value: '3'
					},
					{
						label: '主观题',
						value: '4'
					},
					{
						label: '抢红包',
						value: '5'
					},
					{
						label: '主观题',
						value: '6'
					}
				],
				checkedList: [],
				timelist: [{
						time: '00:00:36',
						label: '计时器，单选，多选，1-5题',
						state: true
					},
					{
						time: '00:00:36',
						label: '计时器，单选，多选，1-5题',
						state: false
					}
				],
				isEdit: false,
				isEditTimer: true,
				isCountDown: 1,
				isShow: false
			};
		},
		created() {
			for (var i = 0; i < 24; i++) {
				this.hourlist.push(i < 10 ? '0' + i : i);
			}
			for (var i = 0; i < 60; i++) {
				this.minlist.push(i < 10 ? '0' + i : i);
				this.seclist.push(i < 10 ? '0' + i : i);
			}
		},
		computed: {
			swiper() {
				return this.$refs.mySwiper.swiper;
			},
			swiper1() {
				return this.$refs.mySwiper2.swiper;
			},
			swiper2() {
				return this.$refs.mySwiper3.swiper;
			}
		},
		mounted() {
			this.show()
		},
		methods: {
			show() {
				this.isShow = true;
				/* 回填时间 */
				console.log(this.$store.state.countDown)
				var time = this.$store.state.countDown;
				const hours = 60 * 60;
				const minutes = 60;

				const h = Math.floor((time / hours) % 24);
				const m = Math.floor((time / minutes) % 60);
				const s = Math.floor(time % 60);

				this.$nextTick(() => {
					this.swiper.update();
					this.swiper1.update();
					this.swiper2.update();
					this.swiper.slideToLoop(h, 0, false);
					this.swiper1.slideToLoop(m, 0, false);
					this.swiper2.slideToLoop(s, 0, false)
				})

			},
			getTime() {
				this.selhour = this.hourlist[this.swiper.realIndex];
				this.selmin = this.minlist[this.swiper1.realIndex];
				this.selsec = this.seclist[this.swiper2.realIndex];
				let time = parseInt(this.selhour) * 60 * 60 + parseInt(this.selmin) * 60 + parseInt(this.selsec);
				this.$emit('cancelcountDown');
				this.$store.commit('SET_countDown', time)
				// localStorage.setItem('countDown', time)
				//console.log(this.selhour + ':' + this.selmin + ':' + this.selsec);
			},
			cancelcountDown() {
				this.$emit('cancelcountDown');
				this.isShow = false;
			},
			onChange() {
				this.isCountDown = this.isCountDown == 1 ? 0 : 1;
				console.log(this.isCountDown);
				// this.isCountDown=value;
				// this.$store.commit('SET_isCountDown',value)
			}

		}
	};
</script>

<style scoped="scoped" lang="less">
	.ml {
		margin-left: 10px;
	}

	.mr10 {
		margin-right: 10px;
	}

	.timeswiper {
		box-sizing: border-box;
		background: #333;
		border-radius: 10px;
		color: #fff;
		width: 330px;
		position: fixed;
		bottom: 240px;
		left: 40%;
		transform: translateX(-50%);
		z-index: 9999;
	}

	.timeswiper-hd {
		line-height: 45px;
		text-align: center;
		border-bottom: 1px solid #666;
		font-size: 18px;
		position: relative;

		.switchbox {
			position: absolute;
			right: 20px;
			top: 50%;
			transform: translateY(-50%);
		}

		a.close {
			display: block;
			height: 12px;
			width: 12px;
			background: url(../assets/close.png);
			background-size: cover;
			position: absolute;
			right: 20px;
			top: 50%;
			transform: translateY(-50%);
		}

		.edit {
			position: absolute;
			left: 20px;
			top: 50%;
			transform: translateY(-50%);
			color: #eda83d;
			font-size: 14px;
		}

		.add {
			position: absolute;
			right: 20px;
			top: 50%;
			transform: translateY(-50%);
			background: url(../assets/icon13.png);
			background-size: cover;
			display: block;
			height: 12px;
			width: 12px;
		}

	}

	.setgroup>div {
		background: #666;

		&.rang {
			padding: 10px 50px;
			position: relative;

			.txt {
				display: inline-block;
				width: 60px;
				background: none;
				border: none;
				border-bottom: 1px solid #fff;
				color: #fff;

			}

		}

		&.checkedlist {
			padding: 10px 20px 10px 30px;
		}

		/deep/ .ant-checkbox-group-item {
			width: 30%;
		}

		/deep/ .ant-checkbox-wrapper {
			color: #fff;
		}
	}

	.swiperlist {
		overflow: hidden;
		padding: 15px 30px;
		position: relative;
	}

	.shadowMask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		bottom: 0;
		background: -webkit-gradient(linear, left top, left bottom, from(#333), color-stop(rgba(0, 0, 0, 0)), to(#333));
		background: -webkit-linear-gradient(top, #333, rgba(0, 0, 0, 0), #333);
		background: linear-gradient(to bottom, #333, rgba(0, 0, 0, 0), #333);
		opacity: 1;
		pointer-events: none;
		z-index: 9999;
	}

	.timemark {
		// background: #f5f5f5;
		height: 40px;
		// border-bottom: 1px solid #d1d1d1;
		// border-top: 1px solid #d1d1d1;
		position: absolute;
		left: 30px;
		right: 30px;
		top: 95px;
		padding: 0 30px;
	}

	.timemark:after,
	.timemark:before,
	.setgroup .rang:before,
	.setgroup .rang:after {
		content: '';
		display: block;
		height: 1px;
		left: -30px;
		right: -30px;
		position: absolute;
		background: -webkit-linear-gradient(left, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, .4) 20%, rgba(255, 255, 255, .4) 80%, rgba(255, 255, 255, 0) 100%);
	}

	.setgroup .rang:before,
	.setgroup .rang:after {
		left: 0;
		right: 0;
	}

	.timemark:before,
	.setgroup .rang:before {
		top: 0;
	}

	.timemark:after,
	.setgroup .rang:after {
		bottom: 0;
	}

	.timemark em {
		position: absolute;
		font-size: 10px;
		top: 10px;
	}

	.timemark em:nth-child(1) {
		left: 33.33%;
		margin-left: -30px;
	}

	.timemark em:nth-child(2) {
		left: 66.66%;
		margin-left: -30px;
	}

	.timemark em:nth-child(3) {
		left: 99.99%;
		margin-left: -30px;
	}

	.swiper {
		float: left;
		width: 33.333%;
		height: 200px;
		box-sizing: border-box;
	}

	.swiper .swiper-slide {
		font-size: 18px;
		/* color: #666; */
		text-align: center;
		line-height: 40px;
	}

	/* .swiper .swiper-slide.swiper-slide-active{
	
} */
	.swiper+.swiper {
		border-left: 1px solid #d1d1d1;
	}

	.timebtnlist {
		border-bottom-left-radius: 10px;
		border-bottom-right-radius: 10px;
		overflow: hidden;
	}

	.timebtnlist>a {
		display: block;
		width: 50% !important;
		line-height: 51px;
		float: left;
		text-align: center;
		color: #fff;
		font-size: 18px;
		background: #999;

		&+a {
			background: #1890ff;
		}
	}

	// 	/deep/ .ant-switch {
	// 		background: #666;
	// 	}
	// 
	// 	/deep/ .ant-switch-checked {
	// 		background: #00de8d;
	// 	}

	.timelist {
		&>div {
			padding: 10px 20px;
			border-bottom: 1px solid #666;

			.close {
				// color: #f00;
				margin-right: 14px;
				display: block;
				height: 14px;
				width: 14px;
				background: url(../assets/deltime.png);
			}

			p {
				cursor: pointer;
				margin-bottom: 0;
				color: #999;
				font-size: 10px;
				line-height: 1;

				&:first-child {
					font-size: 27px;
					margin-bottom: 5px;
				}
			}

			&.active {
				p {
					color: #fff;
				}
			}
		}
	}
</style>

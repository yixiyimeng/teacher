<template>
	<div class="timeswiper clearfix">
		<div v-if="isEditTimer">
			<div class="timeswiper-hd"><span>计时器</span>
				<a href="javascript:;" class="close"></a>
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
			<!-- 设置 -->
			<!-- <div class="setgroup">
				<div class="rang"><span>答题范围：</span>
					<input type="text" class="txt">
					道<span class="ml0 mr0">~</span>
					<input type="text" class="txt">
					道
				</div>
				<div class="checkedlist">
					<div class="ant-checkbox-group">
						<label class="ant-checkbox-group-item ant-checkbox-wrapper" v-for="(item, index) in plainOptions" :key="index">
							<span class="ant-checkbox">
								<input type="checkbox" :value="item.value" class="ant-checkbox-input" />
								<span class="ant-checkbox-inner"></span>
							</span>
							<span>{{ item.label }}</span>
						</label>
					</div>
				</div>
			</div> -->
		</div>
		<div v-if="!isEditTimer">
			<div class="timeswiper-hd">
				<a href="javascript:;" class="edit" @click="isEdit=!isEdit">{{isEdit?'完成':'编辑'}}</a>
				<span>计时器</span>
				<a href="javascript:;" class="add"></a>
			</div>
			<div class="timelist">
				<div class="flex flex-align-center flex-pack-justify" :class="{'active':item.state}" v-for="(item,index) in timelist"
				 :key="index">
					<!-- <a-icon type="minus-circle" class="close" v-if="isEdit" /> -->
					<a href="javascript:;" class="close" v-if="isEdit"></a>
					<div class="flex-1">
						<p>{{item.time}}</p>
						<p>{{item.label}}</p>
					</div>
					<label>
						<input type="checkbox" style="opacity: 0;">
						<div class="ant-switch ant-switch-small">
							<span class="ant-switch-inner"></span>
							<div class="ant-click-animating-node"></div>
						</div>
					</label>
					<!-- <a-switch size="small" v-model="item.state" /> -->
				</div>
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
				isEditTimer: true
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
		methods: {
			getTime() {
				this.selhour = this.hourlist[this.swiper.realIndex];
				this.selmin = this.minlist[this.swiper1.realIndex];
				this.selsec = this.seclist[this.swiper2.realIndex];
				let time = parseInt(this.selhour) * 60 * 60 + parseInt(this.selmin) * 60 + parseInt(this.selsec);
				this.$emit('countDown', time)
				localStorage.setItem('countDown',time)
				//console.log(this.selhour + ':' + this.selmin + ':' + this.selsec);
			},
			cancelcountDown() {
				this.$emit('cancelcountDown')
			},
			onChange() {}

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
		width: 380px;
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

	/deep/ .ant-switch {
		background: #666;
	}

	/deep/ .ant-switch-checked {
		background: #00de8d;
	}

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

<template>
	<div class="bg clearfix">
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
		<div class="btnlist clearfix">
			<a href="javascript:;" @click="cancelcountDown">取消</a>
			<a href="javascript:;" @click="getTime">确定</a>
		</div>
	</div>
</template>

<script>
import 'swiper/dist/css/swiper.css';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
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
				slidesPerView: '5', mousewheel: true,
				centeredSlides: true
			},
			swiperOption1: {
				direction: 'vertical',
				loop: true,
				slidesPerView: '5', mousewheel: true,
				centeredSlides: true
			},
			swiperOption2: {
				direction: 'vertical',
				loop: true,
				slidesPerView: '5', mousewheel: true,
				centeredSlides: true
			},
			hourlist: [],
			minlist: [],
			seclist: []
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
			let time=parseInt(this.selhour)*60*60+parseInt(this.selmin)*60+parseInt(this.selsec);
			this.$emit('countDown',time)
			//console.log(this.selhour + ':' + this.selmin + ':' + this.selsec);
		},
		cancelcountDown(){
			this.$emit('cancelcountDown')
		}
		// 		gethour(index) {
		// 			this.selhour = this.hourlist[index];
		// 			console.log(this.selhour);
		// 		}
	}
};
</script>

<style scoped="scoped" lang="less">
.bg {
	box-sizing: border-box;
}
.bg > .swiperlist {
	background: #eee;
	color: #666;
	border-radius: 10px;
	overflow: hidden;
	padding: 20px 15px;
	position: relative;
}
.shadowMask {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	bottom: 0;
	background: -webkit-gradient(linear, left top, left bottom, from(#ffffff), color-stop(rgba(255, 255, 255, 0)), to(#ffffff));
	background: -webkit-linear-gradient(top, #ffffff, rgba(255, 255, 255, 0), #ffffff);
	background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0), #ffffff);
	opacity: 0.9;
	pointer-events: none;
	z-index: 9999;
}

.timemark {
	background: #f5f5f5;
	height: 40px;
	border-bottom: 1px solid #d1d1d1;
	border-top: 1px solid #d1d1d1;
	position: absolute;
	left: 15px;
	right: 15px;
	top: 100px;
}

.timemark em {
	position: absolute;
	font-size: 10px;
	top: 10px;
}
.timemark em:nth-child(1) {
	left: 33.33%;
	margin-left: -20px;
}
.timemark em:nth-child(2) {
	left: 66.66%;
	margin-left: -20px;
}
.timemark em:nth-child(3) {
	left: 99.99%;
	margin-left: -20px;
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
.swiper + .swiper {
	border-left: 1px solid #d1d1d1;
}
.btnlist {
	border-bottom-left-radius: 10px;
	border-bottom-right-radius: 10px;
	overflow: hidden;
}
.btnlist > a {
	display: block;
	width: 50%;
	line-height: 51px;
	float: left;
	text-align: center;
	color: #fff;
	font-size: 18px;
	background: #999;
	& + a {
		background: #1890ff;
	}
}
</style>

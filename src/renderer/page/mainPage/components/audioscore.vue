<template>
	<div class="audioscorebox" v-if="isShow">
		<div class="audiobox-hd flex flex-pack-justify flex-align-center">
			<div class="flex flex-align-center">
				<span>{{info.stuName}}答题详情</span>
				<span class="num">{{info.xianShengResults.length}}</span>
			</div>
			<span class="close" @click="isShow=false">
				×
			</span>
		</div>
		<div class="audiobox-bd">
			<div class="item flex" v-for="(item,index) in info.xianShengResults" :key="index">
				<span class="num">{{index+1}}</span>
				<span class="score">({{item.score}})</span>
				<div class="flex-1">
					<span v-if="item.isword==1" v-for="(subitem,subindex) in item.charlist" :style="{color:subitem.score>=90?'#4fb57e':(subitem.score>=60?'#1890ff':'#ec6d64')}">{{subitem.ph2alpha}}</span>
					<span v-if="item.isword==0" style="margin-right: 10px;" v-for="(subitem,subindex) in item.wordlist" :style="{color:subitem.score>=90?'#4fb57e':(subitem.score>=60?'#1890ff':'#ec6d64')}">{{subitem.char}}</span>
				</div>
			</div>
		</div>
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
				info: {},
				isShow: false,
				charlist: []
			}
		},
		computed: {},
		components: {

		},
		props: {
			studentId: {
				/* 发题类型 */
				type: [String, Number],
				default: 0
			}
		},
		mounted() {

		},
		watch: {},
		methods: {
			show(info) {
				console.log(122)
				for (var i = 0; i < info.xianShengResults.length; i++) {
					var item = info.xianShengResults[i];
					let charlist = JSON.parse(item.detail);
					if (charlist.length >= 1) {
						info.xianShengResults[i].wordlist = charlist;
						info.xianShengResults[i].isword=0;
					} else {
						info.xianShengResults[i].charlist = charlist[0].phone;
						info.xianShengResults[i].isword=1;
					}
				}
				this.info = info;
				this.isShow = true;
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.audioscorebox {
		border: 6px solid #1890ff;
		border-radius: 10px;
		background: #fff;
		width: 600px;
		position: fixed;
		top: 50%;
		left: 50%;
		z-index: 9999;
		transform: translate(-50%, -50%);
		padding: 0 25px 30px;

		.audiobox-hd {
			line-height: 85px;
			color: #1890ff;
			font-size: 30px;
			border-bottom: 1px solid #ccc;

			.num {
				background: #ec6d64;
				margin-left: 20px;
				border-radius: 100%;
				height: 43px;
				width: 43px;
				line-height: 43px;
				font-size: 14px;
				color: #fff;
				display: inline-block;
				text-align: center;
				position: relative;

				&:after {
					content: '';
					display: block;
					width: 31px;
					height: 31px;
					border: 1px solid #fff;
					border-radius: 100%;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					position: absolute;
				}
			}

			.close {
				font-size: 50px;
				color: #ec6d64;
				font-weight: bold;
				cursor: pointer;
			}
		}

		.item {
			font-size: 30px;
			color: #666;
			margin-top: 30px;

			.num,
			.score {
				color: #1890ff;
			}

			.num {
				height: 30px;
				min-width: 30px;
				border: 1px solid #1890ff;
				border-radius: 100%;
				font-size: 20px;
				text-align: center;
				line-height: 30px;
			}

			.score {
				margin: 0 10px;
			}

			.flex-1 {
				word-break: break-all;
				width: 100px;
			}
		}
	}
</style>

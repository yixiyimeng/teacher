<template>
	<div class="audioscorebox flex flex-v" v-if="isShow">
		<div class="audiobox-hd flex flex-pack-justify flex-align-center">
			<div class="flex flex-align-center">
				<span class="name flex-1">{{ info.stuName }}{{info.stuName.length>3?'':'答题详情'}}</span>
				<span class="num">{{ info.xianShengResults.length }}</span>
				<div style="width: 680px;">
					<span style="color: #ec6d64;">红色:</span>
					(&lt;60分)
					<span style="color: #fad111;" class="ml20">黄色:</span>
					(&gt;=60分 &lt;80分)
					<span style="color: #1890ff;" class="ml20">蓝色:</span>
					(&gt;=80分 &lt;90分)
					<span style="color: #4fb57e;" class="ml20">绿色:</span>
					(&gt;=90分)
				</div>
			</div>
			<span class="close" @click="isShow = false">×</span>
		</div>
		<div class="audiobox-bd flex-1">
			<div class="item flex" v-for="(item, index) in info.xianShengResults" :key="index">
				<span class="play" @click="playAudio(item.filePath)" :class="{ active: usersoundurl && usersoundurl == item.filePath }"></span>
				<span class="num">{{ index + 1 }}</span>
				<!-- <span class="score" :style="{ color: item.score >= 90 ? '#4fb57e' : item.score >= 60 ? '#1890ff' : '#ec6d64' }">({{ item.score }})</span> -->
				<div class="flex-1">
					<span
						v-if="item.isword == 1"
						v-for="(subitem, subindex) in item.charlist"
						:style="{ color: subitem.score >= 90 ? '#4fb57e' : subitem.score >= 80 ? '#1890ff' : subitem.score >= 60 ? '#fad111' : '#ec6d64' }"
					>
						{{ subitem.ph2alpha }}
					</span>
					<span
						v-if="item.isword == 0"
						style="margin-right: 10px;"
						v-for="(subitem, subindex) in item.wordlist"
						:style="{ color: subitem.score >= 90 ? '#4fb57e' : subitem.score >= 80 ? '#1890ff' : subitem.score >= 60 ? '#fad111' : '#ec6d64' }"
					>
						{{ subitem.char }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { urlPath } from '@/page/mainPage/utils/base';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {
			info: {},
			isShow: false,
			charlist: [],
			usersoundurl: ''
		};
	},
	computed: {},
	components: {},
	props: {
		studentId: {
			/* 发题类型 */
			type: [String, Number],
			default: 0
		}
	},
	mounted() {},
	watch: {},
	methods: {
		show(info) {
			console.log(122);
			for (var i = 0; i < info.xianShengResults.length; i++) {
				var item = info.xianShengResults[i];
				let charlist = JSON.parse(item.detail);
				if (charlist.length > 1) {
					info.xianShengResults[i].wordlist = charlist;
					info.xianShengResults[i].isword = 0;
				} else {
					info.xianShengResults[i].charlist = charlist[0].phone;
					info.xianShengResults[i].isword = 1;
				}
			}
			this.info = info;
			this.isShow = true;
		},
		playAudio(xsAudioUrl) {
			this.usersoundurl = xsAudioUrl;
			this.$emit('playAudio', xsAudioUrl);
			// 	if (this.$refs.playmusic) {
			// 		this.$refs.playmusic.src = xsAudioUrl;
			// 		console.log(xsAudioUrl)
			// 		this.usersoundurl = xsAudioUrl;
			// 		this.$refs.playmusic.load();
			// 		this.$refs.playmusic.play();

			// 	}
		},
		endAudio() {
			this.usersoundurl = null;
		}
	}
};
</script>

<style scoped="scoped" lang="less">
.audioscorebox {
	border: 6px solid #1890ff;
	border-radius: 10px;
	background: #fff;
	position: fixed;
	height: 60%;
	right: 275px;
	left: 275px;
	z-index: 9999;
	top: 20%;
	padding: 0 25px 30px;

	.audiobox-hd {
		line-height: 85px;
		border-bottom: 1px solid #ccc;
		margin-left: 20px;
		font-size: 18px;
		color: #666;
		@media screen and (max-width: 1300px) {
			font-size: 14px;
			line-height: 65px;
		}
		.name {
			font-size: 30px;
			white-space: nowrap;
			color: #1890ff;
			@media screen and (max-width: 1300px) {
				font-size: 20px;
			}
		}
		.num {
			background: #ec6d64;
			margin: 0 10px;
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
			@media screen and (max-width: 1300px) {
				height: 33px;
				width: 33px;
				line-height: 33px;
				font-size: 12px;
				&:after {
					width: 21px;
					height: 21px;
				}
			}
		}

		.close {
			font-size: 50px;
			color: #ec6d64;
			font-weight: bold;
			cursor: pointer;
		}
	}

	.audiobox-bd {
		// max-height: 400px;
		overflow: auto;
	}

	.item {
		font-size: 30px;
		color: #666;
		margin-top: 30px;
		line-height: 30px;

		.num,
		.score {
			color: #1890ff;
			vertical-align: middle;
		}

		.num {
			height: 30px;
			min-width: 30px;
			border: 1px solid #1890ff;
			border-radius: 100%;
			font-size: 20px;
			text-align: center;
			line-height: 30px;
			margin-left: 10px;
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

.notice,
.play {
	display: inline-block;
	vertical-align: middle;
	width: 20px;
	height: 20px;
	margin-top: 5px;
	cursor: pointer;
	background: url(../assets/icon24.png) no-repeat left center !important;

	&.play {
		background-image: url(../assets/icon25.png);
	}
}

.notice {
	background-size: 16px auto;
}

.notice.active,
.play.active {
	background-image: url(../assets/noticeplay.gif) !important;
	background-size: 20px auto !important;
	background-position-x: -2px !important;
}
</style>

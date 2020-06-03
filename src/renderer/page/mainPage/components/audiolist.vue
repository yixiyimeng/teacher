<template>
	<div>
		<!-- <audiotxt v-if="isshowNamelist" :reftext="reftext"></audiotxt> -->
		<audio ref="playmusic" crossOrigin="anonymous" preload ended></audio>
		<div class="rightbar" :class="{active:isShow}" v-if="selectWordList.length>0||hasNotplay.length>0">
			<div class="flex flex-v">
				<div class="title flex">
					<span class="flex-1" @click="hasRead=true" :class="{active:hasRead}">已读{{selectWordList.length}}题</span>
					<span class="flex-1" @click="hasRead=false" :class="{active:!hasRead}">未读{{hasNotplay.length}}题</span>
				</div>
				<div class="list flex-1" v-if="selectWordList&&selectWordList.length>0&&hasRead">
					<p v-for="(item,index) in selectWordList" :key="index">
						<span class="notice" :class="{'active':playnum==index&&playlisttype==0}" @click="play(item.sound_eng_url,index,0)"></span>
						<i class="num" @click="getVoiceRecord(item)">{{index+1}}</i>
						<span v-if='item' @click="getVoiceRecord(item)">{{item.wordtxt}}</span></p>
				</div>
				<div class="list flex-1" v-if="hasNotplay&&hasNotplay.length>0&&!hasRead">
					<p v-for="(item,index) in hasNotplay" :key="index">
						<span class="notice" :class="{'active':playnum==index&&playlisttype==1}" @click="play(item.sound_eng_url,index,1)"></span>
						<i class="num">{{index+1}}</i>
						<span v-if='item'>{{item.word}}</span></p>
				</div>
			</div>
			<div class="arrow" @click="isShow=!isShow"></div>
		</div>

		<div class="namelistbox" v-if="isshowNamelist">
			<div class="mask" @click.stop="isshowNamelist = !isshowNamelist"></div>
			<transition name="bounce">
				<div class="namelistbox-bd" style="margin: 5px 0; padding: 40px 0;">
					<a href="javascript:;" class="close" @click="isshowNamelist = !isshowNamelist"></a>
					<div style="height: 100%; overflow: auto; padding:0 40px">
						<div class="clearfix flex" style="flex-wrap: wrap;">
							<!-- <div v-for="(item, index) in namelist" :key="index" class="flex"> -->
							<div class="item" v-for="(subitem, subindex) in namelist" :key="subindex">
								<div>
									<div class="name flex flex-pack-justify">
										<!-- <img src="../assets/1.png" style="width: 50px; height: 50px; vertical-align: middle;" /> -->
										<span style="vertical-align: middle;">{{ subitem.stuName }}</span>
										<a href="javascript:;" class="details" @click="showdetails(subitem)">
											<span class="num">{{subitem.xianShengResults.length}}</span>
											<span class="txt">答题详情</span></a>
									</div>
									<div class="mt10">
										<p :style="{color:video.score>80?'#f00':(video.score>60?'#1890ff':'#4fb57e')}" v-for="(video,subindex2) in subitem.xianShengResults"
										 :key='subindex2'>
											<i class="num">{{subindex2+1}}</i>
											<span class="play" @click="payAudio(video.filePath)" :class="{active:usersoundurl&&usersoundurl==path}"></span>
											<span class="score">({{video.score}}分)</span>
										</p>

									</div>
								</div>
							</div>
							<!-- </div> -->
						</div>
					</div>
					<!-- <ul class="clearfix">
						<li v-for="(item, index) in namelist">
							<div class="name"><img src="../assets/1.png" style="width: 50px; height: 50px; vertical-align: middle;" />
								<span style="vertical-align: middle;">{{ item.stuName }}</span></div>
							<div>
								<p v-for="(path,subindex) in item.filePaths" :key='subindex'><i class="num">{{subindex+1}}</i><span class="play"
									 @click="payAudio(path)"></span></p>
							</div>
						</li>
					</ul> -->
				</div>
			</transition>
		</div>
		<div class="videobox">
			<div class="reftext active" v-if="isshowNamelist">
				<div class="txt">
					<div class="title">{{ reftext }}</div>
				</div>
			</div>
			<div class="soundbox" v-if="isshowNamelist">
				<span @click="startAudio" class="sound">
					<img src="../assets/play.png" alt="" v-if="!isPlay">
					<img src="../assets/play.gif" alt="" v-if="isPlay">
				</span>
			</div>
		</div>
		<audioscore ref="audioscore"></audioscore>

	</div>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import {
		urlPath,

	} from '@/page/mainPage/utils/base';
	import audioscore from './audioscore'
	export default {
		data() {
			return {
				isshowNamelist: false,
				namelist: [],
				isShow: false,
				hsselectWordList: [],
				playnum: -1,
				playlisttype: 0,
				isreftex: false,
				reftext: '',
				sound_eng_url: null,
				isPlay: false,
				hasRead: true, //已读列表
				usersoundurl: null //学生语言地址

			}
		},
		components: {
			audioscore
		},
		computed: {
			// ...mapState(['urlPath']),

		},
		props: {
			selectWordList: {
				type: Array,
				default: []
			},
			hasNotplay: {
				type: [Array, Object],
				default: []
			}
		},
		mounted() {
			let $me = this;
			var audio = this.$refs.playmusic;
			if (audio) {
				audio.loop = false;
				audio.addEventListener('ended', function() {
					if ($me.playnum != -1) {
						$me.playnum = -1;
					}
					$me.isPlay = false;
					$me.usersoundurl = null
				}, false);
			}
		},
		watch: {

		},
		created() {

		},
		methods: {
			handleClick: function() {
				this.show = !this.show
			},
			play(xsAudioUrl, index, type) {
				this.playnum = index;
				this.playlisttype = type;
				this.isPlay = false;
				this.payAudio("https://data.caidouenglish.com/" + xsAudioUrl)
			},
			payAudio(xsAudioUrl) {
				if (this.$refs.playmusic) {
					this.$refs.playmusic.src = xsAudioUrl;
					console.log(xsAudioUrl)
					this.usersoundurl = xsAudioUrl;
					this.$refs.playmusic.load();
					this.$refs.playmusic.play();

				}
			},
			/* 查询语言答题记录 */
			getVoiceRecord(item) {
				// this.namelist = item.studentVoices;
				// this.isshowNamelist = true;
				this.reftext = item.wordtxt;
				this.sound_eng_url = item.sound_eng_url;
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/voiceAnswer/getVoiceRecord',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: item.wordtxt
				}).then(da => {
					console.log(da)
					if (da.data && da.data.ret == 'success') {
						let studentVoices = da.data.data[0].studentVoices;
						this.namelist = studentVoices;
						// console.log(this.namelist)
						this.isshowNamelist = true;
					} else {
						this.$toast.center(da.data.message);
					}
				});
			},
			startAudio() {
				this.isPlay = true;
				this.payAudio("https://data.caidouenglish.com/" + this.sound_eng_url)
			},
			splitArr(data, senArrLen) {
				//处理成len个一组的数据
				let data_len = data.length;
				let arrOuter_len = data_len % senArrLen === 0 ? data_len / senArrLen : parseInt((data_len / senArrLen) + '') + 1;
				let arrSec_len = data_len > senArrLen ? senArrLen : data_len; //内层数组的长度
				let arrOuter = new Array(arrOuter_len); //最外层数组
				let arrOuter_index = 0; //外层数组的子元素下标
				// console.log(data_len % len);
				for (let i = 0; i < data_len; i++) {
					if (i % senArrLen === 0) {
						arrOuter_index++;
						let len = arrSec_len * arrOuter_index;
						//将内层数组的长度最小取决于数据长度对len取余，平时最内层由下面赋值决定
						arrOuter[arrOuter_index - 1] = new Array(data_len % senArrLen);
						if (arrOuter_index === arrOuter_len) //最后一组
							data_len % senArrLen === 0 ?
							len = data_len % senArrLen + senArrLen * arrOuter_index :
							len = data_len % senArrLen + senArrLen * (arrOuter_index - 1);
						let arrSec_index = 0; //第二层数组的索引
						for (let k = i; k < len; k++) { //第一层数组的开始取决于第二层数组长度*当前第一层的索引
							arrOuter[arrOuter_index - 1][arrSec_index] = data[k];
							arrSec_index++;
						}
					}
				}
				return arrOuter

			},
			hideNamelist() {
				this.isshowNamelist = false
			},
			showdetails(info) {
				/* 查看详情 */
				this.$refs.audioscore.show(info)
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.fade-enter-active,
	.fade-leave-active {
		-webkit-transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
		transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
			opacity: 0;
		}

		50% {
			opacity: 1;
			transform: scale(1.01);
		}

		100% {

			transform: scale(1);
		}
	}


	.bounce-enter-active {
		animation: bounce-in .5s;
	}

	.bounce-leave-active {
		animation: bounce-in .5s reverse;
	}

	.namelistbox .name {
		color: #0066c4;
		font-size: 20px;
	}

	.namelistbox i.num,
	.list i.num {
		border-radius: 100%;
		border: 1px solid #1890ff;
		height: 20px;
		width: 20px;
		color: #1890ff;
		vertical-align: middle;
		display: inline-block;
		text-align: center;
		line-height: 18px;
		font-size: 12px;
	}

	.namelistbox p {
		margin: 5px;
	}

	.namelistbox .num+span,
	.list .num+span {
		vertical-align: middle;
	}

	.rightbar {
		right: 0;
		top: 20%;
		bottom: 20%;
		position: fixed;

		transition: all .3s;
		z-index: 1000;
		transform: translateX(250px);

		&.active {
			transform: translateX(0);
		}

		&>.flex {
			box-shadow: 0 0 10px rgba(67, 132, 212, .4);
			width: 270px;
			border-radius: 6px;
			height: 100%;
			opacity: 0;
			background: #fff;
			overflow: hidden;
		}

		&.active>.flex {
			opacity: 1;
		}

		.arrow {
			height: 40px;
			width: 40px;
			border: 2px solid #1890ff;
			border-radius: 100%;
			background: #fff url(../assets/rightbar.png) no-repeat center center;
			background-size: 12px auto;
			position: absolute;
			cursor: pointer;
			left: 0;
			top: 50%;
			transform: translate(-50%, -50%) rotate(180deg);
			transition: all .3s;
		}

		&.active .arrow {
			transform: translate(-50%, -50%) rotate(0);
		}

		.title {
			line-height: 40px;
			font-size: 20px;
			color: #1890ff;
			text-align: center;
			cursor: pointer;
			border-bottom: 1px solid #d1e9ff;

			&>span.active {
				background: #1890ff;
				color: #fff;
			}
		}

		.list {
			overflow: auto;

		}


		.list p {
			padding: 10px 10px 30px 20px;
			cursor: pointer;
		}

		.list .num+span {
			color: #1890ff;
			font-size: 16px;
			padding: 0 10px;
		}
	}

	.notice,
	.play {
		display: inline-block;
		vertical-align: middle;
		width: 20px;
		height: 20px;
		background: url(../assets/icon24.png) no-repeat left center !important;

		&.play {
			background-image: url(../assets/icon25.png)
		}


	}

	.notice {
		background-size: 16px auto;
	}

	.notice.active,
	.play.active {
		background-image: url(../assets/noticeplay.gif) !important;
		background-size: 20px auto !important;
		;
		background-position-x: -2px !important;
		;

	}


	.videobox {
		position: absolute;
		z-index: 9999;
	}

	.soundbox {
		border: 2px solid rgba(24, 114, 255, 0.9);
		background: #fff;
		position: fixed;
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 100%;
		width: 45px;
		height: 45px;
		text-align: center;
		padding-top: 7px;
		padding-left: 7px;
		/* padding-top: 11px; */
		box-sizing: border-box;
		z-index: 9999;
	}

	.sound {
		cursor: pointer;
		vertical-align: middle;
	}

	.sound img {
		display: block;
		width: 30px;
	}

	.sound.active>span {
		background: none;
	}

	.namelistbox {
		.details {
			position: relative;

			.num {
				background: #ec6d64;
				// margin-left: 20px;
				border-radius: 100%;
				height: 36px;
				width: 36px;
				line-height: 36px;
				font-size: 14px;
				color: #fff;
				display: inline-block;
				text-align: center;
				position: absolute;
				left: 0;
				top: 50%;
				transform: translateY(-50%);
				z-index: 999;

				&:after {
					content: '';
					display: block;
					width: 25px;
					height: 25px;
					border: 1px solid #fff;
					border-radius: 100%;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					position: absolute;
				}
			}

			.txt {
				color: #fff;
				font-size: 14px;
				background: #ec6d64;
				line-height: 26px;
				padding: 0 16px;
				border-radius: 50px;
				height: 26px;
				padding-left: 40px;
				display: block;

			}
		}

		.item {
			width: 25%;
			padding: 10px;

			&>div {
				box-shadow: 0 0 10px rgba(0, 0, 0, .1);
				border-radius: 5px;
				height: 100%;
				padding: 10px;

				.name+div {
					overflow: hidden;
				}

				p {
					float: left;
					font-size: 12px;
				}

				.score {
					display: inline-block;
					width: 4em;
				}
			}

		}
	}
</style>

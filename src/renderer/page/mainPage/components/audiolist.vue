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
						<span
						 class="notice" :class="{'active':playnum==index}" @click="play(item.sound_eng_url,index)"></span>
						<i class="num" @click="getVoiceRecord(item)">{{index+1}}</i>
						<span v-if='item' @click="getVoiceRecord(item)">{{item.wordtxt}}</span></p>
				</div>
				<div class="list flex-1" v-if="hasNotplay&&hasNotplay.length>0&&!hasRead">
					<p v-for="(item,index) in hasNotplay" :key="index">
						<span
						 class="notice" :class="{'active':playnum==index}" @click="play(item.sound_eng_url,index)"></span>
						 <i class="num" @click="getVoiceRecord(item)">{{index+1}}</i>
						<span v-if='item' @click="getVoiceRecord(item)">{{item.word}}</span></p>
				</div>
			</div>
			<div class="arrow" @click="isShow=!isShow"></div>
		</div>

		<div class="namelistbox" v-if="isshowNamelist">
			<div class="mask" @click.stop="isshowNamelist = !isshowNamelist"></div>
			<transition name="bounce">
				<div class="namelistbox-bd">
					<a href="javascript:;" class="close" @click="isshowNamelist = !isshowNamelist">×</a>
					<ul class="clearfix">
						<li v-for="(item, index) in namelist">
							<div class="name"><img src="../assets/1.png" style="width: 50px; height: 50px; vertical-align: middle;" />
								<span style="vertical-align: middle;">{{ item.stuName }}</span></div>
							<div>
								<p v-for="(path,subindex) in item.filePaths" :key='subindex'><i class="num">{{subindex+1}}</i><span class="play"
									 @click="payAudio(path)"></span></p>
							</div>
						</li>
					</ul>
				</div>
			</transition>
		</div>
		<div class="videobox">
			<div class="reftext " v-if="isshowNamelist">
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
	export default {
		data() {
			return {
				isshowNamelist: false,
				namelist: [],
				isShow: false,
				hsselectWordList: [],
				playnum: -1,
				isreftex: false,
				reftext: '',
				sound_eng_url: null,
				isPlay: false,
				hasRead: true, //已读列表

			}
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
			play(xsAudioUrl, index) {
				this.playnum = index;
				this.isPlay = false;
				this.payAudio("https://data.caidouenglish.com/" + xsAudioUrl)
			},
			payAudio(xsAudioUrl) {
				if (this.$refs.playmusic) {
					this.$refs.playmusic.src = xsAudioUrl;
					console.log(xsAudioUrl)
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
						this.namelist = da.data.data[0].studentVoices;
						this.isshowNamelist = true;
					} else {
						this.$toast.center(da.data.message);
					}
				});
			},
			startAudio() {
				this.isPlay = true;
				this.payAudio("https://data.caidouenglish.com/" + this.sound_eng_url)
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

	.namelistbox .num,
	.list .num {
		border-radius: 100%;
		border: 1px solid #1890ff;
		height: 20px;
		width: 20px;
		color: #1890ff;
		vertical-align: middle;
		display: inline-block;
		text-align: center;
		line-height: 20px;
	}

	.namelistbox p {
		margin: 5px 0;
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
			height: 45px;
			width: 45px;
			border: 2px solid #1890ff;
			border-radius: 100%;
			background: #fff url(../assets/rightbar.png) no-repeat center center;
			background-size: 14px auto;
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
			padding: 10px 10px 30px;
			cursor: pointer;
		}

		.list .num+span {
			color: #1890ff;
			font-size: 16px;
			margin: 0 10px;
		}
	}

	.notice,
	.play {
		display: inline-block;
		vertical-align: middle;
		width: 20px;
		height: 20px;
		background: url(../assets/icon24.png) no-repeat left center;

	}

	.notice {
		background-size: 16px auto;
	}

	.notice.active {
		background-image: url(../assets/noticeplay.gif);
		background-size: 20px auto;
	}

	.play {
		background-image: url(../assets/icon25.png)
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
</style>

<template>
	<div>
		<audio ref="playmusic"  crossOrigin="anonymous" preload ended></audio>
		<div class="rightbar" :class="{active:isShow}">
			<div class="flex flex-v">
				<div class="title">已读{{hsselectWordList.length}}题</div>
			
				<div class="list flex-1" v-if="hsselectWordList&&hsselectWordList.length>0">
					<p v-for="(item,index) in hsselectWordList" :key="index">
						<i class="num"  @click="getVoiceRecord(item.word)">{{index+1}}</i><span v-if='item' @click="getVoiceRecord(item.word)">{{item.word}}</span><span class="notice" :class="{'active':item.isplaying}"
						 @click="play(item.sound_eng_url,index)"></span></p>
				</div>
			</div>
			<div class="arrow" @click="isShow=!isShow"></div>
		</div>
		<transition name="bounce">
			<div class="namelistbox" v-if="isshowNamelist">
				<div class="mask" @click.stop="isshowNamelist = !isshowNamelist"></div>
				<div class="namelistbox-bd">
					<a href="javascript:;" class="close" @click="isshowNamelist = !isshowNamelist">×</a>
					<ul class="clearfix">
						<li v-for="(item, index) in namelist">
							<div class="name">{{ item.stuName }}</div>
							<div>
								<p v-for="(path,subindex) in item.filePaths" :key='subindex'><i class="num">1</i><span class="play" @click="payAudio(path)"></span></p>
							</div>
						</li>
					</ul>
				</div>

			</div>
		</transition>

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
				

			}
		},
		computed: {
			// ...mapState(['urlPath']),

		},
		props:{
			selectWordList:{
				type:Array,
				default:{}
			}
		},
		mounted() {
			let $me = this;
			var audio = this.$refs.playmusic;
			if (audio) {
				audio.loop = false;
				audio.addEventListener('ended', function() {
					$me.hsselectWordList[$me.playnum].isplaying = false;
					$me.playnum = -1;
				}, false);
			}
		},
		watch: {
			selectWordList: {
				handler(newName, oldName) {
					if (newName != oldName) {
						const $me = this;
						let list = []
						if (this.selectWordList && this.selectWordList.length > 0) {
							list = this.selectWordList.filter(item => item.isPlayed)
						}
						if (list && list.length > 0) {
							list.forEach(item => {
								item.isplaying = false
							})
						}
						$me.hsselectWordList = [...list];
						console.log("jhaja")
					}
				},
				deep: true,
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				immediate: true
			},

		},
		created() {

		},
		methods: {
			handleClick: function() {
				this.show = !this.show
			},
			play(xsAudioUrl, index) {
				if (this.playnum != -1) {
					this.hsselectWordList[this.playnum].isplaying = false;
				}
				this.playnum = index;
				var item = this.hsselectWordList[this.playnum];
				item.isplaying = true;
				this.$set(this.hsselectWordList, index, item);
				this.$refs.playmusic.src = "https://data.caidouenglish.com/" + xsAudioUrl;
				this.$refs.playmusic.load();
				if (this.$refs.playmusic) {
					this.$refs.playmusic.play();
				
				}
			},
			payAudio(xsAudioUrl){
				this.$refs.playmusic.src =xsAudioUrl;
				this.$refs.playmusic.load();
				if (this.$refs.playmusic) {
					this.$refs.playmusic.play();
				
				}
			},
			/* 查询语言答题记录 */
			getVoiceRecord(word){
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/voiceAnswer/getVoiceRecord',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: word
				}).then(da => {
					console.log(da)
					if (da.data && da.data.ret == 'success') {
						this.namelist = da.data.data[0].studentVoices;
						this.isshowNamelist=true;
						
					}
				});
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
		position: absolute;
		transition: all .3s;
		transform: translateX(250px);

		&.active {
			transform: translateX(0);

		}

		&>.flex {
			box-shadow: 0 0 10px rgba(67, 132, 212, .4);
			width: 270px;
			border-radius: 6px;
			height: 100%;
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
			padding-left: 30px;
			border-bottom: 1px solid #d1e9ff;
		}

		.list {
			overflow: auto;
		}

		.list p {
			padding: 10px 30px;
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
		background: url(../assets/icon24.png) no-repeat center center;
		
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
</style>

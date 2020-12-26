<template>
	<div style="height: 100%; overflow: hidden;">
		<audio id="music" :src="bgAudio" crossOrigin="anonymous" preload loop></audio>
		<audio id="xsmusic" ref="xsmusic" crossOrigin="anonymous" preload ended></audio>
		<audio id="startAudio" :src="startAudioMp3" autobuffer style="z-index: 999;position: absolute;"></audio>
		<audio id="endAudio" :src="endAudio" autobuffer style="z-index: 999;position: absolute;"></audio>
		<audio id="endAudio2" :src="endAudio2" autobuffer style="z-index: 999;position: absolute;"></audio>
		<!-- 工具箱 -->
		<toolbar ref="toolbar" @close="isshowSet = false" @Satrspeaker="Satrspeaker" @resumeCountDown="resumeCountDown" :namelist="namelist" :ifTemporary="isAnswering"></toolbar>
		<controlbar
			@startRace="startRace"
			@stopRace="stopRace"
			@sendtitle="sendtitle"
			@prevQuestion="prevQuestion"
			@nextQuestion="nextQuestion"
			@callname="callname"
			@addSubject="addSubject"
			:isSubject="isSubject"
			:isAddSubject="isAddSubject"
			:isStop="isStop"
			:isSendtitle="isSendtitle"
			:subjecttitle="subjecttitle"
			:isAnswering="isAnswering"
		></controlbar>
		<!-- 正确答案 -->
		<board :trueAnswer="trueAnswer" v-show="isSendtitle && trueAnswer" :class="[isSendtitle ? 'fadeIn' : 'fadeOut']"></board>

		<!-- 进度条 -->
		<load :isprogress="isprogress" :rate="rate" :answerNumber="answerNumber" :totalNumber="totalNumber"></load>

		<notice :titlename="titlename" class="animated fast" :class="[titlename ? 'slideInDown' : 'slideOutUp']"></notice>

		<!-- 左侧菜单 -->
		<div class="leftmenu">
			<!-- <i class="refresh" @click="getResource(2)" v-if="isshowResource==2"></i> -->
			<i class="refresh" @click="getResource(3)" v-if="isshowResource == 3"></i>
			<a href="javascript:;" @click="showNamelist" :class="{ active: isshowNamelist }">
				<i class="icon1"></i>
				学生名单
			</a>
			<!-- <a href="javascript:;" @click="showResource(1)" :class="{'active':isshowResource==1}"><i class="icon2"></i>学科网</a> -->
			<!-- <a href="javascript:;" @click="showResource(2)" :class="{'active':isshowResource==2}"><i class="icon2"></i>网校通</a> -->
			<a href="javascript:;" @click="showResource(3)" :class="{ active: isshowResource == 3 }">
				<i class="icon3"></i>
				组卷
			</a>
			<a href="javascript:;" @click.stop="showSet" :class="{ active: isshowSet }">
				<i class="icon4"></i>
				工具箱
			</a>
		</div>
		<!-- 显示 -->
		<div class="activing">
			<div id="danmu" :style="{ zIndex: isAnswering ? 999 : -1 }"></div>
			<!--红包-->
			<div class="couten" :style="{ zIndex: isAnswering ? 999 : -1 }"></div>
			<div id="audio" v-if="ismicrophone">
				<div class="audiobox">
					<div id="one"></div>
					<div id="two"></div>
					<div id="three"></div>
					<div id="four"></div>
					<div id="five"></div>
				</div>
				<img src="../../assets/audio.png" />
				<div class="stuname" v-if="stuName">
					<img src="../../assets/icon7.png" />
					<p>{{ stuName }}</p>
				</div>
			</div>
			<!-- 语音文本显示 -->
			<transition name="bounce">
				<audiotxt class="audiotxt" v-if="isreftext" :reftext="reftext" :questionType="XSquestionType" :class="{ active: !isAnswering }"></audiotxt>
			</transition>
			<div class="soundbox" :style="{top:soundboxTop+'px',left:soundboxLeft+'px'}" v-if="isreftext && subjecttitle == 9">
				<span @click="startAudio" class="sound" v-if="subjecttitle == 9">
					<img src="../../assets/play.png" alt="" v-if="!isPlay" />
					<img src="../../assets/play.gif" alt="" v-if="isPlay" />
				</span>
			</div>
			<div class="txtlist" v-show="isanalysis">
				<div class="item flex " v-for="(item, index) in txtlist" :key="index">
					<div class="imgbox"><img src="../../assets/1.png" /></div>
					<div class="flex-1">
						<div class="flex flex-pack-justify">
							<span>{{ item.name }}</span>
							<span><img src="../../assets/icon.png" /></span>
						</div>
						<p>{{ item.txt }}</p>
					</div>
				</div>
			</div>
			<div class="prevtxt" @click="prevtxtScreen" v-show="isanalysis && txtlist.length > 0"><!-- <img src="../../assets/prev.png" alt=""> --></div>
			<div class="nexttxt" @click="nexttxtScreen" v-show="isanalysis && txtlist.length > 0"><!-- <img src="../../assets/next.png" alt=""> --></div>
		</div>
		<!-- 结果 -->
		<div class="resultbox " v-show="isResult">
			<div class="flex flex-v flex-align-center" style="height: 100%;">
				<div class="rank" v-if="isRank" :class="{ top: isCorrectchart || isChart }">
					<div class="rankitem bounceIn animated" v-for="(item, index) in ranklist">
						<p>{{ item.stuName }}</p>
						<p class="score">{{ item.score }}分</p>
					</div>
				</div>
				<div class="chartbox flex-1" :class="{ h70: isRank && ranklist.length > 0 }" v-show="isChart || isCorrectchart">
					<!-- 主观题统计 -->
					<div class="chart" style="height:90%;width: 45%;float: left;" v-show="isChart"><piechart ref="piechart" @handPiechart="handPiechart"></piechart></div>
					<!-- 正确率统计 -->
					<div class="Correctchart" style="height:90%; float: left; text-align: center;" :style="{ width: isChart ? '55%' : '100%' }" v-show="isCorrectchart">
						<barchart ref="barchart" @handBarchart="handBarchart" :colorList="colorList" :subjecttitle="subjecttitle" :trueAnswer="trueAnswer"></barchart>
					</div>
				</div>
				<!-- 语音测评排行榜 -->
				<div class="rankborad" v-if="isrankboradlist">
					<div class="item flex flex-align-center" :class="'item' + (index + 1)" v-for="(item, index) in rankboradlist" :key="index">
						<div class="num">{{ index + 1 }}</div>
						<div class="imgbox"><img src="../../assets/1.png" /></div>
						<div class="flex-1 ml20">
							<span class="name">{{ item.stuName }}</span>
							<span class="ml20">({{ item.score }}分)</span>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!--选择题目-->
		<temquestion ref="temquestion" @showXianshenWin="showXianshenWin" :groupName="groupName" :sentenceList="sentenceList"></temquestion>
		<!-- 倒计时 -->
		<count-down v-if="isCountDown == 1" v-show="isAnswering && !isSatrspeaker" :setTimer="countDown * 1000" @stopCountDown="stopCountDown" ref="countdown"></count-down>
		<div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; background: #fff;" v-show="isshowResource != 0">
			<a-spin tip="正在加载..." :spinning="spinning" style="height: 100%;" size="large">
				<iframe ref="iframe1" :src="resourceUrllist[1]" frameborder="0" style="width: 100%; height: 100%;" v-show="isshowResource == 2"></iframe>
				<iframe ref="iframe2" :src="resourceUrllist[2]" frameborder="0" style="width: 100%; height: 100%;" v-show="isshowResource == 3"></iframe>
			</a-spin>
		</div>
		<!-- 右侧先声题库历史 -->
		<audiolist ref="audiolist" @sendAudio="sendAudio" :isAnswering="isAnswering && subjecttitle == 9" :sentenceList="sentenceList" @delAudio="delAudio"></audiolist>
		<!-- 先声题库 -->
		<xianshen ref="xianshenWin" @showGroup="showGroup"></xianshen>
		<!-- 学生名单 -->
		<namelist ref="namelist" :isAnswering="isAnswering" :namelist="namelist" :sendInfo="sendInfo" @hide="isshowNamelist = false" @uploadNameList="getNamelist"></namelist>
		<!-- statistics 统计答案的名单 -->
		<div class="namelistbox animated fast" :class="[isshowselectNamelist ? 'fadeIn' : 'fadeOut']" v-if="isshowselectNamelist">
			<div class="mask" @click.stop="isshowselectNamelist = !isshowselectNamelist"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="isshowselectNamelist = !isshowselectNamelist"></a>
				<ul class="clearfix">
					<li v-for="(item, index) in selectNamelist">
						<img src="../../assets/1.png" style="width: 50px; height: 50px; vertical-align: middle;" />
						<span style="vertical-align: middle;">
							{{ item.stuName }}
							<template v-if="subjecttitle == 3 && item.answer">
								({{ item.answer }})
							</template>
						</span>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script>
function GetQueryString(searchurl, name) {
	var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
	var r = searchurl.match(reg);
	if (r != null) return unescape(r[2]);
	return null;
}

function fixedZero(val) {
	return val * 1 < 10 ? `0${val}` : val;
}
import {
	notice,
	progressbox,
	dropmenu,
	search,
	load,
	board,
	CountDown,
	toolbar,
	audiotxt,
	audiolist,
	xianshen,
	namelist,
	controlbar,
	temquestion,
	piechart,
	barchart
} from '@/page/mainPage/components';
import { IndexMixin } from '@/page/mainPage/mixins/index';
import { mapState, mapGetters } from 'vuex';
import { urlPath, urlwsPath, htmlescpe, allenglish, allchinese } from '@/page/mainPage/utils/base';
import $ from '@/page/mainPage/assets/js/jquery-vendor';
import '@/page/mainPage/assets/js/jquery.danmu';

import echarts from 'echarts';
export default {
	mixins: [IndexMixin],
	components: {
		notice,
		progressbox, //进度条
		dropmenu,
		search,
		load,
		board, //正确答案显示
		toolbar,
		CountDown, //倒计时
		audiotxt,
		audiolist,
		xianshen,
		namelist, //学生名单
		controlbar, //控制条
		temquestion,
		piechart,
		barchart
	},
	data() {
		return {
			isshowNamelist: false,
			onlineclasslist: [], //在线班级
			titlename: '',
			trueAnswer: '',
			path: '',
			ws: null,
			stuName: '',
			ranklist: [],
			isRank: false,
			isChart: false,
			isCorrectchart: false,
			ismicrophone: false, //麦克风
			isreftext: false, //语音测评
			reftext: '',
			isanalysis: false, //语音解析
			txtlist: [], //语音解析文本
			onlinedirectBroadcastCode: '', //直播间code
			isResult: false, //是否显示统计结果
			/* TODO 删除 start */
			subjecttitle: '1', //题型
			subjectType: 0, //0 普通 1 语音
			settrueanswer: '', //正确答案
			score: 5, //分数
			isSubject: true, //是否显示题目
			isAddSubject: false, //是否添加题目
			/* TODO 删除 end */

			isStop: false, //是否显示结束按钮
			reftitletype: 1, //语言测评类型
			titletypeList: [
				{
					name: '英文单词',
					value: '1'
				},
				{
					name: '英文句子',
					value: '2'
				},
				{
					name: '中文句子',
					value: '4'
				}
			], //语言测评数组类型
			onetitletype: {
				name: '英文单词',
				value: '1'
			},
			reftitletypelist: [], //语言测评数组
			talkName: '', //语言测评题目
			talkquestionType: 7, //语言识别
			isparticlesbox: false, //是否显示开始动画
			isSendtitle: false, //是否显示下发题目
			chartDate: {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			},
			subjectitleList: [
				{
					name: '单题单选',
					value: '1'
				},
				{
					name: '判断题',
					value: '2'
				},
				{
					name: '单题多选',
					value: '3'
				},
				{
					name: '主观题',
					value: '4'
				},
				{
					name: '抢红包',
					value: '5'
				}
			],
			yysubjectitleList: [
				{
					name: '语音识别',
					value: '6'
				},
				{
					name: '语音测评',
					value: '7'
				},
				{
					name: '麦克风',
					value: '8'
				},
				{
					name: '跟读测评',
					value: '9'
				}
			],
			onesubjectitle: {
				name: '单题单选',
				value: '1'
			},
			CorrectchartDate: {
				title: [],
				data: []
			},
			timer: null,
			uuid: '',
			alltxtlist: {},
			iPhoneType: 0, //麦克风类型
			isprogress: false, //是否显示进度条，
			rate: 0,
			isAnswering: false, //是否正在答题
			isunbind: false, //是否解绑
			ubindParams: {}, //解绑参数
			selectAnswer: [],
			isshowselectNamelist: false,
			selectNamelist: [],
			/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
			titlenamelist: [
				{
					titlename: '单题单选',
					subjecttitle: '1'
				},
				{
					titlename: '单题多选',
					subjecttitle: '3'
				},
				{
					titlename: '多题单选',
					subjecttitle: '0'
				},
				{
					titlename: '判断题',
					subjecttitle: '2'
				},
				{
					titlename: '主观题',
					subjecttitle: '4'
				},
				{
					titlename: '抢红包',
					subjecttitle: '5'
				}
			],
			checklist: [],
			colorList: [],
			isSatrspeaker: false, //是否开启扬声器
			countDownTime: '',
			// iscountDown: false,
			showcountDown: false,
			isrankboradlist: false, //是否显示语音测评结果
			rankboradlist: [], //语音测评排名
			xianshenglist: this.selectWordList, //先声题库数据
			XSquestionType: 0, //先声题库类型
			XStalkName: null, //当前正在作答的先声题
			xsAudioUrl: '', //音频文件地址
			isPlay: false, //是否播放音频
			resourceUrl1: null,
			resourceUrllist: [],
			isshowResource: 0, //是否显示注册地址
			imgUrl: '', //截图地址
			isshowSet: false, //是否打开设置弹框
			audiohistorylist: [],
			stuCode: null, //点名学生code
			namelist: [],
			groupName: '', //题库名称
			sentenceList: [],
			hasNotplay: [], //未播放的先声题库列表
			spinning: false, //加载loading
			isScreening: false, //是否正则截屏
			startAudioMp3: __static + '/mp3/start.mp3',
			endAudio: __static + '/mp3/end.mp3',
			endAudio2: __static + '/mp3/end2.mp3',
			bgAudio: __static + '/mp3/bg.mp3', //抢红包背景音乐
			selectOrVoice: false, //当前是否在跟读测评。后台会发送语音题目的websock
			isVoiceWordType: 1, // 保存记录再模板导入语音题的类型 1 英文单词 2，英文句子 4，中文句子
			soundboxTop: 5,
			soundboxLeft: 0
		};
	},
	computed: {
		// ...mapState(['platformpath', 'interactiopath', 'foundationpath'])
		...mapState([
			'platformpath',
			'interactiopath',
			'foundationpath',
			'isminimizeAppState',
			'directBroadcastCode',
			'selectWordList',
			'selectSentenceList',
			'isCountDown',
			'countDown',
			'danmuinfolist'
		]),
		...mapGetters(['getisminimizeApp', 'onEvent'])

		// selectAnswerStr() {
		// 	return this.checklist
		// 		.filter(item => item.ischeck)
		// 		.map(item => item.name)
		// 		.sort()
		// 		.join('');
		// },
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		//console.log(this.$route.query.sendInfo)
		// this.onlinedirectBroadcastCode = this.sendInfo.directBroadcastCode;
		this.$store.commit('SET_startClass', true);
		this.$electron.ipcRenderer.send('onlinedirebro', true);
		this.getNamelist('bingingCard/getAllBingdCardInfo');
		// this.getjson();
		let $me = this;
		/* 监听 资源网 打开新窗口 */
		this.$electron.ipcRenderer.on('iframeUrl', (event, iframeUrl) => {
			if (iframeUrl) {
				if ($me.isshowResource == 2) {
					if (iframeUrl.split('?')[0] == 'http://localhost:8080/tabframe') {
						let search = iframeUrl.split('?')[1];
						var wxtpath = GetQueryString(search, 'wxtpath');
						iframeUrl = 'http://zkxl.school.zxxk.com' + wxtpath;
					}
				}
				$me.$set($me.resourceUrllist, $me.isshowResource - 1, iframeUrl);
			}
			/* 赋值地址后，主动将悬浮窗置为顶层 */
			this.$electron.ipcRenderer.send('moveTop');
		});

		/* 获取弹幕信息 */
		this.getDanmuinfo();
		/* 主进程 通知是否退出直播间 */
		this.$electron.ipcRenderer.on('exitdirebro', (event, flag) => {
			this.exitBtn();
		});
	},

	mounted() {
		const $me = this;
		/* 设置count的宽度 */
		const w = parseInt($('.couten').width() / 200) * 200;
		//console.log(($('.couten').width() - w) / 2);
		const l = ($('.couten').width() - w) / 2 + $('.couten')[0].offsetLeft;
		$('.couten').css({
			width: w,
			left: l
		});
		document.getElementById('music').load();
		var audio = document.getElementById('xsmusic');
		if (audio) {
			audio.loop = false;
			audio.addEventListener(
				'ended',
				function() {
					console.log('停止播放音乐');
					$me.isPlay = false;
				},
				false
			);
		}
		/* 接受websock   */
		this.onmessage();
	},
	watch: {
		checklist: {
			handler(newName, oldName) {
				const $me = this;
				if ($me.subjecttitle == 3) {
					// var option = $me.myCorrectChart.getOption();
					//console.log(option);
					for (var i = 0; i < $me.checklist.length; i++) {
						if ($me.checklist[i].ischeck) {
							$me.colorList[i] = '#FF999A';
						} else {
							$me.colorList[i] = '#59ADF3';
						}
					}
					$me.$refs.barchart.upOption();
					// $me.myCorrectChart.setOption(option);
				}
			},
			deep: true
			// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
			// immediate: true
		},
		/* 是否显示弹幕 */
		isCountDown(newValue, oldValue) {
			if (newValue != oldValue) {
				if (newValue == 1 && this.isAnswering && !this.isSatrspeaker) {
					this.timeDown();
				}
			}
		}
	},
	methods: {
		exitBtn() {
			const $me = this;
			this.$loading('正在退出...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/endClass'
			}).then(da => {
				/* 关闭webscoket */
			});
			setTimeout(function() {
				$me.$loading.close();
				$me.$store.commit('SET_startClass', false);
				/* 通知悬浮窗 退出直播间成功 */
				$me.$electron.ipcRenderer.send('onlinedirebro', false);
				/* 跳转到选择直播间页面 */
				// $me.$router.go(-1); //返回上一层
				$me.$router.push({
					//页面跳转
					path: 'classroom',
					query: {
						sendInfo: localStorage.getItem('loginSendInfo')
					}
				});
			}, 5000);
		},

		/* 开始下发题目 */
		startRace(PrevIndex, talkName) {
			const $me = this;
			if ($me.isScreening) {
				$me.$toast.center('正在保存题干，请稍后');
				return false;
			}
			var param = $me.$refs.temquestion.start() || {};
			if (param) {
				$me.subjecttitle = talkName ? '7' : $me.$refs.temquestion.subjecttitle;
				/* 判读语音测评  题目*/
				if ($me.subjecttitle == 7) {
					$me.talkName = talkName || $me.$refs.temquestion.talkName;
					if (talkName) {
						param.type = $me.isVoiceWordType;
						param.refText = talkName;
					}
				}
				/* 判断麦克风是抢麦还是群发麦克风 */
				if ($me.subjecttitle == 8) {
					$me.iPhoneType = $me.$refs.temquestion.iPhoneType;
				}
				/* 判断是否是跟读测评 */
				if ($me.subjecttitle == 9) {
					/* 取先声题库列表中的未读字段 */
					let XStalkNameIndex = 0;
					/* 如果发送上一题。则题号索引， */
					console.log(PrevIndex);
					if (PrevIndex || PrevIndex === 0) {
						XStalkNameIndex = PrevIndex;
					} else {
						XStalkNameIndex = $me.sentenceList.findIndex(item => item.hasRead == 0);
						if (XStalkNameIndex <= -1) {
							$me.sentenceList.forEach(item => (item.hasRead = 0));
							XStalkNameIndex = 0;
						}
					}
					console.log(XStalkNameIndex);
					XStalkNameIndex = XStalkNameIndex || 0;
					$me.sentenceList[XStalkNameIndex].hasRead = 1; //0 未读，1 在读，2 已读
					$me.XStalkName = $me.sentenceList[XStalkNameIndex];
					this.xsAudioUrl = 'https://data.caidouenglish.com/' + $me.XStalkName.sound_eng_url;
					this.$refs.xsmusic.src = this.xsAudioUrl;
					this.$refs.xsmusic.load();
					param = {
						type: $me.XStalkName.type,
						refText: $me.XStalkName.word
					};
				}
				/* 显示正确答案 */
				if (param.trueAnswer) {
					$me.trueAnswer = param.trueAnswer;
				}
				$me.Answerstar(param);
			}
		},
		Answerstar(param) {
			/* 普通题目调用接口 */
			const $me = this;
			var url = '',
				judgetype = '',
				setVoive = 0;
			// param = {};
			//const uuid = $me.randomWord(false, 32);
			switch ($me.subjecttitle) {
				case '1': {
					judgetype = 1;
					url = 'singleAnswer/start';
					$me.titlename = '单题单选';
					break;
				}
				case '2': {
					judgetype = 4;
					url = 'judgeAnswer/start';
					$me.titlename = '判断题';
					break;
				}
				case '3': {
					judgetype = 2;
					url = 'sMultiAnswer/start';
					$me.titlename = '单题多选';
					break;
				}
				case '4': {
					judgetype = 5;
					url = 'judgeAnswer/start';
					$me.titlename = '主观题';
					break;
				}
				case '5': {
					judgetype = 6;
					url = 'redWars/start';
					$me.titlename = '抢红包';
					break;
				}
				case '6': {
					url = 'voiceAnswer/startDiscern';
					if ($me.isSatrspeaker) {
						url = 'voiceAnswer/startDiscernAndMicrophone';
						param.stuCode = $me.stuCode;
					}
					$me.titlename = '语音识别';
					break;
				}
				case '7': {
					url = 'voiceAnswer/startAppraisal';
					if ($me.isSatrspeaker) {
						if ($me.isAnswering) {
							// url = 'voiceAnswer/startAppraisalAndMicrophone ';
							url = 'voiceAnswer/startAppraisalAndMicrophoneNotClear';
						} else {
							url = 'voiceAnswer/startAppraisalAndMicrophoneClear';
						}
						param.stuCode = $me.stuCode;
					}
					$me.titlename = '语音测评';
					break;
				}
				case '8': {
					if ($me.iPhoneType == 0) {
						url = 'microphone/start';
						$me.titlename = '抢麦';
					} else {
						url = 'microphone/start2';
						$me.titlename = '自由麦';
					}
					break;
				}
				case '9': {
					url = 'voiceAnswer/startAppraisal';
					if ($me.isSatrspeaker) {
						// url = 'voiceAnswer/startAppraisalAndMicrophone ';
						if ($me.isAnswering) {
							// url = 'voiceAnswer/startAppraisalAndMicrophone ';
							url = 'voiceAnswer/startAppraisalAndMicrophoneNotClear';
						} else {
							url = 'voiceAnswer/startAppraisalAndMicrophoneClear';
						}
						param.stuCode = $me.stuCode;
					}
					param.refVoicePath = $me.xsAudioUrl;
					$me.titlename = '跟读测评';
					/* 切换 为 跟读测评 */
					if ($me.selectOrVoice == 1) {
						$me.updateAutoAnswerType(2);
					}
					break;
				}
			}

			if (judgetype) {
				param.questionType = judgetype;
			}
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/' + url,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			})
				.then(da => {
					if (da.data.ret == 'success') {
						if ($me.isCountDown == 1) {
							$me.$refs.countdown.clearCount();
							/* 如果是随机作答题目，就暂停倒计时 */
							if (!$me.isSatrspeaker) {
								$me.timeDown();
							}
						}
						$me.startVIew();
						/* 判断题型，截屏 */
						if (judgetype == 1 || judgetype == 2 || judgetype == 4) {
							$me.isScreening = true; //开始截屏
							$me.$nextTick(() => {
								setTimeout(() => {
									$me.saveImgFullScreen();
								}, 100);
							});
						}

						$me.totalNumber = da.data.data; //答题总人数
					} else {
						$me.isScreening = false; //停止截屏
						$me.$toast.center(da.data.message);
					}
				})
				.catch(function(err) {
					$me.isScreening = false; //停止截屏
				});

			//$me.$store.commit("SET_isShowbg", true);
		},
		/* 调用开始接口成功以后，页面显示 */
		startVIew() {
			const $me = this;
			// $me.clear();
			$me.clearView();
			$me.isAnswering = true; //开始答题
			/*开始答题*/

			if ($me.subjecttitle != 6 && $me.subjecttitle != 7 && $me.subjecttitle != 8 && $me.subjecttitle != 9) {
				$me.isprogress = true; //显示进度条
			}
			if ($me.subjecttitle != 5 && $me.subjecttitle != 8 && $me.subjecttitle != 6) {
				/* 先获取弹幕的样式 */
				if (this.danmuinfolist && this.danmuinfolist.length > 0) {
					let num = 0;
					switch ($me.subjecttitle) {
						case '1': {
							num = 1;
							break;
						}
						case '2': {
							num = 4;
							break;
						}
						case '3': {
							num = 2;
							break;
						}
						case '4': {
							num = 5;
							break;
						}
						case '7':
						case '9': {
							num = 7;
							break;
						}
					}
					let index = this.danmuinfolist.findIndex(item => item.questionType == num);
					if (index >= 0) {
						let danmuinfo = this.danmuinfolist[index];
						if (danmuinfo.isOpenBarrageflag) {
							/*不是抢红包,语音识别，麦克风 开始弹幕*/
							$('#danmu').data('danmuList', {});
							$('#danmu').danmu('danmuStart');
							/* 设置弹幕位置和透明度 */
							$('#danmu').danmu('setOpacity', danmuinfo.diaphaneity / 100);
							$('#danmu').danmu('setLocation', danmuinfo.location);
						}
					}
				}
			}
			if ($me.subjecttitle == 5) {
				if (document.getElementById('music')) {
					document.getElementById('music').play();
				}
			} else {
				/* 播放开始提示语 */
				if (document.getElementById('startAudio')) {
					document.getElementById('startAudio').play();
				}
			}
			$me.isSubject = false; //不显示题目
			$me.isStop = true; //显示停止按钮
			if ($me.subjecttitle == 6) {
				/* 语音识别 */
				$me.isanalysis = true;
				if ($me.isSatrspeaker) {
					$me.ismicrophone = true;
				}
			} else if ($me.subjecttitle == 8) {
				if ($me.iPhoneType != 0) {
					/* 判断是否群麦克风 */
					$me.ismicrophone = true;
				}
			} else {
				if ($me.subjecttitle == 7 || $me.subjecttitle == 9) {
					$me.isreftext = true;
					if ($me.subjecttitle == 7) {
						$me.reftext = $me.talkName;
					} else {
						$me.reftext = $me.XStalkName.word;
					}

					if ($me.isSatrspeaker) {
						$me.ismicrophone = true;
					}
					$me.soundboxTop = 5;
					this.$nextTick(() => {
						if ($me.subjecttitle == 9) {
							console.log('高度', $('.audiotxt')[0].offsetTop);
							$me.soundboxTop = $('.audiotxt')[0].offsetTop - $('.audiotxt')[0].offsetHeight / 2 - 15;
							console.log('宽度', $('.audiotxt .txt')[0].offsetWidth,document.body.offsetWidth);
							$(window).width
							$me.soundboxLeft = $('.audiotxt .txt')[0].offsetWidth / 2+document.body.offsetWidth*.2
						}
					});
				}
				//$me.isparticlesbox = true;
			}
		},
		clearView() {
			/* 是否教鞭切换发题是，清屏页面 */
			const $me = this;
			$me.clear();
			$me.isStop = false;
			$me.isAnswering = false;
			/*清空弹幕*/
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStop');
			/* 清空红包 */
			$me.delredenvelope();
			document.getElementById('music').pause();
			/* 隐藏跟读测评的 历史记录 */
			$me.$refs.audiolist.hideNamelist();
			$me.isreftext = false; //语音测评
		},
		stopRace(isNext, PrevIndex) {
			/* 点击结束答题 */
			const $me = this;
			$me.clear();

			/* 先不隐藏停止按钮，以免停止事件挥着查询排名接口报错，无法显示下发题目按钮 */
			$me.isStop = true;
			/*清空弹幕*/
			$('#danmu').data('danmuList', {});
			$('#danmu').danmu('danmuStop');
			/* 清空红包 */
			$me.delredenvelope();
			document.getElementById('music').pause();
			/* 清空倒计时 */
			if (this.isCountDown == 1) {
				this.$refs.countdown.clearCount();
			}
			if ($me.subjecttitle == 4 || $me.subjecttitle == 6 || $me.subjecttitle == 7 || $me.subjecttitle == 8) {
				//查询主观题统计----从webscoket返回
				$me.Answerstop();
			} else if ($me.subjecttitle == 5) {
				$me.redWarslist(urlPath);
			} else if ($me.subjecttitle == 9) {
				$me.Answerstop(isNext, PrevIndex);
			} else {
				$me.getspeedlist(urlPath);
			}
		},
		Answerstop(isNext, PrevIndex) {
			/* 结束答题 */
			var url = '';
			const $me = this;
			switch ($me.subjecttitle) {
				case '1': {
					url = 'singleAnswer/stop';
					break;
				}
				case '3': {
					url = 'sMultiAnswer/stop';
					break;
				}
				case '5': {
					url = 'redWars/stop';
					break;
				}
				case '6': {
					/*停止语音 */
					url = 'voiceAnswer/stop';
					break;
				}
				case '7': {
					/*停止语音测评 */
					url = 'voiceAnswer/stop';
					break;
				}
				case '8': {
					/*停止麦克风 */
					url = 'microphone/stop';
					break;
				}
				case '9': {
					/*停止跟读测评 */
					url = 'voiceAnswer/stop';
					break;
				}
				default: {
					/*2或者4*/
					url = 'judgeAnswer/stop';
					break;
				}
			}
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/' + url
			})
				.then(da => {
					/*结束答题*/
					console.log($me.subjecttitle);
					/* 判断倒计时 */
					if ($me.countDownTime > 0) {
						clearInterval(this.timer);
					}
					/* 去掉随机和点名 */
					this.isSatrspeaker = false;
					/* 如果是语言题就不显示下发题目按钮。直接显示开始按钮  测试*/
					if ($me.subjecttitle == 6 || $me.subjecttitle == 8) {
						$me.sendtitle();
					} else {
						$me.isResult = true; //显示作答结果
						$me.isSendtitle = true; //显示下发题目按钮
					}
					$me.isStop = false; //隐藏停止按钮
					$me.uuid = ''; //清空uuid
					$me.isAnswering = false; //停止答题
					if ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3 || $me.subjecttitle == 4) {
						$me.getEveryAnswerNum();
						/* 播放语音结束声音 */
						if (document.getElementById('endAudio2')) {
							document.getElementById('endAudio2').play();
						}
					}
					if ($me.trueAnswer && ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3)) {
						$me.getAnswerAccuracy();
					}
					if ($me.subjecttitle == 4) {
						$me.getSubjectiveResult();
					}
					if ($me.subjecttitle == 7) {
						$me.getHighScores();
					}
					/*如果直接进入下一题语音 不显示语音测评结果 */
					if ($me.subjecttitle == 9) {
						/* 结束以后设置 已读状态*/
						var index = $me.sentenceList.findIndex(item => item.word == $me.XStalkName.word);
						$me.sentenceList[index].hasRead = 2;
						/* isNext 1 表示下一题，-1 表示上一题 */
						if (isNext != 1 && isNext != -1) {
							$me.getHighScores();
						} else {
							if (isNext == 1 && $me.sentenceList[$me.sentenceList.length - 1].word == $me.XStalkName.word) {
								$me.getHighScores();
							} else {
								$me.startRace(PrevIndex);
							}
						}
						// $me.XStalkName = null;
						// this.getVoiceRecord()
					}

					// $me.countDownTime = 0;
					// $me.iscountDown = false;
					// $me.showcountDown = false;
				})
				.catch(function(err) {
					$me.$loading.close();
				});
		},
		/* 查询正确率 */
		getAnswerAccuracy() {
			const $me = this;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/statistics/getAnswerAccuracy'
			}).then(da => {
				var list = da.data.data;
				var option = [
					{
						value: list.trueNum,
						name: '正确'
					},
					{
						value: list.totalNum - list.trueNum,
						name: '错误'
					}
				];
				$me.getCorrectChartpieData(option);
			});
		},
		/* 查询主观题统计 */
		getSubjectiveResult() {
			const $me = this;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/statistics/getSubjectiveResult'
			}).then(da => {
				var list = da.data.data;
				console.log('主观题统计' + JSON.stringify(da.data.data.unAnswerNum));
				var option = [
					{
						value: list.agreeNumber,
						name: '懂'
					},
					{
						value: list.disagreeNumber,
						name: '不懂'
					},
					{
						value: list.unAnswerNum,
						name: '未作答'
					}
				];
				$me.getChartData(option);
			});
		},
		/* 查询作答选项人数 */
		getEveryAnswerNum() {
			const $me = this;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/statistics/getEveryAnswerNum'
			}).then(da => {
				var list = da.data.data;
				var title = [],
					data = [],
					dataShadow = [],
					percentage = [];
				if (list && list.length > 0) {
					list.forEach(item => {
						title.push(item.answer);
						data.push(item.count);
						percentage.push(item.percentage);
					});
				}
				let max = Math.max(...data);
				dataShadow = data.map(item => {
					return max;
				});
				//var title = Object.keys(list);
				//var data = title.map(item => list[item]);
				$me.getCorrectChartData({
					title,
					data,
					dataShadow,
					percentage
				});
			});
		},
		/*获取答题 柱状图chart*/
		getCorrectChartData(myoption) {
			const $me = this;
			$me.isCorrectchart = true;
			this.$refs.barchart.setOption(myoption);
		},
		/* 正确率显示 */
		getCorrectChartpieData(myoption) {
			const $me = this;
			$me.isChart = true;
			this.$refs.piechart.setOption(myoption, '正确率');
		},
		/* 主观题统计 饼状图 显示*/
		getChartData(myoption, title) {
			const $me = this;
			$me.isChart = true;
			this.$refs.piechart.setOption(myoption, '主观题统计');
		},
		/* piechart 点击事件
		@handtitle 点击标题，
		@seriesname 正确率统计还是主观题统计
		*/
		handPiechart(handtitle, seriesname) {
			if (seriesname == '正确率') {
				this.getEveryAnswerName(
					{
						answer: this.trueAnswer
					},
					handtitle != '正确'
				);
			} else {
				this.getEveryAnswerName({
					answer: handtitle
				});
			}
		},
		/* 点击柱状图 */
		handBarchart(handtitle) {
			this.getEveryAnswerName({
				answer: handtitle
			});
		},
		/* 清空页面显示内容 */
		clear() {
			const $me = this;
			//$me.stuName = ''; //麦克风学生名称
			$me.isResult = false; //是否显示统计结果
			$me.ranklist = []; //排序列表
			$me.isRank = false; //是否显示排序
			$me.isChart = false; //显示主观题统计
			$me.isCorrectchart = false; //正确率统计
			$me.ismicrophone = false; //麦克风
			// $me.isreftext = false; //语音测评
			$me.isanalysis = false; //语音解析
			$me.txtlist = []; //语音解析文本
			$me.isSubject = false; //是否显示题目
			$me.isAddSubject = false; //是否添加题目
			$me.$refs.temquestion.isShow($me.isAddSubject);
			$me.isStop = false; //是否显示结束按钮
			$me.isSendtitle = false;
			// $me.isparticlesbox = false;
			$me.isprogress = false; //隐藏进度条
			$me.rate = 0; // 答题进度条
			$me.answerNumber = 0; // 答题进度条 答题人数
			$me.totalNumber = 0; // 答题进度条 总人数
			$me.chartDate = {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			};
			$me.CorrectchartDate = {
				title: [],
				data: []
			};
			$me.isrankboradlist = false;
			$me.isPlay = false; //停止播放音频
			// $me.stuName=''
		},

		/* 下发题目 隐藏统计结果 显示题目 */
		sendtitle() {
			const $me = this;
			$me.clear();
			$me.isSubject = true;
			$me.isreftext = false;
			$me.titlename = '';
			$me.trueAnswer = '';
			$me.stuName = ''; //麦克风学生名称
			$me.isSatrspeaker = false; //是否开启扬声器
			if ($me.selectOrVoice == 2) {
				$me.updateAutoAnswerType(1);
			}
		},

		/* 获取选项答题人数 */
		getEveryAnswerName(param, isFalseAnswer) {
			const $me = this;
			var url = 'teacher-client/statistics/getEveryAnswerName';
			if (isFalseAnswer) {
				/* 查询错误学生名单 */
				url = 'teacher-client/statistics/getFalseAnswerName';
			}
			this.$http({
				method: 'post',
				url: urlPath + url,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(param)
			}).then(da => {
				if (da.data.ret == 'success') {
					/*  */
					$me.isshowselectNamelist = true;
					$me.selectNamelist = da.data.data;
				} else {
					$me.$toast.center('查询失败');
				}
			});
		},

		/* 下一题 */
		nextQuestion() {
			const $me = this;
			if ($me.isScreening) {
				$me.$toast.center('正在保存题干，请稍后');
				return false;
			}
			/* 需要判断是语音停的下一题还是普通题目 */
			if ($me.subjecttitle == 9 && $me.isAnswering) {
				$me.nextAudioQuestion();
				return false;
			}

			$me.isScreening = true; //开始截屏
			// $me.startVIew();
			$me.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/nextQuestion'
			})
				.then(da => {
					if (da.data.ret == 'success') {
						console.log('下一题' + JSON.stringify(da));
						/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
						$me.trueAnswer = da.data.data.trueAnswer;
						$me.titlename = '第' + da.data.data.questionId + '题<br>';
						if (da.data.data.type == 'voice') {
							$me.titlename = $me.titlename + '语音测评';
							$me.subjectType = 1;
							$me.subjecttitle = '7';
							$me.talkName = da.data.data.question;
							$me.reftext = $me.talkName;
							$me.isVoiceWordType = da.data.data.questionType == 'cnSentence' ? 4 : da.data.data.questionType == 'enWord' ? 1 : 2;
							$me.isScreening = false; //截屏
							$me.startVIew();
						} else {
							$me.titlename = $me.titlename + $me.titlenamelist[da.data.data.questionType - 1].titlename;
							$me.subjectType = 0;
							$me.subjecttitle = $me.titlenamelist[da.data.data.questionType - 1].subjecttitle;
							$me.startVIew();
							$me.$nextTick(() => {
								setTimeout(() => {
									$me.saveImgFullScreen();
								}, 100);
							});
						}
						if ($me.isCountDown == 1) {
							$me.timeDown();
						}
						$me.totalNumber = da.data.data.totalNum; //答题总人数
					} else {
						$me.isScreening = false; //开始截屏
						$me.$toast.center(da.data.message);
					}
				})
				.catch(e => {
					$me.isScreening = false;
				});
		},
		/* 上一题 */
		prevQuestion() {
			const $me = this;
			if ($me.isScreening) {
				$me.$toast.center('正在保存题干，请稍后');
				return false;
			}
			/* 需要判断是语音停的下一题还是普通题目 */
			if ($me.subjecttitle == 9 && $me.isAnswering) {
				$me.prevAudioQuestion();
				return false;
			}
			$me.isScreening = true; //开始截屏
			$me.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/prevQuestion'
			})
				.then(da => {
					if (da.data.ret == 'success') {
						console.log('上一题' + JSON.stringify(da));
						/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
						$me.trueAnswer = da.data.data.trueAnswer;
						$me.titlename = '第' + da.data.data.questionId + '题<br>';
						if (da.data.data.type == 'voice') {
							$me.titlename = $me.titlename + '语音测评';
							$me.subjectType = 1;
							$me.subjecttitle = '7';
							$me.talkName = da.data.data.question;
							$me.reftext = $me.talkName;
							$me.isVoiceWordType = da.data.data.questionType == 'cnSentence' ? 4 : da.data.data.questionType == 'enWord' ? 1 : 2;
							$me.isScreening = false; //截屏
							$me.startVIew();
						} else {
							$me.titlename = $me.titlename + $me.titlenamelist[da.data.data.questionType - 1].titlename;
							$me.subjectType = 0;
							$me.subjecttitle = $me.titlenamelist[da.data.data.questionType - 1].subjecttitle;
							$me.startVIew();
							$me.$nextTick(() => {
								setTimeout(() => {
									$me.saveImgFullScreen();
								}, 100);
							});
						}

						if ($me.isCountDown == 1) {
							$me.timeDown();
						}
						$me.totalNumber = da.data.data.totalNum; //答题总人数
					} else {
						$me.isScreening = false; //停止截屏
						$me.$toast.center(da.data.message);
					}
				})
				.catch(e => {
					$me.isScreening = false;
				});
		},
		/* 语音测评统计 */
		getHighScores() {
			const $me = this;
			/* 先判断是跟读测评。还是语音测评 */
			var param = {};
			if (this.subjecttitle == 7) {
				param.word = this.talkName;
				param.sound_eng_url = '';
			} else {
				param = this.XStalkName;
			}
			this.$refs.audiolist.getVoiceRecord(param);
			/* 播放语音结束声音 */
			if (document.getElementById('endAudio')) {
				document.getElementById('endAudio').play();
			}
		},
		/* 倒计时结束 */
		stopCountDown() {
			this.stopRace(1);
		},
		/* 开始计时 */
		timeDown() {
			this.$nextTick(() => {
				this.$refs.countdown.startCount();
			});
		},
		/* 播放音频 */
		startAudio() {
			// console.log('开始播放音乐')
			const $me = this;
			if (document.getElementById('xsmusic')) {
				document.getElementById('xsmusic').play();
				$me.isPlay = true;
			}
		},
		onmessage() {
			let $me = this;
			/* 连接websock */
			this.$store.dispatch('STAFF_WEBSOCKET');
			console.log(this.$store.getters.STAFF_UPDATE);
			this.$store.getters.STAFF_UPDATE.onmessage = function(evt) {
				var received_msg = evt.data;
				console.log(received_msg);
				if (received_msg != '连接成功') {
					var msg = JSON.parse(received_msg);
					var obj = msg.data;
					switch (msg.reqType) {
						case 0: {
							var time = $('#danmu').data('nowTime') + 1;
							/*当渲染弹幕过多的时候,延迟处理弹幕*/
							if ($('#danmu .danmaku').length > 500) {
								time += 200; //2000毫秒。
							}
							var answer = '';
							/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
							if (msg.businessType == 1 || msg.businessType == 2 || msg.businessType == 3) {
								answer = obj.answer;
							} else if (msg.businessType == 4) {
								answer = obj.answer == 'E' ? '✔' : '✖';
							} else if (msg.businessType == 5) {
								answer = obj.answer == 'E' ? '懂' : '不懂';
							}
							if (msg.businessType == 6) {
								/*抢红包*/
								$me.addredenvelope(msg.data);
							} else {
								$('#danmu').danmu('addDanmu', [
									{
										text: obj.stuName,
										color: 'white',
										size: 0,
										position: 0,
										time: time
									}
								]);
							}
							break;
						}
						case 1: {
							/*刷新名单*/
							for (var i = 0; i < msg.urlPaths.length; i++) {
								if (msg.urlPaths[i].method == 'getNamelist') {
									$me.getNamelist(msg.urlPaths[i].url);
								} else if (msg.urlPaths[i].method == 'getprogress') {
									$me.getprogress(urlPath);
								}
							}
							break;
						}
						case 4: {
							if (msg.order == 'START_BUSINESS_TYPE_10') {
								var obj = msg.data;
								$me.stuName = obj.stuName;
								$me.ismicrophone = true;
							}
							break;
						}
						case 6: {
							$me.chartDate.title.push(msg.data.className);
							$me.chartDate.agreeNumber.push(msg.data.agreeNumber);
							$me.chartDate.disagreeNumber.push(msg.data.disagreeNumber);
							$me.chartDate.unAnswerNum.push(msg.data.unAnswerNum);
							var option = [
								{
									name: '懂',
									type: 'bar',
									stack: '主观题',
									barWidth: 60,
									data: $me.chartDate.agreeNumber,
									label: {
										normal: {
											show: true,
											position: 'inside',
											color: '#fff',
											formatter: function(param) {
												return param.value > 0 ? param.value + '人' : '';
											},
											textStyle: {
												fontSize: 24
											}
										}
									}
								},
								{
									name: '不懂',
									type: 'bar',
									stack: '主观题',
									barWidth: 60,
									data: $me.chartDate.disagreeNumber,
									label: {
										normal: {
											show: true,
											position: 'inside',
											color: '#fff',
											formatter: function(param) {
												return param.value > 0 ? param.value + '人' : '';
											},
											textStyle: {
												fontSize: 24
											}
										}
									}
								},
								{
									name: '未作答',
									type: 'bar',
									stack: '主观题',
									barWidth: 60,
									data: $me.chartDate.unAnswerNum,
									label: {
										normal: {
											show: true,
											position: 'inside',
											color: '#fff',
											formatter: function(param) {
												return param.value > 0 ? param.value + '人' : '';
											},
											textStyle: {
												fontSize: 24
											}
										}
									}
								}
							];
							$me.getChartData(option, $me.chartDate.title);
							break;
						}
						case 7: {
							/* 语音测评 */
							// $me.ismicrophone = false;
							var obj = msg.data;

							var time = $('#danmu').data('nowTime') + 1;
							/*当渲染弹幕过多的时候,延迟处理弹幕*/
							if ($('#danmu .danmaku').length > 500) {
								time += 200; //2000毫秒。
							}
							var answer = obj.score;
							$('#danmu').danmu('addDanmu', [
								{
									text: obj.stuName + '(' + answer + ')',
									color: 'white',
									size: 0,
									position: 0,
									time: time
								}
							]);
							break;
						}
						case 8: {
							/* 语言解析 */
							$me.ismicrophone = false;
							var obj = msg.data;
							if (obj.ret == 'success') {
								$me.txtlist.push(obj.data);
								$me.$nextTick(function() {
									$('.txtlist').animate(
										{
											scrollTop: $('.txtlist')[0].scrollHeight
										},
										400
									);
								});
							}
							break;
						}
						case 9: {
							var obj = msg.data;
							var stuName = obj.stuName;
							$me.stuName = obj.stuName;
							$me.isparticlesbox = false;
							$me.ismicrophone = true;
							break;
						}
						case 11: {
							var obj = msg.data;
							$me.stuName = obj.stuName;
							break;
						}
						case 12: {
							/* 网络连接断开 */
							$me.$toast('网络连接断开');
							break;
						}
						case 13: {
							/* 网络连接连接 */
							$me.$toast('网络连接成功');
							/* 重新加载学科网地址 */
							$me.getResource(3, 1);
							$me.getResource(2, 1);
							break;
						}
						case 14: {
							/* 网络连接连接 */
							$me.$toast('USB连接断开');
							break;
						}
						case 15: {
							/* 网络连接连接 */
							$me.$toast('USB连接成功');
							break;
						}
						case 16: {
							/* 随机抽查人 */
							var obj = msg.data;
							$me.stuName = obj.stuName;
							console.log($me.stuName);
							break;
						}
						case 17: {
							/* 显示软件 */
							$me.$electron.ipcRenderer.send('maxApp');
							break;
						}
						case 18: {
							/* 隐藏软件 */
							$me.$electron.ipcRenderer.send('minApp');
							break;
						}
						case 19: {
							/* 停止答题 */
							if ($me.isAnswering) {
								$me.stopRace();
							}
							break;
						}
						case 20: {
							/*下一题 */
							// $me.clearView();
							$me.nextQuestion();
							break;
						}
						case 21: {
							/*上一题 */
							// $me.clearView();
							$me.prevQuestion();
							break;
						}
						case 22: {
							/*教鞭停止跟读测评 */
							if ($me.isAnswering) {
								$me.stopRace();
							}
							break;
						}
						case 23: {
							/*教鞭上一题跟读测评 */
							// if ($me.isAnswering) {
							$me.nextAudioQuestion();
							// }
							break;
						}
						case 24: {
							/*教鞭下一题跟读测评 */
							// if ($me.isAnswering) {
							$me.prevAudioQuestion();
							// }
							break;
						}
						default: {
							$me.$toast(msg.data);
							break;
						}
					}
				} else {
					$('#danmu').data('danmuList', {});
					$('#danmu').danmu('danmuStop');
					$('#danmu').danmu('danmuStart');
				}
			};
		},
		saveImgFullScreen() {
			/* 全屏截图 */
			const $me = this;
			$me.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/saveQuestionImgAndSend'
			})
				.then(da => {
					if (da.data.ret == 'success') {
						/* 截图保存给后端 */
						this.imgUrl = 'data:image/jpg;base64,' + da.data.data;
					} else {
						$me.$toast.center(da.data.message);
					}
				})
				.finally(() => {
					/* 提示截屏完成 */
					this.isScreening = false;
				});
		},
		showSet() {
			/* 打开工具箱 */
			this.isshowSet = !this.isshowSet;
			if (this.isshowSet) {
				this.$refs.toolbar.showSet();
			} else {
				this.$refs.toolbar.hide();
			}
		},
		/* 获取题库资源 */
		getResource(type, state) {
			const $me = this;
			$me.spinning = true;
			if (type == 3) {
				$me.$http({
					method: 'post',
					url: urlPath + 'teacher-client/platform/authentication',
					data: {
						serviceType: type //1 学科网，2组卷网 3，e卷通
					}
				}).then(da => {
					if (da.data.ret == 'success') {
						$me.$set($me.resourceUrllist, 2, '');
						$me.$set($me.resourceUrllist, 2, da.data.data);
						$me.setResoule(type, state);
						// this.resourceUrl = da.data.data
					} else {
						$me.$toast.center(da.data.message);
						if (da.data.code == 401) {
							setTimeout(function() {
								$me.returnback();
							}, 500);
						}
					}
				});
			} else {
				$me.$set($me.resourceUrllist, 1, '');
				$me.$set($me.resourceUrllist, 1, 'http://zkxl.school.zxxk.com/ThirdParty/CustomJump?_m=http://localhost:8080');
				$me.setResoule(type, state);
			}
		},
		setResoule(type, state) {
			const $me = this;
			if (!state) {
				/* 表示第一次加载，显示iframe */
				this.isshowResource = type;
			} else {
				$me.spinning = false;
			}
			if (this.isshowResource != type) {
				return false;
			}
			this.$nextTick(() => {
				try {
					let iframe = $me.$refs['iframe' + (type - 1)];
					if (iframe) {
						if (iframe.attachEvent) {
							iframe.attachEvent('onload', function() {
								$me.spinning = false;
							});
						} else {
							iframe.onload = function() {
								$me.spinning = false;
							};
						}
					}
				} catch (e) {
					//TODO handle the exception
				}
			});
		},
		showResource(type) {
			/* 显示资源网 */
			// this.getResource(type)
			if (this.isshowResource == type) {
				this.isshowResource = 0;
			} else {
				let resourceUrl = this.resourceUrllist[type - 1];
				if (!resourceUrl) {
					this.getResource(type);
				} else {
					this.isshowResource = type;
				}
			}
			// this.spinning=true;
			// if (this.isshowResource != 0) {
			// 	this.resourceUrl = this.resourceUrllist[type - 1]
			// }
		},
		getDanmuinfo() {
			/* 查询弹幕设置 */
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/teacherHabit/queryTeacHabit/45'
			}).then(da => {
				console.log(da);
				if (da.data && da.data.ret == 'success') {
					var list = da.data.data;
					if (list && list.length > 0) {
						list = list.map(item => {
							item.isOpenBarrageflag = item.isOpenBarrage == 1;
							return item;
						});
					}
					this.list = list;
					// console.log(this.list)
					this.$store.commit('SET_danmuinfolist', this.list);
				}
			});
		},
		callname(type) {
			/* 随机或者点名 */
			this.$refs.toolbar.show(type == 0 ? 5 : 6);
		},
		Satrspeaker(stuCode) {
			/* 触发随机点名语音测评 */
			this.isSatrspeaker = true;
			this.stuCode = stuCode;
			console.log('Satrspeaker=>', this.subjecttitle);
			if (this.subjecttitle == 7) {
				this.startRace('', this.talkName);
			} else if (this.subjecttitle == 9) {
				var index = this.sentenceList.findIndex(item => item.word == this.XStalkName.word);
				this.startRace(index);
			} else if (this.subjecttitle == 6) {
				this.startRace();
			} else {
				this.$toast.center('请先选择一个语音题目');
			}
		},
		/* 显示先声题库弹出框 */
		showXianshenWin() {
			this.$refs.xianshenWin.showWin();
		},
		/* 选择了先声题库 题目*/
		showGroup(groupName, list) {
			this.groupName = groupName;
			if (list && list.length > 0) {
				let newlist = [];
				if (this.sentenceList.length > 0) {
					let wordlist = this.sentenceList.map(item => item.word);
					list.forEach(item => {
						console.log(item.word);
						if (!wordlist.includes(item.word)) {
							item.hasRead = 0;
							newlist.push(item);
						}
					});
					// for (var i = 0; i < list.lenght; i++) {
					// 	console.log(list[i].word);
					// 	if (!wordlist.includes(list[i].word)) {
					// 		list[i].hasRead = 0;
					// 		newlist.push(list[i])
					// 	}
					// }
				} else {
					newlist = list.map(item => {
						item.hasRead = 0;
						return item;
					});
				}
				console.log(newlist);
				this.sentenceList = [...this.sentenceList, ...newlist];
			}

			console.log('this.sentenceList', this.sentenceList);
			//先声题库
			// this.hasNotplay = [...this.sentenceList];
		},
		/* 暂停或者继续倒计时 */
		resumeCountDown(type) {
			console.log('type' + type);
			if (this.isCountDown == 1 && this.isAnswering) {
				if (type == 1) {
					this.$refs.countdown.resume();
				} else {
					this.$refs.countdown.clearCount();
				}
			}
		},
		/* 返回登录 */
		returnback() {
			this.$router.push({
				//页面跳转
				path: 'login'
			});
			localStorage.removeItem('loginSendInfo');
		},
		/* 显示学生名单 */
		showNamelist() {
			this.isshowNamelist = !this.isshowNamelist;
			this.$refs.namelist.show(this.isshowNamelist);
		},
		/* 显示或者隐藏临时题目 */
		addSubject(type) {
			this.isAddSubject = type;
			this.$refs.temquestion.isShow(type);
		},
		/* 切换语音识别上一屏 */
		prevtxtScreen() {
			this.$nextTick(function() {
				let scrollTop = $('.txtlist')[0].scrollTop;
				let offsetHeight = $('.txtlist')[0].offsetHeight;
				console.log(scrollTop);
				console.log(offsetHeight);
				$('.txtlist').animate(
					{
						scrollTop: scrollTop - offsetHeight > 0 ? scrollTop - offsetHeight : 0
					},
					400
				);
			});
		},
		/* 切换语音识别下一屏 */
		nexttxtScreen() {
			this.$nextTick(function() {
				let scrollTop = $('.txtlist')[0].scrollTop;
				let offsetHeight = $('.txtlist')[0].offsetHeight;
				let scrollHeight = $('.txtlist')[0].scrollHeight;
				console.log(scrollTop);
				console.log(offsetHeight);
				$('.txtlist').animate(
					{
						scrollTop: scrollTop + offsetHeight > scrollHeight ? scrollHeight : scrollTop + offsetHeight
					},
					400
				);
			});
		},
		/* 跟读测评下一题 */
		/* 跟读测评下一题 */
		nextAudioQuestion() {
			let $me = this;
			if (!this.sentenceList || this.sentenceList.length == 0) {
				return false;
			}
			if (this.XStalkName && this.XStalkName.word) {
				this.subjecttitle = '9';
				var index = this.sentenceList.findIndex(item => item.word == this.XStalkName.word);
				this.stopRace(1, index + 1);
			}
		},
		prevAudioQuestion() {
			let $me = this;
			if (!this.sentenceList || this.sentenceList.length == 0) {
				return false;
			}
			var index = 0;
			if (this.XStalkName && this.XStalkName.word) {
				index = this.sentenceList.findIndex(item => item.word == this.XStalkName.word);
			}
			// var index = this.sentenceList.findIndex(item => item.word == this.XStalkName.word);
			if (index <= 0) {
				this.$toast.center('没有上一题了');
			} else {
				/* 将上一题置为未读 */
				this.subjecttitle = '9';
				this.stopRace(-1, index - 1);
			}
		},
		sendAudio(index) {
			//随机发送先声题库
			this.stopRace(-1, index);
		},
		delAudio(index) {
			/* 删除先声题目 */
			this.sentenceList.splice(index, 1);
		},
		// 通知后端是语音题还是普通题
		updateAutoAnswerType(selectOrVoice) {
			this.selectOrVoice = selectOrVoice;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/updateAutoAnswerType?updateAutoAnswerType=' + selectOrVoice
			});
		}
	}
};
</script>

<style scoped="scoped">
.setcountDown {
	position: fixed;
	right: 10px;
	bottom: 40px;
	z-index: 9999;
}

.setcountDown span {
	vertical-align: middle;
	margin-right: 10px;
	color: #f00;
	font-size: 20px;
}

.setcountDown .checkbox {
	display: inline-block;
	vertical-align: middle;
	height: 40px;
	width: 100px;
	background: url(../../assets/off.png);
	cursor: pointer;
}

.setcountDown .checkbox.active {
	background: url(../../assets/on.png);
}

.countDownbox {
	position: fixed;
	right: 220px;
	top: 40px;
	width: 160px;
	z-index: 9999;
}

.bounce-enter-active {
	animation: bounceInDown 0.5s;
}

.bounce-leave-active {
	animation: bounceInDown 0.5s reverse;
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
	/* width: 21px;
		height: 21px;
		padding: 1px 0 0 7px;
		display: inline-block; */
	cursor: pointer;
	vertical-align: middle;
}

.sound img {
	display: block;
	width: 30px;
}

.sound.active > span {
	background: none;
}

.leftmenu {
	position: fixed;
	bottom: 40px;
	left: 10px;
	z-index: 10001;
}

.leftmenu > a {
	display: block;
	width: 197px;
	height: 60px;
	border: 5px solid #fff;
	background: #1890ff;
	border-radius: 3px;
	color: #fff;
	text-align: left;
	padding-left: 20px;
	font-size: 24px;
	line-height: 50px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.leftmenu > a + a {
	margin-top: 5px;
}

.leftmenu > a.active {
	background: #005fb6;
}

.leftmenu > a i {
	display: inline-block;
	height: 30px;
	width: 30px;
	background: no-repeat center center;
	margin-right: 10px;
	vertical-align: middle;
	margin-top: -3px;
}

.leftmenu > a i.icon1 {
	background-image: url(../../assets/icon21.png);
}

.leftmenu > a i.icon2 {
	background-image: url(../../assets/icon22.png);
}

.leftmenu > a i.icon3 {
	background-image: url(../../assets/icon23.png);
}

.leftmenu > a i.icon4 {
	background-image: url(../../assets/icon27.png);
}

.leftmenu .refresh {
	height: 40px;
	width: 40px;
	display: block;
	background: url(../../assets/refresh.png);
	right: -50px;
	position: absolute;
	top: 75px;
	cursor: pointer;
}

.leftmenu .refresh.refresh2 {
	top: 140px;
}

/deep/ .ant-spin-container {
	height: 100%;
}

.prevtxt,
.nexttxt {
	position: fixed;
	right: 15%;
	z-index: 999;
	width: 60px;
	height: 60px;
	margin-right: -60px;
	background: #4fb57e no-repeat center center;
	background-size: 40px auto;
	border-radius: 100%;
	border: 3px solid #fff;
	box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.1);
}

.prevtxt {
	bottom: 20%;
	margin-bottom: 70px;
	background-image: url(../../assets/prev.png);
}

.nexttxt {
	bottom: 20%;
	background-image: url(../../assets/next.png);
}
</style>

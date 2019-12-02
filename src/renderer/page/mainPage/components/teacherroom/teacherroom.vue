<template>
	<div>
		<audio id="music" :src="platformpath + '/plat/files/test.mp3'" crossOrigin="anonymous" preload loop></audio>
		<audio id="xsmusic" ref="xsmusic" crossOrigin="anonymous" preload ended></audio>
		<!-- 工具箱 -->
		<toolbar></toolbar>
		<div class="bottommenu">
			<a href="javascript:;" class="start" @click="startRace" v-show="isSubject && isAddSubject"></a>
			<a href="javascript:;" class="stopBtn" @click="stopRace" v-if="isStop"></a>
			<a href="javascript:;" class="send" @click="sendtitle" v-show="isSendtitle"></a>
			<a href="javascript:;" class="prev" @click="prevQuestion" v-show="isSubject && !isAddSubject">
				<i></i>
			</a>
			<a href="javascript:;" class="next" @click="nextQuestion" v-show="isSubject && !isAddSubject">
				<!-- <span>下一题</span> -->
				<i></i>
			</a>

		</div>
		<!-- 正确答案 -->
		<board :trueAnswer="trueAnswer" v-show="isSendtitle && trueAnswer" :class="[isSendtitle ? 'fadeIn' : 'fadeOut']"></board>
		<!-- 添加题目 -->
		<a href="javascript:;" class="addSubject" @click="isAddSubject = !isAddSubject" v-show="isSubject"></a>
		<!-- 绑定名单 -->
		<div class="namelistbox animated fast" :class="[isshowNamelist ? 'fadeIn' : 'fadeOut']" v-if="isshowNamelist">
			<div class="mask" @click.stop="isshowNamelist = !isshowNamelist"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="isshowNamelist = !isshowNamelist">×</a>
				<ul class="clearfix">
					<!-- {{namelist}} -->
					<li v-for="(item, index) in namelist" :class="{ active: item.checked }">
						<i :class="item.state == 0 ? 'warn' : 'success'" @click="checkOneStu(item)"></i>
						<span @click="checkOneStu(item)">{{ item.stuName }}</span>
						<img src="../../assets/jiebang1.png" alt="" v-if="item.state == 1" @click="unBindOneStu(item)" style="opacity: .6;" />
					</li>
				</ul>

				<div class="tag">
					<span>已选择{{ checkbindStu }}个学生</span>
					<a href="javascript:;" @click="unbindCheckedStu">解绑选中学生</a>
					<a href="javascript:;" @click="checkAll">全选</a>
					<a href="javascript:;" @click="uncheckAll">全不选</a>
				</div>
				<div @click="unBindAllStu" class="unbindAllStu" title="一键解绑"><img src="../../assets/jiebang.png" alt="" /></div>
			</div>
		</div>
		<!-- 选择答案的名单 -->
		<div class="namelistbox animated fast" :class="[isshowselectNamelist ? 'fadeIn' : 'fadeOut']" v-if="isshowselectNamelist">
			<div class="mask" @click.stop="isshowselectNamelist = !isshowselectNamelist"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="isshowselectNamelist = !isshowselectNamelist">×</a>
				<ul class="clearfix">
					<!-- {{namelist}} -->
					<li v-for="(item, index) in selectNamelist">
						<img src="../../assets/1.png" style="width: 50px; height: 50px; vertical-align: middle;" />
						<span style="vertical-align: middle;">{{ item.stuName }}
							<template v-if="subjecttitle==3">({{item.answer}})</template>
						</span>
					</li>
				</ul>
			</div>
		</div>
		<load :isprogress="isprogress" :rate="rate"></load>
		<!-- 显示答案 -->
		<notice :titlename="titlename" class="animated fast" :class="[titlename ? 'slideInDown' : 'slideOutUp']"></notice>
		<div class="namelist">
			<div class="setting-drawer-index-handle" @click="isshowNamelist = !isshowNamelist" title="名单"><img src="../../assets/userlist.png"
				 alt="" /></div>
			<div class="swiper-container" style="height: 100%; overflow: auto;">
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" style="cursor: pointer;" title="解绑">
						<i :class="item.state == 0 ? 'warn' : 'success'"></i>
						<span>{{ item.stuName }}</span>
						<img src="../../assets/jiebang1.png" alt="" v-if="item.state == 1" style="width: 20px; height: 20px;" @click="unBindOneStu(item)" />
					</li>
				</ul>
			</div>
			<div @click="unBindAllStu" class="setting-drawer-index-handle unbind" title="解绑"><img src="../../assets/jiebang.png"
				 alt="" /></div>
		</div>
		<!-- 显示 -->
		<div class="activing">
			<div id="danmu"></div>
			<!--红包-->
			<div class="couten"></div>
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
				<div class="reftext " v-if="isreftext">
					<div class="txt">{{ reftext }}</div>

				</div>
			</transition>
			<div class="soundbox" v-if="isreftext&&subjecttitle == 9"><span @click="startAudio" class="sound" :class="{active:isPlay}"
				 v-if="subjecttitle == 9"><span></span></span></div>
			<!-- <div class=" bounceInDown animated" v-if="isreftext" >
				
			</div> -->
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
				<div class="chartbox" :class="{ h70: isRank && ranklist.length > 0 }" v-show="isChart || isCorrectchart">
					<!-- 主观题统计 -->
					<div class="chart" style="height:90%;width: 45%;float: left;" v-show="isChart">
						<div id="myChart" style="height:100%; min-height: 100px;"></div>
					</div>
					<!-- 正确率统计 -->
					<div class="Correctchart" style="height:90%; float: left; text-align: center;" :style="{ width: isChart ? '55%' : '100%' }"
					 v-show="isCorrectchart">
						<div style="height: 25px; text-align: left; padding-left: 60px;" v-if="subjecttitle == 3">
							<div class="ant-checkbox-group">
								<label class="ant-checkbox-group-item ant-checkbox-wrapper" v-for="(item, index) in checklist" :key="index">
									<span class="ant-checkbox">
										<input type="checkbox" v-model="item.ischeck" class="ant-checkbox-input" />
										<span class="ant-checkbox-inner"></span>
									</span>
									<span>{{ item.name }}</span>
								</label>
							</div>
							<a style="text-align: center; color: rgb(24, 114, 255);" href="javascript:;" v-if="selectAnswerStr" @click="getEveryAnswerName({ answer: selectAnswerStr })">
								查看选择{{ selectAnswerStr }}人员名单
							</a>
						</div>
						<div id="myCorrectChart" style="height:100%; min-height:100px;"></div>
					</div>
				</div>
				<!-- <a class="sendtitle" href="javascript:;" @click="sendtitle" v-show="isSendtitle">下发题目</a> -->
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
		<div class="subject flex flex-v flex-align-center modbox" v-show="isAddSubject">
			<div class="tab">
				<div class="tab-item" :class="{ active: subjectType == '0' }">
					<div @click="chooSesubjectType('0')">
						<i></i>
						<span>普通题</span>
					</div>
				</div>
				<div class="tab-item" :class="{ active: subjectType == '1' }">
					<div @click="chooSesubjectType('1')">
						<i></i>
						<span>语音题</span>
					</div>
				</div>
			</div>

			<div class="commonroom flex-1" v-if="subjectType == 0">
				<ul class="subjectitlebox flex flex-pack-justify">
					<li v-for="item in subjectitleList" class="flex-1" :key="item.value" @click="selSubjecttitle(item)" :class="{ active: item.value == subjecttitle }">
						<i></i>
						<p>{{ item.name }}</p>
					</li>
				</ul>

				<div class="fromcontrol flex" v-if="subjecttitle != 4 && subjecttitle != 5">
					<label>答案</label>

					<input type="password" name="" id="" value="" autocomplete="off" class="trueanswer" v-model="settrueanswer"
					 placeholder="请输入正确答案" />
				</div>
				<p class="warn" v-if="subjecttitle != 4 && subjecttitle != 5">
					<template v-if="subjecttitle == 1">
						请输入A-D的单选
					</template>
					<template v-if="subjecttitle == 2">
						请输入E（正确）或者F（错误）
					</template>
					<template v-if="subjecttitle == 3">
						请输入A-D的多选
					</template>
				</p>
				<div class="fromcontrol flex" v-if="subjecttitle != 4 && subjecttitle != 5">
					<label>得分</label>
					<input type="text" name="" id="getScore" value="" class="txt" autocomplete="off" v-model="score" />
				</div>
			</div>
			<!-- 語音 -->
			<div class="talkroom flex-1 mb20" v-if="subjectType == 1" style="width: 500px;">
				<ul class="subjectitlebox flex flex-pack-justify">
					<li v-for="item in yysubjectitleList" class="flex-1" :key="item.value" :class="{ active: item.value == subjecttitle }"
					 @click="chooseSubjecttitle(item)">
						<i></i>
						<p>{{ item.name }}</p>
					</li>
				</ul>

				<div class="fromcontrol flex" v-show="subjecttitle == 6">
					<label>题目类型</label>
					<div style="display:inline-block;  font-size:20px;vertical-align: top;">
						<label style="width:6em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkquestionType" :value="7" v-model="talkquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>英文识别</span>
						</label>
						<label style="width:6em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkquestionType" :value="8" v-model="talkquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>中文识别</span>
						</label>
					</div>
				</div>
				<div class="fromcontrol flex" v-show="subjecttitle == 7">
					<label>题目类型</label>
					<search :searchList="titletypeList" placeholdertxt="请选择题型" @selectFunc="changeTitleType" class="flex-1"
					 :selectValue="onetitletype"></search>
				</div>
				<div class="flex flex-align-center" v-show="subjecttitle == 7">
					<div class="fromcontrol flex flex-1">
						<label>题目</label>
						<div class="flex-1" style="margin-right: 60px;">
							<input type="text" name="" value="" autocomplete="off" v-model.trim="talkName" style="width: 100%;" />
							<dropmenu :reftitletypelist="reftitletypelist" @selTalkName="selTalkName"></dropmenu>
						</div>
					</div>
					<div class="uploadbox">
						<input type="file" name="" value="" id="upload" @change="uploadfile" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
						<span>上传题目</span>
					</div>
				</div>
				<div class="fromcontrol flex" v-show="subjecttitle == 8">
					<label>题目类型</label>
					<div style="display:inline-block; font-size:20px;vertical-align: top;">
						<label style="width:5em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="iPhoneType" :value="0" v-model="iPhoneType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>抢麦</span>
						</label>
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="iPhoneType" :value="1" v-model="iPhoneType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>群发麦克风</span>
						</label>
					</div>
				</div>
				<!-- 跟读测评 题目类型 -->
				<div class="fromcontrol flex" v-show="subjecttitle == 9">
					<label>题目类型</label>
					<div style="display:inline-block;  font-size:20px;vertical-align: top;">
						<label style="width:6em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="XSquestionType" :value="0" v-model="XSquestionType" @change="changeXSquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>英文单词</span>
						</label>
						<label style="width:6em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="XSquestionType" :value="1" v-model="XSquestionType" @change="changeXSquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>英文句子</span>
						</label>
					</div>
				</div>
				<div class="flex flex-align-center" v-show="subjecttitle == 9">
					<div class="fromcontrol flex flex-1">
						<label>题目</label>
						<!-- <search :searchList="xianshenglist" placeholdertxt="请选择题目"  class="flex-1"
						 :selectValue="XStalkName" label="word"></search> -->
						<v-select :options="xianshenglist" v-model="XStalkName" placeholder="请选择题目" class="flex-1" style="padding-right: 20px;"
						 :label="XSquestionType==0?'word':'text'">
							<template slot="no-options">
								没有筛选到题目
							</template>
						</v-select>
					</div>
				</div>
				<div class="fromcontrol flex flex-align-center" v-if="subjecttitle == 6 || subjecttitle == 7|| subjecttitle == 9">
					<label>扬声器</label>
					<div class="ant-checkbox-group " style="text-align: left;">
						<label class="ant-checkbox-group-item ant-checkbox-wrapper" style="width: 20em;">
							<span class="ant-checkbox">
								<input type="checkbox" class="ant-checkbox-input" v-model="isSatrspeaker" />
								<span class="ant-checkbox-inner"></span>
							</span>
							<span style="color: #f00; font-size:20px ;">是否开启扬声器</span>
						</label>
					</div>
				</div>
			</div>
		</div>
		<div class="exitappWin animated fadeIn" v-if="isunbind">
			<div class="confirm">
				<div>
					<div class="title">{{ unbindtext }}</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="isunbind = !isunbind">暂不</a>
						<a href="javascript:;" class="comfirmBtn" @click="unBindStu">确定</a>
					</div>
				</div>
			</div>
		</div>
		<div class="setcountDown">
			<span @click="checkshowcountDown" v-if="iscountDown">{{ countDownList }}</span>
			<div class="checkbox" :class="{ active: iscountDown }" @click="checkcountDown"></div>
		</div>
		<timeswiper @countDown="countDown" @cancelcountDown="cancelcountDown" v-if="iscountDown && showcountDown" class="countDownbox"></timeswiper>
	</div>
</template>

<script>
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
		timeswiper,
		toolbar
	} from '@/page/mainPage/components';
	import vSelect from '@/page/mainPage/components/vue-select';
	import {
		IndexMixin
	} from '@/page/mainPage/mixins/index';
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import {
		urlPath,
		urlwsPath,
		htmlescpe,
		allenglish,
		allchinese
	} from '@/page/mainPage/utils/base';
	import $ from '@/page/mainPage/assets/js/jquery-vendor';
	import '@/page/mainPage/assets/js/jquery.danmu';
	import echarts from 'echarts'
	export default {
		mixins: [IndexMixin],
		components: {
			notice,
			progressbox,
			dropmenu,
			search,
			load,
			board,
			timeswiper,
			vSelect,
			toolbar
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
				isanalysis: false, //语音解析
				txtlist: [], //语音解析文本
				onlinedirectBroadcastCode: '', //直播间code
				isResult: false, //是否显示统计结果
				subjecttitle: '1', //题型
				subjectType: 0, //0 普通 1 语音
				settrueanswer: '', //正确答案
				score: 5, //分数
				isSubject: true, //是否显示题目
				isAddSubject: false, //是否添加题目
				isStop: false, //是否显示结束按钮
				myChart: null,
				myCorrectChart: null,
				reftitletype: 1, //语言测评类型
				titletypeList: [{
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
				subjectitleList: [{
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
				yysubjectitleList: [{
					name: '语音识别',
					value: '6'
				}, {
					name: '语音测评',
					value: '7'
				}, {
					name: '麦克风',
					value: '8'
				}, {
					name: '跟读测评',
					value: '9'
				}],
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
				rate: 50,
				isAnswering: false, //是否正在答题
				isunbind: false, //是否解绑
				ubindParams: {}, //解绑参数
				selectAnswer: [],
				isshowselectNamelist: false,
				selectNamelist: [],
				/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
				titlenamelist: [{
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
				iscountDown: false,
				showcountDown: false,
				isrankboradlist: false, //是否显示语音测评结果
				rankboradlist: [], //语音测评排名
				xianshenglist: this.selectWordList, //先声题库数据
				XSquestionType: 0, //先声题库类型
				XStalkName: null,
				xsAudioUrl: '', //音频文件地址
				isPlay: false, //是否播放音频
			};
		},
		computed: {
			// ...mapState(['platformpath', 'interactiopath', 'foundationpath'])
			...mapState(['platformpath', 'interactiopath', 'foundationpath', 'isminimizeAppState', 'directBroadcastCode',
				'selectWordList', 'selectSentenceList'
			]),
			...mapGetters(['getisminimizeApp', 'onEvent']),
			// alertCont() {
			// 	return this.$store.getters.onEvent();
			// },
			checkbindStu() {
				if (this.namelist && this.namelist.length > 0) {
					return this.namelist.filter(item => item.checked).length;
				} else {
					return 0;
				}
			},
			// 		selectAnswerStr() {
			// 			return this.selectAnswer.sort().join('');
			// 		},
			selectAnswerStr() {
				return this.checklist
					.filter(item => item.ischeck)
					.map(item => item.name)
					.sort()
					.join('');
			},
			countDownList() {
				//return `${fixedZero(h)}:${fixedZero(m)}:${fixedZero(s)}`;
				return (
					fixedZero(Math.floor((this.countDownTime / 60 / 60) % 24)) +
					':' +
					fixedZero(Math.floor((this.countDownTime / 60) % 60)) +
					':' +
					fixedZero(Math.floor(this.countDownTime % 60))
				);
			}
		},
		created() {
			this.sendInfo = JSON.parse(this.$route.query.sendInfo);
			//console.log(this.$route.query.sendInfo)
			// this.onlinedirectBroadcastCode = this.sendInfo.directBroadcastCode;
			this.$store.commit('SET_startClass', true);
			this.$electron.ipcRenderer.send('onlinedirebro', true);
			this.getNamelist('bingingCard/getAllBingdCardInfo');
			this.getjson();

		},

		mounted() {
			this.$nextTick(() => {
				this.myChart = echarts.init($('#myChart')[0]);
				this.myCorrectChart = echarts.init($('#myCorrectChart')[0]); //初始化echart
			})
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
				audio.addEventListener('ended', function() {
					console.log('停止播放音乐')
					$me.isPlay = false;
				}, false);
			}
			/* 接受websock   */
		  this.onmessage();
		},
		watch: {
			isshowNamelist: function(newval, oldval) {
				const $me = this;
				if (newval) {
					if ($me.onlinedirectBroadcastCode && $me.isshowNamelist) {
						$me.getOnlinelist({
							code: $me.onlinedirectBroadcastCode
						});
					}
				}
			},
			/* getisminimizeApp(newValue, oldValue) {
				if (newValue != oldValue) {
					if (!this.isminimizeAppState && this.isAnswering) {
						if ($('#danmu').data('paused') == 1) {
							$('#danmu').danmu('danmuResume');
						}
					} else {
						$('#danmu').danmu('danmuPause');
					}
				}
			}, */
			talkName(newValue, oldValue) {
				if (newValue != oldValue) {
					var maxnum = this.reftitletype == 4 ? 50 : 70;
					console.log('this.reftitletype' + this.reftitletype);
					if (this.talkName.length > maxnum) {
						this.talkName = this.talkName.slice(0, maxnum);
						this.$toast.center(`题目长度不能大于${maxnum}`);
					}
				}
			},

			checklist: {
				handler(newName, oldName) {
					const $me = this;
					if ($me.subjecttitle == 3) {
						var option = $me.myCorrectChart.getOption();
						//console.log(option);
						for (var i = 0; i < $me.checklist.length; i++) {
							if ($me.checklist[i].ischeck) {
								$me.colorList[i] = '#FF999A';
							} else {
								$me.colorList[i] = '#59ADF3';
							}
						}
						$me.myCorrectChart.setOption(option);
					}
				},
				deep: true
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				// immediate: true
			},
			onEvent: {
				handler(newName, oldName) {
					if (newName && newName != oldName)
						console.log("112121111newName:" + JSON.stringify(newName));
				},
				immediate: true
			}
		},
		methods: {
			exitBtn() {
				const $me = this;
				var param = {
					code: this.onlinedirectBroadcastCode
				};
				this.$loading('正在退出...');
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/stopDireBro',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: JSON.stringify(param)
				}).then(da => {
					/* 关闭webscoket */
					$me.$loading.close();
					if (this.ws) {
						this.ws.close(); //离开路由之后断开websocket连接
					}
					/* 跳转到选择直播间页面 */
					this.$router.go(-1); //返回上一层
				});
				setTimeout(function() {
					$me.$loading.close();
				}, 5000);
			},
			getAnswer() {
				const $me = this;
				if ('WebSocket' in window) {
					if (!$me.ws) {
						// 打开一个 web socket
						$me.ws = new WebSocket(urlwsPath + 'teacher-client/websocket');
						$me.ws.onopen = function() {};
						$me.ws.onmessage = function(evt) {
							var received_msg = evt.data;
							if (received_msg != '连接成功') {
								var msg = JSON.parse(received_msg);
								var obj = msg.data;
								switch (msg.reqType) {
									case 0:
										{
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
												$('#danmu').danmu('addDanmu', [{
													text: obj.stuName,
													color: 'white',
													size: 0,
													position: 0,
													time: time
												}]);
											}
											break;
										}
									case 1:
										{
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
									case 4:
										{
											if (msg.order == 'START_BUSINESS_TYPE_10') {
												var obj = msg.data;
												$me.stuName = obj.stuName;
												$me.ismicrophone = true;
											}
											break;
										}
									case 6:
										{
											$me.chartDate.title.push(msg.data.className);
											$me.chartDate.agreeNumber.push(msg.data.agreeNumber);
											$me.chartDate.disagreeNumber.push(msg.data.disagreeNumber);
											$me.chartDate.unAnswerNum.push(msg.data.unAnswerNum);
											var option = [{
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
									case 7:
										{
											/* 语音测评 */
											$me.ismicrophone = false;
											var obj = msg.data;

											var time = $('#danmu').data('nowTime') + 1;
											/*当渲染弹幕过多的时候,延迟处理弹幕*/
											if ($('#danmu .danmaku').length > 500) {
												time += 200; //2000毫秒。
											}
											var answer = obj.score;
											$('#danmu').danmu('addDanmu', [{
												text: obj.stuName + '(' + answer + ')',
												color: 'white',
												size: 0,
												position: 0,
												time: time
											}]);
											break;
										}
									case 8:
										{
											/* 语言解析 */
											$me.ismicrophone = false;
											var obj = msg.data;
											if (obj.ret == 'success') {
												$me.txtlist.push(obj.data);
												$me.$nextTick(function() {
													$('.txtlist').animate({
														scrollTop: $('.txtlist')[0].scrollHeight
													}, 400);
												});
											}
											break;
										}
									case 9:
										{
											var obj = msg.data;
											var stuName = obj.stuName;
											$me.stuName = obj.stuName;
											$me.isparticlesbox = false;
											$me.ismicrophone = true;
											break;
										}
									case 11:
										{
											var obj = msg.data;
											$me.stuName = obj.stuName;
											break;
										}
									case 12:
										{
											/* 网络连接断开 */
											$me.$toast('网络连接断开');
											break;
										}
									case 13:
										{
											/* 网络连接连接 */
											$me.$toast('网络连接成功');
											break;
										}
									case 14:
										{
											/* 网络连接连接 */
											$me.$toast('USB连接断开');
											break;
										}
									case 15:
										{
											/* 网络连接连接 */
											$me.$toast('USB连接成功');
											break;
										}
									case 16:
										{
											/* 随机抽查人 */
											var obj = msg.data;
											$me.stuName = obj.stuName;
											console.log($me.stuName);
											break;
										}
									case 17:
										{
											/* 显示软件 */
											$me.$electron.ipcRenderer.send('maxApp');
											break;
										}
									case 18:
										{
											/* 隐藏软件 */
											$me.$electron.ipcRenderer.send('minApp');
											break;
										}
									case 19:
										{
											/* 停止答题 */
											if ($me.isAnswering) {
												$me.stopRace();
											}
											break;
										}
									case 20:
										{
											/*下一题 */
											if (!$me.isAnswering) {
												$me.nextQuestion();
											}
											break;
										}
									default:
										{
											$me.$toast(msg.data);
											break;
										}
								}
							} else {
								$('#danmu').data('danmuList', {});
								$('#danmu').danmu('danmuStop');
								$('#danmu').danmu('danmuStart');
							}
							//alert("数据已接收...");
						};
						$me.ws.onclose = function() {
							// 关闭 websocket
							//	alert("连接已关闭...");
							$me.ws = null;
						};
					}
				} else {
					// 浏览器不支持 WebSocket
					alert('您的浏览器不支持 WebSocket!');
				}
			},
			/* 开始下发题目 */
			startRace() {
				const $me = this;
				var param = {};
				if ($me.subjectType == 0) {
					var answer = $me.settrueanswer
						.toLocaleUpperCase()
						.split('')
						.sort()
						.join('');
					let answerreg = '';
					if (!$me.subjecttitle) {
						$me.$toast.center('请选择一个题型');
						return false;
					}
					//$me.uuid = $me.randomWord(false, 32);
					if ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3) {
						if ($me.subjecttitle == 1) {
							answerreg = /^[A-D]{1}$/;
						} else if ($me.subjecttitle == 2) {
							answerreg = /^[E-F]{1}$/;
						} else if ($me.subjecttitle == 3) {
							answerreg = /^(?!.*([A-D]).*\1)[A-D]{2,4}$/;
						}
						if (answer && !answerreg.test(answer)) {
							$me.$toast.center('请输入正确答案');
							return false;
						}
						let score = $me.score;
						let integer = /^[0-9]\d*$/; //正整数
						if (!integer.test(score) || score >= 60000) {
							$me.score = '';
							$me.$toast.center('请输入不超过60000整数');
							return false;
						}
						$me.trueAnswer = answer;
						param = {
							trueAnswer: answer,
							score: score,
							impromptu: true
							//uuid: $me.uuid
						};
					} else {
						param = {
							//uuid: $me.uuid
						};
					}
				} else {
					if ($me.subjecttitle == 6) {
						if (!$me.talkquestionType) {
							$me.$toast.center('请选择题目类型');
							return false;
						}
						param = {
							type: $me.talkquestionType
						};
					} else if ($me.subjecttitle == 7) {
						if (!$me.reftitletype) {
							$me.$toast.center('请选择题目类型');
							return false;
						}
						if (!$me.talkName) {
							$me.$toast.center('请选择或输入题目');
							return false;
						}
						if ($me.reftitletype == 3 || $me.reftitletype == 4) {
							if (!allchinese.test($me.talkName)) {
								$me.$toast.center('请输入中文!');
								return;
							}
						} else {
							if (!allenglish.test($me.talkName)) {
								$me.$toast.center('请输入英文!');
								return;
							}
						}
						//$me.uuid = $me.randomWord(false, 32);
						param = {
							type: $me.reftitletype,
							refText: $me.talkName
							//uuid: $me.uuid
						};
					} else if ($me.subjecttitle == 9) {
						if (!$me.XStalkName) {
							$me.$toast.center('请选择题目!');
							return;
						}
						this.xsAudioUrl = "https://data.caidouenglish.com/" + $me.XStalkName.sound_eng_url;
						this.$refs.xsmusic.src = this.xsAudioUrl;
						this.$refs.xsmusic.load();
						param = {
							type: $me.XSquestionType == 0 ? 1 : 2,
							refText: $me.XSquestionType == 0 ? $me.XStalkName.word : $me.XStalkName.text
							//uuid: $me.uuid
						};
					}
				}
				$me.Answerstar(param);
			},
			Answerstar(param) {
				/* 普通题目调用接口 */
				const $me = this;
				var url = '',
					judgetype = '';
				// param = {};
				//const uuid = $me.randomWord(false, 32);
				switch ($me.subjecttitle) {
					case '1':
						{
							judgetype = 1;
							url = 'singleAnswer/start';
							$me.titlename = '单题单选';
							break;
						}
					case '2':
						{
							judgetype = 4;
							url = 'judgeAnswer/start';
							$me.titlename = '判断题';
							break;
						}
					case '3':
						{
							judgetype = 2;
							url = 'sMultiAnswer/start';
							$me.titlename = '单题多选';
							break;
						}
					case '4':
						{
							judgetype = 5;
							url = 'judgeAnswer/start';
							$me.titlename = '主观题';
							break;
						}
					case '5':
						{
							judgetype = 6;
							url = 'redWars/start';
							$me.titlename = '抢红包';
							break;
						}
					case '6':
						{
							url = 'voiceAnswer/startDiscern';
							if ($me.isSatrspeaker) {
								url = 'voiceAnswer/startDiscernAndMicrophone';
							}
							$me.titlename = '语音识别';
							break;
						}
					case '7':
						{
							url = 'voiceAnswer/startAppraisal';
							if ($me.isSatrspeaker) {
								url = 'voiceAnswer/startAppraisalAndMicrophone ';
							}
							$me.titlename = '语音测评';
							break;
						}
					case '8':
						{
							if ($me.iPhoneType == 0) {
								url = 'microphone/start';
								$me.titlename = '抢麦';
							} else {
								url = 'microphone/start2';
								$me.titlename = '群发麦克风';
							}
							break;
						}
					case '9':
						{
							url = 'voiceAnswer/startAppraisal';
							if ($me.isSatrspeaker) {
								url = 'voiceAnswer/startAppraisalAndMicrophone ';
							}
							$me.titlename = '跟读测评';
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
						$me.startVIew();
						if ($me.iscountDown) {
							$me.timeDown();
						}
					})
					.catch(function(err) {
						// $me.$loading.close();
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
					/*不是抢红包,语音识别，麦克风 开始弹幕*/
					$('#danmu').data('danmuList', {});
					$('#danmu').danmu('danmuStart');
				}
				if ($me.subjecttitle == 5) {
					if (document.getElementById('music')) {
						document.getElementById('music').play();
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
							$me.reftext = $me.XSquestionType == 0 ? $me.XStalkName.word : $me.XStalkName.text;
						}

						if ($me.isSatrspeaker) {
							$me.ismicrophone = true;
						}
					}
					//$me.isparticlesbox = true;
				}
			},
			clearView(){
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
			},
			stopRace() {
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
				if ($me.subjecttitle == 4 || $me.subjecttitle == 6 || $me.subjecttitle == 7 || $me.subjecttitle == 8) {
					//查询主观题统计----从webscoket返回
					$me.Answerstop();
				} else if ($me.subjecttitle == 5) {
					$me.redWarslist(urlPath);
				} else {
					$me.getspeedlist(urlPath);
				}
			},
			Answerstop() {
				/* 结束答题 */
				var url = '';
				const $me = this;
				switch ($me.subjecttitle) {
					case '1':
						{
							url = 'singleAnswer/stop';
							break;
						}
					case '3':
						{
							url = 'sMultiAnswer/stop';
							break;
						}
					case '5':
						{
							url = 'redWars/stop';
							break;
						}
					case '6':
						{
							/*停止语音 */
							url = 'voiceAnswer/stop';
							break;
						}
					case '7':
						{
							/*停止语音测评 */
							url = 'voiceAnswer/stop';
							break;
						}
					case '8':
						{
							/*停止麦克风 */
							url = 'microphone/stop';
							break;
						}
					case '9':
						{
							/*停止跟读测评 */
							url = 'voiceAnswer/stop';
							break;
						}
					default:
						{
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
						}
						if ($me.trueAnswer && ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3)) {
							$me.getAnswerAccuracy();
						}
						if ($me.subjecttitle == 4) {
							$me.getSubjectiveResult();
						}
						/* 显示语音测评结果 */
						if ($me.subjecttitle == 7 || $me.subjecttitle == 9) {
							$me.getHighScores();
						}
						/* 判断倒计时 */

						if ($me.countDownTime > 0) {
							clearInterval(this.timer);
						}
						$me.countDownTime = 0;
						$me.iscountDown = false;
						$me.showcountDown = false;
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
					var option = [{
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
					var option = [{
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
						percentage = [];
					if (list && list.length > 0) {
						list.forEach(item => {
							title.push(item.answer);
							data.push(item.count);
							percentage.push(item.percentage);
						});
					}
					//var title = Object.keys(list);
					//var data = title.map(item => list[item]);
					$me.getCorrectChartData({
						title,
						data,
						percentage
					});
				});
			},
			/*获取答题 柱状图chart*/
			getCorrectChartData(myoption) {
				const $me = this;
				var fontSize = $me.getDpr();
				$me.isCorrectchart = true;
				var title = myoption.title;
				var mydata = myoption.data;
				var percentage = myoption.percentage;
				$me.checklist = title
					.filter(item => item != '未作答')
					.map(item => {
						return {
							name: item,
							ischeck: false
						};
					});
				var defaultcolor = ['#FF999A', '#59ADF3', '#AF89D6', '#af89d6'];
				$me.colorList = [];
				if (title && title.length > 0) {
					$me.colorList = title.map((item, i) => {
						if ($me.subjecttitle == 4) {
							return defaultcolor[i];
						} else {
							if (title[i] == ($me.trueAnswer == 'F' ? '×' : $me.trueAnswer == 'E' ? '√' : $me.trueAnswer) && ($me.subjecttitle ==
									1 || $me.subjecttitle == 2)) {
								return '#ff999a';
							}
							if (item == '未作答') {
								return '#AF89D6';
							}
							return '#59ADF3';
						}
					});
				}
				let option = {
					color: ['#59ADF3', '#FF999A', '#AF89D6', '#af89d6'],
					grid: {
						x: 110,
						y: 20,
						x2: 25,
						y2: 45
					},
					xAxis: {
						type: 'category',
						data: title,
						axisLine: {
							lineStyle: {
								color: '#ccc'
							}
						},
						axisLabel: {
							fontSize: fontSize > 24 ? 20 : fontSize,
							backgroundColor: '#fff',
							color: '#5793f3',
							borderRadius: 4,
							borderColor: '#5793f3',
							borderWidth: 1,
							padding: [3, 10, 3, 10],
							interval: 0
						}
						/* ,
						triggerEvent:true */
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#ccc'
							}
						},
						axisLabel: {
							formatter: ['{value}人'].join('\n'),
							fontSize: fontSize > 24 ? 20 : fontSize,
							backgroundColor: '#fff',
							color: '#5793f3',
							borderRadius: 4,
							borderColor: '#5793f3',
							borderWidth: 1,
							padding: [3, 10, 3, 10],

						},
						minInterval: 1
					},
					series: [{
						data: mydata,
						type: 'bar',
						barWidth: 80,
						label: {
							normal: {
								show: true,
								position: 'inside',
								color: '#fff',
								formatter: function(param) {
									if (param.value == 0) {
										return 0;
									} else {
										return param.value + '人\n(' + percentage[param.dataIndex] + '%)';
									}
								},
								textStyle: {
									fontSize: 20
								}
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									return $me.colorList[params.dataIndex];
								},
								barBorderRadius: [8, 8, 0, 0]
							}
						}
					}]
				};
				if (title.length > 5) {
					option.dataZoom = [{
							show: true,
							start: 0,
							end: 50
						},
						{
							type: 'inside',
							start: 0,
							end: 50
						}
					];
				}
				$me.myCorrectChart = echarts.init($('#myCorrectChart')[0]);
				$me.myCorrectChart.setOption(option);
				setTimeout(function() {
					$me.myCorrectChart.resize();
				}, 200);
				$me.myCorrectChart.off('click');
				$me.selectAnswer = [];
				$me.myCorrectChart.on('click', function(param) {
					/* if(param.componentType == "xAxis"){
						console.log("单击了"+param.value+"x轴标签");
					}else{ */
					if ($me.subjecttitle == 3) {
						if (title[param.dataIndex] == '未作答') {
							$me.getEveryAnswerName({
								answer: title[param.dataIndex]
							});
						} else {
							if ($me.colorList[param.dataIndex] == '#FF999A') {
								//$me.colorList[param.dataIndex] = '#61a0a8';
								$me.checklist[param.dataIndex].ischeck = false;
							} else {
								//$me.colorList[param.dataIndex] = '#ff999a';
								$me.checklist[param.dataIndex].ischeck = true;
							}
						}
						//$me.myCorrectChart.setOption(option);
					} else {
						$me.getEveryAnswerName({
							answer: title[param.dataIndex]
						});
						//$me.getEveryAnswerName({ answer:$me.trueAnswer });
					}
					// }
				});
			},
			/* 正确率显示 */
			getCorrectChartpieData(myoption) {
				const $me = this;
				$me.isChart = true;
				var List = myoption;
				var title = [];
				for (var i = 0; i < List.length; i++) {
					title.push(List[i].name);
				}
				var fontSize = $me.getDpr();
				let option = {
					// 				legend: {
					// 					x: 'center',
					// 					y: 'bottom',
					// 					textStyle: {
					// 						color: '#5793f3'
					// 					},
					// 					data: title
					// 				},
					color: ['#FF999A', '#59ADF3', '#AF89D6', '#af89d6'],
					series: [{
						name: '正确率',
						type: 'pie',
						radius: ['35%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									//console.log(params);
									return params.name + params.value + '人\n(' + params.percent + '%)';
								},
								textStyle: {
									fontSize: fontSize > 18 ? 18 : fontSize
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}]
				};
				option.series[0].data = myoption;
				// if(!$me.myChart){
				// 	$me.myChart = echarts.init($('#myChart')[0]);
				// }
				$me.myChart = echarts.init($('#myChart')[0]);
				$me.myChart.setOption(option);
				//console.log(option)
				setTimeout(function() {
					$me.myChart.resize();
				}, 200);
				$me.myChart.off('click');
				$me.myChart.on('click', function(param) {
					if (title[param.dataIndex] == '正确') {
						$me.getEveryAnswerName({
							answer: $me.trueAnswer
						});
					} else {
						$me.getFalseAnswerName({
							answer: $me.trueAnswer
						});
					}
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
				$me.isreftext = false; //语音测评
				$me.isanalysis = false; //语音解析
				$me.txtlist = []; //语音解析文本
				$me.isSubject = false; //是否显示题目
				$me.isAddSubject = false; //是否添加题目
				$me.isStop = false; //是否显示结束按钮
				$me.isSendtitle = false;
				// $me.isparticlesbox = false;
				$me.isprogress = false; //隐藏进度条
				$me.rate = 0;
				$me.settrueanswer = '';
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
			},
			/* 切换语言测评类型 */
			changeTitleType(obj) {
				const $me = this;
				const type = ($me.reftitletype = obj.value);
				$me.talkName = '';
				try {
					if (type == 1) {
						$me.reftitletypelist = $me.alltxtlist['enWord'];
					} else if (type == 2) {
						$me.reftitletypelist = $me.alltxtlist['enSentence'];
					} else {
						$me.reftitletypelist = $me.alltxtlist['cnSentence'];
					}
				} catch (e) {
					$me.reftitletypelist = [];
				}
			},
			/* 选择语言测评题目 */
			selTalkName(talk) {
				const $me = this;
				$me.talkName = talk;
			},
			/* 下发题目 隐藏统计结果 显示题目 */
			sendtitle() {
				const $me = this;
				$me.clear();
				$me.isSubject = true;
				$me.titlename = '';
				$me.trueAnswer = '';
				$me.stuName = ''; //麦克风学生名称
				$me.isSatrspeaker = false; //是否开启扬声器
			},
			/* 切换题型 */
			chooSesubjectType(type) {
				const $me = this;
				$me.subjectType = type;
				if ($me.subjectType == 0) {
					$me.subjecttitle = '1';
					$me.onesubjectitle = $me.subjectitleList[0];
				} else {
					$me.subjecttitle = '6';
					$me.talkquestionType = 7;
				}
			},
			/* 切换普通题型 */
			selSubjecttitle(obj) {
				//console.log(obj)
				this.subjecttitle = obj.value;
				this.settrueanswer = '';
			},
			/* 切换语音题型 */
			chooseSubjecttitle(obj) {
				this.subjecttitle = obj.value;
				const $me = this;
				if ($me.subjecttitle == 6) {
					$me.talkquestionType = 7;
				} else if ($me.subjecttitle == 7) {
					$me.reftitletype = '1';
					$me.onetitletype = $me.titletypeList[0];
					$me.talkName = '';
					try {
						$me.reftitletypelist = $me.alltxtlist['enWord'];
					} catch (e) {
						$me.reftitletypelist = [];
					}
				} else if ($me.subjecttitle == 8) {
					$me.iPhoneType = 0;
				} else if ($me.subjecttitle == 9) {
					$me.XSquestionType = 0;
					$me.xianshenglist = $me.selectWordList;
				}
			},
			/* 主观题统计 */
			getChartData(myoption, title) {
				const $me = this;
				$me.isChart = true;
				var List = myoption;
				var title = [];
				List.map(function(item) {
					title.push(item.name);
				});
				var fontSize = $me.getDpr();
				let option = {
					// 				legend: {
					// 					x: 'center',
					// 					y: 'bottom',
					// 					textStyle: {
					// 						color: '#5793f3'
					// 					},
					// 					data: title
					// 				},
					color: ['#FF999A', '#59ADF3', '#AF89D6', '#af89d6'],
					series: [{
						name: '主观题统计',
						type: 'pie',
						radius: ['30%', '70%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									//console.log(params);
									return params.name + params.value + '人\n(' + params.percent + '%)';
								},
								textStyle: {
									fontSize: fontSize > 18 ? 18 : fontSize
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}]
				};
				option.series[0].data = myoption;
				$me.myChart = echarts.init($('#myChart')[0]);
				$me.myChart.setOption(option);
				setTimeout(function() {
					$me.myChart.resize();
				}, 200);
				$me.myChart.off('click');
				$me.myChart.on('click', function(param) {
					$me.getEveryAnswerName({
						answer: title[param.dataIndex]
					});
				});
			},
			uploadfile() {
				const $me = this;
				var file = $('#upload')[0];
				var FileExt = $('#upload')
					.val()
					.replace(/.+\./, ''); //正则表达式获取后缀
				if (FileExt != 'xls' && FileExt != 'xlsx') {
					$me.$toast.center('请上传excel文件');
					return false;
				}
				if (file.files[0]) {
					var formData = new FormData();
					formData.append('file', file.files[0]);
					formData.append('teacAssistantCode', $me.sendInfo.teacAssistantCode);
					formData.append('teacAssistantName', $me.sendInfo.teacAssistantName);
					this.$http({
						method: 'post',
						url: urlPath + '/teacher-client/platform/importVoiceQuesrions',
						data: formData,
						processData: false, // jQuery不要去处理发送的数据
						contentType: false
					}).then(da => {
						if (da.data.ret == 'success') {
							//showMessage('上传成功')
							$me.$toast.center('上传成功');
							$me.getjson();
						} else {
							$me.$toast.center('上传失败');
						}
					});
					file.value = '';
				}
			},
			getjson() {
				const $me = this;
				this.$http({
					method: 'post',
					url: urlPath + '/teacher-client/platform/selectVoiceQuestions',
					data: JSON.stringify({
						teacAssistantCode: $me.sendInfo.teacAssistantCode,
						teacAssistantName: $me.sendInfo.teacAssistantName
					}),
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					}
				}).then(da => {
					$me.alltxtlist = da.data.data;
					const type = $me.reftitletype;
					try {
						if (type == 1) {
							$me.reftitletypelist = $me.alltxtlist['enWord'];
						} else if (type == 2) {
							$me.reftitletypelist = $me.alltxtlist['enSentence'];
						} else {
							$me.reftitletypelist = $me.alltxtlist['cnSentence'];
						}
					} catch (e) {
						$me.reftitletypelist = [];
					}
				});
			},
			/* 一键解绑学生名单 */
			unBindStu() {
				const $me = this;
				$me.isunbind = false;

				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/bingingCard/unBind',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: JSON.stringify($me.ubindParams)
				}).then(da => {
					if (da.data.ret == 'success') {
						$me.$toast.center('解绑成功');
						/* 刷新名单 */
						$me.getNamelist('bingingCard/getAllBingdCardInfo');
					} else {
						$me.$toast.center('解绑失败');
					}
				});
			},
			/* 解绑一个学生 */
			unBindOneStu(stu) {
				const $me = this;
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
				$me.isunbind = true;
				$me.unbindtext = '确定解绑' + stu.stuName + '吗？';
				$me.ubindParams = {
					stuCodes: [stu.stuCode]
				};
			},
			/* 解绑选中学生 */
			unbindCheckedStu() {
				const $me = this;
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
				var list = [];
				if ($me.namelist && $me.namelist.length > 0) {
					list = $me.namelist
						.filter(item => {
							return item.checked;
						})
						.map(item => item.stuCode);
				}
				if (list.length > 0) {
					$me.isunbind = true;
					$me.unbindtext = '确定解绑选中学生吗？';
					$me.ubindParams = {
						stuCodes: list
					};
				} else {
					$me.$toast.center('请至少选择一个学生');
				}
			},
			/* 解绑所有学生名单吗 */
			unBindAllStu() {
				const $me = this;
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
				$me.isunbind = true;
				$me.unbindtext = '确定解绑所有学生名单吗？';
				$me.ubindParams = {
					classCode: $me.sendInfo.classCode
				};
			},
			/* 选中一个学生 */
			checkOneStu(item) {
				const $me = this;
				if (item.state != 0) {
					item.checked = !item.checked;
				}
			},
			/* 全选 */
			checkAll() {
				const $me = this;
				if ($me.namelist && $me.namelist.length > 0) {
					$me.namelist.forEach(item => {
						if (item.state == 1) {
							item.checked = true;
						}
					});
				}
			},
			/* 全不选 */
			uncheckAll() {
				const $me = this;
				if ($me.namelist && $me.namelist.length > 0) {
					$me.namelist.forEach(item => {
						if (item.state == 1) {
							item.checked = false;
						}
					});
				}
			},
			/* 获取选项答题人数 */
			getEveryAnswerName(param) {
				const $me = this;
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/statistics/getEveryAnswerName',
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
			getFalseAnswerName(param) {
				const $me = this;
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/statistics/getFalseAnswerName',
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
				$me.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/nextQuestion'
				}).then(da => {
					if (da.data.ret == 'success') {
						console.log('下一题' + JSON.stringify(da));
						/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
						$me.trueAnswer = da.data.data.trueAnswer;
						$me.titlename = '第' + da.data.data.questionId + '题<br>' + $me.titlenamelist[da.data.data.questionType - 1].titlename;
						$me.subjecttitle = $me.titlenamelist[da.data.data.questionType - 1].subjecttitle;
						$me.startVIew();
						if ($me.iscountDown) {
							$me.timeDown();
						}
					} else {
						$me.$toast.center(da.data.message);
					}
				});
			},
			/* 上一题 */
			prevQuestion() {
				const $me = this;
				$me.$http({
					method: 'post',
					url: urlPath + 'teacher-client/common/prevQuestion'
				}).then(da => {
					if (da.data.ret == 'success') {
						console.log('上一题' + JSON.stringify(da));
						/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
						$me.trueAnswer = da.data.data.trueAnswer;
						$me.titlename = '第' + da.data.data.questionId + '题<br>' + $me.titlenamelist[da.data.data.questionType - 1].titlename;
						$me.subjecttitle = $me.titlenamelist[da.data.data.questionType - 1].subjecttitle;
						$me.startVIew();
						if ($me.iscountDown) {
							$me.timeDown();
						}
					} else {
						$me.$toast.center(da.data.message);
					}
				});
			},
			/* 语音测评统计 */
			getHighScores() {
				const $me = this;
				$me.$http({
					method: 'post',
					url: urlPath + 'teacher-client/statistics/getHighScores'
				}).then(da => {
					if (da.data.ret == 'success') {
						$me.isrankboradlist = true;
						$me.rankboradlist = da.data.data;
					} else {
						$me.$toast.center(da.data.message);
					}
				});
			},
			/* 设置倒计时 */
			countDown(time) {
				this.countDownTime = time;
				this.showcountDown = false;
			},
			cancelcountDown() {
				this.showcountDown = false;
			},
			/* 开始计时 */
			timeDown() {
				this.showcountDown = false;
				if (this.countDownTime > 0) {
					this.timer = setInterval(() => {
						this.countDownTime--;
						if (this.countDownTime <= 0) {
							this.countDownTime = 0;
							clearInterval(this.timer);
							this.stopRace();
						}
					}, 1000);
				} else {
					this.countDownTime = 0;
					this.stopRace();
				}
			},
			checkcountDown() {
				if (this.isAnswering) {
					return false;
				}
				this.countDownTime == 0;
				if (this.iscountDown) {
					this.iscountDown = false;
					this.showcountDown = false;
					if (this.timer) {
						clearInterval(this.timer);
					}
				} else {
					this.iscountDown = true;
					this.showcountDown = true;
				}
			},
			checkshowcountDown() {
				if (this.isAnswering) {
					return false;
				}
				this.showcountDown = !this.showcountDown;
			},
			/* 切换先声题库类型 */
			changeXSquestionType() {

				if (this.XSquestionType == 0) {
					this.xianshenglist = this.selectWordList;
				} else {
					this.xianshenglist = this.selectSentenceList;
				}
				this.XStalkName = null;
				// console.log(this.xianshenglist)
			},
			/* 播放音频 */
			startAudio() {
				// console.log('开始播放音乐')
				// console.log(this.xsAudioUrl);
				const $me = this;
				if (document.getElementById('xsmusic')) {
					document.getElementById('xsmusic').play();
					$me.isPlay = true;
				}
			},
			onmessage() {
				let $me = this;
				/* 连接websock */
				this.$store.dispatch('STAFF_WEBSOCKET')
				console.log(this.$store.getters.STAFF_UPDATE);
				this.$store.getters.STAFF_UPDATE.onmessage = function(evt) {
					var received_msg = evt.data;
					console.log(received_msg)
					if (received_msg != '连接成功') {
						var msg = JSON.parse(received_msg);
						var obj = msg.data;
						switch (msg.reqType) {
							case 0:
								{
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
										$('#danmu').danmu('addDanmu', [{
											text: obj.stuName,
											color: 'white',
											size: 0,
											position: 0,
											time: time
										}]);
									}
									break;
								}
							case 1:
								{
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
							case 4:
								{
									if (msg.order == 'START_BUSINESS_TYPE_10') {
										var obj = msg.data;
										$me.stuName = obj.stuName;
										$me.ismicrophone = true;
									}
									break;
								}
							case 6:
								{
									$me.chartDate.title.push(msg.data.className);
									$me.chartDate.agreeNumber.push(msg.data.agreeNumber);
									$me.chartDate.disagreeNumber.push(msg.data.disagreeNumber);
									$me.chartDate.unAnswerNum.push(msg.data.unAnswerNum);
									var option = [{
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
							case 7:
								{
									/* 语音测评 */
									$me.ismicrophone = false;
									var obj = msg.data;

									var time = $('#danmu').data('nowTime') + 1;
									/*当渲染弹幕过多的时候,延迟处理弹幕*/
									if ($('#danmu .danmaku').length > 500) {
										time += 200; //2000毫秒。
									}
									var answer = obj.score;
									$('#danmu').danmu('addDanmu', [{
										text: obj.stuName + '(' + answer + ')',
										color: 'white',
										size: 0,
										position: 0,
										time: time
									}]);
									break;
								}
							case 8:
								{
									/* 语言解析 */
									$me.ismicrophone = false;
									var obj = msg.data;
									if (obj.ret == 'success') {
										$me.txtlist.push(obj.data);
										$me.$nextTick(function() {
											$('.txtlist').animate({
												scrollTop: $('.txtlist')[0].scrollHeight
											}, 400);
										});
									}
									break;
								}
							case 9:
								{
									var obj = msg.data;
									var stuName = obj.stuName;
									$me.stuName = obj.stuName;
									$me.isparticlesbox = false;
									$me.ismicrophone = true;
									break;
								}
							case 11:
								{
									var obj = msg.data;
									$me.stuName = obj.stuName;
									break;
								}
							case 12:
								{
									/* 网络连接断开 */
									$me.$toast('网络连接断开');
									break;
								}
							case 13:
								{
									/* 网络连接连接 */
									$me.$toast('网络连接成功');
									break;
								}
							case 14:
								{
									/* 网络连接连接 */
									$me.$toast('USB连接断开');
									break;
								}
							case 15:
								{
									/* 网络连接连接 */
									$me.$toast('USB连接成功');
									break;
								}
							case 16:
								{
									/* 随机抽查人 */
									var obj = msg.data;
									$me.stuName = obj.stuName;
									console.log($me.stuName);
									break;
								}
							case 17:
								{
									/* 显示软件 */
									$me.$electron.ipcRenderer.send('maxApp');
									break;
								}
							case 18:
								{
									/* 隐藏软件 */
									$me.$electron.ipcRenderer.send('minApp');
									break;
								}
							case 19:
								{
									/* 停止答题 */
									if ($me.isAnswering) {
										$me.stopRace();
									}
									break;
								}
							case 20:
								{
									/*下一题 */
									// $me.clearView();
									$me.nextQuestion();
									break;
								}
							case 21:
								{
									/*上一题 */
									// $me.clearView();
									$me.prevQuestion();
									break;
								}
							default:
								{
									$me.$toast(msg.data);
									break;
								}
						}
					} else {
						$('#danmu').data('danmuList', {});
						$('#danmu').danmu('danmuStop');
						$('#danmu').danmu('danmuStart');
					}
				}
			}
		}
	};
</script>

<style scoped="scoped">
	.commonroom {
		width: 500px;
		margin-bottom: 20px;
	}

	.mb20 {
		margin-bottom: 20px;
	}

	.modbox.subject {
		position: absolute;
		top: 0;
		left: 50%;
		width: 600px;
		margin-left: -300px;
		z-index: 999;
		padding-top: 10%;
	}

	@media screen and (max-height:720px) {
		.modbox.subject {
			padding-top: 6%;
		}
	}

	.modbox.subject .startBtn {
		width: 500px;
	}

	.commonroom .warn {
		color: #f00;
		font-size: 26px;
		text-align: center;
		margin-top: 10px;
		/* margin-bottom: -10px; */
	}

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
		bottom: 40px;
		width: 270px;
		z-index: 9999;
	}

	.bounce-enter-active {
		animation: bounceInDown .5s;
	}

	.bounce-leave-active {
		animation: bounceInDown .5s reverse;
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
		padding-top: 11px;
		box-sizing: border-box;
		z-index: 999;
	}

	.sound {
		width: 21px;
		height: 21px;
		padding: 1px 0 0 7px;
		display: inline-block;
		cursor: pointer;
		vertical-align: middle;
	}

	.sound>span {
		margin-right: 15px;
		background-repeat: no-repeat;
		background-image: url(../../assets/index.png);
		background-position: 0 -1046px;
		height: 17px;
		width: 19px;
		display: block;
	}

	.sound.active {
		background-image: url(../../assets/notice.gif);
		background-image: url(../../assets/notice2.gif)\9;
		-webkit-background-size: 22px 21px;
		-moz-background-size: 22px 21px;
		background-size: 22px 21px;
		background-repeat: no-repeat;
		background-position: 7px -2px;

	}

	.sound.active>span {
		background: none;
	}
</style>

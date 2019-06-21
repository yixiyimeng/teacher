<template>
	<div>
		<audio id="music" :src="platformpath + '/teacher-platform/files/test.mp3'" crossOrigin="anonymous" preload></audio>
		<div class="bottommenu">
			<!-- <a href="javascript:;" class="prev">
				<i></i>
			</a> -->
			<a href="javascript:;" class="start" @click="startRace" v-show="isSubject && isAddSubject"></a>
			<a href="javascript:;" class="stopBtn" @click="stopRace" v-if="isStop"></a>
			<a href="javascript:;" class="send" @click="sendtitle" v-show="isSendtitle"></a>
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
						<i :class="item.state == 0 ? 'warn' : 'success'" @click="item.checked = !item.checked"></i>
						<span @click="item.checked = !item.checked">{{ item.stuName }}</span>
						<img src="../../assets/jiebang.png" alt="" v-if="item.state == 1" @click="unBindOneStu(item)" />
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
						<span>{{ item.stuName }}</span>
					</li>
				</ul>
			</div>
		</div>
		<load :isprogress="isprogress" :rate="rate"></load>
		<!-- 显示答案 -->
		<notice :titlename="titlename" class=" animated fast" :class="[titlename ? 'slideInDown' : 'slideOutUp']"></notice>
		<div class="namelist">
			<div class="setting-drawer-index-handle" @click="isshowNamelist = !isshowNamelist" title="名单"><img src="../../assets/userlist.png" alt="" /></div>
			<div class="swiper-container" style="height: 100%; overflow: auto;">
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" style="cursor: pointer;" title="解绑">
						<i :class="item.state == 0 ? 'warn' : 'success'"></i>
						<span>{{ item.stuName }}</span>
						<img src="../../assets/jiebang.png" alt="" v-if="item.state == 1" style="width: 20px; height: 20px;" @click="unBindOneStu(item)" />
					</li>
				</ul>
			</div>
			<div @click="unBindAllStu" class="setting-drawer-index-handle unbind" title="解绑"><img src="../../assets/jiebang.png" alt="" /></div>
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
				<div class="stuname" v-if="stuName">
					<img src="../../assets/icon2.png" />
					<p>{{ stuName }}</p>
				</div>
				<img src="../../assets/audio.png" />
			</div>
			<!-- 语音文本显示 -->
			<div class=" bounceInDown animated" v-if="isreftext">
				<div class="reftext ">
					<div>{{ reftext }}</div>
				</div>
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
		</div>
		<!-- 结果 -->
		<div class="resultbox " v-show="isResult">
			<div class="flex flex-v flex-align-center" style="height: 100%;">
				<div class="rank" v-if="isRank" :class="{ top: isCorrectchart }">
					<div class="rankitem bounceIn animated" v-for="(item, index) in ranklist">
						<p>{{ item.stuName }}</p>
						<p class="score">第{{ index + 1 }}名</p>
					</div>
				</div>
				<div class="flex-1" style="width: 80%; margin: 0 auto; ">
					<!-- 主观题统计 -->
					<div class="chart" style="height:90%;width: 50%; margin:2% auto; float: left;" v-show="isChart">
						<div id="myChart" style="height:100%; min-height: 100px;"></div>
					</div>
					<!-- 正确率统计 -->
					<div class="Correctchart" style="height:90%; width: 50%; margin: 2% auto;float: left; text-align: center;" v-show="isCorrectchart">
						<div id="myCorrectChart" style="height:100%; min-height:100px;"></div>
						<a
							style="text-align: center; color: rgb(24, 114, 255);"
							href="javascript:;"
							v-if="selectAnswerStr"
							@click="getEveryAnswerName({ answer: selectAnswerStr })"
						>
							查看选择{{ selectAnswerStr }}人员名单
						</a>
					</div>
				</div>
				<!-- <a class="sendtitle" href="javascript:;" @click="sendtitle" v-show="isSendtitle">下发题目</a> -->
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

					<input type="password" name="" id="" value="" autocomplete="off" class="trueanswer" v-model="settrueanswer" placeholder="请输入正确答案" />
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
					<li v-for="item in yysubjectitleList" class="flex-1" :key="item.value" :class="{ active: item.value == subjecttitle }" @click="chooseSubjecttitle(item)">
						<i></i>
						<p>{{ item.name }}</p>
					</li>
				</ul>

				<div class="fromcontrol flex" v-if="subjecttitle == 6">
					<label>题目类型</label>
					<div style="display:inline-block;  font-size:20px;vertical-align: top;">
						<label style="width:6em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkquestionType" value="7" v-model="talkquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>英文识别</span>
						</label>
						<label style="width:6em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="talkquestionType" value="8" v-model="talkquestionType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>中文识别</span>
						</label>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 7">
					<label>题目类型</label>

					<search :searchList="titletypeList" placeholdertxt="请选择题型" @selectFunc="changeTitleType" class="flex-1" :selectValue="onetitletype"></search>
				</div>
				<div class="flex flex-align-center" v-if="subjecttitle == 7">
					<div class="fromcontrol flex flex-1">
						<label>题目</label>
						<div class="flex-1" style="margin-right: 60px;">
							<input type="text" name="" value="" autocomplete="off" v-model.trim="talkName" style="width: 100%;" />
							<dropmenu :reftitletypelist="reftitletypelist" @selTalkName="selTalkName"></dropmenu>
						</div>
						
					</div>
					<div class="uploadbox">
						<input type="file" name="" value="" id="upload" @change="uploadfile" />
						<span>上传题目</span>
					</div>
				</div>
				<div class="fromcontrol flex" v-if="subjecttitle == 8">
					<label>题目类型</label>
					<div style="display:inline-block; font-size:20px;vertical-align: top;">
						<label style="width:5em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="iPhoneType" value="0" v-model="iPhoneType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>抢麦</span>
						</label>
						<label style="width:8em;text-align:left" class="ant-radio-wrapper">
							<span class="ant-radio">
								<input type="radio" name="iPhoneType" value="1" v-model="iPhoneType" />
								<span class="ant-radio-inner"></span>
							</span>
							<span>群发麦克风</span>
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
	</div>
</template>

<script>
import { notice, progressbox, dropmenu, search, load, board } from '@/page/mainPage/components';
import { IndexMixin } from '@/page/mainPage/mixins/index';
import { mapState, mapGetters } from 'vuex';
import { urlPath, urlwsPath, htmlescpe, allenglish, allchinese } from '@/page/mainPage/utils/base';
import $ from '@/page/mainPage/assets/js/jquery-vendor';
import '@/page/mainPage/assets/js/jquery.danmu';
export default {
	mixins: [IndexMixin],
	components: {
		notice,
		progressbox,
		dropmenu,
		search,
		load,
		board
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
			isResult: true, //是否显示统计结果
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
			talkquestionType: '', //语言识别
			isparticlesbox: false, //是否显示开始动画
			isSendtitle: false, //是否显示下发题目
			chartDate: {
				title: [],
				agreeNumber: [],
				disagreeNumber: []
			},
			subjectitleList: [
				{ name: '单题单选', value: '1' },
				{ name: '判断题', value: '2' },
				{ name: '单题多选', value: '3' },
				{ name: '主观题', value: '4' },
				{ name: '抢红包', value: '5' }
			],
			yysubjectitleList: [{ name: '语音识别', value: '6' }, { name: '语音测评', value: '7' }, { name: '麦克风', value: '8' }],
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
			titlenamelist: [
				{ titlename: '单题单选', subjecttitle: '1' },
				{ titlename: '单题多选', subjecttitle: '3' },
				{ titlename: '多题单选', subjecttitle: '0' },
				{ titlename: '判断题', subjecttitle: '2' },
				{ titlename: '主观题', subjecttitle: '4' },
				{ titlename: '抢红包', subjecttitle: '5' }
			]
		};
	},
	computed: {
		// ...mapState(['platformpath', 'interactiopath', 'foundationpath'])
		...mapState(['platformpath', 'interactiopath', 'foundationpath', 'isminimizeAppState', 'directBroadcastCode']),
		...mapGetters(['getisminimizeApp']),
		checkbindStu() {
			if (this.namelist && this.namelist.length > 0) {
				return this.namelist.filter(item => item.checked).length;
			} else {
				return 0;
			}
		},
		selectAnswerStr() {
			return this.selectAnswer.sort().join('');
		}
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		// this.onlinedirectBroadcastCode = this.sendInfo.directBroadcastCode;
		this.$store.commit('SET_startClass', true);
		this.$electron.ipcRenderer.send('onlinedirebro', true);
		this.getNamelist('bingingCard/getAllBingdCardInfo');
		this.getjson();
	},
	mounted() {
		this.myChart = echarts.init($('#myChart')[0]);
		this.myCorrectChart = echarts.init($('#myCorrectChart')[0]); //初始化echart
		const $me = this;
		/* 设置count的宽度 */
		const w = parseInt($('.couten').width() / 200) * 200;
		//console.log(($('.couten').width() - w) / 2);
		const l = ($('.couten').width() - w) / 2 + $('.couten')[0].offsetLeft;
		$('.couten').css({
			width: w,
			left: l
		});
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
										}
									];
									$me.getChartData(option, $me.chartDate.title);
									break;
								}
								case 7: {
									/* 语音测评 */
									var obj = msg.data;
									/* if ($me.uuid != msg.uuid) {
										return;
									} */
									var time = $('#danmu').data('nowTime') + 1;
									/*当渲染弹幕过多的时候,延迟处理弹幕*/
									if ($('#danmu .danmaku').length > 500) {
										time += 200; //2000毫秒。
									}
									var answer = obj.score;
									$('#danmu').danmu('addDanmu', [
										{
											text: obj.name + '(' + answer + ')',
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
									var obj = msg.data;
									if (obj.ret == 'success') {
										$me.txtlist.push(obj.data);
										$me.$nextTick(function() {
											$('.txtlist').animate({ scrollTop: $('.txtlist')[0].scrollHeight }, 400);
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
						answerreg = /^(?!.*([A-D]).*\1)[A-D]{1,4}$/;
					}
					if (!answerreg.test(answer)) {
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
					$me.titlename = '语言识别';
					break;
				}
				case '7': {
					url = 'voiceAnswer/startAppraisal';
					$me.titlename = '语言测评';
					break;
				}
				case '8': {
					if ($me.iPhoneType == 0) {
						url = 'microphone/start';
						$me.titlename = '抢麦';
					} else {
						url = 'microphone/start2';
						$me.titlename = '群发麦克风';
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
					$me.startVIew();
				})
				.catch(function(err) {
					// $me.$loading.close();
				});
			//$me.$store.commit("SET_isShowbg", true);
		},
		/* 调用开始接口成功以后，页面显示 */
		startVIew() {
			const $me = this;
			$me.clear();
			$me.isAnswering = true; //开始答题
			/*开始答题*/
			if ($me.subjecttitle != 6 && $me.subjecttitle != 7 && $me.subjecttitle != 8) {
				$me.isprogress = true; //显示进度条
			}
			if ($me.subjecttitle != 5 && $me.subjecttitle != 8 && $me.subjecttitle != 6) {
				/*不是抢红包,语音识别，麦克风 开始弹幕*/
				$('#danmu').danmu('danmuStart');
				$('#danmu').data('danmuList', {});
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
			} else if ($me.subjecttitle == 8) {
				if ($me.iPhoneType != 0) {
					/* 判断是否群麦克风 */
					$me.ismicrophone = true;
				}
			} else {
				if ($me.subjecttitle == 7) {
					$me.isreftext = true;
					$me.reftext = $me.talkName;
				}
				$me.isparticlesbox = true;
			}
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
					/*停止语音 */
					url = 'voiceAnswer/stop';
					break;
				}
				case '8': {
					/*停止麦克风 */
					url = 'microphone/stop';
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
					$me.isResult = true; //显示作答结果
					$me.isSendtitle = true; //显示下发题目按钮
					$me.isStop = false; //隐藏停止按钮
					$me.uuid = ''; //清空uuid
					$me.isAnswering = false; //停止答题
					if ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3 || $me.subjecttitle == 4) {
						$me.getEveryAnswerNum();
					}
					if ($me.subjecttitle == 1 || $me.subjecttitle == 2 || $me.subjecttitle == 3) {
						$me.getAnswerAccuracy();
					}
					if ($me.subjecttitle == 4) {
						$me.getSubjectiveResult();
					}
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
				var option = [
					{
						value: list.agreeNumber,
						name: '懂'
					},
					{
						value: list.totalNum - list.agreeNumber,
						name: '不懂'
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
					data = [];
				if (list && list.length > 0) {
					list.forEach(item => {
						title.push(item.answer);
						data.push(item.count);
					});
				}
				//var title = Object.keys(list);
				//var data = title.map(item => list[item]);
				$me.getCorrectChartData({
					title,
					data
				});
			});
		},
		/*获取答题正确率 柱状图chart*/
		getCorrectChartData(myoption) {
			const $me = this;
			var fontSize = $me.getDpr();
			$me.isCorrectchart = true;
			var title = myoption.title;
			var mydata = myoption.data;
			console.log(mydata);
			var colorList = [];
			if (title && title.length > 0) {
				colorList = title.map(item => {
					return '#61a0a8';
				});
			}
			let option = {
				color: ['#ff999a', '#61a0a8', '#ffcc67', '#af89d6'],
				grid: {
					x: 110,
					y: 55,
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
						color: '#449933',
						borderRadius: 4,
						borderColor: '#449933',
						borderWidth: 1,
						padding: [4, 10, 4, 10],
						interval: 0
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						lineStyle: {
							color: '#ccc'
						}
					},
					axisLabel: {
						formatter: ['{b|a}{value}人'].join('\n'),
						fontSize: fontSize > 24 ? 20 : fontSize,
						backgroundColor: '#fff',
						color: '#449933',
						borderRadius: 4,
						borderColor: '#449933',
						borderWidth: 1,
						padding: [4, 10, 4, 5],
						rich: {
							a: {
								color: 'red',
								lineHeight: 10
							},
							b: {
								backgroundColor: {
									image: '../../static/img/mf.png'
								},
								height: 30,
								widht: 30,
								color: 'transparent'
							}
						}
					},
					minInterval: 1
				},

				series: [
					{
						data: mydata,
						type: 'bar',
						barWidth: 60,
						label: {
							normal: {
								show: true,
								position: 'inside',
								color: '#f00',
								formatter: function(param) {
									return param.value + '人';
								},
								textStyle: { fontSize: 16 }
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									return colorList[params.dataIndex];
								}
							}
						}
					}
				]
			};
			if (title.length > 5) {
				option.dataZoom = [
					{
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
			$me.myCorrectChart.setOption(option);
			setTimeout(function() {
				$me.myCorrectChart.resize();
			}, 50);
			$me.myCorrectChart.off('click');
			$me.selectAnswer = [];

			$me.myCorrectChart.on('click', function(param) {
				
				if ($me.subjecttitle == 3) {
					
					if (colorList[param.dataIndex] == '#ff999a') {
						colorList[param.dataIndex] = '#61a0a8';
						for (var i = 0; i < $me.selectAnswer.length; i++) {
							if (title[param.dataIndex] == $me.selectAnswer[i]) {
								$me.selectAnswer.splice(i, 1);
								break;
							}
						}
					} else {
						colorList[param.dataIndex] = '#ff999a';
						$me.selectAnswer.push(title[param.dataIndex]);
					}
					$me.myCorrectChart.setOption(option);
				} else {
					/* if(param.dataIndex==0){
						$me.getEveryAnswerName({ answer:$me.trueAnswer });
					}else{
						$me.getFalseAnswerName ();
					} */
					 $me.getEveryAnswerName({ answer: title[param.dataIndex] });
					//$me.getEveryAnswerName({ answer:$me.trueAnswer });
					
				}
			});
		},
		/* 正确率显示 */
		getCorrectChartpieData(myoption) {
			const $me = this;
			$me.isChart = true;
			var List=myoption;
			var title=[];
			for(var i=0;i<List.length;i++){
				title.push(List[i].name);
			}
			console.log("哈哈哈哈"+JSON.stringify(title))
			let option = {
				legend: {
					x: 'center',
					y: 'bottom',
					textStyle: {
						color: '#fff'
					},
					//data: ['正确', '错误']
					data:title
				},

				color: ['#61a0a8', '#ff999a', '#ffcc67', '#af89d6'],
				series: [
					{
						name: '正确率',
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
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}
				]
			};
			option.series[0].data = myoption;
			$me.myChart.setOption(option);
			//console.log(option)
			setTimeout(function() {
				$me.myChart.resize();
			}, 100);
			$me.myChart.on('click', function(param) {
				if(title[param.dataIndex]=='正确'){
					$me.getEveryAnswerName({ answer: $me.trueAnswer });
				}else{
					$me.getFalseAnswerName({ answer: $me.trueAnswer });
				}
				
			});
		},
		/* 清空页面显示内容 */
		clear() {
			const $me = this;
			$me.stuName = ''; //麦克风学生名称
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
		},
		/* 切换语言测评类型 */
		changeTitleType(obj) {
			const $me = this;
			const type = ($me.reftitletype = obj.value);
			$me.talkName = '';
			if (type == 1) {
				$me.reftitletypelist = $me.alltxtlist['enWord'];
			} else if (type == 2) {
				$me.reftitletypelist = $me.alltxtlist['enSentence'];
			} else {
				$me.reftitletypelist = $me.alltxtlist['cnSentence'];
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
				$me.talkquestionType = '7';
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
				$me.talkquestionType = '7';
			} else if ($me.subjecttitle == 7) {
				$me.reftitletype = '1';
				$me.onetitletype = $me.titletypeList[0];
				$me.talkName = '';
				$me.reftitletypelist = $me.alltxtlist['enWord'];
			} else if ($me.subjecttitle == 8) {
				$me.iPhoneType = 0;
			}
		},
		/* 主观题统计 */
		getChartData(myoption, title) {
			const $me = this;
			$me.isChart = true;
			let option = {
				legend: {
					x: 'center',
					y: 'bottom',
					textStyle: {
						color: '#fff'
					},
					data: ['懂', '不懂']
				},

				color: ['#61a0a8', '#ff999a', '#ffcc67', '#af89d6'],
				series: [
					{
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
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}
				]
			};
			option.series[0].data = myoption;
			$me.myChart.setOption(option);
			//console.log(option)
			setTimeout(function() {
				$me.myChart.resize();
			}, 100);
		},

		uploadfile() {
			const $me = this;
			var file = $('#upload')[0];
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
				if (type == 1) {
					$me.reftitletypelist = $me.alltxtlist['enWord'];
				} else if (type == 2) {
					$me.reftitletypelist = $me.alltxtlist['enSentence'];
				} else {
					$me.reftitletypelist = $me.alltxtlist['cnSentence'];
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
		getFalseAnswerName(param){
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
					/*1 单题单选  2单题多选 3多题单选 4  判断题 5主观题  6 抢红包*/
					$me.trueAnswer = da.data.data.trueAnswer;
					$me.titlename = $me.titlenamelist[da.data.data.questionType - 1].titlename;
					$me.subjecttitle = $me.titlenamelist[da.data.data.questionType - 1].subjecttitle;
					$me.startVIew();
				} else {
					$me.$toast.center(da.data.message);
				}
			});
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
</style>

<template>
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
		<div class="talkroom flex-1 " v-if="subjectType == 1">
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
			<div class="flex flex-align-center" v-show="subjecttitle == 9">
				<div class="fromcontrol flex flex-1" style="width: 200px;">
					<label>语音课件</label>
					<div class="flex-1" :title="groupName" style="margin-right: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
						{{groupName}}
					</div>
				</div>
				<div class="uploadbox" @click="showXianshenWin()">
					<span>导入题库</span>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
	import {
		urlPath,
		allenglish,
		allchinese
	} from '@/page/mainPage/utils/base';
	import search from '@/page/mainPage/components/search/search.vue';
	import dropmenu from '@/page/mainPage/components/notice/dropmenu.vue';
	export default {
		components: {
			dropmenu,
			search,
		},
		data() {
			return {
				isAddSubject: false,
				subjectType: 0, //普通题或者语言题目
				subjecttitle: '1', //选中题型
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
				talkquestionType: 7, //7 英文识别 8 中文识别
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
				],
				alltxtlist: [], //语言测评所有题目列表
				reftitletype: 1, //语言测评的题目类型
				reftitletypelist: [], //语言测评 题目列表
				talkName: '', //语言测评题目
				iPhoneType: 0, // 麦克风 抢麦还是群麦
				settrueanswer: '', //正确答案
				score: 5, //分数
				onetitletype: {}, //选中的语音测评类型
			}
		},
		props: {
			/* 先声题库名称 */
			groupName: {
				type: String,
				default: ''
			},
			/* 先声题库 题目长度 */
			sentenceList: {
				type: Array,
				default: []
			},
		},
		created() {
			this.sendInfo = JSON.parse(sessionStorage.getItem('sendInfo'));
			this.getjson();
		},
		watch: {
			talkName(newValue, oldValue) {
				if (newValue != oldValue) {
					var maxnum = this.reftitletype == 4 ? 50 : 70;
					if (this.talkName.length > maxnum) {
						this.talkName = this.talkName.slice(0, maxnum);
						this.$toast.center(`题目长度不能大于${maxnum}`);
					}
				}
			},
		},
		methods: {
			/* 切换题型 */
			chooSesubjectType(type) {
				const $me = this;
				$me.subjectType = type;
				if ($me.subjectType == 0) {
					$me.subjecttitle = '1';
				} else {
					$me.subjecttitle = '6';
					$me.talkquestionType = 7;
				}
			},
			/* 切换普通题型 */
			selSubjecttitle(obj) {
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
			/* 显示先声题库弹出框 */
			showXianshenWin() {
				// this.$refs.xianshenWin.showWin();
				this.$emit('showXianshenWin')
			},
			isShow(type) {
				// this.onetitletype = this.titletypeList[0];
				this.settrueanswer = '';
				this.isAddSubject = type;
			},
			start() {
				let $me = this;
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
						param = {
							trueAnswer: answer,
							score: score,
							impromptu: true, //是否临时题
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
						let errmsg = '';
						if (!$me.reftitletype) {
							errmsg = '请选择题目类型';
							$me.$toast.center(errmsg);
							return false;
						}
						if (!$me.talkName) {
							errmsg = '请选择或输入题目';
							$me.$toast.center(errmsg);
							return false;

						}
						if ($me.reftitletype == 3 || $me.reftitletype == 4) {
							if (!allchinese.test($me.talkName)) {
								errmsg = '请输入中文!';
								$me.$toast.center(errmsg);
								return false;
							}
						} else {
							if (!allenglish.test($me.talkName)) {
								errmsg = '请输入英文!';
								$me.$toast.center(errmsg);
								return false;

							}
						}
						param = {
							type: $me.reftitletype,
							refText: $me.talkName
							//uuid: $me.uuid
						};
					} else if ($me.subjecttitle == 9) {
						if (!$me.groupName || $me.sentenceList.length <= 0) {
							$me.$toast.center('请选择题目!');
							return false;
						}


					}
				}
				return param
			}

		}
	}
</script>

<style>
	.commonroom,
	.talkroom {
		width: 520px;
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
</style>

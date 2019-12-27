<template>
	<div>
		<div class="modbox">
			<div>
				<form @keyup.enter="sendClass">
					<div class="fromcontrol flex">
						<label><i class="red">*</i>班级</label>
						<search :searchList="classsearchList" :selectValue.sync="selectclass" placeholdertxt="请选择班级" class="flex-1"></search>
					</div>
					<div class="fromcontrol flex">
						<label><i class="red">*</i>科目</label>
						<search :searchList="subjectsearchList" :selectValue.sync="selectsubject" placeholdertxt="请选择科目" class="flex-1"></search>
					</div>
					<div class="fromcontrol flex flex-1">
						<label><i class="red">*</i>主题</label>
						<div class="flex-1" style="margin-right: 60px;">
							<input type="text" name="" value="" autocomplete="off" v-model.trim="topicName" style="width: 100%;" placeholder="输入或者选择主题"
							 @input="changrTopic" />
							<dropmenu :reftitletypelist="reftitletypelist" @selTalkName="selTalkName">
								<template slot-scope="item">
									{{ item.data.topicName }}
									<span style="font-size: 22px; " class="reftitletypeitem">{{ item.data.startDatetime | filterTime }}</span>
								</template>
							</dropmenu>
						</div>
					</div>
					<div style="text-align: left; margin-top: 10px;" v-if="questionId > 0 || tempQuestionId > 0">
						<div class="ant-checkbox-group">
							<label class="ant-checkbox-group-item ant-checkbox-wrapper" style="width: 20em;">
								<span class="ant-checkbox">
									<input type="checkbox" class="ant-checkbox-input" v-model="isClearquestion" />
									<span class="ant-checkbox-inner"></span>
								</span>
								<span style="color: #f00; font-size:20px ;">是否清空之前作答记录</span>
							</label>
						</div>
					</div>
					<div class="fromcontrol flex flex-1">
						<label>试卷</label>
						<div style=" width: 30px; position: absolute;overflow: hidden; left: 4em; height: 64px;">
							<date-picker style="padding-top: 15px;position: absolute; right: 0;" v-model="rangetime" range appendToBody
							 confirm confirm-text="确定" value-type="format" @input="changeTime"></date-picker>
						</div>
						<div class="flex-1">
							<v-select :options="titlesearchList" v-model="titleCode" placeholder="选择时间段筛选试卷" class="flex-1" style="padding-right: 20px;"
							 label="titleName">
								<template slot="no-options">
									没有筛选到试卷
								</template>
							</v-select>
						</div>
						<!-- <a href="javascript:;" class="uploadTitle" @click="isCloseUpload = !isCloseUpload" v-if="sendInfo.classCode && sendInfo.subjectCode">
							<img src="../../assets/upload.png" alt="" />
						</a> -->
					</div>
				</form>
				<div class="flex" style="position: relative; padding-right: 94px;">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="sendClass()">确定</a>
					<!-- <a href="javascript:;" class="setEnglish mt20" @click="showXianshenWin()"></a> -->
					<div class="setupload mt20 flex" :class="{'active':showitembank&&sendInfo.classCode && sendInfo.subjectCode}">
						<div><a href="javascript:;" class="setbtn" @click="settest"><i></i>
								<p>导入题库</p>
							</a>
							<!-- <a href="javascript:;" class="setuploadbtn" @click="showitembank=!showitembank;showXianshenWin()"><i></i>
								<p>语音题导入</p>
							</a> -->
							<a href="javascript:;" class="setEnglishbtn" @click="showitembank=!showitembank;isCloseUpload = !isCloseUpload"><i></i>
								<p>导入题库</p>
							</a>
						</div>
					</div>
					<!--   -->
				</div>

				<upload class="upload animated fast" :class="[isCloseUpload ? 'fadeIn' : 'fadeOut']" :isCloseUpload.sync="isCloseUpload"
				 v-if="isCloseUpload"></upload>
			</div>
		</div>
		
	</div>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		urlPath,
		htmlescpe
	} from '@/page/mainPage/utils/base';
	import {
		search,
		dropmenu
	} from '@/page/mainPage/components';
	import vSelect from '@/page/mainPage/components/vue-select';
	import DatePicker from 'vue2-datepicker';
	import upload from '@/page/mainPage/components/upload/upload';
	import {
		parseDay
	} from '@/page/mainPage/utils';
	export default {
		data() {
			return {
				/*classroomlist: [],
				classroomsearchList: [],
				selectclassroom: {},*/
				classlist: [],
				subjectlist: [],
				classsearchList: [],
				subjectsearchList: [],
				selectclass: {},
				selectsubject: {},
				schoolCode: '',
				sendInfo: {},
				topicCode: '',
				questionId: '',
				tempQuestionId: '',
				topicName: '',
				rangetime: [],
				isCloseUpload: false,
				titleCode: '',
				titlesearchList: [],
				reftitletypelist: [],
				isSend: false,
				isClearquestion: false, //是否清空之前作答结果
				isShowclear: false,
				showitembank: false
			};
		},
		components: {
			search,
			vSelect,
			DatePicker,
			upload,
			dropmenu,
			
		},
		computed: {
			...mapState(['platformpath', 'interactiopath', 'foundationpath'])
		},
		watch: {
			selectclass: {
				handler(newName, oldName) {
					if (this.selectclass && this.selectclass.code) {
						this.sendInfo.classCode = this.selectclass.code;
						this.sendInfo.className = this.selectclass.name;
						if (this.sendInfo.classCode && this.sendInfo.subjectCode) {
							this.getTitleList();
						}
					} else {
						this.sendInfo.classCode = '';
						this.sendInfo.className = '';
					}
					sessionStorage.setItem('sendInfo', JSON.stringify(this.sendInfo));
				},
				deep: true,
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				immediate: true
			},
			selectsubject: {
				handler(newName, oldName) {
					if (this.selectsubject && this.selectsubject.name) {
						this.sendInfo.subjectCode = this.selectsubject.value;
						this.sendInfo.subjectName = this.selectsubject.name;
						if (this.sendInfo.classCode && this.sendInfo.subjectCode) {
							this.getTitleList();
						}
					} else {
						this.sendInfo.subjectCode = '';
					}
					sessionStorage.setItem('sendInfo', JSON.stringify(this.sendInfo));
				},
				deep: true,
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				immediate: true
			},
			/* 监听导入题目的显隐 ，刷新题目列表 */
			isCloseUpload(newvalue, oldvalue) {
				if (newvalue != oldvalue && !newvalue) {
					if (this.sendInfo.classCode && this.sendInfo.subjectCode) {
						this.getTitleList();
					}
				}
			}
		},
		created() {
			this.sendInfo = JSON.parse(this.$route.query.sendInfo);
			this.schoolCode = this.sendInfo.schoolCode;
			this.getClasslist();
			this.getSubjectlist();
			// this.$electron.ipcRenderer.send('uploadfile', false);
			var todayDate = new Date();
			this.rangetime[0] = parseDay(todayDate.getTime() - 30 * 86400000);
			this.rangetime[1] = parseDay(todayDate.getTime());
			//this.getTitleList();
			this.getTopicTitle();
			this.$store.commit('SET_selectWordList', []);
			this.$store.commit('SET_selectSentenceList', []);
			
		},
		filters: {
			filterTime: function(value) {
				if (value) {
					value = value.slice(10, value.length);
				}
				return value;
			}
		},
		methods: {
			changeTime() {
				if (this.sendInfo.classCode && this.sendInfo.subjectCode) {
					this.getTitleList();
				}
				//this.getTitleList();
			},
			/* 查询题目 */
			getTitleList() {
				const $me = this;
				if (this.rangetime.length == 2 && this.rangetime[0] && this.rangetime[1]) {
					var param = {
						classCode: this.sendInfo.classCode,
						subjectCode: this.sendInfo.subjectCode,
						startDateTime: this.rangetime.length > 0 && this.rangetime[0] ? this.rangetime[0] + ' 00:00:00' : '',
						endDateTime: this.rangetime.length > 1 && this.rangetime[1] ? this.rangetime[1] + ' 23:59:59' : ''
					};

					this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/platform/getCoursewares',
						data: param
					}).then(da => {
						if (da.data.ret == 'success') {
							var list = da.data.data;
							$me.titlesearchList = list;
						} else {
							$me.titlesearchList = [];
							$me.titleCode = null;
						}
					});
				} else {
					$me.titlesearchList = [];
					$me.titleCode = null;
				}
			},
			/* 查询班级 */
			getClasslist() {
				var param = {
					schoolCode: this.schoolCode
				};
				const $me = this;
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/platform/getClasses',
					data: param
				}).then(da => {
					if (da.data.ret == 'success') {
						var list = da.data.data;
						$me.classlist = list;
						if (list.length > 0) {
							$me.classsearchList = list.map(item => {
								return {
									name: item.name,
									code: item.code
								};
							});
						}
						//console.log(da);
					} else {
						// this.$toast.center('查询失败');
					}
				});
			},
			/* 查询科目 */
			getSubjectlist() {
				var param = {};
				const $me = this;
				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/platform/getSubjects'
					//data: param
				}).then(da => {
					if (da.data.ret == 'success') {
						var list = da.data.data;
						$me.subjectlist = list;
						if (list.length > 0) {
							$me.subjectsearchList = list.map(item => {
								return {
									name: item.name,
									value: item.value
								};
							});
						}
						console.log(da);
					} else {
						// this.$toast.center('查询失败');
					}
				});
			},
			/*获取标题*/
			getTopicTitle() {
				const $me = this;
				$me.$http({
					method: 'post',
					url: urlPath + '/teacher-client/platform/getTopicAndSubject',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: JSON.stringify({
						teacherCode: $me.sendInfo.teacAssistantCode
					})
				}).then(da => {
					if (da.data.ret == 'success') {
						$me.reftitletypelist = da.data.data;
					} else {
						this.$toast.center('查询失败');
					}
				});
			},
			// 		cleartopic() {
			// 			$me.topicCode = '';
			// 			$me.questionId = '';
			// 			this.tempQuestionId='';
			// 		},
			/* 切换 主题小标题 */
			selTalkName(topic) {
				const $me = this;
				$me.topicName = topic.topicName;
				$me.topicCode = topic.topicCode;
				$me.questionId = topic.questionId;
				$me.tempQuestionId = topic.tempQuestionId;
				if ($me.questionId > 0 || $me.tempQuestionId > 0) {
					$me.isShowclear = true;
				} else {
					$me.isShowclear = false;
				}
			},
			/* 提交班级信息 */
			sendClass() {
				const $me = this;
				if ($me.isSend) {
					return;
				}
				if ($me.selectclass && $me.selectclass.code) {
					$me.sendInfo.classCode = $me.selectclass.code;
					$me.sendInfo.className = $me.selectclass.name;
				} else {
					this.$toast.center('请选择班级');
					return false;
				}

				if ($me.selectsubject && $me.selectsubject.name) {
					$me.sendInfo.subjectCode = $me.selectsubject.value;
					$me.sendInfo.subjectName = $me.selectsubject.name;
				} else {
					this.$toast.center('请选择科目');
					return false;
				}
				if ($me.topicName) {
					if (htmlescpe.test($me.topicName)) {
						this.$toast.center('主题包含特殊字符' + $me.topicName.match(htmlescpe) + '，请重新输入！');
						return false;
					}
					$me.sendInfo.topicName = $me.topicName;
					$me.sendInfo.topicCode = $me.topicCode;
					/* 如果是选择的主题，传主题的id */

					if ($me.topicCode) {
						/* 清空了之前作答记录*/
						if ($me.isClearquestion) {
							$me.sendInfo.questionId = null;
							$me.sendInfo.tempQuestionId = null;
						} else {
							$me.sendInfo.questionId = $me.questionId;
							$me.sendInfo.tempQuestionId = $me.tempQuestionId;
						}
					}
				} else {
					this.$toast.center('请选择或者输入主题');
					return false;
				}

				/* 如果有选择了试卷，则需要同步 */
				if ($me.titleCode && $me.titleCode.titleCode) {
					$me.isSend = true;
					$me.synchronizedCoursewareQuestions();
				} else {
					$me.isSend = true;
					sessionStorage.setItem('sendInfo', JSON.stringify($me.sendInfo));
					$me.startDirectBroadcasts($me.sendInfo);
				}

				/* 通知悬浮窗 上传 */
				this.$electron.ipcRenderer.send('uploadfile', true);
			},
			/* 同步题目 */
			synchronizedCoursewareQuestions() {
				const $me = this;
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/platform/synchronizedCoursewareQuestions',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: JSON.stringify({
							titleCode: $me.titleCode.titleCode
						})
					})
					.then(da => {
						if (da.data.ret == 'success') {
							$me.sendInfo.titleCode = $me.titleCode.titleCode;
							sessionStorage.setItem('titleCode', $me.titleCode.titleCode);
							sessionStorage.setItem('titleName', $me.titleCode.titleName);
							sessionStorage.setItem('sendInfo', JSON.stringify($me.sendInfo));
							$me.startDirectBroadcasts($me.sendInfo);
						}
					})
					.catch(function(err) {
						$me.isSend = false;
					});
			},
			/*开始上课*/
			startDirectBroadcasts(param) {
				const $me = this;
				this.$loading('正在连接...');
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/common/startClass',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						if (da.data.ret == 'success') {
							$me.$loading.close();
							$me.$router.push({
								path: 'teacherroom',
								query: {
									sendInfo: JSON.stringify(param)
								}
							});
						} else {
							$me.$loading.close();
							$me.$toast.center(da.data.message);
						}
						$me.isSend = false;
					})
					.catch(function(err) {
						$me.$toast.center('开始上课失败');
						$me.$loading.close();
						$me.isSend = false;
					});
			},
			returnback() {
				this.$router.go(-1);
			},
			changrTopic() {
				/* 手动输入主题,清空主题code */
				this.topicCode = '';
				this.questionId = '';
				this.tempQuestionId = '';
			},
			showXianshenWin() {
				/* 显示先声题库弹出框 */
				this.$refs.xianshenWin.showWin();
			},
			settest() {
				if (this.sendInfo.classCode && this.sendInfo.subjectCode) {
					this.showitembank = !this.showitembank
				} else {
					this.$toast.center('请先选择班级和主题');
				}
			}
		}
	};
</script>

<style lang="less">
	/deep/ .mx-datepicker-range {
		width: 40px;
		height: 64px;
	}

	/deep/ .mx-input {
		height: 64px;
		border: 2px solid transparent;
		font-size: 30px;
	}

	/deep/ .mx-input-append {
		width: 40px;
	}

	/deep/ .mx-datepicker-popup {
		font-size: 16px;
	}

	/deep/ .mx-panel-date td,
	/deep/ .mx-panel-date th {
		font-size: 14px;
	}
</style>

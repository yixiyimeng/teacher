<template>
	<div>
		<div class="modbox">
			<div>
				<form @keyup.enter="sendClass">
					<div class="fromcontrol flex">
						<label>班级</label>
						<search :searchList="classsearchList" :selectValue.sync="selectclass" placeholdertxt="请选择班级" class="flex-1"></search>
					</div>
					<div class="fromcontrol flex">
						<label>科目</label>
						<search :searchList="subjectsearchList" :selectValue.sync="selectsubject" placeholdertxt="请选择科目" class="flex-1"></search>
					</div>
					<div class="fromcontrol flex flex-1">
						<label>主题</label>
						<div class="flex-1" style="margin-right: 60px;">
							<input type="text" name="" value="" autocomplete="off" v-model.trim="topicName" style="width: 100%;" placeholder="输入或者选择主题" />
						</div>
					</div>
				</form>
				<div class="flex">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="sendClass()">确定</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { urlPath } from '@/page/mainPage/utils/base';
import { search } from '@/page/mainPage/components';
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
			topicName: ''
		};
	},
	components: {
		search
	},
	computed: {
		...mapState(['platformpath', 'interactiopath', 'foundationpath'])
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.schoolCode = this.sendInfo.schoolCode;
		this.getClasslist();
		this.getSubjectlist();
		this.$electron.ipcRenderer.send('uploadfile', false);
	},
	methods: {
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

		/* 提交班级信息 */
		sendClass() {
			const $me = this;

			if ($me.selectclass && $me.selectclass.code) {
				$me.sendInfo.classCode = $me.selectclass.code;
				$me.sendInfo.className = $me.selectclass.name;
			} else {
				this.$toast.center('请选择班级');
				return false;
			}

			if ($me.selectsubject && $me.selectsubject.name) {
				$me.sendInfo.subjectCode = $me.selectsubject.value;
				$me.sendInfo.subjectName = $me.selectclass.name;
			} else {
				this.$toast.center('请选择科目');
				return false;
			}

			$me.sendInfo.topicName = $me.topicName;
			sessionStorage.setItem('sendInfo',JSON.stringify($me.sendInfo));
			$me.$router.push({
				path: 'titleList',
				query: { sendInfo: JSON.stringify($me.sendInfo) }
			});
			/* 通知悬浮窗 上传 */
			this.$electron.ipcRenderer.send('uploadfile', true);
		},

		returnback() {
			this.$router.go(-1);
		}
	}
};
</script>

<style></style>

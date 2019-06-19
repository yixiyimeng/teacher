<template>
	<div>
		<div class="modbox">
			<div>
				<form @keyup.enter="sendClass">
					
					<div class="fromcontrol flex">
						<label>班级</label>
						<search
							:searchList="classsearchList"
							:selectValue.sync="selectclass"
							placeholdertxt="请选择班级"
							class="flex-1"
						></search>
					</div>
				</form>
				<div class="flex">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="sendClass()">
						确定
					</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { urlPath } from '@/utils/base';
import { search } from '@/components';
export default {
	data() {
		return {
			classroomlist: [],
			classroomsearchList: [],
			selectclassroom: {},
			classlist: [],
			classsearchList: [],
			selectclass: {},
			schoolCode: '',
			sendInfo: {}
		};
	},
	components: {
		search
	},
	computed: {
			...mapState(['platformpath','interactiopath','foundationpath'])
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.schoolCode = this.sendInfo.schoolCode;
		this.getClasslist();
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
		/* 提交班级信息 */
		sendClass() {
			const $me = this;
			
			if ($me.selectclass && $me.selectclass.code) {
				$me.sendInfo.classCode = $me.selectclass.code;
			} else {
				this.$toast.center('请选择班级');
				return false;
			}

			if ($me.sendInfo.classCode) {
				var index2 = $me.classlist.findIndex(item => item.code == $me.sendInfo.classCode);
				$me.sendInfo.className = $me.classlist[index2].name;
				$me.startDirectBroadcasts();
			} else {
				this.$toast.center('请选择班级');
			}
		},
		/*连接直播间*/
		startDirectBroadcasts() {
			const $me = this;
			this.$loading('正在连接...');
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/common/startClass',
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify(this.sendInfo)
			})
				.then(da => {
					if (da.data.ret == 'success') {
						$me.$loading.close();
						$me.$router.push({
							path: 'teacherroom',
							query: { sendInfo: JSON.stringify($me.sendInfo) }
						});
					} else {
						$me.$loading.close();
						$me.$toast.center(da.data.message);
					}
				})
				.catch(function(err) {
					$me.$toast.center('启动直播间失败');
					$me.$loading.close();
				});
		},
		returnback() {
			this.$router.go(-1);
		}
	}
};
</script>

<style></style>

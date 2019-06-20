<template>
	<div style="text-align: center; padding-top: 10%; height: 70%; position: relative; width: 820px; margin: 0 auto;">
		<!-- <div style="text-align: left; background: #fff; border: 2px solid #1890ff; border-radius:4px ;  padding-left: 20px;">
			<span style="font-size: 30px;margin-right: 20px; ">选择时间筛选题目</span>
			<date-picker v-model="rangetime" range appendToBody confirm confirm-text="确定" value-type="format" @input="changeTime"></date-picker>
		</div> -->

		<!-- <ul class="list">
			<li v-for="(item, index) in titlesearchList" :accesskey="titlesearchList">
				<label class="ant-radio-wrapper">
					<span class="ant-radio">
						<input type="radio" name="titleCode" :value="item.titleCode" v-model="titleCode" />
						<span class="ant-radio-inner"></span>
					</span>
					<span>{{ item.titleName }}</span>
				</label>
			</li>
		</ul> -->
		<div class="modbox" style="padding-top: 0;">
			<div class="fromcontrol flex">
				<date-picker v-model="rangetime" range appendToBody confirm confirm-text="确定" value-type="format" @input="changeTime"></date-picker>
				</div>
			<div>
			<div class="fromcontrol flex">
				<label>题目</label>
				<v-select :options="titlesearchList" v-model="titleCode" placeholder="筛选题目" class="flex-1" style="padding-right: 20px;" label="titleName">
					<template slot="no-options">
						没有筛选到题目
					</template>
				</v-select>
			</div>
			
				<div class="flex">
					<a href="javascript:;" class="returnback mt20" @click="returnback()">返回</a>
					<a href="javascript:;" class="loginBtn mt20 flex-1" @click="sendTiltle()">确定</a>
				</div>
			</div>
		</div>
		<div style="text-align: right; position: relative;  margin: 0 auto;"><a href="javascript:;" class="link" @click="gotoClass()">跳过>></a></div>
	</div>
</template>

<script>
import { mapState } from 'vuex';
import { urlPath } from '@/page/mainPage/utils/base';
import { parseDay } from '@/page/mainPage/utils';
import { search } from '@/page/mainPage/components';
import DatePicker from 'vue2-datepicker';
import vSelect from '@/page/mainPage/components/vue-select';
export default {
	data() {
		return {
			titleCode: null,
			rangetime: [],
			sendInfo: {},
			oldsendInfo: {},
			titlesearchList: []
		};
	},
	components: {
		search,
		DatePicker,
		vSelect
	},
	created() {
		this.sendInfo = JSON.parse(this.$route.query.sendInfo);
		this.oldsendInfo = this.$route.query.sendInfo;
		var todayDate = new Date();
		this.rangetime[0] = parseDay(todayDate.getTime() - 30 * 86400000);
		this.rangetime[1] = parseDay(todayDate.getTime());
		this.getTitleList();
	},
	methods: {
		changeTime() {
			this.getTitleList();
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
		/* 提交题目信息 */
		sendTiltle() {
			const $me = this;
			if (!$me.titleCode||!$me.titleCode.titleCode) {
				this.$toast.center('请选择一个题目');
				return false;
			}
			/* 同步题目 */
			$me.synchronizedCoursewareQuestions();
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
				data: JSON.stringify({ titleCode: $me.titleCode.titleCode })
			}).then(da => {
				if (da.data.ret == 'success') {
					$me.sendInfo.titleCode = $me.titleCode.titleCode;
					sessionStorage.setItem('titleCode', $me.titleCode.titleCode);
					sessionStorage.setItem('titleName', $me.titleCode.titleName);
					$me.startDirectBroadcasts(JSON.stringify($me.sendInfo));
				}
			});
		},
		/* 跳过 直接上课*/
		gotoClass() {
			this.startDirectBroadcasts(this.oldsendInfo);
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
							query: { sendInfo: param }
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

<style scoped="scoped">
.ml20 {
	margin-left: 20px;
}
.list {
	padding: 20px;
	/* width: 60%; */
	margin: 20px auto;
	min-height: 200px;
	height: 60%;
	overflow: auto;
	background: #fff;
	border-radius: 5px;
	border: 5px solid #fed095;
}
.list li {
	float: left;
	width: 25%;
	text-align: left;
	line-height: 40px;
	color: #1890ff;
}
.link {
	color: #1890ff;
	position: absolute;
	right: 0;
	top: -60px;
	line-height: 60px;
	font-size: 30px;
}
</style>

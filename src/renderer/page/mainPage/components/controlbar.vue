<template>
	<div class="bottommenu">
		<a href="javascript:;" class="start" @click="startRace" v-show="isSubject && isAddSubject"></a>
		<a href="javascript:;" class="stopBtn" @click="stopRace" v-if="isStop"></a>
		<a href="javascript:;" class="send" @click="sendtitle" v-show="isSendtitle"></a>
		<a
			href="javascript:;"
			class="prev"
			:class="{ special: subjecttitle == 9 && isAnswering }"
			@click="prevQuestion"
			v-show="(isSubject && !isAddSubject) || (subjecttitle == 9 && isAnswering)"
		>
			<i></i>
		</a>
		<a
			href="javascript:;"
			class="next"
			:class="{ special: subjecttitle == 9 && isAnswering }"
			@click="nextQuestion"
			v-show="(isSubject && !isAddSubject) || (subjecttitle == 9 && isAnswering)"
		>
			<i></i>
		</a>
		<!-- 点名 -->
		<a href="javascript:;" class="rollCall" @click="callname(0)" v-if="(subjecttitle == 6 || subjecttitle == 7 || subjecttitle == 9) && isAnswering">
			<i></i>
			<p>点名</p>
		</a>
		<!-- 随机抽答 -->
		<a href="javascript:;" class="pickName" @click="callname(1)" v-if="(subjecttitle == 6 || subjecttitle == 7 || subjecttitle == 9) && isAnswering">
			<i></i>
			<p>随机</p>
		</a>
		<!-- 添加题目 -->
		<a href="javascript:;" class="addSubject" @click="addSubject" v-show="isSubject"></a>
		<div class="scoretip" v-if="subjecttitle == 9 && isAnswering">
			<span style="color: #4fb57e;" class="ml20">非常棒:(&gt;=90分)</span>
			<span style="color: #1890ff;" class="ml20">优秀:(&gt;=80分 &lt;90分)</span>
			<span style="color: #fad111;" class="ml20">良好:(&gt;=60分 &lt;80分)</span>
			<span style="color: #ec6d64;">继续努力:(&lt;60分)</span>	
		</div>
	</div>
</template>

<script>
import { urlPath } from '@/page/mainPage/utils/base';
import { mapState, mapMutations } from 'vuex';
export default {
	data() {
		return {};
	},
	computed: {},
	components: {},
	props: {
		isAddSubject: {
			/* 是否打开了新增临时题弹窗 */
			type: Boolean,
			default: false
		},
		isSubject: {
			/* 是否是准备发题状态 */
			type: Boolean,
			default: false
		},
		isStop: {
			/* 是否是停止状态 */
			type: Boolean,
			default: false
		},
		isSendtitle: {
			/* 是否是统计状态 */
			type: Boolean,
			default: false
		},
		isAnswering: {
			/* 是否是答题状态 */
			type: Boolean,
			default: false
		},
		subjecttitle: {
			/* 发题类型 */
			type: [String, Number],
			default: 0
		}
	},
	mounted() {},
	watch: {},
	methods: {
		startRace() {
			this.$emit('startRace');
		},
		stopRace() {
			this.$emit('stopRace');
		},
		sendtitle() {
			this.$emit('sendtitle');
		},
		prevQuestion() {
			this.$emit('prevQuestion');
		},
		nextQuestion() {
			this.$emit('nextQuestion');
		},
		callname(type) {
			this.$emit('callname', type);
		},
		addSubject() {
			this.$emit('addSubject', !this.isAddSubject);
		}
	}
};
</script>

<style scoped="scoped" lang="less">
.scoretip {
	position: fixed;
	right: -350px;
	bottom: -30px;
	text-align: center;
	width: 700px;
}
</style>

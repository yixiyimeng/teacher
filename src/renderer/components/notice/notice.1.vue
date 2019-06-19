<template>
	<div>
		<!-- <div class="plan">
		<img src="../../assets/notice.png" />
		<div>
			<p class="bounceIn animated fast" v-if="titlename" >{{ titlename }}</p>
			<p v-if="trueAnswer"  class="bounceIn animated fast">
				<span class="warn">{{ trueAnswer }}</span>
			</p>
		</div>
	</div> -->
		<div class="topmenu">
			<span>{{ titlename }}</span>
			<i></i>
			<i></i>
			<i></i>
			<i></i>
		</div>
	</div>
</template>

<script>
export default {
	name: 'notice',
	data() {
		return {};
	},

	props: {
		titlename: String,
		trueAnswer: String
	}
};
</script>

<style lang="less" scoped>
p {
	font-size: 30px;
	font-weight: 500;
}
.topmenu {
	position: absolute;
	top: 0;
	left: 0;
	height: 80px;

	text-align: center;
	color: #1890ff;
	padding-left: 20px;
}
.topmenu i {
	display: block;
	width: 12px;
	height: 32px;
	position: absolute;
	background: url(../../assets/notice2.png);
	top: 0;
}
.topmenu i:nth-child(2) {
	left: 40px;
}

.topmenu i:nth-child(3) {
	left: 60px;
}
.topmenu i:nth-child(4) {
	right: 20px;
}
.topmenu i:nth-child(5) {
	right: 40px;
}

.topmenu span {
	margin-top: 20px;
	font-size: 30px;
	line-height: 80px;
	border: 3px solid rgba(16, 120, 255, 0.8);
	border-radius: 5px;
	background: #fff;
	display: block;
	width: 200px;
}
</style>

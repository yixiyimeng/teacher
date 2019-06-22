<template>
	<div class="topmenu">
		<span v-html="titlename"></span>
		<i></i>
		<i></i>
		<i></i>
		<i></i>
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
	
	text-align: center;
	color: #000;
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
	margin-top: 15px;
	font-size: 30px;
	// line-height: 80px;
	padding: 20px 0;
	line-height: 40px;
	box-shadow: 0 0 10px rgba(0,0,0,.4);
	// border: 3px solid rgba(16, 120, 255, 0.8);
	border-radius: 5px;
	background: #f9f6cf;
	display: block;
	width: 200px;
}
</style>

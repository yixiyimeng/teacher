<template>
	<div id="app">
		<router-view></router-view>
		
	</div>
</template>

<script>
export default {
	name: 'mwave',
	data() {
		return {
		
		};
	},
	computed: {
		
	},

	

	methods: {
		
	}
};
</script>
<style  lang="less">
@import 'assets/css/reset.css';
@import 'assets/css/style.less';
body {
	font-family: 'Microsoft YaHei';
}

.download,.exitappWin {
	position: fixed;
	background: rgba(0, 0, 0, 0.4);
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	z-index: 99999;
}
.download .confirm,.exitappWin .confirm {
	width: 360px;
	box-sizing: border-box;
	background: #fff;
	border-radius: 14px;
	position: absolute;
	top: 40%;
	left: 50%;
	padding-top: 60px;
	-webkit-transform: translate(-50%, -50%);
	padding-bottom: 20px;
}
.download .confirm > div ,.exitappWin .confirm>div{
	position: relative;
	z-index: 999;
}
.download .confirm img {
	position: absolute;
	top: -100px;
	width: 100%;
	left: 0;
	z-index: 0;
}
.download .confirm .title {
	line-height: 40px;
	font-size: 20px;
	margin-bottom: 10px;
	padding: 100px 50px 0;
}
.download .confirm .txt {
	color: #999;
	padding: 0 50px;
}
.download .confirm .buttonGroup,.exitappWin .confirm .buttonGroup {
	margin-top: 40px;
	height: 40px;
	overflow: hidden;
	line-height: 40px;
	text-align: center;
}
.download .confirm .buttonGroup a ,.exitappWin .confirm .buttonGroup a{
	display: inline-block;
	width: 40%;
	color: #000;
	border-radius: 20px;
	margin: 0 5px;
	background: #eee;
}
.download .confirm .buttonGroup a.comfirmBtn,
.exitappWin .confirm .buttonGroup a.comfirmBtn{
	background: #ffe400;
}
.exitappWin .confirm .title{
	line-height: 40px;
	font-size: 20px;
	margin-bottom: 10px;
	text-align: center;
}
</style>

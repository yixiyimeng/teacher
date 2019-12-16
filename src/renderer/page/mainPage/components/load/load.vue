<template>
	<div>
		<div class="progressbar" :class="{ active: isprogress }">
			<div class="bar"><span :style="{width:rate*5.28+'px'}"></span></div>
			<div class="num" :style="{left: (rate*5.28-22)+'px'}">{{rate}}%</div>
			<div class="answerNum">答题人数12</div>
			<div class="totalNum">总人数100</div>
			<!-- <div class="label" :style="{left: (rate*5.28-2)+'px'}">
				<span></span>
				<div class="perc">{{rate}}%</div>
			</div> -->
		</div>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				blower: null
			};
		},
		props: {
			isprogress: Boolean,
			rate: Number
		},
		watch: {

		},
		mounted() {

		}
	};
</script>

<style scoped="scoped">
	.progressbar {
		transition: all .3s;
		position: absolute;
		top: -140px;
		left: 50%;
		margin-left: -274px;
		display: block;
		width: 548px;
		height: 62px;
		padding: 10px 20px;
		border-radius: 16px;
		transition: all 0.3s;
		background: url(../../assets/progressbg.png);
	}

	.progressbar.active {
		top: 40px;
	}

	.bar {
		position: absolute;
		display: block;
		width: 528px;
		height: 46px;
		top: 8px;
		left: 10px;
		overflow: hidden;

		transition: all .4s;
		border-radius: 46px;
		overflow: hidden;
	}

	.bar span {
		line-height: 46px;
		height: 46px;
		border-radius: 46px;
		overflow: hidden;
		position: absolute;
		top: 0;
		left: 0;
		background: url(../../assets/progress.png);
	}

	.num {
		line-height: 46px;
		color: #1890ff;
		font-size: 22px;
		left: 0;
		position: absolute;
		text-align: right;
		top: 8px;
		transform: translateX(-50%);
	}

	.answerNum,
	.totalNum {
		position: absolute;
		top: -34px;
		background: #fff;
		border: 2px solid #1890ff;
		border-radius: 50px;
		line-height: 22px;
		font-size: 14px;
		color: #1890ff;
		padding: 0 10px;
	}

	.totalNum {
		right: 20px;
	}

	.totalNum:after {
		right: 10px;
	}

	.answerNum:after,
	.totalNum:after {
		content: '';
		display: block;
		height: 10px;
		width: 10px;
		background: #fff;
		position: absolute;
		bottom: -7px;
		transform: rotate(-45deg);
		border: 2px solid #1890ff;
		border-top: transparent;
		border-right: transparent;
	}

	.label {
		font-family: 'Aldrich', sans-serif;
		position: absolute;
		display: block;
		width: 40px;
		height: 30px;
		line-height: 30px;
		top: 38px;
		left: 0px;
		background: rgb(76, 76, 76);
		background: -moz-linear-gradient(top, rgba(76, 76, 76, 1) 0%, rgba(38, 38, 38, 1) 100%);
		background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, rgba(76, 76, 76, 1)), color-stop(100%, rgba(38, 38, 38, 1)));
		background: -webkit-linear-gradient(top, rgba(76, 76, 76, 1) 0%, rgba(38, 38, 38, 1) 100%);
		background: -o-linear-gradient(top, rgba(76, 76, 76, 1) 0%, rgba(38, 38, 38, 1) 100%);
		background: -ms-linear-gradient(top, rgba(76, 76, 76, 1) 0%, rgba(38, 38, 38, 1) 100%);
		background: linear-gradient(to bottom, rgba(76, 76, 76, 1) 0%, rgba(38, 38, 38, 1) 100%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#4c4c4c', endColorstr='#262626', GradientType=0);
		font-weight: bold;
		font-size: 12px;
		color: #fff;
		text-align: center;
		-webkit-border-radius: 6px;
		border-radius: 6px;
		border: 1px solid rgba(0, 0, 0, 0.2);
		-webkit-box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
		box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
		text-shadow: 0px -1px 0px #000000, 0px 1px 1px #000000;
		filter: dropshadow(color=#000000, offx=0, offy=-1);
		transition: all .4s;
	}

	.label span {
		position: absolute;
		display: block;
		width: 12px;
		height: 9px;
		top: -9px;
		left: 14px;
		background: transparent;
		overflow: hidden;
	}

	.label span:before {
		position: absolute;
		display: block;
		content: '';
		width: 8px;
		height: 8px;
		top: 4px;
		left: 2px;
		border: 1px solid rgba(0, 0, 0, 0.5);
		background: rgb(86, 86, 86);
		background: -moz-linear-gradient(-45deg, rgba(86, 86, 86, 1) 0%, rgba(76, 76, 76, 1) 50%);
		background: -webkit-gradient(linear, left top, right bottom, color-stop(0%, rgba(86, 86, 86, 1)), color-stop(50%, rgba(76, 76, 76, 1)));
		background: -webkit-linear-gradient(-45deg, rgba(86, 86, 86, 1) 0%, rgba(76, 76, 76, 1) 50%);
		background: -o-linear-gradient(-45deg, rgba(86, 86, 86, 1) 0%, rgba(76, 76, 76, 1) 50%);
		background: -ms-linear-gradient(-45deg, rgba(86, 86, 86, 1) 0%, rgba(76, 76, 76, 1) 50%);
		background: linear-gradient(135deg, rgba(86, 86, 86, 1) 0%, rgba(76, 76, 76, 1) 50%);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#565656', endColorstr='#4c4c4c', GradientType=1);
		-webkit-box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.15);
		box-shadow: 0px -1px 2px 0px rgba(0, 0, 0, 0.15);
		-moz-transform: rotate(45deg);
		-webkit-transform: rotate(45deg);
		-o-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
	}

	@-webkit-keyframes sparkle {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 0 -64px;
		}
	}

	@-moz-keyframes sparkle {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 0 -64px;
		}
	}

	@-o-keyframes sparkle {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 0 -64px;
		}
	}

	@keyframes sparkle {
		from {
			background-position: 0 0;
		}

		to {
			background-position: 0 -64px;
		}
	}
</style>

<template>
	<div class="audioscorebox">
		<div class="audiobox-hd flex flex-pack-justify flex-align-center">
			<div class="flex flex-align-center">
				<span>答题详情</span>
				<span class="num">6</span>
			</div>
			<span class="close">
				×
			</span>
		</div>
		<div class="audiobox-bd">
			<div class="item flex">
				<span class="num">1</span>
				<span class="score">(99)</span>
				<div class="flex-1" >
					<span v-for="(item,index) in 100">t</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		urlPath,
	} from '@/page/mainPage/utils/base';
	import {
		mapState,
		mapMutations
	} from 'vuex';
	export default {
		data() {
			return {

			}
		},
		computed: {},
		components: {

		},
		props: {
			studentId: {
				/* 发题类型 */
				type: [String, Number],
				default: 0
			}
		},
		mounted() {

		},
		watch: {},
		methods: {

		}
	}
</script>

<style scoped="scoped" lang="less">
	.audioscorebox {
		border: 6px solid #1890ff;
		border-radius: 10px;
		background: #fff;
		width: 600px;
		position: fixed;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 0 25px 30px;

		.audiobox-hd {
			line-height: 85px;
			color: #1890ff;
			font-size: 30px;
			border-bottom:1px solid #ccc;

			.num {
				background: #ec6d64;
				margin-left: 20px;
				border-radius: 100%;
				height: 43px;
				width: 43px;
				line-height: 43px;
				font-size: 14px;
				color: #fff;
				display: inline-block;
				text-align: center;
				position: relative;
				&:after {
					content: '';
					display: block;
					width: 31px;
					height: 31px;
					border: 1px solid #fff;
					border-radius: 100%;
					top: 50%;
					left: 50%;
					transform: translate(-50%, -50%);
					position: absolute;
				}
			}
			.close{
				font-size: 50px;
				color: #ec6d64;
				font-weight: bold;
			}
		}
		.item{
			font-size: 30px;
			color: #666;
			margin-top:30px;
			.num,.score{
				color: #1890ff;
			}
			.num{
				height: 30px;
				min-width: 30px;
				border: 1px solid #1890ff;
				border-radius: 100%;
				font-size: 20px;
				text-align: center;
				line-height: 30px;
			}
			.score{
				margin: 0 10px;
			}
			.flex-1{
				word-break: break-all;
				width: 100px;
			}
		}
	}
</style>

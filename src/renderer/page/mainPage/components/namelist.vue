<!-- 绑定学生名单 -->
<template>
	<div>
		<div class="namelistbox animated fast" :class="[isshowNamelist ? 'fadeIn' : 'fadeOut']" v-if="isshowNamelist">
			<div class="mask" @click.stop="hide"></div>
			<div class="namelistbox-bd">
				<a href="javascript:;" class="close" @click="hide"></a>
				<ul class="clearfix">
					<li v-for="(item, index) in namelist" :class="{ active: item.checked }">
						<i :class="item.state == 0 ? 'warn' : 'success'" @click="checkOneStu(item)"></i>
						<span @click="checkOneStu(item)">{{ item.stuName }}</span>
						<img src="../assets/jiebang1.png" alt="" v-if="item.state == 1" @click="unBindOneStu(item)" style="opacity: .6;" />
					</li>
				</ul>

				<div class="tag">
					<span>已选择{{ checkbindStu }}个学生</span>
					<a href="javascript:;" @click="unbindCheckedStu">解绑选中学生</a>
					<a href="javascript:;" @click="checkAll">全选</a>
					<a href="javascript:;" @click="uncheckAll">全不选</a>
				</div>
				<div @click="unBindAllStu" class="unbindAllStu" title="一键解绑"><img src="../assets/jiebang.png" alt="" /></div>
			</div>
		</div>
		<div class="exitappWin animated fadeIn" v-if="isunbind">
			<div class="confirm">
				<div>
					<div class="title">{{ unbindtext }}</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="isunbind = !isunbind">暂不</a>
						<a href="javascript:;" class="comfirmBtn" @click="unBindStu">确定</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex';
	import {
		urlPath,

	} from '@/page/mainPage/utils/base';
	export default {
		name: 'studentlist',
		data() {
			return {
				isshowNamelist: false,
				isunbind: false
			}
		},
		computed: {
			checkbindStu() {
				if (this.namelist && this.namelist.length > 0) {
					return this.namelist.filter(item => item.checked).length;
				} else {
					return 0;
				}
			},
		},
		props: {
			namelist: {
				type: [Array, Object],
				default: []
			}
		},
		mounted() {

		},
		watch: {

		},
		created() {

		},
		methods: {
			show(type) {
				this.isshowNamelist = type;
			},
			hide() {
				this.isshowNamelist = false;
				this.$emit('hide')
			},
			/* 一键解绑学生名单 */
			unBindStu() {
				const $me = this;
				$me.isunbind = false;

				this.$http({
					method: 'post',
					url: urlPath + 'teacher-client/bingingCard/unBind',
					headers: {
						'Content-Type': 'application/json; charset=UTF-8'
					},
					data: JSON.stringify($me.ubindParams)
				}).then(da => {
					if (da.data.ret == 'success') {
						$me.$toast.center('解绑成功');
						/* 刷新名单 */
						// $me.getNamelist('bingingCard/getAllBingdCardInfo');
						$me.$emit('uploadNameList')
					} else {
						$me.$toast.center('解绑失败');
					}
				});
			},
			/* 解绑一个学生 */
			unBindOneStu(stu) {
				const $me = this;
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
				$me.isunbind = true;
				$me.unbindtext = '确定解绑' + stu.stuName + '吗？';
				$me.ubindParams = {
					stuCodes: [stu.stuCode]
				};
			},
			/* 解绑选中学生 */
			unbindCheckedStu() {
				const $me = this;
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
				var list = [];
				if ($me.namelist && $me.namelist.length > 0) {
					list = $me.namelist
						.filter(item => {
							return item.checked;
						})
						.map(item => item.stuCode);
				}
				if (list.length > 0) {
					$me.isunbind = true;
					$me.unbindtext = '确定解绑选中学生吗？';
					$me.ubindParams = {
						stuCodes: list
					};
				} else {
					$me.$toast.center('请至少选择一个学生');
				}
			},
			/* 解绑所有学生名单吗 */
			unBindAllStu() {
				const $me = this;
				if ($me.isAnswering) {
					$me.$toast.center('答题过程中不能解绑');
					return false;
				}
				$me.isunbind = true;
				$me.unbindtext = '确定解绑所有学生名单吗？';
				$me.ubindParams = {
					classCode: $me.sendInfo.classCode
				};
			},
			/* 选中一个学生 */
			checkOneStu(item) {
				const $me = this;
				if (item.state != 0) {
					item.checked = !item.checked;
				}
			},
			/* 全选 */
			checkAll() {
				const $me = this;
				if ($me.namelist && $me.namelist.length > 0) {
					$me.namelist.forEach(item => {
						if (item.state == 1) {
							item.checked = true;
						}
					});
				}
			},
			/* 全不选 */
			uncheckAll() {
				const $me = this;
				if ($me.namelist && $me.namelist.length > 0) {
					$me.namelist.forEach(item => {
						if (item.state == 1) {
							item.checked = false;
						}
					});
				}
			},
		}
	}
</script>

<style scoped="scoped" lang="less">
	.fade-enter-active,
	.fade-leave-active {
		-webkit-transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
		transition: opacity 0.15s cubic-bezier(1, 0.5, 0.8, 1);
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}

	@keyframes bounce-in {
		0% {
			transform: scale(0);
			opacity: 0;
		}

		50% {
			opacity: 1;
			transform: scale(1.01);
		}

		100% {

			transform: scale(1);
		}
	}


	.bounce-enter-active {
		animation: bounce-in .5s;
	}

	.bounce-leave-active {
		animation: bounce-in .5s reverse;
	}

	.namelistbox .name {
		color: #0066c4;
		font-size: 20px;
	}

	.namelistbox i.num,
	.list i.num {
		border-radius: 100%;
		border: 1px solid #1890ff;
		height: 20px;
		width: 20px;
		color: #1890ff;
		vertical-align: middle;
		display: inline-block;
		text-align: center;
		line-height: 18px;
		font-size: 12px;
	}

	.namelistbox p {
		margin: 5px 0;
	}

	.namelistbox .num+span,
	.list .num+span {
		vertical-align: middle;
	}

	.rightbar {
		right: 0;
		top: 20%;
		bottom: 20%;
		position: fixed;

		transition: all .3s;
		z-index: 1000;
		transform: translateX(250px);

		&.active {
			transform: translateX(0);
		}

		&>.flex {
			box-shadow: 0 0 10px rgba(67, 132, 212, .4);
			width: 270px;
			border-radius: 6px;
			height: 100%;
			opacity: 0;
			background: #fff;
			overflow: hidden;
		}

		&.active>.flex {
			opacity: 1;
		}

		.arrow {
			height: 40px;
			width: 40px;
			border: 2px solid #1890ff;
			border-radius: 100%;
			background: #fff url(../assets/rightbar.png) no-repeat center center;
			background-size: 12px auto;
			position: absolute;
			cursor: pointer;
			left: 0;
			top: 50%;
			transform: translate(-50%, -50%) rotate(180deg);
			transition: all .3s;
		}

		&.active .arrow {
			transform: translate(-50%, -50%) rotate(0);
		}

		.title {
			line-height: 40px;
			font-size: 20px;
			color: #1890ff;
			text-align: center;
			cursor: pointer;
			border-bottom: 1px solid #d1e9ff;

			&>span.active {
				background: #1890ff;
				color: #fff;
			}
		}

		.list {
			overflow: auto;

		}


		.list p {
			padding: 10px 10px 30px 20px;
			cursor: pointer;
		}

		.list .num+span {
			color: #1890ff;
			font-size: 16px;
			margin: 0 10px;
		}
	}

	.notice,
	.play {
		display: inline-block;
		vertical-align: middle;
		width: 20px;
		height: 20px;
		background: url(../assets/icon24.png) no-repeat left center !important;

		&.play {
			background-image: url(../assets/icon25.png)
		}


	}

	.notice {
		background-size: 16px auto;
	}

	.notice.active,
	.play.active {
		background-image: url(../assets/noticeplay.gif) !important;
		background-size: 20px auto !important;
		;
		background-position-x: -2px !important;
		;

	}


	.videobox {
		position: absolute;
		z-index: 9999;
	}

	.soundbox {
		border: 2px solid rgba(24, 114, 255, 0.9);
		background: #fff;
		position: fixed;
		top: 5px;
		left: 50%;
		transform: translateX(-50%);
		border-radius: 100%;
		width: 45px;
		height: 45px;
		text-align: center;
		padding-top: 7px;
		padding-left: 7px;
		/* padding-top: 11px; */
		box-sizing: border-box;
		z-index: 9999;
	}

	.sound {
		cursor: pointer;
		vertical-align: middle;
	}

	.sound img {
		display: block;
		width: 30px;
	}

	.sound.active>span {
		background: none;
	}

	.namelistbox {
		.item {
			width: 25%;
			padding: 10px;

			&>div {
				box-shadow: 0 0 10px rgba(0, 0, 0, .1);
				border-radius: 5px;
				height: 100%;
				padding: 10px;

				.name+div {
					overflow: hidden;
				}

				p {
					float: left;
				}
			}

		}
	}
</style>

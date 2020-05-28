<template>
	<div style="height: 100%; width: 100%;">
		<div class="tip" v-if="subjecttitle == 3">
			<div class="ant-checkbox-group">
				<label class="ant-checkbox-group-item ant-checkbox-wrapper" v-for="(item, index) in checklist" :key="index">
					<span class="ant-checkbox">
						<input type="checkbox" v-model="item.ischeck" class="ant-checkbox-input" />
						<span class="ant-checkbox-inner"></span>
					</span>
					<span>{{ item.name }}</span>
				</label>
			</div>
			<a class="text-blue" href="javascript:;" v-if="selectAnswerStr" @click="handAnswerStr">
				查看选择{{ selectAnswerStr }}人员名单
			</a>
		</div>
		<div id="barChart"></div>
	</div>
</template>

<script>
	import echarts from 'echarts'
	var defaultcolor = ['#FF999A', '#59ADF3', '#AF89D6', '#af89d6'];
	export default {
		data() {
			return {
				myChart: null,
				checklist: [],
				colorList: []
			}
		},
		watch: {

			checklist: {
				handler(newName, oldName) {
					const $me = this;
					if ($me.subjecttitle == 3) {
						for (var i = 0; i < $me.checklist.length; i++) {
							if ($me.checklist[i].ischeck) {
								$me.colorList[i] = '#FF999A';
							} else {
								$me.colorList[i] = '#59ADF3';
							}
						}
						$me.upOption()
					}
				},
				deep: true
				// 代表在wacth里声明了firstName这个方法之后立即先去执行handler方法
				// immediate: true
			},
		},
		computed: {
			selectAnswerStr() {
				return this.checklist
					.filter(item => item.ischeck)
					.map(item => item.name)
					.sort()
					.join('');
			},
		},
		props: {
			trueAnswer: {
				type: String,
				default: ''
			},
			subjecttitle: {
				type: [String, Number],
				default: 0
			}
		},
		mounted() {
			let that = this;
			this.$nextTick(() => {
				this.myChart = echarts.init($('#barChart')[0]);
				window.addEventListener('resize', this.chartResize)
			})
		},
		destroyed() {
			window.removeEventListener('resize', this.chartResize)
		},
		methods: {
			chartResize() {
				this.myChart.resize();
			},
			setOption(myoption, seriesname) {
				let $me = this;
				var fontSize = $me.getDpr();
				var title = myoption.title;
				var mydata = myoption.data;
				var dataShadow = myoption.dataShadow
				var percentage = myoption.percentage;
				$me.checklist = title
					.filter(item => item != '未作答')
					.map(item => {
						return {
							name: item,
							ischeck: false
						};
					});

				$me.colorList = [];
				if (title && title.length > 0) {
					$me.colorList = title.map((item, i) => {
						if ($me.subjecttitle == 4) {
							return defaultcolor[i];
						} else {
							if (title[i] == ($me.trueAnswer == 'F' ? '×' : $me.trueAnswer == 'E' ? '√' : $me.trueAnswer) && ($me.subjecttitle ==
									1 || $me.subjecttitle == 2)) {
								return '#ff999a';
							}
							if (item == '未作答') {
								return '#AF89D6';
							}
							return '#59ADF3';
						}
					});
				}
				let option = {
					color: ['#59ADF3', '#FF999A', '#AF89D6', '#af89d6'],
					grid: {
						x: 110,
						y: 20,
						x2: 25,
						y2: 45
					},
					xAxis: {
						type: 'category',
						data: title,
						axisLine: {
							lineStyle: {
								color: '#ccc'
							}
						},
						axisLabel: {
							fontSize: fontSize > 24 ? 20 : fontSize,
							backgroundColor: '#fff',
							color: '#5793f3',
							borderRadius: 4,
							borderColor: '#5793f3',
							borderWidth: 1,
							padding: [3, 10, 3, 10],
							interval: 0
						}
						/* ,
						triggerEvent:true */
					},
					yAxis: {
						type: 'value',
						axisLine: {
							lineStyle: {
								color: '#ccc'
							}
						},
						axisLabel: {
							formatter: ['{value}人'].join('\n'),
							fontSize: fontSize > 24 ? 20 : fontSize,
							backgroundColor: '#fff',
							color: '#5793f3',
							borderRadius: 4,
							borderColor: '#5793f3',
							borderWidth: 1,
							padding: [3, 10, 3, 10],

						},
						minInterval: 1
					},
					series: [{
						data: dataShadow,
						type: 'bar',
						barWidth: 80,
						barGap: '-100%',
						itemStyle: {
							normal: {
								color: 'rgba(0,0,0,0.01)',
								barBorderRadius: [8, 8, 0, 0]
							}
						}
					}, {
						data: mydata,
						type: 'bar',
						barWidth: 80,
						label: {
							normal: {
								show: true,
								position: 'inside',
								color: '#fff',
								formatter: function(param) {
									if (param.value == 0) {
										return 0;
									} else {
										return param.value + '人\n(' + percentage[param.dataIndex] + '%)';
									}
								},
								textStyle: {
									fontSize: 20
								}
							}
						},
						itemStyle: {
							normal: {
								color: function(params) {
									return $me.colorList[params.dataIndex];
								},
								barBorderRadius: [8, 8, 0, 0]
							}
						}
					}]
				};
				if (title.length > 5) {
					option.dataZoom = [{
							show: true,
							start: 0,
							end: 50
						},
						{
							type: 'inside',
							start: 0,
							end: 50
						}
					];
				}
				$me.myChart.setOption(option);
				setTimeout(function() {
					$me.myChart.resize();
				}, 200);
				$me.myChart.off('click');
				$me.myChart.on('click', function(param) {
					if ($me.subjecttitle == 3) {
						if (title[param.dataIndex] == '未作答') {
							$me.$emit('handBarchart', title[param.dataIndex])
						} else {
							if ($me.colorList[param.dataIndex] == '#FF999A') {
								$me.checklist[param.dataIndex].ischeck = false;
							} else {
								$me.checklist[param.dataIndex].ischeck = true;
							}
						}
						$me.upOption();
					} else {
						$me.$emit('handBarchart', title[param.dataIndex])
					}

				});
			},
			upOption(colorlist) {
				var option = this.myChart.getOption();
				this.myChart.setOption(option);
			},
			getDpr() {
				var windowWidth = $(window).width();
				console.log(windowWidth)
				if (windowWidth < 920) {
					return 14
				}
				if (windowWidth >= 920 && windowWidth <= 1200) {
					return 20
				}
				if (windowWidth > 1200 && windowWidth <= 1920) {
					return 25
				}

			},
			handAnswerStr() {
				this.$emit('handBarchart', this.selectAnswerStr)
			}
		}
	}
</script>

<style>
	#barChart {
		height: 100%;
		min-height: 100px;
	}

	.tip {
		height: 25px;
		text-align: left;
		padding-left: 60px;
	}

	.text-blue {
		color: rgb(24, 114, 255);
	}
</style>

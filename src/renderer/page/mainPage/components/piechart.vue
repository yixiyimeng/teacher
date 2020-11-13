<template>
	<div id="myChart"></div>
</template>

<script>
	import echarts from 'echarts'
	export default {
		data() {
			return {
				myChart: null
			}
		},
		mounted() {
			let that = this;
			this.$nextTick(() => {
				this.myChart = echarts.init($('#myChart')[0]);
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
				// $me.isChart = true;
				var title = [];
				for (var i = 0; i < myoption.length; i++) {
					title.push(myoption[i].name);
				}
				var fontSize = $me.getDpr();
				let option = {
					color: ['#FF999A', '#59ADF3', '#AF89D6', '#af89d6'],
					series: [{
						name: seriesname,
						type: 'pie',
						radius: ['35%', '80%'],
						avoidLabelOverlap: false,
						label: {
							normal: {
								show: true,
								position: 'inner',
								formatter: function(params) {
									//console.log(params);
									return params.name + params.value + '人\n(' + params.percent + '%)';
								},
								textStyle: {
									fontSize: fontSize > 24 ? 18 : 12
								}
							}
						},
						labelLine: {
							normal: {
								show: false
							}
						}
					}]
				};
				option.series[0].data = myoption;
				$me.myChart = echarts.init($('#myChart')[0]);
				$me.myChart.setOption(option);
				setTimeout(function() {
					$me.myChart.resize();
				}, 200);
				$me.myChart.off('click');
				$me.myChart.on('click', function(param) {
					/* 触发点击事件 */
					$me.$emit('handPiechart', title[param.dataIndex], seriesname)

				});
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

			}
		}
	}
</script>

<style>
	#myChart {
		height: 100%;
		min-height: 100px;
	}
</style>

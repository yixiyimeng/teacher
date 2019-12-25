<template>
	<div ref="drawbox" style="position: fixed; z-index: 1; top: 0; left: 0; bottom: 0; right: 0;">
		<canvas id="draw" ref="draw" width="1000" height="500">您的浏览器不支持画布！</canvas>
		<div class="drawbtnbar">
			<!-- <a href="javascript:;" @click="clearDraw" class="edit" title="画笔"><i></i></a> -->
			<a href="javascript:;" @click="clearDraw" class="clear" title="清空"><i></i></a>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false
			}
		},
		/* 画图 */
		mounted() {
			this.show();
		},
		methods: {
			show() {
				// this.isShow = true;
				this.$nextTick(() => {
					let drawbox = this.$refs.drawbox;
					let myCanvas = this.$refs.draw;
					myCanvas.height = drawbox.offsetHeight;
					myCanvas.width = drawbox.offsetWidth;
					var ctx = myCanvas.getContext('2d');
					ctx.strokeStyle = '#f00';
					let isSameMove = false;

					function windowToCanvas(canvas, x, y) {
						var rect = canvas.getBoundingClientRect();
						return {
							x: x - rect.left * (canvas.width / rect.width),
							y: y - rect.top * (canvas.height / rect.height)
						};
					}
					//绘制图形函数
					myCanvas.onpointerdown = function(e) {

						isSameMove = true;
						var ele = windowToCanvas(myCanvas, e.clientX, e.clientY);
						ctx.beginPath();
						ctx.moveTo(ele.x, ele.y);
						myCanvas.onpointermove = function(e) {
							if (isSameMove) {
								var ele = windowToCanvas(myCanvas, e.clientX, e.clientY);
								ctx.lineTo(ele.x, ele.y);
								ctx.stroke();
								ctx.save();
							}
						}
					}
					myCanvas.onpointerup = function(e) {
						isSameMove = false;
					}
				})
			},
			hide() {
				this.isShow = false;
			},
			clearDraw() {
				let myCanvas = this.$refs.draw;
				var ctx = myCanvas.getContext('2d');
				ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
			}
		}

	}
</script>

<style scoped="scoped" lang="less">
	.drawbtnbar {
		position: absolute;
		left: 250px;
		bottom: 40px;

		&>a {
			background: url(../assets/drawbtn.png) no-repeat center top;
			background-size: 50px auto;
			height: 55px;
			width: 50px;
			display: inline-block;

			&>i {
				display: block;
				margin: 0 auto;
			}

			&.edit {
				padding-top: 13px;

				&>i {
					background: url(../assets/edit.png) no-repeat center top;
					background-size: 30px auto;
					height: 30px;
					width: 40px;

				}
			}

			&.clear {
				padding-top: 10px;

				&>i {
					background: url(../assets/clear.png) no-repeat center top;
					background-size: 30px auto;
					height: 30px;
					width: 40px;

				}
			}
		}
	}
</style>

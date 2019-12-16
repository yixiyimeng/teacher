<template>
	<div>
		<canvas id="draw" ref="draw" style="position: fixed; border: 1px solid #f00; z-index: 9999; top: 120px; left: 130px;" width="1000" height="500">您的浏览器不支持画布！</canvas>
		<div></div>
	</div>
</template>

<script>
	/* 画图 */
	mounted() {
		let myCanvas = this.$refs.draw;
		var ctx = myCanvas.getContext('2d');
		ctx.strokeStyle = '#000';
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
	}
	
</script>

<style>
</style>

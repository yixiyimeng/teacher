<template>
	<div ref="drawbox" style="position: fixed; z-index: 10001; top: 0; left: 0; bottom: 0; right: 0;font-family: 'microsoft yahei';">
		<canvas id="draw" touch-action="none" ref="draw" width="1000" height="500">您的浏览器不支持画布！</canvas>
		<div class="drawbtnbar">
			<div class="editbox flex flex-align-center" v-if="showedit">
				<a href="javascript:;" class="lineWidth" @click="penSize = 1" :class="{ active: penSize == 1 }"><i :style="{ background: pColor }"></i></a>
				<a href="javascript:;" class="lineWidth" @click="penSize = 5" :class="{ active: penSize == 5 }"><i :style="{ background: pColor }"></i></a>
				<a href="javascript:;" class="lineWidth" @click="penSize = 8" :class="{ active: penSize == 8 }"><i :style="{ background: pColor }"></i></a>
				<span>|</span>
				<span class="selcolor"></span>
				<div class="colorbox">
					<span @click="pColor = color" :style="{ background: color }" v-for="(color, index) in colorlist" :key="index"></span>
					<!-- <span style="background: #2286D8;"></span>
					<span style="background: #2DA4A8;"></span>
					<span style="background: #000;"></span>
					<span style="background: #FEAA3A;"></span>
					<span style="background: #ccc;"></span> -->
				</div>
			</div>
			<div class="editbox editbox-font flex flex-align-center" v-if="showeditfont">
				<select name="" id="" v-model="fontSize" style="width: 50px;">
					<option value="20">20</option>
					<option value="22">22</option>
					<option value="24">24</option>
					<option value="26">26</option>
				</select>
				<!-- <a-select style="width: 50px;" v-model="fontSize">
					<a-select-option value="12">12</a-select-option>
					<a-select-option value="14">14</a-select-option>
					<a-select-option value="16">16</a-select-option>
					<a-select-option value="18">18</a-select-option>
				</a-select> -->
				<span>|</span>
				<span class="selcolor"></span>
				<div class="colorbox"><span @click="pColor = color" :style="{ background: color }" v-for="(color, index) in colorlist" :key="index"></span></div>
			</div>
			<a
				href="javascript:;"
				@click="
					showedit = !showedit;
					showeditfont = false;
					isFont = false;
					iseditFont = false;
				"
				class="edit"
				title="画笔"
			>
				<i></i>
			</a>
			<a
				href="javascript:;"
				@click="
					showeditfont = !showeditfont;
					showedit = false;
					isFont = true;
					iseditFont = false;
				"
				class="editfont"
				title="文字"
			>
				<i></i>
			</a>
			<a href="javascript:;" @click="cUndoBtn" class="cUndoBtn" title="撤销"><i></i></a>
			<a href="javascript:;" @click="cRedoBtn" class="cUndoBtn cRedoBtn" title="返回"><i></i></a>
			<a href="javascript:;" @click="clearDraw" class="clear" title="清空"><i></i></a>
			<a href="javascript:;" @click="save" class="save" title="保存"><i></i></a>
			<a href="javascript:;" @click="cancel" class="cancel" title="取消"><i></i></a>
			<textarea
				name=""
				id="canvastextarea"
				cols="30"
				rows="4"
				ref="canvastextarea"
				:style="{ color: pColor, borderColor: pColor, fontSize: fontSize + 'px' }"
				:auto-focus="true"
				class="canvastextarea"
				v-show="iseditFont"
			></textarea>
			<span style="white-space: nowrap;visibility:hidden" id="checkcanvastextarea" ref="checkcanvastextarea" :style="{ fontSize: fontSize + 'px' }"></span>
		</div>
	</div>
</template>

<script>
import '@/page/mainPage/assets/js/pep';
export default {
	data() {
		return {
			isShow: false,
			cPushArray: [],
			cStep: -1,
			myCanvas: null,
			penSize: 1,
			pColor: '#f00',
			showedit: false,
			colorlist: ['#f00', '#2286D8', '#2DA4A8', '#000', '#FEAA3A', '#ccc'],
			iseditFont: false,
			showeditfont: false,
			fontSize: 20,
			isFont: false
		};
	},
	/* 画图 */
	mounted() {
		this.show();
	},
	methods: {
		show() {
			var that = this;
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
					that.showedit = false;
					that.showeditfont = false;
					var ele = windowToCanvas(myCanvas, e.clientX, e.clientY);
					// this.iseditFont = true;
					that.$nextTick(() => {
						if (that.isFont) {
							let textarea = that.$refs.canvastextarea;
							if (!that.iseditFont) {
								textarea.style.left = ele['x'] + 'px';
								textarea.style.top = ele['y'] + 'px';
								textarea.focus();
								that.iseditFont = true;
							} else {
								textarea.onblur = function(e) {
									that.drawfont();
								};
							}
						} else {
							isSameMove = true;
							ctx.beginPath();
							ctx.moveTo(ele.x, ele.y);
							myCanvas.onpointermove = function(e) {
								if (isSameMove) {
									var ele = windowToCanvas(myCanvas, e.clientX, e.clientY);
									ctx.lineWidth = that.penSize;
									ctx.strokeStyle = that.pColor;
									ctx.lineTo(ele.x, ele.y);
									ctx.stroke();
									ctx.save();
								}
							};
						}
					});
				};
				myCanvas.onpointerup = function(e) {
					isSameMove = false;
					if (!that.isFont) {
						that.cPush();
					}
				};
			});
		},
		hide() {
			this.isShow = false;
		},
		clearDraw() {
			this.iseditFont = false;
			let myCanvas = this.$refs.draw;
			var ctx = myCanvas.getContext('2d');
			ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
		},
		cPush() {
			var that = this;
			that.cStep++;
			if (that.cStep < that.cPushArray.length) {
				that.cPushArray.length = that.cStep;
			}
			let myCanvas = this.$refs.draw;
			that.cPushArray.push(myCanvas.toDataURL());
		},
		cGet(step) {
			var that = this;
			console.log(that.cPushArray);
			var canvasPic = new Image();
			if (that.cPushArray[step] != '' && that.cPushArray[step] != undefined) {
				canvasPic.src = that.cPushArray[step];
				canvasPic.onload = function() {
					that.clearDraw();
					let myCanvas = that.$refs.draw;
					var ctx = myCanvas.getContext('2d');
					ctx.drawImage(canvasPic, 0, 0);
				};
			}
		},
		cUndoBtn() {
			var that = this;
			that.iseditFont = false;
			if (that.cStep >= 0) {
				that.cStep--;
				if (that.cStep == -1) {
					that.clearDraw();
				} else {
					that.cGet(that.cStep);
				}
			}
		},
		cRedoBtn() {
			var that = this;
			that.drawfont();
			if (that.cStep < that.cPushArray.length - 1) {
				that.cStep++;
				that.cGet(that.cStep);
			}
		},
		editfont() {
			// let myCanvas = this.$refs.draw;
			// let ele = windowToCanvas(myCanvas, e.clientX, e.clientY);
			// this.iseditFont = true;
			// this.$nextTick(() => {
			// 	let textarea = this.$refs.canvastextarea;
			// 	textarea.style.left = ele['x'] + 'px';
			// 	textarea.style.top = ele['y'] + 'px';
			// 	textarea.focus();
			// })
		},
		save() {
			this.$emit('save');
		},
		cancel() {
			this.$emit('cancel');
		},
		drawfont() {
			var that = this;
			let myCanvas = this.$refs.draw;
			var ctx = myCanvas.getContext('2d');
			let textarea = that.$refs.canvastextarea;
			if (textarea.value) {
				//有值的情况
				let top = textarea.offsetTop + 1;
				let m_top = 0;
				ctx.font = that.fontSize + 'px bold Microsoft YaHei';
				m_top = that.fontSize;
				ctx.fillStyle = that.pColor;
				let valueArr = textarea.value.split(/[(\r\n)\r\n]+/);
				let result = this.gettext(valueArr).split('#');
				result.forEach(function(v, i, arr) {
					ctx.fillText(v, textarea.offsetLeft + 1, top + m_top * (i + 1));
				});
				that.iseditFont = false;
				textarea.value = '';
				that.cPush();
			} else {
				that.iseditFont = false;
			}
		},
		gettext(content) {
			// let contentWidth = this.$refs.canvastextarea.offsetWidth;
			let contentWidth = document.getElementById('canvastextarea').offsetWidth;
			let result = '';
			this.testSpanForCheck = '';
			document.getElementById('checkcanvastextarea').innerText = '';
			let that = this;
			$.each(content, function(i, val) {
				var valLength = val.length;
				if (valLength == 0) {
					result += '#';
				} else {
					var pre = '',
						innerVal,
						tempWidth;
					for (var innerI = 0; innerI < valLength; innerI++) {
						innerVal = val.charAt(innerI);
						if (innerVal == ' ') {
							// $("#testSpanForCheck").text($("#testSpanForCheck").text() + "a"); //追加字符，如果为空格则追加为a(innerText方法会将多个空格合并为一个，所以需要转换)
							that.testSpanForCheck = that.testSpanForCheck + 'a';
						} else {
							// $("#tempContent").text($("#tempContent").text() + innerVal); //非空格则直接追加
							that.testSpanForCheck = that.testSpanForCheck + innerVal;
						}
						document.getElementById('checkcanvastextarea').innerText = that.testSpanForCheck;
						// that.$nextTick(() => { //使用nextTick为了保证dom元素都已经渲染完毕
						// tempWidth = that.$refs.checkcanvastextarea.offsetWidth;
						console.log(document.getElementById('checkcanvastextarea'));
						tempWidth = document.getElementById('checkcanvastextarea').offsetWidth;
						//获取添加字符后隐藏域的宽度
						console.log(tempWidth);
						if (tempWidth > contentWidth) {
							result += pre; //如果追加字符后隐藏域宽度大于TextArea宽度，则表明该字符为下一行字符，
							result += '#';
							that.testSpanForCheck = innerVal;
							pre = innerVal;
						} else if (innerI == valLength - 1) {
							result += pre + innerVal; //最后一个字符
							result += '#';
							// that.testSpanForCheck = ''
							pre = '';
						} else {
							pre += innerVal; //依次追加到pre变量中
						}

						// });
					}
				}
			});
			console.log(result);
			return result;
		}
	}
};
</script>

<style scoped="scoped" lang="less">
.drawbtnbar {
	position: absolute;
	left: 250px;
	bottom: 50px;

	& > a {
		background: url(../assets/drawbtn.png) no-repeat center top;
		background-size: 50px auto;
		height: 55px;
		width: 50px;
		display: inline-block;

		& > i {
			display: block;
			margin: 0 auto;
			background: url(../assets/edit.png) no-repeat center top;
			background-size: 30px auto;
			height: 30px;
			width: 40px;
		}

		&.edit {
			padding-top: 13px;
		}

		&.editfont {
			padding-top: 15px;

			& > i {
				background-image: url(../assets/font.png);
			}
		}

		&.clear {
			padding-top: 10px;

			& > i {
				background-image: url(../assets/clear.png);
			}
		}

		&.save {
			padding-top: 13px;

			& > i {
				background-image: url(../assets/saveDraw.png);
			}
		}

		&.cUndoBtn {
			padding-top: 13px;

			& > i {
				background-image: url(../assets/cUndoBtn.png);
			}

			&.cRedoBtn > i {
				transform: scaleX(-1);
			}
		}
		&.cancel {
			padding-top: 13px;
			& > i {
				background-image: url(../assets/cancel.png);
			}
		}
	}
}

.editbox {
	position: fixed;
	bottom: 0;
	font-size-adjust: none;
	font-size: 0;
	border-radius: 5px;
	background: rgba(0, 0, 0, 0.4);
	padding: 5px 10px;
	left: 250px;

	&.editbox-font {
		left: 310px;
	}

	&:after {
		content: '';
		display: block;
		height: 0;
		width: 0;
		border: 8px solid transparent;
		border-bottom-color: rgba(0, 0, 0, 0.4);
		position: absolute;
		top: -16px;
		left: 16px;
	}

	.lineWidth {
		height: 30px;
		width: 30px;
		border: 1px solid transparent;
		border-radius: 5px;
		display: inline-block;
		padding-top: 13px;

		&.active {
			border: 1px solid #ddd;
		}

		i {
			height: 3px;
			width: 3px;
			background: #f00;
			border-radius: 100%;
			display: block;
			margin: 0 auto;
			// box-shadow: 0 0 10px rgba(inherit ,.5)
		}

		&:nth-child(2) {
			padding-top: 11px;

			i {
				height: 8px;
				width: 8px;
			}
		}

		&:nth-child(3) {
			padding-top: 8px;

			i {
				height: 12px;
				width: 12px;
			}
		}
	}

	.colorbox {
		width: 60px;
		margin-left: 10px;

		span {
			height: 15px;
			width: 15px;
			background: #f00;
			display: inline-block;
			border: 1px solid #ddd;
			cursor: pointer;
			margin: 2px;
			border-radius: 2px;

			&.active {
				box-shadow: 0 0 3px rgba(0, 0, 0, 0.95);
				transform: scale(1.2);
			}
		}
	}
}

.canvastextarea {
	position: fixed;
	top: 0;
	left: 0;
	border: 1px solid #ddd;
	font-size: 18px;
	resize: auto;
	line-height: 1;
	// font-family: "ms sans serif";
}
</style>

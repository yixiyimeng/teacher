<template>
	<div id="suspension">
		<div class="rightBtnlist" @mouseenter="setbgwin" @mouseleave="setsmwin" :class="{active:ishover}">
			<a href="javascript:;" class="kjbtn">
				<div class="la-ball-scale-multiple">
					<div></div>
					<div></div>
					<div></div>
				</div>
			</a>
			<a href="javascript:;" class="minApp" @click="minApp" title="最小化" v-if="!isminimizeAppStatesub"><img src="../assets/min.png" alt="" /></a>
			<a href="javascript:;" class="minApp" @click="maxApp" title="最大化" v-if="isminimizeAppStatesub"><img src="../assets/max.png" alt="" /></a>
			<a href="javascript:;" class="exitBtn mt10" @click="exitBtn" title="下课" v-if="onlinedirebro"></a>
			<!-- <a href="javascript:;" class="uploadTitle mt10" @click="uploadTitle" title="上传题目" v-if="isUploadfile"><img src="../../mainPage/assets/upload.png" alt="" /></a> -->
			<a href="javascript:;" class="exitApp mt10" @click="exitBtnApp" title="退出"><img src="../assets/exit.png" alt="" /></a>
		</div>
	</div>
</template>

<script>
export default {
	name: 'suspension',
	data() {
		return {
			isminimizeAppStatesub: false, //是否最小化
			onlinedirebro: true, //是否连接直播间
			isUploadfile:false,//是否可以上传题目
			ishover:false
		};
	},
	mounted() {
		let win = this.$electron.remote.getCurrentWindow();
		let biasX = 0;
		let biasY = 0;
		let that = this;
		document.addEventListener('mousedown', function(e) {
			switch (e.button) {
				case 0:
					biasX = e.x;
					biasY = e.y;
					document.addEventListener('mousemove', moveEvent);
					break;
				case 2:
					that.$electron.ipcRenderer.send('createSuspensionMenu');
					break;
			}
		});

		document.addEventListener('mouseup', function() {
			biasX = 0;
			biasY = 0;
			document.removeEventListener('mousemove', moveEvent);
		});

		function moveEvent(e) {
			win.setPosition(e.screenX - biasX, e.screenY - biasY);
		}
	},
	created() {
		const _this = this;
		/* 是否最小化 */
		_this.$electron.ipcRenderer.on('isminimizeAppsub', (event, flag) => {
			_this.isminimizeAppStatesub = flag;
		});
		/* 是否上课 */
		_this.$electron.ipcRenderer.on('onlinedirebro', (event, flag) => {
			_this.onlinedirebro = flag;
		});
		/* 是否上传题目 */
		_this.$electron.ipcRenderer.on('isUploadfile', (event, flag) => {
			_this.isUploadfile = flag;
		});
		/* 是否改变了窗口大小 */
		_this.$electron.ipcRenderer.on('isresize', (event,flag) => {
			if(!flag){
				_this.ishover = true;
			}
			
		});
		document.addEventListener('drag',function(event){
			event.preventDefault()
		},false);
		document.addEventListener('dragstart',function(event){
			event.preventDefault()
		},false);
		document.addEventListener('dragend',function(event){
			event.preventDefault()
		},false);
		document.addEventListener('dragover',function(event){
			event.preventDefault()
		},false);
		document.addEventListener('dragenter',function(event){
			event.preventDefault()
		},false);
		document.addEventListener('dragleave',function(event){
			event.preventDefault()
		},false);
		document.addEventListener('drop',function(event){
			event.preventDefault()
		},false);
	},
	methods: {
		minApp: function() {
			this.$electron.ipcRenderer.send('minApp');
		},
		maxApp: function() {
			this.$electron.ipcRenderer.send('maxApp');
		},
		exitBtn: function() {
			/* 退出直播间 */
			this.$electron.ipcRenderer.send('isexitdirebro');
		},
		uploadTitle() {
			/*上传题目*/
			this.$electron.ipcRenderer.send("isuploadTitle");
		},
		exitBtnApp() {
			/* 退出程序 */
			this.$electron.ipcRenderer.send('isexitApp');
		},
		setbgwin(){
			this.$electron.ipcRenderer.send('lgwin');
		},
		setsmwin(){
			this.ishover=false
			this.$electron.ipcRenderer.send('smwin');
		
			
		}
	}
};
</script>

<style>
* { 
	padding: 0;
	margin: 0;
	-webkit-app-region: no-drag;
	font-family: "microsoft yahei";
}
#suspension {
	position: relative;
}
#suspension .apptitle {
	background: rgba(255, 0, 0, 0.6);
	width: 110px;
	height: 40px;
	line-height: 40px;
	border-radius: 20px;
	color: #fff;
	font-size: 20px;
	text-align: center;
	cursor: pointer;
}
.rightBtnlist {
	margin: 0 auto;
	width: 45px;
	min-height: 45px;
	position: relative;
	padding-top: 3px;
	
}

.rightBtnlist .uploadTitle,
.rightBtnlist .exitApp,
.rightBtnlist .minApp,
.rightBtnlist .exitBtn {
	opacity: 0;
	transition: all 0.3s;
	 display: none; 
}
/* .rightBtnlist:hover .uploadTitle,
.rightBtnlist:hover .exitApp,
.rightBtnlist:hover .minApp,
.rightBtnlist:hover .exitBtn {
	opacity: 1;
	position: relative;
	z-index: 999;
	display: block;
} */
.rightBtnlist.active .exitApp,
.rightBtnlist.active .minApp,
.rightBtnlist.active .exitBtn {
	opacity: 1;
	position: relative;
	z-index: 999;
	display: block;
} 
.rightBtnlist .kjbtn {
	opacity: 1;
	transition: all 0.3s;
	background: rgba(0, 0, 0, 0.4);
	border-radius: 20%;
	display: block;
	padding: 5px;
	position: absolute;
	top: 3px;
}
.rightBtnlist.active .kjbtn {
	opacity: 0;
}
.exitApp,
.uploadTitle,
.minApp,
.exitBtn{
	background: rgba(255, 0, 0, 0.6);
	color: #fff;
	display: block;
	width: 45px;
	height: 45px;
	box-sizing: border-box;
	padding: 10px;
	border-radius: 50px;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
	text-align: center;
	z-index: 99999;
	-webkit-app-region: no-drag;
}
.exitBtn {
	background: rgba(230, 162, 60, 0.9) url(../assets/exitvideo.png) center center no-repeat;
	background-size: 30px;

	
}
.uploadTitle,
.minApp {
	margin-bottom: 10px;
	background: rgba(24, 114, 255, 0.9);
}
.uploadTitle img,
.exitApp img,
.minApp img {
	width: 25px;
	display: inline-block;
}
.la-ball-scale-multiple,
.la-ball-scale-multiple>div {
	position: relative;
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box
}

.la-ball-scale-multiple {
	display: block;
	font-size: 0;
	color: #fff;

}

.la-ball-scale-multiple.la-dark {
	color: #333
}

.la-ball-scale-multiple>div {
	display: inline-block;
	float: none;
	background-color: currentColor;
	border: 0 solid currentColor
}

.la-ball-scale-multiple {
	width: 32px;
	height: 32px
}

.la-ball-scale-multiple>div {
	position: absolute;
	top: 0;
	left: 0;
	width: 32px;
	height: 32px;
	border-radius: 100%;
	opacity: 0;
	-webkit-animation: ball-scale-multiple 2s 0s linear infinite;
	-moz-animation: ball-scale-multiple 2s 0s linear infinite;
	-o-animation: ball-scale-multiple 2s 0s linear infinite;
	animation: ball-scale-multiple 2s 0s linear infinite
}

.la-ball-scale-multiple>div:nth-child(2) {
	-webkit-animation-delay: .2s;
	-moz-animation-delay: .2s;
	-o-animation-delay: .2s;
	animation-delay: .2s
}

.la-ball-scale-multiple>div:nth-child(3) {
	-webkit-animation-delay: .4s;
	-moz-animation-delay: .4s;
	-o-animation-delay: .4s;
	animation-delay: .4s
}

.la-ball-scale-multiple.la-sm {
	width: 16px;
	height: 16px
}

.la-ball-scale-multiple.la-sm>div {
	width: 16px;
	height: 16px
}

.la-ball-scale-multiple.la-2x {
	width: 64px;
	height: 64px
}

.la-ball-scale-multiple.la-2x>div {
	width: 64px;
	height: 64px
}

.la-ball-scale-multiple.la-3x {
	width: 96px;
	height: 96px
}

.la-ball-scale-multiple.la-3x>div {
	width: 96px;
	height: 96px
}

@-webkit-keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-webkit-transform: scale(0);
		transform: scale(0)
	}

	5% {
		opacity: .75
	}

	100% {
		opacity: 0;
		-webkit-transform: scale(1);
		transform: scale(1)
	}
}

@-moz-keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-moz-transform: scale(0);
		transform: scale(0)
	}

	5% {
		opacity: .75
	}

	100% {
		opacity: 0;
		-moz-transform: scale(1);
		transform: scale(1)
	}
}

@-o-keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-o-transform: scale(0);
		transform: scale(0)
	}

	5% {
		opacity: .75
	}

	100% {
		opacity: 0;
		-o-transform: scale(1);
		transform: scale(1)
	}
}

@keyframes ball-scale-multiple {
	0% {
		opacity: 0;
		-webkit-transform: scale(0);
		-moz-transform: scale(0);
		-o-transform: scale(0);
		transform: scale(0)
	}

	5% {
		opacity: .75
	}

	100% {
		opacity: 0;
		-webkit-transform: scale(1);
		-moz-transform: scale(1);
		-o-transform: scale(1);
		transform: scale(1)
	}
}
.mt10{
	margin-top: 10px;
	}
</style>

<template>
	<div class="pageview">
		<audio :src="bgAudio" autoplay="autoplay" autobuffer loop="loop" id="audio" style="z-index: 999;position: absolute;"></audio>
		<audio :src="prizeAudio" autoplay="autoplay" autobuffer id="prizeaudio" style="z-index: 999;position: absolute;"></audio>
		<audio :src="rankAudio" autoplay="autoplay" autobuffer id="rankaudio" style="z-index: 999;position: absolute;"></audio>
		<div class="stage" :class="{ active: isActive }">
			<img src="static/img/11.png" class="title" />
			<img src="static/img/12.png" class="map" />
			<img src="static/img/14.png" class="pirate" @click="playbgAudio" />
			<div class="bg">
				<div class="lamp"></div>
				<div class="chest"></div>
				<div class="redbox"></div>
			</div>
		</div>
		<div class="couten"></div>
		<div class="rankbox">
			<div class="rank-item" v-for="(item,index) in ranklist" :key="index">
				<div>
					<div>
						<div class="name">{{item.stuName}}</div>
						<div class="num">
							<i></i>
							<span>+{{item.score}}</span>
						</div>
					</div>
				</div>
			</div>
			<!-- <div class="rank-item">
				<div>
					<div>
						<div class="name">张三</div>
						<div class="num">
							<i></i>
							<span>+12</span>
						</div>
					</div>
				</div>
			</div>
			<div class="rank-item">
				<div>
					<div>
						<div class="name">张三</div>
						<div class="num">
							<i></i>
							<span>+12</span>
						</div>
					</div>
				</div>
			</div>
			<div class="rank-item">
				<div>
					<div>
						<div class="name">张三</div>
						<div class="num">
							<i></i>
							<span>+12</span>
						</div>
					</div>
				</div>
			</div>
			<div class="rank-item">
				<div>
					<div>
						<div class="name">张三</div>
						<div class="num">
							<i></i>
							<span>+12</span>
						</div>
					</div>
				</div>
			</div> -->
		</div>
	</div>
</template>

<script>
import { urlPath, urlwsPath, htmlescpe, allenglish, allchinese } from '@/page/mainPage/utils/base';
let num = 0;
let list = [];
let timer = null,
	stimer = null;
let images = [];
function addredenvelope(info) {
	const win = parseInt($('.couten').css('width'));
	$('.couten').css({
		opacity: 1
	});
	var hb = parseInt(Math.random() * (3 - 1) + 1);
	var Wh = parseInt(Math.random() * (70 - 30) + 20);
	var Left = parseInt(Math.random() * (win / 200 - 0) + 0);
	var rot = parseInt(Math.random() * (45 - -45) - 45) + 'deg';
	num++;
	var time = new Date().getTime();
	var deybottom = 0;
	if (list[Left] && $('.li' + list[Left]).length > 0) {
		try {
			var reg = /matrix.((.+([, ]+)?){6})./g;
			var str = $('.li' + list[Left]).css('transform');
			// console.log(str);
			var arr = reg.exec(str);
			var newarr = arr[1].split(/[, ]+/g);
			// console.log(newarr[5]);
			var leftbottom = parseFloat(newarr[5]);
			if (leftbottom < 0) {
				var oldflytypehight = parseInt($('.li' + list[Left]).css('height')) < 160 ? 160 : parseInt($('.li' + this.list[Left]).css('height'));
				// deybottom = leftbottom - oldflytypehight;
				deybottom = leftbottom * -1;
			}
		} catch (e) {
			//TODO handle the exception
		}
	}
	list[Left] = time;
	$('.couten').append("<li class='li" + time + "' ><a href='javascript:;'><img src='static/img/8.png'/>" + '</a></li>');
	var h = ($('.li' + time).height() + deybottom + 40) * -1;
	$('.li' + time).css({
		left: Left * 200,
		'-webkit-transform': 'translateY(' + h + 'px)',
		transform: 'translateY(' + h + 'px)'
	});
	let speed = 1 / ($('.couten').height() + $('.li' + time).height() + 20);
	// console.log('speed',speed)
	var hhh = ($('.couten').height() + 20) * -1;
	var hhh2 = $('.couten').height() / 3 + Math.floor(Math.random() * 100) + 1;
	var hhh3 = $('.couten').height() + 20;
	let rate = (hhh3 - h) * speed;
	let rate2 = (hhh2 - h) * speed;
	if (info != 0) {
		$('.li' + time).css({
			'-webkit-transform': 'translateY(' + hhh2 + 'px)',
			transform: 'translateY(' + hhh2 + 'px)',
			'-webkit-transition-duration': rate2 * 5 + 's',
			'transition-duration': rate2 * 5 + 's',
			'transition-timing-function': 'linear',
			'-webkit-transition-timing-function': 'linear'
		});
		$('.li' + time).on('transitionend webkitTransitionEnd', function() {
			// console.log($(this).css('left'))
			borad({
				left: $(this).css('left'),
				top: hhh2
			},info.score,info.stuName);
			$(this).remove();
			//document.getElementById('jbaudio').fastSeek(0);
			// $('#jbaudio')[0].fastSeek(0);
			$('#prizeaudio')[0].play();
		});
	} else {
		$('.li' + time).css({
			'-webkit-transform': 'translateY(' + hhh3 + 'px)',
			transform: 'translateY(' + hhh3 + 'px)',
			'-webkit-transition-duration': rate * 5 + 's',
			'transition-duration': rate * 5 + 's',
			'transition-timing-function': 'linear',
			'-webkit-transition-timing-function': 'linear'
		});
		$('.li' + time).on('transitionend webkitTransitionEnd', function() {
			$(this).remove();
		});
	}
}

function borad(info,score,stuName) {
	var time = new Date().getTime();
	$('.couten').append(
		"<div class='prizebox" +
			time +
			" prizebox' style='left:" +
			(parseInt(info.left) + 100) +
			'px;top:' +
			info.top +
			"px'><div class='imgbox'><img src='static/img/13.png'/></div><div class='name'>"+stuName+"</div><div class='num'><i></i><span>+"+score+"</span></div></div>"
	);
	$('.prizebox' + time).on('animationEnd webkitAnimationEnd', function() {
		$(this).remove();
	});
}
export default {
	data() {
		return {
			isActive: false,
			bgAudio: __static + '/img/2.mp3',
			prizeAudio: __static + '/img/preview.mp3',
			rankAudio: __static + '/img/rank.mp3',
			ranklist:[]
		};
	},
	mounted() {
		let _this = this;
		/* 接受websock   */
		_this.onmessage();
		const w = parseInt($('.couten').width() / 200) * 200;
		const l = ($('.couten').width() - w) / 2 + $('.couten')[0].offsetLeft;
		$('.couten').css({
			width: w,
			left: l
		});
		let redpacklist = [1, 1, 2, 3, 4, 5, 6];
		setTimeout(() => {
			this.isActive = true;
			var snum = 30;

			var redboxheight = $('.redbox').height();
			var assets = ['/static/img/7.png', '/static/img/8.png'];
			assets.forEach(function(src, index) {
				assets[index] = new Promise(function(resolve) {
					var img = new Image();
					img.onload = resolve.bind(null, img);
					img.src = src;
				});
			});
			Promise.all(assets).then(function(images) {
				images = images;
				setTimeout(() => {
					addredEnvelope(images);
					stimer = setInterval(() => {
						snum--;
						if (snum == 0) {
							clearInterval(stimer);
							return false;
						}
						addredEnvelope(images);
					}, 140);
				}, 1600);
				/* 6秒后， 下红包雨，抢红包，清空 redbox */
				setTimeout(() => {
					$('.redbox').html();
					/* 下发抢红包事件 */
					_this.Answerstar();
					timer = setInterval(() => {
						// if (redpacklist.length > 0) {
						// 	let redpack = redpacklist.shift();
						// 	addredenvelope(redpack);
						// }
						addredenvelope(0);
					}, 500);
				}, 6000);
				/* 出现排行榜 */
				setTimeout(() => {
					// $('#rankaudio')[0].play();
					clearInterval(timer);
					$('.couten').html('');
					_this.redWarslist()
				}, 16000);
			});

			function addredEnvelope(images) {
				let src = images[Math.floor(Math.random() * 2)].src;
				let time = new Date().getTime() + '1' + Math.floor(Math.random() * 20);
				$('.redbox').append("<img src='" + src + "' id='" + time + "' class='redpack'/>");
				$('#' + time).css({
					transform: 'translate(140px,' + (redboxheight - 80) + 'px) scale(.5, .5)',
					width: 50 + Math.floor(Math.random() * 50) + 'px',
					position: 'absolute'
				});

				addAiction(time);
			}

			function addAiction(time) {
				let left = Math.floor(Math.random() * 300);
				setTimeout(() => {
					$('#' + time)
						.css({
							// "left": Math.floor(Math.random() * 100) + '%',
							transform: 'translate(' + left + 'px,-100px) scale(1,1)',
							'-webkit-transition-duration': 2 + 's',
							'transition-duration': 2 + 's',
							'transition-timing-function': 'linear',
							'-webkit-transition-timing-function': 'linear'
						})
						.on('transitionend webkitTransitionEnd', function() {
							$(this).remove();
						});
				}, 10);
			}
		}, 100);
	},
	methods: {
		Answerstar() {
			/* 普通题目调用接口 */
			const $me = this;
			var url = '',
				judgetype = '';
			judgetype = 6;
			url = 'redWars/start';
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/' + url,
				headers: {
					'Content-Type': 'application/json; charset=UTF-8'
				},
				data: JSON.stringify({ questionType: judgetype })
			})
				.then(da => {
					if (da.data.ret == 'success') {
					}
				})
				.catch(function(err) {});
		},
		Answerstop(isNext, PrevIndex) {
			/* 结束答题 */
			var url = 'redWars/stop';
			const $me = this;

			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/' + url
			}).then(da => {
					$('#audio')[0].paused();
				})
				.catch(function(err) {});
		},
		playbgAudio() {
			$('#audio')[0].currentTime = 0;
			$('#audio')[0].play();
		},
		/* 抢红包排名 */
		redWarslist() {
			const $me = this;
			this.$http({
				method: 'post',
				url: urlPath + 'teacher-client/redWars/getScores'
			}).then(da => {
				var list = da.data.data;
				var str = '';
				var len = list.length > 5 ? 5 : list.length;
				$me.ranklist = list.length > 5 ? list.slice(0, 5) : list;
				$me.isRank = true;
				$me.Answerstop();
				this.$nextTick(()=>{
					$('.rankbox .rank-item').addClass('fadeInUp');
					setTimeout(() => {
						$('.rankbox .rank-item')
							.removeClass('fadeInUp')
							.addClass('fadeOutUp');
					},2000);
				})
				
				
			});
		},
		onmessage() {
			let $me = this;
			/* 连接websock */
			this.$store.dispatch('STAFF_WEBSOCKET');
			this.$store.getters.STAFF_UPDATE.onmessage = function(evt) {
				var received_msg = evt.data;
				if (received_msg != '连接成功') {
					var msg = JSON.parse(received_msg);
					var obj = msg.data;
					switch (msg.reqType) {
						case 0: {
							if (msg.businessType == 6) {
								/*抢红包*/
								addredenvelope(msg.data);
							} 
							break;
						}
					}
				} else {
				
				}
			};
		},
	}
};
</script>

<style lang="less">
.pageview {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	overflow: hidden;
}
.redpack {
	position: absolute;
	width: 99px;
}
.stage {
	.bg {
		width: 100%;
		height: 100%;
		background: url(../../assets/img/bg.png) no-repeat center bottom;
		background-size: 100% auto;
		position: absolute;
		bottom: -30%;
		opacity: 0;
		left: 0;
		.lamp {
			height: 154px;
			width: 365px;
			background: url(../../assets/img/10.png) no-repeat center center;
			position: absolute;
			bottom: -30px;
			left: 50%;
			transform: translateX(-50%);
		}
		.chest {
			width: calc(880px / 4);
			height: 241px;
			background: url(../../assets/img/5.png);
			background-size: 880px;
			animation: sprite5 0.5s steps(3) 1.1s 1 both;
			position: absolute;
			bottom: 50px;
			left: 50%;
			transform: translateX(-50%);
		}
		.redbox {
			position: absolute;
			width: 400px;
			top: 0;
			bottom: 130px;
			left: 50%;
			transform: translateX(-50%);
		}
	} /* 海盗 */
	.pirate {
		position: absolute;

		right: -300px;
		z-index: 999;
		transition: all 1.2s;
		bottom: 0;
	}
	/* 标题 */
	.title {
		position: absolute;
		top: -100%;
		left: 50%;
		transform: translateX(-50%);
		width: 300px;
		transition: all 0.6s;
	}
	/* 地图 */
	.map {
		position: absolute;
		top: -20px;
		left: -100%;
		transition: all 0.6s;
		width: 300px;
	}
	&.active {
		.bg {
			opacity: 1;
			animation: movebg 1s 1 forwards;
		}
		.title {
			top: 0;
		}
		.map {
			left: -40px;
		}
		.pirate {
			right: 10%;
			transform: translate3d(0, 0, 0);
		}
	}
}

.couten {
	height: 100%;
	width: 80%;
	top: 0%;
	left: 10%;
	position: absolute;
}

.couten li {
	position: absolute;
	height: 100px;
	width: 100px;
	margin: 0 50px;
	top: 0;
}
.couten li img {
	width: 100%;
}
.prizebox {
	position: absolute;
	top: 50%;
	animation: 1.5s fadeOutUp;
	-webkit-transform: translate3d(-50%, 0, 0);
	transform: translate3d(-50%, 0, 0);
	opacity: 0;
}
.prizebox .imgbox {
	width: 100px;
	height: 100px;
	border: 5px solid #8b5731;
	border-radius: 100%;
	overflow: hidden;
	background: #fffcda;
}
.prizebox .imgbox img {
	display: block;
	width: 95px;
	margin: 0 auto;
}
.prizebox .name {
	background: #8b5731;
	color: #fff;
	font-size: 20px;
	text-align: center;
	padding: 0 20px;
	line-height: 33px;
	border-radius: 50px;
	width: 95px;
	position: absolute;
	left: 50%;
	top: 100px;
	transform: translateX(-50%);
}
.prizebox .num {
	text-align: center;
	color: #1d58b9;
	font-size: 20px;
	top: 133px;
	position: absolute;
	width: 100%;
}
.prizebox .num i {
	display: inline-block;
	background: url(../../assets/img/15.png) no-repeat center center;
	height: 23px;
	width: 23px;
	margin-right: 8px;
}
.prizebox .num i,
.prizebox .num span {
	vertical-align: middle;
}
.rankbox {
	position: absolute;
	top: 200px;
	left: 0;
	right: 0;
	.rank-item {
		position: absolute;
		top: 0;
		left: 0;
		& > div {
			position: relative;
			background: no-repeat center center;
			width: 206px;
			height: 318px;
			opacity: 0;
			-webkit-transform: translate3d(0, 80px, 0);
			transform: translate3d(0, 80px, 0);
		}
		&.fadeInUp > div {
			animation: fadeInUp 1s 1 both;
		}
		&.fadeOutUp > div {
			animation: fadeOutUp2 0.5s 1 both;
		}
		&:first-child > div {
			background-image: url(../../assets/img/rank/1.png);
		}
		&:nth-child(2) > div {
			background-image: url(../../assets/img/rank/2.png);
			animation-delay: 0.2s;
		}
		&:nth-child(3) > div {
			background-image: url(../../assets/img/rank/3.png);
			animation-delay: 0.2s;
		}
		&:nth-child(4) > div {
			background-image: url(../../assets/img/rank/4.png);
			animation-delay: 0.4s;
		}
		&:nth-child(5) > div {
			background-image: url(../../assets/img/rank/5.png);
			animation-delay: 0.4s;
		}
		&:first-child {
			left: 50%;
			transform: translate(-50%, -36px);
		}
		&:nth-child(2) {
			left: 50%;
			transform: translateX(-350px);
			top: 60px;
		}
		&:nth-child(3) {
			left: 50%;
			transform: translateX(150px);
			top: 60px;
		}
		&:nth-child(4) {
			left: 50%;
			transform: translateX(-50%);
			transform: translateX(-600px);
			top: 120px;
		}
		&:nth-child(5) {
			left: 50%;
			transform: translateX(400px);
			top: 120px;
		}
		&:first-child > div > div {
			bottom: 30px;
		}
		& > div > div {
			position: absolute;
			bottom: 46px;
			width: 100%;
			text-align: center;
		}
		.name {
			color: #8b5731;
			font-size: 24px;
			text-align: center;
			font-weight: 500;
			width: 110px;
			margin: 0 auto;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		.num {
			text-align: center;
			color: #1d58b9;
			font-size: 14px;
			width: 100%;
		}
		.num i {
			display: inline-block;
			background: url(../../assets/img/15.png) no-repeat center center;
			background-size: cover;
			height: 16px;
			width: 16px;
			margin-right: 8px;
		}
		.num i,
		.num span {
			vertical-align: middle;
		}
	}
}

@-webkit-keyframes fadeOutUp {
	0% {
		opacity: 1;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
	}
	16% {
		opacity: 1;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
	}

	100% {
		opacity: 0;
		-webkit-transform: translate3d(-50%, -100%, 0);
		transform: translate3d(-50%, -100%, 0);
	}
}

@keyframes fadeOutUp {
	0% {
		opacity: 1;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
	}
	16% {
		opacity: 1;
		-webkit-transform: translate3d(-50%, 0, 0);
		transform: translate3d(-50%, 0, 0);
	}

	100% {
		opacity: 0;
		-webkit-transform: translate3d(-50%, -100%, 0);
		transform: translate3d(-50%, -100%, 0);
	}
}
@keyframes movebg {
	0% {
		bottom: -100px;
		opacity: 0.5;
	}

	100% {
		bottom: 0;
		opacity: 1;
	}
}
@keyframes sprite5 {
	0% {
		background-position: 0 0;
	}

	100% {
		background-position: -660px 0;
	}
}
@-webkit-keyframes fadeInUp {
	0% {
		opacity: 0;
		-webkit-transform: translate3d(0, 80px, 0);
		transform: translate3d(0, 80px, 0);
	}
	/* 10% {
			    opacity: 1;
			    -webkit-transform: translate3d(0,80px, 0);
			    transform: translate3d(0,80px, 0);
			  } */
	100% {
		opacity: 1;
		-webkit-transform: none;
		transform: none;
	}
}

@keyframes fadeInUp {
	0% {
		opacity: 0;
		-webkit-transform: translate3d(0, 80px, 0);
		transform: translate3d(0, 80px, 0);
	}
	/* 10% {
			      opacity: 1;
			      -webkit-transform: translate3d(0,60px, 0);
			      transform: translate3d(0,60px, 0);
			    } */
	100% {
		opacity: 1;
		-webkit-transform: none;
		transform: none;
	}
}

.fadeInUp {
	-webkit-animation-name: fadeInUp;
	animation-name: fadeInUp;
}

@-webkit-keyframes fadeOutUp2 {
	0% {
		opacity: 1;
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
	}

	100% {
		opacity: 0;
		-webkit-transform: translate3d(0, -100%, 0);
		transform: translate3d(0, -100%, 0);
	}
}

@keyframes fadeOutUp2 {
	0% {
		opacity: 1;
		-webkit-transform: translate3d(0, 0, 0);
		transform: translate3d(0, 0, 0);
	}

	100% {
		opacity: 0;
		-webkit-transform: translate3d(0, -100%, 0);
		transform: translate3d(0, -100%, 0);
	}
}
</style>

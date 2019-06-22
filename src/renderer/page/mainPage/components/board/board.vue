<template>
	<div class="fixed ">
		<div class="board">
			<span>正确答案</span>
			<span class="warn">{{ trueAnswer | filtertrueAnswer }}</span>
		</div>
		<i></i>
		<i></i>
		<i></i>
		<i></i>
	</div>
</template>

<script>
export default {
	name: 'board',
	data() {
		return {};
	},

	props: {
		trueAnswer: String
	},
	filters: {
		filtertrueAnswer: function(value) {
			if (value == 'E') {
				return '√';
			} else if (value == 'F') {
				return '×';
			} else {
				return value;
			}
		}
	}
};
</script>

<style scoped="scoped">
@-webkit-keyframes floaty {
	0%,
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
	50% {
		-webkit-transform: translateY(1rem);
		transform: translateY(1rem);
	}
}

@keyframes floaty {
	0%,
	100% {
		-webkit-transform: translateY(0);
		transform: translateY(0);
	}
	50% {
		-webkit-transform: translateY(1rem);
		transform: translateY(1rem);
	}
}
.fixed {
	position: fixed;
	top: 0;
	right: 40px;
	transition: all 5s;
	/* background: #fff; */
	border-radius: 10px;
}
.fixed i {
	display: block;
	width: 12px;
	height: 32px;
	position: absolute;
	background: url(../../assets/notice2.png);
	top: 0;
}
.fixed i:nth-child(2) {
	left: 40px;
}

.fixed i:nth-child(3) {
	left: 60px;
}
.fixed i:nth-child(4) {
	right: 20px;
}
.fixed i:nth-child(5) {
	right: 40px;
}
.board {
	margin-top: 15px;
	width: 200px;
	text-align: center;
	padding: 20px 0 10px;
	box-sizing: border-box;
	font-size: 30px;
	/* border: 3px solid rgba(16, 120, 255, 0.8); */
	border-radius: 5px;
	background: #f9f6cf;
		box-shadow: 0 0 10px rgba(0,0,0,.4);
	/* display: none; */
}
/* .board {
	-webkit-animation-name: floaty;
	animation-name: floaty;
	-webkit-animation-duration: 5s;
	animation-duration: 5s;
	-webkit-animation-timing-function: ease-in-out;
	animation-timing-function: ease-in-out;
	-webkit-animation-iteration-count: infinite;
	animation-iteration-count: infinite;
} */

.board span {
	display: block;
	vertical-align: middle;
	/* transform: rotate(15deg); */
	text-align: center;
}

.board span.warn {
	font-size: 40px;
	color: #f00;
	font-weight: bold;
	margin-top: 10px;
}
</style>

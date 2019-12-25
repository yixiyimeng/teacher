<template>
	<transition name="bounce">
		<div class="reftext ">
			<div class="txt" :class="{'active':showmore}">
				<div class="title">{{ reftext }}
					<!-- <div class="imgbox" @click="isplay=!isplay">
						<img src="../assets/play.png" alt="" v-if="!isplay">
						<img src="../assets/play.gif" alt="" v-if="isplay">
					</div> -->
				</div>
				<!-- <div class="questionlist">
					<span :class="{'active':item.isPlayed}" v-for="(item,index) in question" :key="index">{{item.word||item.text}}</span>
				</div>
				<span class="more" @click="showmore=!showmore"><i></i></span> -->
			</div>


		</div>
	</transition>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
		data() {
			return {
				showmore: false,
				isplay: false,
				// reftext: '',
				question: []
			}
		},
		props: {
			reftext: {
				type: String,
				default: ''
			},
			questionType: {
				type: [String, Number],
				default: 0
			}
		},
		computed: {
			...mapState(['selectWordList', 'selectSentenceList']),
		},
		created() {
			this.question=this.questionType==0?this.selectWordList:this.selectSentenceList
		},
		watch:{
			questionType(newval,oldval){
				if(newval!=oldval){
					this.question=this.questionType==0?this.selectWordList:this.selectSentenceList
				}
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.imgbox {
		display: inline-block;

		// position: absolute;
		// right: 0;
		img {
			display: block;
			width: 30px;
		}

	}
</style>

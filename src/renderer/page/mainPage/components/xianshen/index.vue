<template>
	<div class="setEnglishBox" v-if="isShowWin">
		<div class="hd flex flex-pack-justify">
			<span>设置语音题</span>
			<a href="javascript:;" class="close" @click="isShowWin=false"></a>
		</div>
		<div class="bd">
			<div class="selectbar flex ">
				<div class="material flex-1">
					<label>教材</label>
					<span>{{mateVersion.materials}}{{gradeobj.unit}}</span>
					<a href="javascript:;" class="change" @click="show=!show">更换教材</a>
				</div>
				<div class="unit flex-1 flex">
					<label>单元</label>
					<div class="unitBox flex-1" @mouseleave="showUnitlist=false">
						<span @click="showUnitlist=!showUnitlist">{{groupobj.group}}</span>
						<ul v-if="showUnitlist">
							<li v-for="(item,index) in unitList" @click="changeUnit(item)" :key="index">{{item.group}}</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="lessonbar">
				<div class="flex flex-align-center"><label>课时</label>
					<div class="lessonlist" @mouseleave="showlesson=false">
						<span @click="showlesson=!showlesson">{{lessonsobj.lessons}}</span>
						<ul v-if="showlesson">
							<li @click="changeLessons(item)" v-for="(item,index) in lessonsList" :key="index">{{item.lessons}}</li>
						</ul>
					</div>
				</div>
				<div class="flex flex-align-center"><label>题型</label>
					<div class="tags">
						<span :class="{active:tag==0}" @click="tag=0">不限</span>
						<span :class="{active:tag==1}" @click="tag=1">单词跟读</span>
						<span :class="{active:tag==2}" @click="tag=2">句子跟读</span>
					</div>
				</div>

			</div>
			<div class="lessonbox">
				<div class="modbox" v-if="tag!=2">
					<div class="modbox-hd">
						单词跟读 <span>(划掉你不需要的单词)</span>
					</div>
					<div class="modbox-bd">
						<span v-for="(item,index) in wordList" :key="index" :class="{cancel:item.cancel}" @click="item.cancel=!item.cancel">{{item.word}}</span>
					</div>
					<div class="modbox-ft">
						<span v-if="isSlectWord">共{{wordLen}}个单词</span>
						<a href="javascript:;" v-if="!isSlectWord" @click="isSlectWord=!isSlectWord">＋选入</a>
						<a href="javascript:;" v-if="isSlectWord" @click="isSlectWord=!isSlectWord" class="cancelBtn">-移除</a>
					</div>
				</div>
				<div class="modbox" v-if="tag!=1">
					<div class="modbox-hd">
						句子跟读 <span>(划掉你不需要的单词)</span>
					</div>
					<div class="modbox-bd">
						<div v-for="(item,index) in sentenceList" :key="index">
							<span class="block" :class="{cancel:item.cancel}" @click="item.cancel=!item.cancel">{{item.text}}</span>
						</div>
					</div>
					<div class="modbox-ft">
						<span v-if="isSlectSen">共{{sentenceLen}}个句子</span>
						<a href="javascript:;" v-if="!isSlectSen" @click="isSlectSen=!isSlectSen">＋选入</a>
						<a href="javascript:;" v-if="isSlectSen" @click="isSlectSen=!isSlectSen" class="cancelBtn">-移除</a>
					</div>
				</div>
			</div>
			
		</div>
		<div class="ft">
			<div class="tip">
				<div class="flex flex-pack-center" v-if="isSlectSen||isSlectWord">
					<div v-if="isSlectWord"><span>单词跟读</span><span class="ml45"><em>{{wordLen}}</em>题目</span></div>
					<div v-if="isSlectSen"><span>句子跟读</span><span class="ml45"><em>{{sentenceLen}}</em>题目</span></div>
				</div>
			</div>
			<div>
				<a href="javascript:;" @click="isShowWin=false">取消</a><a href="javascript:;" class="submit" @click="submit">确定</a>
				<a href="javascript:;" @click="cancel"><img src="../../assets/del.png" alt=""><span>清空作业栏</span></a></div>
		</div>
		<div class="layer-base-box-mask" v-if="show">
			<div class="layer-base-box">
				<div class="layer-base-header">
					<p class="clearfix"><span>选择您的教材</span></p><a href="javascript:;" class="layer-close-btn" @click="show=!show">×</a>
				</div>
				<div class="layer-base-body">
					<div class="material-choose OEM-hover-fsBgColor">
						<div class="mate-choose-list clearfix"><label>学段</label>
							<div>
								<label style="width:6em;text-align:left" class="ant-radio-wrapper">
									<span class="ant-radio">
										<input type="radio" name="talkquestionType" value="学前" v-model="grade" @change="getTextbooks" />
										<span class="ant-radio-inner"></span>
									</span>
									<span>学前</span>
								</label>
								<label style="width:6em;text-align:left" class="ant-radio-wrapper">
									<span class="ant-radio">
										<input type="radio" name="talkquestionType" value="小学" v-model="grade" @change="getTextbooks" />
										<span class="ant-radio-inner"></span>
									</span>
									<span>小学</span>
								</label>
								<label style="width:6em;text-align:left" class="ant-radio-wrapper">
									<span class="ant-radio">
										<input type="radio" name="talkquestionType" value="初中" v-model="grade" @change="getTextbooks" />
										<span class="ant-radio-inner"></span>
									</span>
									<span>初中</span>
								</label>
								<label style="width:6em;text-align:left" class="ant-radio-wrapper">
									<span class="ant-radio">
										<input type="radio" name="talkquestionType" value="高中" v-model="grade" @change="getTextbooks" />
										<span class="ant-radio-inner"></span>
									</span>
									<span>高中</span>
								</label>
							</div>
						</div>
						<div class="mate-choose-list clearfix" style="margin-top: 30px;"><label>教材</label>
							<div id="materialVersion" class="mate-choose-box">
								<div class="mate-version">
									<span v-for="(item,index) in mateVersionList" @click="getGrade(item)" :key="index" :class="{hover:chosemate.materials.materials_id==item.materials_id}">{{item.materials}}</span>
								</div>
								
							</div>
						</div>
						<div class="mate-choose-list mate-list-grade clearfix"><label>年级</label>
							<div id="materialGradeBox" class="mate-choose-box">
								<div class="mate-grade">
									<span v-for="(item,index) in gradelist" @click="setUnit(item)" :key="index" :class="{hover:chosemate.unit.unit_id==item.unit_id}">{{item.unit}}</span>
								</div>

							</div>
						</div>
					</div>
				</div>
				<div class="layer-base-foot"> <a href="javascript:;" class="layer-base-cancel" @click="show=!show">取消</a>
					<a href="javascript:;" data-state="true" class="layer-base-sure" id="materialSureBtn" data-id="566" @click="confrim">确认</a>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {
		urlPath,
		htmlescpe
	} from '@/page/mainPage/utils/base';
	export default {
		data() {
			return {
				isShowWin: false,
				mateVersionList: [],
				gradelist: [],
				unitList: [],
				lessonsList: [],
				wordList: [],
				sentenceList: [],
				show: false, //选择教材
				showUnitlist: false,
				showlesson: false,
				tag: 0, //题型
				grade: '初中', //学段
				mateVersion: {}, //教材
				gradeobj: {}, //年级
				groupobj: {}, //单元
				lessonsobj: {}, //课时
				chosemate: {
					unit: {},
					materials: {}
				}, //确认之前的教程和年级
				isFirst: true,
				selectSentenceList: [],
				selectWordList: [],
				isSlectWord: false, //是否选中单词
				isSlectSen: false //是否选择句子

			}

		},
		created() {
			
		},
		computed: {
			wordLen: function() {
				let num = 0
				if (this.wordList && this.wordList.length > 0) {
					num = this.wordList.filter(item => !item.cancel).length
				}
				return num
			},
			sentenceLen: function() {
				let num = 0
				if (this.sentenceList && this.sentenceList.length > 0) {
					num = this.sentenceList.filter(item => !item.cancel).length
				}
				return num
			}
		},
		methods: {
			showWin() {
				this.isShowWin = true;
				this.isFirst=true;
				this.getTextbooks();
			},
			/* 查询教程 */
			getTextbooks() {
				var param = {
					grade: this.grade
				}
				this.mateVersionList = [];
				this.gradelist = [];
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/xiansheng/textbooks',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						console.log(da.data)
						if (da.data.ret == 'success') {
							this.mateVersionList = da.data.data;
							if (this.mateVersionList && this.mateVersionList.length > 0) {
								this.getGrade(this.mateVersionList[0]);
							}

						} else {

						}

					})
					.catch(function(err) {

					});
			},
			/* 查询年级 */
			getGrade(mate) {
				this.chosemate.materials = mate;
				var param = {
					materials_id: mate.materials_id
				}
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/xiansheng/unit',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						console.log(da.data)
						if (da.data.ret == 'success') {
							this.gradelist = da.data.data;
							if (this.gradelist && this.gradelist.length > 0) {
								this.setUnit(this.gradelist[0])
							}
							//this.getUnit(this.gradelist[0])
						} else {

						}

					})

			},
			/* 设置年级 */
			setUnit(unit) {
				this.chosemate.unit = unit;
				if (this.isFirst) {
					this.confrim();
					this.isFirst = false;
				}
			},
			confrim() {
				this.mateVersion = this.chosemate.materials;
				this.gradeobj = this.chosemate.unit;
				this.show = false;
				this.getUnit(); //查询单元
			},
			/* 查询单元 */
			getUnit() {
				// this.gradeobj=unit;
				var param = {
					unit_id: this.gradeobj.unit_id
				}
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/xiansheng/group',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						console.log(da.data)
						if (da.data.ret == 'success') {
							this.unitList = da.data.data;
							if (this.unitList && this.unitList.length > 0) {
								this.getLessons(this.unitList[0])
							}

						} else {

						}

					})
			},
			/* 切换单元，查询课时 */
			changeUnit(obj) {
				this.getLessons(obj);
				this.showUnitlist = false;
			},
			/* 查询课时 */
			getLessons(group) {
				this.groupobj = group;
				var param = {
					group_id: group.group_id
				}
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/xiansheng/lessons',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						console.log(da.data)
						if (da.data.ret == 'success') {
							this.lessonsList = da.data.data;
							if (this.lessonsList && this.lessonsList.length > 0) {
								this.lessonsobj = this.lessonsList[0];
								this.getWord(group.group_id, this.lessonsobj.lessons_id);
								this.getSentence(group.group_id, this.lessonsobj.lessons_id)
							}
						} else {

						}

					})
			},
			/* 获取单词 */
			getWord(unitId, lessonsId) {
				var param = {
					unit_id: unitId,
					lessons_id: lessonsId
				}
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/xiansheng/word',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						console.log(da.data)
						if (da.data.ret == 'success') {
							this.wordList = []
								this.isSlectWord=false;//是否选中单词
							if (da.data.data && da.data.data.length > 0) {
								this.wordList = da.data.data.map(item => {
									item.cancel = false;
									return item
								});
							}

						} else {

						}

					})
			},
			/* 获取句子*/
			getSentence(unitId, lessonsId) {
				var param = {
					unit_id: unitId,
					lessons_id: lessonsId
				}
				this.$http({
						method: 'post',
						url: urlPath + 'teacher-client/xiansheng/text',
						headers: {
							'Content-Type': 'application/json; charset=UTF-8'
						},
						data: param
					})
					.then(da => {
						console.log(da.data)
						if (da.data.ret == 'success') {
						this.isSlectSen=false; //是否选择句子
						
							this.sentenceList = []
							if (da.data.data && da.data.data.length > 0) {
								this.sentenceList = da.data.data.map(item => {
									item.cancel = false;
									return item
								});
							}
						} else {

						}

					})
			},
			/* 切换课时 */
			changeLessons(obj) {
				this.lessonsobj = obj;
				this.getWord(this.groupobj.group_id, this.lessonsobj.lessons_id);
				this.getSentence(this.groupobj.group_id, this.lessonsobj.lessons_id);
				this.showlesson = false;
			
			},
			submit() {
				this.isShowWin = false;
				if (this.isSlectWord) {
					this.selectWordList = this.wordList.filter(item => !item.cancel);
					this.$store.commit('SET_selectWordList', this.selectWordList);
				}
				if (this.isSlectSen) {
					this.selectSentenceList = this.sentenceList.filter(item => !item.cancel);
					this.$store.commit('SET_selectSentenceList', this.selectSentenceList);
				}
				
			},
			cancel() {
				this.isSlectWord=false;
				/* 清空作业栏 */
				if (this.wordList && this.wordList.length > 0) {
					this.wordList.forEach(item => {
						item.cancel = false;
						return item
					});
				}
				this.isSlectSen=false;
				if (this.sentenceList && this.sentenceList.length > 0) {
					this.sentenceList.forEach(item => {
						item.cancel = false;
						return item
					});
				}
			}
		}
	}
</script>

<style scoped="scoped" lang="less">
	.setEnglishBox {
		position: fixed;
		top: 10%;
		bottom: 10%;
		left: 10%;
		right: 10%;
		background: #1890ff;
		border-radius: 10px;
		padding: 10px 8px;

		.hd {
			border-radius: 10px;
			color: #fff;
			font-size: 16px;
			padding: 20px;
			line-height: 20px;

			.close {
				display: block;
				height: 20px;
				width: 20px;
				background: url(../../assets/close.png) no-repeat center center;
			}
		}

		.bd {
			position: absolute;
			top: 70px;
			bottom: 119px;
			left: 8px;
			right: 8px;
			overflow: auto;

			.selectbar {
				background: #fff;
				border-radius: 8px;
				line-height: 50px;
				font-size: 14px;
				padding: 0 20px;

				label {
					font-size: 16px;
					color: #333;
					margin-right: 15px;
				}

				span {
					color: #666;
				}

				a {
					color: #1890ff;

					&:after {
						content: '';
						display: inline-block;
						border: 7px solid transparent;
						border-top-width: 5px;
						border-bottom-width: 5px;
						border-left-color: #1890ff;
						margin-left: 4px;
					}
				}

				.unitBox {
					-webkit-user-select: none;
					cursor: pointer;
					position: relative;

					&>span:after {
						content: '';
						display: inline-block;
						border: 7px solid transparent;
						border-left-width: 5px;
						border-right-width: 5px;
						border-top-color: #1890ff;
						vertical-align: middle;
						margin-left: 4px;
						margin-top: 5px;
					}

					ul {
						position: absolute;
						top: 50px;
						background: #fff;
						line-height: 25px;
						border: 1px solid #ddd;
						max-height: 100px;
						overflow: auto;
						padding: 10px;

						li {
							cursor: pointer;
						}
					}
				}
			}

			.lessonbar {
				background: #fff;
				border-radius: 8px;
				padding: 20px 65px;
				margin-top: 10px;
				font-size: 14px;

				&>div:first-child {
					border-bottom: 1px solid #dadada;
					padding-bottom: 10px;
					margin-bottom: 10px;
				}

				label {
					font-size: 16px;
					color: #666;
					margin-right: 20px;
				}

				.lessonlist {
					position: relative;

					span {
						display: inline-block;
						line-height: 30px;
						-webkit-user-select: none;
						cursor: pointer;

						&:after {
							content: '';
							display: inline-block;
							border: 7px solid transparent;
							border-left-width: 5px;
							border-right-width: 5px;
							border-top-color: #1890ff;
							margin-left: 4px;
							vertical-align: middle;
							margin-top: 5px;

						}
					}

					ul {
						position: absolute;
						top: 30px;
						background: #fff;
						line-height: 25px;
						border: 1px solid #ddd;
						max-height: 100px;
						overflow: auto;
						padding: 10px;
						min-width: 100px;

						li {
							cursor: pointer;
						}

						// display: none;
					}
				}

				.tags {
					span {
						display: inline-block;
						height: 30px;
						padding: 0 15px;
						line-height: 30px;
						border-radius: 5px;
						cursor: pointer;
						color: #333;

						&.active {
							color: #fff;
							background: #1890ff;
						}
					}
				}
			}

			.lessonbox {
				background: #fff;
				margin-top: 10px;
				border-top-left-radius: 8px;
				border-top-right-radius: 8px;
				padding: 40px 40px 0;
				min-height: 300px;

				&>.modbox {
					background: #f2f2f2;
					border-radius: 8px;
					width: 100%;
					padding-top: 0;
					text-align: left;

					.modbox-hd {
						line-height: 45px;
						border-bottom: 1px solid #dadada;
						color: #1890ff;
						font-size: 16px;
						padding: 0 30px;

						span {
							color: #666;
							font-size: 14px;
							margin-left: 20px;
						}
					}

					.modbox-bd {
						padding: 0 30px;
						min-height: 100px;

						span {
							display: inline-block;
							margin: 15px 10px 0;
							border: 1px solid #1890ff;
							color: #1890ff;
							line-height: 30px;
							border-radius: 5px;
							cursor: pointer;
							-webkit-user-select: none;
							padding: 0 15px;


							&.cancel {
								text-decoration: line-through;
								color: #999;
								background: #dedede;
								border-color: #dedede;
							}
						}


					}

					.modbox-ft {
						text-align: right;
						font-size: 14px;
						color: #ccc;

						a {
							color: #fff;
							background: #1890ff;
							font-size: 14px;
							display: inline-block;
							line-height: 30px;
							border-radius: 5px;
							padding: 0 15px;
							border: 1px solid #1890ff;

							&.cancelBtn {
								color: #1890ff;
								background: #fff;

							}
						}
					}
				}

				&>.modbox+.modbox {
					margin-top: 20px;
				}
			}
		}

		.ft {
			background: #fff;
			height: 110px;
			position: absolute;
			left: 8px;
			right: 8px;
			bottom: 10px;
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			text-align: center;
			padding-top: 10px;
			box-sizing: border-box;

			.tip {
				text-align: center;
				color: #333;
				font-size: 16px;
				padding: 10px 0;
				line-height: 20px;
				height: 20px;
				margin-bottom: 10px;

				&>div {
					border-bottom: 1px solid #dadada;
					height: 30px;

					&>div+div {
						margin-left: 100px;
					}
				}

				.ml45 {
					margin-left: 45px;
				}

				.ml100 {
					margin-left: 100px;
				}

				em {
					color: #ff8000;
				}
			}

			a {
				display: inline-block;
				border-radius: 5px;
				font-size: 14px;
				color: #999;
				background: #f2f2f2;
				height: 30px;
				min-width: 60px;
				padding: 0 10px;
				line-height: 30px;
				margin: 0 10px;

				span,
				img {
					vertical-align: middle;
				}

				&.submit {
					color: #fff;
					background: #1890ff;

				}
			}
		}

	}

	// span{
	// 	padding: 5px 10px;
	// 	display: inline-block;
	// }
	.layer-base-box-mask {
		background: rgba(0, 0, 0, .4);
		z-index: 99999;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.layer-base-box {
		z-index: 99999;
		position: fixed;
		top: 50%;
		left: 50%;
		background-color: #fff;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
		-webkit-transform: translate(-50%, -50%);
		-moz-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		overflow: hidden
	}

	.layer-base-header {
		position: relative;
		height: 46px;
		line-height: 46px;
		padding: 0 16px;
		background-color: #f2f2f2;
		font-size: 14px;
		color: #333
	}

	.layer-base-header p i {
		width: 2px;
		height: 12px;
		margin: 17px 5px 0 0
	}

	.layer-base-header p i,
	.layer-base-header p span {
		display: block;
		float: left
	}

	.layer-base-box .layer-close-btn {
		position: absolute;
		top: 16px;
		right: 16px;
		width: 14px;
		height: 14px;
		line-height: 14px;
		font-size: 20px;
		overflow: hidden;
		color: #666
	}

	.layer-base-body {
		padding: 24px;
		height: 452px;
		overflow: auto
	}

	.layer-base-foot {
		margin-top: 6px;
		margin-bottom: 30px;
		text-align: center
	}

	.layer-base-cancel,
	.layer-base-cancel-mini {
		display: inline-block;
		margin-right: 60px;
		border-radius: 4px;
		vertical-align: middle;
		text-align: center;
		color: #fd9d00;
		border: 1px solid #fd9d00
	}

	.layer-base-cancel {
		width: 158px;
		height: 34px;
		line-height: 34px;
		font-size: 16px
	}

	.layer-base-cancel-mini {
		width: 102px;
		height: 30px;
		line-height: 30px;
		font-size: 14px
	}

	.layer-base-sure,
	.layer-base-sure-mini {
		display: inline-block;
		border-radius: 4px;
		vertical-align: middle;
		text-align: center;
		color: #fff;
		background-color: #fd9d00
	}

	.layer-base-sure {
		width: 160px;
		height: 36px;
		line-height: 36px;
		font-size: 16px
	}

	.layer-base-sure-mini {
		width: 104px;
		height: 32px;
		line-height: 32px;
		font-size: 14px
	}

	.layer-shade {
		z-index: 9999;
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #333;
		-moz-opacity: .2;
		opacity: .2;
		filter: alpha(opacity=20)
	}

	.layer-base-error {
		position: absolute;
		top: 0;
		left: 0;
		line-height: 14px;
		font-size: 12px;
		color: #fb6a6c
	}

	.layer-base-body .prompt {
		font-size: 16px;
		color: #333;
		line-height: 18px;
		text-align: center;
		font-weight: 700
	}

	.layer-base-body .explain {
		margin-top: 20px;
		font-size: 14px;
		line-height: 16px;
		text-align: center;
		color: #666
	}

	.layer-base-body .describe {
		font-size: 16px;
		color: #333;
		line-height: 18px;
		text-align: center
	}



	// 	.material {
	// 		line-height: 20px;
	// 		font-size: 14px
	// 	}
	// 
	// 	.material span {
	// 		display: block;
	// 		float: left
	// 	}
	// 
	// 	.material span.mat-lab {
	// 		color: #666;
	// 		margin-right: 24px
	// 	}
	// 
	// 	.material span.mat-name {
	// 		color: #333;
	// 		max-width: 350px
	// 	}
	// 
	// 	.material span.mat-switch {
	// 		margin-left: 16px;
	// 		font-size: 0;
	// 		cursor: pointer
	// 	}
	// 
	// 	.material span.mat-switch em {
	// 		vertical-align: middle;
	// 		font-style: normal;
	// 		font-size: 14px
	// 	}
	// 
	// 	.material span.mat-switch i {
	// 		margin-left: 2px;
	// 		vertical-align: middle;
	// 		font-size: 14px
	// 	}

	.material-choose {
		width: 576px
	}

	.material-choose .mate-choose-list label {
		display: block;
		float: left;
		width: 34px;
		margin-right: 10px;
		color: #999;
		font-size: 14px;
		line-height: 16px
	}

	.material-choose .mate-choose-box {
		float: left;
		width: 524px
	}

	// .material-choose .mate-choose-box table {
	// 	width: 100%
	// }

	.material-choose .mate-choose-box span {
		height: 46px;
		line-height: 46px;
		border: 1px solid #e8e8e8;
		border-top: none;
		text-align: center;
		overflow: hidden;
		font-size: 14px;
		cursor: pointer;
		color: #333;
		float: left;
		box-sizing: border-box;
		border-left: none;
	}

	.material-choose .mate-choose-box .mate-version span:nth-child(1),
	.material-choose .mate-choose-box .mate-version span:nth-child(2) {
		border-top: 1px solid #e8e8e8;
	}

	.material-choose .mate-choose-box .mate-version span:nth-child(2n+1) {
		border-left: 1px solid #e8e8e8;
	}

	.material-choose .mate-choose-box .mate-version span {
		width: 50%;

	}

	.material-choose .mate-choose-box .mate-grade span:nth-child(1),
	.material-choose .mate-choose-box .mate-grade span:nth-child(2),
	.material-choose .mate-choose-box .mate-grade span:nth-child(3),
	.material-choose .mate-choose-box .mate-grade span:nth-child(4) {
		border-top: 1px solid #e8e8e8;
	}

	.material-choose .mate-choose-box .mate-grade span:nth-child(4n+1) {
		border-left: 1px solid #e8e8e8;
	}

	.material-choose .mate-choose-box .mate-grade span {
		width: 25%
	}

	.material-choose .mate-choose-box .mate-grade span.hover,
	.material-choose .mate-choose-box .mate-version span.hover {
		color: #fff !important;
		background-color: #1890ff !important;
	}

	.material-choose .mate-list-grade {
		margin-top: 30px
	}
</style>

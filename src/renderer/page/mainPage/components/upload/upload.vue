<template>
	<div class="bg">
		<div class="mask"></div>
		<div class="upload-bd">
			<a href="javascript:;" class="close" @click="isCanclose()">×</a>
			<div>
				<div class="title">堂测标准答案设置</div>
				<div class="btnbar flex flex-pack-justify flex-align-center">
					<div>
						<label>标题</label>
						<input type="text" name="" id="" value="" placeholder="请输入标题" v-model.trim="titleName" class="ant-input" style="width: 200px;" />
					</div>

					<div class="btnlist">
						<div class="upload">
							<span>导入Excel标准答案</span>
							<input
								type="file"
								@change="uploadFile"
								id="upload"
								accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
							/>
						</div>

						<!-- <a href="javascript:;" class="btn">清除答案</a> -->
					</div>
				</div>
				<div class="input-row flex flex-align-center">
					<label>题目总数</label>
					<input type="number" name="" id="" value="" placeholder="请输入题目总数" v-model="Data.totalNum" class="flex-1 ant-input active" />
					<!--<label>起始题号</label>
				<input type="number" name="" id="" value="" placeholder="请输入起始题号" v-model="startNum" class="flex-1 ant-input" />
				<label>终止题号</label>
				<input type="number" name="" id="" value="" placeholder="请输入终止题号" v-model="endNum" class="flex-1 ant-input" />-->
					<label>题目得分</label>
					<input type="number" name="" id="" value="" placeholder="请输入题目得分" v-model="Data.score" class="flex-1 ant-input" />
					<label>题目类型</label>
					<select
						name=""
						id=""
						class="flex-1 ant-input"
						placeholder="请选择题目类型"
						v-model="Data.questionType"
						@change="exchanswerreg(Data.questionType, Data.trueAnswer)"
					>
						<option v-for="type in typeList" :value="type.code" :key="type.code">{{ type.name }}</option>
					</select>
					<label>题目答案</label>
					<input
						type="text"
						name=""
						id=""
						value=""
						placeholder="请输入题目答案"
						v-model="Data.trueAnswer"
						class="flex-1 ant-input"
						@blur="exchanswerreg(Data.questionType, Data.trueAnswer)"
					/>
					<div class="btnlist ml20"><a href="javascript:;" class="btn" @click="addSource(Data)">确认插入</a></div>
				</div>
				<p class="warn" style="color: #f00; text-align: center; padding: 10px 0 0;">
					<template v-if="Data.questionType == 1">
						请输入A-D的单选
					</template>
					<template v-if="Data.questionType == 4">
						请输入E（正确）或者F（错误）
					</template>
					<template v-if="Data.questionType == 2">
						请输入A-D的多选
					</template>
				</p>
				<div class="title mt10">答案设置</div>
				<table class="table">
					<col style="width: auto" /> 
				<col style="width: auto" />  
				<col style="width: auto" /> 
				<col style="width: auto" /> 
				<col style="width: 120px" /> 
					<thead>
						<tr>
							<th>题号</th>
							<th>分数</th>
							<th>类型</th>
							<th>答案</th>
							<th>操作</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(item, index) in dataSource" :key="index">
							<td>{{ index + 1 }}</td>
							<td>
								<span v-if="!item.editable && item.id">{{ item.score }}</span>
								<input type="number" class="ant-input" v-if="item.editable || !item.id" v-model.trim="item.score" />
							</td>

							<td>
								<span v-if="!item.editable && item.id">{{ item.questionName }}</span>
								<select
									name=""
									id=""
									class="flex-1 ant-input"
									v-if="item.editable || !item.id"
									v-model="item.questionType"
									@change="exchanswerreg(item.questionType, item.trueAnswer, index)"
								>
									<option v-for="type in typeList" :key="type.code" :value="type.code">{{ type.name }}</option>
								</select>
							</td>
							<td>
								<span v-if="!item.editable && item.id">{{ item.trueAnswer }}</span>
								<input
									type="text"
									class="ant-input"
									v-if="item.editable || !item.id"
									v-model.trim="item.trueAnswer"
									@blur="exchanswerreg(item.questionType, item.trueAnswer, index)"
								/>
							</td>

							<td style="width: 80px;" width="80px">
								<a href="javascript:;" class="link" v-if="!item.editable && item.id" @click="edit(index)">编辑</a>
								<!-- <a href="javascript:;" class="link" @click="save(index,item)"  v-if="item.editable||!item.id">保存</a> -->
								<a href="javascript:;" class="link" v-if="!item.editable || !item.id" @click="del(index, item)">删除</a>
								<a href="javascript:;" class="link" @click="cancel(index)" v-if="item.editable">取消</a>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- totalbar -->
				<div class="totalbar">
					<span>总题数{{ total }}题，总分{{ totalScore }}分</span>
					<a href="javascript:;" class="btn" @click="batchSave">批量保存</a>
				</div>
			</div>
		</div>
		<div class="exitappWin animated fadeIn" v-if="isSave">
			<div class="confirm">
				<div>
					<div class="title">你有修改未保存，是否保存</div>
					<div class="buttonGroup">
						<a href="javascript:;" @click="close()">放弃</a>
						<a href="javascript:;" class="comfirmBtn" @click="batchSave">保存</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { urlPath } from '@/page/mainPage/utils/base';
export default {
	data() {
		return {
			sendInfo: {},
			titleName: '',
			titleCode: '',
			Data: {
				totalNum: 1,
				score: 5,
				trueAnswer: 'A',
				questionType: '1'
			},
			typeList: [
				{
					code: 1,
					name: '单题单选'
				},
				{
					code: 2,
					name: '单题多选'
				},
				// 				{
				// 					code: 3,
				// 					name: '多题单选'
				// 				},
				{
					code: 4,
					name: '判断题'
				}
				// 				{
				// 					code: 5,
				// 					name: '主观题'
				// 				},
				// 				{
				// 					code: 6,
				// 					name: '抢红包'
				// 				}
			],
			title: '',
			oldSource: [],
			dataSource: [],
			isSave: false,
			isUploadFile: true
		};
	},
	props: {
		isCloseUpload: {
			type: Boolean,
			default: true
		}
	},

	created() {
		this.sendInfo = sessionStorage.getItem('sendInfo') ? JSON.parse(sessionStorage.getItem('sendInfo')) : null;
		console.log(this.sendInfo);
		// 		this.titleCode= sessionStorage.getItem('titleCode') ? sessionStorage.getItem('titleCode') : null;
		// 		this.titleName= sessionStorage.getItem('titleName') ? sessionStorage.getItem('titleName') : null;
		// 		if(this.titleCode){
		// 		this.selectQuestions();
		// 		}
	},
	computed: {
		total: function() {
			return this.dataSource.length;
		},
		totalScore: function() {
			let count = 0;
			if (this.dataSource.length > 0) {
				count = this.dataSource.reduce((count, item) => (count += item.score - 0), 0);
			}
			return count;
		}
	},
	methods: {
		isCanclose() {
			/* 是否可以保存 */
			const $me = this;
			if (JSON.stringify($me.oldSource) == JSON.stringify($me.dataSource)) {
				$me.close();
			} else {
				$me.isSave = true;
			}
		},
		close() {
			this.$emit('update:isCloseUpload', false);
		},
		addSource(val) {
			var max = parseInt(val.totalNum);
			var list = [];
			val.trueAnswer = val.trueAnswer.toUpperCase();
			//var questionName=this.typeList.find(item=>item.code==val.questionType).name
			for (var i = 1; i <= max; i++) {
				var p = {
					trueAnswer: val.trueAnswer,
					score: val.score,
					questionType: val.questionType
					//questionName:questionName
					// typename: val.questionType > 0 ? this.typeList[val.questionType - 1].name : ''
				};
				list.push(p);
			}
			this.dataSource = this.dataSource.concat(list);
		},
		edit(index) {
			this.$set(this.dataSource[index], 'editable', true);
		},
		cancel(index) {
			const newData = [...this.dataSource];
			const target = newData[index];
			if (target) {
				Object.assign(target, this.oldSource[index]);
				delete target.editable;
				this.dataSource = newData;
			}
		},
		save(index, item) {
			const $me = this;
			if (!$me.titleName) {
				this.$toast.center('请输入标题');
				return false;
			}
			var questions = {
				questionType: item.questionType,
				score: item.score,
				trueAnswer: item.trueAnswer
			};
			if (item.id) {
				questions.id = item.id;
				questions.questionId = item.questionId;
			}

			var param = {
				classCode: $me.sendInfo.classCode,
				className: $me.sendInfo.className,
				subjectCode: $me.sendInfo.subjectCode,
				subjectName: $me.sendInfo.subjectName,
				titleCode: $me.titleCode,
				titleName: $me.titleName,
				questions: [questions]
			};
			this.$http({
				method: 'post',
				url: urlPath + '/teacher-client/platform/batch_insert_or_update',
				data: param
			}).then(da => {
				if (da.data.ret == 'success') {
					$me.$toast.center('保存成功');
					$me.titleCode = da.data.data.titleCode;
					sessionStorage.setItem('titleCode', $me.titleCode);
					//$me.selectQuestions();
				} else {
					$me.$toast.center(da.data.message);
				}
			});
		},
		del(index, val) {
			var $me = this;
			if (val.id) {
				this.$http({
					method: 'post',
					url: urlPath + '/teacher-client/platform/batch_remove',
					data: [val.id]
				}).then(da => {
					if (da.data.ret == 'success') {
						$me.$toast.center('删除成功');
						$me.dataSource.splice(index, 1);
					} else {
						$me.$toast.center('删除失败');
					}
				});
			} else {
				this.dataSource.splice(index, 1);
			}
		},
		uploadFile() {
			const $me = this;
			var file = $('#upload')[0];

			if (file.files[0] && $me.sendInfo) {
				var strFileName = $('#upload')
					.val()
					.replace(/^.+?\\([^\\]+?)(\.[^\.\\]*?)?$/gi, '$1'); //正则表达式获取文件名，不带后缀
				var FileExt = $('#upload')
					.val()
					.replace(/.+\./, ''); //正则表达式获取后缀
				var formData = new FormData();
				if (FileExt != 'xls' && FileExt != 'xlsx') {
					$me.$toast.center('请上传excel文件');
					return false;
				}
				if (!$me.titleName) {
					$me.titleName = strFileName;
				}
				formData.append('file', file.files[0]);
				formData.append('titleName', $me.titleName);
				formData.append('classCode', $me.sendInfo.classCode);
				formData.append('className', $me.sendInfo.className);
				formData.append('subjectCode', $me.sendInfo.subjectCode);
				formData.append('subjectName', $me.sendInfo.subjectName);
				this.isUploadFile=false;
				this.$http({
					method: 'post',
					url: urlPath + '/teacher-client/platform/importQuesrions',
					data: formData,
					processData: false, // jQuery不要去处理发送的数据
					contentType: false
				}).then(da => {
					if (da.data.ret == 'success') {
						//showMessage('上传成功')
						$me.$toast.center('上传成功');
						$me.titleCode = da.data.data.titleCode;
						sessionStorage.setItem('titleCode', $me.titleCode);
						$me.selectQuestions();
						//$me.titleName=da.data.data.titleName;
					} else {
						$me.$toast.center(da.data.message);
					}
				}).finally(() => {
					    this.isUploadFile=true;
						});;
				file.value = '';
			} else {
				this.$toast.center('请选择文件');
			}
		},
		/* 批量保存 */
		batchSave() {
			const $me = this;
			$me.isSave = false;
			if (!$me.titleName) {
				this.$toast.center('请输入标题');
				return false;
			}
			if (this.dataSource.length == 0) {
				this.$toast.center('请导入或者手动添加题目');
				return false;
			}
			//console.log(this.dataSource)
			let questions = [];
			for (var i = 0; i < this.dataSource.length; i++) {
				var item = this.dataSource[i];
				if (!item.questionType || !item.score || !item.trueAnswer) {
					this.$toast.center('请完善题目信息');
					return false;
				}
				var param = {
					questionId: i + 1,
					questionType: item.questionType,
					score: item.score,
					trueAnswer: item.trueAnswer
				};
				if (item.id) {
					param.id = item.id;
				}
				questions.push(param);
			}
			// 			let questions=this.dataSource.map((item,index)=>{
			// 				var param={
			// 					questionId:index+1,
			// 					questionType:item.questionType,
			// 					score:item.score,
			// 					trueAnswer:item.trueAnswer
			//
			// 				};
			// 				if (item.id){
			// 					param.id=item.id
			// 				}
			// 				return param
			// 			});
			var param = {
				classCode: $me.sendInfo.classCode,
				className: $me.sendInfo.className,
				subjectCode: $me.sendInfo.subjectCode,
				subjectName: $me.sendInfo.subjectName,
				titleCode: $me.titleCode,
				titleName: $me.titleName,
				questions: questions
			};
			this.$http({
				method: 'post',
				url: urlPath + '/teacher-client/platform/batch_insert_or_update',
				data: param
			}).then(da => {
				if (da.data.ret == 'success') {
					$me.$toast.center('保存成功');
					$me.titleCode = da.data.data.titleCode;
					sessionStorage.setItem('titleCode', $me.titleCode);
					$me.selectQuestions();
				} else {
					$me.$toast.center(da.data.message);
				}
			});
		},
		/* 查询题目详情 */
		selectQuestions() {
			const $me = this;
			this.$http({
				method: 'post',
				url: urlPath + '/teacher-client/platform/selectQuestions',
				data: { titleCode: $me.titleCode }
			}).then(da => {
				if (da.data.ret == 'success') {
					/* 获取题目详情成功 */
					//console.log(da.data.data) ;
					$me.dataSource = da.data.data ? da.data.data : [];
					if ($me.dataSource.length > 0) {
						// var questionName=this.typeList.find(item=>item.code==val.questionType).name
						$me.dataSource = $me.dataSource.map(item => {
							item.questionName = $me.typeList.find(subitem => subitem.code == item.questionType).name;
							return item;
						});
						$me.oldSource = this.dataSource.map(item => ({ ...item }));
					}
				} else {
					$me.$toast.center(da.data.message);
				}
			});
		},
		exchanswerreg(questionType, trueAnswer, index) {
			const $me = this;
			var answerreg = '';
			if (!trueAnswer) {
				return false;
			}
			var answer = trueAnswer
				.toLocaleUpperCase()
				.split('')
				.sort()
				.join('');
			if (questionType == 1) {
				answerreg = /^[A-D]{1}$/;
			} else if (questionType == 4) {
				answerreg = /^[E-F]{1}$/;
			} else if (questionType == 2) {
				answerreg = /^(?!.*([A-D]).*\1)[A-D]{2,4}$/;
			}
			if (!answerreg.test(answer)) {
				$me.$toast.center('请输入正确答案');
				if (!index) {
					$me.Data.trueAnswer = '';
				} else {
					this.dataSource[index].trueAnswer = '';
				}
			} else {
				if (!index) {
					$me.Data.trueAnswer = answer;
				} else {
					this.dataSource[index].trueAnswer = answer;
				}
			}
		}
	}
};
</script>

<style scoped="scoped" lang="less">
.bg {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 999;
}
.bg .mask {
	background: rgba(0, 0, 0, 0.4);
	height: 100%;
	width: 100%;
}
.bg > .upload-bd {
	position: absolute;
	left: 50%;
	width: 60%;
	transform: translateX(-50%);
	min-width: 900px;
	top: 20%;
	bottom: 20%;
	background: #fff;
	border-radius: 14px;
	padding: 40px 40px 60px;
	height: auto;
	box-sizing: border-box;
}
.bg > .upload-bd > div {
	overflow: auto;
	height: 100%;
}
.bg > .upload-bd .title {
	color: #1890ff;
	font-size: 16px;
	line-height: 30px;
	margin-bottom: 10px;
	text-align: left;
}
.bg > div .btnbar {
	padding-left: 10px;
	padding-bottom: 10px;
	border-bottom: 1px solid #eee;
	font-size: 14px;
}

.bg > .upload-bd .btnbar .upload,
.bg > .upload-bd .btn {
	line-height: 32px;
	display: inline-block;
	font-weight: 400;
	text-align: center;
	touch-action: manipulation;
	cursor: pointer;
	background-image: none;
	border: 1px solid transparent;
	white-space: nowrap;
	padding: 0 15px;
	font-size: 14px;
	border-radius: 4px;
	height: 32px;
	-webkit-user-select: none;
	-moz-user-select: none;
	-ms-user-select: none;
	user-select: none;
	transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
	position: relative;
	box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
	color: rgba(0, 0, 0, 0.65);
	background-color: #fff;
	border-color: #d9d9d9;
	color: #fff;
	background-color: #67c23a;
	border-color: #67c23a;
	vertical-align: middle;
}
.bg > .upload-bd .btnbar .upload {
	position: relative;
	overflow: hidden;
}
.bg > .upload-bd .btnbar .upload input[type='file'] {
	position: absolute;
	top: 0;
	right: 0;
	font-size: 400px;
	opacity: 0;
}
.bg .input-row {
	padding: 10px;
	border-bottom: 1px solid #eee;
}
.bg .input-row label {
	width: 4em;
	text-align: right;
	display: block;
	margin-right: 10px;
}
.ant-input {
	box-sizing: border-box;
	margin: 0;
	padding: 0;
	list-style: none;
	position: relative;
	display: inline-block;
	padding: 4px 0 4px 11px;
	height: 32px;
	font-size: 14px;
	line-height: 1.5;
	color: rgba(0, 0, 0, 0.65);
	background-color: #fff;
	// background-image: none;
	border: 1px solid #d9d9d9;
	border-radius: 4px;
	transition: all 0.3s;
	width: 60px;
}
.bg .input-row .ant-input + label {
	margin-left: 10px;
}
.ant-input:hover,
.ant-input.active {
	border-color: #40a9ff;
	border-right-width: 1px !important;
}
.ant-input:focus {
	border-color: #40a9ff;
	outline: 0;
	box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
	border-right-width: 1px !important;
}
.table {
	width: 100%;
	border-collapse: collapse;
	text-align: left;
	border-radius: 4px 4px 0 0;
	border: 1px solid #e8e8e8;
	border-right: 0;
	border-bottom: 0;
	table-layout: fixed;
}
.table tr th,
.table tr td {
	border-right: 1px solid #e8e8e8;
	padding: 16px;
	line-height: 21px;
}
.table tr > th {
	background: #fafafa;
	transition: background 0.3s ease;
	text-align: left;
	color: rgba(0, 0, 0, 0.85);
	font-weight: 500;
	border-bottom: 1px solid #e8e8e8;
}
.table tr > td {
	border-bottom: 1px solid #e8e8e8;
	transition: all 0.3s, border 0s;
}
.table .ant-input {
	width: 100%;
	margin: -5px 0;
}
.link {
	color: #1890ff;
}
.close {
	background: #f00;
	color: #fff;
	font-size: 40px;
	position: absolute;
	right: -20px;
	top: -20px;
	border-radius: 100%;
	display: block;
	width: 40px;
	height: 40px;
	text-align: center;
	line-height: 35px;
}
.totalbar {
	position: absolute;
	right: 40px;
	bottom: 15px;
	line-height: 34px;
}
.totalbar span {
	vertical-align: middle;
}
</style>

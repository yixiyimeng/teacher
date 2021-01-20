<template>
	<div class="selectFilter" ref="selectFilter">
		<input
			type="text"
			:readonly="isReadonly"
			v-model="selectname"
			:placeholder="placeholdertxt"
			@click="searchFlag = !searchFlag"
			@input="changeInput"
			@change="blurInput"
			@compositionstart="flag = false"
			@compositionend="flag = true"
		/>
		<a href="javascript:;" class="dropdownarrow" @click="searchFlag = !searchFlag"><i class="icon icon-filter-arrow" :class="{ 'filter-show': searchFlag }"></i></a>
		<!-- {{reftitletypelist}} -->
		<div class="dropdownlist" v-if="searchFlag">
			<!-- <a-empty description="暂无数据" v-if="filterList.length == 0" /> -->
			<ul>
				<li class="vs__no-options" v-if="filterList.length == 0">没有筛选数据</li>
				<li v-for="(item, index) in filterList" :key="index" @click="choseValue(item)">
					<a href="JavaScript:;">{{ item.name }}</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			searchFlag: false,
			selectname: '',
			filterList: [],
			flag: true //防止输入中文拼音的时候，触发input事件
		};
	},
	props: {
		searchList: Array,
		selectValue: Object,
		isReadonly: {
			type: Boolean,
			default: true
		},
		placeholdertxt: {
			type: String,
			default: '请选择'
		}
	},
	watch: {
		selectValue: function(newVal, oldVal) {
			if (newVal != oldVal && this.selectValue && this.selectValue.name) {
				this.selectname = this.selectValue.name;
			}
		},
		searchList: {
			handler(a, b) {
				if (a !== b && a) {
					this.filterList = [...this.searchList];
				}
			},
			immediate: true,
			deep: true
		}
	},
	mounted() {
		document.addEventListener('click', e => {
			if (this.$refs.selectFilter) {
				if (!this.$refs.selectFilter.contains(e.target)) {
					this.searchFlag = false;
				}
			} else {
				console.log(2);
			}
			/* */
		});
		if (this.selectValue && this.selectValue.name) {
			this.selectname = this.selectValue.name;
		}
		this.filterList = [...this.searchList];
	},
	methods: {
		choseValue(item) {
			this.searchFlag = false;
			this.selectname = item && item.name ? item.name : '';
			this.$emit('update:selectValue', item);
			this.$emit('selectFunc', item);
			this.filterList = [...this.searchList];
		},
		changeInput(e) {
			if (this.flag) {
				this.filterList = this.searchList.filter(item => item.name.toUpperCase().indexOf(e.target.value.toUpperCase()) >= 0);
			}
		},
		/* 失去焦点 */
		blurInput(e) {
			if (this.filterList.length > 0&&e.target.value!='') {
				this.choseValue(this.filterList[0]);
			} else {
				this.choseValue(null);
			}
		}
	}
};
</script>

<style scoped="scoped">
.selectFilter {
	position: relative;
}
.selectFilter input {
	display: block;
	width: 100%;
	height: 59px;
	cursor: pointer;
}
.dropdownlist {
	border-radius: 5px;
	box-sizing: border-box;
	top: 65px;
	width: 100%;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
</style>

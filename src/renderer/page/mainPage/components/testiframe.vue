<template>
	<div style="width: 100%; height: 100%; box-sizing: border-box; overflow: hidden;">
		<a-spin tip="正在加载..." :spinning="spinning" style="height: 100%;" size="large">
			<iframe ref="iframe" :src="iframePath" frameborder="0" style="width: 100%; height: 100%;"></iframe>
		</a-spin>
	</div>
</template>

<script>
	function GetQueryString(searchurl, name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = searchurl.match(reg);
		if (r != null) return unescape(r[2]);
		return null;
	}
	export default {
		name: 'board',
		data() {
			return {
				iframePath: 'http://zkxl.school.zxxk.com/ThirdParty/CustomJump?_m=http://localhost:8080/',
				basePath: 'http://zkxl.school.zxxk.com',
				spinning: true
			};
		},

		created() {
			/* 监听 资源网 打开新窗口 */
			let $me = this;
			this.$electron.ipcRenderer.on('iframeUrl', (event, iframeUrl) => {
				if (iframeUrl) {
					let search = iframeUrl.split('?')[1];
					var wxtpath = GetQueryString(search, 'wxtpath');
					$me.iframePath = this.basePath + wxtpath;
					$me.getResouce()
				}
			});
		},
		mounted() {
			this.getResouce()
		},
		methods: {
			getResouce() {
				const $me = this;
				$me.spinning = true;
				this.$nextTick(() => {
					try {
						let iframe = $me.$refs['iframe'];
						if (iframe) {
							if (iframe.attachEvent) {
								iframe.attachEvent("onload", function() {
									$me.spinning = false;
								});
							} else {
								iframe.onload = function() {
									$me.spinning = false;
								};
							}
						}
					} catch (e) {
						//TODO handle the exception
					}
				})
			}
		}


	};
</script>

<style  scoped="scoped">
	/deep/ .ant-spin-container {
		height: 100%;
	}
</style>

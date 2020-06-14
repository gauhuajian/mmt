<template>
	<view class="search">
		<Lines></Lines>
		
		<view class="seach-item">
			<view class="seach-title">
				<view class="f-color">最近搜索</view>
				<view class="iconfont icon-iconset0213"></view>
			</view>
			<view  class="seach-text">
				暂无搜索记录
			</view>
			<view class="seach-name"></view>
		</view>
		
		
		<view class="seach-item">
			<view class="seach-title">
				<view class="f-color">热门搜索</view>
			</view>
			<view class="seach-name">
				四件套
			</view>
			<view class="seach-name">
				四件套
			</view>
		</view>
		
		
	</view>
</template>

<script>
	import Lines from '@/components/common/Lines.vue'
	export default {
		components:{
			Lines
		},
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.seach-item{
		padding:20rpx;
	}
	.seach-title{
		display: flex;
		justify-content: space-between;
	}
	.seach-name{
		padding:4rpx 24rpx;
		background-color: #eee;
		display: inline-block;
		border-radius: 26rpx;
		margin:10rpx;
	}
	.seach-text{
		text-align: center;
	}
</style>

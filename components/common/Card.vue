<template>
	<view class="card">
		<view class="card-item">
			<text> - </text>
			<text>{{ title }}</text>
			<text> - </text>
		</view>
	</view>
</template>

<script>
	export default {
		props:['title']
	}
</script>

<style scoped>
	.card-item{
		padding: 20rpx;
		text-align: center;
		font-weight: bold;
	}
	.card-item text:nth-child(2){
		padding: 0 10rpx;
	}
</style>

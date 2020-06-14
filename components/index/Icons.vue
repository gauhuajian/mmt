<template>
	<view class="icons">
		<view class="icons-item" v-for="(item,index) in iconsList" :key="index">
			<view class="icons-img">
				<image :src="item.imgUrl" mode=""></image>
			</view>
			<view class="f-color">{{item.name}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:["iconsList"]
	}
</script>

<style scoped>
	.icons{
		display: flex;
		flex-wrap: wrap;
	}
	.icons-item{
		width: 25%;
		text-align: center;
		padding: 10rpx 0;
	}
	.icons-item image {
		display: block;
		width: 110rpx;
		height: 110rpx;
		margin: auto;
	}
</style>

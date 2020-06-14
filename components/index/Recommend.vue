<template>
	<view class="recommend bg-color">
		<view class="recommend-item" v-for="(item,index) in recommend">
			<image class="recommend-big" :src="item.bigUrl" mode=""></image>
			<view class="item-list">
				<block v-for="(v,i) in item.data" :key="i">
					<image  :src="v.imgUrl" mode=""></image>
				</block>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:['recommend']
	}
</script>

<style scoped>
	.recommend{
		padding: 20rpx;
	}
	.recommend-item{
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		border: 2rpx solid #CCCCCC;
		overflow: hidden;
		margin: 20rpx 0;
	}
	.recommend-big{
		width: 100%;
		height: 300rpx;
		display: block;
	}
	.item-list{
		height: 240rpx;
	}
	.item-list image{
		width: 33.3%;
		height: 240rpx;
	}
</style>

<template>
	<view class="shop">
		<view class="shop-item" v-for="(item,index) in shopList" :key="index">
			<image class="item-big" :src="item.bigUrl" mode=""></image>
			<scroll-view scroll-x="true" class="scroll-content"  >
				<view class="scroll-item">
					<Goods :goods="item.data"  itemW="200rpx" bigH="200rpx" wrap="nowrap" ></Goods>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import Goods from '../common/Goods.vue'
	export default{
		components:{
			Goods
		},
		props:['shopList']
	}
</script>

<style scoped>
	.item-big{
		display: block;
		width: 100%;
		height: 370rpx;
	}
	.scroll-content{
		white-space: nowrap;
	}
	.scroll-item{
		display: inline-block;
	}
</style>

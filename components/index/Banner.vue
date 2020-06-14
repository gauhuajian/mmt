<template>
	<view class="barnner">
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for="(item,index) in BannerData" :key= "index">
				<view class="swiper-item">
					<image :src="item.imgUrl" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	export default {
		props:['BannerData']
	}
</script>

<style scoped>
	.swiper-item image{
		width: 100%;
		height: 300rpx;
	}

</style>

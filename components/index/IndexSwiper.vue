<template>
	<view class="Index-swiper">
		<image :src="swiperData" mode=""></image>
	</view>
</template>

<script>
	export default{
		props:['swiperData']
	}
</script>

<style scoped>
	.Index-swiper {
		height: 300rpx;
	}
	.Index-swiper image{
		width: 100%;
		height: 300rpx;
	}
</style>

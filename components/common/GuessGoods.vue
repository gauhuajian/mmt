<template>
	<view class="guess">
		<view class="guess-item" v-for="(item,index) in guess" :key="index" @tap="goDetails(item.iid)" >
			<!-- #ifdef APP-PLUS -->  
				<image  :src="item.show.img" mode=""></image>
			<!-- #endif -->  
			<!-- #ifdef H5 -->  
				<img  v-lazy="item.show.img">  
			<!-- #endif -->  
			<view class="name">
				{{item.title}}
			</view>
			<view class="price">
				￥{{item.price}}
			</view>
		</view>
	</view>
</template>
<script>
	export default{
		props:['guess'],
		methods:{
			goDetails(id){
				uni.navigateTo({
					url:`../../pages/details/details?id=${id}`
				})
			}
		}
	}
</script>

<style scoped>
	.guess {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		padding: 2px;
	}
	.guess-item {
		width: 350rpx;
		font-size: 0.32rem;
		text-align: center;
		padding-bottom: 0.2rem;
	}
	.guess-item image {
		width: 100%;
		border-radius: 0.2rem;
	}
	.guess-item img {
		width: 100%;
		border-radius: 0.2rem;
	}
	.name {
		margin: 0.2rem 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.price {
		color: #ff5777;
	}
</style>

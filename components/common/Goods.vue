<template>
	<view class="goods" :style="'flex-wrap:'+ wrap+';'">
		<view class="goods-item" v-for="(item,index) in goods" :key="index" :style="'width:'+itemW+';'">
			<image :style="'height:'+bigH+';'" :src="item.imgUrl" mode=""></image>
			<view class="name f-color">
				{{item.name}}
			</view>
			<view class="text">
				<view class="pprice">
					<text>{{item.pprice}}</text>
					<text class="oprice">{{item.oprice}}</text>
				</view>
				<text class="discount">
					折{{item.discount}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:{
			goods:{
				type:Array
			},
			itemW:{
				type:String,
				default:'375rpx'
			},
			bigH:{
				type:String,
				default:"375rpx"
			},
			wrap:{
				type:String,
				default:"wrap"
			},
			fontsize:{
				type:String,
				default:"wrap"
			}
		},
	}
</script>

<style scoped>
	.goods{
		display: flex;
		flex-wrap: wrap;
	}
	.goods-item{
		width: 375rpx;
	}
	.goods-item image{
		width: 100%;
		height: 375rpx;
	}
	.text{
		text-align: center;
	}
	.name{
		overflow: hidden;
		text-overflow: ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
		color: #333;
		word-wrap: break-word;
		padding: 6rpx 20rpx;
	}
	.pprice,
	.discount{
		padding-top: 5rpx;
		text-align: center;
	}
	.oprice{
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999;
	}
	.discount{
		border-radius:4rpx;
		border: 1px solid #FF3333;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: #FF3333;
	}
</style>

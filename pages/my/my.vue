<template>
	<view class="my">
		<view class='my-header'>
			<view class='header-main'>
				<view class='header-config' @tap="goConfig">
					<image class='config-img' src="../../static/img/config.png" mode=""></image>
				</view>
				<view class='header-logo' >
					<image class='logo-img' :src="userInfo.imgUrl" mode=""></image>
					<view class='logo-name'>
						{{userInfo.nickName}}
					</view>
				</view>
			</view>
		</view> 	
		<view class='order'>
			<view class='order-title' @tap="goOrder">
				<view>我的订单</view>
				<view>全部订单 > </view>
			</view>
			<view class='order-list'>
				<view class='order-item'>
					<image  class='order-img' src="../../static/img/order1.png" mode=""></image>
					<view>待付款</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="../../static/img/order2.png" mode=""></image>
					<view>待发货</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="../../static/img/order3.png" mode=""></image>
					<view>待收货</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="../../static/img/order4.png" mode=""></image>
					<view>待评价</view>
				</view>
				<view class='order-item'>
					<image  class='order-img' src="../../static/img/order5.png" mode=""></image>
					<view>退款管理</view>
				</view>
			</view>
		</view>
		
		<!--内容列表-->
		<view class='my-content'>
			<view class="my-content-item">
				<view>我的收藏</view>
				<view>Go</view>
			</view>
			<view class="my-content-item">
				<view>加入超级VIP</view>
				<view>Go</view>
			</view>
			
		</view>
		<tabBar cureentPage="my"></tabBar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/TabBar.vue'
	import {mapState} from 'vuex'
	export default {
		components:{
			tabBar
		},
		data() {
			return {
			}
		},
		onLoad() {
		},
		methods: {
			goConfig(){
				uni.navigateTo({
					url:"../my-config/my-config"
				})
			},
			goOrder(){
				uni.navigateTo({
					url:'../my-order/my-order'
				})
			}
		},
		computed:{
			...mapState({
				userInfo:state=>state.user.userInfo
			}),
		}
	}
</script>

<style scoped>
.my-header{
	background: url(../../static/img/xingko.png) no-repeat;
	width: 100%;
	height: 400rpx;
}
.header-main{
	position: relative;
	top:120rpx;
}
.header-config{
	position: absolute;
	left:20rpx;
}
.header-logo{
	position: absolute;
	left:50%;
	margin-left:-60rpx;
	width:120rpx;
}
.config-img{
	width: 40rpx;
	height: 40rpx;
}
.logo-img{
	width: 120rpx;
	height: 120rpx;
	border:2rpx solid #CCCCCC;
	border-radius: 50%;
	background-color: #FFFFFF;
}
.logo-name{
	width: 100%;
	text-align: center;
	font-weight: bold;
	color:#FFFFFF;
}
.order-title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
}
.order-list{
	padding: 20rpx;
	display: flex;
}
.order-item{
	flex:1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.order-img{
	width:66rpx;
	height: 66rpx;
}
.my-content{
	margin:20rpx 0;
	padding:0 20rpx;
}
.my-content-item{
	display: flex;
	justify-content: space-between;
	align-items:center;
	padding:20rpx 0; 
	border-bottom: 2px solid #CCCCCC;
}
</style>

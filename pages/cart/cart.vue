<template>
	<view class="shop-cart">
		<template v-if='  list.length > 0  '>
		<uniNav
			title="购物车"
			:right-text="isNavBar==true?'完成':'编辑'"
			fixed=true
			status-bar=true
			@clickRight="isNavBar =!isNavBar"
		></uniNav>
		<!--商品内容-->
		
		<view class='shop-list'>
			<view class='shop-item' v-for='(item,index) in list' :key='index'>
				<label class="radio"  @tap="selectItem(index)"  >
					<radio value="" color="#FF3333" :checked="item.checked" /><text></text>
				</label>
				<image class='shop-img' :src="item.imgUrl" mode="aspectFill"></image>
				<view class='shop-text'>
					<view class='shop-name'>{{item.name}}</view>
					<view class='shop-color f-color'>{{item.style}}+{{item.size}}</view>
					<view class='shop-price'>
						<view>¥{{item.pprice}}</view>
						<view>*{{item.num}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class='shop-foot'>
			<label class="radio foot-radio" @tap="checkedAllFn">
				<radio value="" color='#FF3333' :checked="checkedAll" /><text>全选</text>
			</label>
			<template v-if='!isNavBar'>
				<view class='foot-total'>
					<view class='foot-count'>合计：<text class='f-active-color'>¥{{totalCount.pprice}}</text></view>
					<view class='foot-num' @tap='goConfirmOrder'>结算({{totalCount.num}})</view>

				</view>
			</template>
			<template v-else>
				<view class='foot-total'>
					<view class='foot-num' style="background-color: #000000;">移入收藏夹</view>
					<view class='foot-num' @tap='delCart'>删除</view>
				</view>
			</template>
		</view>
		

		</template>
		
		
		<template v-else>
			<uniNav title='购物车' status-bar='true' fixed='true'></uniNav>
			<view class='shop-else-list'>
				<text>囧～购物车还是空的～</text>
			</view>	
		</template>
		
		<tabBar cureentPage="cart"></tabBar>
	</view>
</template>

<script>
	// 网络请求
	import {selectCart} from '@/network/cart.js'
	import {mapMutations,mapState,mapActions,mapGetters} from 'vuex'
	import tabBar from '@/components/tabbar/TabBar.vue'
	import uniNav from '@/components/uni/uni-nav-bar/uni-nav-bar.vue'
	export default {
		components:{
			tabBar,
			uniNav
		},
		data() {
			return {
				isNavBar:false,
				all:false
			}
		}, 
		onLoad() {
			this.selectCart()
		},
		methods: {
			...mapMutations(['initGetData','selectItem']),
			...mapActions(['checkedAllFn','delGoodsFn']),
			async selectCart(){
				let res =  await selectCart()
				this.initGetData(res)
			},
			delCart(){
				this.delGoodsFn()
			},
			//进入确认订单
			goConfirmOrder(){
				uni.navigateTo({
					url:'../confirm-order/confirm-order'
				})
			}
		},
		computed:{
			...mapGetters(['checkedAll','totalCount']),
			...mapState({
				list:state => state.cart.list
			}),
		}
	}
</script>
<style scoped>
.shop-list{
	padding-bottom:200rpx;
}
.shop-else-list{
	position: absolute;
	left:0;
	top:0;
	right:0;
	bottom:0;
	background-color: #F7F7F7;
	display: flex;
	align-items: center;
	justify-content: center;
}
.shop-item{
	display: flex;
	padding:20rpx;
	align-items: center;
	background-color: #F7F7F7;
	margin-bottom:10rpx;
}
.shop-name{
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}
.shop-img{
	width:200rpx;
	height: 200rpx;
}
.shop-text{
	flex:1;
	padding-left:20rpx;
}
.shop-color{
	font-size:24rpx;
}
.shop-price{
	display: flex;
	justify-content: space-between;
}

.shop-foot{
	border-top:2rpx solid #F7F7F7;
	background-color: #FFFFFF;
	position: fixed;
	bottom:99rpx;
	left:0;
	width:100%;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

/* #ifdef APP-PLUS */
.shop-foot{
	border-top:2rpx solid #F7F7F7;
	background-color: #FFFFFF;
	position: fixed;
	bottom:99rpx;
	left:0;
	width:100%;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
/* #endif */


.foot-radio{
	padding-left:20rpx;
}
.foot-total{
	display: flex;
}
.foot-count{
	line-height: 100rpx;
	padding:0 20rpx;
	font-size:32rpx;
}
.foot-num{
	background-color: #49BDFB;
	color:#FFFFFF;
	padding:0 60rpx;
	line-height: 100rpx;
}
</style>

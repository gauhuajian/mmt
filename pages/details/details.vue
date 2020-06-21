<template>
	<view class="details">
		<!-- 轮播图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item v-for=" (item,index) in detailsData.topImages">
				<image class="swiper-img" :src="item" mode="aspectFill"></image>
			</swiper-item>
		</swiper>
		<!-- 信息-价格 -->
		<view class="details-goods">
			<view>{{detailsData.price}}</view>
			<view>{{detailsData.oldPrice}}</view>
			<view>{{detailsData.title}}</view>
			<view class="title ">
				{{result.key}}
			</view>
		</view>
		<!-- 效果图 -->
		<view >
			<image v-for=" (item,index) in result.list" :key="index" class="details-img" :src="item" mode="widthFix"></image>
		</view>
		<!-- 推荐 -->
		<Card title="看了又看"></Card>
		<GuessGoods :guess="recommendData"></GuessGoods>
		<!-- 底部 -->
		<view class='details-foot'>
			<view class='iconfont icon-xiaoxi'></view>
			<view class='iconfont icon-gouwuche' ></view>
			<view class='add-shopcart'  @tap='showPop' >加入购物车</view>
			<view class='purchase'  @tap='showPop' >立即购买</view>
		</view>
		<!-- 蒙层 -->
		<view class="pop"  v-show='isShow'  @touchmove.stop.prevent="">
			<view class="pop-mask" @tap='hidePop'></view>
			<view  class="pop-box" :animation="animationData">
				<view>
					<!-- 显示 -->
					<view class="deploy">
						<image v-if="skus" class="pop-img" :src="skus.img" mode="widthFix"></image>
						<view v-if="skus" class="deploy-parameter">
							<view class="price">
								{{skus.currency}}{{skus.nowprice}}
							</view>
							<view class="stock">
								库存{{skus.stock}}件
							</view>
							<view v-if="Active!=0 && ActiveTwo!=0" class="size-style">
								已选择:"{{skus.style}}"'{{skus.size}}'
							</view>
							<view v-else class="size-style">
								请选择:尺码
							</view>
						</view>
						
						<image v-if="!skus" class="pop-img" :src="option.skus[0].img" mode="widthFix"></image>
						<view v-if="!skus" class="deploy-parameter">
							<view class="price">
								￥{{option.skus[0].nowprice}}
							</view>
							<view class="stock">
								库存{{option.skus[0].stock}}件
							</view>
							<view class="size-style">
								请选择:尺码
							</view>
						</view>
					</view>
					<!-- 参数 -->
					<view class="parameter">
						<view class="parameter-item" v-for=" (item,index) in option.props" :key="index">
							<view class="parameter-item-title">
								{{item.label}}
							</view>
							<view class="parameter-item-set">
								<block  v-for=" (v,i) in item.list" :key="i"  >
									<view
									    class="parameter-text"
									    v-if="v.type=='style' "
										:class="Active==v.index?'parameter-active':''"
										@tap="parameterStyle(v.styleId,v.index)"
									>{{v.name}}</view>
									<view
									 class="parameter-text"
									 v-if="v.type=='size' "
									 :class="ActiveTwo==v.index?'parameter-active':''"
									 @tap="parameterSizeId(v.sizeId,v.index)"
									>{{v.name}}</view>
								</block>
							</view>
						</view>
					</view>
				</view>
				<UniNumber :min="1" :value='num' @change='changeNumber' ></UniNumber>
				<view class='pop-sub' @tap="addCart">
					确定
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	//vuex
	import {mapMutations} from 'vuex'
	// 网络
	import {getDetail,recommend} from '@/network/details.js'
	import {addCartData} from '@/network/cart.js'
	// 组件
	import GuessGoods from '@/components/common/GuessGoods.vue'
	import Card from '@/components/common/Card.vue'
	import UniNumber from '@/components/uni/uni-number-box/uni-number-box.vue' 
	export default {
		components:{
			Card,
			GuessGoods,
			UniNumber
		},
		data() {
			return {
				detailsData:{},
				result:{},
				recommendData:[],
				option:{
					props:[],
					skus:[
						{}
					]
				},
				styleIdAndSizeId:{
					styleId:"",
					sizeId:""
				},
				id:"",
				Active:0,
				ActiveTwo:0,
				isShow:false,
				animationData:'',
				num:1
			}
		},
		onLoad(e) {
			this.loadDetails(e.id)
			this.id = e.id
		},
		onNavigationBarButtonTap(e){
			if(e.type=='share'){
				uni.share({
					provider:"weixin",
					type:"0",
					title:this.detailsData.title,
					scene:"WXSceneSession",
					href:"http://172.20.10.9:8080/#/pages/details/details?id="+this.id,
					imageUrl:this.detailsData.topImages[0],
					success: function (res) {
						uni.showTabBar({
							title: '分享成功',
						});
					},
					fail: function (err) {
						console.log('fail:' + JSON.stringify(err));
					},
				})
			}
		},
		methods: {
			...mapMutations(['addShopCart']),
			 async loadDetails(id){
			 	let res = await getDetail(id)
				let data  = res.result
				this.detailsData = data.itemInfo
				this.result =data.detailInfo.detailImage[0]
				this.option.props = data.skuInfo.props
				this.option.skus = data.skuInfo.skus
				this.loadRecommend()
			},
			async loadRecommend(){
				let res = await recommend()
				this.recommendData.push(...res.list)
				
			},
			showPop(){
				var animation= uni.createAnimation({
				    duration: 200,
				})
				animation.translateY(600).step();
				setTimeout(() => {
					animation.translateY(0).step();
					this.isShow = true
					this.animationData = animation.export();
				}, 200);
			},
			hidePop(){
				var animation= uni.createAnimation({
				    duration: 200,
				})
				animation.translateY(600).step();
				this.animationData = animation.export();
				this.isShow = true;
				setTimeout(() => {
					animation.translateY(0).step();
					this.isShow = false;
				}, 200); 
			},
			parameterStyle(e,i){
				this.styleIdAndSizeId.styleId = e
				this.Active =i
			},
			parameterSizeId(e,i){
				this.styleIdAndSizeId.sizeId = e
				this.ActiveTwo =i
			},
			changeNumber(value){
				this.num = value;
			},
			addCart(){
				if(this.Active!=0 && this.ActiveTwo!=0){
					// 添加购物车
					let info = {}
					info.title = this.detailsData.title
					info.id = this.detailsData.iid
					info.img = this.skus.img
					info.price = this.skus.nowprice
					info.num = this.num
					info.size = this.skus.size
					info.style= this.skus.style
					info.checked = false
					addCartData(info)
					// vuex  数据  info
					this.addShopCart(info)
					this.hidePop()
					// 重置
					this.Active = this.ActiveTwo = 0
					this.num  = 1
					uni.showToast({
						title:"成功加入购物车",
						icon:'none'
					})
				}else{
					uni.showToast({
						title:"请选择尺寸和颜色",
						icon:'none'
					})
				}
			}
		},
		computed:{
			skus(){
				if( this.styleIdAndSizeId.styleId && this.styleIdAndSizeId.sizeId !=""){
					return this.option.skus.find((item)=>item.styleId == this.styleIdAndSizeId.styleId && item.sizeId==this.styleIdAndSizeId.sizeId )
				}else{
					return this.option.skus.find((item)=>item.styleId == this.styleIdAndSizeId.styleId)
				}
			}
		}
	}
</script>

<style scoped>
.details{
	padding-bottom: 90rpx;
}
swiper{
	width: 100%;
	height: 700rpx;
}
.swiper-img{
	width: 100%;
	height: 700rpx;
}

.details-goods{
	text-align: center;
	font-weight: bold;
	font-size:36rpx;
	padding:10rpx 0;
}
.title{
	margin-top: 30rpx;
}
.details-img{
	width: 100%;
}
.details-foot{
	position: fixed;
	left:0;
	bottom: 0;
	width:100%;
	height: 90rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #FFFFFF;
}
.details-foot .iconfont{
	width:60rpx;
	height: 60rpx;
	border-radius: 100%;
	background-color: #000000;
	color:#FFFFFF;
	text-align: center;
	margin:0 10rpx;
}
.add-shopcart{
	margin:0 40rpx;
	padding:6rpx 30rpx;
	background-color: #000000;
	color:#FFFFFF;
	border-radius: 40rpx;
}
.purchase{
	margin:0 40rpx;
	padding:6rpx 30rpx;
	background-color: #49BDFB;
	color:#FFFFFF;
	border-radius: 40rpx;
}
.pop{
	position: fixed;
	left:0;
	top:0;
	width: 100%;
	height: 100%;
	z-index: 99;
}
.pop-mask{
	position: absolute;
	left:0;
	top:0;
	width: 100%;
	height: 100%;
	background-color: rgba(0,0,0,0.3);
}
.pop-box{
	position: absolute;
	left:0;
	bottom:0rpx;
	width: 100%;
	background-color: #FFFFFF;
}
.deploy{
	display: flex;
	height: 200rpx;
	padding-left: 30rpx;
}
.deploy-parameter{
	padding: 10rpx;
}
.pop-img{
	position: relative;
	top: -100rpx;
	width: 170rpx;
	height: 170rpx;
}
.parameter{
	padding: 10rpx;
}
.parameter-item-set{
	display: flex;
	flex-wrap: wrap;
}
.parameter-text{
	margin-right: 20rpx;
	margin-bottom: 20rpx;
	padding: 0rpx 30rpx;
	border: 2rpx solid #ddd;
	line-height: 54rpx;
	border-radius: 10rpx;
	font-size: 24rpx;
}
.parameter-active{
	border: 2rpx solid #49BDFB ;
	color: #49BDFB;
}
.pop-num{
	padding:20rpx;
	display: flex;
	justify-content: space-between;
}
.pop-sub{
	margin-top: 20rpx;
	line-height: 80rpx;
	background-color: #49BDFB;
	color:#FFFFFF;
	text-align: center;
}
</style>

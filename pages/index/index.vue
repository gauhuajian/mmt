<template>
	<view class="content">
		<scroll-view scroll-x="true" class="scroll-content" :scroll-into-view="topId" >
			<view
			:id="'top'+index"
			 class="scroll-item " 
			 v-for="(item,index) in topTab" 
			 :key="item.id"
			 @tap="scrollActive(item.id,index)"
			 >
				<text :class="topTabIndex==index?'f-active-color':'f-color'" >{{item.name}}</text>
			</view>
		</scroll-view>
		<swiper @change="changeSwiper" :current="topTabIndex"   :style="'height:'+clineHeight+'px;'">
			<swiper-item 
				v-for="(item,index) in gather"
				:key="index"
				 :style="'height:'+clineHeight+'px;'"
			>
				<scroll-view scroll-y="true"  :style="'height:'+clineHeight+'px;'" :lower-threshold="50" @scrolltolower="loadMore" >
					<view class="home-data" >
						<block v-for="(v,i) in item.data" :key="i">
							
							<!-- 首页index -->
							<Banner v-if="v.type=='swiperList'" :BannerData="v.data"></Banner>
							<Recommend v-if="v.type=='Recommend'" :recommend="v.data" ></Recommend>
							<Card v-if="v.type=='Recommend'" title="猜你喜欢"></Card>
							<!-- end -->
							<!-- 其他页面 -->
							<IndexSwiper v-if="v.type=='bannerList' " :swiperData="v.imgUrl" ></IndexSwiper>
							<icons v-if="v.type== 'iconsList' " :iconsList="v.data" ></icons>
							<Card  v-if="v.type== 'iconsList' " title="热销爆品"></Card>
							<Goods v-if="v.type =='hotList' " :goods="v.data" itemW="250rpx" bigH="220rpx" ></Goods>
							<Card  v-if="v.type =='hotList' " title="推荐店铺"></Card>
							<shop v-if=" v.type== 'shopList'" :shopList="v.data" ></shop>
							<Card v-if=" v.type== 'shopList'" title="猜你喜欢"></Card>
							<!-- end -->
							
							<GuessGoods v-if="v.type=='guess'" :guess="v.data"></GuessGoods>
						</block>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		<tabBar cureentPage="index"></tabBar>
	</view>
</template>

<script>
	// 请求
	import {loadIndex,multitermData,recommend} from '@/network/index.js'
	// 相关组件
	import Banner from '@/components/index/Banner.vue'
	import Recommend from '@/components/index/Recommend.vue'
	import IndexSwiper from '@/components/index/IndexSwiper.vue'
	import Icons from '@/components/index/Icons.vue'
	import shop from '@/components/index/shop.vue'
	//公共组件
	import Card from '@/components/common/Card.vue'
	import Goods from "@/components/common/Goods.vue"
	import GuessGoods from '@/components/common/GuessGoods.vue'
	import tabBar from '@/components/tabbar/TabBar.vue'
	export default{
		components:{
			Banner,
			Recommend,
			Card,
			IndexSwiper,
			Icons,
			Goods,
			shop,
			GuessGoods,
			tabBar
		},
		data(){
			return {
				topTab:[] ,//头部选项
				topTabIndex:'0', //top 首页
				topId:'top0', //top子id
				gather:[] ,//首页数据集合
				clineHeight:0,//可视高度
				recommendList:[] ,//猜你喜欢数据
				page:1
			}
		},
		onLoad() {
			this._initIndex() //首次渲染
			uni.getSystemInfo({
				success:(res)=>{
					this.clineHeight = res.windowHeight - this.getClientHeight()
				}
			})
		},
		onNavigationBarButtonTap(e){
			if(e.float == 'left'){
				uni.navigateTo({
					url:"../search/search"
				})
			}
		},
		methods:{
			// 兼容app高度
			getClientHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return 44 + res.statusBarHeight;
				} else if (system === 'android') {
					return 48 + res.statusBarHeight;
				} else {
					return 0;
				}
			},
			// 请求首页
			async _initIndex(){
				let res = await loadIndex()
				this.topTab = res.topTab
				this.gather = this._initData(res.data)
				this.gather[this.topTabIndex].load ='end' //请求控制
				this.loadRecommend()
			},
			//  滑动页数据
			async activeMultitermData(num){
				let res = await multitermData(num,1)
				this.gather[this.topTabIndex].data=[...this.gather[this.topTabIndex].data,...res]
				this.gather[this.topTabIndex].load ='end' //请求控制
				this.page = 1
				this.loadRecommend(this.page)
			},
			// 猜你喜欢数据
			async loadRecommend(page){
				let res = await recommend(page)
				this.gather[this.topTabIndex].data.push({
					'data':[...res.list],
					'type':'guess'
				})
			},
			// 上拉加载更多
			loadMore(){
				this.page++
				this.loadRecommend(this.page)
			},
			// 选项点击
			scrollActive(id,index){
				this.topTabIndex = index
			},
			// 页面滑动
			changeSwiper(e){
				const index = e.detail.current
				this.topTabIndex = index
				this.topId = "top"+index
				if(this.gather[index].load!=="end"){  //判断是否请求过
					this.activeMultitermData(index+1)
				}
			},
			// 分配数据容器
			_initData(data){
				let arr = []
				this.topTab.forEach((item,index)=>{
					let obj = {
						data:[],
						load:'first', //请求控制
					}
					if(index==0){
						obj.data = data
					}
					arr.push(obj)
				})
				return arr
			}
			 
		}
	}
</script>

<style scoped>
	.scroll-content{
		width: 100%;
		height: 80rpx;
		white-space: nowrap; 
	}
	.scroll-item{
		/* float: left; */
		display: inline-block;
		padding: 10rpx 30rpx;
		font-size: 36rpx;
	}
	.f-active-color{
		padding-bottom: 3rpx;
		border-bottom: 6rpx solid #49BDFB;
	}
	.load-text {
		border-top: 2rpx solid #636263;
		line-height: 60rpx;
		text-align: center;
	}
</style>

<template>
	<view class="category">
		<!-- 左边 -->
		<scroll-view scroll-y="true" :style="'height:'+clineHeight+'px;'">
			<view class="list-left">
				<view class="left-item" 
					v-for="(item,index) in cateList"
					:key="index"
					@tap="leftItemClick(index)"
					:class="{'left-name-active':activeIndex==index}"
				>
					<view class="left-name ">
						{{item.title}}
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 右边 -->
		<scroll-view scroll-y="true":style="'height:'+clineHeight+'px;'" >
			<view class="right-list">
				<view 
					class="right-item"
					v-for="(item,index) in gather[activeIndex].data"
					:key="index"
				>
					<image :src="item.image" mode=""></image>
					<view class="right-name">
						{{item.title}}
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import {loadCategory,getSubcategory} from '@/network/category.js'
	export default {
		data() {
			return {
				cateList:[],
				gather:[
					{
						data:[],
						load:'start'
					}
				],
				activeIndex:0,
				clineHeight:0,
			}
		},
		onLoad() {
			this._initCartgory() //首页数据
			uni.getSystemInfo({ //scroll 高度
				success:(res)=>{
					this.clineHeight = res.windowHeight- this.getClientHeight()
				}
			})
		},
		methods: {
			// 兼容app高度
			getClientHeight() {
				const res = uni.getSystemInfoSync();
				const system = res.platform;
				if (system === 'ios') {
					return  res.statusBarHeight;
				} else if (system === 'android') {
					return  res.statusBarHeight;
				} else {
					return 0;
				}
			},
			// 左边栏数据
			async _initCartgory(){
				let res = await loadCategory()
				this.cateList = res.category.list
				this.gather = this.initData()
				this.loadSubCategory()
			},
			// 主内容请数据
			async loadSubCategory(){
				let maitKey = this.cateList[this.activeIndex].maitKey
				let res = await getSubcategory(maitKey)
				this.gather[this.activeIndex].data = [...res.list]
				this.gather[this.activeIndex].load ='end' //请求控制
			},
			// 左边栏点击
			leftItemClick(index){
				this.activeIndex = index
				if(this.gather[this.activeIndex].load!='end'){ //请求控制
					this.loadSubCategory()
				}
			},
			// 数据集合
			initData(){
				let arr = []
				for( let i = 0; this.cateList.length > i; i++ ){
					let obj = {
						data:[],
						load:'start'
					}
					arr.push(obj)
				}
				return arr
			}
		}
	}
</script>

<style scoped>
	.category{
		display: flex;
	}
	.list-left{
		width: 200rpx;
	}
	.left-item{
		border-bottom:2rpx solid #FFFFFF;
		font-size:28rpx;
		font-weight: bold;
		background-color: #F7F7F7;
	}
	.left-name{
		padding:30rpx 6rpx;
		text-align: center;
	}
	.left-name-active{
		border-left:8rpx solid #49BDFB;
		background-color: #FFFFFF;
	}
	.right-list{
		flex:1;
		padding-left:30rpx;
		display: flex;
		flex-wrap: wrap;
	}
	.right-item{
		width: 33%;
		padding: 20rpx 0;
	}
	.right-item image{
		display: block;
		width: 150rpx;
		height: 150rpx;
		margin: auto;
	}
	.right-name{
		text-align: center;
	}
</style>

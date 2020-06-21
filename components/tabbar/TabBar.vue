<template>
	<view class="tabbar">
		<view 
			class="tab"
			v-for="(item,index) in tabbarlist" 
			:key="index"
			@tap='navigatorTo(item.pagePath)'
	
		>
			<image v-if="item.pagePath==cureentPage" :src="item.selectedIconPath" mode=""></image>
			<image  v-else :src="item.iconPath" mode=""></image>
			<view class="text">
				{{item.text}}
			</view>
		</view>
	</view>
</template> 

<script>
import {mapState} from 'vuex'
export default{
	props:{
		cureentPage:{
			type:String
		}
	},
	created() {
		console.log()
	},
	data(){
		return{
			tabbarlist:[
				{
				"pagePath": "index",
				"iconPath":"/static/tabbar/index.png",
				"selectedIconPath":"/static/tabbar/indexSelected.png",
				"text": "首页"
				},
				{
					"pagePath": "category",
					"iconPath":"/static/tabbar/list.png",
					"selectedIconPath":"/static/tabbar/listSelected.png",
					"text": "分类"
				},
				{
					"pagePath": "cart",
					"iconPath":"/static/tabbar/shop.png",
					"selectedIconPath":"/static/tabbar/shopSelected.png",
					"text": "购物车"
				},
				{
					"pagePath": "my",
					"iconPath":"/static/tabbar/my.png",
					"selectedIconPath":"/static/tabbar/mySelected.png",
					"text": "我的"
				}
			]
		}
	},
	methods:{
		navigatorTo(e){
			if(  e==='cart'  ||  e==='my' ){
				if(!this.token){
					uni.navigateTo({
						url:"../../pages/login/login",
						animationType:"fade-in",
						animationDuration:0
					})
				}else{
					uni.redirectTo({
						url:`../../pages/${e}/${e}`
					})
				}
			}else{
				uni.redirectTo({
					url:`../../pages/${e}/${e}`
				})
			}
		}
	},
	computed:{
		...mapState({
			token:state=>state.user.token
		})
	}
}

</script>

<style scoped>
	.tabbar{
		background-color: #FFFFFF;
		z-index: 9999;
		position: fixed;
		left:0;
		bottom:0;
		width:100%;
		height: 98rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
	}
	.tab{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	image{
		width: 40rpx;
		height: 40rpx;
	}
	.text{
		font-size:24rpx;
	}
</style>

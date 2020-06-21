<template>
	<view class='my-add-path'>
			
			<view class='path-item'>
				<view>收 件 人</view>
				<input type="text" v-model="pathObj.name" placeholder="收件人姓名"/>
			</view>
			
			<view class='path-item'>
				<view>手 机 号</view>
				<input type="text" v-model="pathObj.tel" placeholder="11位手机号"/>
			</view>
			
			<view class='path-item'>
				<view>所在地址</view>
				<view @tap='showCityPicker'> {{cityName}} </view>
				<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="pickerValueDefault" @onConfirm="onConfirm">
				</mpvue-city-picker>
			</view>
			
			<view class='path-item'>
				<view>详细地址</view>
				<input type="text" v-model="pathObj.address" placeholder="5到60个字符"/>
			</view>
			
			<view class='path-item'>
				<view>设为默认地址</view>
				<radio-group name="" @change="radioChange">
					<label class="radio">
						<radio color="#FF3333" :checked="pathObj.isDefault"/><text></text>
					</label>
				</radio-group>
			</view>
			
		</view>
</template>

<script>
	import {addAddress,updateAddress} from '@/network/path.js'
	import {mapActions} from 'vuex'
	import mpvueCityPicker from '@/components/uni/mpvue-citypicker/mpvueCityPicker.vue'
	export default {
		components:{
			mpvueCityPicker
		},
		data() {
			return {
				pickerValueDefault: [0, 0, 1],
				pathObj:{
					name:"",
					tel:"",
					province:"",
					city:"请选择",
					dlistrict:"",
					address:"",
					isDefault:false
				},
				i:-1,
				//是否修改的状态
				isStatus:false
			}
		},
		onLoad(e) {
			if(e.data){
				uni.setNavigationBarTitle({
					title:"修改地址"
				})
				let result = JSON.parse(e.data);
				this.pathObj = result.item;
				this.i = result.index;
				this.isStatus = true;
			}
		},
		onNavigationBarButtonTap(){
			if( this.isStatus ){
				//修改
				updateAddress(this.pathObj).then(res=>{
					this.updatePathFn({
						index:this.i,
						item:this.pathObj
					})
					uni.navigateBack({
						delta:1
					})
				})
				
			}else{
				//新增
				addAddress(this.pathObj).then(res=>{
					this.createPathFn(this.pathObj);
					uni.showToast({
						title:res.success,
						icon:"none"
					})
				})
				uni.navigateBack({
					delta:1
				})
			}
		},
		methods: {
				showCityPicker() {
				  this.$refs.mpvueCityPicker.show();
				},
				onConfirm(e) {
				  let arr = e.label.split('-')
				  this.pathObj.province = arr[0]
				  this.pathObj.city = arr[1]
				  this.pathObj.dlistrict = arr[2]
				  
				},
				radioChange(){
					this.pathObj.isDefault = !this.pathObj.isDefault;
				},
				...mapActions(["createPathFn",'updatePathFn']),
		},
		computed:{
			cityName(){
				return this.pathObj.province+'-'+this.pathObj.city+'-'+this.pathObj.dlistrict
			}
		}
	}
</script>

<style scoped>
.my-add-path{
	padding-left:20rpx;
}
.path-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding:16rpx 0;
	width: 100%;
	border-bottom: 2rpx solid #CCCCCC;
}
.path-item input{
	flex:1;
	text-align: left;
	padding-left:10rpx;
}
</style>
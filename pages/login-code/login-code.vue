<template>
	<view>
		<Lines></Lines>
		<view class='login-tel'>
			<view class='tel-main'>
				<view class='login-from'>
					<view class='login-user'>
						<text class='user-text'>验证码</text>
						<input type="text" placeholder="请输入验证码" v-model="userCode"/>
						<button plain='true' size='mini' :disabled="disabled" >{{codeMsg}}</button>
					</view>
				</view>
				<view class='tel' @tap="goNextIndex">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	import {sendCode,addUserData} from '@/network/login.js'
	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				//倒计时到时间
				codeNum:60,
				//显示到文本
				codeMsg:"",
				//按钮是否禁用
				disabled:false,
				//用户输入的内容
				userCode:'',
				phone:'',
				getCode:''
			}
		},
		components:{
			Lines
		},
		onLoad(e) {
			this.phone =  e.phone
		},
		onReady() {
			this.codeMsg = '重新发送('+this.codeNum+')';
			this.sendCode();
		},
		methods: {
			...mapMutations(['login']),
			//点击验证码发送
			async sendCode(){
				this.disabled = true;
				let res =  await sendCode(this.phone)
				this.getCode = res.code
				console.log(res)
				let timer = setInterval(()=>{
					--this.codeNum;
					this.codeMsg = '重新发送('+this.codeNum+')';
				},1000);
				setTimeout(()=>{
					clearInterval(timer);
					this.codeNum=60;
					this.disabled = false;
					this.codeMsg = '重新发送';
				},60000)
			},
			async goNextIndex(){
				if(this.getCode == this.userCode ){
				 	let res = await addUserData(this.phone,this.userCode)
					if(res.success){
						this.login(res.data);
						uni.redirectTo({
							url:"../index/index"
						})
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
					}
				}else{
					uni.showToast({
						title:"验证码错误",
						icon:"none"
					})
				}
			}
		}
	}
</script>

<style scoped>
.login-tel{
	width: 100vw;
	height: 100vh;
}
.tel-main{
	padding:0 20rpx;
}
.login-from{
	padding:30rpx 0;
}
.login-user{
	font-size:32rpx;
	padding:10rpx 0;
	display: flex;
	align-items: center;
	border-bottom:2rpx solid #f7f7f7;
}
.user-text{
	padding-right:10rpx;
}
.tel{
	width:100%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color:#FFFFFF;
	background-color: #49BDFB;
	border-radius: 40rpx;
}
</style>

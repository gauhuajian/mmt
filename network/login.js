import {request} from '@/network/request.js'
// 查询手机号
export function selectPhone(phone){
	return request({
		url:'/registered',
		method:"POST",
		data:{
			phone
		}
	})
}

//发送验证码
export function sendCode(userName){
	return request({
		url:'/code',
		method:"POST",
		data:{
			userName
		}
	})
}

// 注册
export function addUserData(userName,code){
	return request({
		url:'/addUser',
		method:"POST",
		data:{
			userName,
			code
		}
	})
}

// 登录
export function login(userName,userPwd){
	return request({
		url:'/login',
		method:"POST",
		data:{
			userName,
			userPwd
		}
	})
}

// 第三方
export function loginother(provider,openid,nickName,avatarUrl){
	return request({
		url:'/loginother',
		method:"POST",
		data:{
			provider,
			openid,
			nickName,
			avatarUrl
		},
	})
}
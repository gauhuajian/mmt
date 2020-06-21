import {request} from './request.js'

export function addCartData(obj){
	return request({
		url:"/addCart",
		method:"POST",
		token:true,
		data:{
			...obj
		}
	})
}

export function selectCart(){
	return request({
		url:"/selectCart",
		method:"POST",
		token:true,
	})
	
}

export function delCart(obj){
	return request({
		url:"/delCart",
		method:"POST",
		token:true,
		data:{
			...obj
		}
	})
	
}


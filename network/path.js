import {request} from './request.js'


export function initAddress(){
	return request({
		url:"/selectAddress",
		token:true,
		method:"POST"
	})
}
 
 export function addAddress(obj){
 	return request({
 		url:"/addAddress",
 		token:true,
 		method:"POST",
		data:{
			...obj
		}
 	})
 }
 


export function updateAddress(obj){
 	return request({
 		url:"/updateAddress",
 		token:true,
 		method:"POST",
		data:{
			...obj
		}
 	})
 }
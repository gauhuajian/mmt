import {request} from '@/network/request.js'

export function selectPhone(phone){
	return request({
		url:'/registered',
		method:"POST",
		data:{
			phone
		}
	})
}
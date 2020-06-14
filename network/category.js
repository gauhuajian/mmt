import {request} from '@/network/request.js'

// 左边栏请求
export function loadCategory(){
	return request({
		urlOption:"two",
		url: "/category"
	})
}
// 主内容请求
export function getSubcategory(maitKey){
	return request({
		url:"/subcategory",
		urlOption:"two",
		data:{
			maitKey
		}
	})
}
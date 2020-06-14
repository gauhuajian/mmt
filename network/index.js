import {request} from '@/network/request.js'

// 首页数据
export function loadIndex(){
	return request({
		url:"/index_list/data"
	})
}

export function multitermData(num,page){
	return request({
		url:`/index_list/${num}/data/${page}`
	})
}

// 推荐
export function recommend(page=1){
	return request({
		urlOption:'two',
		url:"/home/data?type=pop&page="+page
	})
}
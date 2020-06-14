import {request} from './request.js'

export function getDetail(iid) {
    return request({
        url: '/detail',
		urlOption:"two",
		data:{
			iid
		}
    })
}

export function recommend(page=1){
	return request({
		urlOption:'two',
		url:"/home/data?type=new&page="+page
	})
}
const common = 'http://43.226.156.65:3000/api'
const conmmonTwo = 'http://152.136.185.210:8000/api/n3'
import store from '@/store/index.js'
export function request(obj = {}){
	const token = store.state.user.token
	uni.showLoading({
		title: '加载中'
	});
	let option = {}
	if(obj.urlOption=='two'){
		option.url = conmmonTwo+obj.url
	}else{
		option.url = common+obj.url
	}
	option.data = obj.data
	if(obj.token==true){
		obj.header={
			'token':token
		}
	}
	option.header =obj.header ||  {
		"Content-Type":"application/json",
		"Content-Type":"application/x-www-form-urlencoded"
	} 
	option.method =  obj.method || "GET" 
	option.dataType = obj.dataType || 'json'
	
	return new Promise((res,rej)=>{
		uni.request({
			...option,
			success: (result) => {
				setTimeout(function () {
					uni.hideLoading();
				}, 500);
				let data = result.data.data;
				if(data){
					res(data);
				}else{
					res(result.data);
				}
			}
		})
	})
}
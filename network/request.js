const common = 'http://172.20.10.9:3000/api'
const conmmonTwo = 'http://152.136.185.210:8000/api/n3'
export function request(obj = {}){
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
	option.header = {
		"Content-Type":"application/json",
		"Content-Type":"application/x-www-form-urlencoded"
	} || obj.header
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
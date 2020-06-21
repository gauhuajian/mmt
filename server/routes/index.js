var express = require('express');
var router = express.Router();
var connection = require('../db/sql.js');
var user = require('../db/user.js');
var jwt_decode = require('jwt-decode');

//验证码
let code = '';
//接入短信的sdk
var QcloudSms = require("qcloudsms_js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Content-Type', 'application/json;charset=utf-8');
	next();
});


//发送验证码
router.post('/api/code', function(req, res, next) {
	//前端给后端的数据
	let params = {
		userName : req.body.userName
	};
	// 短信应用 SDK AppID
	var appid = 1400187558;  // SDK AppID 以1400开头
	// 短信应用 SDK AppKey
	var appkey = "dc9dc3391896235ddc2325685047edc7";
	// 需要发送短信的手机号码
	var phoneNumbers = [params.userName];
	// 短信模板 ID，需要在短信控制台中申请
	var templateId = 298000;  // NOTE: 这里的模板ID`7839`只是示例，真实的模板 ID 需要在短信控制台中申请
	// 签名
	var smsSign = "买买提";  // NOTE: 签名参数使用的是`签名内容`，而不是`签名ID`。这里的签名"腾讯云"只是示例，真实的签名需要在短信控制台申请
	// 实例化 QcloudSms
	var qcloudsms = QcloudSms(appid, appkey);
	// 设置请求回调处理, 这里只是演示，用户需要自定义相应处理回调
	function callback(err, ress, resData) {
	  if (err) {
	      console.log("err: ", err);
	  } else {
		  code = ress.req.body.params[0];
	      res.send({
			  data:{
				  success:true,
				  code:code
			  }
		  })
	  }
	}
	var ssender = qcloudsms.SmsSingleSender();
	var paramss = [  Math.floor( Math.random()*(9999-1000))+1000 ];//发送的验证码
	ssender.sendWithParam("86", phoneNumbers[0], templateId,
	paramss, smsSign, "", "", callback); 
	
})


router.post('/api/loginother', function(req, res, next) {
	//前端给后端的数据
	let params = {
		provider:req.body.provider,//登录方式
		openid:req.body.openid,//用户身份id
		nickName:req.body.nickName,//用户昵称
		avatarUrl:req.body.avatarUrl//用户头像
	};
	//查询数据库中有没有此用户
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0){
			//数据库中存在      : 读取
			connection.query( user.queryUserName( params ) , function (e, r) {
				res.send({
					data:r[0]
				})
			})
		}else{
			//数据库中[不]存在  : 存储 ==>读取
			connection.query( user.insertData( params ) , function (er, result) {
				connection.query( user.queryUserName( params ) , function (e, r) {
					res.send({
						data:r[0]
					})
				})
			})
		} 
	})
	
})

//注册===>增加一条数据
router.post('/api/addUser', function(req, res, next) {
	//前端给后端的数据
	let params = {
		userName : req.body.userName,
		userCode : req.body.code
	};
	console.log(params,code)
	if(  params.userCode == code   ){
		connection.query( user.insertData( params ) , function (error, results, fields) {
		    connection.query( user.queryUserName( params ) , function (err, result) {
				res.send({
					data:{
						success:true,
						msg:"注册成功",
						data:result[0]
					}
				})
			})
		})
	}
	
})

//注册验证手机号是否存在
router.post('/api/registered', function(req, res, next) {
	
	//前端给后端的数据
	let params = {
		userName : req.body.phone
	};
	//查询手机号是否存在
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
		if( results.length > 0 ){
			res.send({
				data:{
					success:false,
					msg:"手机号已经存在"
				}
			})
		}else{
			res.send({
				data:{
					success:true
				}
			})
		}
	})
	
})

router.post('/api/login',function(req,res,next){
	//前端给后端的数据
	let params = {
		userName : req.body.userName,
		userPwd  : req.body.userPwd
	}
	connection.query( user.queryUserName( params ) , function (error, results, fields) {
			if( results.length > 0 ){
				 connection.query( user.queryUserPwd( params ) , function (err, result) {
					 if(  result.length > 0 ){
						 res.send({
						 	data:{
						 		success:true,
						 		msg:"登录成功",
								data:result[0]
						 	}
						 })
					 }else{
						 res.send({
							data:{
								success:false,
								msg:"密码不正确"
							}
						 })
					 }
				 })
			}else{
				res.send({
					data:{
						success:false,
						msg:"用户名或手机号不存在"
					}
				})
			}
		 })
})

//获取当前用户购物车列表
router.post('/api/selectCart', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	if(phone.name.length>11){
		connection.query(`select * from user where openid = '${phone.name}' ` , function (error, results, fields) {
			let userId = results[0].id;
			connection.query(`select * from goods_cart where uId = ${userId}`, function (err, result) {
				res.json({
					data:result
				})
			})
		})
	}else{
		connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
				let userId = results[0].id;
				connection.query(`select * from goods_cart where uId = ${userId}`, function (err, result) {
					res.json({
						data:result
					})
				})
		})
	}
})


//加入购物车
router.post('/api/addCart', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	//商品id
	let goods = req.body;
	//用户输入的商品数量
	if(phone.name.length>11){
		console.log(phone.name)
		connection.query(`select * from user where openid = '${phone.name}'`, function (error, results, fields) {
			let uId = results[0].id
			connection.query("select * from goods_cart where goods_id = '"+goods.id+"' and uId="+ uId+" and size='"+goods.size+"'"+"and style='"+goods.style+"'", function (error, d, fields) {
				if(d.length>0){
					connection.query("update goods_cart set num = num+"+goods.num+" where goods_id='"+goods.id+"' and uId="+ uId+" and size='"+goods.size+"'"+"and style='"+goods.style+"'" , function (e, r) {
						res.json({
							data:{
								success:"加入成功"
							}
						})
					})
				}else{
					connection.query('insert into goods_cart (uId,goods_id,name,imgUrl,pprice,num,size,style) values ("'+uId+'","'+goods.id+'","'+goods.title+'","'+goods.img+'","'+goods.price+'","'+goods.num+'","'+goods.size+'","'+goods.style+'")', function (err, data) {
						res.json({
							data:{
								success:"加入成功"
							}
						})
					})
				}
			})
			
		})
	}else{
		connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
			let uId = results[0].id
			connection.query("select * from goods_cart where goods_id = '"+goods.id+"' and uId="+ uId+" and size='"+goods.size+"'"+"and style='"+goods.style+"'", function (error, d, fields) {
				if(d.length>0){
					connection.query("update goods_cart set num = num+"+goods.num+" where goods_id='"+goods.id+"' and uId="+ uId+" and size='"+goods.size+"'"+"and style='"+goods.style+"'", function (e, r) {
						res.json({
							data:{
								success:"加入成功"
							}
						})
					})
				}else{
					connection.query('insert into goods_cart (uId,goods_id,name,imgUrl,pprice,num,size,style) values ("'+uId+'","'+goods.id+'","'+goods.title+'","'+goods.img+'","'+goods.price+'","'+goods.num+'","'+goods.size+'","'+goods.style+'")', function (err, data) {
						res.json({
							data:{
								success:"加入成功"
							}
						})
					})
				}
			})
			
		})
	}
})


//当前用户修改收货地址
router.post('/api/updateAddress', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	let name = req.body.name;
	let tel = req.body.tel;
	let province = req.body.province;
	let city = req.body.city;
	let dlistrict = req.body.dlistrict;
	let address = req.body.address;
	let isDefault = req.body.isDefault;
	let id = req.body.id;
	//获取userId
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		let userId = results[0].id;
		connection.query(`select * from address where userId = ${userId}`, function (err, result) {
			let childId = result[0].id;
			connection.query(`update address set isDefault = replace(isDefault,"true","false") where id = ${childId}`, function (e, r) {
				let updateSql = `update address set name = ?,tel = ?,province = ?,city = ?,dlistrict = ?,address = ?,isDefault = ?,userId = ? where id = ${id}`
				connection.query(updateSql,[name,tel,province,city,dlistrict,address,isDefault,userId],function (err, result) {
					res.send({
						data:{
							success:'成功'
						}
					})
				})
			})
		})
	})
})


//当前用户新增收货地址
router.post('/api/addAddress', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	let name = req.body.name;
	let tel = req.body.tel;
	let province = req.body.province;
	let city = req.body.city;
	let dlistrict = req.body.dlistrict;
	let address = req.body.address;
	let isDefault = req.body.isDefault;
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		let id = results[0].id;
		let sqlInert = 'insert into address (name,tel,province,city,dlistrict,address,isDefault,userId) values ("'+name+'","'+tel+'","'+province+'","'+city+'","'+dlistrict+'","'+address+'","'+isDefault+'","'+id+'")';
		connection.query(sqlInert, function (err, result, field) {
			res.send({
				data:{
					success:"成功"
				}
			})
		})
	})
})

// 获取用户地址
router.post('/api/selectAddress', function(req, res, next) {
	let token = req.headers.token;
	let phone = jwt_decode(token);
	connection.query(`select * from user where phone = ${phone.name}`, function (error, results, fields) {
		let id = results[0].id;
		connection.query(`select * from address where userId = ${id}`, function (err, result, field) {
			res.send({
				data:result
			})
		})
	})
})


//食品第一次加载的数据
router.get('/api/index_list/7/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"/static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"/static/img/icons1.png",name:"跑步鞋"},
				  {imgUrl:"/static/img/icons2.png",name:"篮球鞋"},
				  {imgUrl:"/static/img/icons3.png",name:"运动鞋"},
				  {imgUrl:"/static/img/icons4.png",name:"户外鞋"},
				  {imgUrl:"/static/img/icons5.png",name:"运动T"},
				  {imgUrl:"/static/img/icons6.png",name:"夹克/连帽衫"},
				  {imgUrl:"/static/img/icons7.png",name:"运动裤"},
				  {imgUrl:"/static/img/icons8.png",name:"冲锋衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"/static/img/hot1.jpg",
				  	name:"精品男鞋，sk8-h系列",
				  	pprice:"449",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"/static/img/hot2.jpg",
				  	name:"vams纺丝白，经典系列火热销售",
				  	pprice:"299",
				  	oprice:"409",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"/static/img/hot3.jpg",
				  	name:"埃尔德经典系列，puls2020版本火热销售",
				  	pprice:"599",
				  	oprice:"729",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"/static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"/static/img/shop1.jpg",
						 	name:"361系列跑步男鞋，黑白色",
						 	pprice:"199",
						 	oprice:"359",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"/static/img/shop2.jpg",
						 	name:"361系列，悠闲跑鞋逐风者hx-seq1系",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"/static/img/shop3.jpg",
						 	name:"361旗舰店正品2020新款耐磨软底跑步鞋学生",
						 	pprice:"259",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"/static/img/shop4.jpg",
						 	name:"361男鞋运动鞋2020春季新款休闲鞋老爹鞋子",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 }
					  ]
				  }		  
			  ]
		  }
	  ]
  })
});

//数码第一次加载的数据
router.get('/api/index_list/6/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"/static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"/static/img/icons1.png",name:"跑步鞋"},
				  {imgUrl:"/static/img/icons2.png",name:"篮球鞋"},
				  {imgUrl:"/static/img/icons3.png",name:"运动鞋"},
				  {imgUrl:"/static/img/icons4.png",name:"户外鞋"},
				  {imgUrl:"/static/img/icons5.png",name:"运动T"},
				  {imgUrl:"/static/img/icons6.png",name:"夹克/连帽衫"},
				  {imgUrl:"/static/img/icons7.png",name:"运动裤"},
				  {imgUrl:"/static/img/icons8.png",name:"冲锋衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"/static/img/hot1.jpg",
				  	name:"精品男鞋，sk8-h系列",
				  	pprice:"449",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"/static/img/hot2.jpg",
				  	name:"vams纺丝白，经典系列火热销售",
				  	pprice:"299",
				  	oprice:"409",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"/static/img/hot3.jpg",
				  	name:"埃尔德经典系列，puls2020版本火热销售",
				  	pprice:"599",
				  	oprice:"729",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"/static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"/static/img/shop1.jpg",
						 	name:"361系列跑步男鞋，黑白色",
						 	pprice:"199",
						 	oprice:"359",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"/static/img/shop2.jpg",
						 	name:"361系列，悠闲跑鞋逐风者hx-seq1系",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"/static/img/shop3.jpg",
						 	name:"361旗舰店正品2020新款耐磨软底跑步鞋学生",
						 	pprice:"259",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"/static/img/shop4.jpg",
						 	name:"361男鞋运动鞋2020春季新款休闲鞋老爹鞋子",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 }
					  ]
				  }		  
			  ]
		  }
	  ]
  })
});


//美护第一次加载的数据
router.get('/api/index_list/5/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"/static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"/static/img/icons1.png",name:"跑步鞋"},
				  {imgUrl:"/static/img/icons2.png",name:"篮球鞋"},
				  {imgUrl:"/static/img/icons3.png",name:"运动鞋"},
				  {imgUrl:"/static/img/icons4.png",name:"户外鞋"},
				  {imgUrl:"/static/img/icons5.png",name:"运动T"},
				  {imgUrl:"/static/img/icons6.png",name:"夹克/连帽衫"},
				  {imgUrl:"/static/img/icons7.png",name:"运动裤"},
				  {imgUrl:"/static/img/icons8.png",name:"冲锋衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"/static/img/hot1.jpg",
				  	name:"精品男鞋，sk8-h系列",
				  	pprice:"449",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"/static/img/hot2.jpg",
				  	name:"vams纺丝白，经典系列火热销售",
				  	pprice:"299",
				  	oprice:"409",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"/static/img/hot3.jpg",
				  	name:"埃尔德经典系列，puls2020版本火热销售",
				  	pprice:"599",
				  	oprice:"729",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"/static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"/static/img/shop1.jpg",
						 	name:"361系列跑步男鞋，黑白色",
						 	pprice:"199",
						 	oprice:"359",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"/static/img/shop2.jpg",
						 	name:"361系列，悠闲跑鞋逐风者hx-seq1系",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"/static/img/shop3.jpg",
						 	name:"361旗舰店正品2020新款耐磨软底跑步鞋学生",
						 	pprice:"259",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"/static/img/shop4.jpg",
						 	name:"361男鞋运动鞋2020春季新款休闲鞋老爹鞋子",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 }
					  ]
				  }		  
			  ]
		  }
	  ]
  })
});


//箱包第一次加载的数据
router.get('/api/index_list/4/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"/static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"/static/img/icons1.png",name:"跑步鞋"},
				  {imgUrl:"/static/img/icons2.png",name:"篮球鞋"},
				  {imgUrl:"/static/img/icons3.png",name:"运动鞋"},
				  {imgUrl:"/static/img/icons4.png",name:"户外鞋"},
				  {imgUrl:"/static/img/icons5.png",name:"运动T"},
				  {imgUrl:"/static/img/icons6.png",name:"夹克/连帽衫"},
				  {imgUrl:"/static/img/icons7.png",name:"运动裤"},
				  {imgUrl:"/static/img/icons8.png",name:"冲锋衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"/static/img/hot1.jpg",
				  	name:"精品男鞋，sk8-h系列",
				  	pprice:"449",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"/static/img/hot2.jpg",
				  	name:"vams纺丝白，经典系列火热销售",
				  	pprice:"299",
				  	oprice:"409",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"/static/img/hot3.jpg",
				  	name:"埃尔德经典系列，puls2020版本火热销售",
				  	pprice:"599",
				  	oprice:"729",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"/static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"/static/img/shop1.jpg",
						 	name:"361系列跑步男鞋，黑白色",
						 	pprice:"199",
						 	oprice:"359",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"/static/img/shop2.jpg",
						 	name:"361系列，悠闲跑鞋逐风者hx-seq1系",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"/static/img/shop3.jpg",
						 	name:"361旗舰店正品2020新款耐磨软底跑步鞋学生",
						 	pprice:"259",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"/static/img/shop4.jpg",
						 	name:"361男鞋运动鞋2020春季新款休闲鞋老爹鞋子",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 }
					  ]
				  }		  
			  ]
		  }
	  ]
  })
});


//服饰第一次加载的数据
router.get('/api/index_list/3/data/1', function(req, res, next) {
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180917_18l981g6clk33fbl3833ja357aaa0_750x390.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180423_2ih0g2a884536b54i4ei857afh714_120x120.jpg",name:"夏款连衣裙"},
				  {imgUrl:"https://s3.mogucdn.com/mlcdn/c45406/170810_8fffkd3ijchej1k7fc3i0b0cl0gk7_130x130.jpg",name:"半身裙"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180528_5l6f3b8ab207b0k96lge890kkeb3l_120x120.jpg",name:"性感连衣裙"},
				  {imgUrl:"http://s16.mogucdn.com/p2/170206/upload_39e4k3ca21ggc903laeig7kf6iljh_120x120.jpg",name:"背心裙"},
				  {imgUrl:"https://s17.mogucdn.com/mlcdn/c45406/170913_132j1ai8f2i0cag6i0kf9j9klc345_120x120.png",name:"文胸"},
				  {imgUrl:"https://s2.mogucdn.com/p2/170310/64548447_4i382973af4b1d5hj66cgjcl4a275_120x120.jpg",name:"内裤"},
				  {imgUrl:"https://s2.mogucdn.com/p2/170310/64548447_3ffgf68a1gacf8bb73gkclhgeakbh_120x120.jpg",name:"塑身衣"},
				  {imgUrl:"https://s2.mogucdn.com/p2/170310/64548447_4336b94958539lh5jd02gefd6afkl_120x120.jpg",name:"无痕内衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"https://s5.mogucdn.com/mlcdn/c45406/200412_040egl5bc5l1ki5k3ijb5ffhh22fl_640x960.jpg_360x480.v1cAC.40.webp",
				  	name:"韩版百搭圆领卫衣女装潮款超火2020早春新款中性字母印花上衣",
				  	pprice:"449",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"https://s5.mogucdn.com/mlcdn/c45406/200412_6bgifbcb193ggkal9ad0aff3h6g70_640x960.jpg_360x480.v1cAC.40.webp",
				  	name:"韩版潮流女洋气百搭拼接假两件外搭网红新款2020早春套头卫衣",
				  	pprice:"299",
				  	oprice:"409",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"https://s5.mogucdn.com/mlcdn/c45406/190808_8di96gh71l2edfd7ig8hl709a9bgc_640x960.jpg_360x480.v1cAC.40.webp",
				  	name:"秋季新款上衣女装学生卫衣女长袖可爱软妹卡通刺绣无帽套头衫",
				  	pprice:"599",
				  	oprice:"729",
				  	discount:"5.2"
				  },
				  {
				  	id:4,
				  	imgUrl:"https://s5.mogucdn.com/mlcdn/55cf19/190706_11di1k5igidki92dkdfij967iiki9_640x960.jpg_360x480.v1cAC.40.webp",
				  	name:"无钢圈专业高强度四级防震运动文胸前拉链运动内衣",
				  	pprice:"59",
				  	oprice:"89",
				  	discount:"5.2"
				  },
				  {
				  	id:5,
				  	imgUrl:"https://s5.mogucdn.com/mlcdn/c45406/180605_59jbdgj21g0k2bhdf91a8i6504hkj_640x960.jpg_360x480.v1cAC.40.webp",
				  	name:"2件装 美背裹胸带胸垫抹胸打底防走光聚拢大胸显小内衣女学生背心无钢圈文胸",
				  	pprice:"99",
				  	oprice:"129",
				  	discount:"5.2"
				  },
				  {
				  	id:6,
				  	imgUrl:"https://s5.mogucdn.com/mlcdn/c45406/190518_28l4ca3algkcfccjacgbcdj2e3g1a_640x960.jpg_360x480.v1cAC.40.webp",
				  	name:"2020夏季新款针织吊带连衣裙女收腰性感包臀一步裙子",
				  	pprice:"299",
				  	oprice:"429",
				  	discount:"5.2"
				  }
				  
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"http://img10.360buyimg.com/cms/jfs/t1/122687/30/4477/420957/5eddcef0Ed0bd2df0/c10719b7e4159037.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"http://img10.360buyimg.com/n7/jfs/t1/6927/6/9604/234146/5c13f511E8e80bc5f/c007fa3dfab3039f.jpg",
						 	name:"文胸套装女2020春夏款无钢圈聚拢收副乳光面无痕深V胸罩内衣套装2B8520 黑色 36/80C",
						 	pprice:"199",
						 	oprice:"359",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"http://img10.360buyimg.com/n7/jfs/t1/116761/5/9739/196903/5edf2833E2a15f969/750156957f448774.jpg",
						 	name:"内衣女2020夏季新品无钢圈 新型专利 上托AB中模杯C薄模杯蕾丝聚拢文胸2B0514 肤色 75B/34",
						 	pprice:"299",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"http://img10.360buyimg.com/n7/jfs/t1/142403/34/294/178862/5edf2833Ec479a5d8/2ebd33f47d5e747b.jpg",
						 	name:"内裤女2020夏季新品50支澳棉抗菌内裆棉质无痕低腰三角女士组合内裤4条装ZK0A25 香槟粉/米白/梦幻紫/冰川灰 M",
						 	pprice:"259",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"http://img10.360buyimg.com/n7/jfs/t1/149283/2/253/264997/5edf2835E1fce5fab/705ad3d95ba3b0b8.jpg",
						 	name:"前扣美背文胸无钢圈薄款内衣女 关晓彤明星同款 性感蕾丝聚拢胸罩本命年红品 2B9503-宝石红 75B/34",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 },
						 {
						 	id:5,
						 	imgUrl:"http://img10.360buyimg.com/n7/jfs/t1/91108/20/18459/134025/5e9431e0Eff464957/a095436207d4e64d.jpg",
						 	name:"内衣套装女2020春夏款舒适夹棉性感聚拢蕾丝超薄杯软钢圈文胸套装1B9300 黑色 36/80B+L",
						 	pprice:"119",
						 	oprice:"229",
						 	discount:"5.2"
						 },
						 {
						 	id:6,
						 	imgUrl:"http://img14.360buyimg.com/n7/jfs/t1/146491/5/287/217315/5edf2835E91c4e5d2/f6d55b46a2fe77a5.jpg",
						 	name:"内衣女无钢圈文胸薄款透气透气蕾丝聚拢胸罩小胸【2款蕾丝随机发】2B9508 嫩肤 80B/36",
						 	pprice:"85",
						 	oprice:"150",
						 	discount:"5.2"
						 },
						 {
						 	id:7,
						 	imgUrl:"http://img14.360buyimg.com/n7/jfs/t1/41690/22/12471/221334/5d58ef00Ebde09a47/01c88bc64b7e89d0.jpg",
						 	name:"文胸光面软钢圈聚拢上托性感女士内衣文胸2B6520 黑色 34/75B杯",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 },
						 {
						 	id:8,
						 	imgUrl:"http://img14.360buyimg.com/n7/jfs/t1/142670/13/284/345114/5edf2834E0da5d3e1/bb72532f23c90794.jpg",
						 	name:"都市丽人新款精致诱惑透明蕾丝舒适款透气低腰女士组合内裤 3条装2K8A09 肤/藕色/浅灰 L码",
						 	pprice:"229",
						 	oprice:"359",
						 	discount:"5.2"
						 }
						 
					  ]
				  }		  
			  ]
		  }
	  ]
  })
});


//运动户外第一次加载的数据
router.get('/api/index_list/2/data/1', function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin','*')
  res.json({
	  code:"0",
	  data:[
		  {
			  type:"bannerList",
			  imgUrl:"/static/img/banner1.jpg"
		  },
		  {
			  type:"iconsList",
			  data:[
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180605_5ifa6b5gjlj7hiac10a2lje137gdd_120x120.jpg",name:"运动鞋"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180827_8ek1cci0a966465ah1b6ci9c997da_120x120.jpg",name:"休闲鞋"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180827_5h6lc1i6h3k53fc0g6hdibjl0l568_120x120.jpg",name:"帆布鞋"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180823_8ggae18cd6ha2997ce419k63gfg7f_120x120.jpg",name:"跑步鞋女"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180823_575llk977l12854laf77ic2g40g83_120x120.jpg",name:"健身套装"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180823_144kf1e1jj9ag41lckh7ge25e6da8_120x120.jpg",name:"夹克外套"},
				  {imgUrl:"https://s10.mogucdn.com/mlcdn/c45406/180823_6i1b2c04akhdkg229j0a58eie8d26_120x120.jpg",name:"运动风衣"},
				  {imgUrl:"https://s3.mogucdn.com/mlcdn/c45406/170829_4j6f894hf6j3071952ahabj6c8j3d_120x120.png",name:"运动内衣"}
			  ]
		  },
		  {
			  type:"hotList",
			  data:[
				  {
				  	id:1,
				  	imgUrl:"/static/img/hot1.jpg",
				  	name:"精品男鞋，sk8-h系列",
				  	pprice:"449",
				  	oprice:"659",
				  	discount:"5.2"
				  },
				  {
				  	id:2,
				  	imgUrl:"/static/img/hot2.jpg",
				  	name:"vams纺丝白，经典系列火热销售",
				  	pprice:"299",
				  	oprice:"409",
				  	discount:"5.2"
				  },
				  {
				  	id:3,
				  	imgUrl:"/static/img/hot3.jpg",
				  	name:"埃尔德经典系列，puls2020版本火热销售",
				  	pprice:"599",
				  	oprice:"729",
				  	discount:"5.2"
				  }
			  ]
		  },
		  {
			  type:"shopList",
			  data:[
				  {
					  bigUrl:"/static/img/shop.jpg",
					  data:[
						 {
						 	id:1,
						 	imgUrl:"/static/img/shop1.jpg",
						 	name:"361系列跑步男鞋，黑白色",
						 	pprice:"199",
						 	oprice:"359",
						 	discount:"5.2"
						 },
						 {
						 	id:2,
						 	imgUrl:"/static/img/shop2.jpg",
						 	name:"361系列，悠闲跑鞋逐风者hx-seq1系",
						 	pprice:"299",
						 	oprice:"659",
						 	discount:"5.2"
						 },
						 {
						 	id:3,
						 	imgUrl:"/static/img/shop3.jpg",
						 	name:"361旗舰店正品2020新款耐磨软底跑步鞋学生",
						 	pprice:"259",
						 	oprice:"459",
						 	discount:"5.2"
						 },
						 {
						 	id:4,
						 	imgUrl:"/static/img/shop4.jpg",
						 	name:"361男鞋运动鞋2020春季新款休闲鞋老爹鞋子",
						 	pprice:"219",
						 	oprice:"429",
						 	discount:"5.2"
						 }
					  ]
				  }		  
			  ]
		  }
	  ]
  })
});


//首页推荐
router.get('/api/index_list/data', function(req, res, next) {	
	res.send({
		"code":0,
		"data":{
			topTab:[
				{id:1,name:'推荐'},
				{id:2,name:'运动户外'},
				{id:3,name:'服饰内衣'},
				{id:4,name:'鞋靴箱包'},
				{id:5,name:'美妆个护'},
				{id:6,name:'家居数码'},
				{id:7,name:'食品母婴'}
			],
			data:[
				{
					type:'swiperList',
					data:[
						{imgUrl:"/static/img/swiper1.jpg"},
						{imgUrl:"/static/img/swiper2.jpg"},
						{imgUrl:"/static/img/swiper3.jpg"},
					]
				},
				{
					type:'Recommend',
					data:[
						{
							bigUrl:"/static/img/Children.jpg",
							data:[
								{imgUrl:"/static/img/Children1.jpg"},
								{imgUrl:"/static/img/Children2.jpg"},
								{imgUrl:"/static/img/Children3.jpg"},
							]
						},
						{
							bigUrl:"/static/img/Children.jpg",
							data:[
								{imgUrl:"/static/img/Children1.jpg"},
								{imgUrl:"/static/img/Children2.jpg"},
								{imgUrl:"/static/img/Children3.jpg"},
							]
						}
					]
				}
			]
		}
	})
});


// 推荐商品

module.exports = router;

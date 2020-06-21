import Vue from 'vue'
export default {
	state:{
		list:[],
		selectedList:[]
	},
	getters:{
		//判断是否  全选
		checkedAll(state){
			return state.list.length  ===  state.selectedList.length;
		},
		// 合计
		totalCount(state){
			let total = {
				pprice:0,
				num:0
			}
			state.list.forEach(v=>{
				if(state.selectedList.indexOf(v.id) > -1){
					//合计
					total.pprice += v.pprice*v.num;
					//结算数量
					total.num = state.selectedList.length;
				}
			})
			return total
		},
	},
	mutations:{
		// cart初始化数据
		initGetData(state,list){
			list.forEach(item=>{
				item.checked = false
			})
			state.list=list
		},
		// 添加数据
		addShopCart(state,goods){
			
			state.list.push(goods);
		},
		//全选
		checkAll(state){
			state.selectedList = state.list.map(v=>{
				v.checked = true;
				return v.id;
			})
		},
		//全不选
		unCheckAll(state){
			state.list.forEach(v=>{
				v.checked = false;
			})
			state.selectedList = [];
		},
		selectItem(state,index){
			let id = state.list[index].id
			let i = state.selectedList.indexOf(id)
			if(i>-1){
				state.list[index].checked = false;
				return state.selectedList.splice(i,1);
			}
			state.list[index].checked = true;
			state.selectedList.push(id);
		},
		delGoods(state){
			state.list = state.list.filter(v=>{
				return state.selectedList.indexOf(v.id) === -1;
			})
		}
	},
	actions:{
		checkedAllFn({commit,getters}){
			getters.checkedAll  ?  commit("unCheckAll")  :  commit("checkAll");
		},
		delGoodsFn({commit}){
			commit('delGoods');
			commit('unCheckAll');
			uni.showToast({
				title:'删除成功',
				icon:"none"
			})
		}
	}
}
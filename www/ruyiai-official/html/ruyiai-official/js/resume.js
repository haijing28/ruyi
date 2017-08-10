$(function(){
	//获取url中的参数
    function getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg);  //匹配目标参数
        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
    var id = getUrlParam('_id');
    if(getUrlParam('_id')){
    	var id = getUrlParam('_id');
    }else{
    	id = "invalid_id";
    }
    var url = ruyiai_host + "/ruyi-ai/1ff01bac-219a-40bd-94d0-2364099f158c/gather/" + id;
    $.ajax({
		url : url,
		data: {
			app_key: "1ff01bac-219a-40bd-94d0-2364099f158c",
			user_id: id,
			route: "sys.action.item/query",
			param: '{ key: "_id", value:'+ id +', type: "ruyi-recruitment", queryWithUserId: "false" }',
			skip_log: "test123"
		},
		method: "GET",
		success: function(data) {
		//TODO 记得提交代码的时候注释掉
//	    var data = '{"code":0,"msg":"ok","result":{"item_list":[{"_id":"cfe80af8-d353-4d05-b0b8-496119110ae7","position":"11","type":"ruyi-recruitment","appId":"bb8d6aec-8ac4-42f5-86bd-a8125addc8fe","userId":"1469535579678","created_time":1469536801806,"item_status":"VALID","name":"11","updated_time":1469541088853,"birthday":"1990-01-02","sex":"帅哥","location":"11","education2":"22","education1":"11","experience1":"11","plan":"11","disadvantage":"11","salary":"11","opinion":"11","education3":"33","email":"123@163.com","phone":"123"}],"item_list_cnt":"1","msg":"ok"}}';
		    data = JSON.parse(data);
		    for(var i in data.result.item_list[0]){
		    	$("." + i).html(data.result.item_list[0][i]);
		    }
		    if(data.result.item_list[0]["education3"] && data.result.item_list[0]["education3"].length > 0){
		    	$(".education").html(data.result.item_list[0]["education3"]);
		    }else if(data.result.item_list[0]["education2"] && data.result.item_list[0]["education2"].length > 0){
		    	$(".education").html(data.result.item_list[0]["education2"]);
		    }else if(data.result.item_list[0]["education1"] && data.result.item_list[0]["education1"].length > 0){
		    	$(".education").html(data.result.item_list[0]["education1"]);
		    }
		}
  });
});
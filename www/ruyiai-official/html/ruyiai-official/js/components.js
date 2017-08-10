'use strict';
//通用
//$.uc_logout_url = uc_logout;

$.ajaxSetup({
	type:"json",
	/*beforeSend:function(request){
		request.setRequestHeader("Authorization",TBLAuth.refresh());
	},*/
	cache:false,
	error:function(data){
		if( data.status == 404 || data.status == 500 ){
//			$.trace("网络状况异常，你刚刚的操作可能未被保存，请刷新页面后确认操作是否成功。",function(){				
//				window.location.reload();
//			});
		}else if( data.status== 400 ){
			var errorMessage = "";
			if(/(<u>)([^<]*)(<\/u>)/.exec(data.responseText)){
				errorMessage = /(<u>)([^<]*)(<\/u>)/.exec(data.responseText)[2];
			}else{
				errorMessage = data.responseText;
			}
			$.trace(errorMessage);
		}else if( data.status== 401 ){
			//window.location.href = $.uc_logout_url;
			//$.trace("你的登录信息出现错误，请重新登录",function(){
			//});
		}else if( data.status == 403 ){
			$.trace("操作失败，你的权限不足。");
		}else if( data.status == 509 ){
			$.trace("不能移除中最后一位管理员。");
		}else if( data.status == 433 ){
			//window.location.href = $.tabulaDomain + "index.html#/workspace/mytabulaBoardList";
			//window.location.href = $.tabulaDomain + "public/changeCommunity.html";
		}
	}
});

$(function(){
	$("#navBar").mouseenter(function(){
		$(this).addClass("on");	
	}).mouseleave(function(){
		$(this).removeClass("on");		
	});	

	//退出登录
	$("a[data-act='logout']").click(function(){
		//window.location.href = $.uc_logout_url;
	});
});
	
//Daniel的常用组件
$.Dan = {};
/*alert组件开始*/
//alert类
$.Dan.alert = function(text,type,fn){
	var backColor = "";
	var color = "";
	var imgSrc = "";
	if(!type || type == "warning"){
		backColor = "#FFF8E1";
		color = "#FF9600";
		imgSrc = "console/img/icon_warning.svg";
	}else{
		if(type == "success"){
			backColor = "#E8F5E9";
			color = "#00AA88";
			imgSrc = "console/img/icon_success.svg";
		}else if(type == "error"){
			backColor = "#FFEBEE";
			color = "#DD4B38";
			imgSrc = "console/img/icon_error.svg";
		}else{
			alert("type参数有误！");
		}
	}
	var myAvailWidth = (window.screen.availWidth/2) - 350;
	this.obj = 	$('<div class="alert alert-block alert-info fixedAlert" style="margin-left:0 !important;width:564px;height:38px;text-align:left;line-height:10px;border-radius:0;border:none;color:'+color+';background-color:'+backColor+';left: -moz-calc(50% - 282px) !important;left: -webkit-calc(50% - 282px) !important;left: -ms-calc(50% - 282px) !important;left: -o-calc(50% - 282px) !important;left: calc(50% - 282px) !important;top:-10px;"><img src="'+imgSrc+'" style="position:relative;top:-4px;margin-right:15px;"><button class="close" data-act="hide" type="button" style="line-height:inherit;color:'+color+'">×</button><span style="position:relative;top:-3px;">' + text +'</span></div>');
	this.fn = fn;
}
$.Dan.alert.prototype = {
	myShow : function(){
		var _this = this;
		var _obj = this.obj;
		_obj.appendTo("body").fadeIn("fast").find("[data-act='hide']").click(function(){
			$(".alert-info").remove();
			_this.myHide();	
		});
	},
	myHide : function(){
		var _fn = this.fn;
		var _obj = this.obj;
		_obj.fadeOut("fast",function(){
			_obj.remove();
			if(_fn){
				_fn();	
			}
		});	
	}
}
//基于JQuery的alert类调用
$.trace = function(text,type,fn){
	var trace = new $.Dan.alert(text,type,fn);
	trace.myShow();
	var timeout = setTimeout( function(){
		trace.myHide();
		clearTimeout(timeout);	
	},5000);
}//alert组件结束


/*confirm组件开始*/
//confirm类
$.Dan.confirm = function( option ){
	var defaults = {
		"ensure":"确 定",
		"cancel":"取 消",
		"text":"请你确认操作！",
		"ensureFn":function(){},
		"cancelFn":function(){},
		"title":"确 认"
	};
	$.extend(defaults, option);
	this.obj = 	$('<div data-act="confirmShow" confirm_util="confirmUtil"><div class="modal-backdrop fade in"></div><div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;"><div class="modal-dialog" style="padding-top:120px;"><div class="modal-content modal-delete"><div class="modal-header"><div style="cursor:pointer;"><div class="close-modal" data-act="closeIcon" aria-hidden="true" data-dismiss="modal">&nbsp;</div></div><h5 class="modal-title">'+ defaults.title +'</h5></div><div style="font-size:1.5rem;" class="modal-body">'+ defaults.text +'</div><div class="modal-footer"> <div class="col-md-offset-1 col-md-11 clearfix footer-modal"> <div class="pull-right submit-modal" data-act="ensure">确定</div> <a class="pull-right cancel-modal" style="text-decoration: none;"  data-act="cancel">取消</a> </div> </div></div></div></div></div>');
	this.obj.find("[data-act='ensure']").focus();
	this.ensureFn = defaults.ensureFn;
	this.cancelFn = defaults.cancelFn;
}

$.Dan.confirm.prototype = {
	myShow : function(){
		$("body").addClass("modal-open");
		var _this = this;
		var _obj = this.obj;
		var _ensureFn = this.ensureFn;		
		_obj.appendTo("body").find(".modal-backdrop").fadeIn("fast");
		_obj.find(".modal").animate({"opacity":"1","display": "block"}).find("[data-act='cancel']").click(function(){
			_this.myHide();	
		});
		_obj.find("[data-act='ensure']").click(function(){
			_this.myHide( _ensureFn, true );	
		});
		_obj.find(".close-modal").click(function(){
			_this.myHide();	
		});
	},
	myHide : function( fn ,_tempBoolean ){
		var _fn = fn ? fn : this.cancelFn;
		var _obj = this.obj;
		_obj.fadeOut("fast",function(){
			_obj.remove();
			if(_fn){
				_fn();	
			}
			return !!_tempBoolean;
		});	
	}
}
//基于JQuery的confirm类调用
$.confirm = function( option ){
	var _confirm = new $.Dan.confirm(option);
	_confirm.myShow();
}//confirm组件结束

/*floating组件开始*/
//floating类
$.Dan.floating = function( option ){
	var defaults = {
		"mode":"left",
		"html":"请你确认操作！",
		"showFn":function(){},
		"hideFn":function(){},
		"title":"确认",
		"target":$("body")
	};
	$.extend(defaults, option);
	this.obj = 	$('<div class="floatingBox" data-act="show"><div class="floatingMask"></div><div class="floating"><div class="floatingHeader"><button type="button" class="close" data-act="cancel">&times;</button><h3>'+ defaults.title +'</h3></div><div class="floatingBody">'+ defaults.html +'</div></div></div>');
	this.target = defaults.target;
	this.showFn = defaults.showFn;
	this.hideFn = defaults.hideFn;
}
$.Dan.floating.prototype = {
	myShow : function(){
		var _this = this;
		var _mode = this.mode;
		var _target = this.target;
		var showFn = this.showFn;
		var _position = _target.offset();
		var _obj = this.obj;		
		_obj.appendTo("body");
		var $box = _obj.find(".floating");
		$box.css({
			"left":_position.left,
			"top":_position.top	
		});
		var _width = $box.outerWidth();
		$box.animate({"left":_position.left - _width},"fast",function(){
			showFn(_obj,_this.myHide,_this.myPostion);			
		});
		_obj.find("[data-act='cancel']").click(function(){
			_this.myHide();	
		});
	},
	myPosition : function(){
		var _this = this;
		var _obj = this.obj;
		var _target = this.target;
		var _position = _target.offset();
		var $box = _obj.find(".floating");
		var _width = $box.outerWidth();
		var showFn = this.showFn;
		$box.animate({"left":_position.left - _width},"fast",function(){
			showFn(_obj,_this.myHide,_this.myPostion);			
		});
	},
	myHide : function(){
		var _this = this;
		var _fn = _this.hideFn;
		var _obj = _this.obj;		
		if(_fn){
			_fn();
		}
		_obj.fadeOut("fast",function(){
			_obj.remove();
		});	
	}
}
/*例：基于JQuery的floating类调用
var _floating = new $.Dan.floating(option);
_floating.myShow();
//floating组件结束*/
//时间格式化组件
$.timeFormat = function(date,fmt) {           
    var o = {           
    "M+" : date.getMonth()+1, //月份           
    "d+" : date.getDate(), //日           
    "h+" : date.getHours()%12 == 0 ? 12 : date.getHours()%12, //小时           
    "H+" : date.getHours(), //小时           
    "m+" : date.getMinutes(), //分           
    "s+" : date.getSeconds(), //秒           
    "q+" : Math.floor((date.getMonth()+3)/3), //季度           
    "S" : date.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "/u65e5",           
    "1" : "/u4e00",           
    "2" : "/u4e8c",           
    "3" : "/u4e09",           
    "4" : "/u56db",           
    "5" : "/u4e94",           
    "6" : "/u516d"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[date.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
}

//日历汉化
//$.datepicker.regional['zh-CN'] = {
//    clearText: '清除',
//    clearStatus: '清除已选日期',
//    closeText: '关闭',
//    closeStatus: '不改变当前选择',
//    prevText: '<上月',
//    prevStatus: '显示上月',
//    prevBigText: '<<',
//    prevBigStatus: '显示上一年',
//    nextText: '下月>',
//    nextStatus: '显示下月',
//    nextBigText: '>>',
//    nextBigStatus: '显示下一年',
//    currentText: '今天',
//    currentStatus: '显示本月',
//    monthNames: ['一月','二月','三月','四月','五月','六月', '七月','八月','九月','十月','十一月','十二月'],
//    monthNamesShort: ['一','二','三','四','五','六', '七','八','九','十','十一','十二'],
//    monthStatus: '选择月份',
//    yearStatus: '选择年份',
//    weekHeader: '周',
//    weekStatus: '年内周次',
//    dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
//    dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
//    dayNamesMin: ['日','一','二','三','四','五','六'],
//    dayStatus: '设置 DD 为一周起始',
//    dateStatus: '选择 m月 d日, DD',
//    dateFormat: 'yy-mm-dd',
//    firstDay: 1,
//    initStatus: '请选择日期',
//    isRTL: false
//};
//$.datepicker.setDefaults($.datepicker.regional['zh-CN']);

//feed数据解析开始
$.returnFeed = function (data){
	switch( data.scopeType ){
		case 1:
			return reBoardFeed(data);
			break;
		case 2:
			return reListFeed(data);
			break;
		case 3:
			return reCardFeed(data);
			break;
		case 4:
			return reChecklistFeed(data);
			break;
		case 12:
			return reCardFeed(data);
			break;
		default:
	}
	
	//feed数据解析
	function reBoardFeed(data){
		var detialString  = "";					
		if(data.detail && typeof(data.detail) == "string"){
			data.detail = JSON.parse(data.detail);
				
		}
		switch (data.actionType) {
			case 1:
				detialString = data.userName+"创建了["+data.detail.boardTitle + "]";
				break;
			case 2:
				detialString = data.userName+"将["+data.detail.oldBoardTitle+"]更名为["+data.detail.newBoardTitle+"]";
				break;
			case 3:
				detialString = data.userName+"在["+data.detail.boardTitle+"]中添加成员:"+data.detail.nickName;
				break;
			case 4:
				detialString = data.userName+"将成员 "+data.detail.assignName+" 移出["+data.detail.boardTitle+"]";
				break;
			case 6:
				detialString = data.userName+"重新打开了["+data.detail.boardTitle+"]";
				break;
			case 11:
				detialString = data.userName+"关闭了["+data.detail.boardTitle+"]";
				break;			
			case 12:
				detialString = data.userName+"将["+data.detail.boardTitle+"]的描述信息修改为:"+data.detail.newboardDesc;
				break;
			default:
				break;
		}
		return detialString;
	}
	//feed数据解析列
	function reListFeed(data){
		var detialString  = "";
		if(data.detail && typeof(data.detail) == "string"){
			data.detail = JSON.parse(data.detail);	
		}
		switch (data.actionType) {
			case 1:
				detialString = data.userName+"新建列'"+data.detail.tlistTitle+"'";
				break;
			case 2:
				detialString = data.userName+"将列'"+data.detail.oldTlistTitle+"'更名为'"+data.detail.newTlistTitle+"'";
				break;
			case 5:
				detialString = data.userName+"删除了列'"+data.detail.tlistTitle+"'";
				break;
			case 6:
				detialString = data.userName+"重新打开了列'"+data.detail.tlistTitle+"'";
				break;
			case 9:
				detialString = data.userName+"将列'"+data.detail.tlistTitle+"'从["+data.detail.oldBoardTitle+"]移动到["+data.detail.newBoardTitle+"]";
				break;
			default:
				break;
		}
		return detialString;
	}
	//feed数据解析任务
	function reCardFeed(data){
		var detialString  = "";
		if(data.detail && typeof(data.detail) == "string"){
			data.detail = data.detail.replace(/\n/g,"\\n");	
			data.detail = JSON.parse(data.detail);	
		}
		switch (data.actionType) {
			case 1:
				detialString = data.userName+"创建了任务<"+data.detail.cardTitle+">";
				break;
			case 2:
				detialString = data.userName+"将任务<"+data.detail.oldCardTitle+">更名为<"+data.detail.newCardTitle+">";
				break;
			case 3:				
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中添加成员:"+data.detail.assignName;
				break;
			case 4:
				detialString = data.userName+"将成员"+data.detail.assignName+"移出任务<"+data.detail.cardTitle+">";
				break;
			case 5:
				detialString = data.userName+"删除了任务<"+data.detail.cardTitle+">";
				break;
			case 6:
				detialString = data.userName+"重新打开了任务<"+data.detail.cardTitle+">";
				break;
			case 7:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中添加了评论:"+data.detail.comment;
				break;
			case 8:
				break;
			case 9:
				detialString = data.userName+"将任务<"+data.detail.cardTitle+">从'"+data.detail.fromTlistTitle+"'移动到'"+data.detail.toTlistTitle+"'";
				break;				
			case 10:
				if (data.detail.dueDate==0) {
					detialString = data.userName+"取消了任务<"+data.detail.cardTitle+">的计划完成时间"
				}else{
					var tempDate = new Date();
						tempDate.setTime(data.detail.dueDate);
						tempDate = $.timeFormat(tempDate,"yyyy/MM/dd HH:mm");
					detialString = data.userName+"将任务<"+data.detail.cardTitle+">的计划完成时间设置为:"+tempDate;
				}
				break;			
			case 12:
			    if($.trim(data.detail.newCardDesc)==""){
				  detialString = data.userName+"将任务<"+data.detail.cardTitle+">的描述删除了";
				}else{
				  detialString = data.userName+"将任务<"+data.detail.cardTitle+">的描述信息修改为:"+data.detail.newCardDesc;
				}
				break;
			case 13:
				detialString = data.userName+"完成了任务<"+data.detail.cardTitle+">";
				break;
			case 14:
				detialString = data.userName+"取消了任务<"+data.detail.cardTitle+">的完成状态";
				break;
			case 32:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中添加了关联文章<"+data.detail.noteTitle+">";
				break;
			case 33:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中移除了关联文章<"+data.detail.noteTitle+">";
				break;
			case 34:
				if(data.detail.workload==0){
					detialString = data.userName+"取消了任务<"+data.detail.cardTitle+">的工时";
				}else{
					detialString = data.userName+"将任务<"+data.detail.cardTitle+">的工时设置为:"+data.detail.workload;
				}
				break;
			case 36:
				if(data.detail.alarmType==0){
					detialString = data.userName+"取消了任务<"+data.detail.cardTitle+">的提醒时间";
				}else{
					var alarmTime;
					if(data.detail.alarmType==1){
						alarmTime="提前5分钟";
					}else if(data.detail.alarmType==2){
						alarmTime="提前10分钟";
					}else if(data.detail.alarmType==3){
						alarmTime="提前30分钟";
					}else if(data.detail.alarmType==4){
						alarmTime="提前一个小时";
					}else if(data.detail.alarmType==5){
						alarmTime="提前一天";
					}
					if(data.detail.alarmType==6){
						alarmTime=data.detail.alarmTime;
					}
					detialString = data.userName+"将任务<"+data.detail.cardTitle+">的提醒时间设置为:"+alarmTime;
				}
				break;
			case 37:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中添加了附件<"+data.detail.name+">";
				break;
			case 38:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中删除了附件<"+data.detail.name+">";
				break;
			case 39:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中添加子任务<"+data.detail.itemName+">";
				break;
			case 40:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中删除子任务<"+data.detail.itemName+">";
				break;
			case 41:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中将子任务<"+data.detail.oldName+">改名为<"+data.detail.newName+">";
				break;
			case 42:
				detialString = data.userName+"完成了任务<"+data.detail.cardTitle+">的子任务<"+data.detail.itemName+">";
				break;
			case 43:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">的取消了子任务<"+data.detail.itemName+">的完成状态";
				break;
			case 45:
				detialString = data.userName+"改变了任务<"+data.detail.cardTitle+">的颜色";
			default:
				break;
		}
		return detialString;
	}
	//checklist数据解析列
	function reChecklistFeed(data){
		var detialString  = "";
		if(data.detail && typeof(data.detail) == "string"){
			data.detail = JSON.parse(data.detail);	
		}
		switch (data.actionType) {
			
			case 1:
				detialString = data.userName+"在任务<"+data.detail.cardTitle+">中添加了待办事项<"+data.detail.checkTitle+">";
				break;
			
			default:
				break;
		}
		return detialString;
	}
}

//feed数据解析结束

//cookie
;(function($) {

    var Zebra_Cookie = function() {

        /**
         *  Removes a cookie from the browser.
         *
         *  <code>
         *  // instantiate the Zebra_Cookie JavaScript object
         *  var cookie = new Zebra_Cookie();
         *
         *  // create a cookie that expires in 10 minutes
         *  // named "foo" and having "bar" as value
         *  cookie.write('foo', 'bar', 10 * 60);
         *
         *  // remove the cookie named "foo" from the browser
         *  cookie.destroy('foo');
         *  </code>
         *
         *  @param  string  name    The name of the cookie to remove.
         *
         *  @return boolean         Returns TRUE on success or FALSE otherwise.
         */
        this.destroy = function(name) {

            // remove the cookie by setting its expiration date in the past
            return this.write(name, '', -1);

        }

        /**
         *  Reads the value of a cookie.
         *
         *  <code>
         *  // instantiate the Zebra_Cookie JavaScript object
         *  var cookie = new Zebra_Cookie();
         *
         *  // create a session cookie (expires when the browser is closed)
         *  // named "foo" and having "bar" as value
         *  cookie.write('foo', 'bar');
         *
         *  // should show an alert box saying "bar"
         *  alert(cookie.read('foo'));
         *  </code>
         *
         *  @param  string  name    The name of the cookie to read.
         *
         *  @return mixed           Returns the value of the requested cookie or null if the cookie doesn't exist.
         */
        this.read = function(name) {

            var

                // prepare the regular expression used to find the sought cookie in document.cookie
                expression = new RegExp('(^|; )' + encodeURIComponent(name) + '=(.*?)($|;)'),

                // search for the cookie and its value
                matches = document.cookie.match(expression);

            // return the cookie's value
            return matches ? decodeURIComponent(matches[2]) : null;

        }

        /**
         *  Sets a cookie in the browser.
         *
         *  <code>
         *  // instantiate the Zebra_Cookie JavaScript object
         *  var cookie = new Zebra_Cookie();
         *
         *  // create cookie that expires in 1 minute (60 seconds)
         *  // named "foo" and having "bar" as value
         *  cookie.write('foo', 'bar', 60);
         *  </code>
         *
         *  @param  string  name        The name of the cookie
         *
         *  @param  string  value       The value to set
         *
         *  @param  integer expire      (Optional) The life time of the cookie, in seconds.
         *
         *                              If set to 0, or omitted, the cookie will expire at the end of the session (when the
         *                              browser closes).
         *
         *  @param  string path         (Optional) The path on the server in which the cookie will be available on. If set
         *                              to "/", the cookie will be available within the entire domain. If set to '/foo/', the
         *                              cookie will only be available within the /foo/ directory and all subdirectories such
         *                              as /foo/bar/ of domain.
         *
         *                              If omitted, it will be set to "/".
         *
         *  @param  string  domain      (Optional) The domain that the cookie will be available on.
         *
         *                              To make the cookie available on all subdomains of example.com, domain should be set
         *                              to to ".example.com". The . (dot) is not required but makes it compatible with more
         *                              browsers. Setting it to "www.example.com" will make the cookie available only in the
         *                              www subdomain.
         *
         *  @param  boolean secure      (Optional) Indicates whether cookie information should only be transmitted over a
         *                              HTTPS connection.
         *
         *                              Default is FALSE.
         *
         *  @return boolean             Returns TRUE if the cookie was successfully set, or FALSE otherwise.
         */
        this.write = function(name, value, expire, path, domain, secure) {

            var date = new Date();

            // if "expire" is a number, set the expiration date to as many seconds from now as specified by "expire"
            if (expire && typeof expire === 'number') date.setTime(date.getTime() + expire * 1000);

                // if "expire" is not specified or is a bogus value, set it to "null"
                else expire = null;

            // set the cookie
            return document.cookie =

                // set the name/value pair
                // and also make sure we escape some special characters in the process
                encodeURIComponent(name) + '=' + encodeURIComponent(value) +

                // if specified, set the expiry date
                (expire ? '; expires=' + date.toGMTString() : '') +

                // if specified, set the path on the server in which the cookie will be available on
                '; path=' + (path ? path : '/') +

                // if specified, set the the domain that the cookie is available on
                (domain ? '; domain=' + domain : '') +

                // if required, set the cookie to be transmitted only over a secure HTTPS connection from the client
                (secure ? '; secure' : '');

        }

    }

    // make the plugin available in jQuery's namespace
    $.cookie = new Zebra_Cookie();

})(jQuery);


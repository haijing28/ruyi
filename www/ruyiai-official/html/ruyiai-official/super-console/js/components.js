'use strict';
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
		imgSrc = "img/icon_warning.svg";
	}else{
		if(type == "success"){
			backColor = "#E8F5E9";
			color = "#00AA88";
			imgSrc = "img/icon_success.svg";
		}else if(type == "error"){
			backColor = "#FFEBEE";
			color = "#DD4B38";
			imgSrc = "img/icon_error.svg";
		}else{
			alert("type参数有误！");
		}
	}
	this.obj = 	$('<div class="alert alert-block alert-info fixedAlert" style="position:fixed;width:564px;height:38px;line-height:10px;border-radius:0;border:none;color:'+color+';background-color:'+backColor+';left: -moz-calc(50% - 282px);left: -webkit-calc(50% - 282px);left: -ms-calc(50% - 282px);left: -o-calc(50% - 282px);left: calc(50% - 282px);top:0px;"><img src="'+imgSrc+'" style="position:relative;top:-4px;margin-right:15px;"><button class="close" data-act="hide" type="button" style="line-height:inherit;color:'+color+'">×</button><span style="position:relative;top:-3px;">' + text +'</span></div>');
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
	this.obj = 	$('<div data-act="confirmShow" confirm_util="confirmUtil"><div class="modal-backdrop fade in"></div><div class="modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;"><div class="modal-dialog" style="padding-top:120px;"><div class="modal-content"><div class="modal-header"><div style="cursor:pointer;"><div class="close-modal" data-act="closeIcon" aria-hidden="true" data-dismiss="modal">&nbsp;</div></div><h5 class="modal-title">'+ defaults.title +'</h5></div><div style="font-size:1.5rem;" class="modal-body">'+ defaults.text +'</div><div class="modal-footer"> <div class="col-md-offset-1 col-md-11 clearfix footer-modal"><div class="pull-right submit-modal" data-act="ensure">确定</div> <a class="pull-right cancel-modal" style="text-decoration: none;"  data-act="cancel">取消</a> </div> </div></div></div></div></div>');
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
		_obj.find(".close").click(function(){
			_this.myHide();	
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

/*confirm_save组件开始*/
//confirm_save类
$.Dan.confirm_save = function( option ){
	var defaults = {
		"ensure":"确 定",
		"cancel":"取 消",
		"text":"请你确认操作！",
		"ensureFn":function(){},
		"cancelFn":function(){},
		"saveFn":function(){},
		"title":"确 认"
	};
	$.extend(defaults, option);
	this.obj = 	$('<div data-act="confirmShow" confirm_util="confirmUtil"><div class="modal-backdrop fade in"></div><div class="modal" id="save_change" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="false" style="display: block;"><div class="modal-dialog" style="padding-top:120px;"><div class="modal-content"><div class="modal-header"><div style="cursor:pointer;"><div class="close-modal" data-act="closeIcon" aria-hidden="true" data-dismiss="modal">&nbsp;</div></div><h5 class="modal-title">'+ defaults.title +'</h5></div><div style="font-size:1.5rem;" class="modal-body">'+ defaults.text +'</div><div class="modal-footer"> <div class="col-md-offset-1 col-md-11 clearfix footer-modal"><div class="pull-left not-save-modal" data-act="ensure" type="button">不保存</div> <div class="pull-right save-modal" data-act="save" type="button">保存</div> <div class="pull-right cancel-modal" data-act="cancel" type="button">取消</div> </div> </div></div></div></div></div>');
	this.obj.find("[data-act='save']").focus();
	this.ensureFn = defaults.ensureFn;
	this.cancelFn = defaults.cancelFn;
	this.saveFn = defaults.saveFn;
}

$.Dan.confirm_save.prototype = {
	myShow : function(){
		$("body").addClass("modal-open");
		var _this = this;
		var _obj = this.obj;
		var _ensureFn = this.ensureFn;	
		var _saveFn = this.saveFn;
		_obj.appendTo("body").find(".modal-backdrop").fadeIn("fast");
		_obj.find(".modal").animate({"opacity":"1","display": "block"}).find("[data-act='cancel']").click(function(){
			_this.myHide();	
		});
		_obj.find("[data-act='ensure']").click(function(){
			_this.myHide( _ensureFn, true );	
		});
		_obj.find("[data-act='save']").click(function(){
			_this.myHide( _saveFn, true );	
		});
		_obj.find(".close").click(function(){
			_this.myHide();	
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
//基于JQuery的confirm_save类调用
$.confirm_save = function( option ){
	var _confirm_save = new $.Dan.confirm_save(option);
	_confirm_save.myShow();
}//confirm_save组件结束

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
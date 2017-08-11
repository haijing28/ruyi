function intent_timeout_detail($rootScope,$scope, $state, $stateParams,$sce){
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    }); //初始化提示
    $scope.app_response = getCookie("app_response");
    if($scope.app_response == "app-response-weixin"){
        $(".speach-response .app-response-weixin").addClass("active").siblings().removeClass("active");
        $("#myTabContent").find("#weixin").addClass("active in").siblings().removeClass("active in");
    }else if($scope.app_response == "app-response-local"){
        $(".speach-response .app-response-local").addClass("active").siblings().removeClass("active");
        $("#myTabContent").find("#local").addClass("active in").siblings().removeClass("active in");
    }
    //弹层判断，如果是弹出提示层，而失去光标的时候用户说不自动添加
    var isAtStatus = false;
    
    //获取当前用户的userId
    $scope.currentUserId = getCookie("userId");
    
    //检测是否更新 start
    var checkIsChangeValue = "";
    $scope.commonIntentDetailFocus = function(tempValue){
        checkIsChangeValue = tempValue;
    }
    
    $scope.commonIntentDetailBlur = function(tempValue){
        if(checkIsChangeValue != tempValue){
            dataEditedFlag = true;
        }
    }
    
    //检测是否更新 end
    
    //=======start
    $scope.userSyaTest = "";
    
    $('[data-toggle="popover"]').popover();
    
    $scope.testTemplateKeydownFunc = function(){
        var userSyaTest = $("#userSyaTest").text();
        var userSyaTestSimple = userSyaTest.replace(/<span[^>]*>/g," ");
        userSyaTestSimple = userSyaTestSimple.replace(/<\/span>/g,"");
        
        var result = userSyaTestSimple.match(/(@[^:]+):([^\s]+)/g);
        for(var i in result){
            userSyaTestSimple = userSyaTestSimple.replace(result[i],"<span style='background-color:red;'>"+ $.trim(result[i]) +"</span>");
        }
        userSyaTestSimple = $sce.trustAsHtml(userSyaTestSimple);
        $scope.userSyaTest = userSyaTestSimple;
    }
    
    //数组去重
    var removeDuplicate = function(myArray)
    {
        var n = {},r=[]; //n为hash表，r为临时数组
        for(var i = 0; i < myArray.length; i++) //遍历当前数组
        {
            if (!n[myArray[i]]) //如果hash表中没有当前项
            {
                n[myArray[i]] = true; //存入hash表
                r.push(myArray[i]); //把当前数组的当前项push到临时数组里面
            }
        }
        return r;
    }
    
    $("#myreset").click(function(){
        var st= $("#regTest").text();
        var result = st.replace(/<span[^>]*>/g," ");
        result = result.replace(/<\/span>/g,"");
        $("#regTest").text(result);
    });
    
    $("#mysubmit").click(function(){
        var st= $("#regTest").text();
        var result = st.match(/(@[^:]+):([^\s]+)/g);
        for(var i in result){
            st = st.replace(result[i],"<span style='background-color:red;'>"+ $.trim(result[i]) +"</span>");
        }
        $("#regTest").html(st);
    });
    
    //=======end
    
//  setTimeout(function(){
//      $("[data-act=nav-intent-"+ $stateParams.intent_id +"]").siblings().removeClass("active");
//      $("[data-act=nav-intent-"+ $stateParams.intent_id +"]").addClass("active")
//  }, 500);
    setTimeout(function(){
        $('[data-toggle="tooltip"]').tooltip(); //初始化提示
    }, 200);
    
    var intentDetailDuplicate = "";
    
    // intentDetail监视
//  $scope.$watch('intentDetail', function(newValue, oldValue) {
//      var newValueTemp = JSON.stringify(newValue);
//      if(newValueTemp == intentDetailDuplicate){
//          dataEditedFlag = false;
//      }else{
//          dataEditedFlag = true;
//      }
//  }, true);
    
    $scope.isSaveSuccess = true;
    
    //添加空的parameters
    var addEmptyParametersFunc = function(intentDetail){
        if(intentDetail){
            if(!$scope.response){
                $scope.response = {"action":"","parameters":[],"outputs":[[]]};
                $scope.response.parameters.push({"dataType":"","defaultValue":"","name":"","prompts":[],"required":false,"value":""});
            }else{
                var lastResponses = $scope.response;
                if(!lastResponses.parameters){
                    lastResponses.parameters = [];
                    lastResponses.parameters.push({"dataType":"","defaultValue":"","name":"","prompts":[],"required":false,"value":""});
                }else{
                    var lastParameters = {};
                    if(lastResponses.parameters && lastResponses.parameters.length > 0){
                        lastParameters = lastResponses.parameters[lastResponses.parameters.length-1];
                        if($.trim(lastParameters.dataType).length > 0 || $.trim(lastParameters.defaultValue).length > 0
                                || $.trim(lastParameters.name).length > 0 || $.trim(lastParameters.value).length > 0
                                || lastParameters.prompts.length > 0 || lastParameters.required){
                            lastResponses.parameters.push({"dataType":"","defaultValue":"","name":"","prompts":[],"required":false,"value":""});
                        }
                    }else{
                        lastResponses.parameters.push({"dataType":"","defaultValue":"","name":"","prompts":[],"required":false,"value":""});
                    }
                }
                
            }
        }
        return intentDetail;
    }
    
    //删除空的parameters
    var deleteEmptyParametersFunc = function(intentDetail){
        if(intentDetail){
            if(intentDetail.responses){
                for(var i in intentDetail.responses){
                    if(intentDetail.responses[i].parameters){
                        for(var j in intentDetail.responses[i].parameters){
                            if($.trim(intentDetail.responses[i].parameters[j].dataType).length <= 0 && $.trim(intentDetail.responses[i].parameters[j].defaultValue).length <= 0
                                    && $.trim(intentDetail.responses[i].parameters[j].name).length <= 0 && $.trim(intentDetail.responses[i].parameters[j].value).length <= 0
                                    && intentDetail.responses[i].parameters[j].prompts.length <= 0 && !intentDetail.responses[i].parameters[j].required){
                                intentDetail.responses[i].parameters.splice(j,1);
                            }
                        }
                    }
                }
            }
        }
        return intentDetail;
    }
    
    //构造多媒体对象
    
    $scope.newsPageSize = 6;
    $scope.imagePageSize = 12;
    $scope.voicePageSize = 20;
    $scope.videoPageSize = 20;
    
    $scope.createMediaObjectFunc = function(text){
        var mediaObj = new Object();
        if(text.indexOf("@mediaResourceResponse-news") > -1){
            mediaObj.type = "news";
        }else if(text.indexOf("@mediaResourceResponse-image") > -1){
            mediaObj.type = "image";
        }else if(text.indexOf("@mediaResourceResponse-voice") > -1){
            mediaObj.type = "voice";
        }else if(text.indexOf("@mediaResourceResponse-video") > -1){
            mediaObj.type = "video";
        }
        var typeSplit = "#####";
        var keySplit = "&&&&&";
        if(text.indexOf(typeSplit) == -1){
            typeSplit = "#";
            keySplit = ":";
        }
        var para = text.split(typeSplit);
        for(var i in para){
            var keyValue = para[i].split(keySplit);
            if(keyValue[0] == "mediaid"){
                mediaObj.mediaId = keyValue[1];
            }else if(keyValue[0] == "name"){
                mediaObj.name = keyValue[1];
            }
        }
        mediaObj.text = text;
        return mediaObj;
    }
    
    //将多媒体回复检索出来
    $scope.getMediaResponseFunc = function(flag){
        if(flag){
            $scope.mediaResponseList = new Array();
        }
        if($scope.intentDetail.speech){
            var indexFlag = 0;
            for(var i in $scope.intentDetail.speech){
                if($scope.intentDetail.speech[i] && $scope.intentDetail.speech[i].indexOf("@mediaResourceResponse") > -1){
                    var mediaObj = $scope.createMediaObjectFunc($scope.intentDetail.speech[i]);
                    if(flag){
                        $scope.mediaResponseList.push(mediaObj);
                    }
                    indexFlag++;
                }
            }
            for(var j = 0;j<indexFlag; j++){
                for(var i in $scope.intentDetail.speech){
                    if($scope.intentDetail.speech[i].indexOf("@mediaResourceResponse") > -1){
                        $scope.intentDetail.speech.splice(i,1);
                        break;
                    }
                }
            }
        }
    }
    
    //初始化outputs,将outputs拆分为两个数组 start
    var splitOutputsFunc = function(){
        var wechatOutputs = [];
        var localOutouts = [];
        for(var i in $scope.response.outputs){
            for(var j in $scope.response.outputs[i]){
                if($scope.response.outputs[i][j] && $scope.response.outputs[i][j].type){
                    if($scope.response.outputs[i][j].type.indexOf("wechat.") > -1){
                        wechatOutputs.push($scope.response.outputs[i]);
                    }else{
                        localOutouts.push($scope.response.outputs[i]);
                    }
                }
                break;
            }
        }
        //如果初始化为空，则添加一个空数组
        if(wechatOutputs.length == 0){
            wechatOutputs = [[]];
        }
        if(localOutouts.length == 0){
            localOutouts = [[]];
        }
        $scope.wechatOutputs = wechatOutputs;
        $scope.localOutouts = localOutouts;
        $scope.$apply();
    }
    //初始化outputs,将outputs拆分为两个数组 end
    
    //获取意图详情
    $scope.getIntentDetailFunc = function(intent_id){
        if(!intent_id || intent_id.length == 0){
            return;
        }
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/"+ appId +"/"+ $stateParams.scenes_id +"/intent/" + intent_id,
            method: "GET",
            success: function(data){
                data = dataParse(data);
					if(data.code == 0){
                    $scope.intentDetail = data.result;
                    let timeoutLimit = $scope.intentDetail.limit;
                    timeoutLimit = timeoutLimit || 0;
                    console.log($scope.intentDetail)
                    $('#timeoutSt').val(timeoutLimit + ' ms');
                    $('#timeoutSt').blur();
                    //TODO
                    //$scope.intentDetail.speech.push("@mediaResourceResponse-image#####mediaid&&&&&L7vIZuny21XNDdvfibno_9k8FaqMMtOLFQ4lNJgOl7A#####name&&&&&10.pic.jpg");
                    $scope.getMediaResponseFunc(true);
                    //初始化response
                    if($scope.intentDetail.responses && $scope.intentDetail.responses.length > 0){
                        $scope.response = $scope.intentDetail.responses[0];
                    }else{
                        $scope.response = new Object();
                    }
                    $scope.intentDetail = addEmptyParametersFunc($scope.intentDetail);
                    $scope.intentDetail.templates = removeDuplicate($scope.intentDetail.templates);//去重
                    intentDetailDuplicate = JSON.stringify($scope.intentDetail);
                    if($scope.intentDetail.templates.length > 5){
                        //$(".user-say-templates").css("height","176px");
                        $scope.userSayFlag = false;
                    }
                    
                    //初始化outputs,将outputs拆分为两个数组 start
                    splitOutputsFunc();
                    //初始化outputs,将outputs拆分为两个数组 end
                    setLearnLevelFunc();
                    $scope.$apply();
                    
                    setTimeout(function(){
                        $("[data-act=nav-intent-"+ $stateParams.intent_id +"]").siblings().removeClass("active");
                        $("[data-act=nav-intent-"+ $stateParams.intent_id +"]").addClass("active")
                    }, 200);
                    
                }else if(data.code == 2){
                    goIndex();
                }else{
                    if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                }
            }
        });
    }
    
    var intentIndex = 0;
    if(angular.element(".center-list-box").scope().intentCount){
        intentIndex = angular.element(".center-list-box").scope().intentCount;
    }
    
    //初始化界面参数
    var createIntentCommonFunc = function(){
        intentIndex+=1;
        $scope.intentDetail = new Object();
        $scope.intentDetail.name = "";
        $scope.intentDetail.auto = true;
        $scope.intentDetail.priority = 0;
        $scope.intentDetail.mlLevel = "MIDDLE";
        $scope.mlLevel = true;
        $scope.response = {"action":"","parameters":[],"outputs":[[]]};
        $scope.intentDetail = addEmptyParametersFunc($scope.intentDetail);
        $scope.mediaResponseList = [];
        //分割outputs
        $scope.wechatOutputs = [[]];
        $scope.localOutouts = [[]];
        
        $scope.intentDetail.name = "未命名意图" + intentIndex;
        setTimeout(function(){
            $scope.addIntentDetailFunc();
        }, 20);
    };
    
    //如果intent_id为-1则表明是创建意图，否则打开意图详情
    if($stateParams.intent_id == -1){
        createIntentCommonFunc();
    }else{
        $scope.getIntentDetailFunc($stateParams.intent_id);
    }
    
    //验证意图详情是否有错误或者提示
    var validateIntentDetailFunc = function(){
        if($scope.intentDetail && $scope.intentDetail.errorModels && $scope.intentDetail.errorModels.length > 0){
            var errorModelStr = "";
            var index = 1;
            for(var i in $scope.intentDetail.errorModels){
                index = parseInt(i) + 1;
                if($scope.intentDetail.errorModels[i].code && $scope.intentDetail.errorModels[i].code.substring(0,1) == "0"){
                    errorModelStr+="<div style='color:#ee524f;max-height:300px;overflow:hidden;overflow-y:auto;'>"+ index + "." + $scope.intentDetail.errorModels[i].detail +"</div>";
                }else if($scope.intentDetail.errorModels[i].code && $scope.intentDetail.errorModels[i].code.substring(0,1) == "1"){
                    errorModelStr+="<div style='color:#ffb64c;max-height:300px;overflow:hidden;overflow-y:auto;'>"+ index + "." + $scope.intentDetail.errorModels[i].detail +"</div>";
                }
            }
            $scope.intentDetail.errorModelStr = errorModelStr;
        }else{
            $scope.intentDetail.errorModelStr = "";
        }
        setTimeout(function(){
            $('[data-toggle="popover"]').popover();
        }, 500);
    }
    
    //去除空的属性 start
    var deleteBlankParaFunc = function(valueList){
        for(var i in valueList){
            if($.trim(valueList[i]).length == 0){
                valueList.splice(i,1);
            }
        }
        return valueList;
    }
    //去除空的属性 end
    
    //创建意图
    $scope.addIntentDetailFunc = function(){
        if(!$scope.isSaveSuccess){
            return false;
        }
        $scope.isSaveSuccess = false;
        //将outputs合并
        $scope.response.outputs = $scope.wechatOutputs.concat($scope.localOutouts);
        var intentDetailTemp = $scope.intentDetail;
        intentDetailTemp = deleteEmptyParametersFunc(intentDetailTemp); //删除空的parameters
        //将多媒体的助理答，添加到speech中 start
        if(!intentDetailTemp.speech){
            intentDetailTemp.speech = [];
        }
        for(var i in $scope.mediaResponseList){
            var addFlag = false;
            for(var j in intentDetailTemp.speech){
                if(intentDetailTemp.speech[j] == $scope.mediaResponseList[i].text){
                    addFlag = true;
                }
            }
            if(!addFlag){
                intentDetailTemp.speech.push($scope.mediaResponseList[i].text);
            }
        }
        //将多媒体的助理答，添加到speech中 end
        //将空白用户说删除掉 start
        intentDetailTemp.templates = deleteBlankParaFunc(intentDetailTemp.templates);
        //将空白用户说删除掉 end
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/"+appId+"/"+ $stateParams.scenes_id +"/intent",
            data: JSON.stringify(intentDetailTemp),
            traditional: true,
            headers: {"Content-Type" : "application/json"},
            method: "POST",
            success: function(data){
                addEmptyParametersFunc($scope.intentDetail);//添加空的parameters
                $scope.getMediaResponseFunc(false);//将助理答还原
                data = dataParse(data);
					if(data.code == 0){
                    callAgentReloadTestFunc(); //通知nlp reload
                    var validateResult = {};
                    var intentDetail = {};
                    if(data.result.validateResult){
                        validateResult = data.result.validateResult;
                        intentDetail = data.result.intent;
                        //$.trace(validateResult.message + "("+validateResult.detail+")");
                    }else{
                        intentDetail = data.result;
                    }
                    $.trace("意图创建成功","success");
                    $rootScope.$apply();
                    $scope.intentDetail.id = intentDetail.id;
                    $scope.intentDetail.intentStatus = intentDetail.intentStatus;
                    $scope.intentDetail.errorModels = intentDetail.errorModels;
                    $scope.intentDetail.scenarioId = intentDetail.scenarioId;
                    var intentList = angular.element(".center-list-box").scope().intentList;
                    if(intentList && intentList.length > 0){
                    }else{
                        intentList = new Array();
                    }
                    validateIntentDetailFunc();//验证是否有错误
                    intentList.unshift($scope.intentDetail);
                    intentDetailDuplicate = JSON.stringify($scope.intentDetail);
                    angular.element(".center-list-box").scope().intentList = intentList;
                    angular.element(".center-list-box").scope().intentCount = angular.element(".center-list-box").scope().intentCount + 1;
                    angular.element(".center-list-box").scope().getIntentCountFunc(function(){
                        angular.element(".center-list-box").scope().setPagingCountFunc();
                    });
                    
                    $scope.$apply();
                    setTimeout(function(){
                        dataEditedFlag = false;
                    }, 1000);
                    setTimeout(function(){
                        $(".intent-name").focus();
                        setTimeout(function(){
                            $(".intent-name").select();
                        }, 200);
                    }, 200);
                    window.location.href = "#/intent_list/" +$stateParams.scenes_id+ "/intent_detail/" + $scope.intentDetail.id;
                }else if(data.code == 2){
                    goIndex();
                }else{
                    if(data.msg.indexOf("already exists") > -1){
                        createIntentCommonFunc();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
                $scope.isSaveSuccess = true;
            },error:function(){
                addEmptyParametersFunc($scope.intentDetail);//添加空的parameters
                $.trace("意图创建失败");
            }
        });
    }
    
    //修改意图
    $scope.updateIntentDetailFunc = function(){
        if(!$scope.isSaveSuccess){
            return false;
        }
        $scope.isSaveSuccess = false;
        //将outputs合并
        if($scope.isExits && $scope.wechatOutputs[0].length > 1) {
            $scope.wechatOutputs[0].pop();
            $scope.isExits = false;
        }
        if($scope.isExits &&$scope.localOutouts[0].length > 1) {
            $scope.localOutouts[0].pop();
            $scope.isExits = false;
        }
        $scope.response.outputs = $scope.wechatOutputs.concat($scope.localOutouts); 
        var intentDetailTemp = $scope.intentDetail;
        //将多媒体的助理答，添加到speech中 start
        if(!intentDetailTemp.speech){
            intentDetailTemp.speech = [];
        }
        for(var i in $scope.mediaResponseList){
            var addFlag = false;
            for(var j in intentDetailTemp.speech){
                if(intentDetailTemp.speech[j] == $scope.mediaResponseList[i].text){
                    addFlag = true;
                }
            }
            if(!addFlag){
                intentDetailTemp.speech.push($scope.mediaResponseList[i].text);
            }
        }
        //将多媒体的助理答，添加到speech中 end
        intentDetailTemp = deleteEmptyParametersFunc(intentDetailTemp); //删除空的parameters
        //将空白用户说删除掉 start
        intentDetailTemp.templates = deleteBlankParaFunc(intentDetailTemp.templates);
         let limit = parseInt($('#timeoutSt').val());
         $scope.intentDetail.limit = limit;
        //将空白用户说删除掉 end
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/"+appId+"/"+ $stateParams.scenes_id +"/intent/" + $scope.intentDetail.id,
            data: JSON.stringify(intentDetailTemp),
            traditional: true,
            headers: {"Content-Type" : "application/json"},
            method: "PUT",
            success: function(data){
                console.log($scope.intentDetail)
                addEmptyParametersFunc($scope.intentDetail);//添加空的parameters
                $scope.getMediaResponseFunc(false);//将助理答还原
                data = dataParse(data);
					if(data.code == 0){
                    callAgentReloadTestFunc(); //通知nlp reload
                    var validateResult = {};
                    var intentDetail = {};
                    if(data.result.validateResult){
                        $(".save-and-apply .saveing").css("display","none");
                        $(".save-and-apply .saveing").css("width","0");
                        $(".save-and-apply .saveing").css("display","block");
                        $(".save-and-apply .save-text").text("保存并应用");
                        $(".save-and-apply .dim-div").css("display","none");
                        validateResult = data.result.validateResult;
                        intentDetail = data.result.intent;
                        $.trace(validateResult.message + "("+validateResult.detail+")");
                    }else{
                        intentDetail = data.result;
                        setTimeout(function(){
                            $(".save-and-apply .save-text").text("保存成功","success");
                            $(".save-and-apply .saveing").css("display","none");
                            $(".save-and-apply .saveing").css("width","0");
                            setTimeout(function(){
                                $(".save-and-apply .saveing").css("display","block");
                            }, 1000);
                            setTimeout(function(){
                                $(".save-and-apply .save-text").text("保存并应用");
                                $(".save-and-apply .dim-div").css("display","none");
                            }, 500);
                        }, 1000);
                    }
                    $scope.intentDetail = intentDetail;
//                  var templatesListTemp = $scope.intentDetail.templates;
//                  $scope.intentDetail.templates = [];
//                  setTimeout(function(){
//                      for(var i in templatesListTemp){
//                          $scope.intentDetail.templates.push(templatesListTemp[i]);
//                      }
//                      $scope.$apply();
//                  }, 1);
                    var intentList = angular.element(".center-list-box").scope().intentList;
                    for(var i in intentList){
                        if(intentList[i].id == $scope.intentDetail.id){
                            validateIntentDetailFunc();
                            intentList[i] = $scope.intentDetail;
                            break;
                        }
                    }
                    intentDetailDuplicate = JSON.stringify($scope.intentDetail);
                    angular.element(".center-list-box").scope().intentList = intentList;
                    $scope.$apply();
                    angular.element(".center-list-box").scope().$apply();
                    setTimeout(function(){
                        $("[data-act=nav-intent-"+ $stateParams.intent_id +"]").siblings().removeClass("active");
                        $("[data-act=nav-intent-"+ $stateParams.intent_id +"]").addClass("active")
                    }, 20);
                    dataEditedFlag = false;
                }else if(data.code == 2){
                    goIndex();
                }else{
                    if(data.msg){ 
                        $(".save-and-apply .saveing").css("display","none");
                        $(".save-and-apply .saveing").css("width","0");
                        $(".save-and-apply .saveing").css("display","block");
                        $(".save-and-apply .save-text").text("保存并应用");
                        $(".save-and-apply .dim-div").css("display","none");
                        $.trace(data.msg + "( "+ data.detail +" )","error"); 
                    }
                }
                $scope.isSaveSuccess = true;
            },error:function(){
                addEmptyParametersFunc($scope.intentDetail);//添加空的parameters
                $.trace("意图保存失败");
            }
        });
    }
    
    //创建意图，必填参数判断
    $scope.checkRequiredParaments = function(editIntentEditFunc){
        if($scope.intentDetail.name.length <= 0){
            $.trace("请输入意图名称");
            $(".intent-name").focus();
            return false;
        }
//      else if(!$scope.intentDetail.templates || $scope.intentDetail.templates.length <= 0){
//          $.trace("至少添加一个用户对话模板");
//          $(".user-say-templates:last-child input").focus();
//          return false;
//      }
        if(editIntentEditFunc){
            editIntentEditFunc();
        }
    }
    //点击保存按钮，创建意图
    $scope.saveIntentDetailFunc = function(){
        if (navigator.onLine) 
        { 
            setTimeout(function(){
                if($(".save-and-apply .dim-div").css("display") != "block"){
                    $scope.checkRequiredParaments(function(){//必填参数判断
                        $(".save-and-apply .dim-div").css("display","block");
                        $(".save-and-apply .save-text").text("保存中...");
                        $(".save-and-apply .saveing").css("width","90px");
                        $scope.intentDetail.responses = new Array();
                        if($scope.response.action || $scope.response.affectedContexts || $scope.response.parameters){
                            $scope.intentDetail.responses.push($scope.response);
                        }
                        $scope.intentDetail.appId = appId;
                        $scope.intentDetail.scenarioId = $stateParams.scenes_id;
                        if($scope.intentDetail.id && $scope.intentDetail.id.length > 0){//更新意图
                            $scope.updateIntentDetailFunc();
                        }else{//创建意图
                            $scope.addIntentDetailFunc();
                        }
                        
                    });
                }
            }, 200);
        }else{
            $.trace("您当前处于离线状态，保存意图失败！");
        }
    }
    
    //构造一个意图处理的对象
    var createIntentProcessObjectFunc = function(name, type){
        var paraObj = new Object();
        paraObj.dataType = type;
        paraObj.defaultValue = "";
        paraObj.name = name;
        paraObj.prompts = [];
        paraObj.required = false;
        paraObj.value = "$" + name;
        return paraObj;
    }
    
    $('.max-modal').on('click', function($event) {
        /** 用户说失去焦点 **/
        $('.user-says-input').each(function(index, ele) {
            if(ele === document.activeElement) {
                if($(ele).attr('data-act') === 'user-sya-add' || $(ele).attr('data-act') === 'user-sys-update'){
                    ele.blur();
                }
            }
        });
        
        /** 机器人答失去焦点（微信） **/
        $('.input-weixin').each(function(index, ele) {
            if(ele === document.activeElement) {
                ele.blur();
            }
        });
        
        /** 机器人答失去焦点（硬件） **/
        $('.input-local').each(function(index, ele) {
            if(ele === document.activeElement) {
                ele.blur();
            }
        });
    });
    
    //用户编辑用户说话的模板
    $scope.addTemplateFunc = function($event,template,index,actionType){
        var $target = $($event.target);
        setTimeout(function(){
            if(isAtStatus){
                isAtStatus = false;
                return false;
            }
            template = $($event.target).text().trim();
            if((!template || $.trim(template).length == 0) && $event.keyCode != 13){
                $($event.target).append('<div class="usersay-placeholder">请输入用户说</div>');
                if(index !== 0 && !index){
                    return false;
                }
            }
            setTimeout(function(){
                $($event.target).html(template);
            }, 2);
            if(1 == 2){
                //dataEditedFlag = true;
                /*根据用户说自动填充意图处理 start*/
                //var userSysReg = /(@[^:]+):([^ ]+)/g;
                var userSysReg = /(@[^:]+):([\S]+)/g;
                var paras = template.match(userSysReg);
                
                if(!$scope.response){
                    $scope.response = {};
                }
                if(!$scope.response.parameters){
                    $scope.response.parameters = [];
                }
                if($scope.response.parameters.length >= 1){
                    $scope.response.parameters.splice($scope.response.parameters.length -1,1);
                }
                for(var i in paras){
                    var prassKeyValue = paras[i].split(":");//分割得到参数名称和类型
                    if(prassKeyValue && prassKeyValue.length > 0){
                        var flag = false;
                        for(var j in $scope.response.parameters){
                            if($scope.response.parameters[j].name == $.trim(prassKeyValue[1])){
                                flag = true;
                                break;
                            }
                        }
                        if(!flag){
                            //构造一个意图处理的对象
                            var paraObj = createIntentProcessObjectFunc($.trim(prassKeyValue[1]),$.trim(prassKeyValue[0]));
                            $scope.response.parameters.push(paraObj);
                        }
                    }
                }
                var tempParaObj = createIntentProcessObjectFunc("","");
                tempParaObj.value = "";
                $scope.response.parameters.push(tempParaObj);
                $scope.$apply();
                /*根据用户说自动填充意图处理 end*/
            }
            
//          if(!template || $.trim(template).length <= 0){
//              return false;
//          }
            if(!$scope.intentDetail.templates){
                console.log('fal');
                $scope.intentDetail.templates = new Array();
                $scope.intentDetail.templates.push(template);
            }else{
//              var firstText = $($target.parent().parent().find('div')[0]).text();
                //判断当前数据中是否已经存在此用户说 start
//               && firstText !== "请输入用户说"
                for(var i in $scope.intentDetail.templates){
                    if(i!= index && $.trim($scope.intentDetail.templates[i]) == $.trim(template)){
                        $.trace("此用户说已经存在，重复的只会保存一条");
                        return false;
                    }
                } 
                //判断当前数据中是否已经存在此用户说 end
                var flag = false;
                for(var i in $scope.intentDetail.templates){
                    if(i == index){
                        if($scope.intentDetail.templates[i] !== template){
                            dataEditedFlag = true;
                            $scope.intentDetail.templates[i] = template;
                        }
                        flag = true;
                    }
                }
                if(!flag){
                    $scope.intentDetail.templates.push(template);
                    dataEditedFlag = true;
                }
            }
            $scope.$apply();
            $('[data-toggle="tooltip"]').tooltip(); //初始化提示
            //$scope.addTemplate = "";
            if(actionType == "add"){
                setTimeout(function(){
                    $($event.target).html("");
                    $scope.userSayFlag = true;
                    $scope.$apply();
                }, 20);
            }
        }, 20);
    }
    //enter添加用户说的模板
    $scope.addTemplateKeydownFunc = function($event,template,index,actionType){
        var $target = $($event.target);
        if($event.keyCode == 13){
            $scope.addTemplateFunc($event,template,index,actionType);
            $target.parent().next().children().eq(0).focus();
            return false;
        }
    }
    //删除用户说的模板
    $scope.deleteTemplateFunc = function(index){
        dataEditedFlag = true;
        for(var i in $scope.intentDetail.templates){
            if(i == index){
                $scope.intentDetail.templates.splice(i,1);
                break;
            }
        }
    }
    
    //复制用户说的模板
    $scope.copyTemplateFunc = function(template){
        console.log('cizhilou');
        dataEditedFlag = true;
        //判断当前数据中是否已经存在此用户说 start
        for(var i in $scope.intentDetail.templates){
            if($scope.intentDetail.templates[i] == template+"(副本)"){
                $.trace("此用户说副本已经存在");
                return false;
            }
        }
        //判断当前数据中是否已经存在此用户说 end
        $scope.intentDetail.templates.push(template+ "(副本)");
    }
    
    //传入意图标签
    $scope.addInputIntentTagFunc = function(addInputIntentTag){
        if(isContainSpacesFunc(addInputIntentTag)) return; //检测是否包含空格
        if(addInputIntentTag && $.trim(addInputIntentTag).length > 0){
            if(!$scope.intentDetail.contexts){
                $scope.intentDetail.contexts = new Array();
            }
            $scope.intentDetail.contexts.push(addInputIntentTag);
            $scope.addInputIntentTag = "";
            dataEditedFlag = true;
        }
    }
    //enter添加传入意图标签
    $scope.addInputIntentTagKeydownFunc = function($event,addInputIntentTag){
        if($event.keyCode == 13){
            $scope.addInputIntentTagFunc(addInputIntentTag);
        }
    }
    //删除传入标签
    $scope.deleteInputIntentTagFunc = function(context){
        for(var i in $scope.intentDetail.contexts){
            if($scope.intentDetail.contexts[i] == context){
                $scope.intentDetail.contexts.splice(i,1);
                dataEditedFlag = true;
            }
        }
    }
    
    //传出意图标签
    $scope.addAffectedContextFunc = function(addAffectedContext){
        if(isContainSpacesFunc(addAffectedContext)) return; //检测是否包含空格
        if(addAffectedContext && $.trim(addAffectedContext).length > 0){
            var affectedContextObj = new Object();
            affectedContextObj.lifespan = 1;
            affectedContextObj.name = addAffectedContext;
            if(!$scope.response.affectedContexts){
                $scope.response.affectedContexts = new Array();
            }
            $scope.response.affectedContexts.push(affectedContextObj);
            $scope.addAffectedContext = "";
            dataEditedFlag = true;
        }
    }
    //enter添加传入意图标签
    $scope.addAffectedContextKeydownFunc = function($event,addAffectedContext){
        if($event.keyCode == 13){
            $scope.addAffectedContextFunc(addAffectedContext);
        }
    }
    //删除传入意图标签
    $scope.deleteAffectedContextFunc = function(addAffectedContext){
        for(var i in $scope.response.affectedContexts){
            if($scope.response.affectedContexts[i].name == addAffectedContext){
                $scope.response.affectedContexts.splice(i,1);
                dataEditedFlag = true;
                break;
            }
        }
    }
    
    //增加输出反馈响应
    $scope.addSpechFunc = function(speech,index){
        if(!speech || $.trim(speech).length <= 0){
            return false;
        }
        if(!$scope.intentDetail.speech){
            $scope.intentDetail.speech = new Array();
            $scope.intentDetail.speech.push(speech);
        }else{
            var flag = false;
            for(var i in $scope.intentDetail.speech){
                if(i == index){
                    $scope.intentDetail.speech[i] = speech;
                    flag = true;
                }
            }
            if(!flag){
                $scope.intentDetail.speech.push(speech);
            }
        }
        $scope.addSpeech = "";
    }
    //enter添加输出反馈响应
    $scope.addSpechKeydownFunc = function($event,speech,index){
        if($event.keyCode == 13){
            $scope.addSpechFunc(speech,index);
        }
    }
    //删除用户输出反馈响应
    $scope.deleteSpechFunc = function(speech){
        for(var i in $scope.intentDetail.speech){
            if($scope.intentDetail.speech[i] == speech){
                $scope.intentDetail.speech.splice(i,1);
                break;
            }
        }
    }
    //copy用户输出反馈响应
    $scope.copySpechFunc = function(speech){
        $scope.intentDetail.speech.push(speech);
    }
    
    //设置参数是否必须函数
    $scope.addParamentRequiredFunc = function(parameterRequired,index){
        if(parameterRequired && $scope.response){
            if($scope.response.parameters){ //如果$scope.response.parameters 存在
                if(!$scope.response.parameters[index]){
                    var paramentObj = new Object();
                    paramentObj.required = parameterRequired;
                    $scope.response.parameters.push(paramentObj);
                }else{
                    $scope.response.parameters[index].required = parameterRequired;
                }
            }else{//如果$scope.response.parameters 不存在
                $scope.response.parameters = new Array();
                var paramentObj = new Object();
                paramentObj.required = parameterRequired;
                $scope.response.parameters.push(paramentObj);
            }
            dataEditedFlag = true;
            //清空最后添加的一行
            if($scope.paramentObject){
                $scope.paramentObject.required = false;
                $scope.paramentObject.name = "";
                $scope.paramentObject.value = "";
                $scope.paramentObject.dataType = "";
                $scope.paramentObject.required = false; //TODO prompt数据需要处理
                $scope.paramentObject.defaultValue = "";
            }
        }
    }
    //设置参数名称
    $scope.addParamentNameFunc = function(parameterName,index){
        if(checkIsChangeValue != parameterName){
            dataEditedFlag = true;
        }
        if(parameterName && parameterName.length > 0 && $scope.response){
            if($scope.response.parameters){ //如果$scope.response.parameters 存在
                if(!$scope.response.parameters[index]){
                    var paramentObj = new Object();
                    paramentObj.name = parameterName;
                    $scope.response.parameters.push(paramentObj);
                }else{
                    $scope.response.parameters[index].name = parameterName;
                }
            }else{//如果$scope.response.parameters 不存在
                $scope.response.parameters = new Array();
                var paramentObj = new Object();
                paramentObj.name = parameterName;
                $scope.response.parameters.push(paramentObj);
            }
            //清空最后添加的一行
            if($scope.paramentObject){
                $scope.paramentObject.required = false;
                $scope.paramentObject.name = "";
                $scope.paramentObject.value = "";
                $scope.paramentObject.dataType = "";
                $scope.paramentObject.required = false; //TODO prompt数据需要处理
                $scope.paramentObject.defaultValue = "";
            }
            $scope.intentDetail = addEmptyParametersFunc($scope.intentDetail);
        }
        $('[data-toggle="tooltip"]').tooltip(); //初始化提示
    }
    //设置参数值
    $scope.addParamentValueFunc = function(parameterValue,index){
        if(checkIsChangeValue != parameterValue){
            dataEditedFlag = true;
        }
        if(parameterValue && parameterValue.length > 0 && $scope.response){
            if($scope.response.parameters){ //如果$scope.response.parameters 存在
                if(!$scope.response.parameters[index]){
                    var paramentObj = new Object();
                    paramentObj.value = parameterValue;
                    $scope.response.parameters.push(paramentObj);
                }else{
                    $scope.response.parameters[index].value = parameterValue;
                }
            }else{//如果$scope.response.parameters 不存在
                $scope.response.parameters = new Array();
                var paramentObj = new Object();
                paramentObj.value = parameterValue;
                $scope.response.parameters.push(paramentObj);
            }
            //清空最后添加的一行
            if($scope.paramentObject){
                $scope.paramentObject.required = false;
                $scope.paramentObject.name = "";
                $scope.paramentObject.value = "";
                $scope.paramentObject.dataType = "";
                $scope.paramentObject.required = false; //TODO prompt数据需要处理
                $scope.paramentObject.defaultValue = "";
            }
            $scope.intentDetail = addEmptyParametersFunc($scope.intentDetail);
        }
        $('[data-toggle="tooltip"]').tooltip(); //初始化提示
    }
    //设置参数类型
    $scope.addParamentDataTypeFunc = function(parameterDataType,index){
        if(checkIsChangeValue != parameterDataType){
            dataEditedFlag = true;
        }
        if(parameterDataType && parameterDataType.length > 0 && $scope.response){
            if($scope.response.parameters){ //如果$scope.response.parameters 存在
                if(!$scope.response.parameters[index]){
                    var paramentObj = new Object();
                    paramentObj.dataType = parameterDataType;
                    $scope.response.parameters.push(paramentObj);
                }else{
                    $scope.response.parameters[index].dataType = parameterDataType;
                }
            }else{//如果$scope.response.parameters 不存在
                $scope.response.parameters = new Array();
                var paramentObj = new Object();
                paramentObj.dataType = parameterDataType;
                $scope.response.parameters.push(paramentObj);
            }
            //清空最后添加的一行
            if($scope.paramentObject){
                $scope.paramentObject.required = false;
                $scope.paramentObject.name = "";
                $scope.paramentObject.value = "";
                $scope.paramentObject.dataType = "";
                $scope.paramentObject.required = false; //TODO prompt数据需要处理
                $scope.paramentObject.defaultValue = "";
            }
            $scope.intentDetail = addEmptyParametersFunc($scope.intentDetail);
        }
        $('[data-toggle="tooltip"]').tooltip(); //初始化提示
    }
    
    //设置参数默认值
    $scope.addParamentDefaultValueFunc = function(parameterDefaultValue,index){
        if(checkIsChangeValue != parameterDefaultValue){
            dataEditedFlag = true;
        }
        if(parameterDefaultValue && parameterDefaultValue.length > 0 && $scope.response){
            if($scope.response.parameters){ //如果$scope.response.parameters 存在
                if(!$scope.response.parameters[index]){
                    var paramentObj = new Object();
                    paramentObj.defaultValue = parameterDefaultValue;
                    $scope.response.parameters.push(paramentObj);
                }else{
                    $scope.response.parameters[index].defaultValue = parameterDefaultValue;
                }
            }else{//如果$scope.response.parameters 不存在
                $scope.response.parameters = new Array();
                var paramentObj = new Object();
                paramentObj.defaultValue = parameterDefaultValue;
                $scope.response.parameters.push(paramentObj);
            }
            //清空最后添加的一行
            if($scope.paramentObject){
                $scope.paramentObject.required = false;
                $scope.paramentObject.name = "";
                $scope.paramentObject.value = "";
                $scope.paramentObject.dataType = "";
                $scope.paramentObject.required = false; //TODO prompt数据需要处理
                $scope.paramentObject.defaultValue = "";
            }
            $scope.intentDetail = addEmptyParametersFunc($scope.intentDetail);
        }
        $('[data-toggle="tooltip"]').tooltip(); //初始化提示
    }
    //删除参数
    $scope.deleteParamentFunc = function($index){
        for(var i in $scope.response.parameters){
            if(i == $index){
                $scope.response.parameters.splice(i,1);
                dataEditedFlag = true;
                break;
            }
        }
    }
    
    //复制参数
    $scope.copyParamentFunc = function($index){
        var parameterObj = {};
        var parameterTemp = {};
        for(var i in $scope.response.parameters){
            if(i == $index){
                parameterTemp = $scope.response.parameters[i];
                break;
            }
        }
        parameterObj.dataType = parameterTemp.dataType;
        parameterObj.defaultValue = parameterTemp.defaultValue;
        parameterObj.name = parameterTemp.name;
        var promptsTemp = [];
        for(var i in parameterTemp.prompts){
            promptsTemp.push(parameterTemp.prompts[i]);
        }
        parameterObj.prompts = promptsTemp;
        parameterObj.required = parameterTemp.required;
        parameterObj.value = parameterTemp.value;
        var responseLength = $scope.response.parameters.length - 2;
        dataEditedFlag = true;
        $scope.response.parameters.splice(responseLength,0,parameterObj);
    }
    
    //打开提示语列表,并初始化数据
    $scope.editPromptsList = function(index){
        if($scope.response.parameters[index].prompts){
            $scope.prompts = $scope.response.parameters[index].prompts;
        }else{
            $scope.prompts = new Array();
        }
        $scope.promptIndex = index;
    }
    
    $scope.promptSubmit = function(){
        $("#addPrompts").modal("hide");
    }
    
    $scope.check = function($event) {
        console.log(1);
        $($event.target).scroll(function(){
            $($event.target).css("height",$(this)[0].scrollHeight);
        });
    }
    
    //添加提示语
    $scope.addPromptFunc = function($index,$event){
        var $this =$($event.target);
        $this.next().css('visibility', 'visible');
        $this.nextAll('.copy-prompt').css('visibility', 'visible');
        var addPromptValue = $($event.target).val() || $($event.target).text();
        setTimeout(function(){
            if(!addPromptValue || $.trim(addPromptValue).length <= 0){
                return false;
            }
            if(!$scope.prompts){
                $scope.prompts = new Array();
                $scope.prompts.push(addPromptValue);
            }else{
                var flag = false;
                for(var i in $scope.prompts){
                    if(i == $index){
                        $scope.prompts[i] = addPromptValue;
                        flag = true;
                    }
                }
                if(!flag){
                    $scope.prompts.push(addPromptValue);
                }
            }
            dataEditedFlag = true;
            $scope.addPromptValue = "";
            $scope.$apply();
//          $($event.target).scrollTop(0);
        },200);
    }
    
    //提示语获得焦点隐藏操作图标
    $scope.hideOprationIcon = function($event) {
        var $this =$($event.target);
        $this.next().css('visibility', 'hidden');
        $this.nextAll('.copy-prompt').css('visibility', 'hidden');
    }
    
    //自动刷新计算图标的垂直位置
    $scope.calcuteHeight = function($event) {
        var $this =$($event.target);
        setTimeout(function() {
            var currentHeight = $this.height();
            if(currentHeight >= 60) {
                $this.next().css('top', 30 + 'px');
                $this.nextAll('.copy-prompt').css('top', 30 + 'px');
            }else if(currentHeight >= 40) {
                $this.next().css('top', 20 + 'px');
                $this.nextAll('.copy-prompt').css('top', 20 + 'px');
            }else if(currentHeight >= 20) {
                $this.next().css('top', 10 + 'px');
                $this.nextAll('.copy-prompt').css('top', 10 + 'px');
            }
        }, 100);
    }
    
    //回车添加提示语
    $scope.addPromptKeydownFunc = function($event,addPromptValue,$index){
        if($event.keyCode == 13){
            $scope.addPromptFunc($index, $event);
        }
    }
    //隐藏添加提示语列表
    $('#addPrompts').on('hidden.bs.modal', function () {
        if($scope.response.parameters && $scope.response.parameters[$scope.promptIndex]){
            $scope.response.parameters[$scope.promptIndex].prompts = $scope.prompts;
        }
    });
    //删除提示语
    $scope.deletePromptFunc = function($index){
        for(var i in $scope.prompts){
            if(i == $index){
                $scope.prompts.splice(i,1);
                break;
            }
        }
    }
    
    //复制提示语
    $scope.copyPromptFunc = function($index, $event){
        var copyItem = $($event.target).parent().find('.prompt-item').text() + '(副本)';
        $scope.prompts.push(copyItem);
    }
    
    //设置意图优先级
    $scope.setPriorityFunc = function(priority){
        dataEditedFlag = true;
        $scope.intentDetail.priority = priority;
    }
    
    //查看更多用户说
    $("body").off("click","[data-act=showMoreTemplate] label").on("click","[data-act=showMoreTemplate] label",function(event){
        var $this = $(this);
        if($this.siblings("i").attr("class") == "glyphicon glyphicon-triangle-bottom"){
//          $(".user-say-templates").animate({height:"100%"});
            $scope.userSayFlag = true;
//          $this.siblings("i").attr("class","glyphicon glyphicon-triangle-top");
//          $this.text("收起");
        }else{
//          $(".user-say-templates").animate({height:"176px"});
            $scope.userSayFlag = false;
//          $this.siblings("i").attr("class","glyphicon glyphicon-triangle-bottom");
//          $this.text("查看更多");
        }
        $scope.$apply();
    });
    
    //设置机器学习级别
    $("body").off("click","[data-act=learnLevel]").on("click","[data-act=learnLevel]",function(){
        var $this = $(this);
        var thisClass = $this.attr("class");
        var $learn_level_bar = $("[data-act=learn-level-bar]");
        if(thisClass.indexOf("CLOSE") > -1){
            $learn_level_bar.css("width","0%");
            $("ul > .LOW i").removeClass("active");
            $("ul > .MIDDLE i").removeClass("active");
            $("ul > .HIGH i").removeClass("active");
            $scope.intentDetail.mlLevel = "CLOSE";
        }else if(thisClass.indexOf("LOW") > -1){
            $learn_level_bar.css("width","34%");
            $("ul > .CLOSE i").addClass("active");
            $("ul > .LOW i").addClass("active");
            $("ul > .MIDDLE i").removeClass("active");
            $("ul > .HIGH i").removeClass("active");
            $scope.intentDetail.mlLevel = "LOW";
        }else if(thisClass.indexOf("MIDDLE") > -1){
            $learn_level_bar.css("width","68%");
            $("ul > .CLOSE i").addClass("active");
            $("ul > .LOW i").addClass("active");
            $("ul > .MIDDLE i").addClass("active");
            $("ul > .HIGH i").removeClass("active");
            $scope.intentDetail.mlLevel = "MIDDLE";
        }else if(thisClass.indexOf("HIGH") > -1){
            $learn_level_bar.css("width","100%");
            $("ul > .CLOSE i").addClass("active");
            $("ul > .LOW i").addClass("active");
            $("ul > .MIDDLE i").addClass("active");
            $("ul > .HIGH i").addClass("active");
            $scope.intentDetail.mlLevel = "HIGH";
        }
    });
    
    /**
     * 设置是否机器学习
     */
    $scope.learnLevelFunc = function(mlLevel){
        if(mlLevel){
            $scope.intentDetail.mlLevel = "MIDDLE";
        }else{
            $scope.intentDetail.mlLevel = "CLOSE";
        }
    }
    
    //初始设置机器学习级别
    var setLearnLevelFunc = function(){
        if($scope.intentDetail.mlLevel == "CLOSE"){
            $scope.mlLevel = false;
        }else{
            $scope.mlLevel = true;
        }
//      var $learn_level_bar = $("[data-act=learn-level-bar]");
//      if($scope.intentDetail.mlLevel == "CLOSE"){
//          $learn_level_bar.css("width","0%");
//          $("ul > .LOW i").removeClass("active");
//          $("ul > .MIDDLE i").removeClass("active");
//          $("ul > .HIGH i").removeClass("active");
//          $scope.intentDetail.mlLevel = "CLOSE";
//      }else if($scope.intentDetail.mlLevel == "LOW"){
//          $learn_level_bar.css("width","34%");
//          $("ul > .CLOSE i").addClass("active");
//          $("ul > .LOW i").addClass("active");
//          $("ul > .MIDDLE i").removeClass("active");
//          $("ul > .HIGH i").removeClass("active");
//          $scope.intentDetail.mlLevel = "LOW";
//      }else if($scope.intentDetail.mlLevel == "MIDDLE"){
//          $learn_level_bar.css("width","68%");
//          $("ul > .CLOSE i").addClass("active");
//          $("ul > .LOW i").addClass("active");
//          $("ul > .MIDDLE i").addClass("active");
//          $("ul > .HIGH i").removeClass("active");
//          $scope.intentDetail.mlLevel = "MIDDLE";
//      }else if($scope.intentDetail.mlLevel == "HIGH"){
//          $learn_level_bar.css("width","100%");
//          $("ul > .CLOSE i").addClass("active");
//          $("ul > .LOW i").addClass("active");
//          $("ul > .MIDDLE i").addClass("active");
//          $("ul > .HIGH i").addClass("active");
//          $scope.intentDetail.mlLevel = "HIGH";
//      }
    }
    
    //多媒体回复 start
    
    //获取多媒体列表
    $scope.getMediaListFunc = function(type,start,pageSize,loadMaterialListFunc){
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/" + $rootScope.appId +"/material/" + type,
            data:{"start":start,"limit":pageSize},
            method: "GET",
            success: function(data){
                data = dataParse(data);
					if(data.code == 0){
                    if(data.result){
                        if(loadMaterialListFunc){
                            loadMaterialListFunc(data.result.item);
                        }
                    }
                }else if(data.code == 2){
                    goIndex();
                }else{
//                  $(".authorize-tip-box").css("display","block");
//                  $.trace(data.msg);
                }
            }
        });
    }
    
    //简单处理微信素材重复加载的bug
    $rootScope.newsList = null;
    $rootScope.imageObjList = null;
    $rootScope.voiceList = null;
    $rootScope.videoList = null;
    //获取多媒体数据
    $scope.loadMaterialFunc = function(type, loadMaterialListFunc){
        var pageSize = 10;
        if(type == "news"){
            if(!$rootScope.newsList){
                pageSize = $scope.newsPageSize;
                $scope.getMediaListFunc(type,0,pageSize,loadMaterialListFunc);
            }
        }else if(type == "image"){
            if(!$rootScope.imageObjList){
                pageSize = $scope.imagePageSize;
                $scope.getMediaListFunc(type,0,pageSize,loadMaterialListFunc);
            }
        }else if(type == "voice"){
            if(!$rootScope.voiceList){
                pageSize = $scope.voicePageSize;
                $scope.getMediaListFunc(type,0,pageSize,loadMaterialListFunc);
            }
        }else if(type == "video"){
            if(!$rootScope.videoList){
                pageSize = $scope.videoPageSize;
                $scope.getMediaListFunc(type,0,pageSize,loadMaterialListFunc);
            }
        }
        
    }
    
    //加载图文消息
    $scope.loadNewsFunc = function(){
        $scope.loadMaterialFunc("news",function(item){
            $rootScope.newsList = item;
            $scope.$apply();
        });
    }
    
    //加载图片消息
    $scope.loadImageFunc = function(){
        $scope.loadMaterialFunc("image",function(item){
            $rootScope.imageObjList = item;
            $scope.$apply();
        });
    }
    
    //加载语音消息
    $scope.loadVoiceFunc = function(){
        $scope.loadMaterialFunc("voice",function(item){
            $rootScope.voiceList = item;
            //$rootScope.voiceList = JSON.parse('[{"media_id":"8UjzyOZ-djUITYsTWVP2RxMx4EjZDp-FR-4sTKuU9xM","name":"B269EB17529FBCBC35AC7206B92104D1.mp3","update_time":1460433164}]');
            for(var i in $rootScope.voiceList){
                $rootScope.voiceList[i].selected = false;
            }
            $scope.$apply();
        });
    }
    
    //加载视频消息
    $scope.loadVideoFunc = function(){
        $scope.loadMaterialFunc("video",function(item){
            $rootScope.videoList = item;
            for(var i in $rootScope.videoList){
                $rootScope.videoList[i].selected = false;
            }
            $scope.$apply();
        });
    }
    
    //设置多媒体回复
//  $scope.mediaSetFunc = function(mediaId){
//      $scope.actionMediaId = mediaId;
//      $("#mediaResponseModal").modal("show");
//      $scope.loadNewsFunc();
//      //$rootScope.newsList =JSON.parse('[{ "content": { "news_item": [{ "author": "", "content": "<p>324</p >", "content_source_url": "", "digest": "324", "show_cover_pic": 0, "thumb_media_id": "8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4", "title": "23", "url": "http://mp.weixin.qq.com/s?__biz=MzI2NDIxNDAwMQ==&mid=501495439&idx=1&sn=6e02580327897df2931d86dd2b3e7818#rd" }, { "author": "", "content": "<p>324</p >", "content_source_url": "", "digest": "324", "show_cover_pic": 0, "thumb_media_id": "8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4", "title": "23", "url": "http://mp.weixin.qq.com/s?__biz=MzI2NDIxNDAwMQ==&mid=501495439&idx=1&sn=6e02580327897df2931d86dd2b3e7818#rd" }, { "author": "", "content": "<p>324</p >", "content_source_url": "", "digest": "324", "show_cover_pic": 0, "thumb_media_id": "8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4", "title": "23", "url": "http://mp.weixin.qq.com/s?__biz=MzI2NDIxNDAwMQ==&mid=501495439&idx=1&sn=6e02580327897df2931d86dd2b3e7818#rd" }, { "author": "", "content": "<p>324</p >", "content_source_url": "", "digest": "324", "show_cover_pic": 0, "thumb_media_id": "8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4", "title": "23", "url": "http://mp.weixin.qq.com/s?__biz=MzI2NDIxNDAwMQ==&mid=501495439&idx=1&sn=6e02580327897df2931d86dd2b3e7818#rd" }, { "author": "", "content": "<p>324</p >", "content_source_url": "", "digest": "324", "show_cover_pic": 0, "thumb_media_id": "8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4", "title": "23", "url": "http://mp.weixin.qq.com/s?__biz=MzI2NDIxNDAwMQ==&mid=501495439&idx=1&sn=6e02580327897df2931d86dd2b3e7818#rd" }, { "author": "", "content": "<p>324</p >", "content_source_url": "", "digest": "324", "show_cover_pic": 0, "thumb_media_id": "8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4", "title": "23", "url": "http://mp.weixin.qq.com/s?__biz=MzI2NDIxNDAwMQ==&mid=501495439&idx=1&sn=6e02580327897df2931d86dd2b3e7818#rd" }] }, "media_id": "8UjzyOZ-djUITYsTWVP2RwMmqygBzHc_OVc48Quu0i8", "update_time": 1460440737 }]');
//  }
    
    $scope.wechatMediaSetFunc = function(parentIndex, index){
        $scope.currentWechatParentIndex = parentIndex;
        $scope.currentWechatIndex = index;
        $("#mediaResponseModal").modal("show");
        if(parentIndex != -1){
            var output = $scope.wechatOutputs[parentIndex][index];
            switch(output.type){
            case "wechat.image": $("#weixin-customize-image-chosen").trigger("click"); 
                                 $("#weixin-customize-image-name").val(output.property.title);
                                 $("#weixin-customize-image-url").val(output.property.image_url);
            break;
            case "wechat.music": $("#weixin-customize-music-chosen").trigger("click"); 
                                 $("#weixin-customize-music-name").val(output.property.title);
                                 $("#weixin-customize-music-abstract").val(output.property.description);
                                 $("#weixin-customize-music-url").val(output.property.music_url);
            break;
            case "wechat.voice": $("#weixin-customize-voice-chosen").trigger("click"); 
                                 $("#weixin-customize-voice-name").val(output.property.title);
                                 $("#weixin-customize-voice-url").val(output.property.media_id);
            break;
            case "wechat.video": $("#weixin-customize-video-chosen").trigger("click"); 
                                 $("#weixin-customize-video-name").val(output.property.title);
                                 $("#weixin-customize-video-url").val(output.property.media_id);
            break;
            case "wechat.news": $("#weixin-customize-news-chosen").trigger("click");
                                for(var i = 0; i < output.list.length; i++){
                                    if(i > $("#weixin-customize-news-detail .customize-news-body").find(".customize-news").length - 1){
                                        $(".add-customize-news").trigger("click"); 
                                    }
                                    $("#weixin-customize-news-detail .customize-news-body").find(".customize-news").eq(i).find(".weixin-customize-news-name").val(output.list[i].title);
                                    $("#weixin-customize-news-detail .customize-news-body").find(".customize-news").eq(i).find(".weixin-customize-news-abstract").val(output.list[i].description);
                                    $("#weixin-customize-news-detail .customize-news-body").find(".customize-news").eq(i).find(".weixin-customize-news-url").val(output.list[i].pic_url);
                                    $("#weixin-customize-news-detail .customize-news-body").find(".customize-news").eq(i).find(".weixin-customize-news-jumpto").val(output.list[i].url);
                                }
            break;
            }
        }else{
            $("#mediaResponseModal #myTab-media").children().eq(0).children("a").trigger("click");
            resetCustomize();
        }
//      $scope.loadNewsFunc();
        
    }
    //多媒体回复 end
    
    //初始化自定义
    var resetCustomize = function(){
        if($(".customize-body").find(".customize-news-body")){
            for(var i = 0, length = $(".customize-body").find(".customize-news-body").children().length; i < length; i++){
                if(i > 0){
                    $(".customize-body").find(".customize-news-body").children().eq(i).remove();
                }
            }
        }
        $(".customize-body").find(".form-control").val("");
    }
    
    //选择图文消息
    $scope.newsObjectClickFunc = function(mediaId){
        for(var i in $rootScope.newsList){
            if($rootScope.newsList[i].media_id == mediaId){
                $rootScope.newsList[i].selected = true;
            }else{
                $rootScope.newsList[i].selected = false;
            }
        }
    }
    
    //选择图片
    $scope.imageObjectClickFunc = function(mediaId){
        for(var i in $rootScope.imageObjList){
            if($rootScope.imageObjList[i].media_id == mediaId){
                $rootScope.imageObjList[i].selected = true;
            }else{
                $rootScope.imageObjList[i].selected = false;
            }
        }
    }
    
    //选择音频消息
    $scope.voiceObjectClickFunc = function(mediaId){
        for(var i in $rootScope.voiceList){
            if($rootScope.voiceList[i].media_id == mediaId){
                $rootScope.voiceList[i].selected = true;
            }else{
                $rootScope.voiceList[i].selected = false;
            }
        }
    }
    
    //选择视频
    $scope.videoObjectClickFunc = function(mediaId){
        for(var i in $rootScope.videoList){
            if($rootScope.videoList[i].media_id == mediaId){
                $rootScope.videoList[i].selected = true;
            }else{
                $rootScope.videoList[i].selected = false;
            }
        }
    }
    
    //提交设置多媒体
    $scope.setMediaSubmitFunc = function(){
        var $choosed = $(".choose-media-response.active");
        var type = $choosed.attr("data-type");
        var outputObj = {};
        switch (type) {
            case "wechat.news":
                dataEditedFlag = true;
                for(var i in $rootScope.newsList){
                    if($rootScope.newsList[i].selected){
                        outputObj = createOutputObjectFunc(type,$rootScope.newsList[i].content.news_item[0].title,"",$rootScope.newsList[i].media_id);
                        break;
                    }
                }
                break;
            case "wechat.image":
                dataEditedFlag = true;
                for(var i in $rootScope.imageObjList){
                    if($rootScope.imageObjList[i].selected){
                        outputObj = createOutputObjectFunc(type,$rootScope.imageObjList[i].name,"",$rootScope.imageObjList[i].media_id);
                        break;
                    }
                }
                break;
            case "wechat.voice":
                dataEditedFlag = true;
                for(var i in $rootScope.voiceList){
                    if($rootScope.voiceList[i].selected){
                        outputObj = createOutputObjectFunc(type,$rootScope.voiceList[i].name,"",$rootScope.voiceList[i].media_id);
                        break;
                    }
                }
                break;
            case "wechat.video":
                dataEditedFlag = true;
                for(var i in $rootScope.videoList){
                    if($rootScope.videoList[i].selected){
                        outputObj = createOutputObjectFunc(type,$rootScope.videoList[i].name,"",$rootScope.videoList[i].media_id);
                        break;
                    }
                }
                break;
            case "wechat.customize":
                dataEditedFlag = true;
                var $checkedId = $(".customize-body .active");
                var id = $checkedId.attr("id");
                if(id == "weixin-customize-image-detail"){
                    var name = $("#weixin-customize-image-name").val();
                    var url = $("#weixin-customize-image-url").val();
                    outputObj = createOutputObjectFunc("wechat.image",name,url,"");
                }else if(id == "weixin-customize-music-detail"){
                    var name = $("#weixin-customize-music-name").val();
                    var url = $("#weixin-customize-music-url").val();
                    var description = $("#weixin-customize-music-abstract").val();
                    outputObj = createOutputObjectFunc("wechat.music",name,url,"",description);
                }else if(id == "weixin-customize-voice-detail"){
                    var name = $("#weixin-customize-voice-name").val();
                    var mediaId = $("#weixin-customize-voice-url").val();
                    outputObj = createOutputObjectFunc("wechat.voice",name,"",mediaId);
                }else if(id == "weixin-customize-video-detail"){
                    var name = $("#weixin-customize-video-name").val();
                    var mediaId = $("#weixin-customize-video-url").val();
                    outputObj = createOutputObjectFunc("wechat.video",name,"",mediaId);
                }else if(id == "weixin-customize-news-detail"){
                    var length = $("#weixin-customize-news-detail .customize-news-body").children().length;
                    var list = new Array();
                        for(var i=0; i<length; i++){
                            list[i] = new Object();
                            var title = $("#weixin-customize-news-detail .customize-news-body").children().eq(i).find(".weixin-customize-news-name").val();
                            var pic_url = $("#weixin-customize-news-detail .customize-news-body").children().eq(i).find(".weixin-customize-news-url").val();
                            var description = $("#weixin-customize-news-detail .customize-news-body").children().eq(i).find(".weixin-customize-news-abstract").val();
                            var url = $("#weixin-customize-news-detail .customize-news-body").children().eq(i).find(".weixin-customize-news-jumpto").val();
                            list[i].title = title;
                            list[i].pic_url = pic_url;
                            list[i].description = description;
                            list[i].url = url;
                        }
                        outputObj = createOutputObjectFunc("wechat.news","","","","",list);
//                  }
                    
                    
                }
                break;
        }
        createOrUpdateOutputsWechatFunc(outputObj);//创建或者更新多媒体列表
        $("#mediaResponseModal").modal("hide");
//      var responseText = "";
//      var typeSplit = "#####";
//      var keySplit = "&&&&&";
//      if(type == "weixin-news"){
//          responseText +="@mediaResourceResponse-news"
//          for(var i in $rootScope.newsList){
//              if($rootScope.newsList[i].selected){
//                  responseText+= typeSplit + "mediaid" + keySplit + $rootScope.newsList[i].media_id;
//                  responseText+=typeSplit + "name" + keySplit + $rootScope.newsList[i].content.news_item[0].title;
//                  break;
//              }
//          }
//      }else if(type == "weixin-image"){
//          responseText +="@mediaResourceResponse-image"
//          for(var i in $rootScope.imageObjList){
//              if($rootScope.imageObjList[i].selected){
//                  responseText+= typeSplit + "mediaid" + keySplit + $rootScope.imageObjList[i].media_id;
//                  responseText+= typeSplit + "name" + keySplit + $rootScope.imageObjList[i].name;
//                  break;
//              }
//          }
//      }else if(type == "weixin-voice"){
//          responseText +="@mediaResourceResponse-voice"
//          for(var i in $rootScope.voiceList){
//              if($rootScope.voiceList[i].selected){
//                  responseText+= typeSplit + "mediaid" + keySplit + $rootScope.voiceList[i].media_id;
//                  responseText+= typeSplit + "name" + keySplit + $rootScope.voiceList[i].name;
//                  break;
//              }
//          }
//      }else if(type == "weixin-video"){
//          responseText +="@mediaResourceResponse-video"
//          for(var i in $rootScope.videoList){
//              if($rootScope.videoList[i].selected){
//                  responseText+= typeSplit + "mediaid" + keySplit + $rootScope.videoList[i].media_id;
//                  responseText+= typeSplit + "name" + keySplit + $rootScope.videoList[i].name;
//                  break;
//              }
//          }
//      }
//      $("#mediaResponseModal").modal("hide");
//      var mediaObj = $scope.createMediaObjectFunc(responseText);
//      if($scope.actionMediaId && $scope.actionMediaId.length > 0){
//          for(var i in $scope.mediaResponseList){
//              if($scope.mediaResponseList[i].mediaId == $scope.actionMediaId){
//                  $scope.mediaResponseList[i] = mediaObj;
//                  flag = true;
//                  break;
//              }
//          }
//      }else{
//          $scope.mediaResponseList.push(mediaObj);
//      }
    }
    
    //删除多媒体
    $scope.mediaDeleteFunc = function(mediaId){
        for(var i in $scope.mediaResponseList){
            if($scope.mediaResponseList[i].mediaId == mediaId){
                $scope.mediaResponseList.splice(i,1);
                break;
            }
        }
    }
    
    //预览多媒体
    $scope.mediaPreviewFunc = function(mediaId){
        
    }
    
    //图文消息分页 start
    $rootScope.newsLoadPageId = 1;
    $rootScope.newsLoadMoreBox = true;
    
    $(".news-box").on("scroll",function(e){
        var type = "news";
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $rootScope.newsLoadMoreBox == true ) {
            $rootScope.newsLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/" + $rootScope.appId +"/material/" + type,
                data:{"start":$rootScope.newsLoadPageId * $scope.newsPageSize,"limit":$scope.newsPageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        var newsList = data.result.item;
                        if(newsList.length > 0){
                            for(var i in newsList){
                                $rootScope.newsList.push(newsList[i]);
                            }
                            $rootScope.newsLoadPageId++;
                            $rootScope.newsLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $rootScope.newsLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    //图文消息分页 end
    
    //图片分页 start
    $rootScope.imageObjLoadPageId = 1;
    $rootScope.imageObjLoadMoreBox = true;
    
    $(".image-box").on("scroll",function(e){
        var type = "image";
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $rootScope.imageObjLoadMoreBox == true ) {
            $rootScope.imageObjLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/" + $rootScope.appId +"/material/" + type,
                data:{"start":$rootScope.imageObjLoadPageId * $scope.imagePageSize,"limit":$scope.imagePageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        var imageObjList = data.result.item;
                        if(imageObjList.length > 0){
                            for(var i in imageObjList){
                                $rootScope.imageObjList.push(imageObjList[i]);
                            }
                            $rootScope.imageObjLoadPageId++;
                            $rootScope.imageObjLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $rootScope.imageObjLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    //图片分页 end
    
    //音频分页 start
    $rootScope.voiceLoadPageId = 1;
    $rootScope.voiceLoadMoreBox = true;
    
    $(".voice-box").on("scroll",function(e){
        var type = "voice";
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $rootScope.voiceLoadMoreBox == true ) {
            $rootScope.voiceLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/" + $rootScope.appId +"/material/" + type,
                data:{"start":$rootScope.voiceLoadPageId * $scope.voicePageSize,"limit":$scope.voicePageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        var voiceList = data.result.item;
                        if(voiceList.length > 0){
                            for(var i in voiceList){
                                $rootScope.voiceList.push(voiceList[i]);
                            }
                            $rootScope.voiceLoadPageId++;
                            $rootScope.voiceLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $rootScope.voiceLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    //音频分页 end
    
    //视频分页 start
    $rootScope.videoLoadPageId = 1;
    $rootScope.videoLoadMoreBox = true;
    
    $(".video-box").on("scroll",function(e){
        var type = "video";
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $rootScope.videoLoadMoreBox == true ) {
            $rootScope.videoLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/" + $rootScope.appId +"/material/" + type,
                data:{"start":$rootScope.videoLoadPageId * $scope.videoPageSize,"limit":$scope.videoPageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        var videoList = data.result.item;
                        if(videoList.length > 0){
                            for(var i in videoList){
                                $rootScope.videoList.push(videoList[i]);
                            }
                            $rootScope.videoLoadPageId++;
                            $rootScope.videoLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $rootScope.videoLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    //视频分页 end
    
    //切换多媒体tab
    $('[data-act=change-media]').click(function(){
        var $this = $(this);
        var $href = $this.attr("href");
//      $rootScope.imageObjList = JSON.parse('[{"media_id":"8UjzyOZ-djUITYsTWVP2R9eQ4x_a_acWIx4ANFjOJM4","name":"b17eca8065380cd7b84ba9eca344ad345982815d.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxwUCT8xsQ7x6g6JCsJT8cpoa0wQWR9DGkAHhficRLwtSOGwl9QPFjXqA/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2RxQ-0wQr3c3eyGWrL7mJ3O8","name":"40269979_404.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxwIEd00P5d4hhUHfPAGQK6XiboiaeKEL3fCFMXXenol55mquEydQvdGzQ/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R8gpClMt-GDYnNLJq7jYq-o","name":"91529822720e0cf3ab9db9fb0846f21fbe09aa4c.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxjXiaCcrgokH4R1qLUgtxj61OicEWafdGFNIiayhd39vACJTUkQvz9fDicg/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R-_DGiv_lY9JQiI7yH-oixM","name":"aa64034f78f0f736f514e2010855b319eac413c3.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxmunHjPyPdffHOibiaUPUZibSXwGYwGeFDcic85fnQicYkqicIWL3Y3lrDjVg/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R5ZM8LbbcEOneM2hBki72DI","name":"80cb39dbb6fd526678b13b1aa918972bd4073621.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38Hxq3Ztczg9RY6KLHTRpd9b5PtwFlsibMm6rdVWwjcrytQJibLPdITJ5duA/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2Rz1GOTK1-EYir9GdZIOsOg8","name":"83025aafa40f4bfb27bfbf2b014f78f0f7361865.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxQuJJ4tOoDUKU5Xu2LS0kupYcv21gcctD5gYcLlQFIVKkJvlibh82Sog/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R7g-RQ2UIac2Z-q_JqYlm84","name":"8644ebf81a4c510fa42d1bf66459252dd52aa575.jpg","update_time":1460432074,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxQUGpiagxzoyByjyQo26KF2PfWR81w86ySrG88aAQiajW6klNGKCiaiaTvA/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R_S7P7D0tYl1MT7QyQh1eUY","name":"55e736d12f2eb938d3de795ad0628535e4dd6fe2.jpg","update_time":1460432073,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxB494nGMztCX4Kfib9nLIyLLz04BQXt6jPg4Tj4r6purJibRW0nvZGckw/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R4iilmoToRjP_pEfikJ9PSs","name":"10dfa9ec8a136327a1de913a938fa0ec08fac78c.jpg","update_time":1460432073,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxO8N9icleSzMRAFkiaaFoWXcjogW5EJ47D4iasP9qkShvqOtrKjlRymE0Q/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R1jSEJliZcHSi5BSlxTQTqI","name":"3c6d55fbb2fb43163406930422a4462309f7d3b7.jpg","update_time":1460432073,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxdL32rBTdNtULiaO4TxbKMyLl8oW4ABQyF8Hduy6UPAKQpFPOsaSx5lw/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R1JbNBPIanxsoHYbnYeMZgQ","name":"6c224f4a20a446230761b9b79c22720e0df3d7bf.jpg","update_time":1460432073,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxTnTdQHB5ODYR2I2YztDMeHoHTNA3VoGdFuKWKce1RCrpgDyVdp1iadg/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R3f2nfr1_RwvY0rwepFQptQ","name":"00e93901213fb80edacf8d0f32d12f2eb83894c8.jpg","update_time":1460432073,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxAsbcqG7HlSSBydtjuHxicwHSXt6sxQfgDXCzyfic9ca3PxcpllgqaHfQ/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R97l3D8vLvkWKsOSCMC8gRk","name":"91529822720e0cf3ab9db9fb0846f21fbe09aa4c.jpg","update_time":1460432068,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxjXiaCcrgokH4R1qLUgtxj61OicEWafdGFNIiayhd39vACJTUkQvz9fDicg/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R95aJXJCrBW9L7ADhZu_CBw","name":"b17eca8065380cd7b84ba9eca344ad345982815d.jpg","update_time":1460432067,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxwUCT8xsQ7x6g6JCsJT8cpoa0wQWR9DGkAHhficRLwtSOGwl9QPFjXqA/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R-A2Dkip8zQnV-yxvow-zPE","name":"aa64034f78f0f736f514e2010855b319eac413c3.jpg","update_time":1460432067,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxmunHjPyPdffHOibiaUPUZibSXwGYwGeFDcic85fnQicYkqicIWL3Y3lrDjVg/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R8mq2DlnIjTrlOOk4lnoPmA","name":"40269979_404.jpg","update_time":1460432067,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxwIEd00P5d4hhUHfPAGQK6XiboiaeKEL3fCFMXXenol55mquEydQvdGzQ/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2RyVhQ1_iW4nCwjtB7Q5hHYI","name":"83025aafa40f4bfb27bfbf2b014f78f0f7361865.jpg","update_time":1460432067,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxQuJJ4tOoDUKU5Xu2LS0kupYcv21gcctD5gYcLlQFIVKkJvlibh82Sog/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R0vVtam4r_1AZF21fjXRg-E","name":"8644ebf81a4c510fa42d1bf66459252dd52aa575.jpg","update_time":1460432067,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxQUGpiagxzoyByjyQo26KF2PfWR81w86ySrG88aAQiajW6klNGKCiaiaTvA/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R1pXnkYuIWTgQKxV8h8aTpc","name":"80cb39dbb6fd526678b13b1aa918972bd4073621.jpg","update_time":1460432066,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38Hxq3Ztczg9RY6KLHTRpd9b5PtwFlsibMm6rdVWwjcrytQJibLPdITJ5duA/0?wx_fmt=jpeg"},{"media_id":"8UjzyOZ-djUITYsTWVP2R4cuT8_nlRehtBUnta21ovE","name":"10dfa9ec8a136327a1de913a938fa0ec08fac78c.jpg","update_time":1460432066,"url":"https://mmbiz.qlogo.cn/mmbiz/rIvVibyYnDr7H4ZeibMEaweArkxPJW38HxO8N9icleSzMRAFkiaaFoWXcjogW5EJ47D4iasP9qkShvqOtrKjlRymE0Q/0?wx_fmt=jpeg"}]');
//      $rootScope.voiceList = JSON.parse('[{"media_id":"8UjzyOZ-djUITYsTWVP2RxMx4EjZDp-FR-4sTKuU9xM","name":"B269EB17529FBCBC35AC7206B92104D1.mp3","update_time":1460433164}]');
//      $rootScope.videoList =JSON.parse('[{"media_id":"8UjzyOZ-djUITYsTWVP2R_Hmd1gKoiqQsiurJ7_Nz-Q","name":"测试","update_time":1460433490}]');
        if($href == "#weixin-news"){
            $scope.loadNewsFunc();
        }else if($href == "#weixin-image"){
            $scope.loadImageFunc();
        }else if($href == "#weixin-voice"){
            $scope.loadVoiceFunc();
        }else if($href == "#weixin-video"){
            $scope.loadVideoFunc();
        }
    });
    
    $('[data-act=change-customize]').click(function(){
        var $this = $(this);
        var $href = $this.attr("href");
        $("#weixin-customize").addClass("in active").siblings().removeClass("in active");
        $("#customize").addClass("in active").siblings().removeClass("in active");
        $($href).addClass("active").show().siblings().removeClass("active").hide();
        $(this).parents(".dropdown-menu-customize").siblings(".customize").text($this.text());
//      $(".customize").text($this.text());
        $(".customize").parent().addClass("active").siblings().removeClass("active");
    });
    
    $('[data-toggle="popover"]').click(function(){
        var $this = $(this);
        var $popover_content = $(".popover-content");
        setTimeout(function(){
            if($popover_content.attr("class")){
                //$this.popover('hide');
            }else{
                $this.popover('show');
            }
        }, 200);
    });
    
    $("body").off("keyup","[data-act=intent-detail-title]").on("keyup","[data-act=intent-detail-title]",function(event){
        var $this = $(this);
        if(event.keyCode == 13){
            $("[data-act=user-sya-add]").focus();
        }
    });
    
    $("body").off("keyup","[data-act=tab-help]").on("keyup","[data-act=tab-help]",function(event){
        var $this = $(this);
        if(event.keyCode == 13){
            $this.parent().next().children().eq(0).focus();
        }
    });
    
    $("body").off("keyup","[data-act=user-intent-dataType-update]").on("keyup","[data-act=user-intent-dataType-update]",function(event){
        var $this = $(this);
        if(event.keyCode == 13){
            $this.parent().next().next().find("input").focus();
        }
    });
    $("body").off("keyup","[data-act=user-intent-defaultValue-update]").on("keyup","[data-act=user-intent-defaultValue-update]",function(event){
        var $this = $(this);
        if(event.keyCode == 13){
            $this.parent().parent().next().children().eq(0).find("input").focus();
        }
    });
    //拖拽用户说排序
    $( ".user-say-templates" ).sortable({
        items: ".sortable-li",
        cancel: ".delete,.copy,.user-says-input"
    });
    //$(".user-say-templates" ).disableSelection();   //不注释，firefox浏览器不兼容
    
    //拖动排序后
    $('.user-say-templates').sortable({ stop: function(event, ui) {
        var templatesTemp = [];
        var $userSaysInput = $(".user-says-input");
        $.each($userSaysInput, function(n, userSay) {
            var $userSay = $(userSay);
            if($userSay.attr("data-template") && $userSay.attr("data-template") != "undefined"){
                templatesTemp.push($userSay.attr("data-template"));
            }
        });
        $scope.intentDetail.templates = templatesTemp;
        $scope.$apply();
    } }); 
    
    //获得光标的时候，隐藏移动图标
    $("body").off("focus",".user-says-input").on("focus",".user-says-input",function(){
        var $this = $(this);
        $this.parent().find(".drop").css("visibility","hidden");
        $this.parent().find(".edit").css("visibility","hidden");
        $this.parent().find(".copy").css("visibility","hidden");
        $this.parent().find(".delete").css("visibility","hidden");
        setTimeout(function(){
            $this.find(".usersay-placeholder").remove();
        }, 20);
    });
    
//    $("body").off("focusout","[data-act=user-sya-add]").on("focusout","[data-act=user-sya-add]",function(){
//      var $this = $(this);
//      if(!$this.html() || $.trim($this.html()).length == 0){
//          $this.append('<div class="usersay-placeholder">请输入用户说</div>');
//      }
//    });
    
  //失去光标的时候，显示移动图标
    $("body").off("blur",".user-says-input").on("blur",".user-says-input",function(){
        var $this = $(this);
        $this.parent().find(".drop").css("visibility","visible");
        $this.parent().find(".edit").css("visibility","visible");
        $this.parent().find(".copy").css("visibility","visible");
        $this.parent().find(".delete").css("visibility","visible");
    });
    
    /**硬件多媒体资源管理 start*****/
    
    $scope.addResListTemp = []; //新上传的文件
    $scope.resType = "image";
    
    var loadpre = "pre";
    var loadnext = "next";
    var pageSize = 20;
    
    //初始化界面样式
    var initStyle = function(){
        $(".resource-manager .image-box").css("height",document.documentElement.clientHeight - 290);
        
        var image_ul_width = $(".image-box-ul").css("width");
        if(image_ul_width){
            image_ul_width = image_ul_width.replace("px","");
            image_ul_width = +image_ul_width;
            var image_count = parseInt(image_ul_width/186);
            $("#image .reource-operation").css("width", image_count * 186);
        }
    }
    $(window).resize(function() {
        initStyle();
    });
    initStyle();
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
      // 获取已激活的标签页的名称
      var activeTab = $(e.target).text(); 
      if($.trim(activeTab) == "图片"){
          initStyle();
          $scope.resType = "image";
          //获取图片资源列表 start
          if(!$scope.resImgList || $scope.resImgList.length == 0){
              $scope.loadResourceFunc(0,20,$scope.loadResourceListFunc);
          }
        //获取图片资源列表 end
      }else if($.trim(activeTab) == "音频"){
          $scope.resType = "voice";
          //获取音频资源列表
          if(!$scope.resVoiceList || $scope.resVoiceList.length == 0){
              $scope.loadResourceFunc(0,30,$scope.loadResourceListFunc);
          }
      }else if($.trim(activeTab) == "视频"){
          $scope.resType = "video";
        //获取视频资源列表
          if(!$scope.resVideoList || $scope.resVideoList.length == 0){
              $scope.loadResourceFunc(0,30,$scope.loadResourceListFunc);
          }
      }else if($.trim(activeTab) == "自定义"){
          $scope.resType = "customize";
        //获取视频资源列表
          if(!$scope.resVideoList || $scope.resVideoList.length == 0){
              $scope.loadResourceFunc(0,30,$scope.loadResourceListFunc);
          }
        }
      $scope.$apply();
    });
    
    /*七牛上传图片相关代码 start */
    /*
    //七牛上传图片文件 start
    var optionImg = {
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfiles',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        //uptoken: $('#uptoken_url').val(),
        uptoken_url:ruyiai_host + "/ruyi-ai/getuptoken",
        domain: $('#domain').val(),
        get_new_uptoken: false,
        save_key: true,
        filters : {
            mime_types: [
                     {title : "Image files", extensions : "BMP,DIB,EMF,GIF,ICB,ICO,JPG,JPEG,PBM,PCD,PCX,PGM,PNG,PPM,PSD,PSP,RLE,SGI,TGA,TIF"}
            ]
        },
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
                 $("#addresource").modal("show");
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $("#addresource").modal("hide");
                $scope.loadImage();
                $("#fsUploadProgress").html("");
                //$('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                var tempObj = new Object();
                tempObj.url = $('#domain').val() + JSON.parse(info).hash +"/" + file.name;
                tempObj.title = file.name;
                tempObj.size = file.size;
                
                switch ($scope.resType) {
                case "image":
                    tempObj.type = "image"; 
                    break;
                case "voice":
                    tempObj.type = "voice"; 
                    break;
                case "video":
                    tempObj.type = "video"; 
                    break;
                default:
                    break;
                }
                $scope.addResListTemp.push(tempObj);
                $scope.$apply();
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    };
    var uploader = Qiniu.uploader(optionImg);
    //七牛上传图片文件 end

    uploader.bind('FileUploaded', function() {
    });
    $('#container').on(
        'dragenter',
        function(e) {
            e.preventDefault();
            $('#container').addClass('draging');
            e.stopPropagation();
        }
    ).on('drop', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragleave', function(e) {
        e.preventDefault();
        $('#container').removeClass('draging');
        e.stopPropagation();
    }).on('dragover', function(e) {
        e.preventDefault();
        $('#container').addClass('draging');
        e.stopPropagation();
    });



    $('#show_code').on('click', function() {
        $('#myModal-code').modal();
        $('pre code').each(function(i, e) {
            hljs.highlightBlock(e);
        });
    });


    $('body').on('click', 'table button.btn', function() {
        $(this).parents('tr').next().toggle();
    });


    var getRotate = function(url) {
        if (!url) {
            return 0;
        }
        var arr = url.split('/');
        for (var i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === 'rotate') {
                return parseInt(arr[i + 1], 10);
            }
        }
        return 0;
    };

    $('#myModal-img .modal-body-footer').find('a').on('click', function() {
        var img = $('#myModal-img').find('.modal-body img');
        var key = img.data('key');
        var oldUrl = img.attr('src');
        var originHeight = parseInt(img.data('h'), 10);
        var fopArr = [];
        var rotate = getRotate(oldUrl);
        if (!$(this).hasClass('no-disable-click')) {
            $(this).addClass('disabled').siblings().removeClass('disabled');
            if ($(this).data('imagemogr') !== 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': rotate,
                    'format': 'png'
                });
            }
        } else {
            $(this).siblings().removeClass('disabled');
            var imageMogr = $(this).data('imagemogr');
            if (imageMogr === 'left') {
                rotate = rotate - 90 < 0 ? rotate + 270 : rotate - 90;
            } else if (imageMogr === 'right') {
                rotate = rotate + 90 > 360 ? rotate - 270 : rotate + 90;
            }
            fopArr.push({
                'fop': 'imageMogr2',
                'auto-orient': true,
                'strip': true,
                'rotate': rotate,
                'format': 'png'
            });
        }

        $('#myModal-img .modal-body-footer').find('a.disabled').each(function() {

            var watermark = $(this).data('watermark');
            var imageView = $(this).data('imageview');
            var imageMogr = $(this).data('imagemogr');

            if (watermark) {
                fopArr.push({
                    fop: 'watermark',
                    mode: 1,
                    image: 'http://www.b1.qiniudn.com/images/logo-2.png',
                    dissolve: 100,
                    gravity: watermark,
                    dx: 100,
                    dy: 100
                });
            }

            if (imageView) {
                var height;
                switch (imageView) {
                    case 'large':
                        height = originHeight;
                        break;
                    case 'middle':
                        height = originHeight * 0.5;
                        break;
                    case 'small':
                        height = originHeight * 0.1;
                        break;
                    default:
                        height = originHeight;
                        break;
                }
                fopArr.push({
                    fop: 'imageView2',
                    mode: 3,
                    h: parseInt(height, 10),
                    q: 100,
                    format: 'png'
                });
            }

            if (imageMogr === 'no-rotate') {
                fopArr.push({
                    'fop': 'imageMogr2',
                    'auto-orient': true,
                    'strip': true,
                    'rotate': 0,
                    'format': 'png'
                });
            }
        });

        var newUrl = Qiniu.pipeline(fopArr, key);

        var newImg = new Image();
        img.attr('src', 'images/loading.gif');
        newImg.onload = function() {
            img.attr('src', newUrl);
            img.parent('a').attr('href', newUrl);
        };
        newImg.src = newUrl;
        return false;
    });
    //七牛上传文件js end
    */
   
    //上传图片 start
    $scope.loadImage = function(){
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/save/"+ appId +"/multimedia",
            data:{"mediaType":$scope.resType,"liststr":JSON.stringify($scope.addResListTemp)},
            method: "GET",
            success: function(data) {
                data = dataParse(data);
					if(data.code == 0){
                    if(data.result && data.result.length > 0){
                        $scope.loadResourceListFunc(data.result,loadpre);
                    }
                }else if(data && data.code == 2){
                    goIndex();
                }
                //将新添加的文件加入到addResListTemp
                $scope.addResListTemp = [];
                $scope.$apply();
            }
        });
    }
  //上传图片 end
    
    //加载新的资源对象 start
    $scope.loadResourceListFunc = function(resourceList,order){
        if(resourceList && resourceList.length ){
            switch ($scope.resType) {
            case "image":
                if(!$scope.resImgList){
                    $scope.resImgList = resourceList;
                }else{
                    for(var i in resourceList){
                        if(order == loadpre){
                            $scope.resImgList.unshift(resourceList[i]);
                        }else if(order == loadnext){
                            $scope.resImgList.push(resourceList[i]);
                        }
                    }
                }
                break;
            case "voice":
                if(!$scope.resVoiceList){
                    $scope.resVoiceList = resourceList;
                }else{
                    for(var i in resourceList){
                        if(order == loadpre){
                            $scope.resVoiceList.unshift(resourceList[i]);
                        }else if(order == loadnext){
                            $scope.resVoiceList.push(resourceList[i]);
                        }
                    }
                }
                break;
            case "video":
                if(!$scope.resVideoList){
                    $scope.resVideoList = resourceList;
                }else{
                    for(var i in resourceList){
                        if(order == loadpre){
                            $scope.resVideoList.unshift(resourceList[i]);
                        }else if(order == loadnext){
                            $scope.resVideoList.push(resourceList[i]);
                        }
                    }
                }
                break;
            }
            $scope.$apply();
        }
    }
    //加载新的资源对象 end
    
    //查询多媒体文件列表 start
    $scope.loadResourceFunc = function(beforeTime,size,loadResourceListFunc){
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
            data:{"type":$scope.resType,"beforeTime":beforeTime,"size":size},
            method: "GET",
            success: function(data){
                data = dataParse(data);
					if(data.code == 0){
                    if(data.result){
                        if(loadResourceListFunc){
                            loadResourceListFunc(data.result,loadpre);
                        }
                    }
                }else if(data && data.code == 2){
                    goIndex();
                }
            }
        });
    }
   //查询多媒体文件列表 end
   
   //加载图片列表 start
    $scope.loadResourceFunc(0,20,$scope.loadResourceListFunc);
   //加载图片列表 end
    
    //图片分页 start
    var $imgLoadMoreBox = true;
    $("[data-act=image-box]").on("scroll",function(e){
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $imgLoadMoreBox == true ) {
            $imgLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
                data:{"type":$scope.resType,"beforeTime":$scope.resImgList[$scope.resImgList.length -1].createTime,"size":pageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        if(data.result && data.result.length > 0){
                            $scope.loadResourceListFunc(data.result, loadnext);
                            $imgLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $imgLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    //图片分页 end
    
    //删除
    var deleteResourceFunc = function(resourceListId){
        var resListStr = "";
        for(var i in resourceListId){
            resListStr += resourceListId[i]+",";
        }
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/delete/"+ appId +"/multimedia",
            data:{"listid":resListStr},
            method: "GET",
            success: function(data) {
                data = dataParse(data);
					if(data.code == 0){
                    for(var i in resourceListId){
                        if($scope.resType == "image"){
                            for(var j in $scope.resImgList){
                                if(resourceListId[i] == $scope.resImgList[j].id){
                                    $scope.resImgList.splice(j,1);
                                }
                            }
                        }else if($scope.resType == "voice"){
                            for(var j in $scope.resVoiceList){
                                if(resourceListId[i] == $scope.resVoiceList[j].id){
                                    $scope.resVoiceList.splice(j,1);
                                }
                            }
                        }else if($scope.resType == "video"){
                            for(var j in $scope.resVideoList){
                                if(resourceListId[i] == $scope.resVideoList[j].id){
                                    $scope.resVideoList.splice(j,1);
                                }
                            }
                        }
                    }
                    $scope.$apply();
                }else if(data.code == 2){
                    goIndex();
                }else{
                    if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                }
            }
        });
    }
    
    //图文消息分页 end
    
    //删除图片 start
    $("body").off("click",".image-operation .delete").on("click",".image-operation .delete",function(event){
        var $this = $(this);
        var id = $this.closest(".image-operation").attr("data-id");
        var title = $this.closest(".image-operation").attr("data-title");
        $.confirm({
            "text": '你确定要删除"'+ title +'"吗？',
            "title": "删除",
            "ensureFn": function() {
                var resourceListId = [id];
                deleteResourceFunc(resourceListId);
            }
        });
    });
    //删除图片 end
    
    //编辑 start
    $("body").off("click",".image-operation .edit").on("click",".image-operation .edit",function(event){
        var $this = $(this);
        var id = $this.closest(".image-operation").attr("data-id");
        var title = $this.closest(".image-operation").attr("data-title");
        $("#updateResource").modal("show");
        $("[data-act=resource-name]").val(title);
        $("[data-act=resource-id]").val(id);
    });
    //编辑 end
    
    $("body").off("keydown","[data-act=resource-name]").on("keydown","[data-act=resource-name]",function(event){
        var $this = $(this);
        if(event.keyCode == 13){
            $("[data-act=submit-rename-resource]").trigger("click");
        }
    });
    
    $('#updateResource').on('shown.bs.modal', function () {
        $("[data-act=resource-name]").focus();
    });
    
    $("body").off("click","[data-act=submit-rename-resource]").on("click","[data-act=submit-rename-resource]",function(event){
        var $resourceNmae = $("[data-act=resource-name]");
        var $resourceId = $("[data-act=resource-id]");
        if($.trim($resourceNmae.val()).length == 0){
            $.trace("资源名称不能为空");
        }
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/update/"+ appId +"/multimedia",
            data:{"id":$resourceId.val() ,"name":$resourceNmae.val()},
            method: "GET",
            success: function(data) {
                data = dataParse(data);
					if(data.code == 0){
                    if($scope.resType == "image"){
                        for(var i in $scope.resImgList){
                            if(data.result && $scope.resImgList[i].id == data.result.id){
                                $scope.resImgList[i] = data.result;
                                break;
                            }
                        }
                    }else if($scope.resType == "voice"){
                        for(var i in $scope.resVoiceList){
                            if(data.result && $scope.resVoiceList[i].id == data.result.id){
                                $scope.resVoiceList[i] = data.result;
                                break;
                            }
                        }
                    }else if($scope.resType == "video"){
                        for(var i in $scope.resVideoList){
                            if(data.result && $scope.resVideoList[i].id == data.result.id){
                                $scope.resVideoList[i] = data.result;
                                break;
                            }
                        }
                    }
                    $scope.$apply();
                    $.trace("素材名称修改成功","success");
                    $("#updateResource").modal("hide");
                }else if(data.code == 2){
                    goIndex();
                }else{
                    if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                }
            }
        });
    });
    
    //图片选中
    $("body").off("click","[data-act=img-box-active]").on("click","[data-act=img-box-active]",function(event){
        var $this = $(this);
        var $image_box_li = $this.parent(".image-box-li");
        var id = $image_box_li.attr("data-id");
        for(var i in $scope.resImgList){
            if($scope.resImgList[i].id == id){
                if($scope.resImgList[i].active){
                    $scope.resImgList[i].active = false;
                }else{
                    $scope.resImgList[i].active = true;
                }
            }else{
                $scope.resImgList[i].active = false;
            }
        }
        $scope.$apply();
    });
    
    //图片全选，反选
    $("body").off("click","[data-act=all-choose]").on("click","[data-act=all-choose]",function(event){
        var $this = $(this);
        var $checkbox = $this.find("input");
        if($scope.resType == "image"){
            if($checkbox.is(':checked')){
                for(var i in $scope.resImgList){
                    $scope.resImgList[i].active = true;
                }
            }else{
                for(var i in $scope.resImgList){
                    $scope.resImgList[i].active = false;
                }
            }
        }else if($scope.resType == "voice"){
            if($checkbox.is(':checked')){
                for(var i in $scope.resVoiceList){
                    $scope.resVoiceList[i].active = true;
                }
            }else{
                for(var i in $scope.resVoiceList){
                    $scope.resVoiceList[i].active = false;
                }
            }
        }else if($scope.resType == "video"){
            if($checkbox.is(':checked')){
                for(var i in $scope.resVideoList){
                    $scope.resVideoList[i].active = true;
                }
            }else{
                for(var i in $scope.resVideoList){
                    $scope.resVideoList[i].active = false;
                }
            }
        }
        $scope.$apply();
    });
    
    //批量删除
    $("body").off("click","[data-act=all-delete]").on("click","[data-act=all-delete]",function(event){
        $.confirm({
            "text": '你确定要批量删除所选素材吗？',
            "title": "删除",
            "ensureFn": function() {
                var $this = $(this);
                var checkedCount = 0;
                var resourceIdList = [];
                if($scope.resType == "image"){
                    for(var i in $scope.resImgList){
                        if($scope.resImgList[i].active){
                            resourceIdList.push($scope.resImgList[i].id);
                            checkedCount++;
                        }
                    }
                }else if($scope.resType == "voice"){
                    for(var i in $scope.resVoiceList){
                        if($scope.resVoiceList[i].active){
                            resourceIdList.push($scope.resVoiceList[i].id);
                            checkedCount++;
                        }
                    }
                }else if($scope.resType == "video"){
                    for(var i in $scope.resVideoList){
                        if($scope.resVideoList[i].active){
                            resourceIdList.push($scope.resVideoList[i].id);
                            checkedCount++;
                        }
                    }
                }
                if(checkedCount == 0){
                    $.trace("你未选择要删除的素材");
                }else{
                    deleteResourceFunc(resourceIdList);
                }
            }
        });
    });
    /*七牛上传图片相关代码 end*/
    
    /*上传音频相关代码 start*/
    /*
    var QiniuVoice = new QiniuJsSDK();
  //七牛上传图片文件 start
    var optionVoice = {
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfilesVoice',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        //uptoken: $('#uptoken_url').val(),
        uptoken_url:ruyiai_host + "/ruyi-ai/getuptoken",
        domain: $('#domain').val(),
        get_new_uptoken: false,
        save_key: true,
        filters : {
             mime_types: [
                      {title : "Voice files", extensions : "MP3,AAC,WAV,WMA,CDA,FLAC,M4A,MID,MKA,MP2,MPA,MPC,APE,OFR,OGG,RA,WV,TTA,AC3,DTS"}
             ]
        },
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
                $("#addresource").modal("show");
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $("#addresource").modal("hide");
                $scope.loadImage();
                $("#fsUploadProgress").html("");
                //$('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                var tempObj = new Object();
                tempObj.url = $('#domain').val() + JSON.parse(info).hash +"/" + file.name;
                tempObj.title = file.name;
                tempObj.size = file.size;
                
                switch ($scope.resType) {
                case "image":
                    tempObj.type = "image"; 
                    break;
                case "voice":
                    tempObj.type = "voice"; 
                    break;
                case "video":
                    tempObj.type = "video"; 
                    break;
                default:
                    break;
                }
                $scope.addResListTemp.push(tempObj);
                $scope.$apply();
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    };
    var uploaderVoice = QiniuVoice.uploader(optionVoice);
    */
    
    /*上传音频相关代码 start*/
    /*
    var QiniuVideo = new QiniuJsSDK();
  //七牛上传图片文件 start
    var optionVideo = {
        runtimes: 'html5,flash,html4',
        browse_button: 'pickfilesVideo',
        container: 'container',
        drop_element: 'container',
        max_file_size: '1000mb',
        flash_swf_url: 'bower_components/plupload/js/Moxie.swf',
        dragdrop: true,
        chunk_size: '4mb',
        multi_selection: !(mOxie.Env.OS.toLowerCase()==="ios"),
        //uptoken: $('#uptoken_url').val(),
        uptoken_url:ruyiai_host + "/ruyi-ai/getuptoken",
        domain: $('#domain').val(),
        get_new_uptoken: false,
        save_key: true,
        filters : {
             mime_types: [
                      {title : "video files", extensions : "avi,rmvb,rm,asf,divx,mpg,mpeg,mpe,wmv,mp4,mkv,vob"}
             ]
        },
        auto_start: true,
        log_level: 5,
        init: {
            'FilesAdded': function(up, files) {
                $("#addresource").modal("show");
                $('table').show();
                $('#success').hide();
                plupload.each(files, function(file) {
                    var progress = new FileProgress(file, 'fsUploadProgress');
                    progress.setStatus("等待...");
                    progress.bindUploadCancel(up);
                });
            },
            'BeforeUpload': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                if (up.runtime === 'html5' && chunk_size) {
                    progress.setChunkProgess(chunk_size);
                }
            },
            'UploadProgress': function(up, file) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                var chunk_size = plupload.parseSize(this.getOption('chunk_size'));
                progress.setProgress(file.percent + "%", file.speed, chunk_size);
            },
            'UploadComplete': function() {
                $("#addresource").modal("hide");
                $scope.loadImage();
                $("#fsUploadProgress").html("");
                //$('#success').show();
            },
            'FileUploaded': function(up, file, info) {
                var progress = new FileProgress(file, 'fsUploadProgress');
                progress.setComplete(up, info);
                var tempObj = new Object();
                tempObj.url = $('#domain').val() + JSON.parse(info).hash +"/" + file.name;
                tempObj.title = file.name;
                tempObj.size = file.size;
                
                switch ($scope.resType) {
                case "image":
                    tempObj.type = "image"; 
                    break;
                case "voice":
                    tempObj.type = "voice"; 
                    break;
                case "video":
                    tempObj.type = "video"; 
                    break;
                default:
                    break;
                }
                $scope.addResListTemp.push(tempObj);
                $scope.$apply();
            },
            'Error': function(up, err, errTip) {
                $('table').show();
                var progress = new FileProgress(err.file, 'fsUploadProgress');
                progress.setError();
                progress.setStatus(errTip);
            }
                // ,
                // 'Key': function(up, file) {
                //     var key = "";
                //     // do something with key
                //     return key
                // }
        }
    };
    var uploaderVideo = QiniuVideo.uploader(optionVideo);
    //视频相关上传代码 end
    */
    
  //音频分页 start
    var $voiceLoadMoreBox = true;
    $("[data-act=voice-box]").on("scroll",function(e){
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $voiceLoadMoreBox == true ) {
            $voiceLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
                data:{"type":$scope.resType,"beforeTime":$scope.resVoiceList[$scope.resVoiceList.length -1].createTime,"size":pageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        if(data.result && data.result.length > 0){
                            $scope.loadResourceListFunc(data.result, loadnext);
                            $voiceLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $voiceLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    //图片分页 end
    /*上传音频相关代码 end*/
    
    //视频分页 start
    var $videoLoadMoreBox = true;
    $("[data-act=video-box]").on("scroll",function(e){
        var $this = $(this);
        var scrollTopsize = $this[0].scrollTop;
        var scrollHeightsize = $this[0].scrollHeight;
        var board_boxsize = $this.height();
        if (scrollTopsize >= (scrollHeightsize - board_boxsize - 45) && $videoLoadMoreBox == true ) {
            $videoLoadMoreBox = false;
            $.ajax({
                url: ruyiai_host + "/ruyi-ai/query/"+ appId +"/list",
                data:{"type":$scope.resType,"beforeTime":$scope.resVideoList[$scope.resVideoList.length -1].createTime,"size":pageSize},
                method: "GET",
                success: function(data) {
                    data = dataParse(data);
					if(data.code == 0){
                        if(data.result && data.result.length > 0){
                            $scope.loadResourceListFunc(data.result, loadnext);
                            $imgLoadMoreBox = true;
                            $scope.$apply();
                        }else{
                            $imgLoadMoreBox = false;
                        }
                    }else if(data.code == 2){
                        goIndex();
                    }else{
                        if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                    }
                }
            });
        }
    })
    /*上传视频相关代码 end*/
    
    //删除音频 start
    $("body").off("click","#voice .delete,#video .delete").on("click","#voice .delete,#video .delete",function(event){
        var $this = $(this);
        var id = $this.closest("tr").attr("data-id");
        var title = $this.closest("tr").attr("data-title");
        $.confirm({
            "text": '你确定要删除"'+ title +'"吗？',
            "title": "删除",
            "ensureFn": function() {
                var resourceListId = [id];
                deleteResourceFunc(resourceListId);
            }
        });
    });
    //删除音频 end
    
    //编辑音频 start
    $("body").off("click","#voice .edit,#video .edit").on("click","#voice .edit,#video .edit",function(event){
        var $this = $(this);
        var id = $this.closest("tr").attr("data-id");
        var title = $this.closest("tr").attr("data-title");
        $("#updateResource").modal("show");
        $("[data-act=resource-name]").val(title);
        $("[data-act=resource-id]").val(id);
    });
    //编辑音频 end
    
    //音频单选 start
    $("body").off("click","[name=local-choosed-voice]").on("click","[name=local-choosed-voice]",function(event){
        
    });
    //音频单选 end
    
    //设置
    $scope.localResourceSetFunc = function(parentIndex, index){
        $scope.currentWechatParentIndex = parentIndex;
        $scope.currentWechatIndex = index;
        $("#localResourceModal").modal("show");
        if(parentIndex != -1){
        var output = $scope.localOutouts[parentIndex][index];
            switch(output.type){
                case "image": $("#customize-image-chosen").trigger("click"); 
                                     $("#customize-image-name").val(output.property.name);
                                     $("#customize-image-url").val(output.property.image_url);
                break;
                case "voice": $("#customize-voice-chosen").trigger("click"); 
                                     $("#customize-voice-name").val(output.property.name);
                                     $("#customize-voice-url").val(output.property.voice_url);
                break;
                case "video": $("#customize-video-chosen").trigger("click"); 
                                     $("#customize-video-name").val(output.property.name);
                                     $("#customize-video-url").val(output.property.video_url);
                break;
            }
        }else{
            $("#localResourceModal #myTab-local").children().eq(0).children("a").trigger("click");
            resetCustomize();
        }
        setTimeout(function(){
            initStyle();
        }, 200);
    }
    /**硬件多媒体资源管理 end*****/
    
    //根据id查找资源查找对象
    var findResourceObjectById = function(resourceList, id){
        for(var i in resourceList){
            if(resourceList[i].id == id){
                return resourceList[i];
            }
        }
    }
    
    //根据active查找资源对象
    var findResourceObjectByActive = function(resourceList){
        for(var i in resourceList){
            if(resourceList[i].active){
                return resourceList[i];
            }
        }
    }
    
    //微信创建或者更新多媒体列表 start
    var createOrUpdateOutputsWechatFunc = function(outputObj){
        var flag = false;
        for(var i in $scope.wechatOutputs){
            if(!flag){
                for(var j in $scope.wechatOutputs[i]){
                    if(i == $scope.currentWechatParentIndex && j == $scope.currentWechatIndex){
                        flag = true;
                        if(!$scope.wechatOutputs[i]){
                            $scope.wechatOutputs[i] = [];
                        }
                        $scope.wechatOutputs[i][j] = outputObj;
                        break;
                    }
                }
            }
        }
        if(!flag){
            if(!$scope.wechatOutputs[$scope.currentWechatIndex]){
                $scope.wechatOutputs[$scope.currentWechatIndex] = [];
            }
            $scope.wechatOutputs[$scope.currentWechatIndex].push(outputObj);
        }
        $scope.$apply();
    }
    //微信创建或者更新多媒体列表 end
    
    //硬件创建或者更新多媒体列表 start
    var createOrUpdateOutputsLocalFunc = function(outputObj){
        var flag = false;
        for(var i in $scope.localOutouts){
            if(!flag){
                for(var j in $scope.localOutouts[i]){
                    if(i == $scope.currentWechatParentIndex && j == $scope.currentWechatIndex){
                        flag = true;
                        if(!$scope.localOutouts[i]){
                            $scope.localOutouts[i] = [];
                        }
                        $scope.localOutouts[i][j] = outputObj;
                        break;
                    }
                }
            }
        }
        if(!flag){
            if(!$scope.localOutouts[$scope.currentWechatIndex]){
                $scope.localOutouts[$scope.currentWechatIndex] = [];
            }
            $scope.localOutouts[$scope.currentWechatIndex].push(outputObj);
        }
        $scope.$apply();
    }
    //硬件创建或者更新多媒体列表 end
    
    //选择硬件素材提交
    $scope.localResourceSubFunc = function(){
        var $choosed = $(".choose-response.active");
        var type = $choosed.attr("data-type");
        var choosedObject = {};
        var outputObj = {};
        if(type == "image"){
            dataEditedFlag = true;
            choosedObject = findResourceObjectByActive($scope.resImgList);
            outputObj = createOutputObjectFunc(choosedObject.type,choosedObject.title,choosedObject.url,"");
        }else if($scope.resType == "voice"){
            //获得id
            dataEditedFlag = true;
            var $choosedObj = $("[name=local-choosed-voice]:checked");
            var tr = $choosedObj.closest("tr");
            choosedObject = findResourceObjectById($scope.resVoiceList, tr.attr("data-id"));
            outputObj = createOutputObjectFunc(choosedObject.type,choosedObject.title,choosedObject.url,"");
        }else if(type == "video"){
            dataEditedFlag = true;
            var $choosedObj = $("[name=local-choosed-video]:checked");
            var tr = $choosedObj.closest("tr");
            choosedObject = findResourceObjectById($scope.resVideoList, tr.attr("data-id"));
            outputObj = createOutputObjectFunc(choosedObject.type,choosedObject.title,choosedObject.url,"");
        }else if(type == "customize"){
            dataEditedFlag = true;
            var $checkedId = $("#customize .video-box .customize-body .active");
            var id = $checkedId.attr("id");
            if(id == "customize-image-detail"){
                var name = $("#customize-image-name").val();
                var url = $("#customize-image-url").val();
                outputObj = createOutputObjectFunc("image",name,url,"");
            }else if(id == "customize-voice-detail"){
                var name = $("#customize-voice-name").val();
                var url = $("#customize-voice-url").val();
                outputObj = createOutputObjectFunc("voice",name,url,"");
            }else if(id == "customize-video-detail"){
                var name = $("#customize-video-name").val();
                var url = $("#customize-video-url").val();
                outputObj = createOutputObjectFunc("video",name,url,"");
            }
        }
//      outputObj = createOutputObjectFunc(choosedObject.type,choosedObject.title,choosedObject.url,"");
        createOrUpdateOutputsLocalFunc(outputObj);//创建或者更新多媒体列表
        //将选中的数据进行构建，在页面上渲染
        $("#localResourceModal").modal("hide");
    }
    
    //点击折叠助理答
    $("body").off("click",".response-action").on("click",".response-action",function(e){
        e.stopPropagation();
        var $this = $(this);
        var $responseGroup = $this.closest(".response-group").find(".response-box");
        if($responseGroup.css("height") == "0px"){
            $responseGroup.animate({height:"100%"});
        }else{
            $responseGroup.animate({height:"0"});
        }
    });
    
    //创建对象 start
    var createOutputObjectFunc = function(type,textName,url,media_id,description,list){
        var outputObject = new Object();
        outputObject.type = type;
        outputObject.property = new Object();
        switch (type) {
            case "dialog":
                outputObject.property.text = textName;
                break;
            case "wechat.text":
                outputObject.property.text = textName;
                break;
            case "image":
                outputObject.property.name = textName;
                outputObject.property.image_url = url;
                break;
            case "wechat.image":
                outputObject.property.name = textName;
                outputObject.property.title = textName;
                outputObject.property.media_id = media_id;
                outputObject.property.image_url = url;
                break;
            case "voice":
                outputObject.property.name = textName;
                outputObject.property.voice_url = url;
                break;
            case "wechat.voice":
                outputObject.property.name = textName;
                outputObject.property.title = textName;
                outputObject.property.media_id = media_id;
                break;
            case "video":
                outputObject.property.name = textName;
                outputObject.property.video_url = url;
                break;
            case "wechat.video":
                outputObject.property.name = textName;
                outputObject.property.title = textName;
                outputObject.property.media_id = media_id;
                break;
            case "wechat.news":
                //outputObject.property = property;
                if(list && list.length > 0){
                    outputObject.list = list;
                    outputObject.property.name = list[0].title;
                }else{
                    outputObject.property.name = textName;
                    outputObject.property.title = textName;
                    outputObject.property.media_id = media_id;
                }
                break;
            case "wechat.music":
                outputObject.property.name = textName;
                outputObject.property.title = textName;
                outputObject.property.music_url = url;
                outputObject.property.description = description;
                break;
        }
        return outputObject;
    }
    //创建对象 end
    
    //判断dialog对象是否已经存在
    var checkDialogObjectExists = function(output, text, type){
        var flag = false;
        if(output){
            for(var i in output){
                if(output[i]){
                    if(output[i].property.text == text && output[i].type == type){
                        flag = true;
                        break;
                    }
                }
            }
        }
        return flag;
    }
    
    //微信文本框光标离开，添加文本内容 start
    $scope.addTextOutputWechatFunc = function($event,outputText,parentIndex,index,type){
        if(checkIsChangeValue != outputText){
            dataEditedFlag = true;
        }
        //如果超出了长度限制
//      if(outputText.indexOf("sys.template.javascript") == -1 && outputText.indexOf("sys.template.mustache") == -1 && lengthCheckFunc(outputText, 2000)){
//          $.trace("机器人答长度最多为2000个字节");
//          return false;
//      }
        if(!outputText || $.trim(outputText).length <= 0){
            return false;
        }
        setTimeout(function(){
            var outputObj = createOutputObjectFunc(type,outputText,"","");
            var flag = false;
            for(var i in $scope.wechatOutputs){
                if(!flag){
                    for(var j in $scope.wechatOutputs[i]){
                        if(i == parentIndex && j == index){
                            flag = true;
                            if(!$scope.wechatOutputs[i]){
                                $scope.wechatOutputs[i] = [];
                            }
                            $scope.wechatOutputs[i][j] = outputObj;
                            break;
                        }
                    }
                }
            }
            if(!flag){
                if(!$scope.wechatOutputs[index]){
                    $scope.wechatOutputs[index] = [];
                }
                if(!checkDialogObjectExists($scope.wechatOutputs[index], outputText,type)){
                    $scope.wechatOutputs[index].push(outputObj);
                    $("[data-act=outputText]").val("");
                }else if($("[data-act=outputText]").val() && $("[data-act=outputText]").val().length > 0){
                    $.trace("此机器人答已经存在，重复的只会保留一条");
                }
            }
            $scope.$apply();
            $('[data-toggle="tooltip"]').tooltip(); //初始化提示
        }, 200);
    }
    //微信文本框光标离开，添加文本内容 end
    var deleteEmptyAssistantAnswerFunc = function(outouts,outputText,parentIndex,index){
        for(var i in outouts){
            for(var j in outouts[i]){
                if(i == parentIndex && j == index){
                    outouts[i].splice(i,1);
                    return;
                }
            }
        }
    }
    
    //硬件文本框光标离开，添加文本内容 start
    $scope.addTextOutputLocalFunc = function($event,outputText,parentIndex,index,type){
        console.log("parentIndex:" + parentIndex);
        console.log("index:" + index);
        console.log("outputText:" + outputText);
        if(checkIsChangeValue != outputText){
            dataEditedFlag = true;
        }
        if(!outputText || $.trim(outputText).length <= 0){
            //删除空的助理答
            deleteEmptyAssistantAnswerFunc($scope.localOutouts,outputText,parentIndex,index);
            return false;
        }
        console.log("错了");
        setTimeout(function(){
            var outputObj = createOutputObjectFunc(type,outputText,"","");
            var flag = false;
            for(var i in $scope.localOutouts){
                if(!flag){
                    for(var j in $scope.localOutouts[i]){
                        if(i == parentIndex && j == index){
                            flag = true;
                            if(!$scope.localOutouts[i]){
                                $scope.localOutouts[i] = [];
                            }
                            $scope.localOutouts[i][j] = outputObj;
                            break;
                        }
                    }
                }
            }
            if(!flag){
                if(!$scope.localOutouts[index]){
                    $scope.localOutouts[index] = [];
                }
                if(!checkDialogObjectExists($scope.localOutouts[index], outputText,type)){
                    $scope.localOutouts[index].push(outputObj);
                    $("[data-act=outputText-local]").val("");
                }else if($("[data-act=outputText-local]").val() && $("[data-act=outputText-local]").val().length > 0){
                    $.trace("此机器人答已经存在，重复的只会保留一条");
                }
            }
            $scope.$apply();
            $('[data-toggle="tooltip"]').tooltip(); //初始化提示
        }, 200);
    }
    //硬件文本框光标离开，添加文本内容 end
    
    //微信回车添加文本回答 start
    $scope.addTextOutputWechatKeydownFunc = function($event,outputText,parentIndex,index,type){
        if($event.keyCode == 13){
            $scope.addTextOutputWechatFunc($event,outputText,parentIndex,index,type);
        }
    }
    //微信回车添加文本回答 end
    
    //硬件回车添加文本回答 start
    $scope.addTextOutputLocalKeydownFunc = function($event,outputText,parentIndex,index,type){
        if($event.keyCode == 13){
            $scope.addTextOutputLocalFunc($event,outputText,parentIndex,index,type);
        }
    }
    //硬件回车添加文本回答 end
    
    //微信删除文字回复 start
    $scope.deleteOutputWechatFunc = function(parentIndex,index){
        setTimeout(function(){
            dataEditedFlag = true;
            for(var i in $scope.wechatOutputs){
                for(var j in $scope.wechatOutputs[i]){
                    if(i == parentIndex && j == index){
                        $scope.wechatOutputs[i].splice(j,1);
                        break;
                    }
                }
            }
            $scope.$apply();
        }, 200);
    }
    //微信删除文字回复 end
    
    //硬件删除文字回复 start
    $scope.deleteOutputLocalFunc = function(parentIndex,index){
        setTimeout(function(){
            for(var i in $scope.localOutouts){
                for(var j in $scope.localOutouts[i]){
                    if(i == parentIndex && j == index){
                        $scope.localOutouts[i].splice(j,1);
                        dataEditedFlag = true;
                        break;
                    }
                }
            }
            $scope.$apply();
        }, 200);
    }
    //硬件删除文字回复 end
    
    //微信复制文字回复 end
    $scope.copyOutputWechatFunc = function(parentIndex,index){
        for(var i in $scope.wechatOutputs){
            for(var j in $scope.wechatOutputs[i]){
                if(i == parentIndex && j == index){
                    var object = $scope.wechatOutputs[i][j];
                    var objectTemp = {"type":"wechat.text","property":{"text": object.property.text + "(副本)"}};
                    $scope.wechatOutputs[i].push(objectTemp);
                    dataEditedFlag = true;
                    break;
                }
            }
        }
    }
    //微信复制文字回复 end
    
    //硬件复制文字回复 end
    $scope.copyOutputLocalFunc = function(parentIndex,index){
        for(var i in $scope.localOutouts){
            for(var j in $scope.localOutouts[i]){
                if(i == parentIndex && j == index){
                    var object = $scope.localOutouts[i][j];
                    var objectTemp = {"type":"wechat.text","property":{"text": object.property.text + "(副本)"}};
                    $scope.localOutouts[i].push(objectTemp);
                    dataEditedFlag = true;
                    break;
                }
            }
        }
    }
    //硬件复制文字回复 end
    
    //用户说多行编辑
    $scope.editUserSayTextarea = function(index){
        $("#editUserSayTextarea").modal("show");
        $("#userSayTextarea").attr("myIndex",index);
        $("#userSayTextarea").val($scope.intentDetail.templates[index]);
        setTimeout(function(){
            $("#userSayTextarea").focus();
        }, 200);
    }
    
    //确认用户说编辑start
    $scope.editUserSayTextareaSubmitFunc = function(){
        //jds
        var flag = false;
        var $textarea = $("#userSayTextarea");
        var editor_content_textarea = $textarea.val();
        var myIndex  = $textarea.attr("myIndex");
        if($scope.intentDetail.templates[myIndex] != $textarea.val()){
            dataEditedFlag = true;
        }
        $($scope.intentDetail.templates).each(function(index, ele) {
            if($.trim(editor_content_textarea) === $.trim(ele)){
                if(index != myIndex){
                    $.trace("此用户说已经存在，重复的只会保留一条");
                }
                $('[data-act=user-sys-update]').eq(myIndex).text(editor_content_textarea);
                flag = true;
            }
        });
        if(!flag){
            $scope.intentDetail.templates[myIndex] = editor_content_textarea;
        }
        $("#editUserSayTextarea").modal("hide");
    }
    //确认用户说编辑end
    
    //用于存放当前编辑的状态
    var assistantEditStatus = "isEmpty"; 
    
    //检测助理答，是空状态点击编辑，还是输入了值之后点击编辑
    var checkAssistantEditStatusFunc = function(assistantType){
        var content = "";
        $("[data-act="+assistantType+"]").each(function(){
            if($.trim($(this).val()).length > 0){
                content = $(this).val();
            }
        });
        if(content){
            assistantEditStatus = "notEmpty"; 
        }else{
            assistantEditStatus = "isEmpty"; 
        }
        return content;
    }
    
    //微信编辑文字回复 end
    $scope.editOutputWechatFunc = function(parentIndex,index){
        var outputTextWeixin = checkAssistantEditStatusFunc("outputText");
        $("#editWeixinTextarea").modal("show");
        var $weixinTextarea = $("#weixinTextarea");
        $weixinTextarea.attr("myIndex",index);
        $weixinTextarea.attr("parentIndex",parentIndex);
        if(index == -1){ //如果是新创建的时候，直接点编辑器
            $("#editor-iframe-box-wechat").html('<iframe id="editor-iframe-wechat" name="editor-iframe-wechat" width="718" height="570" frameborder="0" scrolling="yes" src="../console/editor.html"></iframe>');
            if(!outputTextWeixin || outputTextWeixin.length == 0){//如果助理答此时为空
                return false;
            }else{
                $weixinTextarea.val(outputTextWeixin);
                var editorWechatContentInterval = setInterval(function(){
                    try 
                    { 
                        $(window.frames["editor-iframe-wechat"].document).find("#editor_content_temp").val(outputTextWeixin);
                        if($(window.frames["editor-iframe-wechat"].document).find("#editor_content_temp").val().length > 0){
                            clearInterval(editorWechatContentInterval);
                        }
                    } 
                    catch (e){} 
                }, 20);
            }
        }else{
            $("#editor-iframe-box-wechat").html('<iframe id="editor-iframe-wechat" name="editor-iframe-wechat" width="718" height="570" frameborder="0" scrolling="yes" src="../console/editor.html"></iframe>');
            $weixinTextarea.val($scope.wechatOutputs[parentIndex][index].property.text);
            var editorWechatContentInterval = setInterval(function(){
                try 
                { 
                    $(window.frames["editor-iframe-wechat"].document).find("#editor_content_temp").val($scope.wechatOutputs[parentIndex][index].property.text);
                    if($(window.frames["editor-iframe-wechat"].document).find("#editor_content_temp").val().length > 0){
                        clearInterval(editorWechatContentInterval);
                    }
                } 
                catch (e){} 
            }, 20);
        }
    }
    //微信编辑文字回复 end
    
    //硬件编辑文字回复 end
    $scope.editOutputLocalFunc = function(parentIndex,index){
        var outputTextLocal = checkAssistantEditStatusFunc("outputText-local");
        console.log("outputTextLocal:" + outputTextLocal);
        $("#editLocalTextarea").modal("show");
        var $localTextarea = $("#localTextarea");
        $localTextarea.attr("myIndex",index);
        $localTextarea.attr("parentIndex",parentIndex);
        if(index == -1){ //如果是新创建的时候，直接点编辑器
            $("#editor-iframe-box-local").html('<iframe id="editor-iframe-local" name="editor-iframe-local" width="718" height="570" frameborder="0" scrolling="yes" src="../console/editor.html"></iframe>');
            if(!outputTextLocal || outputTextLocal.length == 0){//如果助理答此时为空
                return false;
            }else{
                $localTextarea.val(outputTextLocal);
                var editorLocalContentInterval = setInterval(function(){
                    try 
                    { 
                        $(window.frames["editor-iframe-local"].document).find("#editor_content_temp").val(outputTextLocal);
                        if($(window.frames["editor-iframe-local"].document).find("#editor_content_temp").val().length > 0){
                            clearInterval(editorLocalContentInterval);
                        }
                    } 
                    catch (e){} 
                }, 20);
            }
        }else{
            $("#editor-iframe-box-local").html('<iframe id="editor-iframe-local" name="editor-iframe-local" width="718" height="570" frameborder="0" scrolling="yes" src="../console/editor.html"></iframe>');
            $localTextarea.val($scope.localOutouts[parentIndex][index].property.text);
            var editorLocalContentInterval = setInterval(function(){
                try 
                { 
                    $(window.frames["editor-iframe-local"].document).find("#editor_content_temp").val($scope.localOutouts[parentIndex][index].property.text);
                    if($(window.frames["editor-iframe-local"].document).find("#editor_content_temp").val().length > 0){
                        clearInterval(editorLocalContentInterval);
                    }
                } 
                catch (e){} 
            }, 20);
        }
    }
    //硬件编辑文字回复 end
    
    //微信文本过滤器 start
    $scope.wechatTextFilter = function(outputObj){
        if(outputObj.type == "wechat.text"){
            return true;
        }else{
            return false;
        }
    }
    //微信文本过滤器 end
    
    //微信多媒体文件过滤器 start
    $scope.wechatMediaFilter = function(outputObj){
        if(outputObj.type.indexOf("wechat.") > -1 && outputObj.type != "wechat.text"){
            return true;
        }else{
            return false;
        }
    }
    //微信多媒体文件过滤器 end
    
    //添加更多回复 start
    $scope.addMoreResponseFunc = function(){
        var response_type = $("[data-act=response-type].active").find(".add-more-response section").attr("data-type");
        if(response_type == "wechat"){
            if(!$scope.wechatOutputs){
                $scope.wechatOutputs = [[]];
            }else{
                $scope.wechatOutputs.push([]);
            }
        }else if(response_type == "local"){
            if(!$scope.localOutouts){
                $scope.localOutouts = [[]];
            }else{
                $scope.localOutouts.push([]);
            }
        }
        setTimeout(function(){
            $("[data-act=response-type].active").find(".response-box:last").css("height","100%");
        }, 200);
    };
    //添加更多回复 end
    
    //删除block start
    $("body").off("click","[data-act=delete-response-block]").on("click","[data-act=delete-response-block]",function(e){
        var index = $(this).attr("data-index");
        var type = $(this).attr("data-type");
        index = +index;
        e.stopPropagation();
        $.confirm({
            "text": '你确定要删除吗？',
            "title": "删除",
            "ensureFn": function() {
                dataEditedFlag = true;
                if(type == "wechat"){
                    if($scope.wechatOutputs){
                        $scope.wechatOutputs.splice(index,1);
                    }
                }else if(type == "local"){
                    if($scope.localOutouts){
                        $scope.localOutouts.splice(index,1);
                    }
                }
                $scope.$apply();
            }
        });
    });
    //删除block end
    
    //确认微信编辑start
    $scope.editWeixinTextareaSubmitFunc = function(){
        //jds
        var flag = false;
        var $textarea = $("#weixinTextarea");
        var parentIndex= $textarea.attr("parentIndex");
        var myIndex  = $textarea.attr("myIndex");
        //获得编辑器中的内容
        var editor_content_textarea = $(window.frames["editor-iframe-wechat"].document).find("#editor_content_textarea").val();
        if(myIndex == -1 || myIndex == "-1"){
            var outputObj = createOutputObjectFunc("wechat.text",editor_content_textarea,"","");
            dataEditedFlag = true;
            if(assistantEditStatus == "isEmpty"){
                if(editor_content_textarea && $.trim(editor_content_textarea).length > 0){
                    $($scope.wechatOutputs[parentIndex]).each(function(index, ele) {
                        if($.trim(editor_content_textarea) === $.trim(ele.property.text)){
                            $.trace("此机器人答已经存在，重复的只会保留一条");
//                          $scope.isExits = true;
                            flag = true;
                        }
                    });
                    if(!flag){
                        $scope.wechatOutputs[parentIndex].push(outputObj);
                    }else {
                        $('.input-weixin').eq(myIndex).val(editor_content_textarea);
                    }
                }
            }else if(assistantEditStatus == "notEmpty"){
                console.log('not');
                $scope.wechatOutputs[parentIndex][$scope.wechatOutputs[parentIndex].length - 1] = outputObj;
            }
        }else{
            $textarea.val(editor_content_textarea);
            if($scope.wechatOutputs[parentIndex][myIndex].property.text != $textarea.val()){
                dataEditedFlag = true;
            }
            $($scope.wechatOutputs[parentIndex]).each(function(index, ele) {
                if(ele.property.text === editor_content_textarea){
                    $.trace("此机器人答已经存在，重复的只会保留一条");
                    $scope.isExits = true;
                }
            });
            $scope.wechatOutputs[parentIndex][myIndex].property.text = editor_content_textarea;
        }
        $("#editWeixinTextarea").modal("hide");
    }
    //确认微信编辑end
    
    //确认硬件编辑start
    $scope.editLocalTextareaSubmitFunc = function(){
        //jds
        var $textarea = $("#localTextarea");
        var parentIndex= $textarea.attr("parentIndex");
        var myIndex  = $textarea.attr("myIndex");
        //获得编辑器中的内容
        var editor_content_textarea = $(window.frames["editor-iframe-local"].document).find("#editor_content_textarea").val();
        
        if(myIndex == -1 || myIndex == "-1"){
                var outputObj = createOutputObjectFunc("dialog",editor_content_textarea,"","");
                dataEditedFlag = true;
                if(assistantEditStatus == "isEmpty"){
                    if(editor_content_textarea && editor_content_textarea.length > 0){
                        $($scope.localOutouts[parentIndex]).each(function(index, ele) {
                            if($.trim(editor_content_textarea) === $.trim(ele.property.text)){
                                $.trace("此机器人答已经存在，重复的只会保留一条");
                                $scope.isExits = true;
                            }
                        });
                        if(!$scope.isExits){
                            $scope.localOutouts[parentIndex].push(outputObj);
                        }else {
                            $('.input-local').eq(myIndex).val(editor_content_textarea);
                        }
                    }
                }else if(assistantEditStatus == "notEmpty"){
                    $scope.localOutouts[parentIndex][$scope.localOutouts[parentIndex].length - 1] = outputObj;
                }
        }else{
            $textarea.val(editor_content_textarea);
            if($scope.localOutouts[parentIndex][myIndex].property.text != $textarea.val()){
                dataEditedFlag = true;
            }
            $($scope.localOutouts[parentIndex]).each(function(index, ele) {
                if($.trim(ele.property.text) === $.trim(editor_content_textarea)){
                    $.trace("此机器人答已经存在，重复的只会保留一条");
                    $scope.isExits = true;
                }
            });
            $scope.localOutouts[parentIndex][myIndex].property.text = $textarea.val();
        }
        $("#editLocalTextarea").modal("hide");
    }
    //确认硬件编辑end
    
    //添加图文信息start
    $scope.addNewsFunc = function(){
        var $div = "<div class='customize-news clearfix' style='margin-top: 20px;'><div class='form-group' style='margin-bottom: 0;'>" +
                        "<div class='col-md-10  col-md-offset-1'>" +
                                "<label>名称：</label>" +
                                "<input autocomplete='off' style='border-radius: 0px; box-shadow: none; border-top: 1px solid rgba(0,0,0,0);border-right: 1px solid rgba(0,0,0,0);' type='text' required='required' class='form-control weixin-customize-news-name' placeholder='名称' /></div></div>" +                              
                        "<div class='form-group' style='margin-bottom: 0;'>" +
                            "<div class='col-md-10  col-md-offset-1'>" +
                                "<label>摘要：</label>" +
                                "<textarea style='border-radius: 0px; box-shadow: none; vertical-align: middle;border-right: 1px solid rgba(0,0,0,0);width:85%;max-width:85%;' required='required' class='form-control weixin-customize-news-abstract' placeholder='摘要'></textarea> </div></div>" +
                        "<div class='form-group' style='margin-bottom: 25px;'>" +
                            "<div class='col-md-10  col-md-offset-1'>" +
                                "<label>封面URL：</label>" +
                                "<input autocomplete='off' style='border-radius: 0px; box-shadow: none;border-right: 1px solid rgba(0,0,0,0);' type='text' required='required' class='form-control weixin-customize-news-url' placeholder='封面URL' /></div></div>" +
                        "<div class='form-group' style='margin-bottom: 25px;'>" +
                            "<div class='col-md-10  col-md-offset-1'>" +
                                "<label>跳转链接：</label>" +
                                "<input autocomplete='off' style='border-radius: 0px; box-shadow: none;border-right: 1px solid rgba(0,0,0,0);' type='text' required='required' class='form-control weixin-customize-news-jumpto' placeholder='跳转链接' /></div></div>" +
                        "<div class='form-group' style='margin-bottom: 25px;'><div class='col-md-10  col-md-offset-1'><div class='delete-customize-news'>&nbsp;</div></div></div></div>"        
        $("#weixin-customize-news-detail .customize-news-body").append($div);
        setTimeout(function(){
            $("#weixin-customize .customize-news-body").scrollTop($("#weixin-customize .customize-news-body")[0].scrollHeight);
        },0);
    }
    //添加图文信息end
    
    //删除图文信息start
    $("#weixin-customize-news-detail").delegate(".delete-customize-news","click",function(){
        var $this = $(this);
        $.confirm({
            "text": '你确定要删除此图文消息吗？',
            "title": "删除",
            "ensureFn": function() {
                $this.parents(".customize-news").remove();
            }
        });
    });
    //删除图文信息
    
    //检查字节长度
    function lengthCheckFunc(str, maxLen){
        var flag = false;
        var w = 0;  
        var tempCount = 0; 
        //length 获取字数数，不区分汉子和英文 
        for (var i=0; i<str.length; i++) {  
            //charCodeAt()获取字符串中某一个字符的编码 
            var c = str.charCodeAt(i);  
            //单字节加1  
            if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) {  
                w++;  
            } 
            else {    
                w+=2;  
            }  
            if (w > maxLen) {  
                flag = true;
                break; 
            }    
        }
        return flag;
    } 
    
    $(".speach-response .nav li").click(function(){
        setCookie("app_response",$(this).attr("class"));
    });
    
    
    //at 自动提示 start
    $("body").off("keyup",".user-says-input").on("keyup",".user-says-input",function(event){
        if(event.which == 50){
            var $this = $(this);
            setTimeout(function(){
                checkAt($this);
            }, 200);
        }
    });
    
    function checkAt( $obj ){
        if(window.getSelection){
            var selObj = window.getSelection();
            var selRange = selObj.getRangeAt(0);
            var $textContent = selObj.focusNode.textContent;
            var $startOffset = selRange.startOffset;
            if($textContent.substr($startOffset-1,1) == "@"){
                insertAt( $obj );
                isAtStatus = true;
            }
        }
    }
    
    //查询词典提示
    function insertAt($obj){
        $("body").find("span#prompt").remove();
        insertnode();
        insertMention($obj);
        var $mentionpopup = $(".mention-popup");
        $mentionpopup.find("input").focus();
        $obj.addClass("on");
        autoGetPrompt("");
        return false;   
    }
    
    function autoGetPrompt(inputVal){
        $.ajax({
          url: ruyiai_host + "/ruyi-ai/"+ appId +"/entity/list", 
          method:'get',
          cache: true,
          data:{"keywords":inputVal},
          success: function( data ) {
            data = dataParse(data);
					if(data.code == 0){
                var userEntity = data.result.userentity;
                var sysEntity = data.result.sysentity;
                var entityStr = "";
                //控制最多显示10条记录 start
                if(userEntity.length >= 10){
                    userEntity.length = 10;
                }
                sysEntity.length = 10 - userEntity.length;
                //控制最多显示10条记录 end
                for(var i in userEntity){
                    entityStr+="<li class='user-box-row'>"+ userEntity[i] +"</li>";
                }
                for(var i in sysEntity){
                    entityStr+="<li class='user-box-row'>"+ sysEntity[i] +"</li>";
                }
                $("body").find("div.user-box").html("<ul>"+ entityStr +"</ul>");
                defaultItem();
            }else if(data.code == 2){
                goIndex();
            }else{
                if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
            }
          }
        });
    }
    
    $("body").off("mouseover",".user-box-row").on("mouseover",".user-box-row",function(){       
        $(this).addClass("on").siblings(".user-box-row").removeClass("on");
    });
    
    $("body").off("click",".user-box-row").on("click",".user-box-row",function(event){      
        var $this = $(this);
        var $mentionInput = $this.closest(".user-box").siblings(".writing-bg").find("input");
        var $commentOn = $this.closest(".mention-popup").siblings(".user-says-input");
        choseFriend( $mentionInput, $commentOn, false);
        $this.closest(".mention-popup").remove();
        event.stopPropagation();
        return false;
    });
    
    function insertnode() {
        var selObj = window.getSelection();     
        var selRange = selObj.getRangeAt(0);
        var newNode = document.createElement("span");
        newNode.id = "prompt";
        selRange.insertNode(newNode);
        selRange.collapse(false);
    }
    //at 自动提示 end
    
    function insertMention($obj){
        var $mention = $('<div class="mention-popup">\
                        <div class="writing-bg">\
                        <input type="text" id="mention-input" placeholder="获取词典(Esc取消)" data-act="atShow"/>\
                        </div>\
                        <div class="user-box"></div>\
                      </div>');
        var _left = $("span#prompt").position().left + 2
        var popup_htight = $(".mention-popup").height() + 10;
        var _top = $("span#prompt").position().top - popup_htight + 10;
        $mention.css({"left":_left,"top":_top});
        if($(".mention-popup").length>0){
            $(".mention-popup").remove();
            isAtStatus = false;
        }
        $mention.insertAfter($obj);
        setTimeout(function(){
            defaultItem();
        }, 200);
    }
    
    //光标离开的时候，删除提示列表
    $("body").off("focusout","#mention-input").on("focusout","#mention-input",function(event){
        setTimeout(function(){
            $(".mention-popup").remove();
        },200);
    });
    
    //默认选中第一个
    function defaultItem(){
        if($("body").find(".user-box .user-box-row").length){
            $("body").find(".user-box .user-box-row").eq(0).addClass("on");
        }
    }
    
    $("body").off("keyup","#mention-input").on("keyup","#mention-input",function(event){
        var $this = $(this),
            $commentOn = $this.closest(".mention-popup").siblings(".user-says-input");
        if(event.keyCode == "27"){
            choseFriend( $this, $commentOn, true);
            $("body").find(".mention-popup").remove();
            return false;
        }else if(event.keyCode == "13"){
            if($this.closest(".mention-popup").find(".user-box-row.on").length){
                choseFriend( $this, $commentOn, false);
                $this.closest(".mention-popup").remove();
                return false;               
            }   
        }else if(event.keyCode == "38" && $this.closest(".mention-popup").find(".user-box-row.on").prev(".user-box-row").length ){
            var $on = $this.closest(".mention-popup").find(".user-box-row.on");
            $on.prev(".user-box-row").addClass("on").siblings(".user-box-row").removeClass("on");
            return false;
        }else if(event.keyCode == "40" && $this.closest(".mention-popup").find(".user-box-row.on").next(".user-box-row").length){
            var $on = $this.closest(".mention-popup").find(".user-box-row.on");
            $on.next(".user-box-row").addClass("on").siblings(".user-box-row").removeClass("on");
            return false;
        }else{
            autoGetPrompt($this.val());
        }
    });
    
    function choseFriend($this , $commentOn, flag){
        var $tempVal = "";
        var $tempType = "";
        var _text = "";
        if(flag){
            _text = $this.val();
        }else{
            _text = $(".user-box-row.on").text() + ":";
        }
        if(window.getSelection){
            $commentOn.focus();
            //var _atNode = document.getElementById("prompt").previousSibling;
            //_atNodeStr = _atNode.nodeValue;
            //_atNode.nodeValue = _atNodeStr.substring(0,_atNodeStr.length-1);
            $commentOn.find("span#prompt").before(_text);
            var selObj = window.getSelection();
            var selRange = document.createRange();  
            selRange.selectNode($commentOn.find("span#prompt").get(0));
            selObj.removeAllRanges();
            selObj.addRange(selRange);
            selRange.collapse(false);
            
            if(!flag){
                //冒号 start
                var selObj = window.getSelection();
                var selRange = selObj.getRangeAt(0);
                var $textContent = selObj.focusNode.textContent;
                var atIndex = $textContent.lastIndexOf("@");
                if(atIndex > -1){
                    $textContent = $textContent.substr(atIndex + 1,$textContent.length - 1);
                }
                var pointIndex = $textContent.indexOf(".",0);
                
                var alias = $textContent.substr(pointIndex + 1,$textContent.length - pointIndex - 2);
                for(var i = 0; i<= 20; i++){
                    if(i == 0){
                        if(aliasExitsFunc($commentOn.text(),alias)){
                            break;
                        }
                    }else{
                        if(aliasExitsFunc($commentOn.text(),alias + i)){
                            alias = "" + alias + i;
                            break;
                        }
                    }
                }
                alias = alias.replace(new RegExp(/\./g),"-");
                $commentOn.find("span#prompt").before(alias + "&nbsp;");
                var selObj = window.getSelection();
                var selRange = document.createRange();
                selRange.selectNode($commentOn.find("span#prompt").get(0));
                selObj.removeAllRanges();
                selObj.addRange(selRange);
                selRange.collapse(false);
                //冒号 end
            }
            $commentOn.find("span#prompt").remove();
            isAtStatus = false;
            
        }
        return false;   
    }
    
    //检查词典名称是否已经存在
    function aliasExitsFunc(text,alias){
        var userSysReg = eval("/:"+ alias +"/g");
        var paras = text.match(userSysReg);
        if(!paras || paras.length == 0){
            return true;
        }else{
            return false;
        }
    }
    
    $("body").off("click",".upload-resource-button").on("click",".upload-resource-button",function(event){
        $("#localResourceModal").modal("hide");
        setTimeout(function(){
            window.location.href = "#/resource";
        }, 500);
    });
    
    $("body").off("click","[data-act=action-list-trigger]").on("click","[data-act=action-list-trigger]",function(){
        var $this = $(this);
        var $myActionNameList = $(".my-action-name-list");
        if($myActionNameList.css("display") == "block"){
            $myActionNameList.css("display","none");
        }else{
            $myActionNameList.css("display","block");
        }
    });
    
    //查询所有触发器
    $scope.getActionListFunc = function(){
        $.ajax({
            url: ruyiai_host + "/ruyi-ai/action/query/list",
            data:{"appId": appId,"start":0,"limit":1000},
            method: "get",
            success: function(data){
                data = dataParse(data);
					if(data.code == 0){
                    $scope.actionList = data.result;
                    $scope.$apply();
                }else if(data.code == 2){
                    goIndex();
                }else{
                    if(data.msg){ $.trace(data.msg + "( "+ data.detail +" )","error"); }
                }
            }
        });
    }
    
    $("body").off("click",".my-action-name-list li").on("click",".my-action-name-list li",function(){
        var $this = $(this);
        $scope.response.action = $this.text();
        $scope.$apply();
        $(".my-action-name-list").css("display","none");
    });
    
    setTimeout(function(){
        $scope.getActionListFunc();
    }, 2000);
    
    //查看更多功能
    $("body").off("click",".intent-detail-more").on("click",".intent-detail-more",function(event){
        var $this = $(this);
        var $more = $(".intent-detail-more-box");
        if($more.css("display") == "block"){
            $more.css("display","none");
            $this.find("i").removeClass("icon-arrow-down").addClass("icon-arrow-right");
            if(supports_html5_storage()){
                localStorage.removeItem("intentDetailMore" + $stateParams.intent_id);
            }
        }else{
            $more.css("display","block");
            $this.find("i").removeClass("icon-arrow-right").addClass("icon-arrow-down");
            if(supports_html5_storage()){
                localStorage.setItem("intentDetailMore" + $stateParams.intent_id,"open");
            }
        }
    });
    
    //判断对话能力扩展是否展示
    function supports_html5_storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }
    if(supports_html5_storage()){
        if(localStorage.getItem("intentDetailMore" + $stateParams.intent_id) == "open"){
            $(".intent-detail-more-box").css("display","block");
            $(".intent-detail-more").find("i").removeClass("icon-arrow-right").addClass("icon-arrow-down");
        }
    }
    
    $scope.commonIntentDetailChange = function(){
        dataEditedFlag = true;
    }
    
//  $(document).click(function(event){
//      var $target = $(event.target);
//      if(!$target.is(".questions-answers-panel") && !$target.is(".questions-answers-panel .questions-answers-content")
//               && !$target.is(".questions-answers-panel .common-submit-button")
//               && !$target.is(".questions-answers-content .common-cancel-modal")){
//          $(".questions-answers-panel").fadeOut(500,function(e){
//              $(this).remove();
//          });
//      }
//    });

    setTimeout(function(){
        $('#timeoutSt').tooltip({
            'container': "body"
        });
    },0)


    // 进度条的实现
    
    var scale =function(input,yuan,jindu,tiao){
        this.input = document.getElementById(input);
        this.yuan = document.getElementById(yuan);
        this.jindu= document.getElementById(jindu);
        this.tiao= document.getElementById(tiao);
        this.tiaoW = this.tiao.offsetWidth;
        this.init()
    }
    scale.prototype ={
        init: function(){
            var isfalse =false, 
                f = this,
                m = Math,
                b = document.body,
                minValue = 0,
                maxValue = 5000;
            
            f.yuan.onmousedown =function(e){
                isfalse = true;
                var X = e.clientX;
                var offleft = this.offsetLeft;
                var max = f.tiao.offsetWidth - this.offsetWidth;

                b.onmousemove = function(e){
                    if (isfalse == false){
                        return;
                    }
                    var changeX = e.clientX;
                    var moveX = m.min(max,m.max(-2,offleft+(changeX-X)));
                    f.input.value = parseInt(m.max(0,moveX / max) * 5000) + ' ms';
                    let ttt = (parseFloat(f.input.value))/5100 * f.tiaoW +"px";
                    f.yuan.style.marginLeft = ttt;
                    f.jindu.style.width = parseInt(f.input.value)/5100 * f.tiaoW +"px";
                    $('#yuan').tooltip('hide');
                }
            }
            b.onmouseup =function(){
                isfalse =false;
                f.input.value = parseInt(f.input.value);
                f.input.value = f.input.value < minValue ? minValue : f.input.value;
                f.input.value = f.input.value > maxValue ? maxValue : f.input.value;
                f.input.value = parseInt(f.input.value) + ' ms';
                $('#yuan').attr('data-original-title',f.input.value);
                // $('#yuan').tooltip({
                //     title: 'f.input.value'
                // })
            }

            f.input.onblur =function(){
                var nowValue = parseInt(f.input.value);
                var theV = nowValue * 1;
                if(theV > maxValue){
                    f.input.value = maxValue + ' ms';
                }
                if(theV < minValue){
                    f.input.value = minValue + ' ms';
                }
                theV = parseInt(f.input.value);
                // NaN != NaN
                if(theV.toString() == 'NaN'){
                    theV = 1;
                    f.input.value = '1 ms';
                }
                var xxx = theV/5000 * f.tiaoW;
                $('#yuan').animate({'marginLeft': xxx + 'px'},'slow',function(){
                    $('#yuan').css({'marginLeft': xxx + 'px'});
                });
                $('#jindu').animate({'width': xxx + 'px'},'slow',function(){
                    $('#jindu').css({'width': xxx + 'px'});
                });
                $('#yuan').attr('data-original-title',f.input.value);
            }
            f.input.onkeypress = function(e){
                var code = e.keyCode;
                if(code == 13){
                    f.input.blur();
                    // f.input.focus();
                    f.input.value = parseInt(f.input.value) + ' ms';
                }
            }
            f.input.onkeydown = function(e){
                if(e.keyCode < 48 || e.keyCode > 57){
                    return;
                }
            }
        }
    }

    new scale("timeoutSt","yuan","jindu","tiao");

    // 按钮的实现

    $('.numberBtn').on('click','.plusNumber',function(){
        var v = parseInt($('#timeoutSt').val()) + 1;
        v = v > 5000 ? 5000 : v;
        $('#timeoutSt').val(v + ' ms');
        $('#timeoutSt').blur();
        if(!$(this).hasClass('active')){
            $('.numberBtn .active').removeClass('active');
            $(this).addClass('active')
        }
    })

    $('.numberBtn').on('click','.reduceNumber',function(){
        var v = parseInt($('#timeoutSt').val()) - 1;
        v = v <= 0 ? 1 : v;
        $('#timeoutSt').val(v + ' ms');
        $('#timeoutSt').blur();
        if(!$(this).hasClass('active')){
            $('.numberBtn .active').removeClass('active');
            $(this).addClass('active')
        }
    })
}









$(function() {

    $("body").off("keydown", "#login-password").on("keydown", "#login-password",
    function($event) {
        if ($event.keyCode == 13) {
            $(".login-btn-box button").trigger("click");
        }
    });

    $("body").keydown(function(event) {
        if (event.keyCode == 13) {
            $(".login-btn-box button").trigger("click");
        }
    });

    $("body").off("click", ".login-btn-box button").on("click", ".login-btn-box button",
    function($event) {
        var $this = $(this);
        var loginEmail = $("#login-email");
        var pattern = /^([\.a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
        if ($.trim(loginEmail.val()).length == 0) {
            $("[data-act=login-email] .error-tips").text("请输入邮箱");
            loginEmail.focus();
            return false;
        } else if (!pattern.test($.trim(loginEmail.val()))) {
            $("[data-act=login-email] .error-tips").text("请输入正确的邮箱地址");
            loginEmail.focus();
            return false;
        } else {
            $("[data-act=login-email] .error-tips").text("");
        }

        var loginPassword = $("#login-password");
        if ($.trim(loginPassword.val()).length == 0) {
            $("[data-act=login-password] .error-tips").text("请输入密码");
            loginPassword.focus();
            return false;
        } else if ($.trim(loginPassword.val()).length < 6) {
            $("[data-act=login-password] .error-tips").text("密码长度不足6位");
            loginPassword.focus();
            return false;
        } else {
            $("[data-act=login-password] .error-tips").text("");
        }

        $.urlParam = function(name) {
            var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
            return results[1] || 0;
        }

        $.ajax({
            url: api_host + "/v1/tickets",
            method: "POST",
            data: {
                "username": loginEmail.val(),
                'password': loginPassword.val()
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function(data, status, xhr) {
                var location = xhr.getResponseHeader("Location");
                var tgt = location.substring(location.lastIndexOf('/') + 1);

                var login_environment = "?type=prod_console";
                var api_host_temp = ruyiai_host;

                if (window.location.origin.indexOf("test.ruyi.ai") > -1) {
                    api_host_temp = "http://test.ruyi.ai:8080";
                    login_environment = "?type=local_console";
                } else if (window.location.href.indexOf("ruyiai-official/test") > -1) {
                    login_environment = "?type=testtest_console";
                } else if (window.location.origin.indexOf("lab.ruyi.ai") > -1) {
                    login_environment = "?type=test_console";
                } else {
                    if (window.location.origin.indexOf("https") > -1) {
                        location = location.replace("http", "https");
                    } else {
                        api_host_temp = api_host_temp.replace("http", "https");
                    }
                }

                if (localStorage.service == undefined) {
                    //////// 要修改成相对路径
                    localStorage.service = api_host_temp;
                }

                $.ajax({
                    url: location,
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: 'service=' + api_host_temp + '/ruyi-ai/request' + login_environment,
                    error: function(xhr, status, error) {
                        $("[data-act=login-email] .error-tips").text('账号或密码错误');
                    },
                    success: function(data, status, xhr) {
                    	alert();
                        // 跳转回未登录之前浏览的界面
                        localStorage.ruyi_tk = xhr.responseText;
                        setCookie('tgt', tgt);
                        setCookie('email', $('#login-email').val());
//                        window.location = api_host_temp + "/ruyi-ai/request" + login_environment + "&ticket=" + xhr.responseText;
                        // window.location = decodeURIComponent($.urlParam('service')) + '?ticket=' + xhr.responseText;
                        // window.location = decodeURIComponent($.urlParam('service')) + '?ticket=' + xhr.responseText;
                    }
                })
            },
            error: function(err) {
                $("[data-act=login-email] .error-tips").text('账号或密码错误');
            }
        });
    });
});

主项目的目录在ruyiai-official/www/ruyiai-official/html/ruyiai-official目录下：

1.base文件夹主要存放注册，登录，找回密码，修改密码等相关页面代码，这些页面是多页面应用

2.console文件夹主要存放通过机器人列表，进入某个机器人之后的机器人控制台的所有页面；

3.grunt主要是用来打包压缩css和js文件的，grunt文件夹下的Gruntfile.js中可以看出打包了哪些文件，要重新打包的话，切换到grunt文件加下，执行grunt命令即可打包

4.h5-wechat主要是存放推广链接页面

5.MP_verify和verify以及ruyiai-official下的MP_verify_开头的两个文件，是使用微信sdk用来做验证的；比较久了忘记为什么有三份了，不确定那份正确，暂不处理

6.official文件夹存放的是官网相关的代码

7.super-console存放的是超级后台相关代码

8.xiaomi-menu主要是豆果菜谱相关页面代码

9.xiaomi-ui-template存放小米其他模板页面

10.console文件夹中，api_manager.html是入口页面，api_manager.js是入口js,所有的angularJS路由和过滤器都是写在这个页面；

# OA小工具
## 作用：自动对收文提交意见
## 使用步骤
### 登录OA <https://211.156.194.132>，提示:使用域名psbcoa.com.cn可能报ERR_CERT_AUTHORITY_INVALID的错误；
### 浏览器设置中，打开开发者工具，IE快捷键F12，Chrome快捷键Command+ALt+I
### 在console中运行一下代码
`$("body").after('<script src="https://cdn.jsdelivr.net/gh/Allan-Mo/allanmo_resource@master/js/psbcoa_ui.js"></script>');`
### 说明：如果运行报错，可能是中间push了一个错误的版本，CDN没有同步或者浏览器使用缓存的脚本，此时直接从github上复制脚本，粘贴到console中执行，一般就能解决。
<https://github.com/Allan-Mo/allanmo_resource/blob/master/js/psbcoa_ui.js>
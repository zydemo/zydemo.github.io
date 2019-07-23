---
layout: post
title: word、xls、ppt文件在线预览功能
date: 2019-07-23 13:08:52 +0800
categories: HTML
tag: HTML操作
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190723130852_1.jpg' | prepend: site.baseurl }}){:height='80%' width='80%'} -->

word、ppt、xls文件实现在线预览的方式比较简单可以直接通过调用微软的在线预览功能实现 (预览前提：资源必须是公共可访问的)
具体文档看这[微软接口文档](https://link.jianshu.com/?t=https%3A%2F%2Fblogs.office.com%2Fen-us%2F2013%2F04%2F10%2Foffice-web-viewer-view-office-documents-in-a-browser%2F%3Feu%3Dtrue)

```html
<div style="width: 100%;height: 100%;">
	<iframe src='https://view.officeapps.live.com/op/view.aspx?src=https://zydemo.github.io/public/doc/sublime安装的插件2019.docx' width='100%' height='100%' frameborder='1'></iframe>
	
	// https://view.officeapps.live.com/op/view.aspx?src=  固定写法照抄即可office官方提供
	// https://zydemo.github.io/public/doc/sublime安装的插件2019.docx  文档地址  替换成你要预览的Word/PPT/EXCEL文档地址即可
</div>

```

参考资料：https://www.jianshu.com/p/2f39de746900
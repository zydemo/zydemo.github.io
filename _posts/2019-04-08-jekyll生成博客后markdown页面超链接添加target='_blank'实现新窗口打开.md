---
layout: post
title: jekyll生成博客后markdown页面超链接添加target='_blank'实现新窗口打开
date: 2019-04-08 10:19:51 +0800
categories: jekyll
tag: jekyll使用相关
---

* content
{:toc}



MarkDown超链接写法：

	行内式链接形式：[超链接文字](url) 

而我们打开所生产的超链接，默认是在本窗口打开的，为了有更好的阅读体验，我们往往希望在新窗口

打开超链接，并不希望影响阅读本文。markdown目前应该还不支持这种语法的，

一、可以用jQuery 在合适的地方加上如下代码（更方便实用，推荐）：

```js
<script type="text/javascript">
	$(document).ready(function() {
	    //为超链接加上target='_blank'属性
		$('a[href^="http"]').each(function() {
			$(this).attr('target', '_blank');
		});
	});
</script>

```

二、在md文件需要超链接的位置，用html语言实现超链接在新窗口打开：

```html
<a href="https://www.baidu.com/" target="_blank">新窗口打开百度</a>
新窗口打开百度：<a href="https://www.baidu.com/" target="_blank">https://www.baidu.com/</a>

```

效果：

+ <a href="/" target="_blank">新窗口打开此网站首页</a>
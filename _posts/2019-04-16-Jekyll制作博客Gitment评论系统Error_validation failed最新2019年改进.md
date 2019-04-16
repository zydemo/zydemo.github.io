---
layout: post
title: Jekyll制作博客Gitment评论系统Error:validation failed最新2019年改进
date: 2019-04-16 17:13:11 +0800
categories: jekyll
tag: jekyll使用相关
---

* content
{:toc}




Gitment评论系统网上教程一大把，这里只说明一下这个Error：validation failed错误的改进。

作者网站：[https://imsun.net/posts/gitment-introduction/](https://imsun.net/posts/gitment-introduction/)

其他介绍网站：[https://www.jianshu.com/p/57afa4844aaa](https://www.jianshu.com/p/57afa4844aaa)

错误原因			{#reason}
======================================

Error：validation failed的错误原因是因为：issue的标签label有长度限制！labels的最大长度限制是50个字符。

	id: '页面 ID', // 可选。默认为 location.href

这个id的作用，就是针对一个文章有唯一的标识来判断这篇本章。

**最新发现如果文章标题里含英文逗号也会出现此错误，修改为中文逗号即可（代码中也加了判断，如果不改按照日期作为id）。**

在issues里面，可以发现是根据网页标题来新建issues的，然后每个issues有两个labels（标签），一个是gitment，另一个就是id。

所以明白了原理后，就是因为id太长，导致初始化失败，现在就是要让id保证在50个字符内。

文章标题对应配置的id			{#title}
===================================
{% raw %}
	id: '{{ page.title }}'

文章时间对应配置的id			{#date}
===================================

	id: '{{ page.date }}'

所以呢，就应该去判断如果标题超过50个字符就用文章的时间作为id，如果标题文字不超过50个字符并且不含英文逗号则用标题
(参考链接：[https://www.cnblogs.com/mmyh/p/6065920.html](https://www.cnblogs.com/mmyh/p/6065920.html))：

	'{{ page.title }}'.indexOf(",")== -1  # !=-1代表含有 ==-1代表不含有
 
{% endraw %}

完整代码			{#code}
===========================
```js

<script>
	var title_length ='{{ page.title }}'.length					
	if (title_length < 50 && '{{ page.title }}'.indexOf(",")== -1){
		var gitment = new Gitment({
		id: '{{ page.title }}',	
		owner: '{{site.github_username}}',
		repo: '{{site.comment_gitment_repo}}',
		oauth: {
			client_id: '{{site.comment_gitment_clientId}}',
			client_secret: '{{site.comment_gitment_clientSecret}}',
		},
	});}
	else
	{
	var gitment = new Gitment({
		id: '{{ page.date }}',				
		title: '{{ page.title }}',
		owner: '{{site.github_username}}',
		repo: '{{site.comment_gitment_repo}}',
		oauth: {
			client_id: '{{site.comment_gitment_clientId}}',
			client_secret: '{{site.comment_gitment_clientSecret}}',
		},
	});}
	gitment.render('gitmentContainer')
</script>

```

当然了如果用时间去做id可以很好的避免了文章每次更新标题或路径时，会重新创建一个issue评论的问题。看自己情况。


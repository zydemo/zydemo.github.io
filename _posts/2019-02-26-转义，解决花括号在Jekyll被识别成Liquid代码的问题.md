---
layout: post
title: 转义，解决花括号在Jekyll被识别成Liquid代码的问题
date: 2019-02-26 15:30:24 +0800
categories: jekyll
tag: jekyll使用相关
---

* content
{:toc}




问题：
代码中的花括号被Jekyll识别为Liquid代码的问题。


在处理<a target="_blank" href="{{ '/2019/02/26/django实现分页的方法-Paginator对象的用法/' | prepend: site.baseurl }}">django实现分页的方法，Paginator对象的用法</a>中，我都遇到了代码中的花括号被Jekyll识别为Liquid代码的问题。<!-- more -->


然而 Liquid 的问题还需 Liquid 来解。而 Liquid 的 raw 就是用来解决这个问题的。


解决方法：

![/styles/images/article-image/解决花括号在Jekyll被识别成Liquid代码的问题.png]({{ '/styles/article-image/解决花括号在Jekyll被识别成Liquid代码的问题.png' | prepend: site.baseurl  }}){:height='80%' width='95%'}

上图显示如下：
```ruby
{% raw %}
{% comment %} 这里是各种包含奇怪花括号 {{{0}}} 的地方 {% endcomment %}
{% endraw %}
```

------------
参考资料：
<a target="_blank" href="https://cloud.tencent.com/developer/article/1341165">https://cloud.tencent.com/developer/article/1341165</a>

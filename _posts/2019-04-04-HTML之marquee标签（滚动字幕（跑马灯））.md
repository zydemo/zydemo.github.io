---
layout: post
title: HTML之marquee标签（滚动字幕（跑马灯））
date: 2019-04-04 09:43:00 +0800
categories: HTML
tag: HTML操作
---

* content
{:toc}



学习一个HTML标签---marquee，认识这个单词的人应该知道这个单词的意思是跑马灯。

但其实在H5中这个标签的语义是滚动字幕。

marquee标签并不是W3C官方推荐的标签，但是这个标签在各个浏览器中都非常支持。
### 使用格式： ###


	<marquee>滚动字幕内容</marquee>

效果如下：

<marquee>滚动字幕内容</marquee>

### 常用属性：direction ###
① 默认情况下，在标签中输入的文字是从右向左滚动的。但是可以通过marquee标签的属性**direction**来控制滚动的方向。

direction="right" ：从左向右滚动

direction="up"  ：从下向上滚动

direction="left"  ：从右向左滚动（默认情况）

direction= "down" ：从上向下滚动


### 常用属性：scrollamount ###
② marquee标签中的属性**scrollamount**可以控制文字滚动的速度。

例如：scrollamount="100" 。其中值越大，滚动的速度就越快。


### 常用属性：loop ###
③ marquee标签中的属性**loop**可以控制文字滚动的次数，但是默认的值是-1.也就是无限次滚动

loop="1",就可以让文字仅仅滚动一次。

④marquee标签中的属性**behavior**可以设置滚动的类型。

behavior="slide"，文字滚动到边界后就会停止，不会再继续滚动。

behavior="alternate" 文字滚动到边界后会反方向弹回来，并且来回滚动。

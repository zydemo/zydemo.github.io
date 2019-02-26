---
layout: post
title: Django关闭Debug后无法准确访问静态资源的解决办法
date: 2019-02-26 12:51:58 +0800
categories: Django
tag: Django操作
---

* content
{:toc}


在django项目中settings.py文件中有一项为DEBUG=TRUE，

此意思为将调试模式打开，那么我们如果在cmd中使用python manage.py runserver进行调试的过程中，页面出错了会将错误信息显示在页面上！

那么对于一个即将展示给用户的网页来说，我们开发者则不希望他们能够看到这些信息，所以我们通常会将这个DEBUG改为false；

但是关闭之后我们开发进行调试的时候又要将其打开，这就使得过程很繁琐，那有什么一劳永逸的方法呢

在settings.py文件中引入socket，使用socket.getname()获得本机名，如果访问的地址是我们本机（也就是我们开发），就打开debug，不是则关闭：

```python
import socket 
if socket.getname()=='***';  #记住要用引号引起来，***自己电脑主机名
 
    DEBUG=True 
else: 
    DEBUG=False
```

---
layout: post
title: Django博客开发教程-11:体验django模板
date: 2019-03-02 20:14:37 +0800
categories: Django
tag: Django博客开发教程
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190302201437_1.jpg' | prepend: site.baseurl }}){:height='80%' width='80%'} -->

上面我们有说过，用户发送请求的时候，视图会返回一个响应，响应可以是一个重定向，一个404错误，一个XML文档，一张图片或者是一个HTML内容的网页。前面几个返回的信息比较有限，我们重点更多是放在HTML内容的网页。我们把这样的页面按规范写好，然后都放在项目根目录下的templates文件夹里，这样的页面，我们称之为"模板"页面。

Django做为一个WEB框架，需要一种很便利的方法去动态生成HTML网页，因为有了模板这个概念。模板页面包含一些基础的HTML代码和一些特殊的语法，这些特殊的语法主要用于如何将数据动态的插入HTML页面中。

这些特殊的语法我们把它做**变量、标签**。变量是模板中最基本的组成单位。这些模板变量由视图函数生成的，然后通过上下文传递到模板里，然后由浏览器渲染出来。

上面的都是理论， 我们不管它。我们直接说如何在模板里调用视图函数传过来的变量。这些变量有很多种类型，也就是Python支持的数据类型比如：普通变量、列表、字典等。

在这之前我们要先设置好模板路径，把这个路径在settings里设置好，不然就没法访问我们的模板目录，之前在文章：[基础配置]({{ '/2019/03/02/Django博客开发教程-5_基础配置/' | prepend: site.baseurl }}) 里已经设置好了，下面我们直接使用就行。更多关于settings的配置可以查看文章：[全局配置settings详解](https://www.django.cn/course/show-10.html)

### 一、变量 ###

1、在文件myblog/urls.py里设置一个URL：

**myblog/urls.py**

```py
urlpatterns = [
    ...
    path('', views.index), 
    #把原来的views.hello修改成views.index  ''留空，表示为首页
    ...
]
```

2、在文件blog/views.py里添加一个视图函数：

**blog/views.py**

```py
#添加一个函数
def index(request):
    #添加两个变量，并给它们赋值
    sitename = 'Django中文网'
    url = 'www.django.cn'
    #把两个变量封装到上下文里
    context = {
        'sitename': sitename,
        'url':url,
    }
    #把上下文传递到模板里
    return render(request,'index.html',context)
```
3、在项目根目录下templates文件夹里新建一个文件index.html,输入如下内容：

**templates/index.html**

{% raw %}
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyBlog</title>
</head>
<body>
<h3>网站名：{{ sitename }}</h3>
<h3>域名：{{ url }}</h3>
</body>
</html>
```
{% endraw %}

然后启动项目，在浏览器里访问 http://127.0.0.1:8000   就可以查看到我们在视图函数里我们设置的内容。


![]({{ '/styles/article-image/20190302201437_1.PNG' | prepend: site.baseurl }})


代码里的{% raw %}`{{ sitename }}`和`{{ url }}`{% endraw %}就是模板变量，变量的数据类型是字符串或整形。在Django模板中，变量需要用{% raw %}`{{ 变量名 }}`{% endraw %}来显示。

### 二、列表 ###

1、在视图函数index里添加如下代码：

**blog/views.py**
```py
def index(request):
    sitename = 'Django中文网'
    url = 'www.django.cn'
    #新加一个列表
    list=[
        '开发前的准备',
        '项目需求分析',
        '数据库设计分析',
        '创建项目',
        '基础配置',
        '欢迎页面',
        '创建数据库模型',
    ]
    context = {
        'sitename': sitename,
        'url':url, 
        'list':list, #把list封装到context
    }
    return render(request,'index.html',context)
```

2、在模板文件index.html添加如下代码：

**templates/index.html**

{% raw %}
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyBlog</title>
</head>
<body>
<h3>网站名：{{ sitename }}</h3>
<h3>域名：{{ url }}</h3>
{#新下面的代码#}
<div>
    <ul>
    <h4>Blog教程目录：</h4>
        {% for list in list  %}
        <li>{{ list }}</li>
        {% endfor %}
    </ul>
</div>
</body>
</html>
```
{% endraw %}

然后我们在浏览器里刷新页面，显示如下：

![]({{ '/styles/article-image/20190302201437_2.jpg' | prepend: site.baseurl }})

新加代码里{% raw %} `{% for list in list  %}` {% endraw %}的{% raw %}`{% for %}` {% endraw %}属于Django模板的内置标签，它可以遍历输出变量的内容。

### 三、字典 ###

1、在视图函数里添加如下代码：

**blog/views.py**

```py
def index(request):
    ....
    #在来的基础上新加一个字典
    mydict={
        'name': '吴秀峰',
        'qq': '445813',
        'wx': 'vipdjango',
        'email': '445813@qq.com',
        'Q群': '10218442',
    }
    context = {
        ...
        #把mydict封装到上下文
        'mydict':mydict,
    }
    return render(request,'index.html',context)
```

2、在模板文件index.html添加如下代码:

**templates/index.html**
{% raw %}
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>MyBlog</title>
</head>
<body>
...
<!-- 新加如下代码 -->
<div>
    <ul>
    <h4>Blog教程作者信息：</h4>
        {% for key,values in mydict.items  %}
        <li>{{ key }}：{{ values }}</li>
        {% endfor %}
    </ul>
</div>
</body>
</html>
```
{% endraw %}

新加的代码里，{% raw %}`{% for key,values in mydict.items  %}` {% endraw %}是遍历输出字典里的 key和values的内容。

我们刷新页面，就能看到新的效果：

![]({{ '/styles/article-image/20190302201437_3.jpg' | prepend: site.baseurl }})

上面的就是在模板里调用变量、列表、字典的方法。当然，模板里还有许多内置的标签和过滤器。这里就不一一介绍。后面我们用上的时候，我会做特别的提醒。

上述代码我已经上传到服务器，请大家自行下载查看：

[模板体验代码.zip](https://www.django.cn/media/upfile/%E6%A8%A1%E6%9D%BF%E4%BD%93%E9%AA%8C%E4%BB%A3%E7%A0%81_20181023122903_709.zip)

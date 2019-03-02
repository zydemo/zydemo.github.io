---
layout: post
title: Django博客开发教程-8:用Admin管理后台管理数据
date: 2019-03-02 16:45:42 +0800
categories: Django
tag: Django博客开发教程
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190302164542_1.jpg' | prepend: site.baseurl }}) -->

[上篇文章]({{ '/2019/03/02/Django博客开发教程-7_创建数据库模型' | prepend: site.baseurl }})我们我们把数据库迁移到数据库里去了，那么现在我们数据库里是个什么样的情况呢？我们点击Pycharm右上角的Database，然后在网站项目里选中我们的数据库文件db.sqlite3，把它拖到Database框里。

### Pycharm Database对数据库可视化操作 ###

![]({{ '/styles/article-image/20190302164542_1.jpg' | prepend: site.baseurl }}){:width='90%'}

然后点击db，就可以查看到我们的网站数据库，我们可以对数据进行增、删、改、查操作。

![]({{ '/styles/article-image/20190302164542_2.jpg' | prepend: site.baseurl }}){:height='90%' width='90%'}

更多相关方面的操作请查看文章：[使用Pycharm里的Database对数据库进行可视化操作](https://www.django.cn/article/show-13.html)

Pycharm Database限制非常大，下面我们介绍如何使用Django自带的admin管理网站数据。django的admin后台管理它可以让我们快速便捷管理数据，我们可以在各个app目录下的admin.py文件中对其进行控制。想要对APP应用进行管理，最基本的前提是要先在settings里对其进行注册，就是在INSTALLED_APPS里把APP名添加进去，我们在前面的文章[基础配置]({{ '/2019/03/02/Django博客开发教程-5_基础配置' | prepend: site.baseurl }})有提到过。

### 对数据库表进行注册 ###
注册APP应用之后，我们想要在admin后台里对数据库表进行操作，我们还得在应用APP下的admin.py文件里对数据库表先进行注册。我们的APP应用是blog，所以我们需要在blog/admin.py文件里进行注册：

**blog/admin.py**

```python
#!/usr/bin/env python
# coding=utf-8

# 对数据库表先进行注册
from django.contrib import admin
# 导入需要管理的数据库表
from .models import Banner,Category,Tag,Tui,Article,Link

# 文章
@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    # 文章列表里要显示的字段
    list_display = ('id','category','title','tui','user','views','created_time')
    # 满50条数据就自动分页
    list_per_page = 50
    # 后台数据列表排序方式,按照发布时间降序，元祖或者list
    ordering = ('-created_time',)
    # 设置哪些字段可以进入编辑页面
    list_display_links = ('id','title')

# 轮播图
@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ('id','text_info','img','link_url','is_active')

# 分类
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('id','name','index')

# 标签
@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ('id','name')

# 推荐位
@admin.register(Tui)
class TuiAdmin(admin.ModelAdmin):
    list_display = ('id','name')

# 友情链接
@admin.register(Link)
class LinkAdmin(admin.ModelAdmin):
    list_display = ('id','name','linkurl')

```

关于admin定制和数据库表注册管理方法，在文章[定制Admin管理后台](https://www.django.cn/course/show-16.html)有详细介绍。

登录管理后台http://127.0.0.1:8000/admin/

注册之前的后台：

![]({{ '/styles/article-image/20190302164542_3.jpg' | prepend: site.baseurl }}){:height='90%' width='90%'}

### 注册之后后台界面 ###
注册之后，启动项目，刷新页面：

![]({{ '/styles/article-image/20190302164542_4.jpg' | prepend: site.baseurl }}){:height='90%' width='90%'}

多出了之前我们在models里创建的表。我们可以在后台里面对这些表进行增、删、改方面的操作。

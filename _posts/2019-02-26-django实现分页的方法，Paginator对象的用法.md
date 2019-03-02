---
layout: post
title: django实现分页的方法，Paginator对象的用法
date: 2019-02-26 13:21:15 +0800
categories: Django
tag: Django操作
---

* content
{:toc}


### Paginator对象：

类Paginator：
class Paginator(object_list,per_page,orphans=0,allow_empty_first_page=True)

必须提供的参数：

object_list:一个列表或元组，元素是django QuerySet或是包含count()或__len__()方法的可切片对象。
per_page:包含在一页中最多的条目数量。

可选参数：

orphans：在最后一页中充许的最少条目数量，默认是0.当最后一页条目数量小于或等于orphans时，这些条目加到本页的上一页中。
allow_empty_first_page:是否充许第一页为空。如设为False且object_list为空，则抛出EmptyPage异常。

方法：

Paginator.page(number):返回一个Page对象，序号是始于1.如给出的页号不存在，抛出InvalidPage异常。

属性：

Paginator.num_pages:页面总页数
Paginator.page_range:页面数的范围，始于1,如[1,2,3,4]。

### InvalidPage异常：

如要求的页面无效或页面中没有对象，page()抛出InvalidPage异常。
PageNotAnInterger:当提供给page()的数不是整数是抛出该异常。
EmptyPage:当提供给page()的数是一个有效数，但在该页没有对象存在时，抛出该异常。

### Page对象：

class Page(object_list,number,paginator):
一般不手工创建Pages,可以使用Paginator.page().

方法：

Page.has_next():如有下一页则返回True
Page.has_previous():如有上一页则返回True
Page.has_other_pages():如有上一页或下一页返回True
Page.next_page_number():返回下一页的页码。不管下一页是否存在都返回。
Page.previous_page_number():返回上一页的页码。不管上一页是否存在都返回。
Page.start_index():返回当前页面中第一个对象的序号，序号始于1.例如：将一个包含5个对象的列表分成每页2个对象，则第二页的start_index()返回3.
Page.end_index():返回当前页面中最一个对象的序号。

属性：

Page.object_list：当前页面中所有的对象
Page.number：当前页面的页码，始于1
Page.paginator：页面相关的Pageinator对象。

### Python中views.py代码：
```python
#!/usr/bin/env python
# coding=utf-8
# 视图文件，用来执行响应代码的。你在浏览器所见所得都是它处理的。
 
from django.shortcuts import render
from django.http import  HttpResponse
from .models import Article,Category,Banner,Tag,Link
from django.db.models import Count
import datetime
# 导入自带的分页插件
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger
 
# 列表页
def list(request,lid):
    # 获取通过url传进来的lid，然后筛选出对应的文章并按照创建时间降序排序
    list = Article.objects.filter(category_id=lid).order_by('-created_time')
    # 获取当前文章的分类名
    cname = Category.objects.get(id=lid)
    # 右侧热门推荐
    remen = Article.objects.filter(tui__id=2)[:6]
    # 右侧所有标签
    tags = Tag.objects.all()
    # 在url中获取当前页面数，结果是：None、1、2等
    page = request.GET.get("page")
    # 对查询到的数据对象list进行分页，超过5条就分页，list一定要排序否则会出现警告
    paginator = Paginator(list,5)
    try:
        listpage = paginator.page(page) # 获取当前页码的记录:<Page 1 of 2>
    except PageNotAnInteger:
        listpage = paginator.page(1) # 如果用户输入的页码不是整数，显示第一页内容
    except EmptyPage:
        # paginator.num_pages 总页数
        listpage = paginator.page(paginator.num_pages)# 如果用户输入的页数不在系统的页码列表中时，显示最后一页
    return render(request,'list.html',locals())

```

### HTML页面如下，list.html：

{% raw %}
```html
<!--文章列表页面-->
    <div id="main-container" class="container clearfix">
        <section class="post-left">
            <div class="breadcrumb">您的位置： <a itemprop="breadcrumb" href="{% url 'index' %}">首页</a> » <span
                    class="current">{{ cname }}</span></div>
            <div class="index-main clearfix">
                <div class="main-title">
                    <h4 class="post-left-title">分类：{{ cname }}(共{{list|length}}条数据  第{{listpage.number}}页/共{{listpage.paginator.num_pages}}页)</h4>
                </div>
                <div class="row">
                    {% for ls in listpage %}
                        <div class="article-box clearfix excerpt-1">
                            <div class="col-md-4">
                                <div class="thumbnail">
                                    <a href="{% url 'index' %}show-{{ ls.id }}.html" title="{{ ls.title }}">
                                        <img src="media/{{ ls.img }}"
                                             srcset="media/{{ ls.img }}"
                                             alt="{{ ls.title }}" class="wp-post-image" width="240" height="160"/></a>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <h2><a href="{% url 'index' %}show-{{ ls.id }}.html" target="_blank"
                                       title="{{ ls.title }}"> {{ ls.title }}</a></h2>
                                <p class="txtcont hidden-xs"><a href="{% url 'index' %}show-{{ ls.id }}.html"
                                                                target="_blank"
                                                                title="{{ ls.title }}">{{ ls.excerpt }}</a></p>
                                <div class="meta"><span class="label label-info"><a
                                        href="{% url 'index' %}ls-{{ category_id }}.html">{{ ls.category.name }}</a></span>
                                    <time class="item"><i
                                            class="fa fa-clock-o"></i>{{ ls.created_time|date:"Y年m月d日" }}
                                    </time>
                                </div>
                            </div>
                        </div>
                    {% endfor %}
                </div>
              <!--分页代码-->
                <div class="pagination">
                    <ul>
                        <!--{{ listpage.has_previous }}如有上一页则返回True-->
                        {% if listpage.has_previous %}
                            <!--previous_page_number返回上一页的页码。不管上一页是否存在都返回，上面用if限制肯定存在-->
                            <li class="prev-page"><a href="?page={{ listpage.previous_page_number }}">上一页</a> </li>
                        {% else %}
                            <!--没有上一页了-->
                            <li class="prev-page"></li>
                        {% endif %}
                        <!--paginator.page_range页面数的范围，始于1,如[1,2,3,4]-->
                        {% for num in listpage.paginator.page_range %}
                            {% if num %}
                                <!--如果当前页码数和num相等，则不会出现连接地址，也不能点击-->
                                {% ifequal num listpage.number %}
                                    <li class="active"><span>{{ num }}</span></li>
                                {% else %}
                                    <li><a href="?page={{ num }}">{{ num }}</a></li>
                                {% endifequal %}
                            {% else %}
                                <li class="disabled"><span>...</span></li>
                            {% endif %}
                        {% endfor %}
                        <!--如果有下一页-->
                        {% if listpage.has_next %}
                            <!--next_page_number返回下一页的页码。不管下一页是否存在都返回，上面用if限制肯定存在-->
                            <li class="next-page"><a href="?page={{ listpage.next_page_number }}">下一页</a></li>
                        {% else %}
                            <!--没有下一页了-->
                            <li class="prev-page"></li>
                        {% endif %}
                    </ul>
                </div>
            </div>
            <!-- /文章列表 -->
        </section>
```
{% endraw %}

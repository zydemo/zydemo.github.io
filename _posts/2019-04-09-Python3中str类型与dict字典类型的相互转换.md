---
layout: post
title: Python3中str类型与dict字典类型的相互转换
date: 2019-04-09 12:34:42 +0800
categories: Python
tag: Python基础
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190409123442_1.jpg' | prepend: site.baseurl }}){:height='80%' width='80%'} -->

在Python 中的“dict”和“str”类型转换：

第一种		{#first}
===================================
**“dict”转为“str”：**mystr=str(dict1)

**“str”转为“dict”：**

①：mydict=**eval**(mystr)

②：
```py
>>> user="{'name' : 'jim', 'sex' : 'male', 'age': 18}"
>>> exec("c="+user)
>>> c
{'name': 'jim', 'sex': 'male', 'age': 18}
>>> type(user)
<class 'str'>
>>> type(c)
<class 'dict'>
```

第二种		{#second}
===================================

使用simplejson把JSON转化为Python内置类型

JSON到字典转化：
```py
ret_dict = simplejson.loads(json_str)
```

字典到JSON转化：
```py
json_str = simplejson.dumps(dict)
```
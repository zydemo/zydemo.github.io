---
layout: post
title: Python3中Selenium弹框alert报错unexpected alert open,解决办法（亲测有效）
date: 2019-04-16 16:06:17 +0800
categories: Python
tag: Python-selenium
---

* content
{:toc}




报错信息：

	unexpected alert open

解决方法：

	driver.switch_to.alert.accept()

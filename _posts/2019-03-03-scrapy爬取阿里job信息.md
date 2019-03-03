---
layout: post
title: scrapy爬取阿里job信息
date: 2019-03-03 16:45:59 +0800
categories: Python
tag: Python项目
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190303164559_1.jpg' | prepend: site.baseurl }}){:height='80%' width='80%'} -->

```
职位内容：//*[@id="J-list-box"]/tr[*]/td/div/p/text() 有空格
职位名称：//*[@id="J-list-box"]/tr[*]/td[1]/span/a/text() 有空格
职位类别：//*[@id="J-list-box"]/tr[*]/td[2]/span/text()
工作地点：//*[@id="J-list-box"]/tr[*]/td[3]/span/text()
招聘人数：//*[@id="J-list-box"]/tr[*]/td[4]/span/text() 有空格
更新时间：//*[@id="J-list-box"]/tr[*]/td[5]/span/text()
```
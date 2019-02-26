---
layout: post
title: python3中判断readline读到文件末尾
date: 2019-02-26 10:53:51 +0800
categories: Python
tag: Python文件操作
---

* content
{:toc}


```python
fp = open('somefile.txt')
while True:
     line = fp.readline()
     if not line:  # 等价于if line == "":
        break
```
### 说明：
Python中，空串的not返回true，即not line时为读到EOF（文件末尾）。

在文件中，如果遇到一个空白行，readline()并不会返回一个空串，因为每一行的末尾还有一个或多个分隔符，因此“空白行”至少会有一个换行符或者系统使用的其他符号。只有当真的读到文件末尾时，才会读到空串""。
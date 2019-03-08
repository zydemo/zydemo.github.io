---
layout: post
title: python logging模块打印log日志到文件和屏幕
date: 2019-03-08 15:34:30 +0800
categories: Python
tag: Python项目
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190308153430_1.jpg' | prepend: site.baseurl }}){:height='80%' width='80%'} -->

### 一、logging的框架 ###

1、 Loggers: 可供程序直接调用的接口，app通过调用提供的api来记录日志

2、 Handlers: 决定将日志记录分配至正确的目的地

3、 Filters:对日志信息进行过滤，提供更细粒度的日志是否输出的判断

4、 Formatters: 制定最终记录打印的格式布局

### 二、Log级别 ###

系统默认有6个级别，优先级：

CRITICAL   50

ERROR      40

WARNING    30

INFO       20

DEBUG      10

NOTSET     0

logging.basicConfig函数各参数：

filename：指定日志文件名；

filemode：和file函数意义相同，指定日志文件的打开模式，'w'或者'a'；

format：指定输出的格式和内容，format可以输出很多有用的信息；

```py
    参数：        作用
 
%(levelno)s：打印日志级别的数值
%(levelname)s：打印日志级别的名称
%(pathname)s：打印当前执行程序的路径，其实就是sys.argv[0]
%(filename)s：打印当前执行程序名
%(funcName)s：打印日志的当前函数
%(lineno)d：打印日志的当前行号
%(asctime)s：打印日志的时间
%(thread)d：打印线程ID
%(threadName)s：打印线程名称
%(process)d：打印进程ID
%(message)s：打印日志信息
```

datefmt：指定时间格式，同time.strftime()；

level：设置日志级别，默认为logging.WARNNING；

stream：指定将日志的输出流，可以指定输出到sys.stderr，sys.stdout或者文件，默认输出到sys.stderr，当stream和filename同时指定时，stream被忽略；

### 三、logging模块：debug_info ###
二、打印log日志到文件和屏幕的例子或者可以直接当成模块调用，文件名：debug_info.py

```py
#!/usr/bin/env python
# coding=utf-8
# logging模块打印log日志到文件和屏幕
# Log级别：CRITICAL(50)、ERROR(40)、WARNING(30)、INFO(20)、DEBUG(10)、NOTSET(0)
# https://www.cnblogs.com/liujiacai/p/7804848.html
import logging,os,sys
 
class Log_info(object):
    def __init__(self):
        # 指定日志文件名，获取当前执行的py文件名
        self.filename = str(os.path.basename(sys.argv[0]).split(".")[0]) + '.log'
        # 指定输出的格式和内容
        self.format = '%(asctime)s [%(filename)s] %(levelname)s:%(message)s'
        # 设置日志级别，默认为logging.WARNNING
        # self.level = logging.INFO
        # 和file函数意义相同，指定日志文件的打开模式，'w'或者'a'
        # self.filemode = 'a'
        # 指定时间格式
        self.datefmt = '%Y-%m-%d %H:%M:%S'
        self.logger = logging.getLogger(__name__)
 
    def main(self):
        # 这个方法只能保存到文件，不能同时输出到屏幕
        # logging.basicConfig(filename=self.filename,format=self.format,level=self.level
        #                     ,filemode=self.filemode,datefmt=self.datefmt)
        self.logger.setLevel(logging.INFO)
        format = logging.Formatter(self.format,datefmt=self.datefmt)
        # 日志输出到文件
        file_handler = logging.FileHandler(self.filename)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(format)
        # 使用StreamHandler输出到屏幕
        console = logging.StreamHandler()
        console.setLevel(logging.INFO)
        console.setFormatter(format)
        # 添加两个Handler
        self.logger.addHandler(file_handler)
        self.logger.addHandler(console)
        # 执行输出信息: 2019-01-02 15:51:13 [print_debug.py] INFO:输出信息内容
        # self.logger.info("输出信息内容")
        # 注意不能这么写,类型不一致
        # self.logger.info("经营许可证字段值个数:", 2)
        # 这么写就可以
        # self.logger.info("经营许可证字段值个数:%s"%2)
        # self.logger.info("经营许可证字段值个数:%s",3)
        # try:
        #     (a== 2)
        # except Exception as e:
        #     self.logger.info(e)
        # 如果这样返回，那样调取的时候就不用每次写logger.info，直接写logger就可以了
        return self.logger.info
if __name__ =="__main__":
    log_info = Log_info()
    logger = log_info.main()

```

### 四、如何调用： ###

```py
from debug_info import Log_info

logger = Log_info().main()
logger("输出的例子")
# 2、3是int类型
logger("输出的例子:%s"%2)
logger("输出的例子:%s",3)
logger("输出的例子:%d",3)

```

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

python3利用selenium自动获取阿里社会招聘信息到表格(反爬selenium代码）

### 打印log日志到文件和屏幕代码 ###

**文件名：debug_info.py**
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

### 爬取代码 ###

```py
#!/usr/bin/env python
# coding=utf-8
# 自动获取阿里招聘信息
 
from selenium import webdriver
import time
from debug_info import Log_info
from openpyxl import Workbook
from selenium.webdriver import ChromeOptions  # 更改Chrome配置达到反爬机制
 
class Saas(object):
    # 初始化工作
    def __init__(self):
        # self.driver = webdriver.Chrome()
        # 反爬机制代码开始，采用此代码在F12控制台输入window.navigator.webdriver结果不是True，而是undefined就成功了
        option = ChromeOptions()
        option.add_experimental_option('excludeSwitches', ['enable-automation'])
        self.driver = webdriver.Chrome(options=option)
        # 反爬机制代码结束
 
        self.driver.maximize_window()  # 将浏览器最大化
        self.wb = Workbook()
        self.ws = self.wb.active
        self.top = ['序号', '职位名称', '职位类别', '工作地点', '招聘人数', '更新时间','工作年限','所属部门','学历',
                    '岗位情况1','岗位情况2']
        # 创建表头
        # self.ws.append(self.top)
 
    def ali(self, logger):
        # 先做模拟登陆
        self.driver.get('https://job.alibaba.com/zhaopin/positionList.htm#page/1')
        total_page = self.driver.find_element_by_xpath('//*[@id="J-pagination"]/div/ul/li[6]/a').text
        logger("打开首页，当前共获取到%s页" % total_page)
        while True:
            input_page = input("请输入要获取的页数，不输入则全部获取(共%s页):" % total_page)
            if input_page == '':
                logger("全部数据获取中...")
                input_page = int(total_page)
                self.get_date(logger, input_page)
                break
            else:
                # 如果输入的是数字,判断是不是比最大页数大
                if input_page.isdigit():
                    if int(input_page) > int(total_page):
                        logger("输入的页数超过最大页数，请重新输入！")
                        continue
                    elif int(input_page) == 0:
                        logger("不能为0")
                        continue
                    else:
                        self.get_date(logger, int(input_page))
                        break
                else:
                    logger("请输入正确页数！")
                    continue
        time.sleep(2)
        file_end_name = time.strftime("%Y-%m-%d", time.localtime())
        self.wb.save('alibaba' + file_end_name + '.xlsx')
        logger("全部处理完成！")
 
    # 获取数据
    def get_date(self, logger, input_page):
        result_date = []
        # 如果职位描述大于2附加表头：职位描述3、职位描述4.....进去
        add_top = []
        for i in range(1, input_page + 1):
            time.sleep(1)
            # 存储序号
            number_list = []
            # self.driver.get('https://job.alibaba.com/zhaopin/positionList.htm#page/'+str(i))
            url = self.driver.current_url
            # 当前页码数
            page = int((url).split("/")[-1])
            logger("当前第%s页数据获取中..." % page)
            # 职位名称
            job_title = self.driver.find_elements_by_xpath('//*[@id="J-list-box"]/tr/td[1]/span/a')
            length = len(job_title)
            # 获取序号,最后一页有可能不是10个数据，所以10不能直接写
            for j in range((i - 1) * length + 1, (i - 1) * length + 11):
                number_list.append(j)
            # 职位类别
            job_category = self.driver.find_elements_by_xpath('//*[@id="J-list-box"]/tr/td[2]/span')
            # 工作地点
            job_address = self.driver.find_elements_by_xpath('//*[@id="J-list-box"]/tr/td[3]/span')
            # 招聘人数
            job_number = self.driver.find_elements_by_xpath('//*[@id="J-list-box"]/tr/td[4]/span')
            # 更新时间
            job_date = self.driver.find_elements_by_xpath('//*[@id="J-list-box"]/tr/td[5]/span')
            for k in range(len(number_list)):
                # 存储每一行数据
                all_date = []
                all_date.append(number_list[k])
                all_date.append(job_title[k].text.strip())
                all_date.append(job_category[k].text.strip())
                all_date.append(job_address[k].text.strip())
                all_date.append(job_number[k].text.strip())
                all_date.append(job_date[k].text.strip())
                time.sleep(1)
                logger("点击第%s页第%s个详情" % (page, k + 1))
                self.driver.find_element_by_xpath(
                    '//*[@id="J-list-box"]/tr[' + str(2 * k + 1) + ']/td[1]/span/a').click()
                # 点击后有新窗口
                self.all_handles = self.driver.window_handles
                logger("切换到新窗口")
                self.driver.switch_to.window(self.all_handles[1])
                time.sleep(2)
                # 工作年限
                working_life = self.driver.find_element_by_xpath('//table[@class="detail-table box-border"]/tbody/tr[1]/td[6]').text
                all_date.append(working_life)
                # 所属部门
                department = self.driver.find_element_by_xpath('//table[@class="detail-table box-border"]/tbody/tr[2]/td[2]').text
                all_date.append(department)
                # 学历
                education = self.driver.find_element_by_xpath('//table[@class="detail-table box-border"]/tbody/tr[2]/td[4]').text
                all_date.append(education)
                self.driver.close()
                time.sleep(1)
                logger("切回第一个窗口")
                self.driver.switch_to.window(self.all_handles[0])
                # 点击展开按钮获取职位内容，tr后面数字是1,3,5,7....
                logger("展开第%s页第%s个按钮" % (page, k + 1))
                self.driver.find_element_by_xpath('//*[@id="J-list-box"]/tr[' + str(2 * k + 1) + ']/td[6]/a').click()
                # 职位内容
                # job_content = self.driver.find_element_by_xpath('//*[@id="J-list-box"]/tr['+str(2*k+2)+']/td/div').text
                # all_date.append(job_content.strip().replace("\n", "").replace("分享到：", ""))
                job_content = self.driver.find_elements_by_xpath(
                    '//*[@id="J-list-box"]/tr[' + str(2 * k + 2) + ']/td/div/p')
                for content_p in range(len(job_content)):
                    all_date.append(job_content[content_p].text.strip().replace("\n", "").replace("分享到：", ""))
                if len(job_content) > 2:
                    logger("序号:%s,岗位:%s情况大于2段请查看原文"%(number_list[k],job_title[k].text.strip()))
                    for p_length in range(3,len(job_content)+1):
                        if "岗位情况"+str(p_length) not in self.top:
                            self.top.append("岗位情况"+str(p_length))
                time.sleep(1)
                logger("关闭第%s页第%s个按钮" % (page, k + 1))
                self.driver.find_element_by_xpath('//*[@id="J-list-box"]/tr[' + str(2 * k + 1) + ']/td[6]/a').click()
                time.sleep(1)
                result_date.append(all_date)
            time.sleep(1)
            # 判断需不需要点击下一页
            if input_page > page:
                # 点击下一页
                logger("点击下一页")
                self.driver.find_element_by_xpath('//*[@id="J-pagination"]/div/ul/li[@data-index="next"]/a').click()
            time.sleep(1)
            logger("第%s页处理完成!" % page)
 
        for row in range(len(result_date)):
            for col in range(len(self.top)):
                if result_date[row][col]:
                    value = result_date[row][col]
                else:
                    value = ""
                self.ws.cell(row=1,column= col+1,value=self.top[col])
                self.ws.cell(row=row + 2, column=col + 1, value=value)
# def tearDown(self):
#     # 退出
#     logger("以上数据全部处理完毕！")
#     # time.sleep(15)
#     # 这里就不退出了
#     # self.driver.quit()
 
if __name__ == "__main__":
    # 将输出结果同时输出到屏幕和保存到文件中
    logger = Log_info().main()
    time.sleep(2)
    # 最后再执行自动化方法
    saas = Saas()
    try:
        saas.ali(logger)
    except Exception as e:
        logger("出现异常：", e)
```

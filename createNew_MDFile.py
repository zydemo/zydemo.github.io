# coding=utf-8
# 自动生成一个md格式文件，并在开头添加头部文件
'''
---
layout: post
title:  Jekyll 语法简单笔记
date:   2019-02-24 17:08:00 +0800
categories: jekyll
tag: jekyll使用相关
---

* content
{:toc}

'''

import os, sys
import time
import re


class Create_newMD:
    def __init__(self):
        self.contentlist = ["---"]
        # 日期格式规则
        self.date_patt = re.compile(r'\d{4}-\d{1,2}-\d{1,2}')
        # 时间格式规则
        self.time_patt = re.compile(r'\d{1,2}:\d{1,2}:\d{1,2}')

    def create(self):
        self.path = "./_posts"
        if (not os.path.exists(self.path)):
            print("当前目录下没有'_posts'文件夹，请核实，5秒后自动退出系统！")
            time.sleep(5)
            sys.exit()
        else:
            # 先获取_posts目录下的所有文件
            filelist = os.listdir(self.path)
            while True:
                input_date = input("\n" + "文章发布日期(格式2019-02-21,不输入默认为当前日期):").strip()
                re_date = self.date_patt.findall(input_date)
                if input_date != '':
                    if len(re_date) != 0:
                        break
                    else:
                        print("\n" + "发布日期格式有误，请重新输入！")
                        continue
                else:
                    break
            while True:
                input_time = input("\n" + "文章发布时间(格式17:08:00,不输入默认为当前时间):").strip()
                re_time = self.time_patt.findall(input_time)
                if input_time != '':
                    if len(re_time) != 0:
                        break
                    else:
                        print("\n" + "发布时间格式有误，请重新输入！")
                        continue
                else:
                    break
            while True:
                input_title = input("\n" + "文章标题:").strip()
                if input_title != "":
                    title = "title: " + input_title
                    break
                else:
                    print("\n" + "标题不能为空或只为空格，请重新输入！")
                    continue
            while True:
                input_category = input("\n" + "文章分类名:").strip()
                if input_category != "":
                    # 如果输入的是纯数字，要加上双引号:"2"
                    if input_category.isdigit():
                        category = "categories: " + '"' + input_category + '"'
                    else:
                        category = "categories: " + input_category
                    break
                else:
                    print("\n" + "分类名不能为空或只为空格，请重新输入！")
                    continue

            input_tag = input("\n" + "文章标签名(不输入默认为分类名):").strip()
            if input_tag != "":
                tag = "tag: " + input_tag
            else:
                tag = "tag: " + input_category
            # 获取当天的日期
            today_date = time.strftime("%Y-%m-%d", time.localtime())
            # 获取现在的时间
            today_time = time.strftime("%H:%M:%S", time.localtime())
            if input_date == "":
                input_date = today_date
            if input_time == "":
                input_time = today_time
            date = "date: " + input_date + " " + input_time + " +0800"
            layout = "layout: post"
            self.contentlist.append(layout)
            self.contentlist.append(title)
            self.contentlist.append(date)
            self.contentlist.append(category)
            self.contentlist.append(tag)
            self.contentlist.append("---")
            self.contentlist.append("")
            self.contentlist.append("* content")
            self.contentlist.append("{:toc}")
            while True:
                url = input("\n" + "md文件名(也是文章url地址名称,不输入默认为标题名字):").strip()
                if url == "":
                    url = input_title
                fileName = input_date + "-" + url + ".md"
                if fileName in filelist:
                    print("\n" + "ERROR:该md文件'%s'已存在,创建失败！" % fileName)
                    while True:
                        choice = input("\n" + "输入相应数字(1:重新输入,0:退出系统)：")
                        if choice == '1':
                            break
                        elif choice == '0':
                            print("\n" + "5秒后自动退出系统，谢谢使用！")
                            time.sleep(5)
                            sys.exit()
                        else:
                            print("\n" + "请正确输入相应数字代码！")
                            continue
                else:
                    with open(self.path + "/" + fileName, "a+", encoding="utf-8")as f:
                        for i in self.contentlist:
                            f.write(i + "\n")
                    print("\n" + '恭喜文件已生成,请在文件夹“_posts”中查看，文件名为:“%s”' % fileName)
                    print("\n" + "5秒后自动退出系统...")
                    time.sleep(5)
                    break


if __name__ == "__main__":
    cr = Create_newMD()
    cr.create()

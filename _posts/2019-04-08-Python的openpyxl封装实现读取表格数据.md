---
layout: post
title: Python的openpyxl封装实现读取表格数据
date: 2019-04-08 15:28:08 +0800
categories: openpyxl
tag: openpyxl操作
---

* content
{:toc}


代码		{#code}
==================================================

```py
#!/usr/bin/env python
# coding=utf-8
# 封装实现读取表格数据
# 2018.11.10增加了如果不传sheet_name默认读取第一个表格的功能
 
import xlrd,os
from xlrd import xldate_as_tuple
from datetime import datetime
from openpyxl import load_workbook
 
class ExcelUtil:
    def __init__(self, excel_path, sheet_name=None):
        self.wb = load_workbook(excel_path,data_only=True)
        self.data = xlrd.open_workbook(excel_path)
        # 如果sheet_name传入值了，就用，如果没有就默认选择第一个表格
        if sheet_name != None:
            self.table = self.data.sheet_by_name(sheet_name)
            self.ws = self.wb[sheet_name]
        else:
            self.table = self.data.sheets()[0]
            self.ws = self.wb.worksheets[0]
        try:
            # 获取第一行作为key值
            self.keys = self.table.row_values(0)
        except:
            print()
        # 获取总行数
        self.rowNum = self.table.nrows
        # 获取总列数
        self.colNum = self.table.ncols
 
    # 获取表格数据
    def dict_data(self):
        if self.rowNum <= 1:
            print("总行数小于1，请核实表格数据，退出系统！")
            os._exit(0)
        else:
            r = []
            # j=1代表第二行
            j = 1
            # i控制循环次数，也就是取多少行数据
            for i in range(self.rowNum - 1):
                s = {}
                # 从第二行取对应values值
                values = self.table.row_values(j)
                # 列数
                for x in range(self.colNum):
                    # 如果表格中是日期，那么要进行转化
                    ctype = self.table.cell(j, x).ctype
                    cell = self.table.cell_value(j, x)
                    if ctype == 3:
                        date = datetime(*xldate_as_tuple(cell, 0))
                        cell = date.strftime('%Y-%m-%d %H:%M')
                        s[self.keys[x]] = cell
                    else:
                        s[self.keys[x]] = values[x]
                r.append(s)
                j += 1
            return r
    # 往表格里写入数据
    def write_excel(self,row,col,value,filePath):
        self.ws.cell(row,col,value=value)
        self.wb.save(filePath)
 
 
if __name__ == "__main__":
    filePath = "./代理IP.xlsx"
    # sheetName = "Sheet1"
    data = ExcelUtil(filePath)
    print(data.dict_data())
    data.write_excel(2,5,'否',filePath)
 
```

实现方法		{#shixian}
==================================================
```py

from process_excel import ExcelUtil
 
data = ExcelUtil("./代理IP.xlsx").dict_data()
 
for i in range(len(data)):
    xx = data[i]['表头']
# 修改2行5列数据
ExcelUtil("./代理IP.xlsx").write_excel(2, 5, '有效', filePath)

```
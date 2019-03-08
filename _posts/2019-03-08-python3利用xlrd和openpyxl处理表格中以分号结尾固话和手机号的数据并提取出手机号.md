---
layout: post
title: python3利用xlrd和openpyxl处理表格中以分号结尾固话和手机号的数据并提取出手机号
date: 2019-03-08 15:32:52 +0800
categories: openpyxl
tag: Python项目
---

* content
{:toc}


<!-- ![]({{ '/styles/article-image/20190308153252_1.jpg' | prepend: site.baseurl }}){:height='80%' width='80%'} -->


导入的debug_info包：[logging模块debug_info包](/2019/03/08/python-logging模块打印log日志到文件和屏幕/)

表格形式如下：

电话中是以分号分开的：
![]({{ '/styles/article-image/20190308153252_1.png' | prepend: site.baseurl }}){:height='95%' width='95%'}

### 执行代码 ###

```py
#!/usr/bin/env python
# coding=utf-8
# 处理蔬菜种植表格
 
import xlrd
from xlrd import xldate_as_tuple
from openpyxl import load_workbook,Workbook
from debug_info import Log_info
 
class ExcelUtil:
    def __init__(self, excel_path,logger):
        self.wb = load_workbook(excel_path)
        self.data = xlrd.open_workbook(excel_path)
        self.wb_ = Workbook()
        names = self.data.sheet_names()  # 返回book中所有工作表的名字
        # 获取所有sheet
        sheet_table = self.data.sheets()
        for k in range(len(sheet_table)):
            logger("处理%s"%names[k])
            # 获取总行数
            self.rowNum = sheet_table[k].nrows
            # 获取总列数
            self.colNum = sheet_table[k].ncols
            # [[],[],[]]
            result = self.dict_data(sheet_table[k],logger)
            # 保存新的表的时候每个sheet表的名字和原来的一样,创建sheet表
            self.ws = self.wb_.create_sheet(names[k],index=k)
            # 冻结首行
            self.ws.freeze_panes = 'A2'
            self.ws.column_dimensions['A'].width = 19
            self.ws.column_dimensions['B'].width = 19
            self.ws.column_dimensions['C'].width = 13
            # 写入数据
            for k in range(len(result)):
                for j in range(len(result[k])):
                    # 创建表头
                    self.ws.cell(row=1, column=j + 1).value = "电话" + str(j + 1)
                    # 号码位数是11位，不是0开头，不包含"-"，是1开头的
                    if len(result[k][j]) == 11 and not result[k][j].startswith("0")and "-" not in result[k][j] and result[k][j].startswith("1"):
                        self.ws.cell(row=k+2, column=j+1).value = result[k][j]
                    else:
                        self.ws.cell(row=k + 2, column=j + 1).value = "不满足要求"
        # 删除最后一个无用表格
        self.wb_.remove(self.wb_.worksheets[len(sheet_table)])
        self.wb_.save("整理后.xlsx")
        self.wb.close()
        self.wb_.close()
 
    # 获取表格数据
    def dict_data(self,sheet_table,logger):
        if self.rowNum <= 1:
            logger("总行数小于1，请核实表格数据！")
        else:
            r = []
            # j=1代表第二行
            j = 1
            # i控制循环次数，也就是取多少行数据
            for i in range(self.rowNum - 1):
                # 从第二行取对应values值
                values = sheet_table.row_values(j)
                #  列数
                for x in range(self.colNum):
                    # 只选择名称包含以下字段对应的电话
                    if "果蔬" in values[x] or "蔬菜" in values[x]or "瓜菜" in values[x]:
                        for k in values:
                            if ";" in k:
                                r.append(k.replace("\t","").split(";"))
                j += 1
            return r
 
if __name__ == "__main__":
    logger = Log_info().main()
    filePath = "./蔬菜.xlsx"
    ExcelUtil(filePath,logger)
 
```

### 处理后结果 ###

处理后，全部是手机号了：

![]({{ '/styles/article-image/20190308153252_2.png' | prepend: site.baseurl }}){:height='95%' width='95%'}

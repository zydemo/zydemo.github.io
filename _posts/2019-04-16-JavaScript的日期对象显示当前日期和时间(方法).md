---
layout: post
title: JavaScript的日期对象显示当前日期和时间（用途：评论系统中显示评论日期）
date: 2019-04-16 16:27:40 +0800
categories: Java
tag: JavaScript
---

* content
{:toc}



题目解析：

使用JavaScript的日期对象显示当前日期和时间，先用new Date()来定义一个时间oDate对象，再根据oDate对象来获取年月日和时分秒的值：

获取年月日和时分秒的值			{#date}
===================================

```js

var oDate=new Date();
var oYear=oDate.getFullYear();获取当年的年份
var oMonth=oDate.getMonth()+1;获取当月的月份
var oDay=oDate.getDate();获取当日的日期
var oHours=oDate.getHours();获取当天的小时
var oMinute=oDate.getMinutes();获取当时是多少分
var oSeconds=oDate.getSeconds();获取多少秒

```

把获取好的的年月日和时分秒相连接起来付给div

```js

var timeValue=oYear+"-"+zero(oMonth)+"-"+zero(oDay)+" "+zero(oHours)+":"+zero(oMinute)+":"+zero(oSeconds)

oBox.innerHTML=timeValue;

```

里面的zero()函数是补零函数，当月日时分秒的值小于10的情况下就在前面加0

zero()函数		{#zero}
===================================

```js

function zero(num){
return num>10?num:"0"+num;
}

```

再用setInterval（）方法方法运行 clock()时钟就而已了，每1秒秒钟就跑动

setInterval("clock()",1000);

javascript代码		{#code}
===================================

```js
window.onload=function(){
clock();
setInterval("clock()",1000);
}
function zero(num){
return num>10?num:"0"+num;
}
function clock(){
var oBox=document.getElementById("date");
var oDate=new Date();
var oYear=oDate.getFullYear();
var oMonth=oDate.getMonth()+1;
var oDay=oDate.getDate();
var oHours=oDate.getHours();
var oMinute=oDate.getMinutes();
var oSeconds=oDate.getSeconds();
var timeValue=oYear+"-"+zero(oMonth)+"-"+zero(oDay)+" "+zero(oHours)+":"+zero(oMinute)+":"+zero(oSeconds);
oBox.innerHTML=timeValue;
}

```


转载前端菜鸟：[http://www.bird100.cn/8960.html](http://www.bird100.cn/8960.html)
#
参考：http://www.jianshu.com/p/1dfa88032c46

##### 当同一个 HTML 元素被不止一个样式定义时，会使用哪个样式
所有的样式会根据下面的规则层叠于一个新的虚拟样式表中，其中数字 4 拥有最高的优先权。
浏览器缺省设置
``` CSS
1、浏览器缺省设置
2、外部样式表
3、内部样式表（位于 <head> 标签内部）
4、内联样式（在 HTML 元素内部）
```

### CSS 语法
CSS 规则由两个主要的部分构成：选择器，以及一条或多条声明
``` CSS
selector{
    property: value;
    ...
}

p { color: rgb(255,0,0); }
p { color: rgb(100%,0%,0%); }

p {font-family: "sans serif";}
```
选择器通常是您需要改变样式的 HTML 元素。每条声明由一个属性和一个值组成。属性（property）是您希望设置的样式属性（style attribute）。每个属性有一个值。属性和值被冒号分开。

##### 选择器的分组
对选择器进行分组，这样，被分组的选择器就可以分享相同的声明。用逗号将需要分组的选择器分开。
``` CSS
h1, h2, h3{
    color: red;
}

# 伪类: 当标签激活焦点的时候触发
input:focus{ /* 获得焦点 */

}

# 伪元素：和伪类使用相似
div.test1:first-letter{

}
```

##### 继承
根据 CSS，子元素从父元素继承属性。但是它并不总是按此方式工作。看看下面这条规则：
```CSS
body{
   font-family: Verdana, sans-serif;
}

# 摆脱父元素的规则
body  {
     font-family: Verdana, sans-serif;
}
p  {
     font-family: Times, "Times New Roman", serif;
}
```

##### 派生选择器
通过依据元素在其位置的上下文关系来定义样式，你可以使标记更加简洁
``` CSS
# 列表中的 strong 元素变为斜体字，而不是通常的粗体字，可以这样定义一个派生选择器：
li strong {
    font-style: italic;
    font-weight: normal;
  }
```
在后代选择器中，规则左边的选择器一端包括两个或多个用空格分隔的选择器。选择器之间的空格是一种结合符（combinator）。每个空格结合符可以解释为“... 在 ... 找到”、“... 作为 ... 的一部分”、“... 作为 ... 的后代”，但是要求必须从右向左读选择器。
```
# 可以为包含边栏的 div 指定值为 sidebar 的 class 属性，并把主区的 class 属性值设置为 maincontent。然后编写以下样式：
div.sidebar {background:blue;}
div.maincontent {background:white;}
div.sidebar a:link {color:white;}
div.maincontent a:link {color:blue;}
```
如果需要选择紧接在另一个元素后的元素，而且二者有相同的父元素，可以使用相邻兄弟选择器（Adjacent sibling selector）,用一个结合符只能选择两个相邻兄弟中的第二个元素。请看下面的选择器：
``` CSS
# 只会把列表中的第二个和第三个列表项变为粗体。第一个列表项不受影响
li + li {font-weight:bold;}
```

##### CSS选择器
``` CSS
# id 选择器可以为标有特定 id 的 HTML 元素指定特定的样式, id 选择器以 "#" 来定义
#red {color:red;}
#green {color:green;}

# 类选择器以一个点号显示：
.center {text-align: center}

# 对带有指定属性的 HTML 元素设置样式
# 带有 title="W3School" 属性的所有元素设置样式：
[title=W3School]{
    color:red;
}

# 包含指定值的 title 属性的所有元素设置样式。适用于由空格分隔的属性值
[title~=hello] { color:red; }

# 带有包含指定值的 lang 属性的所有元素设置样式。适用于由连字符分隔的属性值：
[lang|=en] { color:red; }
```

##### 选择器的优先级与权值的关系
``` CSS
相同级别的选择器遵循：就近原则 > 叠加原则
不同类型的选择器：选择器的针对性越强，它的优先级就越高
优先级排序：important > 内联 > id选择器 > 类选择器 > 标签选择器|伪类|属性选择 > 伪元素 > 通配符 > 继承
```

##### HTML标签类型
块级标签：独占一行，能随时设置宽度和高度（如：div、p、h1…h6、ul、li）
``` CSS
<style>
  /* div标签选择器 */
  div{
      /*背景色*/
      background-color: yellow;
  }
</style>

<body>
  <div>我是div容器</div>
</body>
```
行内标签（内联标签）：多个行内标签能同时显示在一行，宽度高度取决于内容尺寸（如：span、a、label）
``` CSS
<style>
  /* span标签选择器 */
  span{
      /*背景色*/
      background-color: red;
  }
</style>

<body>
  <span>我是span容器</span>
</body>
```
行内-块级标签（内联-块级标签）：多个行内-块级标签可显示在同一行，能随时设置宽度和高度（如：input、button）
``` CSS
<style>
     /* input标签选择器 */
    input{
        /*背景色*/
        background-color: yellow;
    }
</style>

<body>
    <input type="text">
    <input type="date">
</body>
```
##### 修改标签的显示类型 —— display/visibility
``` CSS
# display属性有4个值
none：隐藏标签（同时隐藏内容和占位，也可以说同时隐藏结构）
block：让标签变为块级标签
inline：让标签变为行内标签
inline-block：让标签变为行内-块级标签（内联-块级标签）

# visibility属性有4个值
visible：显示标签（默认）
hidden：隐藏标签（只隐藏内容，但是依旧占位）
collapse：这个属性主要用在表格中，它可以删除一行或一列，但不会影响表格的布局，而且被行或列占据的空间会留给其他内容，如果用在其他标签，则呈现hidden的效果
inherit：规定应该从父标签继承visibility属性的值
```

##### CSS属性分类
CSS有很多属性，如果根据继承性划分，主要分为两大类     
可继承属性：父标签的属性值会传递给子标签（一般是文字控制属性）
+ 所有标签可继承（visibility、 cursor）
+ 继承（letter-spacing、word-spacing、white-space、line-height、color、font-family、font-size、font-style、font-variant、font-weight、text-decoration、text-transform、direction）
+ 块级标签可继承（text-indent、text-align）
+ 列表标签可继承（list-style、list-style-type、list-style-position、list-style-image）

不可继承属性：父标签的属性值不会传递给子标签（一般是区块控制属性）

##### 盒子模型
盒子里面的结构 —— 盒子由内容、内边距、边框、外边距构成, 每一个标签都是盒子，每个盒子都有4个属性.   
content（内容）：盒子里面装的东西（网页中通常是指文字和图片）
+ height：设置元素高度
+ max-height:设置元素最大高度
+ max-width：设置元素的最大宽度
+ width：设置元素宽度
+ min-height：设置元素最小高度
+ min-width：设置元素最小宽度

padding（填充，内边距）
+ padding：在一个声明中设置所有内边距属性
+ padding-top:设置元素的上内边距
+ padding-right：设置元素的右内边距
+ padding-bottom：设置元素的下内边距
+ padding-lfet：设置元素的左内边距

margin（外边距）：让盒子与盒子之间保留一定空隙   
...

border（边框）：盒子本身   
border是个复合属性，属性的顺序是（border-width，border-style，border-color）


### 插入样式表
##### 外部样式表
当样式需要应用于很多页面时，外部样式表将是理想的选择。在使用外部样式表的情况下，你可以通过改变一个文件来改变整个站点的外观。每个页面使用 <link> 标签链接到样式表。<link> 标签在（文档的）头部：
``` CSS
<head>
<link rel="stylesheet" type="text/css" href="mystyle.css" />
</head>
```
##### 内部样式表
当单个文档需要特殊的样式时，就应该使用内部样式表。你可以使用style标签在文档头部定义内部样式表
``` CSS
<head>
<style type="text/css">
  hr {color: sienna;}
  p {margin-left: 20px;}
  body {background-image: url("images/back40.gif");}
</style>
</head>
```
##### 内联样式
``` CSS
<p style="color: sienna; margin-left: 20px">
This is a paragraph
</p>
```
如果某些属性在不同的样式表中被同样的选择器定义，那么属性值将从更具体的样式表中被继承过来

### CSS3新特性
+ RGBA透明度：RGB(红色R+绿色G+蓝色B),RGBA则在其基础上增加了Alpha通道，用来设置透明值
+ 既然有透明度，那么就有不透明度（最简单的蒙版效果）
+ 块阴影和圆角阴影：box-shadow text-shadow
``` CSS
<style>
        div {
            /*设置宽高*/
            width: 200px;
            height: 50px;
            /*设置背景色*/
            background-color: red;

            /*设置外边距*/
            margin: 20px;

            /*设置块阴影
             参数一:水平偏移
             参数二:垂直偏移
             参数三:模糊距离
             参数四:阴影颜色
            */
            box-shadow: 10px 10px 10px blue;
        }
    </style>

    <body>
        <div>div</div>
    </body>
```
+ 圆角：border-radius
+ 边框图片：border-image(不常用，用到再说)
+ 形变：transform: none | <transform-function>[<transform-fuction>]（后面结合实例，便于理解）

### CSS布局
默认情况下，所有网页标签都在标准流布局中（从上往下，从左往右，相互依赖）;脱离标准流（就是固定在一个地方），脱离标准流主要的两种方式有两种;注意：标签只要一浮动，它的类型就会被强制转为行内块级标签   
+ float属性：让标签浮动在父标签的左边和右边（显然不够灵活）
+ position属性：结合left、right、top、bottom属性就不一样了（显然这个比较厉害）
``` 
position 属性值的含义：
static 是默认值。任意 position: static; 的元素不会被特殊的定位。一个 static 元素表示它不会被“positioned”，一个 position 属性被设置为其他值的元素表示它会被“positioned”。

relative 表现的和 static 一样，除非你添加了一些额外的属性。在一个相对定位（position属性的值为relative）的元素上设置 top 、 right 、 bottom 和 left 属性会使其偏离其正常位置。其他的元素则不会调整位置来弥补它偏离后剩下的空隙。

fixed: 一个固定定位（position属性的值为fixed）元素会相对于视窗来定位，这意味着即便页面滚动，它还是会停留在相同的位置。和 relative 一样， top 、 right 、 bottom 和 left 属性都可用。

absolute 是最棘手的position值。 absolute 与 fixed 的表现类似，除了它不是相对于视窗而是相对于最近的“positioned”祖先元素。如果绝对定位（position属性的值为absolute）的元素没有“positioned”祖先元素，那么它是相对于文档的 body 元素，并且它会随着页面滚动而移动。记住一个“positioned”元素是指p osition 值不是 static 的元素。

overflow    设置当元素的内容溢出其区域时发生的事情。
clip    设置元素的形状。元素被剪入这个形状之中，然后显示出来。
vertical-align  设置元素的垂直对齐方式。
z-index 设置元素的堆叠顺序。
```
容器比nav元素高的时候可以正常工作。如果容器比nav元素低，那么nav会溢出到容器的外面。
``` CSS
.container {
  position: relative;
}
nav {
  position: absolute;
  left: 0px;
  width: 200px;
}
section {
  /* position is static by default */
  margin-left: 200px;
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  height: 70px;
  background-color: white;
  width: 100%;
}
body {
  margin-bottom: 120px;
}
```

##### float
布局中常用的CSS属性是 float 。Float 可用于实现文字环绕图片
``` CSS
img {
  float: right;
  margin: 0 0 1em 1em;
}
```

##### clear
clear 属性被用于控制浮动
``` CSS
<div class="box">...</div>
<section>...</section>

.box {
  float: left;
  width: 200px;
  height: 100px;
  margin: 1em;
}

# section 元素实际上是在 div 之后的（译注：DOM结构上）。然而 div 元素是浮动到左边的，于是 section 中的文字就围绕了 div ，并且 section 元素包围了整个元素。如果我们想让 section 显示在浮动元素之后呢
.box {
  float: left;
  width: 200px;
  height: 100px;
  margin: 1em;
}
.after-box {
  clear: left;
}
```
完全使用 float 来实现页面的布局
```
nav {
  float: left;
  width: 200px;
}
section {
  margin-left: 200px;
}
```

##### 百分比宽度布局
当窗口宽度很窄时 nav 的内容会以一种不太友好的方式被包裹起来
``` CSS
nav {
  float: left;
  width: 25%;
}
section {
  margin-left: 25%;
}
```


##### 清除浮动
图片比包含它的元素还高， 而且它是浮动的，于是它就溢出到了容器外面
``` CSS
<div class="clearfix">
<img />
<\div>

img {
  float: right;
}

.clearfix {
  overflow: auto;
  zoom: 1;
}
```

##### 媒体查询
媒体查询是做此事所需的最强大的工具。让我们使用百分比宽度来布局，然后在浏览器变窄到无法容纳侧边栏中的菜单时，把布局显示成一列：
``` CSS
@media screen and (min-width:600px) {
  nav {
    float: left;
    width: 25%;
  }
  section {
    margin-left: 25%;
  }
}
@media screen and (max-width:599px) {
  nav li {
    display: inline;
  }
}
```

##### inline-block
创建很多网格来铺满浏览器
``` CSS
.box2 {
  display: inline-block;
  width: 200px;
  height: 100px;
  margin: 1em;
}
```
可以使用 inline-block 来布局。有一些事情需要你牢记
+ vertical-align 属性会影响到 inline-block 元素，你可能会把它的值设置为 top 。
+ 你需要设置每一列的宽度
+ 如果HTML源代码中元素之间有空格，那么列与列之间会产生空隙
``` CSS
nav {
  display: inline-block;
  vertical-align: top;
  width: 25%;
}
.column {
  display: inline-block;
  vertical-align: top;
  width: 75%;
}
```

##### flexbox
新的 flexbox 布局模式被用来重新定义CSS中的布局方式:
``` CSS
.container {
  display: -webkit-flex;
  display: flex;
}
.initial {
  -webkit-flex: initial;
          flex: initial;
  width: 200px;
  min-width: 100px;
}
.none {
  -webkit-flex: none;
          flex: none;
  width: 200px;
}
.flex1 {
  -webkit-flex: 1;
          flex: 1;
}
.flex2 {
  -webkit-flex: 2;
          flex: 2;
}


# 使用 Flexbox 的居中布局
.vertical-container {
  height: 300px;
  display: -webkit-flex;
  display:         flex;
  -webkit-align-items: center;
          align-items: center;
  -webkit-justify-content: center;
          justify-content: center;
}
```

##### 居中
水平居中:如果是行内、行内块级标签，设置text-align: center;如果是块级标签，则需设置 margin: 0 auto;   
``` CSS
# 使用 max-width 替代 width 可以使浏览器更好地处理小窗口的情况
#main {
  max-width: 600px;
  margin: 0 auto; 
}

# 你设置一个元素为 box-sizing: border-box; 时，此元素的内边距和边框不再会增加它的宽度。
.simple {
  width: 500px;
  margin: 20px auto;
  -webkit-box-sizing: border-box;
     -moz-box-sizing: border-box;
          box-sizing: border-box;
}

```
垂直居中: 如果是行内、行内块级标签，设置line-height:总高度;如果是块级标签，需要通过定位来做（一般不会将块级标签做垂直居中操作）

##### DOM元素位置和尺寸大小
+ clientHeight和clientWidth用于描述元素内尺寸，是指 元素内容+内边距 大小，不包括边框、外边距、滚动条部分
+ offsetHeight和offsetWidth用于描述元素外尺寸，是指 元素内容+内边距+边框，不包括外边距和滚动条部分
+ clientTop和clientLeft返回内边距的边缘和边框的外边缘之间的水平和垂直距离，也就是左，上边框宽度
+ offsetTop和offsetLeft表示该元素的左上角（边框外边缘）与已定位的父容器（offsetParent对象）左上角的距离
+ offsetParent对象是指元素最近的定位（relative,absolute）祖先元素，递归上溯，如果没有祖先元素是定位的话，会返回null
``` CSS
<div id="divParent" style="padding: 8px; background-color: #aaa; position: relative;">
        <div id="divDisplay" style="background-color: #0f0; margin: 30px; padding: 10px;
            height: 200px; width: 200px; border: solid 3px #f00;">
        </div>
    </div>

clientHeight就是div的高度+上下各10px的padding，clientWidth同理
而clientLeft和ClientTop即为div左、上边框宽度
offsetHeight是clientHeight+上下个3px的边框宽度之和，offsetWidth同理
offsetTop是div 30px的 maggin+offsetparent 8px的 padding，offsetLeft同理
```
scrollWidth和scrollHeight是元素的内容区域加上内边距加上溢出尺寸，当内容正好和内容区域匹配没有溢出时，这些属性与clientWidth和clientHeight相等.   
scrollLeft和scrollTop是指元素滚动条位置，它们是可写的

##### 相对于文档与视口的坐标
文档坐标就是整个页面部分，而不仅仅是窗口可见部分，还包括因为窗口大小限制而出现滚动条的部分，它的左上角就是我们所谓相对于文档坐标的原点。   
视口是显示文档内容的浏览器的一部分，它不包括浏览器外壳（菜单，工具栏，状态栏等），也就是当前窗口显示页面部分，不包括滚动条。文档左上角和视口左上角相同，一般来讲在两种坐标系之间进行切换，需要加上或减去滚动的偏移量（scroll offset）   
```
# 判定浏览器窗口的滚动条位置,window对象的pageXoffset和pageYoffset提供这些值(窗口坐标相对于文档窗口的位移)

# 任何HTML元素都拥有offectLeft和offectTop属性返回元素的X和Y坐标，对于很多元素，这些值是文档坐标，但是对于以定位元素后代及一些其他元素（表格单元），返回相对于祖先的坐标。我们可以通过简单的递归上溯累加计算
function getElementPosition(e) {
            var x = 0, y = 0;
            while (e != null) {
                x += e.offsetLeft;
                y += e.offsetTop;
                e = e.offsetParent;
            }
            return { x: x, y: y };
        }

# 算视口坐标就相对简单了很多，可以通过调用元素的getBoundingClientRect方法。方法返回一个有left、right、top、bottom属性的对象，分别表示元素四个位置的相对于视口的坐标。getBoundingClientRect所返回的坐标包含元素的内边距和边框，不包含外边距。兼容性很好
```
jquery获取html元素的绝对位置和相对位置
``` javascript
$("#elem").offset().top
$("#elem").offset().left

$("#elem").position().top
$("#elem").position().left
```

###### CSS实现响应式全屏背景图
background-size 属性规定背景图像的尺寸
``` CSS
background-size: length|percentage|cover|contain;

length: 设置背景图像的高度和宽度; 第一个值设置宽度，第二个值设置高度; 如果只设置一个值，则第二个值会被设置为 "auto";
percentage: 以父元素的百分比来设置背景图像的宽度和高度; 第一个值设置宽度，第二个值设置高度; 如果只设置一个值，则第二个值会被设置为 "auto"
cover: 把背景图像扩展至足够大，以使背景图像完全覆盖背景区域;背景图像的某些部分也许无法显示在背景定位区域中
contain: 把图像图像扩展至最大尺寸，以使其宽度和高度完全适应内容区域
```
为了应对小屏幕，我用photoshop将背景图按比例缩放到768px * 505px, 下面是媒体查询的写法：
``` CSS
@media only screen and (max-width: 767px) {
  body {
    background-image: url(images/background-photo-mobile-devices.jpg);
  }
}
```


##### 浏览器窗口大小改变时事件
``` CSS
window.onresize=function(){  
                 changeDivHeight();  
            };
```

### jQuery

##### jQuery CSS 操作
css() 方法返回或设置匹配的元素的一个或多个样式属性
```
# 返回第一个匹配元素的 CSS 属性值
$(selector).css(name)

# 设置所有匹配元素的指定 CSS 属性
$(selector).css(name,value)

# 使用函数来设置 CSS 属性,设置所有匹配的元素中样式属性的值。此函数返回要设置的属性值。接受两个参数，index 为元素在对象集合中的索引位置，value 是原先的属性值。

# 使用函数来设置 CSS 属性
$(selector).css(name,function(index,value))
#index - 可选。接受选择器的 index 位置;oldvalue - 可选。接受 CSS 属性的当前值。
```








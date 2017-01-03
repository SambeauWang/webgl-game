### 函数
JavaScript还有一个免费赠送的关键字arguments，它只在函数内部起作用，并且永远指向当前函数的调用者传入的所有参数。arguments类似Array但它不是一个Array：
``` js
function foo(x) {
    alert(x); // 10
    for (var i=0; i<arguments.length; i++) {
        alert(arguments[i]); // 10, 20, 30
    }
}
foo(10, 20, 30);
```
ES6标准引入了rest参数，上面的函数可以改写为：
``` js
function foo(a, b, ...rest) {
    console.log('a = ' + a);
    console.log('b = ' + b);
    console.log(rest);
}

foo(1, 2, 3, 4, 5);
// 结果:
// a = 1
// b = 2
// Array [ 3, 4, 5 ]

```
用...标识，从运行结果可知，传入的参数先绑定a、b，多余的参数以数组形式交给变量rest，所以，不再需要arguments我们就获取了全部参数。如果传入的参数连正常定义的参数都没填满，也不要紧，rest参数会接收一个空数组

##### 全局作用域
不在任何函数内定义的变量就具有全局作用域。实际上，JavaScript默认有一个全局对象window，全局作用域的变量实际上被绑定到window的一个属性：
``` js
'use strict';

var course = 'Learn JavaScript';
alert(course); // 'Learn JavaScript'
alert(window.course); // 'Learn JavaScript'
```
由于JavaScript的变量作用域实际上是函数内部，我们在for循环等语句块中是无法定义具有局部作用域的变量的：
``` js
'use strict';

function foo() {
    for (var i=0; i<100; i++) {
        //
    }
    i += 100; // 仍然可以引用变量i
}
```
为了解决块级作用域，ES6引入了新的关键字let，用let替代var可以申明一个块级作用域的变量：
``` js
'use strict';

function foo() {
    var sum = 0;
    for (let i=0; i<100; i++) {
        sum += i;
    }
    i += 1; // SyntaxError
}
```

##### 常量
ES6标准引入了新的关键字const来定义常量，const与let都具有块级作用域：
``` js
'use strict';

const PI = 3.14;
PI = 3; // 某些浏览器不报错，但是无效果！
PI; // 3.14
```

##### 方法
在一个对象中绑定函数，称为这个对象的方法
``` js
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25, 正常结果
getAge(); // NaN
```
如果以对象的方法形式调用，比如xiaoming.age()，该函数的this指向被调用的对象，也就是xiaoming，这是符合我们预期的。如果单独调用函数，比如getAge()，此时，该函数的this指向全局对象，也就是window
``` js
'use strict';

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        function getAgeFromBirth() {
            var y = new Date().getFullYear();
            return y - this.birth;
        }
        return getAgeFromBirth();
    }
};

xiaoming.age(); // Uncaught TypeError: Cannot read property 'birth' of undefined
```
结果又报错了！原因是this指针只在age方法的函数内指向xiaoming，在函数内部定义的函数，this又指向undefined了！（在非strict模式下，它重新指向全局对象window！）;修复的办法也不是没有，我们用一个that变量首先捕获this：
``` js
'use strict';

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: function () {
        var that = this; // 在方法内部一开始就捕获this
        function getAgeFromBirth() {
            var y = new Date().getFullYear();
            return y - that.birth; // 用that而不是this
        }
        return getAgeFromBirth();
    }
};

xiaoming.age(); // 25
```

##### apply
要指定函数的this指向哪个对象，可以用函数本身的apply方法，它接收两个参数，第一个参数就是需要绑定的this变量，第二个参数是Array，表示函数本身的参数
``` js
function getAge() {
    var y = new Date().getFullYear();
    return y - this.birth;
}

var xiaoming = {
    name: '小明',
    birth: 1990,
    age: getAge
};

xiaoming.age(); // 25
getAge.apply(xiaoming, []); // 25, this指向xiaoming, 参数为空
```
另一个与apply()类似的方法是call()，唯一区别是：apply()把参数打包成Array再传入;call()把参数按顺序传入。
``` js
Math.max.apply(null, [3, 5, 4]); // 5
Math.max.call(null, 3, 5, 4); // 5
```
##### 装饰器
``` js
var count = 0;
var oldParseInt = parseInt; // 保存原函数

window.parseInt = function () {
    count += 1;
    return oldParseInt.apply(null, arguments); // 调用原函数
};

// 测试:
parseInt('10');
parseInt('20');
parseInt('30');
count; // 3
```

##### 高级函数
map
``` js
function pow(x) {
    return x * x;
}

var arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];
arr.map(pow); // [1, 4, 9, 16, 25, 36, 49, 64, 81]
```
Array的reduce()把一个函数作用在这个Array的[x1, x2, x3...]上，这个函数必须接收两个参数，reduce()把结果继续和序列的下一个元素做累积计算
``` js
var arr = [1, 3, 5, 7, 9];
arr.reduce(function (x, y) {
    return x + y;
}); // 25
```
Array的filter()也接收一个函数。和map()不同的是，filter()把传入的函数依次作用于每个元素，然后根据返回值是true还是false决定保留还是丢弃该元素
``` js
var arr = [1, 2, 4, 5, 6, 9, 10, 15];
var r = arr.filter(function (x) {
    return x % 2 !== 0;
});
r; // [1, 5, 9, 15]
```

##### 闭包
在函数lazy_sum中又定义了函数sum，并且，内部函数sum可以引用外部函数lazy_sum的参数和局部变量，当lazy_sum返回函数sum时，相关参数和变量都保存在返回的函数中，这种称为“闭包（Closure）”的程序结构拥有极大的威力。
``` js
// 当我们调用lazy_sum()时，每次调用都会返回一个新的函数，即使传入相同的参数：
function lazy_sum(arr) {
    var sum = function () {
        return arr.reduce(function (x, y) {
            return x + y;
        });
    }
    return sum;
}
```
“创建一个匿名函数并立刻执行”的语法：
``` js
function count() {
    var arr = [];
    for (var i=1; i<=3; i++) {
        arr.push((function (n) {
            return function () {
                return n * n;
            }
        })(i));
    }
    return arr;
}

var results = count();
var f1 = results[0];
var f2 = results[1];
var f3 = results[2];

f1(); // 1
f2(); // 4
f3(); // 9
```
由于JavaScript语法解析的问题，`function (x) { return x * x } (3);`会报SyntaxError错误，因此需要用括号把整个函数定义括起来;

##### 箭头函数
``` js
x => x * x
// ==
function (x) {
    return x * x;
}

x => {
    if (x > 0) {
        return x * x;
    }
    else {
        return - x * x;
    }
}

// 两个参数:
(x, y) => x * x + y * y
```

##### generator
``` js
function* fib(max) {
    var
        t,
        a = 0,
        b = 1,
        n = 1;
    while (n < max) {
        yield a;
        t = a + b;
        a = b;
        b = t;
        n ++;
    }
    return a;
}

// fib(5)仅仅是创建了一个generator对象，还没有去执行它。调用generator对象有两个方法，一是不断地调用generator对象的next()方法：
var f = fib(5);
f.next(); // {value: 0, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 1, done: false}
f.next(); // {value: 2, done: false}
f.next(); // {value: 3, done: true}
```
next()方法会执行generator的代码，然后，每次遇到yield x;就返回一个对象{value: x, done: true/false}，然后“暂停”。返回的value就是yield的返回值，done表示这个generator是否已经执行结束了。如果done为true，则value就是return的返回值。
第二个方法是直接用for ... of循环迭代generator对象，这种方式不需要我们自己判断done：
``` js
for (var x of fib(5)) {
    console.log(x); // 依次输出0, 1, 1, 2, 3
}
```

### 面向对象编程
把xiaoming的原型指向了对象Student，看上去xiaoming仿佛是从Student继承下来的：
``` js
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    }
};

var xiaoming = {
    name: '小明'
};

xiaoming.__proto__ = Student;
```
在编写JavaScript代码时，不要直接用obj.__proto__去改变一个对象的原型，并且，低版本的IE也无法使用__proto__。Object.create()方法可以传入一个原型对象，并创建一个基于该原型的新对象，但是新对象什么属性都没有，因此，我们可以编写一个函数来创建xiaoming
``` js
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    }
};

function createStudent(name) {
    // 基于Student原型创建一个新对象:
    var s = Object.create(Student);
    // 初始化新对象:
    s.name = name;
    return s;
}

var xiaoming = createStudent('小明');
xiaoming.run(); // 小明 is running...
xiaoming.__proto__ === Student; // true
```
##### 创建对象
当我们用obj.xxx访问一个对象的属性时，JavaScript引擎先在当前对象上查找该属性，如果没有找到，就到其原型对象上找，如果还没有找到，就一直上溯到Object.prototype对象，最后，如果还没有找到，就只能返回undefined。
``` js
var arr = [1, 2, 3];
arr ----> Array.prototype ----> Object.prototype ----> null

function foo() {
    return 0;
}
foo ----> Function.prototype ----> Object.prototype ----> null
```

##### 构造函数
``` js
function Student(name) {
    this.name = name;
    this.hello = function () {
        alert('Hello, ' + this.name + '!');
    }
}

// xiaoming ----> Student.prototype ----> Object.prototype ----> null
```
在JavaScript中，可以用关键字new来调用这个函数，并返回一个对象：如果不写new，这就是一个普通函数，它返回undefined。但是，如果写了new，它就变成了一个构造函数，它绑定的this指向新创建的对象，并默认返回this，也就是说，不需要在最后写return this;
``` js
xiaoming.constructor === Student.prototype.constructor; // true
Student.prototype.constructor === Student; // true

Object.getPrototypeOf(xiaoming) === Student.prototype; // true

xiaoming instanceof Student; // true
```
用new Student()创建的对象还从原型上获得了一个constructor属性，它指向函数Student本身; 函数Student恰好有个属性prototype指向xiaoming、xiaohong的原型对象，但是xiaoming、xiaohong这些对象可没有prototype这个属性，不过可以用__proto__这个非标准用法来查看
``` js
xiaoming.name; // '小明'
xiaohong.name; // '小红'
xiaoming.hello; // function: Student.hello()
xiaohong.hello; // function: Student.hello()
xiaoming.hello === xiaohong.hello; // false
```
要让创建的对象共享一个hello函数，根据对象的属性查找原则，我们只要把hello函数移动到xiaoming、xiaohong这些对象共同的原型上就可以了，也就是Student.prototype
``` js
function Student(name) {
    this.name = name;
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
};
```
![Alt text](./img/js_class.png)

### 正则表达式
``` js
var parse_url = /^(?:([A-Za-z]+):)?(\/{0, 3})([0-9.\-A-Za-z]+)(?:: (\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
var url = "http://www.ora.com:80/goodparts?q#fragment";
```
+ ^字符表示这个字符串的开端
+ (?:([A-Za-z]+):)?匹配一个协议名，但仅当它之后跟随一个:（冒号）的时候才匹配。（？:..)表示一个非捕获型分组。后缀？表示这个分组是可选的。
+ 正则表达式之捕获型分组与非捕获型分组(http://blog.csdn.net/xqg666666/article/details/44955525)（…)表示一个捕获型分组, 一个捕获型分组将复制它所匹配的文本，并将其放入result数组中.毎个捕获型分组都将被指定一个编号
+  (\/{0, 3}), \/表示一个应该被匹配的/(斜杠)。它用\ (反斜杠）来进行转 义。后缀{0, 3}表示/将被匹配0次，或者1到3次之间
+ ([0-9.\-A-Za-z]+)将匹配一个主机名，一个或多个数宇、宇母或.或-组成。 -将被转义为\-以防止与表示范围的连宇符相混淆
+ (\d+))?将匹配端口号
+ (?:\/([^?#]*))以一个/开始。之后的字符类[^?#]以一个^开始，它表示这个类包含除?和#之外的所有字符。*表示这个字符类将被匹配0次或多次
+ (?:\?([^#]*))?包含0个或多个非#字符
+ (?:#(.*))? 匹配除结束符以外的所有字符,$表示这个字符串的结束

``` js
var parse_nuinber = /^-?\d+(?:\.\d*)?(?:e[+\-]?\d+)?$/i;
```
+ /^ $/i:i标识规定当匹配字母时忽略大小写

##### (1)结构
创建一个RegExp对象优先的方法是使用正则表达式字面量,被包围在一对斜杠中, 有3个标志能在RegExp中设置。它们分别由字母g、i和m来标示
```
G 有3个标志能在RegExp中设置。它们分别由字母g、i和m来标示
I 大小写不敏感（忽略字符大小写）
M 多行{A和$能匹行结束符）
``` js
另一个方法是使用RegExp构造器, 这个构造器接收一个字符串, 并把它编译为一个RegExp对象. 因为反斜扛在正则表达式和在字符串字面中有一些不同的含义。通常需要双写反斜扛及对引号进行转义
``` js
var myRegex = new RegExp("...", "g");
```
第二个参数是一个指定标志的字符串

##### (2)正则表达式选择
\f是换页符, \n是换行符, \r是回车符，\t 是制表（tab)符，并且 \u允许指定一个Unicode字符来表示一个十六进制的常证
\d等同于[0-9],它匹配一个数字; \D表示与其相反[^0-9]
\w等同于[0-9A-Z_a-z],\W则表不与其相反的：[^0-9A-Z_a-z]

### 方法
##### (1)Array
array.concat方法返回一个新数组，它包含的浅复制（shallow copy)并将1个或多个参 数item附加在其后。如果参数item是一个数组，那么它的每个元素会被分别添加
``` js
var a = ['a', 'b'];
var b = ['c', 'd'];
var c = a.concat(a,b);
//['a', 'b', 'c', 'd'];
```
array.join把array构造成一个字符串, 并用一个separator为分隔符
``` js
var a = ['a', 'b', 'c'];

var c = a.join(' ');
```
array.pop和push方法使数组array像堆找（Stack) —样工作。pop方法移除array中的最后一个元素并返回该元素。
reverse方法反转array中的元素的顺序。它返回当前的array;
``` js
var a =['a', 'b', 'c'];
var b = a.reverse();
//a和b都是['c', 'b', 'a']
```
shift方法移除数组array中的第一个元素并返回该元素
slice方法对array中的一段做浅复制。第一个被复制的元素是array[start]。它将一直复制到array[end]为止。end参数是可选的，并且默认值是该数组的长度array.length。 如果两个参数中的任何一个是负数,array.length将和它们相加来试图使它们成为非负数。 如果start大于等于array.length,得到的结果将是一个新的空数组。

##### (2)array.sort
JavaScript的默认比较函数假定所有要被徘序的元索都是字符串;如果你想基于多个键值进行排序，你需要再次做更多的工作
``` js
var by = function (name, minor)
{
  return function (o, p) {
      var a, b;
      if (o && p && typeof o === 'object' && typeof p = 'object'){
          a = o[name];
          b = p[name];
          if (a === b) {
            return typeof minor === 'function'?minor(o,p):0;
          }
          if(typeof a === typeof b){
            return a<b?-1:1;
          }
      } else{
         throw {
            name: 'name',
            message: 'Expected an object when sorting by' + name;
          };
      };
    };
};

s.sort(by('last', by('first')));
```
splice方法从array中移除1个或多个元素，并用新的item替换它们。参数start是从数组array中移除元素的开始位置。参数deJeteCount是要移除的元素个.如果有额外的参数，那些item都将插入到所移除元素的位置上。它返回一个包含被移除元素的数组。
``` js
var a = ['a', 'b', 'c'];
var r = a.splice(1,1 'ache', 'bug');
// a = ['a', 'ache', 'bug', 'c']
// r = ['b']
```
unshift方法像push方法一样用干将元素添加到数组中，但它是把item插入到array的开始部分而不是尾部。
``` js
Array.method('unshift', function () {
  this.splice.apply(this,
      [0,0].concat(Array.prototype.slice.apply(arguments))); return this.length;
}
```

##### (3)function.apply
apply方法调用函数function,传递一个将被绑定到this上的对象和一个可选的参数数组
``` js
Function.method('bind', function (that) {
  //返回一个必数，调用这个函数就像它是那个对象的方法一样。
  var method = this,
    slice = Array.prototype.slice,
    args = slice.apply(arguments, [1]);
    return function () {
      return method.apply(that,
          args.concat(slice.apply(arguments, [0])));
    };
});

var x = function () {
    return this.value;
  ).bind({value: 666}};
alert(x()); // 666
```

##### object.hasOwnProperty
如果这个object包含了一个名为name的属性，那么hasOwnProperty方法返回true.原型链中的同名属性是不会被检査的.

##### regexp.exec
exec方法是使用正则表达式的最强大的方法。如果它成功地匹配regexp和字符串string,它会返回一个数组。数组中下标为0的元素将包含正则表达式regexp匹配的子字符串。下标为1的元素是分组1捕获的文本，下标为2的元素是分组2捕获的文本, 依此类推。如果匹配失败，那么它会返回null.
通过在一个循环中调用exec去査询一个匹配模式在一个字符串中发生几次。如果你提前退出了这个循环，再次进入这个循环前必须把regexp, lastlndex重置到0。^因子也仅匹配regexp.lastlndex为0的情况

test方法是使用正则表达式的最简单（和最快）的方法。如果该regexp匹配string,它 返回true,否则，它返回false。不要对这个方法使用g标识

##### string
+ **charAt**方法返回在string中pos位的字符。如果pos小干0或大于等于字符串的长度string.length,它会返回空字符串
+ **concat**方法通过将其他的字符串连接在一起来构造一个新的字符串
+ **indexOf(searchString, position)**方法在string内査找另一个字符串searchString,如果它被找到，则返回第一个匹配字符的位置,否则返回-1
+ **string.lastlndexOf(searchString, position)**方法和indexOf方法类似，只不过它是从该字符串的末尾开始査找而不是从开头：
+ **string.localeCompare(that)**方法比较两个字符串。如果string比字符串that小，那么结果为负数。如采它们是相等的，那么结果为0
+ **string.match(regexp)**方法匹配一个字符串和一个正则表达式。它依据g标识来决定如何进行匹配。如果没有g标识，那么调用string .match(regexp)的结果与调用regrexp.exec( string)的结果相同。如果regexp带有g标识,那么它返回一个包含除捕获分组之外的所有匹配的数组
+ string.replace(searchValue, replacevalue)对string进行査找和替换的操作，并返回一个新的字符串，参数seajrchVaJue可以是一个字符串或一个正则表达式对象。如果它是一个字符串，那么searcAVaJue只会在第一次出现的地方被替换,如果searcftvaiue是一个正则表达式并且带有g标志，那么它将替换所有匹配之处; repiaceVaiue可以是一个字符串或一个函数。如果repiaceValue是一个字符串，字符$拥有特别的含义
``` js
$$	$
$&	整个匹配的文本
$number	分组捕获的文本
$`	匹配之前的文本
$'	匹配之后的文本
```
如果rep_lacevajue是一个函数，此方法将对毎个匹配依次调用它，并且该函数返回的字符串将被用作替换文本。传递给这个函数的第一个参数是整个被匹配的文本。第二个参数是分组1捕获的文本，下一个参数是分组2捕获的文本
+ string.search(regexp)方法和indexOf方法类似，只是它接受一个正则表达式对象作为参数而不是一个字符串。如果找到匹配，它返回第一个匹配的首字符位，如果没有找到匹配，则返回-1。此方法会忽略g标志，且没有position参数
+ string.slice(start, end)方法复制string的一部分来构造一个新的字符串。如果start参数是负数，它将与string.length 相加。end参数是可选的，并且它的默认值是string.length。如果end参数是负数，那么它将与string.length 相加。end参数是一个比最末一个字符的位置值还大的数。要想得到从位Sp开始的n个字符，就用string.Slice(P, p + n)
+ string.split(separator, limit)方法把这个string分割成片段来创建一个字符串数组。可选参数limit可以限制被分割的片段数量。separator参数可以是一个字符串或一个正则表达式。
``` js
var digits = '0123456789';
var a = digits.split('',5);
// a = ['1', '2', '3', '4', '56789'];
```

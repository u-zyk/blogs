/* 无法实现？ 每次点击按钮，执行对应的方法，方法中的i不是私有的，而是全局的，
而此时全局的i已经是循环结束的5了…… */
/* var btnList = document.querySelectorAll('.btn');
for(var i = 0; i < btnList.length; i++) {
    btnList[i].onclick = function() {
        console.log(`当前点击按钮的索引：${i}`)
    };
}
 */
// 解决办法一：闭包解决方案，利用闭包的"保存机制"
// 每一轮循环的时候，都创建一个闭包(不释放的上下文)，
//   闭包中存储自己的私有变量i，并且值是每一轮循环的索引；当点击按钮
//   执行对应的函数，遇到一个变量i，不要再去全局找了，而是让其去所属的闭包中查找即可……

// @1
/* var btnList = document.querySelectorAll('.btn');
for (var i = 0; i < btnList.length; i++) {
    //循环五次，产生五个不释放的闭包，每一闭包中，都存在一个私有变量i，
    // 变量的值对应的索引 0/1/2/3/4
    (function (i) {
        btnList[i].onclick = function () {
            console.log(`当前点击按钮的索引：${i}`)
        }
    })(i);
}
 */
// @2 
/* var btnList = document.querySelectorAll('.btn');
for (var i = 0; i < btnList.length; i++) {
    btnList[i].onclick = (function (i) {
        return function(){
            console.log(`当前点击按钮索引:${i}`);
        };
    })(i);
} */

// @3 NodeList集合本身具备forEach方法，和数组中类似的，都是用来迭代集合中的每一项
var btnList = document.querySelectorAll('.btn');
btnList.forEach(function (item, index) {
    // 迭代集合中的每一项，都会把这个回调函数执行，产生一个闭包「因为上下文中创建的小函数，
    //  被外层的按钮对象的onclcik占用了；每个闭包中有一个私有变量index,存储的是当前这一项的索引」
    item.onclik = function () {
        console.log(`当前点击按钮的索引: ${index}`);
    };
});

// 第一种办法：命令是编程「HOW」如何去做
// 第二种办法：函数式编程「WHAT」结果是啥
/* 
命令式编程：自己写循环，这样我们可以把控循环的具体步骤，
    管控循环过程 --> 灵活 --> 代码繁琐
*/
/* 
函数式编程：把循环的步骤封装成为一个函数，我们无需知道
  函数内部是如何迭代的，我们只需要知道，它会迭代每一项，
  每一次会把回调函数执行，我们在回调函数中做自己的事情即可
  --> 开发效率高 --> 不够灵活
*/
// 推荐使用 函数式编程

// @4 也是基于闭包的方案，只不过利用的是LET会产生块级上下文
/* let btnList = document.querySelectorAll('.btn');
for(let i = 0; i < btnList.length; i++) {
    // 每一轮循环都产生一个私有的块级上下文，里面的内容(函数)被外部占用，
    //也会产生一个闭包；而且每个闭包中，都有一个私有变量i记录索引
    btnList[i].onclick = function() {
        console.log(`当前点击按钮的索引：${i}`)
    };
} */
//闭包方案虽然可以解决，但是比较消耗内存
// =============

// 解决方案二：自定义属性

let btnList = document.querySelectorAll('.btn');
let i = 0;
for (; i < btnList.length; i++) {
    // 最开始每轮循环的时候，给每一个按钮对象都设定一个自定义属性myIndex,存储它的索引
    btnList[i].myIndex = i;
    btnList[i].onclick = function () {
        // 每一次点击的时候，基于THIS(当前操作元素)获取之前存放的自定义属性值
        console.log(`当前点击按钮的索引：${this.myIndex}`)
    };
}

// 性能比闭包要好一些，但是也有一些性能消耗{元素对象 & 节点集合 & 绑定的方法 都是开辟的堆内存}
// ============
// 解决方案三： 终极方案 事件委托
// 点击每一个按钮，除了触发按钮的点击事件行为，根据冒泡传播机制，也会把body的点击事件行为触发
/* document.body.onclick = function (ev) {
    console.log(ev);
    let target = ev.target;
    if(target.tagName === 'BUTTON' && target.className === "btn") {
        // 点击的事件源是按钮
        let index = target.getAttribute('data-index');
        console.log(`当前点击按钮的索引:${index}`)
    }
}; */

// ==========
// 能否实现没间隔1秒输出 0 1 2？
for (var i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i)
    }, i * 1000); // 等待时间 0ms(5~7ms) 1000ms 2000ms
}
// 现在效果是，没间隔1000ms都输出的是3？定时器执行，方法中的i不是私有的，
//   向上级找就是全局的i「此时全局i已经是循环结束的3」

// @1 
/* for (let i = 0; i < 3; i++) {
    setTimeout(function () {
        console.log(i)
    },i * 1000); 
} */

// @2
/* let i = 0;
for (; i < 3; i++) {
    (function () {
        setTimeout(function () {
            console.log(i)
        }, i * 1000);
    })(i)
} */

// @3
/* const fn = i => {
    return function () {
        console.log(i)
    }
}
let i = 0;
for (; i < 3; i++) {
    setTimeout(fn(i), i * 1000);
} */

// @4
let i = 0;
for (; i < 3; i++) {
    // 设置定时器：
    // 参数1: 回调函数，到时间执行的方案
    // 参数2: 等待时间
    // 参数3: 按回调函数“预先传递”的实参值「底层本质也是闭包 柯理化函数思想」
    setTimeout(function (n) {
        console.log(n)
    }, i * 1000, i);
}
class Queue {
    container = [];
    enter(element) {
        this.container.push(element);
    }
    leave() {
        return this.container.shift();
    }
    size() {
        return this.container.length;
    }
    value() {
        return this.container.slice(0);
    }
};
let queue = new Queue;

/* **面试题：击鼓传花**
+ N个人一起玩游戏，围城一圈，从1开始数数，数到 M 的人自动淘汰；
    最后剩下的人会取得胜利，问最后剩下的是原来的哪一位？ */
// n: 参加游戏的人数
// m: 数到m数出局

const game = function game(n, m) {
    // 所有人依次进入队列
    let qe = new Queue,
        i = 1;
    for (; i <= n; i++) qe.enter(i);
       
    // 开始数数:数到m之前的内柔的操作“都是先移除队列，再进入队列”，
    //     数到m直接移除队列即可；
    while(qe.size() > 1) {
        i = 1;
        for (; i <= m - 1; i++) qe.enter(qe.leave());
        qe.leave();
    }
    // 把队列中唯一剩余的值返回
    return qe.value()[0];
};
console.log(game(8, 5))
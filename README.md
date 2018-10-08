# is-node-in-cycle-benchmark
测试在 graphlib 如何快速判断一个节点是否在环中。

提供如下几种算法：

1. 查找所有环并判断节点是否在环中（较低效）
2. 对单个节点进行深度搜索
3. 对单个节点进行深度搜索并排除边缘节点
4. 对单个节点进行深度搜索，排除边缘节点，并进行适度缓存



效果如下：

![image-20181008193910094](https://ws2.sinaimg.cn/large/006tNbRwgy1fw11swaxy4j30vq0amacv.jpg)
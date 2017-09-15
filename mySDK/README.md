# mySDK

## 功能：

- 可以拉取更新的资源

- 可以存储拉取下来的资源

- 可以根据版本迭代，置换过期资源

- - -
## 功能分解

- 网络交互能力，XHR。

    - create:创建xhr对象。
    - readystate：回调函数处理。
    - para：参数转换。
    - get：请求发送。
    - 为什么不用fetch等其他工具包？因为我们的目的是优化，是提速，如果还用其他第三方的可能就会直接阻塞我们的代码，
      达不到优化的目的。我们的唯一目标就是，**速度**。

- 本地存储能力，localSDK。

	- resourceVersion : 维护本地缓存版本，跟新数据
	- resourceJavascriptList ： 需要缓存的文件列表(只缓存重要的文件，不是所有文件都缓存，如果都要缓存对
		浏览器性能是不好的)
	- needdUpdate ： 检测文件是否需要跟新
	- isIE：判断是否为IE浏览器，localStorage对IE支持度不太好。如果是IE，就不用localstorage方法来存储
	- checkHedge ：检测本地缓存是否溢出
	- startup ： 启动方法，也就是读取本地缓存
	- save :　保存缓存与startup相对应
	

- 缓存展示能力，浏览器的DOM解析器。

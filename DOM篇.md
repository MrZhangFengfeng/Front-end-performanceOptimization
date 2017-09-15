## 如何避免重绘和回流

- `Display`的值会影响布局，从而影响这个页面元素位置的变化，尽量少改变它。

- 先将元素删除，完成修改后再放回原位置。那么可以将多个元素放到缓存中，拼接后再一次性插入。

- 新的API，如果要创建多个DOM节点，可以使用`DocumentFragment`创建完后一次性加入`document`中。

		let fragment = document.createElement();
		let Node = document.createElement('div');

		for(let i =0;i<10;i++){
			Node.innerHTML = node.innerHTML + "number:" + i +"<br>";
			fragment.appendChild(Node);
		}

		document.body.appendChild(fragment);

- - -
## 这些也会导致重绘

- 回流
- 用户在输入框输入文字
- 输入框不在输入，在获得焦点的时候也一直在重绘；
- hover等效果
- 先前颜色为红色，进行设置颜色，即使还设置为红色，也会发生重绘。

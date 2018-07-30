### 笔记
* php文件的执行分两个过程
	1. 将php文件编译成`OPENCODE`的字节码序列（实际上是编译成一个叫做`zend_op_array`的字节数组）
	2. 由一个虚拟机来执行这些`OPENCODE`（PHP的所有行为都是由这些`OPCODE`来实现的）

	
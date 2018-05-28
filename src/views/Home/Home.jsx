import React from 'react';
import { observable, computed } from 'mobx';
import { observer } from 'mobx-react';

// @observable 定义 Observable state
// @computed 定义 Derivations
// @observer 封装了 React Component 的 render 方法 这是Reactions
// store
class TodoStore {
	@observable todos = [];
	@computed get computedTodoCount() {
		return this.todos.filter(todo => todo.completed).length;
	}
	addTodo(task) {
		this.todos.push({
			task,
			completed: false
		});
	}
}

@observer
class Home extends React.Component {
	render() {
		const { todoStore } = this.props;
		return (
			<div>
				Home
				{
					todoStore.todos.map((todo, index) => {
						return <Todo todo={todo} key={index} />
					})
				}
				Progress: { todoStore.computedTodoCount }
			</div>
		);
	}
}

@observer
class Todo extends React.Component {
	static propsType = {}
	onRename = () => {
		const { todo } = this.props;
		todo.task = prompt('task name', todo.task) || '';
	}
	onToggleCompleted = () => {
		const { todo } = this.props;
		todo.completed = !todo.completed;
	}
	render() {
		const { todo } = this.props;
		return (
			<div onDoubleClick={this.onRename}>
				<input
					type="checkbox"
					checked={todo.completed}
					onChange={this.onToggleCompleted}
				/>
				{todo.task}
			</div>
		);
	}
}
const todoStore = new TodoStore();
window.todoStore = todoStore;
todoStore.addTodo('foo');
todoStore.addTodo('bar');

export default () => <Home todoStore={todoStore} />;

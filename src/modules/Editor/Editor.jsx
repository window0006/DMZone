import React from 'react';
import { Editor, EditorState, AtomicBlockUtils, convertToRaw } from 'draft-js';

const blockRenderer = (block) => {
	if (block.getType() === 'atomic') {
		return {
			component: Image, // props含有block属性能取到当前block
			editable: false,
		};
	}
	return null;
};
const Image = (props) => {
	const entityKey = props.block.getEntityAt(0); // 拿到block里面的entity
	const entity = props.contentState.getEntity(entityKey);
	const { src } = entity.getData();
	return <img src={src} />;
};

class EditorComponent extends React.Component {
	state = {
		editorState: EditorState.createEmpty(),
		fontSize: 12,
		fontFamily: 'yahei'
	}
	onChange = (editorState) => {
		this.setState({
			editorState,
		});
	}
	onFontSizeChange = (fontSize) => {
		this.setState({
			fontSize,
		});
	}
	onFontFamilyChange = (fontFamily) => {
		this.setState({
			fontFamily,
		});
	}
	renderFontSizeOpts() {
		const fontSizes = [{
			value: 12,
			text: '12px'
		}, {
			value: 14,
			text: '14px'
		}];
		return (
			<select value={this.state.fontSizes} onChange={this.onFontSizeChange}>
				{
					fontSizes.map(({ text, value }) => (
						<option value={value}>{text}</option>
					))
				}
			</select>
		);
	}
	renderTools() {
		return (
			<div>
				<button onClick={this.insertImage}>insertImage</button>
			</div>
		);
	}
	getEntityKeyBySelectionRange() {
		const { editorState } = this.state;

		const contentState = editorState.getCurrentContent();
		const selectionState = editorState.getSelection();

		const blockKey = selectionState.getStartKey();
		const block = contentState.getBlockForKey(blockKey);

		const entityOffsetInBlock = selectionState.getStartOffset();
		const entityKey = block.getEntityAt(entityOffsetInBlock);

		return entityKey;
	}
	insertImage = () => {
		const { editorState } = this.state;
		const contentState = editorState.getCurrentContent();
		// 返回的是一个contentState
		const contentStateWithEntity = contentState.createEntity(
			'image',
			'IMMUTABLE',
			// data
			{
				src: 'http://webpic.my4399.com/re/oss/games/jsxw_330_260.jpg',
			}
		);
		// 从最新返回的contentState中获取entityKey
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

		// 拿新的contentState来生成新的editorStae
		const newEditorState = EditorState.set(
			editorState,
			{
				currentContent: contentStateWithEntity,
			}
		);

		// 拿新的editorState + entityKey 插入一个原子block
		// 在blockRenderFn里面将相关的原子block替换成对应的react组件
		this.setState({
			editorState: AtomicBlockUtils.insertAtomicBlock(
				newEditorState,
				entityKey,
				' ' // 不能为空字符 否则entity无法加入到block中
			),
		});
	}
	logState = () => {
		const content = this.state.editorState.getCurrentContent();
        console.log(convertToRaw(content));
	}
	render() {
		return (
			<div>
				Editor：
				{this.renderTools()}
				<Editor
					blockRendererFn={blockRenderer}
					editorState={this.state.editorState}
					onChange={this.onChange}
				/>
				<input
	                onClick={this.logState}
	                type="button"
	                value="Log State"
                />
			</div>
		);
	}
}

export default EditorComponent;

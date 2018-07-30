<?php
namespace fastphp\base;

class View {
	protected $variables = array();
	protected $_controller;
	protected $_action;

	function __construct($controller, $action) {
		$this->_controller = strtolower($controller);
		$this->_action = strtolower($action);
	}

	function assign($name, $value) {
		$this->variables[$name] = $value;
	}

	public function render() {
		// 将数组的key=>val 变成变量 $key = val
		extract($this->variables);
		$htmlPath = $this->_action . '.php';
		if ($this->_controller != 'index') {
			$htmlPath = $this->_controller . '/' . $htmlPath;
		}
		$html = APP_PATH . 'app/view/' . $htmlPath;

		include $html;
	}

}
<?php
namespace fastphp\base;

use fastphp\db\Sql;

class Model extends Sql {
	protected $model;

	public function __construct() {
		if (!$this->table) {
			$className = get_class($this);
			$this->model = substr($className, 0, -5); // xxxModel -> xxx
			$this->table = strtolower($this->model); // 数据库表名将与类名一致
		}
	}
}

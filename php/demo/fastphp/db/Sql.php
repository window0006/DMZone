<?php
namespace fastphp\db;

use \PDOStatement; // 使用PDO的命名空间？

class Sql {
	protected $table;
	// 数据库中的主键
	protected $primary;
	// where和order拼装后的筛选条件
	protected $filter;
	// pdo bindParam()绑定的参数集合
	private $param = array();

	public function where($where = array(), $param = array()) {
		if ($where) {
			$this->filter .= ' WHERE ';
			$this->filter .= implode(' ', $where);

			$this->param = $param;
		}
		return $this; // 链式调用
	}

	public function order($order = array()) {
		if($order) {
			$this->filter .= ' ORDER BY ';
			$this->filter .= implode(',', $order);
		}
		return $this;
	}

	public function fetch() {
		$seq = sprintf('select * from `%s` %s', $this->table, $this->$filter);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $this->param);
		$sth->execute();

		return $sth->fetch();
	}
	public function fetchAll() {
		$seq = sprintf('select * from `%s` %s', $this->table, $this->$filter);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $this->param);
		$sth->execute();

		return $sth->fetchAll();
	}
	public function add() {
		$sql = sprintf("insert into `%s` %s", $this->table, $this->formatInsert($data));
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $data);
		$sth = $this->formatParam($sth, $this->param);
		$sth->execute();

		return $sth->rowCount();
	}
	public function delete($id) {
		$sql = sprintf("delete from `%s` where `%s` = :%s", $this->table, $this->primary, $this->primary);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, [$this->primary => $id]);
		$sth->execute();

		return $sth->rowCount();
	}
	public function update() {
		$sql = sprintf("update `%s` set %s %s", $this->table, $this->formatUpdate($data), $this->filter);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $data);
		$sth = $this->formatParam($sth, $this->param);
		$sth->execute();

		return $sth->rowCount();
	}

	public function formatParam(PDOStatement $sth, $params = array()) {
		foreach ($params as $param => $value) {
			$param = is_int($param) ? $param + 1 : ':' . ltrim($param, ':');
			$sth->bindParam($param, $value);
		}
		return $sth;
	}
	// 将数组转换成插入格式的sql语句
	public function formatInsert($data) {
		$fields = array();
		$names = array();
		foreach ($data as $key => $value) {
			$fields[] = sprintf("`%s`", $key); // 同 array_push
			$names[] = sprintf(":%s", $key);
		}
		return sprintf("(%s) values (%s)", implode(',', $fields), implode(',', $names));
	}
	public function formatUpdate($data) {
		$fileds = array();
		foreach ($data as $key => $value) {
			$fields[] = sprintf("`%s` = :%s", $key, $key);
		}
		return implode(',', $fields);
	}
}
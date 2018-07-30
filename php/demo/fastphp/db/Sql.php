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

	// (new XXModel)->where(["id = ?"], [$id])->fetch()
	public function where($where = array(), $param = array()) {
		if ($where) {
			$this->filter .= ' WHERE ';
			$this->filter .= implode(' ', $where);

			$this->param = $param;
		}
		return $this; // 链式调用
	}

	// $this->order(['id DESC', 'title ASC', ...])->fetch();
	public function order($order = array()) {
		if($order) {
			$this->filter .= ' ORDER BY ';
			$this->filter .= implode(',', $order);
		}
		return $this;
	}

	public function fetch() {
		$sql = sprintf('select * from `%s` %s', $this->table, $this->filter);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $this->param);
		$sth->execute();

		return $sth->fetch();
	}
	public function fetchAll() {
		$sql = sprintf('select * from `%s` %s', $this->table, $this->filter);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $this->param);
		
		$sth->execute();

		return $sth->fetchAll();
	}
	public function add($data) {
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
	public function update($data) {
		$sql = sprintf("update `%s` set %s %s", $this->table, $this->formatUpdate($data), $this->filter);
		$sth = Db::pdo()->prepare($sql);
		$sth = $this->formatParam($sth, $data);
		$sth = $this->formatParam($sth, $this->param);
		$sth->execute();
		return $sth->rowCount();
	}

	public function formatParam(PDOStatement $sth, $params = array()) {
		// 不加&每次循环$value都会变 最后pdo执行的时候才绑定值 于是变成了最后一个$value 加了&就变成了地址传递
		foreach ($params as $param => &$value) {
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
			$fields[] = sprintf('`%s`', $key); // 同 array_push
			$names[] = sprintf(':%s', $key);
		}
		return sprintf('(%s) values (%s)', implode(',', $fields), implode(',', $names));
	}
	public function formatUpdate($data) {
		$fileds = array();
		foreach ($data as $key => $value) {
			$fields[] = sprintf('`%s` = :%s', $key, $key);
		}
		return implode(',', $fields);
	}
}
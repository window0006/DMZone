<?php
namespace fastphp\db;

use PDO;
use PDOException;

class Db {
	// $pdo属性为静态属性，所以在页面执行周期内，只要一次赋值，以后的获取还是首次赋值的内容，这里就是PDO对象，这样可以确保运行期间只有一个数据库连接对象
	private static $pdo;

	public static function pdo() {
		if (self::$pdo !== null) {
			return self::$pdo;
		}

		try {
			$dsn = sprintf('mysql:host=%s;dbname=%s;chartset=utf8', DB_HOST, DB_NAME);
			$option = array(
				PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
			);

			return self::$pdo = new PDO($dsn, DB_USER, DB_PASS, $option);
		} catch (PDOException $e) {
			exit($e->getMessage());
		}
	}
}

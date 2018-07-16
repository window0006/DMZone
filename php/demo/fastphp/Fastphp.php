<?php

namespace fastphp;

define('CORE_PATH') or define('CORE_PATH', __DIR__);
// same as:
// if (!define('CORE_PATH')) {
// 	define('CORE_PATH', __DIR__);
// }

class Fastphp {
	protected $config = [];

	public function __construct($config) {
		$this->config = $config;
	}

	public function run() {
		// 注册给定的函数作为 __autoload 的实现
		// autoload机制可以使得PHP程序有可能在使用类时才自动包含类文件，而不是一开始就将所有的类文件include进来，这种机制也称为lazy loading。
		// 使用一个类时，如果发现这个类没有加载，就会自动运行__autoload()函数
		// function __autoload($classname) {
		// 	$classpath = './' . $classname . '.class.php';
		// 	if(file_exists($classpath)) {
		// 		require_once($classpath);
		// 	} else {
		// 		echo 'class file' . $classpath . 'not found!';
		// 	}
		// }
		sql_autoload_register(array($this, 'loadClass'));

		$this->setReporting();
		$this->removeMagicQuotes();
		$this->unregisterGlobals();
		$this->setDbConfig();
		$this->route();
	}

	public function loadClass($classname) {
		$classMap = $this->classMap();
		if (isset($classMap[$classname])) {
			$file = $classMap[$classname];
		} elseif (strpos($classname, '\\')){
			$file = APP_PATH . str_replace('\\', '/', $classname);
			if (!is_file($file)) {
				return;
			}
		} else {
			return;
		}

		include $file;
	}

	public function classMap() {
		return [
			'fastphp\base\Controller' => CORE_PATH . '/base/Controller.php',
			'fastphp\base\Model' => CORE_PATH . '/base/Model.php',
			'fastphp\base\View' => CORE_PATH . '/base/View.php',
			'fastphp\base\Db' => CORE_PATH . '/base/Db.php',
			'fastphp\base\Sql' => CORE_PATH . '/base/Sql.php'
		];
	}

	// yoursite.com/item/detail/1/hello
	// todo :: 改成 yoursite.com/controll/action/?param1=&param2=
	public function route() {
		$controllerName = $this->config['defaultController'];
		$actionName = $this->config['defaultAction'];
		$param = array();

		$url = $_SERVER['REQUEST_URI'];
		// 清除?之后的内容
		$tmepPos = strpos($url, '?');
		$url = $tmepPos === false ? $url : substr($url, 0, $tmepPos);
		// 删除前后的“/”
		$url = trim($url, '/');

		if ($url) {
			$urlArr = explode($url, '/');
			$urlArr = array_filter($urlArr); // 删除空数组元素

			$controllerName = ucfirst($urlArr[0]);
			array_shift($urlArr);

			$actionName = $urlArr ? $urlArray[0] : $actionName;
			array_shift($urlArr);

			$param = $urlArr ? $urlArr : array();
		}

		$controller = 'app\\controller\\' . $controllerName . 'Controller';
		if (!class_exists($controller)) {
			exit($controller . ' 控制器不存在');
		}
		if (!method_exists($controller, $actionName)) {
			exit($actionName . ' 方法不存在');
		}

		$dispatch = new $controller($controllerName, $actionName); // 传入控制器名和方法名
		$dispatch->$actionName($param);
		// call_user_func_array(array($dispatch, $actionName), $param);
	}

	public function setReporting() {
		ini_set('error_reporting', E_ALL); // php.ini 中的 error_reporting 设置为 E_ALL
		if (APP_DEBUG) {
			// error_reporting(E_ALL);
			ini_set('display_errors','On'); // php.ini 中的 display_error 设置为 On
		} else {
			ini_set('display_errors','Off');
			ini_set('log_errors', 'On');
		}
	}

	// 删除敏感字符
	public function stripSlashesDeep($value) {
		$value = is_array($value) ? array_map(array($this, 'stripSlashesDeep'), $value) : stripcslashes($value);
		return $value;
	}

	public function removeMagicQuotes() {
		if (get_magic_quotes_gpc()) {
			$_GET = isset($_GET) ? $this->stripSlashesDeep($_GET) : '';
			$_POST = isset($_POST) ? $this->stripSlashesDeep($_POST) : '';
			$_COOKIE = isset($_COOKIE) ? $this->stripSlashesDeep($_COOKIE) : '';
			$_SESSION = isset($_SESSION) ? $this->stripSlashesDeep($_SESSION) : '';
		}
	}

	public function unregisterGlobals() {
		if (ini_get('register_globals')) {
			$array = array(
				'_SESSION',
				'_POST',
				'_GET',
				'_COOKIE',
				'_REQUEST',
				'_SERVER',
				'_ENV',
				'_FILES'
			);
			// 如果这些内置对象中的值出现在全局变脸中 干掉
			foreach ($array as $value) {
				foreach ($GLOBALS[$value] as $key => $var) {
					if ($var === $GLOBALS[$key]) {
						unset($GLOBALS[$key]);
					}
				}
			}
		}
	}
	public function setDbConfig() {
		if ($this->config['db']) {
			// Model::$db_config = $this->config['db'];
			define('DB_HOST', $this->config['db']['host']);
			define('DB_NAME', $this->config['db']['dbname']);
			define('DB_USER', $this->config['db']['username']);
			define('DB_PASS', $this->config['db']['password']);
		}
	}
}
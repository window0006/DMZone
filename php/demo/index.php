<?php

define('APP_PATH', __DIR__ . '/');
define('APP_DEBUG', true);

require(APP_PATH . 'fast/Fastphp.php');

$config = require(APP_PATH . 'config/config.php');

(new fastphp\Fastphp($config))->run();

<?php

namespace app\controller;

use fastphp\base\Controller;
use app\model\IndexModel;

class IndexController extends Controller {
	public function index() {
		$this->render();
	}
}
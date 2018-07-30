<?php
namespace app\controller;

use fastphp\base\Controller;
use app\model\PostsModel;

class PostsController {
	public function index() {
		header('Content-Type: application/json');
		echo json_encode((new PostsModel())->fetchAll());
	}

	public function save() {
		$postData = json_decode(file_get_contents('php://input'), true);
		// exit($_POST['title'] . '<br>' . $_POST['subTitle']);
		$fields = array(
			'title',
			'subTitle',
			'content'
		);
		$data = array(
			'author' => 'window',
			'authorId' => 1
		);
		// todo :: author authorId
		foreach ($fields as $field) {
			if (!isset($postData[$field])) {
				$value = ' ';
			} else {
				$value = $postData[$field];
			}
			$data[$field] = $value;
		}
		
		(new PostsModel())->add($data);

		// todo :: 插入失败如何处理？

		header('Content-Type: application/json');
		$result = array(
			'code' => 200,
			'msg' => 'ok'
		);
		echo json_encode($result);
	}

	public function delete($params) {
		(new PostsModel())->delete($params['id']);
	}

	public function update() {
		$data = json_decode(file_get_contents('php://input'), true);
		$result = array();
		// validator
		if (!isset($data['id'])) {
			$result['code'] = '400002';
			$result['msg'] = '参数错误：缺少id';
		} else {
			(new PostsModel())->where(['id=:id'], ['id' => $data['id']])->update($data);
			$result['code'] = '200';
			$result['msg'] = 'ok';
		}
		
		header('Content-Type: application/json');
		echo json_encode($result);
	}
}
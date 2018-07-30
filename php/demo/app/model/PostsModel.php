<?php
namespace app\model;

use fastphp\base\Model;
use fastphp\db\Db;

class PostsModel extends Model {
	protected $table = 'posts';
	protected $primary = 'id';
}
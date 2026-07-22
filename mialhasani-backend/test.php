<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

try {
    $controller = app()->make('App\Http\Controllers\Api\NewsController');
    echo json_encode($controller->index());
} catch(\Throwable $e) {
    echo 'ERROR: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine();
}

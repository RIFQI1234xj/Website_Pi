<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
try { 
    $c = new \Cloudinary\Cloudinary('cloudinary://123:456@abc'); 
    echo get_class($c) . "\n"; 
} catch (\Throwable $e) { 
    echo 'ERROR: ' . $e->getMessage() . "\n"; 
}

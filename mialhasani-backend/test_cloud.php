<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    echo cloudinary()->uploadApi()->upload(public_path('images/hero-1784596188-94glftl6en.jpeg'), ['folder' => 'mialhasani/test'])['secure_url'];
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo $e->getTraceAsString();
}

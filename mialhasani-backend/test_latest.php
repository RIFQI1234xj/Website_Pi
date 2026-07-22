<?php 
require 'vendor/autoload.php'; 
$app = require_once 'bootstrap/app.php'; 
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap(); 
$u = App\Models\PpdbApplicant::latest()->first(); 
echo $u->kk_file_data;

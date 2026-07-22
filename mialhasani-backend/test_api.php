<?php
$token = '23|f8SEmYnBTOYQUWrANjW9AC3MbMEN3BC5z7QxwhaG6d62ddae';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "https://api-mialhasani.onrender.com/api/school-settings");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_POST, true);
$cfile = new CURLFile('public/images/favicon.ico', 'image/x-icon', 'favicon.ico');
$data = array(
    '_method' => 'PUT',
    'school_name' => 'MI Al-Hasani Test',
    'npsn' => '60706775',
    'hero_images[0]' => $cfile
);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Authorization: Bearer $token",
));
$response = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo "STATUS: $status\n";
echo "RESPONSE: $response\n";

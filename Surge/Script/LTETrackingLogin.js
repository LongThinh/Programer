/*
hostname = apivtp.vietteltelecom.vn:0
*/

let body= $request.body;
$notification.post("LTE Tracking write cache token: 🎉 Done, success!", "", "")
$persistentStore.write(body, "bodytoken");
$done({});
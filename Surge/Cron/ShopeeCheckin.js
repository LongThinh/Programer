/*
hostname = api.picsart.com
*/

/*Using Surge Cron*/

var shopeeUrl = {
    url: 'https://shopee.vn/mkt/coins/api/v2/checkin',
    headers: {
      Cookie: $persistentStore.read("CookieSP"),
    }
  }
$httpClient.post(shopeeUrl, function(error, response, data){
  if (error) {
$notification.post("Shopee checkin", "", "Lỗi kết nối")
    $done(); 
  } 
 else{
 if(response.status == 200)
{
let obj= JSON.parse(data);
if(obj["data"]["success"])
{
var user = obj["data"]["username"];
var coins = obj["data"]["increase_coins"];
$notification.post("Shopee " + user, "", "🎉 Chúc mừng! bạn đã nhận được " + coins + "Xu");
    $done();
}
}
else{
$notification.post("Shopee cookie đã hết hạn", "", "Xin vui lòng đăng nhập lại");
}
}
});
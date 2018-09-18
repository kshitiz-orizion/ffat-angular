var config_module = angular.module('app.configEnv', [])
.constant('CONFIG', {
	'base_url' : 'https://ssl.ffat.kindkonnect.in',
	'base_url_local' : 'https://localhost:8000',
	'base_url_server' : 'https://api.bmyraahi.com',
	'razorpayId':'rzp_test_u8wr76NfaLb9If'
});
<?php
require_once("myfuncs.php");
require_once("lunch_funcs.php");
require_once("lunch_connect.php");

function __autoload($class)
{
	include ($class."Class.php");
}

// update log data with datetime and ip

$logname = "lunch_log.dat";
$ip = $_SERVER['REMOTE_ADDR'];
$log_flg = true;
if ($ip == "159.253.143.53" || $ip == "95.65.30.29" || substr($ip,0,9) == "69.58.178") exit;
if ($ip == "62.219.8.228" || $ip == "93.158.147.8") exit;
if (substr($ip,0,8) == "180.76.6" || substr($ip,0,8) == "180.76.5" ) exit;
if ($ip == "74.123.20.27" || $ip == "127.0.0.1") $log_flg = false;
if (substr($ip,0,9) == "199.21.99" || substr($ip,0,10) == "207.46.199") $log_flg = false;
if (substr($ip,0,9) == "65.52.110") $log_flg = false;
if (substr($ip,0,9) == "207.46.13" || substr($ip,0,10) == "157.55.112") $log_flg = false;
if ($ip == "157.55.16.11" || $ip == "64.246.165.160" || substr($ip,0,6) == "66.249") $log_flg = false;
if ($log_flg)
{
	$logdata = date("n-j-y H:i")."    ".$ip."\n";
	file_put_contents($logname, $logdata, FILE_APPEND);
}
?>
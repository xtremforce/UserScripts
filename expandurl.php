<?php
$url = $_GET["url"];

if(empty($_GET["url"])){
    if(!empty($_POST["url"])){
        $url = $_POST["url"];
    }
}

if(empty($url))exit();

function is_url($str){
    return preg_match("/^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\’:+!]*([^<>\”])*$/", $str);
}

if(!is_url($url)){
    $result['status'] = -1;
    $result['msg'] = 'Not a url';
    echo(json_encode($result));
    exit();
}


$parse = parse_url($url);
$domain =  $parse['scheme']."://".$parse['host'];

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_REFERER, $domain); 
curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/43.0.2357.134 Safari/537.36"); 
curl_exec($ch);

$response = curl_exec($ch);
preg_match_all('/^Location:(.*)$/mi', $response, $matches);
curl_close($ch);


if(!empty($matches[1])){
    $result['status'] = 1;
    $result['redirect'] = trim($matches[1][0]);
}else{
    if(!empty($response)){
        $redirectUrl = getRedirectFromScript($response);
        if(!empty($redirectUrl)){
            $result['status'] = 1;
            $result['redirect'] = $redirectUrl;
        }else{
            $result['status'] = -1;
        }
    }else{
        $result['status'] = -1;
    }
}

$result['response'] = $response;

echo(json_encode($result));


function getRedirectFromScript($html){

    $regExp = "/<script.+location\.href\s*=\s*(\"|\'){1}(.+?)(\"|\'){1};.+\<\/script>/i";
    preg_match($regExp, $html, $matches);
    if(!empty($matches[2])){
        return $matches[2];
    }else{
        return null;
    }
    
}

?>
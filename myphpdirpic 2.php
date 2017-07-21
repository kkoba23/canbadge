<?php
//画像ファイル一覧を表示するパスを指定する
$path = "./files";
?>

<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>画像ファイルをリスト化</title>
        <SCRIPT language="JavaScript">
        <!--
        // 背景色の変更
        function chBgColor(opt) {
              document.documentElement.style.background = opt;
        }
        function transparent() {
              document.documentElement.style.background='url("http://unoploide.com/oollmmaann/wp-content/plugins/global-flash-galleries/img/transparent-50.gif")';
        }
        function width_input() {
            var width = document.getElementById('width_shitei').value;
            chImgSize(width);
        }
        // 画像の表示サイズ変更
        function chImgSize(width) {
                var imgarray = document.getElementsByTagName('img');
                for (var i in imgarray) {
                    var jissun = img_true_size(imgarray[i]).width;
                        if (width) {
                            if (jissun > width) {
                                imgarray[i].width = width;
                            } else {
//                                 imgarray[i].removeAttribute("width", "height");
                            }
                        } else {
//                             imgarray[i].removeAttribute("width", "height");
                        }
                }
        }
        // get Image true size
        function img_true_size(image){
            var w = image.width ,
                h = image.height ;

            if ( typeof image.naturalWidth !== 'undefined' ) {  // for Firefox, Safari, Chrome
                w = image.naturalWidth;
                h = image.naturalHeight;

            } else if ( typeof image.runtimeStyle !== 'undefined' ) {    // for IE
                var run = image.runtimeStyle;
                var mem = { w: run.width, h: run.height };  // keep runtimeStyle
                run.width  = "auto";
                run.height = "auto";
                w = image.width;
                h = image.height;
                run.width  = mem.w;
                run.height = mem.h;

            } else {         // for Opera
                var mem = { w: image.width, h: image.height };  // keep original style
//                 image.removeAttribute("width");
//                 image.removeAttribute("height");
                w = image.width;
                h = image.height;
                image.width  = mem.w;
                image.height = mem.h;
            }

            return {width:w, height:h};
        }
        //-->
        </SCRIPT>
        <style>
            td {padding:5px;}
            td:nth-child(4) {vertical-align:top;}
            .text {background-color:#ddffff; }
            form {display: inline;}
        </style>
    </head>
<BODY onload="transparent()">
<h3>ディレクトリ「<b><?php echo $path ?></b>」の画像ファイル一覧</h3>
<p>
背景
<button  style="background-color:white;"
    onclick="chBgColor('White')" >White</button>
<button  style="background-color:#CCCCCC;"
    onclick="chBgColor('#cccccc')" >Gray</button>
<button  style="background-color:black;color:#FFF;"
    onclick="chBgColor('Black')" >Black</button>
<button  style="color:red;"
    onclick="transparent()" >transparent</button>
</p>

<p style="display: inline">
表示サイズ
<button  style="background-color:white;"
    onclick="chImgSize()" >実寸</button>
<button  style="background-color:#CCCCCC;"
    onclick="chImgSize(300)" >300px</button> &nbsp;
<form action="javascript:width_input();" >
<input type="number" name="width_shitei" id="width_shitei" value="640" style="width:50px;">pxに</input>
<input type="submit" style="background-color:#CCCCCC;" value="変更"></input>
</form>
</p>
<hr>
<table border=1>
    <tr class="text">
        <th>ファイル名</th><th>サイズ</th><th>画像</th><th>備考</th>
    </tr>
    <tr>

<?php

//文法  scandir( パス ,[ ソート順 ] )
//scandir
//ソート順が省略された場合は、アルファベットの昇順にソートする
//ソート順に"1"が指定された場合は、アルファベットの降順にソートする
//
//昇順にソートする場合はソート順を省略する
$array = scandir($path);

//降順にソートする場合はソート順に"1"を指定する
//$array = scandir($path,1);

//count命令により配列の個数を取得する
$num = count($array);

//横に並べる画像の最大数を設定する
$max = 1;

//カウント数の初期化
$cnt = 0;

//配列の数だけ繰り返す
for ($i=0;$i<$num;$i++){
    //$filenameにァイル名を設定
    $filename = $path . "/" . $array[$i];

    //ファイル名の拡張子が｢gif｣または｢GIF｣または｢jpg｣または｢JPG｣
    //または｢JPEG｣または｢png｣または｢PNG｣の場合は実寸表示の
    //リンク付きで画像を表示する

    if  (exif_imagetype($filename)){

        // 画像サイズ取得
        list($width, $height, $type, $attr)= getimagesize($filename);

                            $str = "\n<td width=\"200\" class=\"text\">" . $array[$i] . "</td><td width=\"100\" class=\"text\">Width: <b>".$width."</b>pxHeight: <b>".$height."</b>px";
                            $str .= "</td>";
                            $str .= "\n<td><a href=" . $filename . "><img src = " .$filename ;
                            $str .= "></a></td>\n\n<td class=\"text\"><!-- " .$array[$i] . " 備考 --><textarea style='width:100%;height:100%;'>&nbsp;</textarea></td>\n";

        print($str);

        //カウント数の初期化
        $cnt = $cnt + 1;

        //カウント数の判定 最大数以上の場合は改行し、カウントを初期化する
        if ($cnt >= $max) {
            print("</tr>\n\n<tr>\n");
            $cnt = 0;
        }
    }
}

?>

</tr>
</table>
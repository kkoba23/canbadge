// forked from mottsu's "画像リサイズ・アップロード（jQuery.Deferred, Web Workers, PhotoSwipe使用）" http://jsdo.it/mottsu/uRnQ
var options = {};

$(function () {
    options = {
        aspectRatio: 1 / 1,     // アスペクト比
        preview: '#preview',    // プレビュー表示先（jQueryセレクタ）
    };
});

// 画像を選択するボタン
$('#imgUpload').on('click', function () {
    $('input[type="file"]').click();
});

// 画像アップロードフォーム
$('input[type="file"]').on('change', function (e) {
    var target = this;
    
    // 画像リサイズ処理
    resize(
        e,
        setImages,
        // startProc
        function () {
            $('.file').addClass('loading disabled');
            $(target).prop('disabled', true);
        },
        // endProc
        function (cnt) {
            $('.file').removeClass('loading disabled');
            $(target).prop('disabled', false);
        }
    ).then(
        //done
        function () {
            $('#img').cropper(options);
$('#img').on('zoom.cropper', function (e) {
    alert(e.detail.ratio);
});
/*
            var image = $('#img')[0];
image.addEventListener('zoom', function (e) {
    alert(e.detail.oldRatio + '->' + e.detail.ratio);
});
*/
        }
    );
});

// Cropボタン
$('#cropBtn').on('click', function () {
    var imgData = document.createElement('img');
    var cropImg = $('#img').cropper('getCroppedCanvas', {
        width: 200,
        height: 200,
    });
    
    imgData.setAttribute('src', cropImg.toDataURL());

    $('#cropped').html(imgData);
});

// Zoom Inボタン
$('#zoomInBtn').on('click', function () {
    $('#img').cropper('zoom', 0.1);
});

// Zoom Outボタン
$('#zoomOutBtn').on('click', function () {
    $('#img').cropper('zoom', -0.1);
});

// Zoom Toボタン
$('#zoomToBtn').on('click', function () {
    $('#img').cropper('zoomTo', 0.5);
});

// Resetボタン
$('#resetBtn').on('click', function () {
    $('#img').cropper('reset');
});

/*
$('#img').on('zoom.cropper', function (e) {
    alert(e.detail.oldRatio + '->' + e.detail.ratio);
});
*/

var setImages = function (f, canvas) {
    //var displaySrc = canvas.toDataURL('image/jpeg', 0.9);
    var displaySrc = canvas.toDataURL(f.type);
    var displayImg = document.createElement('img');
    displayImg.setAttribute('src', displaySrc);
    displayImg.setAttribute('alt', f.name);
    displayImg.setAttribute('id', 'img');
    $('.my-gallery').html(displayImg);
};




// 縮小する画像のサイズ
var maxWidth = 960;
var maxHeight = 960;

var URL = window.URL || window.webkitURL;

/**
 * 画像リサイズ処理
 * @param  {String} e         イベントオブジェクト
 * @param  {String} callback  画像リサイズ後に行わせたい処理
 * @param  {String} startProc 画像リサイズ開始時に行わせたい処理
 * @param  {String} endProc   画像リサイズ全処理終了後に行わせたい処理
 */
var resize = function (e, callback, startProc, endProc) {
    var files = e.target.files;
    var timer = Date.now();
    var dfdArray = [];
    var upCnt = 0;

    // ファイル読み込み処理（Deferredオブジェクトを返す）
    var fileRead = function (f) {
        var dfd = $.Deferred();
        
        var doneFn = function (canvas) {
            callback(f, canvas);
            upCnt++;
            console.log(f.name + ' done! (' + (Date.now() - timer) + 'ms)');
            dfd.resolve();
        };
        var failFn = function (err) {
            dfd.reject(err);
        };

        if (URL) {
            console.log('createObjectURL');
            var blobUrl = URL.createObjectURL(f);
            resizeMain(blobUrl)
                .then(doneFn, failFn)
                .always(function () {
                    URL.revokeObjectURL(blobUrl);
                });
        } else {
            console.log('FileReader');
            var reader = new FileReader();
            reader.onload = function (e) {
                resizeMain(e.target.result)
                    .then(doneFn, failFn);
            };
            reader.readAsDataURL(f);
        }

        return dfd.promise();
    };

    // 画像リサイズ開始時処理
    if (startProc) startProc();

    for (var i = 0; i < files.length; i++) {
        var file = files[i];

        if (!file.type.match(/^image\/(png|jpeg|gif)$/)) continue;

        // Deferredオブジェクトをpushしておく
        dfdArray.push(fileRead(file));
    }

    // ファイルが一件も読み込めなかった場合はrejectする
    if (files.length > 0 && dfdArray.length === 0) dfdArray.push($.Deferred().reject('ファイルが読み込めませんでした'));

    // 画像リサイズ全処理終了時処理
    return $.when.apply($, dfdArray).then(
        // done
        function () {
            if (files.length != upCnt) alert('一部のファイルが読み込めませんでした');
            else console.log('all done!');
        },
        // fail
        function (err) {
            alert(err);
        }).always(function () {
            if (endProc) endProc(upCnt);
        });
};


// 画像リサイズメイン処理（Deferredオブジェクトを返す）
var resizeMain = function (data) {
    var dfd = $.Deferred();

    // 画像読み込み・加工
    var imgLoad = function (base64) {
        var img = new Image();

        img.onload = function () {
            var iw = img.naturalWidth, ih = img.naturalHeight;
            var width = iw, height = ih;

            var orientation;

            // JPEGの場合には、EXIFからOrientation（回転）情報を取得
            if (base64.split(',')[0].match('jpeg')) {
                orientation = getOrientation(base64);
            }
            // JPEG以外や、JPEGでもEXIFが無い場合などには、標準の値に設定
            orientation = orientation || 1;

            // 90度回転など、縦横が入れ替わる場合には事前に最大幅、高さを入れ替えておく
            if (orientation > 4) {
                var tmpMaxWidth = maxWidth;
                maxWidth = maxHeight;
                maxHeight = tmpMaxWidth;
            }

            if (width > maxWidth || height > maxHeight) {
                var ratio = width / maxWidth;
                if (ratio <= height / maxHeight) {
                    ratio = height / maxHeight;
                }
                width = Math.floor(img.width / ratio);
                height = Math.floor(img.height / ratio);
            }

            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            ctx.save();

            // EXIFのOrientation情報からCanvasを回転させておく
            transformCoordinate(canvas, width, height, orientation);

            // iPhoneのサブサンプリング問題の回避
            var subsampled = detectSubsampling(img);
            if (subsampled) {
                iw /= 2;
                ih /= 2;
            }

            // maxSize以下の場合は元サイズのままcanvasを返す
            if (maxWidth >= img.naturalWidth && maxHeight >= img.naturalHeight) {
                ctx.drawImage(img, 0, 0, iw, ih);
                dfd.resolve(ctx.canvas);
            } else {
                var d = 1024; // size of tiling canvas
                var tmpCanvas = document.createElement('canvas');
                tmpCanvas.width = tmpCanvas.height = d;
                var tmpCtx = tmpCanvas.getContext('2d');
                var vertSquashRatio = detectVerticalSquash(img, iw, ih);
                var dw = Math.ceil(d * width / iw);
                var dh = Math.ceil(d * height / ih / vertSquashRatio);

                var loop1 = function () {
                    var df1 = $.Deferred();
                    var sy = 0;
                    var dy = 0;
                    setTimeout(function loop1_in() {
                        loop2(sy, dy).then(
                            // done
                            function (ctx) {
                                sy += d;
                                dy += dh;
                                if (sy >= ih) df1.resolve(ctx);
                                else setTimeout(loop1_in, 0);
                            },
                            // fail
                            function (err) {
                                df1.reject(err);
                            });
                    }, 0);
                    return df1.promise();
                };
                var loop2 = function (sy, dy) {
                    var df2 = $.Deferred();
                    var sx = 0;
                    var dx = 0;
                    setTimeout(function loop2_in() {
                        tmpCtx.clearRect(0, 0, d, d);
                        tmpCtx.drawImage(img, -sx, -sy);
                        var imageData = tmpCtx.getImageData(0, 0, d, d);
                        resampleHermite(imageData, d, d, dw, dh).then(
                            // done
                            function (resampled) {
                                try {
                                    ctx.drawImage(resampled, 0, 0, dw, dh, dx, dy, dw, dh);
                                    sx += d;
                                    dx += dw;
                                    if (sx >= iw) df2.resolve(ctx);
                                    else setTimeout(loop2_in, 0);
                                } catch (e) {
                                    df2.reject(e);
                                }
                            },
                            // fail
                            function (err) {
                                df2.reject(err);
                            });
                    }, 0);
                    return df2.promise();
                };

                loop1().then(
                    // done
                    function (ctx) {
                        ctx.restore();
                        tmpCanvas = tmpCtx = null;
                        dfd.resolve(ctx.canvas);
                    },
                    // fail
                    function (err) {
                        dfd.reject(err);
                    });
            }
        };
        img.src = data;
    };

    // dataがBlob URLの場合は、画像データをBase64で取得
    if (data.match(/^blob:/)) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", data);
        xhr.responseType = "arraybuffer";
        xhr.onload = function () {
            var base64 = ArrayBufferToBase64(xhr.response);
            imgLoad(base64);
        };
        xhr.send();
    } else {
        imgLoad(data);
    }

    return dfd.promise();
};

// hermite filterをかけてジャギーを削除する（Web Workersによる並列処理を行い、Deferredオブジェクトを返す）
var resampleHermite = function (img, W, H, W2, H2) {
    var canvas = document.createElement('canvas');
    canvas.width = W2;
    canvas.height = H2;
    var ctx = canvas.getContext('2d');
    var img2 = ctx.createImageData(W2, H2);
    var data = img.data;
    var data2 = img2.data;
    var ratio_w = W / W2;
    var ratio_h = H / H2;
    var ratio_w_half = Math.ceil(ratio_w / 2);
    var ratio_h_half = Math.ceil(ratio_h / 2);

    // Web Workers側で実行する処理
    var workerFn = function (e) {
        var workerAvailable = e.data.workerAvailable;
        var img = e.data.img;
        var img2 = e.data.img2;
        var W = e.data.W;
        var W2 = e.data.W2;
        var H2 = e.data.H2;
        var data = img.data;
        var data2 = img2.data;
        var ratio_w = e.data.ratio_w;
        var ratio_h = e.data.ratio_h;
        var ratio_w_half = e.data.ratio_w_half;
        var ratio_h_half = e.data.ratio_h_half;

        for (var j = 0; j < H2; j++) {
            for (var i = 0; i < W2; i++) {
                var x2 = (i + j * W2) * 4;
                var weight = 0;
                var weights = 0;
                var gx_r = 0, gx_g = 0, gx_b = 0, gx_a = 0;
                var center_y = (j + 0.5) * ratio_h;
                for (var yy = Math.floor(j * ratio_h) ; yy < (j + 1) * ratio_h; yy++) {
                    var dy = Math.abs(center_y - (yy + 0.5)) / ratio_h_half;
                    var center_x = (i + 0.5) * ratio_w;
                    var w0 = dy * dy;
                    for (var xx = Math.floor(i * ratio_w) ; xx < (i + 1) * ratio_w; xx++) {
                        var dx = Math.abs(center_x - (xx + 0.5)) / ratio_w_half;
                        var w = Math.sqrt(w0 + dx * dx);
                        if (w >= -1 && w <= 1) {
                            weight = 2 * w * w * w - 3 * w * w + 1;
                            if (weight > 0) {
                                dx = 4 * (xx + yy * W);
                                gx_r += weight * data[dx];
                                gx_g += weight * data[dx + 1];
                                gx_b += weight * data[dx + 2];
                                gx_a += weight * data[dx + 3];
                                weights += weight;
                            }
                        }
                    }
                }
                data2[x2] = gx_r / weights;
                data2[x2 + 1] = gx_g / weights;
                data2[x2 + 2] = gx_b / weights;
                data2[x2 + 3] = gx_a / weights;
            }
        }

        if (workerAvailable) {
            postMessage({ 'img2': img2 });
            close();    // Terminates the worker
        }
        else return img2;
    };

    var workerAvailable = window.Worker ? true : false;

    var dfd = $.Deferred();

    // Web Workerへ渡すパラメータ
    var param = {
        'workerAvailable': workerAvailable,
        'img': img,
        'img2': img2,
        'W': W,
        'W2': W2,
        'H2': H2,
        'ratio_w': ratio_w,
        'ratio_h': ratio_h,
        'ratio_w_half': ratio_w_half,
        'ratio_h_half': ratio_h_half
    };

    if (workerAvailable) {
        var blob = new Blob(['onmessage = ' + workerFn.toString() + ';'], { type: 'application/javascript' });
        var blobUrl = URL.createObjectURL(blob);
        var worker = new Worker(blobUrl);

        // Web Workersからの結果取得後の処理
        worker.onmessage = function (e) {
            ctx.putImageData(e.data.img2, 0, 0);
            URL.revokeObjectURL(blobUrl);
            dfd.resolve(canvas);
        };

        // Web Workersでエラー発生時の処理
        worker.onerror = function (err) {
            URL.revokeObjectURL(blobUrl);
            dfd.reject(err.message);
        };

        // Web Workersへパラメータを渡す
        worker.postMessage(param);

    } else {
        var result = workerFn({ 'data': param });
        ctx.putImageData(result, 0, 0);
        dfd.resolve(canvas);
    }

    return dfd.promise();
};

// JPEGのEXIFからOrientationのみを取得する
var getOrientation = function (imgDataURL) {
    var byteString = atob(imgDataURL.split(',')[1]);
    var orientaion = byteStringToOrientation(byteString);
    return orientaion;

    function byteStringToOrientation(img) {
        var head = 0;
        var orientation;
        while (1) {
            if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 218) { break; }
            if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 216) {
                head += 2;
            }
            else {
                var length = img.charCodeAt(head + 2) * 256 + img.charCodeAt(head + 3);
                var endPoint = head + length + 2;
                if (img.charCodeAt(head) == 255 & img.charCodeAt(head + 1) == 225) {
                    var segment = img.slice(head, endPoint);
                    var bigEndian = segment.charCodeAt(10) == 77;
                    var count;
                    if (bigEndian) {
                        count = segment.charCodeAt(18) * 256 + segment.charCodeAt(19);
                    } else {
                        count = segment.charCodeAt(18) + segment.charCodeAt(19) * 256;
                    }
                    for (var i = 0; i < count; i++) {
                        var field = segment.slice(20 + 12 * i, 32 + 12 * i);
                        if ((bigEndian && field.charCodeAt(1) == 18) || (!bigEndian && field.charCodeAt(0) == 18)) {
                            orientation = bigEndian ? field.charCodeAt(9) : field.charCodeAt(8);
                        }
                    }
                    break;
                }
                head = endPoint;
            }
            if (head > img.length) { break; }
        }
        return orientation;
    }
};

// iPhoneのサブサンプリングを検出
var detectSubsampling = function (img) {
    var iw = img.naturalWidth, ih = img.naturalHeight;
    if (iw * ih > 1024 * 1024) {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, -iw + 1, 0);
        return ctx.getImageData(0, 0, 1, 1).data[3] === 0;
    } else {
        return false;
    }
};

// iPhoneの縦画像でひしゃげて表示される問題の回避
var detectVerticalSquash = function (img, iw, ih) {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = ih;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var data = ctx.getImageData(0, 0, 1, ih).data;
    var sy = 0;
    var ey = ih;
    var py = ih;
    while (py > sy) {
        var alpha = data[(py - 1) * 4 + 3];
        if (alpha === 0) {
            ey = py;
        } else {
            sy = py;
        }
        py = (ey + sy) >> 1;
    }
    var ratio = (py / ih);
    return (ratio === 0) ? 1 : ratio;
};

// Orientation情報から画像を回転させる
var transformCoordinate = function (canvas, width, height, orientation) {
    if (orientation > 4) {
        canvas.width = height;
        canvas.height = width;
    } else {
        canvas.width = width;
        canvas.height = height;
    }
    var ctx = canvas.getContext('2d');
    switch (orientation) {
        case 2:
            // horizontal flip
            ctx.translate(width, 0);
            ctx.scale(-1, 1);
            break;
        case 3:
            // 180 rotate left
            ctx.translate(width, height);
            ctx.rotate(Math.PI);
            break;
        case 4:
            // vertical flip
            ctx.translate(0, height);
            ctx.scale(1, -1);
            break;
        case 5:
            // vertical flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.scale(1, -1);
            break;
        case 6:
            // 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(0, -height);
            break;
        case 7:
            // horizontal flip + 90 rotate right
            ctx.rotate(0.5 * Math.PI);
            ctx.translate(width, -height);
            ctx.scale(-1, 1);
            break;
        case 8:
            // 90 rotate left
            ctx.rotate(-0.5 * Math.PI);
            ctx.translate(-width, 0);
            break;
        default:
            break;
    }
};

// ArrayBufferイメージデータをBase64に変換する
var ArrayBufferToBase64 = function (ab) {
    var bytes = new Uint8Array(ab);
    var binaryData = "";
    for (var i = 0, len = bytes.byteLength; i < len; i++) {
        binaryData += String.fromCharCode(bytes[i]);
    }
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[bytes.byteLength - 2] === 0xff && bytes[bytes.byteLength - 1] === 0xd9) {
        imgSrc = "data:image/jpeg;base64,";
    } else if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
        imgSrc = "data:image/png;base64,";
    } else if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38) {
        imgSrc = "data:image/gif;base64,";
    } else if (bytes[0] === 0x42 && bytes[1] === 0x4d) {
        imgSrc = "data:image/bmp;base64,";
    } else {
        imgSrc = "data:image/unknown;base64,";
    }
    return imgSrc + btoa(binaryData);
};

// データURLをArrayBufferに変換する
var dataURLToArrayBuffer = function (data) {
    var byteString = atob(data.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return ab;
};

// データURLをBlobに変換する
var dataURLToBlob = function (data) {
    var mimeString = data.split(',')[0].split(':')[1].split(';')[0];
    var ab = dataURLToArrayBuffer(data);
    var bb = (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder);
    if (bb) {
        bb = new bb();
        bb.append(ab);
        return bb.getBlob(mimeString);
    } else {
        bb = new Blob([ab], {
            'type': (mimeString)
        });
        return bb;
    }
};
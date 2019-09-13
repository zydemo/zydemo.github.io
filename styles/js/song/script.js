﻿(function ($) {
    var p = document.getElementsByTagName('p');
    var song_format = ['.mp3', '.m4a', '.wma']; // 音乐格式
    //  <p>[我爱你中国+小提琴](/public/song/我爱你中国.m4a)</p>
    var title = ''; // 歌曲名字:我爱你中国
    var artist = ''; // 演唱者:小提琴
    var mp3 = ''; // 歌曲地址：/public/song/我爱你中国.m4a
    var album = ''; // 图片不显示的时候显示的文字: 歌曲.mp3  title[i]+song_format[j]
    var cover = ''; // 封面图
    var data = [];

    for (var i = 0; i < p.length; i++) {
        var pi = p[i].innerHTML;
        for (var j = 0; j < song_format.length; j++) {
            // 如果出现了上述音乐格式
            if (pi.toLowerCase().indexOf(song_format[j]) !== -1) {
                // 把歌曲名字切出来
                title1 = pi.replace("[", "").split(']'); //  ["我爱你中国+小提琴", "(/public/song/我爱你中国.m4a)"]
                title2 = title1[0].split("+");
                title = title2[0]; // 我爱你中国
                artist = title2[1]; // 小提琴
                mp3 = title1[1].replace("(", "").replace(")", ""); // 地址：/public/song/我爱你中国.m4a

                // 判断封面图是否存在 https://www.cnblogs.com/hehaha/p/7266878.html
                var xmlHttp;
                if (window.ActiveXObject) {
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                else if (window.XMLHttpRequest) {
                    xmlHttp = new XMLHttpRequest();
                }
                xmlHttp.open("Get", '/styles/song_img/' + title + '.jpg', false);
                xmlHttp.send();
                if (xmlHttp.status === 404){
                    cover = "/styles/song_img/default.jpg";
                }
                else{
                    cover = '/styles/song_img/' + title + '.jpg';
                }

                // cover_url = '/styles/song_img/' + title + '.jpg'; // 封面图
                // var ImgObj=new Image();
                // ImgObj.src= '/styles/song_img/' + title + '.jpg';
                // if(ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0))
                //  {
                //    cover = '/styles/song_img/' + title + '.jpg';
                //  } else {
                //     cover = "/styles/song_img/default.jpg";
                // }

                if (!artist) {
                    artist = "曲目" + (i + 1);
                }
                if (!title) {
                    title = "歌曲" + (i + 1);
                }
                album = title + song_format[j]; // 图片不显示的时候显示的文字
            }
        }
        json = {"title": title, "artist": artist, "album": album, "cover": cover, "mp3": mp3}
        data.push(json);
    }
    // Settings
    var repeat = localStorage.repeat || 0,
        shuffle = localStorage.shuffle || 'false',
        continous = true,
        autoplay = true,
        playlist = data;

    // Load playlist
    for (var i = 0; i < playlist.length; i++) {
        var item = playlist[i];
        $('#playlist').append('<li>' + item.artist + ' - ' + item.title + '</li>');
    }

    var time = new Date(),
        currentTrack = shuffle === 'true' ? time.getTime() % playlist.length : 0,
        trigger = false,
        audio, timeout, isPlaying, playCounts;

    var play = function () {
        audio.play();
        // playPromise = audio.play();
        // if (playPromise) {
        //     playPromise.then(() => {
        //         // 音频加载成功
        //         // 音频的播放需要耗时
        //         setTimeout(() => {
        //             // 后续操作
        //             console.log("done");
        //         },audio.duration * 1000); // audio.duration 为音频的时长单位为秒
        //     }).catch((e) => {
        //     console.log("Operation is too fast, audio play fails");
        //     });
        // }

        $('.playback').addClass('playing');
        timeout = setInterval(updateProgress, 500);
        isPlaying = true;
    }

    var pause = function () {
        audio.pause();
        $('.playback').removeClass('playing');
        clearInterval(updateProgress);
        isPlaying = false;
    }

    // Update progress
    var setProgress = function (value) {
        var currentSec = parseInt(value % 60) < 10 ? '0' + parseInt(value % 60) : parseInt(value % 60),
            ratio = value / audio.duration * 100;

        $('.timer').html(parseInt(value / 60) + ':' + currentSec);
        $('.song_progress .pace').css('width', ratio + '%');
        $('.song_progress .slider a').css('left', ratio + '%');
    }

    var updateProgress = function () {
        setProgress(audio.currentTime);
    }

    // Progress slider 歌曲进度条
    $('.song_progress .slider').slider({
        step: 0.1, slide: function (event, ui) {
            $(this).addClass('enable');
            setProgress(audio.duration * ui.value / 100);
            clearInterval(timeout);
        }, stop: function (event, ui) {
            audio.currentTime = audio.duration * ui.value / 100;
            $(this).removeClass('enable');
            timeout = setInterval(updateProgress, 500);
        }
    });

    // Volume slider 音量进度条
    var setVolume = function (value) {
        audio.volume = localStorage.volume = value;
        $('.volume .pace').css('width', value * 100 + '%');
        $('.volume .slider a').css('left', value * 100 + '%');
    }
    // 音量进度条
    var volume = localStorage.volume || 0.5;
    $('.volume .slider').slider({
        max: 1, min: 0, step: 0.01, value: volume, slide: function (event, ui) {
            setVolume(ui.value);
            $(this).addClass('enable');
            $('.mute').removeClass('enable');
        }, stop: function () {
            $(this).removeClass('enable');
        }
    }).children('.pace').css('width', volume * 100 + '%');
    // 点击喇叭图标静音和不静音
    $('.mute').click(function () {
        if ($(this).hasClass('enable')) {
            setVolume($(this).data('volume'));
            $(this).removeClass('enable');
        } else {
            $(this).data('volume', audio.volume).addClass('enable');
            setVolume(0);
        }
    });

    // Switch track
    var switchTrack = function (i) {
        if (i < 0) {
            track = currentTrack = playlist.length - 1;
        } else if (i >= playlist.length) {
            track = currentTrack = 0;
        } else {
            track = i;
        }

        $('audio').remove();
        loadMusic(track);
        if (isPlaying == true) play();
    }

    // Shuffle
    var shufflePlay = function () {
        var time = new Date(),
            lastTrack = currentTrack;
        currentTrack = time.getTime() % playlist.length;
        if (lastTrack == currentTrack) ++currentTrack;
        switchTrack(currentTrack);
    }

    // Fire when track ended
    var ended = function () {
        pause();
        audio.currentTime = 0;
        playCounts++;
        if (continous == true) isPlaying = true;
        if (repeat == 1) {
            play();
        } else {
            if (shuffle === 'true') {
                shufflePlay();
            } else {
                if (repeat == 2) {
                    switchTrack(++currentTrack);
                } else {
                    if (currentTrack < playlist.length) switchTrack(++currentTrack);
                }
            }
        }
    }

    var beforeLoad = function () {
        var endVal = this.seekable && this.seekable.length ? this.seekable.end(0) : 0;
        $('.song_progress .loaded').css('width', (100 / (this.duration || 1) * endVal) + '%');
    }

    // Fire when track loaded completely
    var afterLoad = function () {
        if (autoplay == true) play();
    }

    // Load track
    var loadMusic = function (i) {
        var item = playlist[i],
            newaudio = $('<audio>').html('<source src="' + item.mp3 + '">').appendTo('#player');
        // 封面图
        // $('.cover').html('<img src="/styles/song_img/default.jpg" alt="'+item.album+'">');
        // $('.cover').html('<img src="'+item.cover+'" alt="'+item.album+'">');
        $('.cover').html('<img src="'+item.cover+'" title="'+item.title+'" alt="'+item.album+'">');
        // $('.cover').html('<img src="/styles/song_img/'+item.title+'.jpg" onerror="this.src='+"'"+'/styles/song_img/default.jpg'+"'"+';this.onerror='+"'"+'null'+"'"+'">');

        // 歌曲标签
        $('.tag').html('<strong>' + item.title + '</strong><span class="artist">' + item.artist + '</span><span class="album">' + item.album + '</span>');
        $('#playlist li').removeClass('playing').eq(i).addClass('playing');
        audio = newaudio[0];
        audio.volume = $('.mute').hasClass('enable') ? 0 : volume;
        audio.addEventListener('song_progress', beforeLoad, false);
        audio.addEventListener('durationchange', beforeLoad, false);
        audio.addEventListener('canplay', afterLoad, false);
        audio.addEventListener('ended', ended, false);
    }

    loadMusic(currentTrack);
    // 播放、暂停按钮
    $('.playback').on('click', function () {
        if ($(this).hasClass('playing')) {
            pause();
        } else {
            play();
        }
    });
    // 上一曲
    $('.rewind').on('click', function () {
        if (shuffle === 'true') {
            shufflePlay();
        } else {
            switchTrack(--currentTrack);
        }
    });
    // 下一曲
    $('.fastforward').on('click', function () {
        if (shuffle === 'true') {
            shufflePlay();
        } else {
            switchTrack(++currentTrack);
        }
    });
    $('#playlist li').each(function (i) {
        var _i = i;
        $(this).on('click', function () {
            switchTrack(_i);
        });
    });

    if (shuffle === 'true') $('.shuffle').addClass('enable');
    if (repeat == 1) {
        $('.repeat').addClass('once');
    } else if (repeat == 2) {
        $('.repeat').addClass('all');
    }
    // 循环播放、单曲循环按钮
    $('.repeat').on('click', function () {
        if ($(this).hasClass('once')) {
            repeat = localStorage.repeat = 2;
            $(this).removeClass('once').addClass('all');
        } else if ($(this).hasClass('all')) {
            repeat = localStorage.repeat = 0;
            $(this).removeClass('all');
        } else {
            repeat = localStorage.repeat = 1;
            $(this).addClass('once');
        }
    });
    // 随机播放
    $('.shuffle').on('click', function () {
        if ($(this).hasClass('enable')) {
            shuffle = localStorage.shuffle = 'false';
            $(this).removeClass('enable');
        } else {
            shuffle = localStorage.shuffle = 'true';
            $(this).addClass('enable');
        }
    });
})(jQuery);
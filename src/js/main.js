require('balloon-css/balloon.min.css');
require('owo/dist/OwO.min.css');
require('dplayer/dist/DPlayer.min.css');

const DPlayer = require('dplayer');
const Headroom = require('headroom.js');
const OwO = require('owo');

$(document).ready(function ($) {
    const isMobile = /mobile/i.test(window.navigator.userAgent);

    // typed.js
    $(".typed a").typed({
        strings: ["这里是网红DIYgod", "Anotherhome"],
        typeSpeed: 30,
        backSpeed: 30,
        backDelay: 700
    });

    // 利用 data-scroll 属性，滚动到任意 dom 元素
    $.scrollto = function (scrolldom, scrolltime) {
        $(scrolldom).click(function () {
            var scrolltodom = $(this).attr("data-scroll");
            $(this).addClass("active").siblings().removeClass("active");
            $('html, body').animate({
                scrollTop: $(scrolltodom).offset().top
            }, scrolltime);
            return false;
        });
    };
    // 判断位置控制 返回顶部的显隐
    if ($(window).width() > 800) {
        var backTo = $("#back-to-top");
        var backHeight = $(window).height() - 980 + 'px';
        $(window).scroll(function () {
            if ($(window).scrollTop() > 700 && backTo.css('top') === '-900px') {
                backTo.css('top', backHeight);
            }
            else if ($(window).scrollTop() <= 700 && backTo.css('top') !== '-900px') {
                backTo.css('top', '-900px');
            }
        });
    }
    // 启用
    $.scrollto("#back-to-top", 800);

    // Ctrl + Enter 提交回复
    $('#comment-content').keydown(function (event) {
        if (event.ctrlKey && event.keyCode == 13) {
            $('#submit').click();
            return false;
        }
    });

    // 点击标签 收起/展开 内容
    $('.side .block .label').click(function () {
        $(this).siblings('.list').slideToggle("slow");
    });
    $('.main .block .comments').click(function () {
        $(this).siblings('.comment-list').slideToggle("slow");
    });
    $('.main .block .round-date').click(function () {
        $(this).siblings('.label').slideToggle("slow");
        $(this).siblings('.article-content').slideToggle("slow");
    });

    // title变化
    var OriginTitile = document.title;
    var titleTime;
    document.addEventListener('visibilitychange', function () {
        if (document.hidden) {
            $('[rel="shortcut icon"]').attr('href', "//www.anotherhome.net/wp-content/themes/Amativeness/fail.ico");
            document.title = '(●—●)喔哟，崩溃啦！';
            clearTimeout(titleTime);
        }
        else {
            $('[rel="shortcut icon"]').attr('href', "//www.anotherhome.net/wp-content/themes/Amativeness/favicon.ico");
            document.title = '(/≧▽≦/)咦！又好了！' + OriginTitile;
            titleTime = setTimeout(function () {
                document.title = OriginTitile;
            }, 2000);
        }
    });

    //  分页功能（异步加载）
    $("#pagination a").on("click", function () {
        $(this).addClass("loading").text("文章列表加载中...");
        $.ajax({
            type: "POST",
            url: $(this).attr("href") + "#thumbs",
            success: function (data) {
                var result = $(data).find("#thumbs .post");
                var nextHref = $(data).find("#pagination a").attr("href");
                // 渐显新内容
                $("#thumbs").append(result.fadeIn(300));
                newPage(result);
                $("#pagination a").removeClass("loading").text("点击加载更多");
                if (nextHref != undefined) {
                    $("#pagination a").attr("href", nextHref);
                } else {
                    // 若没有链接，即为最后一页，则移除导航
                    $("#pagination").remove();
                }
            }
        });
        return false;
    });

    // 顶部头像动画
    document.getElementsByClassName('avatar')[0].onmouseover = function () {
        this.classList.add('animated', 'tada');
    };
    document.getElementsByClassName('avatar')[0].onmouseout = function () {
        this.classList.remove('animated', 'tada');
    };

    // 博客已运行XXX
    function show_date_time() {
        window.setTimeout(function () {
            show_date_time();
        }, 1000);
        var BirthDay = new Date("2/9/2014 11:30:00");
        var today = new Date();
        var timeold = (today.getTime() - BirthDay.getTime());
        var msPerDay = 24 * 60 * 60 * 1000;
        var e_daysold = timeold / msPerDay;
        var daysold = Math.floor(e_daysold);
        var e_hrsold = (e_daysold - daysold) * 24;
        var hrsold = Math.floor(e_hrsold);
        var e_minsold = (e_hrsold - hrsold) * 60;
        var minsold = Math.floor((e_hrsold - hrsold) * 60);
        var seconds = Math.floor((e_minsold - minsold) * 60);
        $('#span_dt_dt').html(daysold + "天" + hrsold + "小时" + minsold + "分" + seconds + "秒");
    }
    show_date_time();

    // 当页面向下滚动时，导航条消失，当页面向上滚动时，导航条出现
    if (!isMobile) {
        var head = document.getElementsByClassName('navbar')[0];
        var headroom = new Headroom(head, {
            "tolerance": 5,
            "offset": 205,
            "classes": {
                "initial": "head-animated",
                "pinned": "slideDown",
                "unpinned": "slideUp"
            }
        });
        headroom.init();
    }

    // 版权信息
    var arCon = document.getElementsByClassName('article-content');
    for (var i = 0; i < arCon.length; i++) {
        arCon[i].addEventListener('copy', function (e) {
            if (window.getSelection().toString() && window.getSelection().toString().length > 42) {
                setClipboardText(e);
                //alert('商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。');
                notie('info', '商业转载请联系作者获得授权，非商业转载请注明出处，谢谢合作。', true)
            }
        });
    }

    function setClipboardText(event) {
        var clipboardData = event.clipboardData || window.clipboardData;
        if (clipboardData) {
            event.preventDefault();

            var htmlData = ''
                + '著作权归作者所有。<br>'
                + '商业转载请联系作者获得授权，非商业转载请注明出处。<br>'
                + '作者：DIYgod<br>'
                + '链接：' + window.location.href + '<br>'
                + '来源：Anotherhome<br><br>'
                + window.getSelection().toString();
            var textData = ''
                + '著作权归作者所有。\n'
                + '商业转载请联系作者获得授权，非商业转载请注明出处。\n'
                + '作者：DIYgod\n'
                + '链接：' + window.location.href + '\n'
                + '来源：Anotherhome\n\n'
                + window.getSelection().toString();

            clipboardData.setData('text/html', htmlData);
            clipboardData.setData('text/plain', textData);
        }
    }

    // ASpace
    //aSpace(document.getElementById('content'));
    //if (document.getElementById('comment-content')) {
    //    document.getElementById('comment-content').addEventListener('change', function () {
    //        this.value = aSpace(this.value);
    //    });
    //}

    // audio
    var loliAudio;
    function playLoli() {
        if (!loliAudio) {
            loliAudio = new Audio('https://diygod.b0.upaiyun.com/loli.mp3');
        }
        loliAudio.play();
    }
    // document.getElementsByClassName('xm')[0].addEventListener('click', function () {
    //     playLoli();
    // });

    // 关闭侧边栏
    document.getElementsByClassName('close-side')[0].addEventListener('click', function () {
        document.getElementsByClassName('side')[0].style.display = 'none';
        document.getElementsByClassName('main')[0].style.width = '100%';
    });

    // 小工具跟随
    var $sidebar = $("#text-4"),
        $last = $("#secondary"),
        $window = $(window),
        offset = $last.offset().top + $last.height();
    $window.scroll(function () {
        if ($window.scrollTop() > offset) {
            $sidebar.css({"position": "fixed", "top": "40px", "width": "22%", "animation": "fade-in 0.5s"});
        } else {
            $sidebar.css({"position": "relative", "top": "0", "width": "initial", "animation": "initial"});
        }
    });

    // 防重复评论
    // if (document.getElementById('submit')) {
    //     document.getElementById('submit').addEventListener('click', function () {
    //         this.value = '正在提交,好累呀~';
    //     });
    // }

    // 搜索
    //function search() {
    //    var searchInput = this.getElementsByClassName('search-input')[0];
    //    if (searchInput.value) {
    //        var url = 'https://www.google.com/search?q=site:anotherhome.net%20' + searchInput.value;
    //        window.open(url, "_blank");
    //        return false;
    //    } else {
    //        return false;
    //    }
    //}

    // evanyou
    if (!isMobile) {
        var c = document.getElementById('evanyou'),
            x = c.getContext('2d'),
            pr = window.devicePixelRatio || 1,
            w = window.innerWidth,
            h = window.innerHeight,
            f = 90,
            q,
            m = Math,
            r = 0,
            u = m.PI*2,
            v = m.cos,
            z = m.random
        c.width = w*pr
        c.height = h*pr
        x.scale(pr, pr)
        x.globalAlpha = 0.6
        function evanyou(){
            x.clearRect(0,0,w,h)
            q=[{x:0,y:h*.7+f},{x:0,y:h*.7-f}]
            while(q[1].x<w+f) d(q[0], q[1])
        }
        function d(i,j){
            x.beginPath()
            x.moveTo(i.x, i.y)
            x.lineTo(j.x, j.y)
            var k = j.x + (z()*2-0.25)*f,
                n = y(j.y)
            x.lineTo(k, n)
            x.closePath()
            r-=u/-50
            x.fillStyle = '#'+(v(r)*127+128<<16 | v(r+u/3)*127+128<<8 | v(r+u/3*2)*127+128).toString(16)
            x.fill()
            q[0] = q[1]
            q[1] = {x:k,y:n}
        }
        function y(p){
            var t = p + (z()*2-1.1)*f
            return (t>h||t<0) ? y(p) : t
        }
        document.onclick = evanyou
        document.ontouchstart = evanyou
        evanyou()
    }

    // OwO
    if (document.getElementsByClassName('content-field').length) {
        new OwO({
            logo: 'OωO表情',
            container: document.getElementsByClassName('content-field')[0].getElementsByClassName('OwO')[0],
            target: document.getElementById('comment-content'),
            api: 'https://api.prprpr.me/OwO/OwO.json',
        });
    }

    function newPage(page) {
        // lazyload
        page.find('img').lazyload({
            effect : "fadeIn"
        });

        // 新窗口打开链接
        $(".post a").attr("target", "_blank");

        // DPlayer
        if (page.find('#dplayer8').length) {
            var dp8 = new DPlayer({
                element: document.getElementById('dplayer8'),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                screenshot: true,
                video: {
                    url: 'https://dplayer.b0.upaiyun.com/wxwlive/1216/2/index.m3u8',
                    pic: 'https://dplayer.b0.upaiyun.com/wxwlive/1216/1/poster.png'
                },
                danmaku: {
                    id: 'f9e80f1d90cd12f5',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    addition: ['https://dplayer.b0.upaiyun.com/wxwlive/1216/2/danmaku.json']
                }
            });
        }
        if (page.find('#dplayer7').length) {
            var dp7 = new DPlayer({
                element: document.getElementById('dplayer7'),
                autoplay: true,
                theme: '#FADFA3',
                loop: true,
                screenshot: true,
                video: {
                    url: 'https://dplayer.b0.upaiyun.com/wxwlive/1216/1/index.m3u8',
                    pic: 'https://dplayer.b0.upaiyun.com/wxwlive/1216/1/poster.png'
                },
                danmaku: {
                    id: '8810755617f77d00',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    addition: ['https://dplayer.b0.upaiyun.com/wxwlive/1216/1/danmaku.json']
                }
            });
        }
        if (page.find('#dplayer6').length) {
            var dp6 = new DPlayer({
                element: document.getElementById('dplayer6'),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                screenshot: false,
                preload: 'none',
                video: {
                    url: 'https://api.prprpr.me/dplayer/video/bilibili?aid=7185185',
                    pic: 'https://dplayer.b0.upaiyun.com/%E4%BD%A0%E7%9A%84%E5%90%8D%E5%AD%97.jpg'
                },
                danmaku: {
                    id: 'AA6061E1FBE38E61',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    maximum: 3000,
                    addition: ['https://api.prprpr.me/dplayer/bilibili?aid=7185185']
                }
            });
        }
        if (page.find('#dplayer5').length) {
            var dp5 = new DPlayer({
                element: document.getElementById('dplayer5'),
                autoplay: true,
                theme: '#FADFA3',
                loop: true,
                screenshot: true,
                video: {
                    url: 'https://dplayer.b0.upaiyun.com/wxwlive/1102/index.m3u8',
                    pic: 'https://dplayer.b0.upaiyun.com/wxwlive/1102/poster.png'
                },
                danmaku: {
                    id: 'f171a0b104c1fd55',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    maximum: 3000,
                    addition: ['https://dplayer.b0.upaiyun.com/wxwlive/1102/danmaku.json']
                }
            });
        }
        if (page.find('#dplayer4').length) {
            var dp4 = new DPlayer({
                element: document.getElementById('dplayer4'),
                autoplay: true,
                theme: '#FADFA3',
                loop: true,
                screenshot: true,
                video: {
                    url: 'https://dplayer.b0.upaiyun.com/wxwlive/1019/index.m3u8',
                    pic: 'https://dplayer.b0.upaiyun.com/wxwlive/1019/poster.png'
                },
                danmaku: {
                    id: '02d53ea190dc8583',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    maximum: 3000,
                    addition: ['https://dplayer.b0.upaiyun.com/wxwlive/1019/danmaku.json']
                }
            });
        }
        if (page.find('#dplayer3').length) {
            var dp3 = new DPlayer({
                element: document.getElementById('dplayer3'),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                screenshot: false,
                preload: 'none',
                video: {
                    url: 'https://api.prprpr.me/dplayer/video/bilibili?aid=2903742',
                    pic: 'https://dplayer.b0.upaiyun.com/【微小微】玖月奇迹－踩踩踩.jpg'
                },
                danmaku: {
                    id: '18EE8C0B4653D5F4',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    maximum: 3000,
                    addition: ['https://api.prprpr.me/dplayer/bilibili?aid=2903742']
                }
            });
        }
        if (page.find('#dplayer2').length) {
            var dp2 = new DPlayer({
                element: document.getElementById('dplayer2'),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                screenshot: false,
                preload: 'none',
                video: {
                    url: 'https://api.prprpr.me/dplayer/video/bilibili?aid=4045652',
                    pic: 'https://dplayer.b0.upaiyun.com/微小微-江南皮革厂倒闭了.jpg'
                },
                danmaku: {
                    id: '5rGf5Y2X55qu6Z2p',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    maximum: 3000,
                    addition: ['https://api.prprpr.me/dplayer/bilibili?aid=4045652']
                }
            });
        }
        if (page.find('#dplayer1').length) {
            var dp1 = new DPlayer({
                element: document.getElementById('dplayer1'),
                autoplay: false,
                theme: '#FADFA3',
                loop: true,
                screenshot: false,
                preload: 'none',
                video: {
                    url: 'https://api.prprpr.me/dplayer/video/bilibili?aid=1714157',
                    pic: 'https://dplayer.b0.upaiyun.com/若能绽放光芒.png'
                },
                danmaku: {
                    id: '9E2E3368B56CDBB4',
                    api: 'https://api.prprpr.me/dplayer/',
                    token: 'tokendemo',
                    maximum: 3000
                }
            });
        }

        // APlayer
        if (page.find('#player1').length) {
            var ap1 = new APlayer({
                element: document.getElementById('player1'),
                autoplay: false,
                preload: 'none',
                music: {
                    title: 'あっちゅ～ま青春!',
                    author: '七森中☆ごらく部',
                    url: 'https://diygod.b0.upaiyun.com/あっちゅ～ま青春!.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/あっちゅ～ま青春!.jpg'
                }
            });
        }
        if (page.find('#player8').length) {
            var ap7 = new APlayer({    //2770
                element: document.getElementById('player8'),
                autoplay: false,
                showlrc: 3,
                preload: 'none',
                music: {
                    title: 'STYX HELIX',
                    author: 'MYTH & ROID',
                    url: 'https://diygod.b0.upaiyun.com/STYX HELIX.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/STYX HELIX.jpg',
                    lrc: 'https://api.lwl12.com/music/netease/lyric?raw=true&id=413961906'
                }
            });
        }
        if (page.find('#player7').length) {
            var ap7 = new APlayer({    //2537
                element: document.getElementById('player7'),
                autoplay: false,
                showlrc: 1,
                preload: 'none',
                music: {
                    title: '光るなら',
                    author: '《四月是你的谎言》OP',
                    url: 'https://diygod.b0.upaiyun.com/光るなら.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/光るなら.png',
                    lrc: "[00:17.460]雨(あめ)上(あ)がりの虹(にじ)も (雨后的彩虹)\n[00:20.470]凛(りん)と咲(さ)いた花(はな)も (凛然绽放的花朵)\n[00:23.610]色(いろ)づき溢(あふ)れ出(だ)す (色彩仿佛要溢出)\n[00:29.710]茜色(あかねいろ)の空(そら (望着那个)\n[00:32.900]仰(あお)ぐ君(きみ)に (仰望绯红色天空的你)\n[00:34.850]あの日(ひ) 恋(こい)に落(お)ちた (就在那天 我坠入了爱河)\n[00:41.070]瞬間(しゅんかん)のドラマチック (戏剧性的瞬间)\n[00:44.270]フィルムの中(なか)の一(ひと)コマも (电影里的每个镜头)\n[00:47.190]消(き)えないよ 心(こころ)に刻(きざ)むから (我都铭记于心)\n[00:55.820]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[00:58.800]教(おし)えてくれた (告诉了我)\n[01:01.790]暗闇(くらやみ)も光(ひか)るなら (若能在黑暗中绽放光芒)\n[01:04.690]星空(ほしぞら)になる (就会如星空般闪亮)\n[01:07.820]悲(かな)しみを笑颜(えがお)に (被悲伤掩盖的笑容)\n[01:10.760]もう隠(かく)さないで (已经无需隐藏)\n[01:13.860]煌(きら)めくどんな星(ほし)も (闪耀的星光)\n[01:16.680]君(きみ)を照(て)らすから (会为你照亮前方)\n[01:21.440]眠(ねむ)りも忘(わす)れて迎(むか)えた朝日(あさひ)が (忘记了睡觉便迎来朝阳)\n[01:27.960]やたらと突(つ)き刺(さ)さる (胡乱刺眼的阳光)\n[01:33.780]低気圧(ていきあつ)运(はこ)ぶ 头痛だって (烦躁的令人头痛)\n[01:39.100]忘(わす)れる 君(きみ)に会(あ)えば (但只要见到你 便能瞬间遗忘)\n[01:45.480]静寂(せいじゃく)はロマンティック (浪漫的寂静)\n[01:48.380]红茶(こうちゃ)に溶(と)けたシュガーのように (像溶进红茶的砂糖)\n[01:51.520]全身(ぜんしん)に巡(めぐ)るよ 君(きみ)の声(こえ (全身都沉浸在你的声音中)\n[02:00.160]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[02:03.310]笑颜(えがお)をくれた (带给了我笑容)\n[02:06.400]涙(なみだ)も光(ひか)るなら (眼泪若能绽放光芒)\n[02:09.210]流星(りゅうせい)になる (就会像流星一样)\n[02:12.440]傷付(きずつ)いたその手(て)を (这双伤痕累累的手)\n[02:15.210]もう離(はな)さないで (请不要再松开)\n[02:18.360]愿(ねが)いを込(こ)めた空(そら)に (寄托心愿的天空)\n[02:21.240]明日(あした)が来(く)るから (明天一定会到来)\n[02:26.060]导(みちび)いてくれた 光(ひかり)は 君(きみ)だよ (你就是指引我前进的光)\n[02:32.110]つられて僕(ぼく)も走(はし)り出(だ)した (终于使我也开始向前奔跑)\n[02:36.950]知(し)らぬ间(ま)に クロスし始(はじ)めた (不知不觉间 我们开始交织在一起)\n[02:42.990]ほら 今(いま)だ ここで 光(ひか)るなら (现在 就在这里 若能绽放光芒！)\n[02:49.830]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[02:52.790]教(おし)えてくれた (告诉了我)\n[02:55.770]暗闇(くらやみ)は终(お)わるから (黑夜终将结束)\n[03:01.770]君(きみ)だよ 君(きみ)なんだよ (是你哦 就是你哟)\n[03:04.810]教(おし)えてくれた (告诉了我)\n[03:07.950]暗闇(くらやみ)も光(ひか)るなら (若能在黑暗中绽放光芒)\n[03:10.870]星空(ほしぞら)になる (就会如星空般闪亮)\n[03:13.890]悲(かな)しみを笑颜(えがお)に (被悲伤掩盖的笑容)\n[03:16.700]もう隠(かく)さないで (已经无需隐藏)\n[03:19.830]煌(きら)めくどんな星(ほし)も (闪耀的星光)\n[03:22.770]君(きみ)を照(て)らすから (会为你指引方向)\n[03:27.310]答(こた)えはいつでも 偶然(ぐうぜん)?必然(ひつぜん)? (答案是偶然？必然？)\n[03:32.610]いつか選(えら)んだ道(みち)こそ (总有一天你会选择这条道路)\n[03:36.550]運命(うんめい)になる (那将成为命运)\n[03:39.600]握(にぎ)りしめたその希望(きぼう)も不安(ふあん)も (握在手心的希望也好不安也罢)\n[03:44.570]きっと二人(ふたり)を動(うご)かす 光(ひかり)になるから (必定会化作驱使我们前进的光)\n"
                }
            });
        }
        if (page.find('#player5').length) {
            var ap5 = new APlayer({    //2419
                element: document.getElementById('player5'),
                autoplay: false,
                showlrc: 1,
                preload: 'none',
                music: {
                    title: '九九八十一',
                    author: '肥皂菌',
                    url: 'https://diygod.b0.upaiyun.com/九九八十一.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/九九八十一.jpg',
                    lrc: "[00:58.86]上路 巩州遇虎熊\n[01:01.04]五百年前一场疯 腾宵又是孙悟空\n[01:05.16]失马 鹰愁涧飞白龙\n[01:07.54]沙河阻断路难通 福陵山中收天蓬\n[01:11.72]岭上 前行逆黄风\n[01:13.88]七星不照波月洞 千年白骨化阴风\n[01:18.15]鱼篮 网通天一尾红\n[01:20.39]紫金葫芦二道童 九尾老狐敢压龙\n[01:24.79]白虹坠 雪浪击石碎\n[01:27.37]思归 难归 堕回 轮回\n[01:29.45]月满一江水 前世莫追\n[01:33.45]福泽聚宝象 春风度不让洛阳\n[01:36.50]玉面狐折兰香 七绝崖上暗伏赤色大蟒\n[01:40.36]过西梁 女儿国鸳鸯罗帐\n[01:42.89]与三道斗法相 火云扬 明枪易挡暗箭难防\n[01:46.86]十方魔 渴饮着我的脆弱\n[01:49.95]凭你计法相迫 逐个击破要你识我本色\n[01:53.25]万里恶 摧垮了我的沉默\n[01:55.94]一肩担路坎坷 我不说 又何须旁人来嚼口舌\n[02:01.77]借扇 翠云访罗刹\n[02:04.14]碧波潭内结亲宴 招来九头的驸马\n[02:08.11]雾隐 金斑豹伸利爪\n[02:10.49]城北黄狮盗钉耙 白毛小鼠偷烛花\n[02:14.63]思乡 未敢听琵琶\n[02:16.56]摄魂曲后三股叉 一朝命断美人画\n[02:20.84]六耳 幻形难辨真假\n[02:23.06]太岁摇铃唤风沙 玉兔抛绣高台搭\n[02:27.49]红霓垂 九重紫云飞\n[02:30.15]久归 未归 欲回 恨回\n[02:32.64]凡胎恰登对 天命难违\n[02:36.37]比丘走白鹿 十三娘情丝缠缚\n[02:39.18]乌袍君生百目 庙前拦路自称黄眉老祖\n[02:43.19]将云拂 孤直公对谈诗赋\n[02:45.60]还未能抵天竺 金平府 钺斩红尘斧辟寒暑\n[02:49.71]众笔者 嘲笑着我的贪得\n[02:52.07]藏美酒有甚者 谁却敢说自己放肆醉过\n[02:55.98]休怪我 这半生痴情煞多\n[02:58.61]活一遭风流客 慕娇娥 但愿抱拥世间真绝色\n[03:29.59]浮世千寻沫 冲荡了我的轮廓\n[03:32.45]纵身入尘埃里 雷雨大作我也放声而歌\n[03:36.18]方寸中 方寸却不能定夺\n[03:38.80]七十二般胆魄 这次我决意不闪躲\n[03:42.40]世尊如来佛 诘问着我的执着\n[03:45.54]当年我瑶池刻 闹得痛快并未想过太多\n[03:49.14]状罪责 拿捏了我的业果\n[03:51.89]可顽心不服错 不思过 齐天大圣地上行者\n[03:55.63]那传说 忘却了我的寂寞\n[03:58.44]英雄名不堪得 何必较我混沌徒费口沫\n[04:01.64]这人间 毕竟我真正走过\n[04:04.87]一途平九百波 九千错 凌云渡成正果但我\n[04:08.72]有九九八十一种不舍"
                }
            });
        }

        if (page.find('#player4').length) {
            var ap4 = new APlayer({    // 2361
                element: document.getElementById('player4'),
                autoplay: false,
                showlrc: 1,
                preload: 'none',
                music: {
                    title: '回レ！雪月花',
                    author: '小倉唯',
                    url: 'https://diygod.b0.upaiyun.com/回レ！雪月花.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/回レ！雪月花.jpg',
                    lrc: "[by:京兆万年]\n[ti:回レ!雪月花 小紫ver.]\n[ar:小倉唯]\n[lr:ヒゲドライバー]\n[co:ヒゲドライバー]\n[ag:ヒゲドライバー]\n[00:00.00]せ〜の　いちにっさんはい！（预~备 一 二 三 嗨！）\n[00:04.68]ほい！　いよーーーーっ　ぽん！（嘿 咿哟 嘭）\n[00:07.66]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[00:11.12]ハッハッハッハッハッハッ　う～（哈 哈 哈 哈 哈 哈 呜~）\n[00:13.36]さぁさぁさぁ（来 来 来）\n[00:14.08]これよりご覧いただきますは（接下来诸位将欣赏到的是）\n[00:15.65]カブキ者たちの栄枯盛衰（歌舞伎演员们的荣辱盛衰）\n[00:17.14]時代常に日進月歩（时代总是在日新月异）\n[00:18.24]聞いてってよ老若男女（且听我一一道来 男女老少）\n[00:20.14]一見は勧善懲悪（乍一看是惩恶扬善）\n[00:21.49]悪者どもを一刀両断（将坏人们一刀两断）\n[00:22.85]「でもホンドにそれだけで楽しいの？」（“但是你真的会因此而觉得扬眉吐气吗？”）\n[00:25.63]もうなんだって蒟蒻問答（无论问什么 都是牛头马嘴）\n[00:27.58]ハッハッハッハッハッハッハィヤ（哈哈哈哈哈哈 咿呀）\n[00:30.57]ハッハッハッハッ（哈哈哈哈）\n[00:31.97]いよーーーーっ　ぽん！（咿哟 嘭）\n[00:33.61]どこからともなく現れて（自何处出现委实难料）\n[00:34.96]すぐどこかへ行っちゃって神出鬼沒（眼又遁隐他处总是神出鬼没）\n[00:36.35]チャンスを待ったら一日千秋（若是静候机会 便是一日千秋）\n[00:38.03]追いかければ東奔西走（追上前去的话又要东奔西走）\n[00:39.68]時代常に千変万化（时代总是千变万化）\n[00:40.95]人の心は複雑怪奇（世人之心复杂怪奇）\n[00:42.31]「でも本気でそんなこ言ってんの？」（“但是说着这些话的你岂不也是难免戏谑?”）\n[00:45.02]もうどうにも満身創痍（也罢 无论怎样都将满身疮痍）\n[00:46.98]嗚呼、巡り巡って夜の町（呜呼 绕来绕去相会在这夜色下的街）\n[00:53.27]キミは合図出し踊りだす（（由）你发出信号 （让）我们一同起舞转）\n[00:58.12]はぁ～（哈呜~）\n[00:58.88]回レ回レ回レ回レ回レ回レ回レ回レ回レ！（旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧！）\n[01:02.12]華麗に花弁　散らすように（在散落的美丽花瓣中）\n[01:04.97]回レ回レ回レ回レ回レ回レ回レ回レ回レ！（旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧旋转吧！）\n[01:08.13]髪も振り乱して（头发凌乱又怎样？）\n[01:10.23]一昨日、昨日、今日と、明日と、明後日と（前日、昨日、今日、明日、后日）\n[01:14.13]この宴は続く（这场宴会亦不息）\n[01:16.31]踊レ、歌エ、一心不乱に回レ！（舞动吧 歌唱吧 一心不乱的旋转吧于）\n[01:20.19]今宵は雪月花（今夜的雪月花）\n[01:25.43]ほい！　いよーーーーっ　ぽん！（哈～!～哟ーーーー～嘣～!）\n[01:29.14]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[01:32.16]ハッハッハッハッハッハッ　う～（哈 哈 哈 哈 哈 哈 呜）\n[01:34.39]ねぇねぇねぇ（呐～呐～呐～）\n[01:35.12]この世に平安訪れるの？（平安已经访问此世了吗?）\n[01:36.50]のべつ幕無し丁丁発止（不会闭幕的丁当争斗）\n[01:38.09]兵ども千客万来（官兵们接踵而来）\n[01:39.50]ひしめき合群雄割拠（相互吵吵嚷嚷群雄割据）\n[01:41.00]伸るか反るか一攫千金（成败在于敢否一举千金）\n[01:42.47]気が付いたら絶体絶命（回过头来却已穷途末路）\n[01:43.50]「でも本音のとこ、どうなってんの？」（「不过真心的所在、到底是什么样呢?」）\n[01:46.62]もうまったく奇想天外（真是的总这么异想天开）\n[01:48.51]嗚呼、辿り辿って夜の町（呜呼、追溯于夜晚小镇上）\n[01:54.83]迷い一つなく踊りだす（心无杂念的就此起舞吧）\n[01:59.68]はぁ～（哈阿～）\n[02:00.44]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[02:03.64]華麗に花弁　散らすように（犹如花瓣华丽的散落一般）\n[02:06.49]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[02:09.66]髪も振り乱して（长发也随风飘散）\n[02:11.72]一昨日、昨日、今日と、明日と、明後日と（无论前天、昨天、还是今天、明天、与后天）\n[02:15.63]この宴は続く（这宴会还会持续）\n[02:17.67]踊レ、歌エ、一心不乱に回レ！（跳吧、唱吧、一心一意的转吧!）\n[02:21.60]今宵は雪月花（因为今宵乃是雪月花）\n[02:36.74]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[02:39.72]ハッハッハッハッハッハッ　さぁさぁさぁ（哈 哈 哈 哈 哈 哈 来～来～来～）\n[02:42.45]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[02:45.49]ハッハッハッハッハッハッ（哈 哈 哈 哈 哈 哈）\n[02:47.66]花で一つ、鳥で二つ（花就是一、鸟就是二）\n[02:51.31]手打ち鳴らす（拍着手轻声唱）\n[02:54.12]風で三つ、嗚呼、月出て四つ（风就是三、呜呼、月出就有四）\n[02:58.76]鳴らす鳴らす……（轻声唱轻轻唱……）\n[03:00.09]花で一つ、鳥で二つ（花就是一、鸟就是二）\n[03:03.34]手打ち鳴らす（拍着手轻声唱）\n[03:06.25]風で三つ、嗚呼、月出て四つ（风就是三、呜呼、月出就有四）\n[03:10.78]鳴らす鳴らす……（轻轻唱轻声唱……）\n[03:13.28]今は（在此）\n[03:15.35]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[03:18.63]華麗に花弁　散らすように（犹如花瓣华丽的散落一般）\n[03:21.35]回レ回レ回レ回レ回レ 回レ回レ回レ回レ！（转啊转啊转啊转啊转啊转啊转啊转啊转啊!）\n[03:24.60]髪も振り乱して（长发也随风飘散）\n[03:26.72]一昨日、昨日、今日と、明日と、明後日と（无论前天、昨天、还是今天、明天、与后天）\n[03:30.67]この宴は続く（这宴会不会结束）\n[03:32.75]踊レ、歌エ、一心不乱に回レ！（跳吧、唱吧、一心一意的转吧!）\n[03:36.63]今宵は何曜日か？（今宵是星期几呢?）\n[03:39.02]水木金？（三四五?）\n[03:40.56]土日月火？（六七一二?）\n[03:44.11]ハッハッハッハッハッハッハィヤ（哈 哈 哈 哈 哈 哈 嗨呀）\n[03:47.00]ハッハッハッハッ（哈 哈 哈 哈 哈 哈）\n[03:48.57]いよーーーーっ　ぽん！（～哟ーーーー～嘣～!）\n[03:50.43]-終わり-（-End-）"
                }
            });
        }

        if (page.find('#player3').length) {
            var ap3 = new APlayer({    // 2322
                element: document.getElementById('player3'),
                autoplay: false,
                showlrc: 1,
                preload: 'none',
                music: {
                    title: 'secret base ~君がくれたもの~',
                    author: '茅野愛衣',
                    url: 'https://diygod.b0.upaiyun.com/secretbase.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/secretbase.jpg',
                    lrc: "[00:00.230]君と夏の終わり 将来の夢（与你在夏末约定　将来的梦想）\n[00:04.170]大きな希望 忘れない（远大的希望　不要忘记了）\n[00:07.170]10年後の8月（我相信　十年後的八月）\n[00:09.700]また出会えるのを 信じて（我们还能再相遇）\n[00:14.360]最高の思い出を…（共划美好的回忆）\n[00:39.960]出会いは ふっとした 瞬間 帰り道の交差点で（相识　是那麼不经意的瞬间　我在回家途中的十字路口）\n[00:47.050]声をかけてくれたね 「一緒に帰ろう」（听见你的一声〞一起回家吧〞）\n[00:54.310]僕は 照れくさそうに カバンで顔を隠しながら（我当时有点尴尬　还拿书包遮著脸）\n[01:01.470]本当は とても とても 嬉しかったよ（其实我　心里好高兴　真的好高兴）\n[01:08.590]あぁ 花火が夜空 きれいに咲いて ちょっとセツナク（啊！烟火在夜空中　灿烂盛开　几许伤感）\n[01:15.770]あぁ 風が時間とともに 流れる（啊！风随着时光流逝）\n[01:22.580]嬉しくって 楽しくって 冒険も いろいろしたね（满心欢喜地　兴致冲冲地　我们四处探险）\n[01:29.760]二人の 秘密の 基地の中（就在我们的　秘密基地中）\n[01:36.740]君と夏の終わり 将来の夢 大きな希望 忘れない（与你在夏末约定　将来的梦想　远大的希望　不要忘记了）\n[01:43.920]10年後の8月 また出会えるのを 信じて（我相信　十年後的八月　我们还能再相遇）\n[01:51.010]君が最後まで 心から 「ありがとう」叫んでいたこと（我知道　一直到最後）\n[01:56.930]知っていたよ（你仍在心底呼喊著〞谢谢你〞）\n[01:58.200]涙をこらえて 笑顔でさようなら せつないよね（强忍著泪水　笑著说再见　无限感叹涌现）\n[02:05.420]最高の思い出を…（那一段最美好的回忆…）\n[02:13.070]あぁ 夏休みも あと少しで 終っちゃうから（啊！暑假就快要过完了）\n[02:20.310]あぁ 太陽と月 仲良くして（啊！太阳和月亮　默契十足）\n[02:27.080]悲しくって 寂しくって 喧嘩も いろいろしたね（想到令人悲伤　或许有些寂寥　我们也多有争吵）\n[02:34.160]二人の 秘密の 基地の中（就在我们的　秘密基地中）\n[02:41.140]君が最後まで 心から 「ありがとう」叫んでいたこと（我知道　一直到最後）\n[02:47.000]知っていたよ（你仍在心底呼喊著〞谢谢你）\n[02:48.340]涙をこらえて 笑顔でさようなら せつないよね（强忍著泪水　笑著说再见　无限感叹涌现）\n[02:55.630]最高の思い出を…（那一段最美好的回忆）\n[03:03.320]突然の 転校で どうしようもなく（你突然要转学　你我都可奈何）\n[03:24.190]手紙 書くよ 電話もするよ 忘れないでね 僕のことを（我会写信给你　也会打电话给你　千万不要忘记我）\n[03:31.420]いつまでも 二人の 基地の中（永远别忘记　那段在秘密基地中的日子）\n[03:38.520]君と夏の終わり ずっと話して（与你在夏末　聊了这麼多）\n[03:42.530]夕日を見てから星を眺め（从黄昏到繁星点点）\n[03:45.670]君の頬を 流れた涙は ずっと忘れない（流过你双颊的泪水　我永远不会忘记）\n[03:52.820]君が最後まで 大きく手を振ってくれたこと（直到最後　你紧紧握住我的手　这感觉也将长在我心中）\n[03:58.540]きっと忘れない（於是就这样）\n[03:59.930]だから こうして 夢の中で ずっと永遠に…（让我们在梦中相会吧　永远的…）\n[04:07.110]君と夏の終わり 将来の夢 大きな希望 忘れない（与你在夏末约定　将来的梦想　远大的希望　不要忘记了）\n[04:14.270]10年後の8月 また出会えるのを 信じて（我相信　十年後的八月　我们还能再相遇）\n[04:21.400]君が最後まで 心から 「ありがとう」叫んでいたこと（我知道　一直到最後）\n[04:27.260]知っていたよ（你仍在心底呼喊著〞谢谢你〞）\n[04:28.640]涙をこらえて 笑顔でさようなら せつないよね（强忍著泪水　笑著说再见　无限感叹涌现）\n[04:35.910]最高の思い出を…（那一段最美好的回忆…）\n[04:43.160]最高の思い出を…（那一段最美好的回忆…）"
                }
            });
        }

        if (page.find('#player2').length) {
            var ap2 = new APlayer({    // 2167
                element: document.getElementById('player2'),
                autoplay: false,
                preload: 'none',
                music: {
                    title: 'Preparation',
                    author: 'Hans Zimmer/Richard Harvey',
                    url: 'https://diygod.b0.upaiyun.com/Preparation.mp3',
                    pic: 'https://diygod.b0.upaiyun.com/Preparation.jpg'
                }
            });
        }

        // Do you like me?
        if (page.find('.unlike-count').length) {
            document.getElementsByClassName('unlike-count')[0].addEventListener('mouseover', beianUnlike);
            document.getElementsByClassName('unlike-count')[0].addEventListener('click', beianUnlike);
            function beianUnlike() {
                if (this.style.float === 'left') {
                    this.style.float = 'right';
                }
                else if (this.style.float === 'right') {
                    this.style.float = 'left';
                }
            }
        }
        if (page.find('.like-vote').length) {
            $.getJSON("https://api.prprpr.me/count/?id=DIYgod-like&action=get", function (data) {
                $('.like-vote span').html(data);
            });
            $('.like-vote').click(function () {
                $.getJSON("https://api.prprpr.me/count/?id=DIYgod-like&action=add", function (data) {
                    $('.like-vote span').html(data);
                });
            });
        }
    }
    newPage($('body'));

    // // svg loader
    // function finish(){
    //     //动画加载完成后的代码
    //     if(!loader.isAnimating ){
    //         // $(".container").addClass('show');
    //         loader.hide();
    //         $('.pageload-overlay').css('background', 'none');
    //
    //         // typed.js
    //         $(".typed a").typed({
    //             strings: ["这里是网红DIYgod", "Anotherhome"],
    //             typeSpeed: 30,
    //             backSpeed: 30,
    //             backDelay: 700
    //         });
    //     }
    //     else{
    //         setTimeout(finish,200)
    //     }
    // }
    // finish();

    // share in page
    $('.single article.block').append(`<div class="share">分享到：</div>`);
    $('.share').share({
        disabled: ['tencent', 'douban', 'linkedin', 'diandian', 'facebook', 'google'],
        wechatQrcodeTitle   : "微信扫一扫",
        wechatQrcodeHelper  : '<p>微信扫一扫，右上角分享</p>',
        source: 'Anotherhome'
    });

    // donate in page
    $('.single article.block').append(`
        <div class="donate">
            <div class="donate-word">赞赏</div>
            <div class="donate-body">
                <div class="donate-wx donate-item">
                    <img src="https://diygod.b0.upaiyun.com/2016-08-25_wxd.png">
                    <div class="donate-tip">微信扫一扫，向我赞赏</div>
                </div>
                <div class="donate-zfb donate-item">
                    <img src="https://diygod.b0.upaiyun.com/2016-08-25_zfbd.png">
                    <div class="donate-tip">支付宝扫一扫，向我赞赏</div>
                </div>
            </div>
        </div>
    `);

    $('.donate-word').click(() => {
        if ($('.donate-body').hasClass('donate-show')) {
            $('.donate-body').removeClass('donate-show');
        }
        else {
            $('.donate-body').addClass('donate-show');
        }
    })

    // donate list
    if (window.donateData && $('.donate-table').length) {
        const data = window.donateData.sort(function (a, b) {
            return a[0] > b[0] ? 1: -1;
        });
        let html = ``;
        for (let i = data.length - 1; i >= 0; i--) {
            html += `
                <tr>
                    <td>${data[i][0]}</td>
                    <td>${data[i][1]}</td>
                    <td>${data[i][2]}</td>
                </tr>
            `
        }
        $('.donate-table tbody').append(html);
    }

    // ajax comment
    var __cancel = jQuery('#cancel-comment-reply-link'),
        __cancel_text = __cancel.text(),
        __list = 'commentlist';//your comment wrapprer

    var ajaxcomment = {
        ajax_url: 'https://www.anotherhome.net/wp-admin/admin-ajax.php',
        formpostion: 'bottom',
        order: 'noasc'
    }
    jQuery(document).on("submit", "#commentform", function() {
        jQuery.ajax({
            url: ajaxcomment.ajax_url,
            data: jQuery(this).serialize() + "&action=ajax_comment",
            type: jQuery(this).attr('method'),
            beforeSend: function () {
                addComment.createButterbar("正在提交,好累呀~");
                $('.form-submit input').attr('disabled', 'disabled');
                NProgress.set(0.7);
            },
            error: function(request) {
                var t = addComment;
                t.createButterbar(request.responseText);
                $('.form-submit input').attr('disabled', false);
                NProgress.set(1.0);
            },
            success: function(data) {
                jQuery('textarea').each(function() {
                    this.value = ''
                });
                var t = addComment,
                    cancel = t.I('cancel-comment-reply-link'),
                    temp = t.I('wp-temp-form-div'),
                    respond = t.I(t.respondId),
                    post = t.I('comment_post_ID').value,
                    parent = t.I('comment_parent').value;
                if (parent != '0') {
                    jQuery('#respond').before('<ol class="children">' + data + '</ol>');
                } else if (!jQuery('.' + __list ).length) {
                    if (ajaxcomment.formpostion == 'bottom') {
                        jQuery('#respond').before('<ol class="' + __list + '">' + data + '</ol>');
                    } else {
                        jQuery('#respond').after('<ol class="' + __list + '">' + data + '</ol>');
                    }

                } else {
                    if (ajaxcomment.order == 'asc') {
                        jQuery('.' + __list ).append(data); // your comments wrapper
                    } else {
                        jQuery('.' + __list ).prepend(data); // your comments wrapper
                    }
                }
                t.createButterbar("提交");
                $('.form-submit input').attr('disabled', false);
                NProgress.set(1.0);
                cancel.style.display = 'none';
                cancel.onclick = null;
                t.I('comment_parent').value = '0';
                if (temp && respond) {
                    temp.parentNode.insertBefore(respond, temp);
                    temp.parentNode.removeChild(temp)
                }
            }
        });
        return false;
    });
    var addComment = {
        moveForm: function(commId, parentId, respondId) {
            var t = this,
                div, comm = t.I(commId),
                respond = t.I(respondId),
                cancel = t.I('cancel-comment-reply-link'),
                parent = t.I('comment_parent'),
                post = t.I('comment_post_ID');
            __cancel.text(__cancel_text);
            t.respondId = respondId;
            if (!t.I('wp-temp-form-div')) {
                div = document.createElement('div');
                div.id = 'wp-temp-form-div';
                div.style.display = 'none';
                respond.parentNode.insertBefore(div, respond)
            }!comm ? (temp = t.I('wp-temp-form-div'), t.I('comment_parent').value = '0', temp.parentNode.insertBefore(respond, temp), temp.parentNode.removeChild(temp)) : comm.parentNode.insertBefore(respond, comm.nextSibling);
            jQuery("body").animate({
                scrollTop: jQuery('#respond').offset().top - 180
            }, 400);
            parent.value = parentId;
            cancel.style.display = '';
            cancel.onclick = function() {
                var t = addComment,
                    temp = t.I('wp-temp-form-div'),
                    respond = t.I(t.respondId);
                t.I('comment_parent').value = '0';
                if (temp && respond) {
                    temp.parentNode.insertBefore(respond, temp);
                    temp.parentNode.removeChild(temp);
                }
                this.style.display = 'none';
                this.onclick = null;
                return false;
            };
            try {
                t.I('comment').focus();
            } catch (e) {}
            return false;
        },
        I: function(e) {
            return document.getElementById(e);
        },
        clearButterbar: function(e) {
            if (jQuery(".butterBar").length > 0) {
                jQuery(".butterBar").remove();
            }
        },
        createButterbar: function(message) {
            // var t = this;
            // t.clearButterbar();
            // jQuery("body").append('<div class="butterBar butterBar--center"><p class="butterBar-message">' + message + '</p></div>');
            // setTimeout("jQuery('.butterBar').remove()", 3000);
            document.getElementById('submit').value = message;
        }
    };
    // ajax comment end

    // ajax comment page
    function ajaxCommentPage() {
        $("#comments-nav a").on("click", function(e) {
            e.preventDefault();
            NProgress.set(0.7);
            jQuery.get($(this).attr('href'), function(data) {
                $(".commentshow").html($(data).find('.commentshow'));
                NProgress.set(1.0);
                $("body, html").animate({
                    scrollTop: $(".commentshow").offset().top - 120
                }, 1000);
                ajaxCommentPage();
            });
            return false;
        })
    }
    ajaxCommentPage();

    // live2d
    loadlive2d("live2d", "/wp-content/themes/Amativeness/lib/live2d/22/22.model.json");

    /*!
     * online
     * Copyright(c) 2016 luojia <luojia@luojia.me>
     * MIT Licensed
     */
    class Online{
        constructor(addr){
            this.addr=addr;
            this.groups=new Set();
            this.on=false;
            this.waiting=false;
            this.onOnlineChange=null;
            this.pinger=setInterval(()=>{this.opened&&this.ws.send('');},20000);
            this.user=`${conv(Date.now(),10,62)}-${randomUser()}`;
            this.ws=null;
            if(window.localStorage){//use stored user sign
                var user=localStorage.getItem('online_user');
                if(!user)localStorage.setItem('online_user',this.user);//save the user
                else{this.user=user;}//restore the user
            }
            if(addr){
                this.on=true;
                this.connet();
            }
        }
        get opened(){return this.ws&&this.ws.readyState===1;}
        enter(name){
            if(typeof name !== 'string')throw('name is not a string:'+name);
            this.groups.add(name);
            if(this.opened)
                this.ws.send(JSON.stringify({_:'enter',g:name,u:this.user}));
            return this;
        }
        leave(name){
            if(typeof name !== 'string')throw('name is not a string:'+name);
            if(this.opened && this.groups.delete(name)){
                this.ws.send(JSON.stringify({_:'leave',g:name}));
            }
            return this;
        }
        leaveAll(){
            if(this.opened)
                for(let g of this.groups)this.leave(g);
            return this;
        }
        _report(data){
            this.onOnlineChange&&this.onOnlineChange(data);
        }
        connet(addr){
            this.waiting=false;
            if(addr)this.addr=addr;
            if(this.on===false)return;
            if(this.opened)return;
            let ws=this.ws=new WebSocket(this.addr);
            ws.onmessage=m=>{
                if(m.data==='connected'){
                    for(let g of this.groups)this.enter(g);
                    return;
                }
                let msg=JSON.parse(m.data);
                switch(msg._){
                    case 'ol':{
                        msg.c=parseInt(msg.c,32);
                        msg.u=parseInt(msg.u,32);
                        this._report(msg);
                        break;
                    }
                }
            }
            ws.onclose=e=>{
                if(this.waiting)return;
                for(let g of this.groups)this._report({g:g,c:0,u:0});
                this.waiting=true;
                setTimeout(()=>{this.connet()},5000);
            }
            ws.onerror=e=>{
                ws.onclose();
            }
            return this;
        }
        close(){
            this.on=false;
            this.ws.close();
            clearInterval(this.pinger);
        }
    }

    function randomUser(){
        return conv(Math.round(99999999*Math.random()),10,62);
    }

    //gist: https://gist.coding.net/u/luojia/c33a7e50d9634a1d9084ebd71c468114/
    function conv(n,o,t,olist,tlist){//数,原进制,目标进制[,原数所用字符表,目标字符表]
        var dlist='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            tnum=[],m,negative=((n+='').trim()[0]=='-'),decnum=0;
        olist||(olist=dlist);
        tlist||(tlist=dlist);
        if(negative)n=n.slice(1);
        for(var i=n.length;i--;)
            decnum+=olist.indexOf(n[i])*Math.pow(o,n.length-i-1);
        for(;decnum!=0;tnum.unshift(tlist[m])){
            m=decnum%t;
            decnum=Math.floor(decnum/t);
        }
        decnum&&tnum.unshift(tlist[decnum]);
        return (negative?'-':'')+tnum.join('');
    }

    var ol = new Online('wss://api.prprpr.me/online/');
    ol.enter(document.domain);
    ol.onOnlineChange = function(data) {
        // console.log(data)
        document.getElementById('online-count').innerHTML = data.u;
    }

});
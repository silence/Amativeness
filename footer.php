    <footer id="colophon" role="contentinfo" itemscope="" itemtype="https://schema.org/WPFooter">
        <div class="footer-image"></div>
        <div class="container">
            <p>博客已萌萌哒运行<span id=span_dt_dt></span><span class="my-face">(●'◡'●)ﾉ♥</span></p>
            <p>
                托管于<a href="https://www.qcloud.com/" target="_blank"> 腾讯云</a>.
                <a href="https://www.upyun.com/" target="_blank">又拍云</a> 提供静态文件云存储服务.
                <a href="http://www.google.com/analytics/" target="_blank">Google Analytics </a>提供网站统计服务.
                <a href="http://www.cloudxns.net/" target="_blank">CloudXNS </a>提供 DNS 解析服务.
            </p>
            <p>&copy; 2017 <a href="<?php echo home_url(); ?>/"><?php bloginfo('name'); ?></a>.
                由 <a href="http://wordpress.org" target="_blank">Wordpress</a> 强力驱动.
                Theme By <a href="https://github.com/DIYgod/Amativeness" target="_blank">Amativeness</a>.
                <a href="https://www.anotherhome.net/sitemap.xml" target="_blank">站点地图</a>.
                鲁ICP备16000184号.
            </p>
            <p>Made with <i class="fa fa-heart throb" style="color: #d43f57;"></i> by DIYgod. </p>
        </div>
    </footer>
    </div>
    <?php wp_footer(); ?>
    <script src="<?php echo get_template_directory_uri(); ?>/lib/typed.js/dist/typed.min.js"></script>
    <script src="<?php echo get_template_directory_uri(); ?>/lib/jquery-lazyload/jquery.lazyload.js"></script>
    <script src="<?php echo get_template_directory_uri(); ?>/lib/notie/browser/notie.js"></script>
    <script src="<?php echo get_template_directory_uri(); ?>/lib/social-share.js/dist/js/jquery.share.min.js"></script>
    <script src="<?php echo get_template_directory_uri(); ?>/lib/live2d/live2d.js"></script>
    <script src="<?php echo get_template_directory_uri() . '/main.js?ver=' . version ?>"></script>
    <script>
        NProgress.set(1.0);
    </script>
    <!-- <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register("/sw.js?v=<?php echo rand(1,999); ?>");
        }
    </script> -->
    </body>
</html>

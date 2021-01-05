<?php 


add_filter( 'login_headerurl', function() {
	return 'https://loa.robr.app';
});


add_action( 'login_enqueue_scripts', function() {
	?>

		<style>
			.login h1 a {
				background: url('<?php echo get_stylesheet_directory_uri(); ?>/logo.png' ) !important;
				background-size: 96px 96px !important;
				width: 96px !important;
				height: 96px !important;
			}
		</style>

	<?php
});


add_filter('admin_footer_text', '__return_false' );


add_action( 'wp_before_admin_bar_render', function() {
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu( 'wp-logo' );
});
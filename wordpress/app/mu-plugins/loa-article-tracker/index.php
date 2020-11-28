<?php

/**
 * Plugin Name: Loa Article Tracker
 * Plugin URI:  https://loa.robr.app
 * Description: Controls how Loa handles/displays articles
 * Version:     0.0.1
 * Author:      Rob
 * Author URI:  https://robrotell.com
 *
 * Text Domain: loa
 */

namespace Loa_Article_Tracker; 


defined( 'ABSPATH' ) || exit;


class ArticleTracker
{
	public $plugin_path     = false;
    public $plugin_inc_path = false;
	public $plugin_url = false;

    // plugin classes
    public $core        = null;
    public $admin       = null;
	public $endpoint    = null;
	public $helpers 	= null;


	protected static $instance = null;
	public static function instance()
	{
		if( !isset( self::$instance ) ) {
			$class_name = __CLASS__;
			self::$instance = new $class_name;
		}
		return self::$instance;
    }
    

    public function __construct()
    {
        $this->define();
        $this->includes();
    }


    public function define()
    {
		$this->plugin_path 		= untrailingslashit( plugin_dir_path( __FILE__ ) );
		$this->plugin_inc_path 	= $this->plugin_path . '/includes';
		$this->plugin_url  		= plugin_dir_url( __FILE__ );
    }


    public function includes()
    {
        $classes = [
			'helpers',
            'core',
			'admin',
			'endpoint', // v2
			'rest-endpoint', // v1
        ];

        foreach( $classes as $class ) {
            require_once( sprintf( '%s/class-%s.php', $this->plugin_inc_path, $class ) );
        }

		$this->helpers 	= new Helpers();
        $this->core     = new Core();
		$this->admin    = new Admin();
		$this->endpoint = new Endpoint(); // v2
		
		$this->rest_endpoint = new Rest_Endpoint(); // v1
    }
}


function LoaArticleTracker() {
    return ArticleTracker::instance();
}


LoaArticleTracker();
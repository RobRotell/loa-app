<?php

namespace Loa_Article_Tracker;

use WP_REST_Request;
use Exception;


defined( 'ABSPATH' ) || exit;


class Endpoint
{
	private static $transient_all 	= 'loa_cached_everything';
	private static $token_prefix 	= 'loa_token';
	
	private $auth_key;



	public function __construct()
	{
		$this->auth_key = get_option( Admin::$option_name );

		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
	}



	public function register_routes()
	{
		$namespace = 'article-repo/v2';

		register_rest_route(
			$namespace,
			'/get-auth-token',
			[
				'methods'	=> 'GET',
				'callback'	=> [ $this, 'route_get_auth_token' ],
				'args'		=> [
					'key'	=> [
						'required'			=> true,
						'type'				=> 'string',
						'sanitize_callback'	=> [ $this, 'clean_auth_key' ]
					]
				]
			]
		);
		
		register_rest_route(
			$namespace,
			'/get-everything',
			[
				'methods'	=> 'GET',
				'callback'	=> [ $this, 'route_get_everything' ],
				'args'		=> [
					'token'	=> [
						'required'			=> true,
						'type'				=> 'string',
						'validate_callback'	=> [ $this, 'validate_token' ]
					]
				]
			]
		);
		
		register_rest_route(
			$namespace,
			'/get-tags',
			[
				'methods'	=> 'GET',
				'callback'	=> [ $this, 'route_get_tags' ],
				'args'		=> [
					'token'	=> [
						'required'			=> true,
						'type'				=> 'string',
						'validate_callback'	=> [ $this, 'validate_token' ]
					]
				]
			]
		);
		
		register_rest_route(
			$namespace,
			'/get-articles',
			[
				'methods'	=> 'GET',
				'callback'	=> [ $this, 'route_get_articles' ],
				'args'		=> [
					'token'	=> [
						'required'			=> true,
						'type'				=> 'string',
						'validate_callback'	=> [ $this, 'validate_token' ]
					]
				]
			]
		);					
	}


	/**
	 * Get authorization token based on supplied key
	 *
	 * @param	WP_REST_Request	$request 	Request
	 * @return 	array 						[ success, data ]
	 */
	public function route_get_auth_token( WP_REST_Request $request )
	{
		$key = $request->get_param( 'key' );

		// does submitted key match auth key?
		if( $key !== $this->auth_key ) {
			wp_send_json_error( 'Invalid authorization key' );
		}

		// create token value
		$token = random_bytes( 24 );
		$token = bin2hex( $token );

		// save token to database (valid for seven days)
		$success = set_transient( 
			sprintf( '%s_%s', self::$token_prefix, $token ), 
			$key, 
			604800 
		);

		if( !$success ) {
			wp_send_json_error( 'Failed to generate token' );
		} else {
			wp_send_json_success( $token );
		}
	}


	/**
	 * Get all articles and all article tags
	 *
	 * @param	WP_REST_Request	$request 	Request
	 * @return 	array 						[ success, data ]
	 */
	public function route_get_everything( WP_REST_Request $request )
	{
		$data = get_transient( self::$transient_all );

		if( empty( $data ) ) {
			$data = [
				'tags'		=> Helpers::get_tags(),
				'articles'	=> Helpers::get_articles(),
				'totalRead'	=> Helpers::get_total_read()
			];

			set_transient( self::$transient_all, $data, 604800 );
		}

		wp_send_json_success( $data );
	}


	/**
	 * Get all article tags
	 *
	 * @param	WP_REST_Request	$request 	Request
	 * @return 	array 						[ success, data ]
	 */
	public function route_get_tags( WP_REST_Request $request )
	{
		wp_send_json_success( Helpers::get_tags() );
	}	


	/**
	 * Get all articles
	 *
	 * @param	WP_REST_Request	$request 	Request
	 * @return 	array 						[ success, data ]
	 */
	public function route_get_articles( WP_REST_Request $request )
	{
		wp_send_json_success( Helpers::get_articles() );
	}	


	/**
	 * Clean, format, and hash submitted authorization key
	 *
	 * @param	string	$key 	Raw key
	 * @return 	string 			Formatted key
	 */
	public function clean_auth_key( string $key )
	{
		$key = sanitize_text_field( $key );
		$key = strtolower( trim( $key ) );
		$key = preg_replace( '/[^A-Za-z0-9]/', '', $key );
		$key = md5( $key );

		return $key;
	}


	/**
	 * Validate a request's token
	 *
	 * @param	string	$token 	Request token
	 * @return	bool 			True, if valid
	 */
	public function validate_token( string $token )
	{
		$token = sanitize_text_field( $token );
		$token = trim( $token );

		$transient = get_transient( 
			sprintf( 
				'%s_%s', 
				self::$token_prefix, 
				$token 
			) 
		);

		// transient value should match authorization key
		return $transient === $this->auth_key;
	}

}
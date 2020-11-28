<?php

namespace Loa_Article_Tracker;


defined( 'ABSPATH' ) || exit;


class Helpers
{
	/**
	 * Get all article tags
	 *
	 * @return 	array 	Tags
	 */
	public static function get_tags()
	{
		$transient_name = 'loa_article_tracker_all_terms';

		$terms = get_transient( $transient_name );
		if( empty( $terms ) ) {
			$terms = get_terms(
				[
					'taxonomy'		=> Core::TAXONOMY,
					'hide_empty'	=> false,
					'fields'		=> 'id=>name'
				]
			);			

			set_transient( $transient_name, $terms, 604800 );
		}

		return $terms;
	}


	/**
	 * Get all (unread) articles
	 *
	 * @return 	array 	Articles
	 */
	public static function get_articles()
	{
		$transient_name = 'loa_article_tracker_all_articles';
		
		$articles = get_transient( $transient_name );
		if( empty( $articles ) ) {
			$posts = get_posts(
				[
					'post_type'         => Core::POSTTYPE,
					'posts_per_page'    => -1,
					'meta_query'		=> [
						[
							'key'		=> 'article_date_read',
							'value'		=> '',
							'compare'	=> 'NOT EXISTS'
						]
					]
				]
			);		

			require_once( LoaArticleTracker()->plugin_inc_path . '/models/class-article.php' );
			$articles = [];
			foreach( $posts as $post ) {
				$articles[] = ( new Article( $post ) )->get();
			}

			set_transient( $transient_name, $articles, 604800 );
		}
		
		return $articles;
	}


	/**
	 * Get count for read articles
	 *
	 * @return 	int 	Total read articles
	 */
	public static function get_total_read()
	{
		$read_article_ids = get_posts(
			[
				'post_type'			=> Core::POSTTYPE,
				'posts_per_page'	=> -1,
				'fields'			=> 'ids',
				'meta_query'		=> [
					'key'		=> 'article_date_read',
					'compare'	=> 'EXISTS'
				]
			]
		);

		return count( $read_article_ids );
	}


}
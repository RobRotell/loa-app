<?php

// BEGIN iThemes Security - Do not modify or remove this line
// iThemes Security Config Details: 2
define( 'DISALLOW_FILE_EDIT', true ); // Disable File Editor - Security > Settings > WordPress Tweaks > File Editor
// END iThemes Security - Do not modify or remove this line

/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */
define( 'DB_NAME', 		'robrotel_loa_api' );
define( 'DB_USER', 		'robrotel_loa_api' );
define( 'DB_PASSWORD', 	'y6dJ1yk7Awz@.po7[x' );
define( 'DB_HOST', 		'localhost' );
define( 'DB_CHARSET', 	'utf8' );
define( 'DB_COLLATE', 	'' );

define( 'LOA_AUTH', 'punkmambo' );

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'Hc?!Dh?NDP%1^Og.gCSw.?2xSA1Mf5IdE`:J)[k(0vfi!!oO[Or]Rmkz.5nZX=[I');
define('SECURE_AUTH_KEY',  ')O]mJHKi3UI@t,+$0WM5^*rJ|By<tVdg:M()DazJT))`))g:yZ4SNV_X9k-E5`mK');
define('LOGGED_IN_KEY',    ']O|* cY7:8L|vWPpxt$|b*t{&4ufqE`(44[%DqJkiVABo>$hV]9HI+idaXPM$}4@');
define('NONCE_KEY',        'WaS:r|I<HAITy]4>/iS?F5+D^$`zpmdrp[m~+Oc/9XQEvP%q{/q/#phzUHZPp;hg');
define('AUTH_SALT',        'r^Q`I6PURBV/}s;6g(ZY5GEW~A#*{&*n2o3{!({}|AAC^u)@Dj*1pLLqQ^=--DKZ');
define('SECURE_AUTH_SALT', 'Z-TBT}qBJU# l7?8g%]IwaY}F<H1Pw?L+-ma^Deu/qE(@@by;bSUPmURo&iT9liJ');
define('LOGGED_IN_SALT',   '32qHM|;kb*6eN7kd+H+7RO6J|gBQk7a;A+tNerkMI($b;jD|]+lZtt-M<Y`f6Rm ');
define('NONCE_SALT',       '<fFIj/:.9%30UZJdrxd!OX8g,Q%.d:$0w71nX:7_)P@`Nf-n,*J6vYi|_#0zuHyS');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'mu4der_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define( 'WP_DEBUG', false );
define( 'WP_DEBUG_LOG', false );
define( 'WP_DEBUG_DISPLAY', false );


/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) )
	define( 'ABSPATH', dirname( __FILE__ ) . '/' );

/** Custom content directory */
define ('WP_CONTENT_FOLDER_NAME', 'app');
define( 'WP_CONTENT_DIR', ABSPATH . 'app' );
define( 'WP_CONTENT_URL', sprintf( 'https://%s/%s', $_SERVER['HTTP_HOST'], WP_CONTENT_FOLDER_NAME ) );
define( 'MUPLUGINDIR', WP_CONTENT_DIR . '/mu-plugins' );
define( 'WP_PLUGIN_DIR', realpath( WP_CONTENT_DIR . '/plugins' ) );
define( 'UPLOADS', 'app/assets' );

/** Sets up WordPress vars and included files. */
require_once( ABSPATH . 'wp-settings.php' );
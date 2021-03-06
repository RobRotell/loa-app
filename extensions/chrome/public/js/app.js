var Loa = ( ( Loa ) => {


	document.addEventListener( 'DOMContentLoaded', e => {
		Loa.Forefront.init()
		Loa.Background.init()
	})
	


	Loa.Forefront = {
		el: document.getElementById('loa_popup'),

		// article elements
		elUrlInput:		null,
		elTagSelect: 	null,
		elSubmitBtn: 	null,

		// login elements
		elLoginBtn: 	null,
		elAuthInput:	null,

		// for errors, successes, warnings
		elNotice: 		null,

		// event flags
		isSubmitting: 	false,


		init() {
			if( null !== this.el ) {
				this.elUrlInput 	= this.el.querySelector('.js-article-url')
				this.elTagSelect 	= this.el.querySelector('.js-article-tag')
				this.elSubmitBtn	= this.el.querySelector('.js-article-submit')

				this.elLoginBtn 	= this.el.querySelector('.js-login-btn')
				this.elAuthInput 	= this.el.querySelector('.js-login-auth')

				this.elNotice 		= this.el.querySelector('.js-notice')


				// use current tab's URL as input value
				chrome.tabs
					.query({
						active: true, 
						lastFocusedWindow: true
					}, tabs => this.elUrlInput.value = tabs[0].url )
				
				this.bind()
			}
		},


		bind() {
			this.elUrlInput.addEventListener( 'keyup', this.resetUrlStates.bind( this ) )
			this.elSubmitBtn.addEventListener( 'click', this.handleUrlSubmit.bind( this ) )
			this.elLoginBtn.addEventListener( 'click', this.handleLoginBtnClick.bind( this ) )
			this.elAuthInput.addEventListener( 'keyup', this.handleAuthInput.bind( this ) )
		},


		resetUrlStates() {
			this.elUrlInput.classList.remove('is-error', 'is-success')
			this.elSubmitBtn.classList.remove('is-error', 'is-success')

			this.showMessage( null, null, false )
		},


		async handleUrlSubmit( e ) {
			const url 	= this.elUrlInput.value,
				tag 	= this.elTagSelect.value

			this.resetUrlStates()

			// check for URL value
			if( !url.length ) {
				return
			}

			// logged in?
			if( !Loa.Background.isLoggedIn ) {
				this.elSubmitBtn.classList.add('is-error')
				this.hintLogin()
				return
			}

			// confirm that URL is a valid URL
			const urlRegex = new RegExp( '^(?:(?:(?:https?|ftp):)?\\/\\/)(?:\\S+(?::\\S*)?@)?(?:(?!(?:10|127)(?:\\.\\d{1,3}){3})(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z0-9\\u00a1-\\uffff][a-z0-9\\u00a1-\\uffff_-]{0,62})?[a-z0-9\\u00a1-\\uffff]\\.)+(?:[a-z\\u00a1-\\uffff]{2,}\\.?))(?::\\d{2,5})?(?:[/?#]\\S*)?$', 'i' )
			
			if( !urlRegex.test( url ) ) {
				this.elUrlInput.classList.add('is-error')
				this.elSubmitBtn.classList.add('is-error')
				this.showMessage( 'Invalid URL!', 'error' )
				return
			}

			if( this.isSubmitting ) {
				return
			} else {
				this.isSubmitting = true
			}

			// at this point, good to send to API
			this.elSubmitBtn.classList.add('is-submitting')

			const result = await Loa.Background.addArticle( url, tag )

			if( true === result ) {
				this.elSubmitBtn.classList.remove('is-submitting')
				this.elSubmitBtn.classList.add('is-success')
				this.elUrlInput.classList.add('is-success')
				this.isSubmitting = false
	
				this.showMessage( 'Successfully added article!', 'success' )

			} else {
				console.warn( result )
				this.elSubmitBtn.classList.remove('is-submitting')
				this.elUrlInput.classList.add('is-error')
				this.isSubmitting = false

				if( 'string' !== result ) {
					result = 'Failed to add article!'
				}
	
				this.showMessage( result, 'error' )
			}
		},


		handleLoginBtnClick( e ) {
			const input 	= this.elAuthInput,
				isVisible 	= input.classList.contains('is-active'),
				authKey 	= input.value

			this.showMessage()

			if( Loa.Background.isLoggedIn ) {
				this.triggerIsLoggedIn()
			} else {
				if( authKey.length ) {
					this.submitAuthKey( authKey )
				} else {
					input.classList.toggle( 'is-active', !isVisible )
				}
			}
		},


		hintLogin() {
			this.elLoginBtn.classList.add('is-wiggling')
			setTimeout( () => this.elLoginBtn.classList.remove('is-wiggling'), 2000 )

			this.showMessage( 'Log into app first!', 'warning' )
		},


		handleAuthInput( e ) {
			const input = this.elAuthInput,
				value 	= input.value

			input.classList.remove('is-error')

			if( 13 === e.keyCode && value.length ) {
				this.submitAuthKey( value )
			}
		},


		async submitAuthKey( authKey = '' ) {
			if( !authKey.length ) {
				return
			}

			const response = await Loa.Background.sendAuth( authKey )

			if( true !== response ) {
				if( 'string' === typeof response ) {
					console.warn( response )
					this.showMessage( response, 'error' )
					this.elAuthInput.classList.add('is-error')
				}
			} else {
				this.showMessage( 'Successfully logged in!', 'success' )
				this.triggerIsLoggedIn()
			}
		},


		async triggerIsLoggedIn() {
			this.elSubmitBtn.classList.remove('is-error')
			this.elAuthInput.classList.remove( 'is-active', 'is-error' )
			this.elLoginBtn.classList.add('is-logged-in')

			const tags = await Loa.Background.getTags()

			this.loadTags( tags )
		},


		loadTags( tags = [] ) {
			if( !Array.isArray( tags ) ) {
				return
			}

			tags.forEach( tag => {
				const option = document.createElement('option')

				option.value = tag.id
				option.text = tag.name

				this.elTagSelect.append( option )
			})
		},


		showMessage( msg = '', status = '', autoHide = false ) {
			this.elNotice.innerText = msg

			this.elNotice.classList.toggle( 'is-success', 'success' === status )
			this.elNotice.classList.toggle( 'is-warning', 'warning' === status )
			this.elNotice.classList.toggle( 'is-error', 'error' === status )

			if( true === autoHide ) {
				setTimeout( () => {
					this.elNotice.innerText = ''
					this.elNotice.classList.remove( 'is-success', 'is-warning', 'is-error' )
				}, 6000 )
			}
		}

	}




	Loa.Background = {
		endpoint: 			'https://api.loa.robr.app/wp-json/article-repo/v2',
		token: 				null,
		isLoggedIn: 		false,

		storageKeyToken: 	'loaAuthToken',
		storageKeyTags: 	'loaArticleTags',


		async init() {

			// check if token is saved locally
			const token = await this.getTokenFromStorage()

			if( !token ) {
				console.warn( 'No token saved locally' )

			// if local token, confirm that token is still valid
			} else {
				const isValid = await this.validateToken( token )

				if( isValid ) {
					this.token = token
					this.isLoggedIn = true

					Loa.Forefront.triggerIsLoggedIn()

				// clear local token to avoid running again
				} else {
					chrome.storage.local.remove( this.storageKeyToken )
				}
			}
		},


		getTokenFromStorage() {
			return new Promise( ( resolve, reject ) => {
				chrome.storage.local
					.get( this.storageKeyToken, result => {
						if( 'object' === typeof result && result.hasOwnProperty( this.storageKeyToken ) ) {
							result = result[ this.storageKeyToken ]

							const { token, expire } = result
		
							if( undefined !== token && !isNaN( expire ) ) {
								if( !this.checkIfExpired( expire ) ) {
									resolve( token )
								}
							}
						}
	
						resolve( false )
					})
			})
		},


		validateToken( token = '' ) {
			if( 'string' !== typeof token || !token.length ) {
				return false
			} else {
				const params = new URLSearchParams()

				params.append( 'token', token )

				return fetch( `${this.endpoint}/check-auth-token?${params.toString()}` )
					.then( response => response.json() )
					.then( response => {
						const { valid } = response

						if( '1' === valid ) {
							return true
						}

						return false
					})
			}
		},


		sendAuth( authKey = '' ) {

			// if we're already logged in, just send true
			if( this.isLoggedIn ) {
				return true
			}

			// leave early if no value
			if( !authKey.length ) {
				return false
			}

			const params = new URLSearchParams()
			params.append( 'auth_key', authKey )

			return fetch( `${this.endpoint}/get-auth-token`, {
				body: 		params.toString(),
				method: 	'POST',
				headers: 	{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
			})
				.then( response => response.json() )
				.then( response => {
					const { token, success } = response

					if( true === success && 'string' === typeof token && token.length ) {
						this.saveTokenToStorage( token )
						return true

					} else {
						const { error, message } = response

						if( true === error && 'string' === typeof message && message.length ) {
							return message
						} else {
							console.warn( response )
							return 'Failed to obtain token'
						}
					}
				})
		},


		saveTokenToStorage( token = '' ) {
			if( !token.length ) {
				return
			}

			this.token = token

			// save to browser storage
			let data = {}
			data[ this.storageKeyToken ] = {
				token: 	token,
				expire: this.getExpireTime()
			}

			return chrome.storage.local.set( data )
		},


		async getTags() {
			let tags = null

			// try to fetch tags from local storage
			tags = await this.getTagsFromStorage()

			chrome.storage.local.remove( this.storageKeyTags )

			// if no tags (or they're not an array), fetch tags from endpoint
			if( !Array.isArray( tags ) && this.token.length ) {
				const params = new URLSearchParams()
				params.append( 'token', this.token )
	
				tags = fetch( `${this.endpoint}/get-tags?${params.toString()}` )
					.then( response => response.json() )
					.then( response => {
						const { tags, success } = response

						if( true === success && 'object' === typeof tags ) {
							const tagsForDisplay = []

							for( let id in tags ) {
								tagsForDisplay.push({
									id: 	parseInt( id ),
									name: 	tags[ id ]
								})
							}
	
							this.saveTagsToStorage( tagsForDisplay )
							return tagsForDisplay
						} 
					})
			}

			return tags
		},


		getTagsFromStorage() {
			return new Promise( ( resolve, reject ) => {
				if( !this.isLoggedIn ) {
					resolve( false )
				}

				chrome.storage.local
					.get( this.storageKeyTags, result => {
						if( 'object' === typeof result && result.hasOwnProperty( this.storageKeyTags ) ) {
							result = result[ this.storageKeyTags ]
	
							const { tags, expire } = result
	
							if( undefined !== tags && !isNaN( expire ) ) {
								if( !this.checkIfExpired( expire ) ) {
									resolve( tags )
								}
							}
						} 
	
						resolve( false )
					})
			})

		},


		saveTagsToStorage( tags = [] ) {
			let data = {}

			data[ this.storageKeyTags ] = {
				tags: tags,
				expire: this.getExpireTime()
			}

			return chrome.storage.local.set( data )			
		},


		getExpireTime() {
			return 604800 + Date.now()
		},


		checkIfExpired( timeToCheck ) {
			return ( timeToCheck < Date.now() )
		},


		addArticle( url, tag ) {
			if( 'string' !== typeof url || !url.length ) {
				return 'Invalid URL!'
			}

			const params = new URLSearchParams()
			params.append( 'token', this.token )
			params.append( 'url', url )

			console.log( url )

			if( 'string' === typeof tag && tag.length ) {
				tag = parseInt( tag )

				if( !isNaN( tag ) ) {
					params.append( 'tags', parseInt( tag ) )
				}
			}

			return fetch( `${this.endpoint}/add-article`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				body: params.toString()
			})
				.then( response => response.json() )
				.then( response => {
					const { success } = response

					if( true === success ) {
						return true 
					} else {
						const { error } = response

						if( 'string' === typeof( error ) && error.length ) {
							return error
						} else {
							return 'Failed to add article!'
						}
					}
			})
		}

	}




	return Loa

}) ( Loa || {} )
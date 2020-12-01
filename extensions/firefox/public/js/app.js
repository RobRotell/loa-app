var Loa = ( ( Loa ) => {


	document.addEventListener( 'DOMContentLoaded', e => {
		Loa.Forefront.init()
		Loa.Background.init()
	})


	// check for token
		// valid
			// is-logged-in
			// get tags

		// not valid
			// disable inputs
			// not logged in

	// submit
		// + turns into circle
			// works
				// checkmark
				// resets
			// doesn't work
				// cross


	// todo
		// time-limit/expiration on localStorage items
	

	Loa.Forefront = {
		el: document.getElementById('loa_popup'),

		// article elements
		elUrlInput:		null,
		elTagSelect: 	null,
		elSubmitBtn: 	null,

		// login elements
		elLoginBtn: 	null,
		elAuthInput:	null,

		// event flags
		isSubmitting: 	false,


		init() {
			if( null !== this.el ) {
				this.elUrlInput 	= this.el.querySelector('.js-article-url')
				this.elTagSelect 	= this.el.querySelector('.js-article-tag')
				this.elSubmitBtn	= this.el.querySelector('.js-article-submit')

				this.elLoginBtn 	= this.el.querySelector('.js-login-btn')
				this.elAuthInput 	= this.el.querySelector('.js-login-auth')

				// use current tab's URL as input value
				browser.tabs
					.query({
							active: true, 
							currentWindow: true
					}).then( tabs => {
						if( tabs.length ) {
							this.elUrlInput.value = tabs[0].url
						}
					})
				
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
		},


		handleUrlSubmit( e ) {
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
				return
			}

			if( this.isSubmitting ) {
				return
			} else {
				this.isSubmitting = true
			}

			// at this point, good to send to API
			this.elSubmitBtn.classList.add('is-submitting')
			Loa.Background.addArticle( url, tag )
				.then( () => {
					this.elSubmitBtn.classList.remove('is-submitting')
					this.elSubmitBtn.classList.add('is-success')

					this.elUrlInput.classList.add('is-success')
					this.isSubmitting = false
				}).catch( e => {
					console.warn( e )
					this.elSubmitBtn.classList.remove('is-submitting')
					this.elUrlInput.classList.add('is-error')
					this.isSubmitting = false
				})
		},


		handleLoginBtnClick( e ) {
			const input 	= this.elAuthInput,
				isVisible 	= input.classList.contains('is-active'),
				authKey 	= input.value

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

		},


		handleAuthInput( e ) {
			const input = this.elAuthInput,
				value 	= input.value

			input.classList.remove('is-error')

			if( 13 === e.keyCode && value.length ) {
				this.submitAuthKey( value )
			}
		},


		submitAuthKey( authKey = '' ) {
			if( !authKey.length ) {
				return
			}

			Loa.Background.sendAuth( authKey )
				.then( response => {
					if( true !== response ) {
						throw 'Invalid response from endpoint'
					} else {
						this.triggerIsLoggedIn()
					}
				}).catch( e => {
					console.warn( e )
					this.elAuthInput.classList.add('is-error')
				})
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
		}



	}




	Loa.Background = {
		endpoint: 			'https://api.loa.robr.app/wp-json/article-repo/v2',
		token: 				null,
		isLoggedIn: 		false,

		storageKeyToken: 	'loaAuthToken',
		storageKeyTags: 	'loaArticleTags',


		async init() {
			try {
				// check if token is saved locally
				let token = await browser.storage.local
					.get( this.storageKeyToken )
					.then( result => {
						if( 'object' === typeof( result ) && result.hasOwnProperty( this.storageKeyToken ) ) {
							return result[ this.storageKeyToken ]
						}
					})

				if( undefined === token ) {
					throw 'No token saved locally'
	
				// if local token, confirm that token is still valid
				} else {
					const params = new URLSearchParams()
					params.append( 'token', token )
	
					fetch( `${this.endpoint}/check-auth-token?${params.toString()}` )
						.then( response => response.json() )
						.then( response => {
	
							// if endpoint returns true, then token is valid
							if( true === response ) {
								this.token = token
								this.isLoggedIn = true

								// update frontend
								Loa.Forefront.triggerIsLoggedIn()
	
							} else {
								// clear local token to avoid running again
								browser.storage.local.remove( this.storageKeyToken )

								if( 'object' === typeof( response ) ) {
									const { message } = response
									throw message.length ? message : 'Unknown error validating token'

								} else {
									throw 'Failed to validate token'
								}
							}
						})
				}

			} catch( e ) {
				console.warn( e )
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

			return new Promise( ( resolve, reject ) => {
				const params = new URLSearchParams()
				params.append( 'key', authKey )

				fetch( `${this.endpoint}/get-auth-token`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: params.toString()
				})
					.then( response => response.json() )
					.then( response => {
						if( 'string' !== typeof( response ) ) {
							let error = 'Failed to obtain token'

							if( 'object' === typeof( response ) && response.hasOwnProperty( 'message' ) ) {
								error = response.message
							}

							reject( error )

						} else {
							this.saveTokenToStorage( response ).then( () => resolve( true ) )
						}
					})
			})
		},


		saveTokenToStorage( token = '' ) {
			if( !token.length ) {
				return
			}

			this.token = token

			// save to browser storage
			let data = {}
			data[ this.storageKeyToken ] = token

			return browser.storage.local.set( data )
		},


		async getTags() {
			let tags = null

			// try to fetch tags from local storage
			tags = await this.getTagsFromStorage()

			// if no tags (or they're not an array), fetch tags from endpoint
			if( !Array.isArray( tags ) && this.token.length ) {
				const params = new URLSearchParams()
				params.append( 'token', this.token )
	
				tags = fetch( `${this.endpoint}/get-tags?${params.toString()}` )
					.then( response => response.json() )
					.then( response => {
						const tags = []
	
						for( let id in response ) {
							tags.push({
								id: 	parseInt( id ),
								name: 	response[ id ]
							})
						}

						this.saveTagsToStorage( tags )
						return tags
					})
			}

			return tags
		},


		getTagsFromStorage() {
			if( null === this.token ) {
				return false
			}

			return browser.storage.local
				.get( this.storageKeyTags )
				.then( result => {
					if( 'object' === typeof( result ) && result.hasOwnProperty( this.storageKeyTags ) ) {
						return result[ this.storageKeyTags ]
					}
				})
		},


		saveTagsToStorage( tags = [] ) {
			let data = {}
			data[ this.storageKeyTags ] = tags

			return browser.storage.local.set( data )			
		},


		addArticle( url, tag ) {
			return new Promise( async ( resolve, reject ) => {
				try {
					if( 'string' !== typeof( url ) || !url.length ) {
						throw 'Invalid URL'
					}

					const params = new URLSearchParams()
					params.append( 'token', this.token )
					params.append( 'url', url )

					if( 'string' === typeof( tag ) && tag.length ) {
						tag = parseInt( tag )

						if( !isNaN( tag ) ) {
							params.append( 'tags', parseInt( tag ) )
						}
					}

					await fetch( `${this.endpoint}/add-article`, {
						method: 'POST',
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						},
						body: params.toString()
					})
						.then( response => response.json() )
						.then( response => {
							if( 'number' !== typeof( response ) ) {
								if( response.message ) {
									throw response.message
								} else {
									throw 'Failed to add article'
								}
							} else {
								resolve( response )
							}
					})

				} catch( e ) {
					reject( e )
				}
			})
		}

	}




	return Loa

}) ( Loa || {} )
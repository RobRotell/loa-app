class LoaHelper {
	constructor() {
		this.endpoint 	= 'https://api.loa.robr.app/wp-json/article-repo/v2'
		this.token 		= this.getToken()
		this.tags 		= this.getTags()
	}

	async getTags() {
		const self = this

		if( !Array.isArray( self.tags ) ) {
			self.tags = new Promise( async ( resolve, reject ) => {
				const token = await self.token

				if( !token.length ) {
					reject( 'Invalid token' )
					return
				}

				const params = new URLSearchParams()
				params.append( 'token', await self.token )
					
				fetch( `${self.endpoint}/get-tags?${params.toString()}` )
					.then( response => response.json() )
					.then( response => {
						resolve( response )
					})
			})
		}

		return this.tags
	}

	async getToken( authKey = '' ) {
		if( 'string' !== typeof( this.token ) ) {
			this.token = new Promise( ( resolve, reject ) => {
				resolve( '' )
			})
		}

		return this.token
	}

	async sendAuth( authKey = '' ) {
		if( authKey.length ) {
			return new Promise( ( resolve, reject ) => {
				const params = new URLSearchParams()
				params.append( 'key', authKey )

				fetch( `${this.endpoint}/get-auth-token?${params.toString()}` )
					.then( response => response.json() )
					.then( response => {
						if( 'string' === typeof( response ) ) {
							this.token = response
							this.tags = this.getTags()

							resolve( true )
						} else if( 'object' === typeof( response ) ) {
							const { message = 'Unknown error' } = response
							reject( message )
						}

						reject( 'Unknown error' )
					})
			})
		}
	}
}
const wpApi = {
	apiUrl: 'https://api.loa.robr.app/wp-json/article-repo',
	auth: 	null,


	getEverything() {
		const endpoint = `${this.apiUrl}/get-everything`;

		return fetch( endpoint )
			.then( response => response.json() )
			.then( response => {
				return {
					tags: this.parseTags( response.tags ),
					articles: this.parseArticles( response.articles ),
					totalRead: response.totalRead
				}
			})		
	},


	parseTags( rawTags ) {
		return rawTags.map( tag => {
			return {
				id: 		tag.id,
				name: 		tag.name,
				isActive: 	false
			}
		})
	},


	parseArticles( rawArticles ) {
		const articles = []

		rawArticles.forEach( article => {
			articles.unshift({
				id: 		article.ID,
				name: 		article.title,
				url: 		article.url,
				tags:		article.tags,
				dateAdded: 	article.date_added,
				dateRead: 	( article.date_read ) ? true : false,
				isFavorite: ( article.is_favorite ) ? true : false,
			})
		})

		return articles
	},


	saveArticle( dataToSend ) {
		const endpoint = `${this.apiUrl}/add-article`
		const formData = new FormData()

		formData.append( 'url', dataToSend.url )
		formData.append( 'tags', dataToSend.tags )
		formData.append( 'auth', this.checkForAuth() )

		return fetch(
			endpoint,
			{
				method: 'POST',
				body: formData
			}
		)
		.then( response => response.json() )
	},

	
	updateArticle( id, action ) {
		const endpoint = `${this.apiUrl}/update-article`
		const formData = new FormData()

		formData.append( 'id', id )
		formData.append( 'action', action )
		formData.append( 'auth', this.checkForAuth() )

		return fetch(
			endpoint,
			{
				method: 'POST',
				body: formData
			}
		)
		.then( response => response.json() )
	},


	checkForAuth() {
		if( this.auth === null )
			this.auth = new URLSearchParams( window.location.search ).get('auth')

		return this.auth
	}


}


export default wpApi



/*
 * Old functions



getTags() {
	const endpoint = `${this.apiUrl}/get-tags`;

	return fetch( endpoint )
		.then( response => response.json() )
		.then( response => {
			const tags = []
			
			response.forEach( rawTag => {
				tags.push({
					id: 		rawTag.id,
					name: 		rawTag.name,
					isActive: 	false,
				})					
			})

			return tags
		})
},


getArticles() {
	const endpoint = `${this.apiUrl}/get-articles`

	return fetch( endpoint )
		.then( response => response.json() )
		.then( response => {
			const articles = []

			response.forEach( rawArticle => {
				articles.unshift({
					id: 		rawArticle.ID,
					name: 		rawArticle.title,
					url: 		rawArticle.url,
					dateAdded: 	rawArticle.date_added,
					dateRead: 	( rawArticle.date_read ) ? true : false,
					isFavorite: ( rawArticle.is_favorite ) ? true : false,
					tags:		rawArticle.tags				
				})
			})

			return articles
		})		
}, 


*/
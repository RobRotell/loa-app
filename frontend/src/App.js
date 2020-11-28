import React, { Component } from 'react';

// import custom components
import Form from './components/Form'
import Status from './components/Status'
import Articlelist from './components/Articlelist'

// import helper functions
import wpApi from './helpers/wpApi'
import formApi from './helpers/formApi'


class App extends Component {

	state = {
		tags: 			[],
		articles: 		[],
		totalRead: 		0,

		statusMsg: 		'',
		statusState: 	'',
		newArticle: 	'',
	}


	// when component mounts, request tags and articles
	componentDidMount = () => {
		this.getItems()
	}	


	// grab tags and articles from WP API
	getItems = () => {
		const request = wpApi.getEverything()

		request.then( response => {
			this.setState({
				tags: 		response.tags,
				articles: 	response.articles,
				totalRead: 	response.totalRead
			})
		})
	}


	// initial app load state
	componentDidUpdate = () => {
		const elLoader 	= document.getElementById('loader')
		const elRoot	= document.getElementById('root')

		if( 
			this.state.tags.length && 
			this.state.articles.length
		) {
			elLoader.classList.add('is-loaded')
			elRoot.classList.add('is-loaded')

			setTimeout( () => {
				elLoader.classList.add('is-finished')
				elRoot.classList.remove('is-loading')
			}, 750 )		
		}
	}


	handleTagChange = clickedTagId => {
		this.setState({
			tags: this.state.tags.map( tag => {
				if( tag.id === clickedTagId )
					tag.isActive = !tag.isActive

				return tag
			})
		})
	}


	// reset error/update status when modifying input
	handleArticleInput = e => {
		this.setState({
			statusMsg: 		'',
			statusState: 	'',
			newArticle: 	e.target.value
		})
	}


	handleSubmit = e => {
		e.preventDefault()

		const newArticle = this.state.newArticle
		const invalidUrl = formApi.urlHasErrors( newArticle, this.state.articles )

		if( invalidUrl ) {
			this.setState({
				statusMsg: 		invalidUrl,
				statusState: 	'error'
			})		
			
			return
		}

		// prep data to send to WP
		const dataToSend = {
			url: newArticle,
			tags: []
		}

		// grab active tags
		this.state.tags.forEach( tag => {
			if( tag.isActive )
				dataToSend.tags.push( tag.id )
		})

		// signal that we're sending to WP
		this.setState({
			statusMsg: 'Saving article URL ...',
			statusState: 'working'
		})
		
		const request = wpApi.saveArticle( dataToSend )
		request.then( response => {

			// check for errors
			if( 
				!response.hasOwnProperty('success') ||
				response.success !== true
			) {
				let errorMsg = 'Unknown error occurred'
				if( response.hasOwnProperty('data') )
					errorMsg = response.data

				this.setState({
					statusMsg: 		errorMsg,
					statusState: 	'error'
				})
			} else {
				const newArticle = response.data

				this.setState({
					statusMsg:		'Article added!',
					statusState: 	'success',
					articles: 		[
						{
							id: 		newArticle.ID,
							name: 		newArticle.title,
							url: 		newArticle.url,
							tags:		newArticle.tags,
							dateAdded: 	newArticle.date_added,
							dateRead: 	false,
							isFavorite: false,	
						},
						...this.state.articles
					],

					// reset tag state
					tags: 			this.state.tags.map( tag => {
						tag.isActive = false
						return tag
					})
				})
			}
		})
	}


	handleArticleAction = ( id, action ) => {
		this.setState({
			statusMsg: `Updating article status as ${action} ...`,
			statusState: 'working'
		})

		const request = wpApi.updateArticle( id, action )
		request.then( response => {

			// check for errors
			if( 
				!response.hasOwnProperty('success') ||
				response.success !== true
			) {
				let errorMsg = 'Unknown error occurred'
				if( response.hasOwnProperty('data') )
					errorMsg = response.data

				this.setState({
					statusMsg: 		errorMsg,
					statusState: 	'error'
				})
			} else {
				this.setState({
					statusMsg:		'Article updated!',
					statusState: 	'success',
					totalRead: 		this.state.totalRead + 1,
					articles: 		this.state.articles.map( article => {
						if( article.id === id ) {
							if( action === 'favorited' ) {
								article.isFavorite = true
							} else if( action === 'read' ) {
								article.dateRead = true
							}
						}
						
						return article
					})
				})
			}
		})
	}


	render() {

		return (
			<main className="application">
				<Status
					statusMsg={ this.state.statusMsg }
					statusState={ this.state.statusState }
				/>
				<Form 
					tags={ this.state.tags } 
					newArticle={ this.state.newArticle }
					handleTagChange={ this.handleTagChange }
					handleArticleInput={ this.handleArticleInput }
					handleSubmit={ this.handleSubmit }
				/>
				<Articlelist
					articles={ this.state.articles }
					totalRead={ this.state.totalRead }
					handleArticleAction={ this.handleArticleAction }
				/>
			</main>
		)
	}
}

export default App;

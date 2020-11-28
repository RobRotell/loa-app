import React from 'react';
import PropTypes from 'prop-types';


const Article = props => {

	const articleClasses = [ 'link' ]
	const btnReadClasses = [ 'link__btn', 'link__btn--read' ]
	const btnLikeClasses = [ 'link__btn', 'link__btn--favorite' ]

	if( props.dateRead ) {
		articleClasses.push( 'link--read' )
		btnReadClasses.push( 'link__btn--complete' )
	}

	if( props.isFavorite )
		btnLikeClasses.push( 'link__btn--favorited' )

	const articleTags = []
	if( props.tags.length ) {
		props.tags.forEach( tag => {
			articleTags.push( tag.name )
		})
	}

	return (
		<article className={ articleClasses.join( ' ' )}>
			<a 
				href={ props.url }
				className="link__url" 
				target="_blank" 
				title={ props.name }
				rel="noopener noreferrer"
			>
				{ props.name }
			</a>
			<div className="link__meta">
				<div className="link__tag-container">
					<span className="link__tag__headline">Tags:</span>
					{ articleTags.join( ', ' )}
				</div>

				<div className="link__date">{ props.dateAdded }</div>
				
				<button 
					className={ btnReadClasses.join(' ') }
					onClick={ props.handleRead }
				>
					<i className="icon icon--book"></i>
				</button>
				
				<button 
					className={ btnLikeClasses.join(' ') }
					onClick={ props.handleFavorited }
				>
					<i className="icon icon--like"></i>
				</button>

			</div>
		</article> 
	)

}


Article.propTypes = {
	id: 				PropTypes.number.isRequired,
	name: 				PropTypes.string.isRequired,
	url: 				PropTypes.string.isRequired,
	tags: 				PropTypes.array.isRequired,
	dateAdded: 			PropTypes.string.isRequired,
	handleRead: 		PropTypes.func.isRequired,
	isFavorite: 		PropTypes.bool.isRequired,
	handleFavorited: 	PropTypes.func.isRequired
}


export default Article;
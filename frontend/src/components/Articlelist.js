import React from 'react';
import PropTypes from 'prop-types';

// import custom components
import Article from './Article'



const Articlelist = props => {

	let countToRead = 0
	props.articles.forEach( article => {
		if( !article.dateRead )
			countToRead++
	})

	return (
		<section className="links">
			<div className="summary-container">
				<div className="summary">Articles to Read: 
					<span className="summary__count"> { countToRead }</span>
				</div>
				
				<div className="summary">Articles Read: 
					<span className="summary__count"> { props.totalRead }</span>
				</div>
			</div>
			<div id="links_container" className="links">
				{ props.articles.map( article =>
					<Article
						key={ article.id }
						id={ article.id }
						name={ article.name }
						url={ article.url }
						tags={ article.tags }
						dateAdded={ article.dateAdded }
						dateRead={ article.dateRead }
						isFavorite={ article.isFavorite }
						handleRead={ () => props.handleArticleAction( article.id, 'read' ) }
						handleFavorited={ () => props.handleArticleAction( article.id, 'favorited' ) }
					/>
				)}
			</div>
		</section>	
	)

	// } else {
	// 	return (
	// 		<section className="links">
	// 			<div className="summary-container">
	// 				<div className="summary">Articles to Read: <span id="articles_to_read" className="summary__count"></span></div>
	// 				<div className="summary">Articles Read: <span id="articles_read" className="summary__count"></span></div>
	// 			</div>
	// 		</section>
	// 	)
	// }

	// if( !props.tags.length ) {
	// 	return (
	// 		<div id="tags_container" className="tags-container"></div>
	// 	)
	// } else {
	// 	return (
	// 		<div id="tags_container" className="tags-container">
	// 			{ props.tags
	// 				.map( tag =>
	// 					<Tag 
	// 						key={ tag.id }
	// 						id={ tag.id }
	// 						name={ tag.name }
	// 						isActive={ tag.isActive }
	// 						handleTagChange={ () => props.handleTagChange( tag.id ) }
	// 					/>
	// 				)
	// 			}
	// 		</div>
	// 	)
	// }

}


Articlelist.propTypes = {
	articles: 				PropTypes.array.isRequired,
	handleArticleAction: 	PropTypes.func.isRequired
}


export default Articlelist;
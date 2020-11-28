import React from 'react';
import PropTypes from 'prop-types';

// import custom components
import TagList from './TagList'


const Form = props => {

	return (

		<section className="inputter-form">
			<form 
				className="inputter"
				onSubmit={ props.handleSubmit }
			>
				<input 
					className="inputter__input" 
					type="text" 
					name="link_name" 
					placeholder="https://example.com"
					value={ props.newArticle }
					onChange={ props.handleArticleInput }
					tabIndex="1"
				/>
				<div className="inputter__bottom">
					<TagList 
						tags={ props.tags } 
						handleTagChange={ props.handleTagChange }
					/>
					<button 
						className="inputter__submit"
						tabIndex="2"
						// onClick={ props.handleSubmit }
					>
						<i className="icon icon--plus"></i>
					</button>
				</div>
			</form>
		</section>


	)
}


Form.propTypes = {
	tags: 				PropTypes.array.isRequired,
	newArticle: 		PropTypes.string.isRequired,
	handleTagChange:	PropTypes.func.isRequired,
	handleArticleInput:	PropTypes.func.isRequired,
	handleSubmit: 		PropTypes.func.isRequired
}


export default Form;
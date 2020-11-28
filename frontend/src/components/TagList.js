import React from 'react';
import PropTypes from 'prop-types';

// import custom components
import Tag from './Tag'



const TagList = props => {

	if( !props.tags.length ) {
		return (
			<div id="tags_container" className="tags-container"></div>
		)
	} else {
		return (
			<div id="tags_container" className="tags-container">
				{ props.tags
					.map( tag =>
						<Tag 
							key={ tag.id }
							id={ tag.id }
							name={ tag.name }
							isActive={ tag.isActive }
							handleTagChange={ () => props.handleTagChange( tag.id ) }
						/>
					)
				}
			</div>
		)
	}

}


TagList.propTypes = {
	tags: 				PropTypes.array.isRequired,
	handleTagChange: 	PropTypes.func.isRequired
}


export default TagList;
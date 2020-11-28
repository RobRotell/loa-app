import React from 'react';
import PropTypes from 'prop-types';


const Tag = props => {

	let classes = [ 'tag' ]
	let key 	= `tag_${props.id}`

	if( props.isActive )
		classes.push( 'tag--active' )

	classes = classes.join( ' ' );

	return (
		<label 
			className={ classes } 
			htmlFor={ key }
		>
			{ props.name }
			<input 
				id={ key } 
				className="tag__input" 
				name="link_tag" 
				type="checkbox" 
				value={ props.id }
				onChange={ props.handleTagChange }
			/>
		</label>		
	)

}


Tag.propTypes = {
	id: 				PropTypes.number.isRequired,
	name: 				PropTypes.string.isRequired,
	isActive: 			PropTypes.bool.isRequired,
	handleTagChange: 	PropTypes.func.isRequired
}


export default Tag;
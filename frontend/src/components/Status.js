import React from 'react';
import PropTypes from 'prop-types';


const Status = props => {
	
	let classes = [ 'status' ]

	if( props.statusMsg.length )
		classes.push( 'status--active' )

	if( props.statusState === 'success' ) {
		classes.push( 'status--success' )
	} else if( props.statusState === 'working' ) {
		classes.push( 'status--working' )
	} else {
		classes.push( 'status--error' )
	}

	return (
		<div className={ classes.join(' ') }>
			{ props.statusMsg }
		</div>
	)

}


Status.propTypes = {
	statusMsg: 		PropTypes.string,
	statusState: 	PropTypes.string
}


export default Status;
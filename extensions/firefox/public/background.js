browser.tabs.executeScript(
	{
		file: 'js/app.js'
	}
).then( e => {
	loadLoa()
	// console.log( Loa );
	
	// Loa.load()
	// console.log( e );
	
}).catch( arg => {
	console.log( arg );
	
})
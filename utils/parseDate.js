export default function( datetime ) {
	let ms = Date.parse( datetime );
	if ( isNaN( ms ) && ! ~ datetime.indexOf( "Z" ) ) {
		ms = Date.parse( datetime + "Z" );
	}

	return ms;
}

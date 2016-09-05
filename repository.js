var async = require('async');

module.exports = {
	
	getPlayerByKey: function( dbc, playerKey, finCallback ) {

		if ( playerKey ) {

			if ( !(playerKey instanceof Number) )
				playerKey = parseInt( playerKey );

		} else {
			
			finCallback( "No playerKey specified!", null );
			return;
		}

		dbc.collection('players').findOne( { "hashKey": playerKey }, finCallback );
	},
	
	getFlagById: function( dbc, flagId, finCallback ) {
		
		if ( flagId ) {
			
			if ( !(flagId instanceof Number) )
				flagId = parseInt( flagId );
		
		} else {

			finCallback( "No Flag id specified!", null );
			return;
		}
		
		dbc.collection('flags').findOne( { "_id": flagId }, finCallback );
	}
	
};
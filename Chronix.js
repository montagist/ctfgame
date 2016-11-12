var _ = require('lodash');
var forkie = require('forkie');

var bragi = require('bragi');
bragi.transports.get('Console').property({ showMeta: false });
var logger = { log: _.partial( bragi.log, "CHRONIX" ) };

///////////////////////////////////////////
///	Time keeping process for CTF game
///////////////////////////////////////////

//TODO: Setup polling functionality for server uptime


// Nice to haves?
//	________________________
//	Flags whose points grow over time
//	Dice roll on claiming of certain flags for chance to change game mechanics
//

function Chronix() {
	
	this.registerTaskTimers = function() {
		
		
	}
	
	this.startWorker = function( fincb ) {
		
		fincb( null );
	}
	 
	this.stopWorker = function( fincb ) {
		
		logger.log( "Gracefully shutting down Chronix instance." );
		
		fincb( null );
	}

}

var chronx = new Chronix();
var chronWorker = forkie.worker( "Chronix", { start: _.bind( chronx.startWorker, chronx ),
											  stop: _.bind( chronx.stopWorker, chronx ) } );
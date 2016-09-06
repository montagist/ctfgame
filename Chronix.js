var _ = require('lodash');
var forkie = require('forkie');

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
		
	this.startWorker = function( fincb ) {
		
		fincb( null );
	}
	 
	this.stopWorker = function( fincb ) {
		
		fincb( null );
	}

}

var chronx = new Chronix();
var chronWorker = forkie.worker( "chronix", { start: _.bind( chronx.startWorker, chronx ),
											  stop: _.bind( chronx.stopWorker, chronx ) } );
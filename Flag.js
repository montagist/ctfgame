var _ = require('lodash');
var bragi = require('bragi');
var logger = { log: _.partial( bragi.log, "scorebox" ) };

var uuid = require('node-uuid');


var Player = require('./Player');

var flagSchema = {};

var Flag = function( info ) {
	
	this.id = info._id;
	this.claimedBy = info.claimedBy;
	this.claimedOn = info.claimedOn;
	
	this.alreadyClaimed = function() {
		
		return !!this.claimedBy;
	}
	
	this._setClaimer = function( thePlayer ) {
		
		if ( this.alreadyClaimed() ) {
			
			logger.log( "Flag already claimed!" );
			return false;
		}
		
		this.claimedBy = thePlayer.id;
		this.claimedOn = new Date();
		logger.log( thePlayer.id + " claimed flag " + this.id );
		return true;
	}
};

Flag.prototype._schema = flagSchema;

module.exports = Flag;
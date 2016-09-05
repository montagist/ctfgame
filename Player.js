var _ = require('lodash');
var uuid = require('node-uuid');

var repo = require('./repository');

var playerSchema = { _id: null };

var Player = function( info ) {

	this.id = info._id;
	this.servers = info.servers;
	this.flags = [];
	
	this.ownsServer = function( possibleIP ) {

		var thePlayer = this,
			founDex = _.findIndex( thePlayer.servers,
									function( server ) { return server.ip == possibleIP; } );
		
		return founDex != -1;
	}
	
	this.beaconsFrom = function( clientIP ) {
		
		var thePlayer = this;
		
		// Player gets points for Beaconing from IP
		// owned by different Player
		return !thePlayer.ownsServer( clientIP );
	}
	
	this.claims = function( theFlag ) {
		
		var claimResult = theFlag._setClaimer( this );
		
		if ( claimResult )
			this.flags.push( theFlag );
		
		return claimResult;
	}
};

Player.prototype._schema = playerSchema;

module.exports = Player;
var _ = require('lodash');
var net = require('net');

var bragi = require('bragi');
var logger = { log: _.partial( bragi.log, "GAMEBOX" ) };

// Service or Server

function Serv() {
	
	this.port = "";
	this.ip = "";
	this.protocol = "";
	
	
	this.isAlive = function( fincb ) {
		
		var theServ = this,
		client = new net.Socket();
		
		var sockOpts = { port: theServ.port,
						 host: theServ.ip };
		
		client.on('connect', _.partial( fincb, null, true ) );
		client.on('error', function(  ) {
			
			logger.log( arguments );
			fincb( null, false );	
		} );
		client.connect( sockOpts );
	}
}


module.exports = Serv;
var _ = require('lodash');
var async = require('async');

var bragi = require('bragi');
var logger = { log: _.partial( bragi.log, "scorpix" ) };

bragi.transports.get('Console').property({ showMeta: false });

var forkie = require('forkie');
var hapi = require('hapi');
var joi = require('joi');

var gameConf = require('./config');

////////////////////////////////////////////
// Scoring bot - Flags & Beacons Services
////////////////////////////////////////////
function Scorpix() {
	
	this.nerve = null;
	
	this.setupServer = function( fincb ) {
		
		var scoreBox = this,
			scoreBoxServer = new hapi.Server();
		
		scoreBoxServer.connection( { port: gameConf.port } );;

		var beaconHandlerConf = {
			method: [ 'PUT', 'POST' ],
			path: '/game/beacon',
			handler: _.bind( this.beaconHandler, this ),
			config: {
				validate: { payload: joi.object( { 'playerKey': joi.string().required() } ).options({ allowUnknown: true }) }
			}
		};
		
		var flagHandlerConf = {
			method: 'PUT',
			path: '/game/players/flag',
			handler: _.bind( this.flagHandler, this ),
			config: {
				validate: { payload: joi.object( { 'playerKey': joi.string().required(),
												   'flagId': joi.string().required() } ).options({ allowUnknown: true }) }
			}
		};
		
		scoreBoxServer.route( [ beaconHandlerConf,
								flagHandlerConf ] );
		
		scoreBox.server = scoreBoxServer;
				
		scoreBoxServer.start( function() {
			
			logger.log( bragi.util.print( 'CTF API alive at http://localhost:' + gameConf.port, "yellow" ) + bragi.util.symbols.success );
			fincb( null, {} );
		});

	}
	
	
	///////////////////////////
	// HTTP Request handlers
	//////////////////////////////
	this.flagHandler = function( request, reply ) {

		var scoreBox = this;  reply("ok");
		/*
		var flagResultHandler = function( err, results ) {
						
			var playerDoc = results[0],
				flagDoc = results[1];

			if ( !flagDoc ) {
			
				reply( "Flag not found!" ).code( 404 );
			
			} else if ( !playerDoc ) {
			
				reply( "Player not found!" ).code( 404 );
			
			} else {
			
				var thePlayer = new Player( playerDoc ),
					theFlag = new Flag( flagDoc );
				
				if ( thePlayer.claims( theFlag ) ) {
					
					reply( theFlag ).code( 200 );
					
				} else {
				
					reply("Flag already claimed!").code( 403 );
				}
			}
			
		}

		async.series( [ _.partial( repo.getPlayerByKey, scoreBox.dbClient, request.payload.playerKey ),
						_.partial( repo.getFlagById, scoreBox.dbClient, request.payload.flagId ) ],
					  flagResultHandler );
		*/
	}
	
	this.beaconHandler = function( request, reply ) {

		var scoreBox = this; reply("ok");
		/*
		var beaconResultHandler = function( err, results ) {
						
			var playerDoc = results[0];
			
			if ( !playerDoc ) {
			
				reply( "Player not found!" ).code( 404 );
			
			} else {
			
				var thePlayer = new Player( playerDoc );
				var clientIP = request.info.remoteAddress;
				
				if ( thePlayer.beaconsFrom( clientIP ) ) {
					
					logger.log( "Beacon hit!" );
					reply( { serverIP: clientIP,
							 ownedByPlayer: isOwnServer,
							 validBeacon: isValidBeacon } ).code( 200 );
						 
				} else {
				
					logger.log( "Beacon miss!" );
					reply( "Invalid beacon!" ).code( 403 );
					
				}
			}
		}

		async.series( [ _.partial( repo.getPlayerByKey, scoreBox.dbClient, request.payload.playerKey ) ],
					  beaconResultHandler );
		*/
	}
	
	this.bootstrap = function( fincb ) {
		
		var scoreBox = this;
		var bsHandler = function( err, res ) {
			
			if ( err )
				bragi.log( "error:scorebox", err );
				
			fincb( null );
		}
		
		async.parallel( [ _.bind( this.setupServer, scoreBox ) ],
						bsHandler );
	}

	this.procDown = function( fincb ) {
		
		// Relevant cleanup here? sockets, etc?
		
		logger.log( "Gracefully shutting down Scorpix instance." );
		
		fincb( null );
	}
	
}

var scorp = new Scorpix();
var scorpWorker = forkie.worker( "scorpix", { start: _.bind( scorp.bootstrap, scorp ),
											  stop: _.bind( scorp.procDown, scorp ) } );
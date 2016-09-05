var _ = require('lodash');
var async = require('async');

var bragi = require('bragi');
var logger = { log: _.partial( bragi.log, "scorebox" ) };
var MongoClient = require('mongodb').MongoClient
var hapi = require('hapi');
var joi = require('joi');

var repo = require('./repository');
var Player = require('./Player');
var Flag = require('./Flag');

bragi.transports.get('Console').property({ showMeta: false });

logger.log( bragi.util.print( bragi.util.print( "Scorebox booting up ", "yellow" ) ) + bragi.util.symbols.success );

var gameConf = { port: 3000,
				 db: "ctfgame" };

function Scorebox() {

	// infra
	this.dbClient = null;
	this.server = null;
	
	// domain
	this.hashKey2Player = {};
	
	this.hashPlayerKeys = function() {
		
		// Randomly select hashing algorithm
		// Randomly select # of hashings
	}

	///////////////////////////
	// Bootstrapping services
	//////////////////////////////
	
	this.setupDB = function( finCallback ) {
		
		var scoreBox = this,
			url = 'mongodb://localhost:27017/' + gameConf.db;
		
		MongoClient.connect( url, function( err, db ) {
			
			scoreBox.dbClient = db;
			finCallback.apply( this, arguments );
		});
	}
	
	this.setupServer = function( finCallback ) {
		
		var scoreBox = this,
			scoreBoxServer = new hapi.Server();
		
		scoreBoxServer.connection( { port: gameConf.port } );;
			
		var beaconHandlerConf = {
			method: [ 'PUT', 'POST' ],
			path: '/game/beacon',
			config: {
				handler: _.bind( this.beaconHandler, this ),
				validate: { payload: { playerKey: joi.string().required() } }
			}
		};
		
		var flagHandlerConf = {
			method: 'PUT',
			path: '/game/players/flag',
			config: {
				handler: _.bind( this.flagHandler, this ),
				validate: { payload: { flagId: joi.string().required() } }
			}
		};
		
		scoreBoxServer.route( [ beaconHandlerConf,
								flagHandlerConf ] );
		
		scoreBox.server = scoreBoxServer;
				
		scoreBoxServer.start( function() {
			
			logger.log( bragi.util.print( 'Hapi is listening to http://localhost:3000 ', "yellow" ) + bragi.util.symbols.success );
			finCallback( null, {} );
		});

	}
	
	this.loadGameState = function( finCallback ) {
		
		finCallback( null );
	} 
	
	this.bootstrap = function(){
		
		var scoreBox = this;
		var bsHandler = function( err, res ) {
			
			if ( err )
				bragi.log( "error:scorebox", err ); 
		}
		
		async.parallel( [ _.bind( this.setupDB, scoreBox ),
						  _.bind( this.setupServer, scoreBox ),
						  _.bind( this.loadGameState, scoreBox ) ],
						bsHandler );
	}
	
	///////////////////////////
	// HTTP Request handlers
	//////////////////////////////
	this.flagHandler = function( request, reply ) {

		var scoreBox = this;
		
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
					
					reply( { flagId: theFlag.id,
							 claimedBy: thePlayer.id,
							 claimedOn: theFlag.claimedOn } ).code( 200 );
					
				} else {
				
					reply("Flag already claimed!").code( 403 );
				}
			}
			
		}

		async.series( [ _.partial( repo.getPlayerByKey, scoreBox.dbClient, request.payload.playerKey ),
						_.partial( repo.getFlagById, scoreBox.dbClient, request.payload.flagId ) ],
					  flagResultHandler );
	}
	
	this.beaconHandler = function( request, reply ) {

		var scoreBox = this;
		
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
		
	}
	
}


var sb = new Scorebox();
sb.bootstrap();

module.exports = sb;



var _ = require('lodash');
var async = require('async');

var bragi = require('bragi');
var logger = { log: _.partial( bragi.log, "GAMEBOX" ),
			   ipc: _.partial( bragi.log, "WORKERS" ) };
var forkie = require('forkie');
var MongoClient = require('mongodb').MongoClient
var hapi = require('hapi');
var joi = require('joi');

var repo = require('./repository');
var Player = require('./Player');
var Flag = require('./Flag');

bragi.transports.get('Console').property({ showMeta: false });

logger.log( bragi.util.print( bragi.util.print( "Gamebox booting up ", "yellow" ) ) + bragi.util.symbols.success );

var gameConf = require('./config');

function Gamebox() {

	// infra
	this.dbClient = null;
	this.server = null;
	this.nerve = null;

	// game workers
	this.workers = [ 'Scorpix.js',
					 'Chronix.js' ];
	
	// domain
	this.hashKey2Player = {};
	
	this.logIPC = function( msg ) { logger.ipc( msg.title + " " + msg.status ); }

	///////////////////////////
	// Bootstrapping services
	//////////////////////////////
	
	this.setupDB = function( finCallback ) {
		
		var gamebox = this,
			url = 'mongodb://localhost:27017/' + gameConf.db;
		
		MongoClient.connect( url, function( err, db ) {
			
			gamebox.dbClient = db;
			finCallback.apply( this, arguments );
		});
	}
	

	
	this.loadGameState = function( finCallback ) {
		
		finCallback( null );
	}
	
	this.spinUpWorkers = function( fincb ) {
		
		this.nerve = forkie.master( this.workers );

		this.nerve.on( "worker ready", this.logIPC );
		this.nerve.on( "worker started", this.logIPC );
		this.nerve.on( "worker stopped", this.logIPC );
	}
	
	this.bootstrap = function(){
		
		var gamebox = this;
		var bsHandler = function( err, res ) {
			
			if ( err )
				bragi.log( "error:gamebox", err ); 
		}
		
		async.parallel( [ _.bind( this.setupDB, gamebox ),
						  _.bind( this.loadGameState, gamebox ),
						  _.bind( this.spinUpWorkers, gamebox ) ],
						bsHandler );
	}

	
}


var sb = new Gamebox();
sb.bootstrap();

module.exports = sb;



var _ = require('lodash');
var bragi = require('bragi');
var logger = { log: _.partial( bragi.log, "SCORPIX" ) };
var child_process = require('child_process');
var crypto = require('crypto');




var defaultSSHUser = "vagrant";




function FlagPirate() {
	
	this.plant = function( theFlag, theServ, fincb ) {
	
		if ( !theFlag.placedOn ) {
			
			theFlag.placedOn = new Date();		// Now, in UTC
			
		} else if ( theFlag.placedOn && !theFlag.recurring ) {
			
			fincb( "Flag has already been placed and isn't recurring" );
		
		} else if ( theFlag.recurring ) {
			
			theFlag.placedOn = new Date();		// Now, in UTC
		}
		
		this.hideBooty( theFlag, function( err, res ) {
			
			logger.log( arguments);
		} );
	};
	
	this.spawnShell = function( cmd, flagKey ) {
		
		var procOpts = { detached: true,
						 stdio: 'ignore',
						 env: { FLAG_KEY: flagKey } };
						 
		child_process.spawn( 'sh', ['-c', cmd], procOpts ).unref();
	}
	
	
	this.hideBooty = function( theFlag, theServ, fincb ) {
		
		var fp = this;
		
		var strategyMap = {
		
			filesystem: function( theFlag, theServ, fincb ) {
				
				// http://stackoverflow.com/questions/12041688/specify-private-key-in-ssh-as-string
				
				// ALSO, OSX hosts running this must link gshuf 
				// (from brew coreutils) to just 'shuf', for portability
				
				// In order of increasing "difficulty"
				var goodFileLocs = [ "echo '/bin'",
									 "echo '/tmp'",
									 "echo '/etc'",
									 "echo '/usr/local/bin/'",
									 "find /home -maxdepth 2 -mindepth 1 -type d",
									 "find /media -maxdepth 4 -mindepth 1 -type d",
									 "find /mnt -maxdepth 4 -mindepth 1 -type d", ];
				
				var flagCreateCmd = 'echo "' + theFlag._id + '" >> `'
									+ goodFileLocs[0] + " | shuf -n 1 `/"
									+ theFlag._id;
				
				var remoteShellCmd = 'echo $FLAG_KEY |'
								   + ' ssh -i /dev/stdin ' + defaultSSHUser + '@' + theServ.ip
								   + " '" + flagCreateCmd + "'";
				
				fp.spawnShell( remoteShellCmd, theServ.key );
			},
			
			ram: function( theFlag, theServ, fincb ) {
				
				var flagFifoName = (theFlag._id + "").substr(0, 5) + "flag";
				
				var flagCreateCmd = "echo '" + theFlag._id + "' >> ~/" + theFlag._id + "; "
								  + "mkfifo " + flagFifoName + "; "
								  + "cat ~/" + theFlag._id + " >> " + flagFifoName + "; "
								  + "rm ~/" + theFlag._id;
				
				var remoteShellCmd = 'echo $FLAG_KEY |'
								   + ' ssh -i /dev/stdin ' + defaultSSHUser + '@' + theServ.ip
								   + " '" + flagCreateCmd + "'";
				
				fp.spawnShell( remoteShellCmd, theServ.key );				
				
			}
		};
		
		var chosenStrat = strategyMap[ theFlag.location ];
		
		chosenStrat.apply( arguments );
	}
}







module.exports = FlagPirate;
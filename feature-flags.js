/*! Javascript Feature Flags
    https://github.com/jayf/javascript-feature-flags
    MIT License 2013
*/

var ff = ff || {};
/*
    Setting a global variable, ff, here.

    You can change this! It can be any name,
    but change it again at the bottom to match
    what you have here.
*/

(function(app, options) {
    "use strict";

    // defaults
    app.methods = options && options.methods ||
        [
            'query',
            'hash',
            'cookie',
            'domain'
        ];

    app.keyName = options && options.keyName ||'ff';
    app.testDomain = options && options.testDomain || 'localhost';
    app.testDomainFlag = options && options.testDomainFlag || 'debug';
    app.loc = window.location;

    app.flags = [];

    // returns true if flag is set, false otherwise
    // example: if ( ff.flag('Shuggie') ) { console.log('Otis!'); }
    app.flag = function( f ) {
        return false || app.flags.indexOf( f ) > -1;
    };

    // all methods for setting flags
    app.setFlags = {

        // flags stored in browser cookie named app.keyName
        // cookie can be single value, or CSV, like: Brubeck,Coltrane,Monk
        cookie: function() {
            var neq = app.keyName + '=',
                neql = neq.length,
                value = null,
                ca = document.cookie.split(';'),
                cal = ca.length,
                i;

            for( i=0; i < cal; i++ ) {

                var c = ca[i],
                    cl = c.length;

                while ( c.charAt(0) === ' ' ) {
                    c = c.substring( 1, cl );
                }

                if ( c.indexOf(neq) === 0 ) {
                    value = c.substring( neql, cl );
                }
            }

            if ( value ) {
                this._addFlag( value.split(',') );
            }
        },

        // flag for page on a test domain
        domain: function() {
            if ( app.loc.hostname === app.testDomain ) {
                this._addFlag(app.testDomainFlag);
            }
        },

        // flag in URL fragment that starts with app.keyName
        // fragment format is CSV after app.keyName: ff,Colins,Clinton,Hazel
        hash: function() {
            var h = app.loc.hash,
                ki = h.indexOf( app.keyName );

            if ( ki > -1 ) {
                var s = h.substring( ki + app.keyName.length + 1 );
                this._addFlag( s.split(',') );
            }
        },

        // flag in URL query string, app.keyName is parameter
        // both ?ff=Elvin&ff=Ringo and ?ff=Jones,Starr work
        query: function() {
            var s = app.loc.search,
                a = s.substring(1).split('&'),
                al = a.length,
                i;

            for ( i=0; i < al; i++ ) {
                var p = a[i].split('=');

                if ( p[0] === app.keyName && p[1] ) {
                    this._addFlag( p[1].split(',') );
                }
            }
        },

        // private, adds each new flag to app.flags array
        _addFlag: function(f) {
            if ( typeof(f) === 'string' ) {
                app.flags.push(f);
            } else {
                var i;
                for ( i in f ) {
                    app.flags.push( f[i] );
                }
            }
        }
    };

    // call each desired method in app.setFlags
    var m;
    for ( m in app.methods ) {
        app.setFlags[app.methods[m]]();
    }

})( ff );
/*
    If you change the ff variable name at top,
    change it in the line above.

    You also could attach this to an existing global,
    just pass the function YO.ff

    You can override any of the following:

    (ff, {
    keyName: 'ff',
    testDomain: 'localhost',
    testDomainFlag: 'debug',
    methods: ['cookie', 'domain', 'hash', 'query'] })

*/

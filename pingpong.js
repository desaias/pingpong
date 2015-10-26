#!/usr/bin/env node
var parseArgs = require('minimist');
var fs = require('fs');
var _ = require('lodash');
var moment = require('moment');
var opts = require('minimist')(process.argv.slice(2), {
    alias: {
        score: 's',
        winner: 'w',
        loser: 'l'
    }
});

if (_.isEmpty(opts.score) || _.isEmpty(opts.winner) || _.isEmpty(opts.loser)) {
    console.log('You must enter the score, winner and loser.  --score (-s) {10-8} --winner (-w) {name} --loser (-l) {name}');
} else {
    // Save Game
    fs.readFile('./pingpong/games', 'utf8', function(err, data) {
        if (err) console.log(err);
        var games = JSON.parse(data);
        var game = {
            date: moment().format('YYYY-MM-DD hh:mm:ss'),
            winner: opts.winner,
            loser: opts.loser,
            score: opts.score
        };
        games.push(game);
        fs.writeFile('./pingpong/games', JSON.stringify(games), function(err) {
            if (err) {
                console.log(err);
            }
            console.log('The game was saved!');
        });
    });

    // Update Players
    fs.readFile('./pingpong/players', 'utf8', function(err, data) {
        if (err) console.log(err);
        var players = JSON.parse(data);
        // Winner
        var existingWinner = _.find(players, _.matchesProperty('name', toTitleCase(opts.winner)));
        if (existingWinner) {
            existingWinner.wins += 1;
        } else {
            var newWinner = {
                name: toTitleCase(opts.winner),
                wins: 1,
                losses: 0
            };
            players.push(newWinner);
        }

        // Loser
        var existingLoser = _.find(players, _.matchesProperty('name', toTitleCase(opts.loser)));
        if (existingLoser) {
            existingLoser.losses += 1;
        } else {
            var newLoser = {
                name: toTitleCase(opts.loser),
                wins: 0,
                losses: 1
            };
            players.push(newLoser);
        }

        fs.writeFile('./pingpong/players', JSON.stringify(players), function(err) {
            if (err) {
                console.log(err);
            }
            console.log('The players stats were saved!');
        });
    });
}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

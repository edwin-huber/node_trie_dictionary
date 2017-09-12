// #########################################################
// The following sample code uses a trie as the basis of a dictionary of place names
// the goal being to escape these words before submitting them to a translation service
// to then be used with some form of NLP like https://LUIS.ai
// The dictionary is loaded from a static file "dict.txt", but this could just as easily
// be provided as a module containing the ready made array of dictionary entries.
// the logic used in the dictionary check is based on the compound place names found
// in Germany, but can be readily modified to be used with other cultures
// the addition of a cultural modifier would be a simple change to allow a different
// logical processing of the input text.
// the goal was to quickly process short utterances, not long texts, and as such this is
// not optimized for escaping extremely long texts.
// The tradenames Rossmanns and Kaufland remain the property of their respective owners
// and are only used to show how a proper name can be used within the dictionary as an
// additional "non-translatable" word.
// #########################################################

const trie = require('resig-trie');

// read in the whitelist here
var wordList = require("fs").readFileSync("dict.txt", "utf8"); // , (err, data) => {
// split the dictionary based on your delimeters (here I use CRLF)
var dictWords = wordList.toLowerCase().match(/[^\r\n]+/g);

// create the trie / dictionary
var dict = trie.create(dictWords);

// encapsualtes logic to find german towns and breakers in the trie
// needs proper recursive logic
function findKnownWords(data) {
    let dataContent = data.toLowerCase().match(/\w+[äöü]*\w*/g);// regex matching based on German alphabet
    let result = "";
    let compound = false;
    for (i = 0; i < dataContent.length; i++) {
        // defining srch as avoids several calls to lowercase
        let srch = dataContent[i];

        if (srch === 'in' || srch === 'an' || srch === 'am') {
            i++;
            srch = srch + ' ' + dataContent[i].toLowerCase();
            compound = true;
            if (srch === 'an der') {
                i++;
                srch = srch + ' ' + dataContent[i].toLowerCase();
            }
        }

        if (trie.find(srch, dict)) {
            result = result + escapeWord(srch);
        }
        else {
            if (compound) {
                i--;
                result = result + dataContent[i].toLowerCase();
            }
            else {
                result = result + srch;
            }
        }
        compound = false;

        result = result + " ";
    }
    return result.trim(); // rather remove the last whitespace than check each iteration of the loop, would need perf validation but I think this is cheapest
}


// replace this with an appropriate method that you want to use, or roll up into the findKnownWords function
function escapeWord(text) {
    return '<div class="notranslate">' + text + '</div>';
}

// test the dictionary
var lookFor = "Weinsberg"

// Rossmanns is not added to the dictionary
let escapeThis = "wo ist das nächste Rossmanns in " + lookFor + "?";
console.log('Escaping this \"%s\"', escapeThis);
console.log(findKnownWords(escapeThis));

console.log('####')

lookFor = "Amberg an der Altmühl";

escapeThis = "wo ist die nächste Kaufland in " + lookFor + "? Da wollten wir unbedingt hin gehen!";
console.log('Escaping this \"%s\"', escapeThis);
console.log(findKnownWords(escapeThis));

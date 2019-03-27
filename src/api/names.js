const fs = require('fs');
const path = require('path');

const names = fs.readFileSync(path.resolve(__dirname, '../data/names.txt'))
    .toString()
    .split('\n');

const replacers = [
    [/A/, 'Aa,Ba,Da,Ga,Pa'],
    [/Br/, 'B,Dr,Gr'],
    [/Chr/, 'Br,D,Dr,Jr,Pr'],
    [/D/, 'B,Dr'],
    [/E/, 'Be,De,Ge,O'],
    [/J/, 'B,Br,Ch,D,Dr,G,Ge,Gr'],
    [/K/, 'G'],
    [/L/, 'Bl,Gl'],
    [/M/, 'B,K,N,R'],
    [/N/, 'Gn,Kn,M,Ny'],
    [/P/, 'P,Pb'],
    [/R/, 'Br,Dr,Gr'],
    [/S([aeiou])/, 'G,Sl', '_$1'],
    [/S([^h])/, 'Sh,Sch', '_$1'],
    [/Sh/, 'Ch,J,Sch,Th'],
    [/T/, 'D'],
    [/T([^h])/, 'Th', '_$1'],
    [/ck?$/, 'cc'],
    [/([^aeiou])i([^aeiou])/, 'a,o', '$1_$2'],
    [/([^aeiou])o([^aeiou])/, 'oa,oh', '$1_$2'],
    [/([aeiou])r([aeiou])/, 'rn', '$1_$2'],
    [/son$/, 'some'],
];

function randFrom(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    return arr[idx];
}

const badTests = [
    /slash/,
    /gay/,
    /gai$/,
]
function bad(capsName) {
    const name = capsName.toLocaleLowerCase();
    return badTests.some(t => name.match(t)); 
}

module.exports = function getName() {
    while (1) {
        const name = randFrom(names);
        for (let i = 0; i < 100; ++i) {
            const [goodLetter, replacements, regexPattern] = randFrom(replacers);
            const replacement = randFrom(replacements.split(','));
            const fullReplacement = (regexPattern || '_').replace('_', replacement)
            const weirdName = name.replace(goodLetter, fullReplacement);
            if (weirdName !== name && !bad(weirdName)) return weirdName;
        }
    }
}

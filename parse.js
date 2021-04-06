const fs = require('fs');
const { isNumber } = require('util');
const data = fs.readFileSync('./raw/codegeo_2013.txt').toString();

const allLines = data.split('\n');


const count = {
    governorates: 24,
    delegations: 264,
    sectors: 2038, // 2083 on the pdf, probably a typo
    communes: 264,
    arrondissements: 141,
}


function parseGovernorates() {
    const lines = allLines.slice(460, 484);
    return lines.map(line => {
        const index = line.split('').findIndex(it => '0123456789'.split('').indexOf(it) !== -1);
        const nameAr = line.slice(0, index).trim();
        const code = parseInt(line.slice(index, index + 2).trim());
        const name = line.slice(index + 2).trim().split(' ').reverse().join(' ');
        return { code, name, nameAr };
    });
}


function parseDelegations() {
    const lines = allLines.slice(490, 823);
    return lines.map(line => {
        const index = line.split('').findIndex(it => '0123456789'.split('').indexOf(it) !== -1);
        const nameAr = line.slice(0, index).trim();
        const code = parseInt(line.slice(index, index + 5).trim().split(' ').reverse().join(''));
        const name = line.slice(index + 5).trim().split(' ').reverse().join(' ');
        return { code, name, nameAr };
    }).filter(it => it.code > 999);
}

function parseSectors() {
    const lines = allLines.slice(829, 3632);
    return lines.map(line => {
        const index = line.split('').findIndex(it => '0123456789'.split('').indexOf(it) !== -1);
        const nameAr = line.slice(0, index).trim();
        const code = parseInt(line.slice(index, index + 8).trim().split(' ').reverse().join(''));
        const name = line.slice(index + 8).trim().replace('-', ' ').split(' ').reverse().join(' ');
        return { code, name, nameAr };
    }).filter(it => it.code > 999);
}

const isInt = it => '0123456789'.split('').indexOf(it) !== -1;

function parseCommunes() {
    const lines = allLines.slice(3640, 4300);
    return lines.filter(it => it.split('').filter(isInt).length == 4).map(line => {
        const index = line.split('').findIndex(it => '0123456789'.split('').indexOf(it) !== -1);
        const nameAr = line.slice(0, index).trim();
        const code = parseInt(line.slice(index, index + 5).trim().split(' ').reverse().join(''));
        const name = line.slice(index + 5).trim().replace('-', ' ').split(' ').reverse().join(' ');
        return { code, name, nameAr };
    }).filter(it => it.code < 10000 && it.code > 999);
}

function parseArrodissements() {
    const lines = allLines.slice(3640, 4300);
    return lines.filter(it => it.split('').filter(isInt).length == 6).map(line => {
        const index = line.split('').findIndex(it => '0123456789'.split('').indexOf(it) !== -1);
        const nameAr = line.slice(0, index).trim();
        const code = parseInt(line.slice(index, index + 8).trim().replace(/\./g, ' ').split(' ').reverse().join(''));
        const name = line.slice(index + 8).trim().replace('-', ' ').split(' ').reverse().join(' ');
        return { code, name, nameAr };
    }).filter(it => it.code < 1000000 && it.code > 99999);
}


const governorates = parseGovernorates();
if (governorates.length !== count.governorates) {
    console.warn('governorates count check failed', governorates.length, count.governorates);
}
fs.writeFileSync('./data/governorates.json', JSON.stringify(governorates, null, ' '));

const delegations = parseDelegations();
if (delegations.length !== count.delegations) {
    console.warn('delegations count check failed', delegations.length, count.delegations);
}
fs.writeFileSync('./data/delegations.json', JSON.stringify(delegations, null, ' '));

const sectors = parseSectors();
if (sectors.length !== count.sectors) {
    console.warn('sectors count check failed ' + sectors.length + ' but should be ' + count.sectors);
}
fs.writeFileSync('./data/sectors.json', JSON.stringify(sectors, null, ' '));

const communes = parseCommunes();
if (communes.length !== count.communes) {
    console.warn('communes count check failed ' + communes.length + ' but should be ' + count.communes);
}
fs.writeFileSync('./data/sectors.json', JSON.stringify(sectors, null, ' '));

const arrondissements = parseArrodissements();
if (arrondissements.length !== count.arrondissements) {
    console.warn('arrondissements count check failed ' + arrondissements.length + ' but should be ' + count.arrondissements);
}
fs.writeFileSync('./data/arrondissements.json', JSON.stringify(arrondissements, null, ' '));

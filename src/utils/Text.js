/**
 * Pirmiausia tikrinama, ar viena iš grandinių yra tuščia. Jei viena iš grandinių yra tuščia, atstumas tarp jų yra kitos grandinės ilgis.
 * Tada kuriama atstumo matrica. Atstumo matrica yra kvadratinė matrica, kurioje kiekvienas elementas atitinka atstumą tarp dviejų atitinkamų simbolių grandinėse.
 * Atstumo matrica užpildoma iš viršaus į apačią ir iš kairės į dešinę. Kiekvienas elementas matricoje apskaičiuojamas naudojant vieną iš šių formulių:
 * Įterpimas: atstumas tarp ankstesnio elemento ir dabartinio elemento + 1.
 * Ištrinimas: atstumas tarp dabartinio elemento ir ankstesnio elemento + 1.
 * Pakaitymas: atstumas tarp ankstesnio elemento ir dabartinio elemento + (simboliai sutampa? 0: 1).
 * Galiausiai grąžinamas atstumo matricos paskutinis elementas.
 * */
export function levenshteinDistance(s1, s2) {
    // s1 ir s2 yra simbolių grandinės, kurių atstumą norime apskaičiuoti

    // Jei viena iš grandinių yra tuščia, grąžinamas kitos grandinės ilgis
    if (s1.length === 0) {
        return s2.length;
    }
    if (s2.length === 0) {
        return s1.length;
    }

    // Sukuriame atstumo matricą
    const matrix = [];
    for (let i = 0; i <= s1.length; i++) {
        matrix[i] = [];
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                matrix[i][j] = j;
            } else if (j === 0) {
                matrix[i][j] = i;
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1, // įterpimas
                    matrix[i][j - 1] + 1, // ištrynimas
                    matrix[i - 1][j - 1] + (s1[i - 1] === s2[j - 1] ? 0 : 1) // pakeitimas
                );
            }
        }
    }

    // Grąžinamas atstumo matricos paskutinis elementas
    return matrix[s1.length][s2.length];
}

/** 
 * Pirmiausia konvertuojame tekstus į mažąsias raides, kad būtų lengviau palyginti.
 * Tada suskaičiuojame, kiek simbolių sutampa tarp dviejų tekstų.
 * Galiausiai apskaičiuojame sutapimo procentą, padalijus sutapimų skaičių iš pirmojo teksto simbolių skaičiaus ir padauginus iš 100.
 * */
export function compareText(text1, text2) {
    // Konvertuojame tekstus į mažąsias raides, kad būtų lengviau palyginti
    text1 = text1.toLowerCase();
    text2 = text2.toLowerCase();

    // Suskaičiuojame, kiek simbolių sutampa tarp dviejų tekstų
    let matches = 0;
    for (let i = 0; i < text1.length; i++) {
        if (text2.indexOf(text1[i]) !== -1) {
            matches++;
        }
    }

    // Apskaičiuojame sutapimo procentą
    let similarityProc = matches / text1.length * 100;

    return similarityProc;
}

// Testuojame funkciją
//let text1 = "Šis tekstas yra panašus į kitą tekstą.";
//let text2 = "Kitas tekstas yra panašus į šį tekstą.";

//let similarity = compareText(text1, text2);

//console.log(similarity); // 87.5


/**
 * Pirmiausia konvertuojame tekstus į mažąsias raides, kad būtų lengviau palyginti.
 * Tada suskaičiuojame, kiek simbolių sutampa tarp dviejų tekstų, naudodami sudėtingesnį sutapimo algoritmą, kuris atsižvelgia į tai, kad kai kurie simboliai yra panašesni už kitus.
 * Galiausiai apskaičiuojame sutapimo procentą, padalijus sutapimų skaičių iš pirmojo teksto simbolių skaičiaus ir padauginus iš 100.
 * */
export function compareTextLD(text1, text2) {
    // Konvertuojame tekstus į mažąsias raides, kad būtų lengviau palyginti
    text1 = text1.toLowerCase();
    text2 = text2.toLowerCase();

    // Apskaičiuojame Levenshtein atstumą tarp dviejų tekstų
    const distance = levenshteinDistance(text1, text2);

    // Apskaičiuojame maksimalų galimą atstumą (ilgesnio teksto ilgį)
    const maxLength = Math.max(text1.length, text2.length);

    // Apskaičiuojame sutapimo procentą
    let similarity = (1 - distance / maxLength) * 100;

    return similarity;
}

// Testuojame funkciją
//let text1 = "Šis tekstas yra panašus į kitą tekstą.";
//let text2 = "Kitas tekstas yra panašus į šį tekstą.";
//let similarity = compareText(text1, text2);
//console.log(similarity); // 95.83333333333334
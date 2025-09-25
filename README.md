Funkciniai reikalavimai:

Visiems prisijungusiems:
Visa sistema pasiekiama tik prisijungus.
Peržiūrėti įrangos sąrašą ir konkretaus įrašo informaciją.

Administratorius:
Kurti naują įrangą, atnaujinti jos informaciją.
Keisti įrangos būseną („paskelbta“, „juodraštis“).
Peržiūrėti visas rezervacijas ir jų detales.
Keisti rezervacijų būsenas („patvirtinta“, „atmesta“, „vykdoma“, „laukianti“).

Paprastas vartotojas:
Peržiūrėti savo rezervacijas.
Sukurti rezervaciją, atnaujinti (pvz., pakeisti datą), atšaukti.

Rezervavimo logika:
Įrangos rezervuoti į praeitį negalima.
Įrangos negalima rezervuoti du kartus tuo pačiu laiku.

Nefunkciniai reikalavimai:

Technologijos: React + Node.js/Express + MongoDB. Visos šios dalys sujungtos tarpusavyje
Autentifikacija: sistema reikalauja prisijungimo.
Dizaino prisitaikymas: responsyvus UI.
Testai: Funkcionalumas ištestuotas Unit testais.
Diegimas ir dokumentacija: kodas GitHub’e, projekto talpinimas (Vercel), README su paleidimo instrukcijomis ir patalpinto projekto nuoroda.

User story:

Vartotojas:

Kaip vartotojas noriu susikurti paskyrą, kad galėčiau naudotis sistema.
Kaip vartotojas noriu prisijungti/atsijungti, kad mano duomenys būtų saugūs.
Kaip vartotojas noriu matyti įrangos sąrašą, kad galėčiau išsirinkti, ką rezervuoti.
Kaip vartotojas noriu filtruoti ir ieškoti įrangos, kad greičiau rasčiau reikiamą.
Kaip vartotojas noriu peržiūrėti įrangos informaciją, kad suprasčiau jos paskirtį ir būseną.
Kaip vartotojas noriu matyti įrangos užimtumą, kad pasirinkčiau laisvą laiką.
Kaip vartotojas noriu užsirezervuoti įrangą, kad galėčiau ją naudoti.
Kaip vartotojas noriu gauti aiškų klaidos pranešimą, jei pasirinktas laikas jau užimtas, kad galėčiau parinkti kitą laiką.
Kaip vartotojas noriu matyti savo rezervacijų sąrašą ir būsenas, kad sekčiau progresą.
Kaip vartotojas noriu pakeisti rezervacijos laiką iki jos pradžios, kad prisitaikyčiau prie plano.
Kaip vartotojas noriu atšaukti rezervaciją, jei jos nebereikia.

Administratorius:

Kaip administratorius noriu pridėti naują įrangą, kad vartotojai galėtų ją rezervuoti.
Kaip administratorius noriu redaguoti įrangos informaciją, kad ji būtų tiksli.
Kaip administratorius noriu keisti įrangos publikavimo būseną (paskelbta/juodraštis), kad valdyčiau matomumą.
Kaip administratorius noriu matyti visas rezervacijas, kad galėčiau jas administruoti.
Kaip administratorius noriu peržiūrėti rezervacijos detales, kad priimčiau sprendimą.
Kaip administratorius noriu patvirtinti arba atmesti rezervaciją, kad valdytųsi užimtumas.
Kaip administratorius noriu keisti rezervacijos būseną (patvirtinta, atmesta, vykdoma, laukiama), kad atspindėčiau vykdymą.

Kaip paleisti projektą lokaliai:
Atsidarius failus naudojant terminalą rašome cd egzaminas/backend, tada npm install ir galiausiai npm start. Taip pasileidžiame serverį su duomenų baze.
Tada kitame terminale rašome cd egzaminas/frontend, tada npm install ir npm run dev. Tada atveriame http://localhost:5173 savo naršyklėje ir taip projektas gali būti paleistas bei naudojamas.

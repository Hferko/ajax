'use strict';

$(document).ready(function () {
    $("#p1").hide();
    $("#postok").hide();

    /* Legyen kezdő a 4. feladat, mert fontos
    4. Feladat: A request függvényt segítségül hívva, azaz AJAX segítségével töltsétek be az órán is betöltött https://jsonplaceholder.typicode.com/users
    adathalmazt. Majd a user betöltődése után töltsétek be a https://jsonplaceholder.typicode.com/posts erőforrást is.
    
    Majd, ha a postok is betöltődtek, hozzatok létre egy select input mezőt a userek neveivel. és egy postok gombot.
    A postok gombra klikkelve, töltéstek be csak azon postokat, amelyeket a kiválasztott user írt.
*/

    function request(url, success) {
        let igeret = new Promise(function (resolve, reject) {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(this.responseText);

                } else if (this.status >= 300) {
                    reject({ status: this.status, message: "Nem jött le a kért adat!" });
                }
            }
            xhttp.open("GET", url);
            xhttp.send();
        });

        return igeret;
    }

    $('#betolt').click(function () {

        request("https://jsonplaceholder.typicode.com/users")
            .then(function (res) {

                const valaszt = $('<select/>');
                $(valaszt).attr('id', 'selector');
                $('#content').append(valaszt);
                valaszt.append($('<option/>').html("VÁLASSZON INFLUENCERT"));

                let users = JSON.parse(res);

                users.forEach(elem => {
                    //console.log(elem["id"] + " - " + elem["name"]);

                    let $opcio = $("<option/>", {
                        value: elem["id"],
                        text: elem["name"]
                    });
                    valaszt.append($opcio);
                });
                $('#postok').append($('<p/>').html("Elég, ha csak kattint egy névre"));

                return request("https://jsonplaceholder.typicode.com/posts");

            })
            .then(function (res) {
                let posts = JSON.parse(res);

                $('#selector').change(function () {

                    $("#postok").empty();
                    const szerzo = $(this).find("option:selected").text();
                    console.log(szerzo);

                    if ($(this).val()) {

                        let ID = $(this).val();
                        console.log(ID);
                        $("#postok").append($('<h4/>').html(`A következő írások szerzője: ${szerzo}`));

                        posts.forEach(elem => {

                            if (ID == elem["userId"]) {
                                //console.log(elem["userId"] + " - Cím: " +elem["title"]+" - A lényeg: " +elem["body"]);                     

                                const cikk = $('<div/>');
                                $(cikk).attr('class', 'cikk');
                                $("#postok").append($(cikk).html(`Az írás címe:<b style="color:teal"> ${elem["title"]}</b>`));

                                cikk.append($('<p/>').html(`<b>A cikk:</b><br>${elem["body"]}`));
                            }
                        });

                    }
                    $("#postok").slideDown("slow");
                });

                $("#postok").click(function () {
                    $(this).slideUp("slow");
                });
            });

        $(this).attr("disabled", "disabled");

        /* Az eredeti XHTTP-request felállás számomra egyszerűbb, átláthatóbb és még működött is, ezért nem értettem a Promise bonyolítást:
            
                    request("https://jsonplaceholder.typicode.com/users", function (res) {
            
                        let users = JSON.parse(res);           
                        console.log(users);
            
                    });
            
                    request("https://jsonplaceholder.typicode.com/posts", function (valasz) {
            
                        let posts = JSON.parse(valasz);
                        console.log(posts);
            
                    });*/
    });

    //---------------------------------------------
    /*
    1. feladat: Terjesszétek ki a JavaScript Sting osztályát egy deaccentationHU metódussal (String.prototype.deaccentationHU) azaz ékezetmentesítő
    funkcióval. Ami eltávoltja a magyar ékezeteket a szövegből. Tehát átalakítja a szöveget. 
    */
    $("#gomb").click(function () {

        let s = $("#sztring").val();
        console.log(s);

        String.prototype.deaccentationHU = function () { // nem tudtam egyszerűbben kiszedni az ékezetes betűket

            let magyar = ["é", "á", "ő", "ú", "ű", "ö", "ü", "ó", "í", "É", "Á", "Ő", "Ú", "Ű", "Ö", "Ü", "Ó", "Í"];
            let angol = ["e", "a", "o", "u", "u", "o", "u", "o", "i", "E", "A", "O", "U", "U", "O", "U", "O", "I"];
            let uj = this;

            for (let i in magyar)
                uj = uj.replaceAll(magyar[i], angol[i]);

            return uj;
        }
        console.log(s.deaccentationHU());

        $("#p1").text(s.deaccentationHU()).show(900);
    });

    /* ------------------------------
    2. Feladat: jQuery segítségével valósítsunk meg egy Accordion szerkezetet. Adott hozzá az accordion.html
    Ebben a feladatban oldjuk meg azt, hogy az accordion elemei közül, egyszerre csak egy legyen nyitva. Ahogy azt default állapotban, azaz, ha
    üresen betöltitek a HTML oldalt van, alapból. És az egyes elemek fejlécében mindig az a szöveg legyen olvasható, ami történik, ha rákattintunk.
    TEhát, ha össze van csukva, akkor a "Lenyit", míg, ha le van nyitva, akkor az "Összecsuk" felirat legyen olvasható.
​
    Megjegyzés: Az összecsukáshoz, és a lenyitáshoz, használjátok a jQuery .slideUp(), .slideDown() és/vagy a slideToggle() metódusokat.
    Az előző elem jQueryben a .prev(), míg a következő elemet a .next() metódus adja vissza. Amire még szükségetek lehet az a .attr(kulcs, ertek), ami 
    a nativ Javascriptből a HTMLElement.set/getAttribte() függvényeknek felelnek meg.​
    */

    $('.lenyilo-ct').click(function () {

        let lenyit = $(this).children(".lenyit");
        let lenyilo = $(this).children(".lenyilo");
        let valaszt = lenyit.text();

        if (valaszt == "Osszecsuk") {
            lenyilo.slideUp("slow");
            lenyit.text("Lenyit");

        }
        else {

            $(".lenyilo").each(function () {
                $(this).slideUp("slow");
            });

            $(".lenyit").each(function () {
                $(this).text("Lenyit");
            });

            lenyilo.slideDown("slow");
            lenyit.text("Osszecsuk");
        }
    });

    //------------------------------------------------------
    /*
    3. feladat: Egy tab rendszer jqueryben.
    */
    $('.tab').click(function (e) {

        $(".tab").each(function () {
            $(this).removeClass("tab-active");
        });
        const tabulator = $(this).attr('href');
        $(this).addClass("tab-active");

        $('.tartalom').addClass('hidden');
        $('.tartalom').removeClass('active');
        $(tabulator).removeClass('hidden');
        $(tabulator).addClass('active');

    })
});
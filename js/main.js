document.getElementById("obrni").onclick = obrni;
function obrni(e) {
    var mail = document.getElementById("address").value;
    if (validateMail(document.getElementById("address"))) {
        var indexAt = mail.indexOf('@');
        var obrnuti = mail.slice(0, indexAt);
        var nizMaila = obrnuti.split("");
        var obrnutNizMail = nizMaila.reverse();
        var obrnutMail = obrnutNizMail.join("");
        obrnutMail += mail.slice(indexAt);
        mail = obrnutMail;
        document.getElementById("address2").value = obrnutMail;

    }
    e.preventDefault();
}
document.getElementById("name").onblur = validateName;
document.getElementById("address").onblur = validateMail;
function validateName(e) {
    var ime = e.target;
    if (ime == null)
        ime = e;
    if (ime.value.length < 5 || !(/[A-Z]/.test(ime.value.charAt(0)))) {
        ime.classList.add("error");
        document.getElementById("err").innerHTML = "Pogresno Ime";
        return false;
    }
    else {
        ime.classList.remove("error");
        document.getElementById("err2").innerHTML = "";
        return true;
    }
}
function validateMail(e) {
    var mail = e.target;
    if (mail == null)
        mail = e;
    var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var greska = document.createElement("SPAN");
    var tekstGreske = document.createTextNode("Greska u mailu");
    greska.appendChild(tekstGreske);
    if (!regex.test(mail.value)) {
        mail.classList.add("error");
        document.getElementById("err2").innerHTML = "Pogresan mail";
        return false;
    }
    else {
        mail.classList.remove("error");
        document.getElementById("err2").innerHTML = "";
        return true;
    }
}

document.getElementById("submit").onclick = spremi;
function spremi(e) {
    var ime = document.getElementById("name").value;
    var mail = document.getElementById("address").value;
    var ukupno = izracunajUkupno();

    var toStore = {
        name: ime,
        email: mail,
        ukupna: ukupno
    }
    if (validateName(document.getElementById("name")) && validateMail(document.getElementById("address"))) {
        if (localStorage.getItem('niz') === null) {
            var niz = [];
            niz.push(toStore);
            localStorage.setItem('niz', JSON.stringify(niz));
        }
        else {
            var valid = true;
            var getStorage = JSON.parse(localStorage.getItem('niz'));
            for (var i = 0; i < getStorage.length; i++) {
                if (getStorage[i].name === toStore.name && getStorage[i].email === toStore.email)
                    valid = false;
            }
            if (valid) {
                getStorage.push(toStore);
                localStorage.setItem('niz', JSON.stringify(getStorage));
            }
            else {
                var odgovor = confirm("Unos vec postoji,zelite li ga ponoviti?");
                if (odgovor) {
                    getStorage.push(toStore);
                    localStorage.setItem('niz', JSON.stringify(getStorage));
                }
                else {
                    alert("Unos nije spremljen!");
                }
            }
        }
    }
    else
        alert("Nije spremljeno! Pogresan unos!");
    document.getElementById("ukupno").style.display = "none";
    clear();
    e.preventDefault();

}
function clear() {
    var inputi = document.getElementsByTagName("input");
    for (var i = 0; i < inputi.length; i++) {
        if (inputi[i].type != "submit") {
            inputi[i].value = "";
        }
    }
    var form = document.forms["cakeform"];
    var vrijednost = form.elements["selectedcake"];
    for (var i = 0; i < vrijednost.length; i++) {
        if (vrijednost[i].checked) {
            vrijednost[i].checked = false;
        }
    }
    document.getElementById("ukljucujesvijece").checked = false;
    document.getElementById("ukljucujenatpis").checked = false;
    document.getElementById("address").classList.remove("error");
    document.getElementById("name").classList.remove("error");
    document.getElementById("err").innerHTML = "";    
    document.getElementById("err2").innerHTML = "";

}
document.getElementById("ucitaj").onclick = ucitajPodatke;
function ucitajPodatke(e) {
    var getStorage = JSON.parse(localStorage.getItem('niz'));
    var b = getStorage.length;

    var ime = document.getElementById("i1");
    var mail = document.getElementById("e1");
    var ukupno = document.getElementById("u1");


    ime.textContent = "Ime i prezime";
    mail.textContent = "Email adresa";
    ukupno.textContent = "Ukpna cijena torte"
    //TODO : pokusati regexom::popraviti predstojeci
    /* var regIme='/'+(getStorage[b-1].name)+'/';
    var s=ime.textContent;
    if(regIme.test(s)  || '/'+getStorage[b-1].email+'/'.test(mail.textContent))
    {
        ime.textContent-=":"+getStorage[b-1].name;
        mail.textContent-=":"+getStorage[b-1].email;
    } */

    ime.textContent += ":" + getStorage[b - 1].name;
    mail.textContent += ":" + getStorage[b - 1].email;
    ukupno.textContent += ":" + getStorage[b - 1].ukupna;

    //TODO: pokusati na drugi nacin ispisivati gresku::dinamickim dodavanjem texta
    /*  var ime=document.createElement("SPAN");
     var tekstImena=document.createTextNode(getStorage[b-1].name);
     ime.appendChild(tekstImena);
 
     var parent=document.getElementById("i2");
     var br=document.getElementById("e1");
     parent.insertBefore(ime,br); */
    /* 
    document.getElementById("i1").value=getStorage[b-1].name;
     */
    e.preventDefault();
}


function cijenaVelicine() {
    var nizCijena = { "Round6": 20, "Round8": 25, "Round10": 35, "Round12": 75 };
    var form = document.forms["cakeform"];
    var vrijednost = form.elements["selectedcake"];
    for (var i = 0; i < vrijednost.length; i++) {
        if (vrijednost[i].checked) {
            return nizCijena[vrijednost[i].value];
        }
    }
}

function cijenaFilinga() {
    var nizCijena = { "None": 0, "Lemon": 5, "Custard": 5, "Fudge": 7 };
    var odabraniFil = document.getElementById("filling");
    return nizCijena[odabraniFil.value];

}

function izracunajUkupno() {
    var ukupna = cijenaVelicine() + cijenaFilinga();
    if (document.getElementById("ukljucujesvijece").checked)
        ukupna += 5;
    if (document.getElementById("ukljucujenatpis").checked)
        ukupna += 20;
    document.getElementById("ukupno").innerHTML = "Ukupna cijena u KM: " + ukupna;
    return ukupna;
}

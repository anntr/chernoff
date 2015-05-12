/**
 * Created by Ania on 2015-01-06.
 */

var dataSet; //trzymam obiekty z jsona w tym
var dataObjectAttributes = []; //tablica atrybutow obiektu
var facePoints = {
    face: null,
    eye: null,
    nose: null,
    ears: null,
    pupils: null,
    mouth: null,
    eyebrows: null
};
var hashArr = {};
var attrValues = {};

function prepareForm(attributes){
    var $form = $('<form />', { id: "attributes" }),
        frmSave = $('<button />', {text: 'Ustaw'}),
        labelFace = $('<label/>', {for: 'atrFace', text: "Twarz"}),
        selectFace = $('<select />', {id: 'atrFace', name: 'atrFace'}),
        labelEye = $('<label/>', {for: 'atrEye', text: "Oczy"}),
        selectEye = $('<select />', {id: 'atrEye', name: 'atrEye'}),
        labelNose = $('<label/>', {for: 'atrNose', text: "Nos"}),
        selectNose = $('<select />', {id: 'atrNose', name: 'atrNose'}),
        labelMouth = $('<label/>', {for: 'atrMouth', text: "Uśmiech"}),
        selectMouth = $('<select />', {id: 'atrMouth', name: 'atrMouth'}),
        labelEars = $('<label/>', {for: 'atrEars', text: "Uszy"}),
        selectEars = $('<select />', {id: 'atrEars', name: 'atrEars'}),
        labelPupils = $('<label/>', {for: 'atrPupils', text: "Źrenice"}),
        selectPupils = $('<select />', {id: 'atrPupils', name: 'atrPupils'}),
        labelEyebrows = $('<label/>', {for: 'atrEyebrows', text: "Brwi"}),
        selectEyebrows = $('<select />', {id: 'atrEyebrows', name: 'atrEyebrows'});

    $form.append(labelFace, selectFace, labelEye,selectEye, labelNose, selectNose,  labelMouth, selectMouth, labelEars,
        selectEars, labelPupils, selectPupils, labelEyebrows, selectEyebrows, frmSave)
        .appendTo($('#attrSetter'));


    $form.submit(function(event){
        event.preventDefault();
        var tempObj = $form.serializeObject();
        if ( validateRequiredSettings(tempObj) ) {
            var tempArr = [];
            for (var key in tempObj) {
                if (tempObj[key] != '--') {
                    tempArr.push(tempObj[key]);
                }
            }
            if ( validateDataType(tempArr, dataSet.rows[0]) ){
                setFacePoints(tempObj);
                var onlyColumnNames = [];
                var onlyValues = []
                for( var k in hashArr ){
                    if(hashArr[k] != "--" && k != "--"){
                        onlyColumnNames.push(k);
                        onlyValues.push(hashArr[k]);
                    }
                }
                var $form2 = $("<form/>", {id: "limits"});
                for( var i = 0; i < onlyColumnNames.length; i++ ){
                    var $label = $("<label />", {text: onlyColumnNames[i]})
                    $form2 = $form2.append($label);
                    for( var grade = 0; grade < 5; grade++){
                        var $inpt = $("<input />", {name: onlyColumnNames[i]+grade, type: "text", placeholder:onlyColumnNames[i]+grade})
                        $inpt.appendTo($form2);
                    }
                }
                $form2.append($("<button />", {text: "ustaw przedzialy"})).appendTo($('#attrSetter'));

                $form2.submit(function(event) {
                    event.preventDefault();
                    var tempObj2 = $form2.serializeObject();

                    if( validateGrades(tempObj2)){
                        console.log(attrValues);
                        displayContents();
                    }
                })
            }
        }
    });

    for( var i = 0; i < attributes.length; i++ ){
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectFace);
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectEye);
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectNose);
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectMouth);
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectEars);
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectPupils);
        $('<option />', {value: attributes[i], text: attributes[i]}).appendTo(selectEyebrows);
    }
}
function validateGrades(object){
    var temp = [];
    for(var key in object){
        if( !$.isNumeric(object[key]) ){
            alert("niepoprawna wartosc w zakresach. musi byc numeryczna");
           return false;
        }
    }
    attrValues = object;
    return true;
}
function validateRequiredSettings(object){
    var testElement = dataSet.rows[0];
    if( object.atrFace == "--" || object.atrEye == "--" || object.atrNose == "--" || object.atrMouth == "--" ){
        alert("Nie ustawiono atrybutów wymaganych!")
        return false;
    }else{
        return true;
    }
}

function validateDataType(attrArray, object){
    for( var i = 0; i < attrArray.length; i++){
       if( typeof object[attrArray[i]] == "string") {
           alert("nieprawidlowy typ w " + [attrArray[i]] + " - musi byc wartoscia numeryczna");
           return false;
       }
    }
    return true;
}

function displayContents(){
    var attributes = getAttributesNames(dataSet.rows[0]);
    var $objectsContainer = $("#objects-container");
    for( var i = 0; i < dataSet.rows.length; i++) {
        var divObject =  $("<div/>", {
            "class": "object",
            id: i,
            text: i
        }).appendTo("#objects-container");
        var tbodyObject = $("<tbody />", {id:i}).appendTo($(divObject));
        printTable(attributes, i, dataSet.rows[i], tbodyObject);
        var results = setValues(dataSet.rows[i], facePoints);
        drawFace(attributes,i,dataSet.rows[i], divObject, results);
    }
}
function printTable(attributes, index, object, element) {
    for (var i = 0; i < attributes.length; i++) {
        $("<td/>", {text: object[attributes[i]]}).insertAfter($("<td/>", {text: attributes[i]}).appendTo($("<tr/>")
            .appendTo($(element))))
    }
}

function setValues(object, attrMap){
    var calculatedObject = {}
    for(var key in attrMap){
        if( attrMap[key] != "--" ){

            console.log(object[attrMap[key]])
            console.log(parseInt(attrValues[attrMap[key]+"0"]))
            console.log(object[attrMap[key]])
            console.log(parseInt(attrValues[attrMap[key]+"1"]))
           if ( object[attrMap[key]] > parseFloat(attrValues[attrMap[key]+"0"]) && object[attrMap[key]] <= parseFloat(attrValues[attrMap[key]+"1"]) ){
               calculatedObject[key] = "bad"
           }else if(object[attrMap[key]] > parseFloat(attrValues[attrMap[key]+"1"]+1) && object[attrMap[key]] <= parseFloat(attrValues[attrMap[key]+"2"])){
               calculatedObject[key] = "poor"
           }else if(object[attrMap[key]] >  parseFloat(attrValues[attrMap[key]+"2"]+1) && object[attrMap[key]] <=  parseFloat(attrValues[attrMap[key]+"3"])){
               calculatedObject[key] = "satisfactionary"
           }else if(object[attrMap[key]] > parseFloat(attrValues[attrMap[key]+"3"]+1) && object[attrMap[key]] <= parseFloat(attrValues[attrMap[key]+"4"])){
               calculatedObject[key] = "good"
           }else{
               calculatedObject[key] = "excellent"
           }
        }
    }
    return calculatedObject;
}
/*
function drawFace(attributes, index, object, element, results){

    var faceDiv = $("<div />",{"class": "head"}).appendTo($(element));
    faceDiv = $("<div />", {"class": "face "+results["face"] }).appendTo($(faceDiv));
    var eyesDiv = $("<div />", {"class": "eyes" }).appendTo($(faceDiv));
    var eyebrowsDiv = $("<div />", {"class": "eyebrows" }).appendTo($(faceDiv));
    $("<div />", {"class": "eyebrow left "+results["eyebrows"] }).appendTo($(eyebrowsDiv));
    $("<div />", {"class": "eyebrow right "+results["eyebrows"] }).appendTo($(eyebrowsDiv));
    $("<div />", {"class": "pupil "+results["pupils"] }).appendTo($("<div />", {"class": "eye "+results["eye"] }).appendTo($(eyesDiv)));
    $("<div />", {"class": "pupil "+results["pupils"] }).appendTo($("<div />", {"class": "eye "+results["eye"] }).appendTo($(eyesDiv)));
    var earsDiv = $("<div />", {"class": "ears" }).appendTo($(faceDiv));
    $("<div />", {"class": "ear left "+results["ears"] }).appendTo($(earsDiv));
    $("<div />", {"class": "ear right "+results["ears"] }).appendTo($(earsDiv));
    $("<div />", {"class": "nose "+results["nose"] }).appendTo($(faceDiv));
    $("<div />", {"class": "mouth "+results["mouth"] }).appendTo($(faceDiv));
}
*/
function setFacePoints(serializedForm){
    facePoints.face = serializedForm.atrFace;
    facePoints.eye = serializedForm.atrEye;
    facePoints.nose = serializedForm.atrNose;
    facePoints.ears = serializedForm.atrEars;
    facePoints.pupils  = serializedForm.atrPupils;
    facePoints.mouth = serializedForm.atrMouth;
    facePoints.eyebrows = serializedForm.atrEyebrows;

    hashArr = swap(facePoints);
    console.log(hashArr);
}

function swap(json){
    var ret = {};
    for(var key in json){
        ret[json[key]] = key;
    }
    return ret;
}

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

function eliminateDuplicates(arr) {
    var i,
        len=arr.length,
        out=[],
        obj={};
    for (i=0;i<len;i++) {
        obj[arr[i]]=0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

function getAttributesNames(object){
    var attributesArr = [];
    attributesArr.push("--");
    for ( var key in object ){
        attributesArr.push(key);
    }

    return attributesArr;
}




//document.getElementById('file-input').addEventListener('change',readFile, false);



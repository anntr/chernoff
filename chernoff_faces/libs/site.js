var dataSet;
var attributesNames;
var userSettings;
var faceObj = {};
var eyesObj = {};
var noseObj = {};
var mouthObj = {};
var eyebrowsObj = {};
var earsObj = {};
var pupilsObj = {};

$(document).on('change', '.btn-file :file', function() {
    var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    var fileExtension = label.substr(label.lastIndexOf('.')+1)
    if ( fileExtension != "json" ){
        alert("Nieprawidłowe rozszerzenie pliku");
        $("#exAttr").empty();
        $("#attrSetter select").empty();
        $("#loadAttr").empty();
        $("#objects-container").children().not(':first').remove();
        return
    }
    input.trigger('fileselect', label);
});

$(document).on('change', '.btn-load :file', function() {
    var input = $(this),
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', label);
});

$(document).on('change', '#file-input', function(e){
    var file = e.target.files[0];
    if( !file ){
        alert("Wczytanie pliku nie powiodło się! Spróbuj ponownie");
        return
    }
    var reader = new FileReader();
    reader.onload = (function(file) {
        return function (e) {
            $("#exAttr").empty();
            $("#attrSetter select").empty();
            $("#objects-container").children().not(':first').remove();

            var contents = e.target.result;
            dataSet = JSON.parse(contents);
            attributesNames = getNumericalObjectAttributes((dataSet.rows[0]))
            setAttributesSelectorOptions(attributesNames)
            showExampleData(dataSet.rows[0]);
            $("#fileExample table").css("display","initial");
            $("#dis").css("display", "initial");

        };
    })(file);
    reader.onloaded = (function(){
        var contents = e.target.result;
        dataSet = JSON.parse(contents);
    })
    reader.readAsText(file);
})


$(document).on('change', '#loadAttr', function(e){
    readSingleFile(e);
})

$(document).on('click', "#saveAttr", function(){
    if( attributesNames ) {
        var serializedForm = $("#attrSetter").serializeObject();
        var content = JSON.stringify(serializedForm);
        var tmp = new Blob([content], {type: 'text/plain;charset=utf-8"'});
        saveAs(tmp, "chernoffSettings.txt");
    }else{
        alert("Nie można zapisać pustych ustawień")
    }
})

$(document).on('change','#attrSetter select', function(){
    var values = getExampleValues(dataSet);
    var thisRow = $(this).closest("div.row");
    var fields = $(thisRow).find("input");
    var bad, poor, satisfactionary, good, excellent;
    bad = values[$(this).val()][0];
    excellent = values[$(this).val()][4];
    satisfactionary = (bad+excellent)/2;
    poor = (bad+satisfactionary)/2;
    good = (satisfactionary+excellent)/2;
    $(fields[0]).val(poor.toFixed(2)); //poor
    $(fields[1]).val(satisfactionary.toFixed(2));
    $(fields[2]).val(good.toFixed(2));
    $(fields[3]).val(excellent);
})


$(document).ready( function() {
    $('.btn-file :file').on('fileselect', function(event, label) {
        $("#file-name").val(label);
    });

    $('.btn-load :file').on('fileselect', function(event, label) {
            $("#attrSett").val(label);

    });

    $("form#attrSetter").submit(function(event){
        event.preventDefault();
        $("#objects-container").children().not(':first').remove();
        $(':input', this).filter(function(){
            return $(this).val().length == 0;
        }).prop("disabled", true);
        var formData = $(this).serializeObject();
        setGrades(formData);
        for( var i = 0; i < dataSet.rows.length; i++ ){
            drawFace(dataSet.rows[i], i);
        }
        $("#setAttributes").prop("disabled", false);
        return false;
    })
});

function setGrades(userSetting){

    faceObj.attribute = userSetting["face_attr"];
    faceObj.bad = Number(userSetting["face_bad"]);
    faceObj.poor = Number(userSetting["face_poor"]);
    faceObj.satifsactionary = Number(userSetting["face_satisfactionary"]);
    faceObj.good = Number(userSetting["face_good"]);
    faceObj.excellent = Number(userSetting["face_excellent"]);

    eyesObj.attribute = userSetting["eyes_attr"];
    eyesObj.bad = Number(userSetting["eyes_bad"]);
    eyesObj.poor = Number(userSetting["eyes_poor"]);
    eyesObj.satifsactionary = Number(userSetting["eyes_satisfactionary"]);
    eyesObj.good = Number(userSetting["eyes_good"]);
    eyesObj.excellent = Number(userSetting["eyes_excellent"]);

    noseObj.attribute = userSetting["nose_attr"];
    noseObj.bad = Number(userSetting["nose_bad"]);
    noseObj.poor = Number(userSetting["nose_poor"]);
    noseObj.satifsactionary = Number(userSetting["nose_satisfactionary"]);
    noseObj.good = Number(userSetting["nose_good"]);
    noseObj.excellent = Number(userSetting["nose_excellent"]);

    mouthObj.attribute = userSetting["mouth_attr"];
    mouthObj.bad = Number(userSetting["mouth_bad"]);
    mouthObj.poor = Number(userSetting["mouth_poor"]);
    mouthObj.satifsactionary = Number(userSetting["mouth_satisfactionary"]);
    mouthObj.good = Number(userSetting["mouth_good"]);
    mouthObj.excellent = Number(userSetting["mouth_excellent"]);

    eyebrowsObj.attribute = userSetting["eyebrows_attr"];
    eyebrowsObj.bad = Number(userSetting["eyebrows_bad"]);
    eyebrowsObj.poor = Number(userSetting["eyebrows_poor"]);
    eyebrowsObj.satifsactionary = Number(userSetting["eyebrows_satisfactionary"]);
    eyebrowsObj.good = Number(userSetting["eyebrows_good"]);
    eyebrowsObj.excellent = Number(userSetting["eyebrows_excellent"]);

    earsObj.attribute = userSetting["ears_attr"];
    earsObj.bad = Number(userSetting["ears_bad"]);
    earsObj.poor = Number(userSetting["ears_poor"]);
    earsObj.satifsactionary = Number(userSetting["ears_satisfactionary"]);
    earsObj.good = Number(userSetting["ears_good"]);
    earsObj.excellent = Number(userSetting["ears_excellent"]);

    pupilsObj.attribute = userSetting["pupils_attr"];
    pupilsObj.bad = Number(userSetting["pupils_bad"]);
    pupilsObj.poor = Number(userSetting["pupils_poor"]);
    pupilsObj.satifsactionary = Number(userSetting["pupils_satisfactionary"]);
    pupilsObj.good = Number(userSetting["pupils_good"]);
    pupilsObj.excellent = Number(userSetting["pupils_excellent"]);

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

function readSingleFile(e) {
    if( attributesNames ) {
        var file = e.target.files[0];
        if (!file) {
            return;
        }
        var reader = new FileReader();
        reader.onload = function (e) {
            var contents = e.target.result;
            try {
                var options = JSON.parse(contents);
                console.log(options)
                if (Object.keys(options).length != 35) {
                    alert("Niepoprawny format pliku");
                    $("#attrSett").trigger('fileselect', "");
                    return
                }
                for (var i = 0; i < Object.keys(options).length; i += 5) {
                    console.log(options[Object.keys(options)[i]]);
                    if (attributesNames.indexOf(options[Object.keys(options)[i]]) == -1) {
                        alert("Ustawienia nie dotyczą wybranego pliku");
                        $("#loadAttr").trigger('fileselect', "");
                        return
                    }
                }

                for (var key in options) {
                    $("#" + key).val(options[key]);
                }
                for( var i=0;i<3;i++) {
                    $("#attrSetter").fadeTo('slow', 0.5).fadeTo('slow', 1.0);
                }
            }
            catch (err){
                alert("Ładowanie ustawień nie powiodło się");
                $("#loadAttr").trigger('fileselect', "");
            }

        };
        reader.readAsText(file);
    }else{alert("Załaduj dane, zanim załadujesz ustawienia")
        $("#loadAttr").trigger('fileselect', "");}
}

function showExampleData(object){
    var table = $("#exAttr");
    for( var key in object ){
        var tr = $("<tr/>").appendTo(table);
        $("<td/>", {text: key}).appendTo(tr);
        $("<td/>", {text: object[key]}).appendTo(tr);
    }
}

function drawFace(object, index){
    var currentCount = $("#objects-container").length;
    var root = $("#objects-container")
    var repeatingSection = $("#repeat")
    var newFace = repeatingSection.clone();
    newFace.removeAttr("id");
    newFace.attr("id", index);

    for( var key in object ){
        var tr = $("<tr/>").appendTo(newFace.find("table"));
        $("<td/>", {text: key}).appendTo(tr);
        $("<td/>", {text: object[key]}).appendTo(tr);
    }
    if( object[faceObj.attribute] < faceObj.poor ){

        $(newFace.find(".face")).addClass("bad");
    }else if( object[faceObj.attribute] < faceObj.satifsactionary ){
         $(newFace.find(".face")).addClass("poor");

    }else if( object[faceObj.attribute] < faceObj.good ){
         $(newFace.find(".face")).addClass("satisfactionary");

    }else if( object[faceObj.attribute] < faceObj.excellent ){
         $(newFace.find(".face")).addClass("good");

    }else{
         $(newFace.find(".face")).addClass("excellent");
    }

    if( object[eyesObj.attribute] < eyesObj.poor ){
        $(newFace.find(".eyes")).addClass("bad");
    }else if( object[eyesObj.attribute] < eyesObj.satifsactionary ){
        $(newFace.find(".eyes")).addClass("poor");
    }else if(object[eyesObj.attribute] < eyesObj.good ){
        $(newFace.find(".eyes")).addClass("satisfactionary");
    }else if(object[eyesObj.attribute] < eyesObj.excellent ){
        $(newFace.find(".eyes")).addClass("good");
    }else{
        $(newFace.find(".eyes")).addClass("excellent");
    }

    if( object[noseObj.attribute] < noseObj.poor){
        $(newFace.find(".nose")).addClass("bad");
    }else if(object[noseObj.attribute] < noseObj.satifsactionary ){
        $(newFace.find(".nose")).addClass("poor");
    }else if(object[noseObj.attribute] < noseObj.good ){
        $(newFace.find(".nose")).addClass("satisfactionary");
    }else if(object[noseObj.attribute] < noseObj.excellent ){
        $(newFace.find(".nose")).addClass("good");
    }else{
        $(newFace.find(".nose")).addClass("excellent");
    }

    if( object[mouthObj.attribute] < mouthObj.poor ){
        $(newFace.find(".mouth")).addClass("bad");
    }else if(object[mouthObj.attribute] < mouthObj.satifsactionary ){
        $(newFace.find(".mouth")).addClass("poor");
    }else if(object[mouthObj.attribute] < mouthObj.good ){
        $(newFace.find(".mouth")).addClass("satisfactionary");
    }else if(object[mouthObj.attribute] < mouthObj.excellent ){
        $(newFace.find(".mouth")).addClass("good");
    }else{
        $(newFace.find(".mouth")).addClass("excellent");
    }

    if( object[earsObj.attribute] ){
        if( object[earsObj.attribute] < earsObj.poor ){
            $(newFace.find(".ears")).addClass("bad");
        }else if(object[earsObj.attribute] < earsObj.satifsactionary ){
            $(newFace.find(".ears")).addClass("poor");
        }else if(object[earsObj.attribute] < earsObj.good ){
            $(newFace.find(".ears")).addClass("satisfactionary");
        }else if(object[earsObj.attribute] < earsObj.excellent ){
            $(newFace.find(".ears")).addClass("good");
        }else{
            $(newFace.find(".ears")).addClass("excellent");
        }
    }
    if( object[pupilsObj.attribute] ){
        if( object[pupilsObj.attribute] < pupilsObj.poor ){
            $(newFace.find(".pupils")).addClass("bad");
        }else if( object[pupilsObj.attribute] < pupilsObj.satifsactionary ){
            $(newFace.find(".pupils")).addClass("poor");
        }else if( object[pupilsObj.attribute] < pupilsObj.good ){
            $(newFace.find(".pupils")).addClass("satisfactionary");
        }else if( object[pupilsObj.attribute] < pupilsObj.excellent ){
            $(newFace.find(".pupils")).addClass("good");
        }else{
            $(newFace.find(".pupils")).addClass("excellent");
        }
    }
    if( object[eyebrowsObj.attribute] ) {
        if( object[eyebrowsObj.attribute] < eyebrowsObj.poor ){
            $(newFace.find(".eyebrows")).addClass("bad");
        }else if( object[eyebrowsObj.attribute] < eyebrowsObj.satifsactionary ){
            $(newFace.find(".eyebrows")).addClass("poor");
        }else if( object[eyebrowsObj.attribute] < eyebrowsObj.good ){
            $(newFace.find(".eyebrows")).addClass("satisfactionary");
        }else if( object[eyebrowsObj.attribute] < eyebrowsObj.excellent ){
            $(newFace.find(".eyebrows")).addClass("good");
        }else{
            $(newFace.find(".eyebrows")).addClass("excellent");
        }
    }
    $(newFace).appendTo(root);
    return true;
}

function getExampleValues(dataSet){
    var attrArr = getObjectAttributes(dataSet.rows[0]);
    var values = new Object();
    for( var i = 0; i < attrArr.length; i++ ){
        values[attrArr[i]] = new Array();
    }
    for( var i = 0; i < dataSet.rows.length; i++ ) {
        for (var attrIndex = 0; attrIndex < attrArr.length; attrIndex++) {
            values[attrArr[attrIndex]].push(dataSet.rows[i][attrArr[attrIndex]]);
        }
    }
    for( var i = 0; i < attrArr.length; i++ ){
        values[attrArr[i]].sort();
    }
    return values;
}


function getObjectAttributes(object){
    var objectAttributesNames = Object.keys(object);
    return objectAttributesNames
}

function getNumericalObjectAttributes(object){
    var onlyNumericalAttributes = [];
    for( var key in object ){
        if( $.isNumeric(object[key]) ){
            onlyNumericalAttributes.push(key)
        }
    }
    return onlyNumericalAttributes;
}

function setAttributesSelectorOptions(array){
    var attrSetterInputs = $("#attrSetter select")
    $.each(array, function(i, element){
        $(attrSetterInputs).append($('<option>',{value: element, text: element}))
    })
    $.each(attrSetterInputs, function(i, element){
        if( $(element).val() ){
            $(element).trigger('change');
        }
    })

    $("#attrForm").css('display', 'initial');
}

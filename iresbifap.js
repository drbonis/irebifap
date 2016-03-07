
var atc7_array = ["N06BA04"];
var events_array = ["TADH"];
var output = "";

atc7_array.forEach(function(entry) {
    output += entry + "_INCIDENTES = Numero de pacientes con al menos una receta de " + entry + " entre el 01/01/20XX y 31/12/20XX y sin recetas anteriores a 01/01/20XX\r\n";
    output += entry + "_PREVALENTES =  Numero de pacientes con al menos una receta de " + entry + " anterior al 01/01/20XX\r\n";
    output += entry + "_NOCASO = Numero de pacientes sin recetas anteriores al 31/12/20XX\r\n";
    
});

events_array.forEach(function(entry){
   output += entry + "_INCIDENTES = Numero de pacientes con un diagnostico entre el 01/01/20XX y 31/12/20XX y sin diagnostico anterior a 01/01/20XX\r\n";
   output += entry + "_PREVALENTES = Numero de pacientes con un diagnostico de "++"";
});


console.log(output)
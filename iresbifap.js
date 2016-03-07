/*
var events = [
    {short_name: "N06BA04", full_name: "N06BA04 Metilfenidato", type: "medicine", duration: "chronic"}, 
    {short_name: "TADH", full_name: "trastorno por déficit de atención e hiperactividad", type: "diagnosis", duration: "chronic"},
    {short_name: "N06BA09", full_name: "N06BA09 Atomoxetina", type: "medicine", duration: "acute"},
    {short_name: "N06BA12", full_name: "N06BA12 Lisdexanfetamina", type: "medicine", duration: "acute"}];

var rels = [["N06BA04","TADH","last_year"],["N06BA09","TADH","last_year"],["N06BA12","TADH","all_years"]];
*/

var events = [
    {short_name: "N06BA04", full_name: "N06BA04 Metilfenidato", type: "medicine", duration: "acute"}, 
    {short_name: "TADH", full_name: "trastorno por déficit de atención e hiperactividad", type: "diagnosis", duration: "acute"}
    ];

var rels = [["N06BA04","TADH","all_years"]];



var events_index = [];
var var_list = [];
var output = "";
var output2 = "";




events.forEach(function(entry,index) {
    
    //code for creating index
    events_index.push(entry['short_name']);

    var str_type = (entry['type']==='medicine')? 'una receta' : 'un diagnostico';
    
    events[index].nc = "sin " +str_type+ " de "+ entry['full_name'] +" anterior al 31/12/20XX";
    events[index].in = "con al menos "+ str_type + " de " + entry.full_name + " entre el 01/01/20XX - 31/12/20XX y sin "+str_type+ " de "+ entry.full_name +" anterior a 01/01/20XX";
    
    if (entry['duration']==='acute') {
        events[index].pr = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX y con al menos "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
        events[index].pa = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX y sin "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
    } else if(entry.duration==='chronic') {
        events[index].pr = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX";
        events[index].pa = "ninguna otra condición";
    }
    
    //code for listing variables for individual events
    output += "<div><strong>" + entry.short_name + "_NC</strong> = Numero de pacientes "+entry.nc+"</div>";
    var_list.push(entry.short_name + "_NC");
    output += "<div><strong>" + entry.short_name + "_IN</strong> = Número de pacientes "+entry.in+"</div>";
    var_list.push(entry.short_name + "_IN");
    if (entry['duration']==='acute') {
        output += "<div><strong>" + entry['short_name'] + "_PR</strong> =  Numero de pacientes "+entry.pr+"</div>";
        var_list.push(entry.short_name + "_PR");
        output += "<div><strong>" + entry['short_name'] + "_PA</strong> =  Numero de pacientes "+entry.pa+"</div>";
        var_list.push(entry.short_name + "_PA");
    } else {
        output += "<div><strong>" + entry['short_name'] + "_PR</strong> =  Numero de pacientes "+entry.pr+"</div>";
        var_list.push(entry.short_name + "_PR");
    }

    
});

//code for variables of event's interaction

rels.forEach(function(relation){

    var a = events[events_index.indexOf(relation[0])];
    var b = events[events_index.indexOf(relation[1])];
    var c = relation[2];
    console.log(a,b,c);

    var m = ["nc","in","pr","pa"];
    var n = [["BEFORE","antes"],["SAMETIME","mismo día"],["AFTER","después"]];
    
    m.forEach(function(e,i){
        
        if(!(a.duration==='chronic' && e == "pa")) {   //if chronic dont calculate PAxx 
        
            m.forEach(function(f,j){
                if(!(b.duration==='chronic' && f == "pa")) { // if chronic dont calculate xxPA
                    output+="<div><strong>"+e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+b['short_name']+"</strong> = Número de pacientes "+a[e]+" y "+b[f]+"</div>";
                    var_list.push(e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+b['short_name']);
                    
                    if((e == f && (e == 'in' || e == 'pr')) || (c == 'all_years' && (e != 'in' && f != 'in' && e != 'nc' && f != 'nc'))) {
                        // calculate before, sametime and after variables
                        var str1 = (a.type==='medicine')? "de la primera receta de "+a.full_name:"del primer diagnóstico de "+a.full_name;
                        var str2 = (b.type==='medicine')? "de la primera receta de "+b.full_name:"del primer diagnóstico de "+b.full_name;
                        n.forEach(function(o,k){
                            output += "<div><strong>"+e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+o[0]+"_"+b['short_name']+"</strong> = Número de pacientes "+a.in+" y "+b.in+" y en los que "+str1+" ocurre "+o[1]+" "+str2+"</div>";
                            var_list.push(e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+o[0]+"_"+b['short_name']);
                            
                        }); 
                        

                    } else {
                        console.log(c,e,f);
                    }
                    
                }
            
            }); 
        }
    });

});

console.log(var_list);
console.log(var_list.length)
document.getElementById("output").innerHTML = output;

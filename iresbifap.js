
/*
var events = [
    {short_name: "N06BA04", full_name: "N06BA04 Metilfenidato", type: "medicine", duration: "acute"}, 
    {short_name: "TADH", full_name: "trastorno por déficit de atención e hiperactividad", type: "diagnosis", duration: "chronic"},
    {short_name: "N06BA09", full_name: "N06BA09 Atomoxetina", type: "medicine", duration: "acute"},
    {short_name: "N06BA12", full_name: "N06BA12 Lisdexanfetamina", type: "medicine", duration: "acute"}];

var rels = [["N06BA04","TADH","last_years"],["N06BA09","TADH","last_years"],["N06BA12","TADH","last_years"]];
*/
//var rels = [];

var events = [
    {short_name: "AAAAAA", full_name: "aaaaaaaaaaaaa", type: "medicine", duration: "recurrent"}, 
    {short_name: "BBBBBB", full_name: "bbbbbbbbbbbbb", type: "diagnosis", duration: "recurrent"},
    ];

var rels = [["AAAAAA","BBBBBB","all_years"]];

var events_index = [];
var var_list = [];
var output = "";




events.forEach(function(entry,index) {
    
    //code for creating index
    events_index.push(entry['short_name']);


    // code for creating texts  
    var str_type = (entry['type']==='medicine')? 'una receta' : 'un diagnostico';
    
    //no case
    events[index].nc = "sin " +str_type+ " de "+ entry['full_name'] +" anterior al 31/12/20XX";
    //ever case
    events[index].ev = "con al menos " +str_type+ " de "+ entry['full_name'] +" anterior al 31/12/20XX";
    //incident case (new case)
    events[index].in = "con al menos "+ str_type + " de " + entry.full_name + " entre el 01/01/20XX - 31/12/20XX y sin "+str_type+ " de "+ entry.full_name +" anterior a 01/01/20XX";
    //current year present
    events[index].cp = "con al menos "+ str_type + " de " + entry.full_name + " entre el 01/01/20XX - 31/12/20XX";
    //current year absent
    events[index].ca = "sin "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
    
    if (entry['duration']==='acute') {
        //prevalent in acutes
        events[index].pr = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX y con al menos "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
        //past in acutes
        events[index].pa = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX y sin "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
        
    } else if(entry.duration==='chronic') {
        //prevalent in chronic
        events[index].pr = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX";
        //events[index].pa = "";
        
    } else if(entry.duration==='recurrent') {
        events[index].pr = "con al menos "+str_type+ " de "+ entry.full_name +" entre el 01/01/(20XX-1) - 31/12/(20XX-1) y con al menos "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
        events[index].re = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/(20XX-1) y sin "+str_type+ " de "+ entry.full_name +" entre el 01/01/(20XX-1) - 31/12/(20XX-1) y con al menos "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
        events[index].pa = "con al menos "+str_type+ " de "+ entry.full_name +" anterior al 01/01/20XX y sin "+str_type+ " de "+ entry.full_name +" entre el 01/01/20XX y el 31/12/20XX";
    }
    
    //code for listing variables for individual events
    output += "<div><strong>" + entry.short_name + "_NC (Nunca han sido casos de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.nc+"</div>";
    var_list.push(entry.short_name + "_NC");
    
    output += "<div><strong>" + entry.short_name + "_CP (Casos en el año actual de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.cp+"</div>";
    var_list.push(entry.short_name + "_CP");
    
    output += "<div><strong>" + entry.short_name + "_CA (No son casos en el año actual de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.ca+"</div>";
    var_list.push(entry.short_name + "_CA");
    
    output += "<div><strong>" + entry.short_name + "_IN (Casos incidentes de " + entry.full_name + " )</strong> = Número de pacientes "+entry.in+"</div>";
    var_list.push(entry.short_name + "_IN");
    
    output += "<div><strong>" + entry['short_name'] + "_PR (Casos prevalentes de " + entry.full_name + ")</strong> =  Numero de pacientes "+entry.pr+"</div>";
    var_list.push(entry.short_name + "_PR");
    
    if (entry['duration']==='acute' || entry.duration === 'recurrent') {
        output += "<div><strong>" + entry['short_name'] + "_PA (Casos Pasados de " + entry.full_name + ")</strong> =  Numero de pacientes "+entry.pa+"</div>";
        var_list.push(entry.short_name + "_PA");
    } 

    if (entry.duration ==='recurrent') {

        output += "<div><strong>" + entry['short_name'] + "_RE (Casos reiniciados de " + entry.full_name + ")</strong> =  Numero de pacientes "+entry.re+"</div>";
        var_list.push(entry.short_name + "_RE");
    }

    output += "<div>............</div>";
    
});

//code for variables of event's interaction

rels.forEach(function(relation){

    function getCaseDescription(caseDesc) {
        switch (caseDesc) {
            case "nc":
                return "No Casos";
                break;
            case "in":
                return "Casos Incidentes";
                break;
            case "pr":
                return "Casos Prevalentes";
                break;
            case "pa":
                return "Casos Pasados";
                break;
            case "re":
                return "Casos Reiniciados";
                break;
            case "cp":
                return "Casos en el año actual";
                break;
            case "ca":
                return "No casos en el año actual";
                break;
            default:
                return null;
        }
        
    }

    var a = events[events_index.indexOf(relation[0])];
    var b = events[events_index.indexOf(relation[1])];
    var c = relation[2];
    

    var m = ["nc","in","pr","pa","re","cp","ca"];
    var n = [["BEFORE","antes"],["SAMETIME","mismo día"],["AFTER","después"]];
    
    
    
    m.forEach(function(e,i){
        
        if(!((a.duration==='chronic' && e == "pa") ||(e=='re' && (a.duration != 'recurrent')) )) {   //dont calculate PAxx if chronic nor RExx if recurrent nor CAxx
        
            m.forEach(function(f,j){
                if(!((b.duration==='chronic' && f == "pa")||  (f=='re' && (b.duration != 'recurrent')))) { // dont calculate xxPA if chronic nor xxRE if recurrent nor xxCA
                    output+="<div><strong>"+e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+b['short_name']+" ("+getCaseDescription(e)+" de "+a['short_name']+" que son "+getCaseDescription(f)+" de "+b['short_name']+")</strong> = Número de pacientes "+a[e]+" y "+b[f]+"</div>";
                    var_list.push(e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+b['short_name']);
                    
                    //if(c != 'none' && (e == f && (e == 'in' || e == 'pr')) || (c == 'all_years' && (e != 'in' && f != 'in' && e != 'nc' && f != 'nc'))) {
                    if(c != 'none'  && e != 'nc' && f!= 'nc' && !(e == 'in' && f!='in') && !(f == 'in' && e!='in') && !(e == 'cp' && f!='cp') && !(f == 'cp' && e!='cp')) {
                        // calculate before, sametime and after variables
                        var str1 = (a.type==='medicine')? "de la primera receta de "+a.full_name:"del primer diagnóstico de "+a.full_name;
                        var str2 = (b.type==='medicine')? "de la primera receta de "+b.full_name:"del primer diagnóstico de "+b.full_name;
                        n.forEach(function(o,k){
                            output += "<div style=\"color: red\"><strong>"+e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+o[0]+"_"+b['short_name']+"("+getCaseDescription(e)+" de "+a['short_name']+" que son "+getCaseDescription(f)+" de "+b['short_name']+" donde "+a['short_name']+" ocurre "+o[1]+" que "+b['short_name']+")</strong> = Número de pacientes "+a.in+" y "+b.in+" y en los que "+str1+" ocurre "+o[1]+" "+str2+"</div>";
                            var_list.push(e.toUpperCase()+f.toUpperCase()+"_"+a['short_name']+"_"+o[0]+"_"+b['short_name']);
                            
                        }); 
                        

                    } 
                    
                }
                
            }); 
        }
        output += "<div>............</div>";
    });

});

output+= "<div>Número de variables: "+var_list.length+"</div>"
document.getElementById("output").innerHTML = output;




$("#newEventBtn").click(function(e){
    function newEventHtml(i) {
        var r = '<div class="eventBifap">' + 
        
                    '<label>Nombre corto: </label>' + 
                    '<input id="short_name'+i+'" type="text">'+
                    
                    '<label>Nombre completo: </label>'+
                    '<input id="full_name'+i+'" type="text">'+
                    
                    '<label>Tipo de evento: </label>'+
                    '<select id="type'+i+'">'+
                        '<option value="medicine">Medicamento</option>'+
                        '<option value="diagnosis">Diagnóstico</option>'+
                    '</select>'+
                    
                    '<label>Duración de evento: </label>'+
                    '<select id="duration'+i+'">'+
                        '<option value="acute">Agudo</option>'+
                        '<option value="chronic">Crónico</option>'+
                        '<option value="recurrent">Recurrente</option>'+
                    '</select>'+
                    
                    '<button id="eventRemoveBtn'+i+'">Eliminar</button>'
                    
                '</div>';
            return r;
    }
    

    
    e.preventDefault();

    i = $(".eventBifap").length
    $("#eventFormList").append(newEventHtml(i));

   
    $("#eventRemoveBtn"+i).click(function(j){
        j.preventDefault();
        $(this).parent().remove();
    });
    
    
    
    
    
    

});

$("#checkEvents").click(function(e){
    e.preventDefault();
    $("#relationFormList").empty();
   
   function newRelationHtml(i,j,ei,ej) {
       var r = '<div class="relationBifap'+i+'">' + 
                   '<input type="checkbox" checked id="relationCheck"'+i+'>'+
                   '<label id="relationLabel'+i+'_'+j+'"><span class="e'+i+'">'+ei.short_name+'</span> combinado con <span class="e'+j+'">'+ej.short_name+'</span></label>'+
                   '<select id="combtype'+i+'_'+j+'">'+
                        '<option value="none">None</option>'+
                        '<option value="last_year">Last Year</option>'+
                        '<option value="all_years">All Years</option>'+
                    '</select>'+
               '</div>';
       return r;
   }
   
   function buildEventsArray() {
       eventList = $("#eventFormList").children();
       events = [];

       $.each(eventList, function(i,e){
           events.push({
               short_name: document.getElementById("short_name"+i).value, 
               full_name: document.getElementById("full_name"+i).value, 
               type: document.getElementById("type"+i).value, 
               duration: document.getElementById("duration"+i).value
           });
       });
       return events;
   }
   
   

   
   events = buildEventsArray();
   
   if (events.length > 1) {
       i = 0;
        while (events.length > 0) {
            ei = events[0];
            events.shift();
            $.each(events,function(j,ej) {
               console.log(ei, ej,i,j+i+1);
               $("#relationFormList").append(newRelationHtml(i,j+i+1,ei,ej));
            });
            i++;
        }
    
      /*
      
       $.each(events, function(i,ei){
           events.shift();
           $.each(events,function(j,ej){
               console.log(i,j);
               $("#relationFormList").append(newRelationHtml(i,j,events));
           });
           
       });
       */
   }
   
   /*
   if (events.slice(0,-1).length > 0) {
       $.each(events.slice(0,-1), function(j,e){
           $("#relationFormList").append(newRelationHtml(i,j));
       });
   }
   */
   
});



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
    {short_name: "AAAAAA", full_name: "aaaaaaaaaaaaa", type: "medicine"}, 
    {short_name: "BBBBBB", full_name: "bbbbbbbbbbbbb", type: "diagnosis"},
    {short_name: "CCCCCC", full_name: "ccccccccccccc", type: "medicine"}
    ];

var groups = [{short_name: "AAABBB", full_name: "abababababab", type: "group", events: ["AAAAAA","BBBBBB"]}];

var rels = [["AAAAAA","BBBBBB"],["AAAAAA","CCCCCC"]];

var events_index = [];
var var_list = [];
var output = "";




events.forEach(function(entry,index) {
    
    //code for creating index
    events_index.push(entry['short_name']);
    
    var cu = "con al menos un día de " + entry.full_name + " entre el 01/01/20XX - 31/12/20XX";
    var pa = "con al menos un día de " + entry.full_name + " anterior al 01/01/20XX";
    //current year present
    events[index].cu = cu;
    //previous year present
    events[index].pa = pa;
    events[index].cupa = "( " + cu + " ) y ( " + pa + " ) ";
    

    

});


groups.forEach(function(group, index){
    console.log("Nuevo evento combinado: "+group.short_name);
    events_index.push(group.short_name);
    var cu="";
    var pa= "";
    group.events.forEach(function(eventGroup,index){
        //console.log(eventGroup);
        cu += "con al menos un día de "+eventGroup+" entre el 01/01/20XX - 31/12/20XX ";
        pa += "con al menos un día de "+eventGroup+" anterior al 01/01/20XX ";
        if(index < group.events.length - 1) { cu+=" OR "; pa+= " OR "}
    });
    var cupa = "( " + cu + " ) y ( " + pa + " )";
    events.push({short_name: group.short_name, full_name: group.full_name, type: group.type, events: group.events, cu: cu, pa: pa, cupa: cupa});
    console.log("Número de pacientes" + cu);
    console.log("Número de pacientes" + pa);
}); 



events.forEach(function(entry,index) {
    //code for listing variables for individual events
    
    output += "<div><strong>" + entry.short_name + "_CU (Casos en el año actual de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.cu+"</div>";
    var_list.push(entry.short_name + "_CU");
    
    output += "<div><strong>" + entry.short_name + "_PA (Casos pasados de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.pa+"</div>";
    var_list.push(entry.short_name + "_CA");
    
    output += "<div><strong>" + entry.short_name + "_CUPA (Casos en el año actual y también en el pasado de  " + entry.full_name + " )</strong> = Número de pacientes "+entry.cupa+"</div>";
    var_list.push(entry.short_name + "_CUPA");


    output += "<div>............</div>";
    
});

//code for variables of event's interaction

rels.forEach(function(relation){

    var a = events[events_index.indexOf(relation[0])];
    var b = events[events_index.indexOf(relation[1])];
    
    console.log("Número de pacientes con al menos un día de "+a.full_name+" entre el 01/01/20XX - 31/12/20XX y al menos un día de "+b.full_name+" entre el 01/01/20XX - 31/12/20XX");
    console.log("Número de pacientes con al menos un día en el que exista un curso de "+a.full_name+" y un curso de "+b.full_name+" simultáneamente");


});

output+= "<div>Número de variables: "+var_list.length+"</div>"
document.getElementById("output").innerHTML = output;





/* block of jquery elements */

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

   }

   
});


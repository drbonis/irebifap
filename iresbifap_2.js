
/*
var events = [
    {short_name: "N06BA04", full_name: "N06BA04 Metilfenidato", type: "medicine", duration: "acute"}, 
    {short_name: "TADH", full_name: "trastorno por déficit de atención e hiperactividad", type: "diagnosis", duration: "chronic"},
    {short_name: "N06BA09", full_name: "N06BA09 Atomoxetina", type: "medicine", duration: "acute"},
    {short_name: "N06BA12", full_name: "N06BA12 Lisdexanfetamina", type: "medicine", duration: "acute"}];

var rels = [["N06BA04","TADH","last_years"],["N06BA09","TADH","last_years"],["N06BA12","TADH","last_years"]];
*/
//var rels = [];

function Irebifap (events, groups, rels) {
    var self = this;
    
    this.events = events;
    this.groups = groups;
    this.rels = rels;
    this.tables = [];
    this.events_index = [];
    this.var_list = [];
    this.output = "";
    
    this.age_groups = [
        {min: 0, max: 0, capt: "<1 año"},
        {min: 1, max: 1, capt: "1 a <2 años"},
        {min: 2, max: 3, capt: "2 a <4 años"},
        {min: 4, max: 4, capt: "4 a <5 años"},
        {min: 5, max: 5, capt: "5 a <6 años"},
        {min: 6, max: 7, capt: "6 a <8 años"},
        {min: 8, max: 9, capt: "8 a <10 años"},
        {min: 10, max: 11, capt: "10 a <12 años"},
        {min: 12, max: 13, capt: "12 a <14 años"},
        {min: 14, max: 14, capt: "14 a <15 años"},
        {min: 15, max: 15, capt: "15 a <16 años"},
        {min: 16, max: 17, capt: "16 a <18 años"},
        {min: 18, max: 19, capt: "18 a <20 años"},
        {min: 20, max: 24, capt: "20 a <15 años"},
        {min: 25, max: 29, capt: "25 a <30 años"},
        {min: 30, max: 34, capt: "30 a <35 años"},
        {min: 35, max: 39, capt: "35 a <40 años"},
        {min: 40, max: 44, capt: "40 a <45 años"},
        {min: 45, max: 49, capt: "45 a <50 años"},
        {min: 50, max: 54, capt: "50 a <55 años"},
        {min: 55, max: 59, capt: "55 a <59 años"},
        {min: 60, max: 64, capt: "60 a <65 años"},
        {min: 65, max: 69, capt: "65 a <70 años"},
        {min: 70, max: 74, capt: "70 a <75 años"},
        {min: 75, max: 79, capt: "75 a <79 años"},
        {min: 80, max: 84, capt: "80 a <85 años"},
        {min: 85, max: 89, capt: "85 a <90 años"},
        {min: 90, max: 94, capt: "90 a <95 años"},
        {min: 95, max: 99, capt: "95 a <100 años"},
        {min: 100, max: 104, capt: "100 a <105 años"},
        {min: 105, max: 109, capt: "105 a <110 años"}
        ];
        
    this.sex = [{c: "Hombre", v: 0}, {c: "Mujer", v: 1}];
    
    /*[0,0];[1,1];[2,3];[4,4];[5,5];[6,7];[8,9];[10,11];[12,13];[14,14];[15,15];[16,17];[18,19];
                      [20,24];[25,29];[30,34];[35,39];[40,44];[45,49];[50,54];[55,59];
                      [60,64];[65,69];[70,74];[75,79];[80,84];[85,89];[90,94];[95,99];[100,104];[105,109].*/
                      

    // generates the events
    this.events.forEach(function(entry,index) {
        
        entry.events = []; // empty array of events if not a group
        entry.rels = {};
        
        //code for creating index
        self.events_index.push(entry.short_name);
        self.events[index] = entry;
        
        
        var cu = "con al menos un día de " + entry.full_name + " entre el 01/01/20XX - 31/12/20XX";
        var pa = "con al menos un día de " + entry.full_name + " anterior al 01/01/20XX";
        //current year present
        self.events[index].cu = cu;
        //previous year present
        self.events[index].pa = pa;
        //current and previous year present
        self.events[index].cupa = "( " + cu + " ) y ( " + pa + " ) ";
        
    });
    
    //each group of events is added as new event
    this.groups.forEach(function(group, index){
        console.log("Nuevo evento combinado: "+group.short_name);
        self.events_index.push(group.short_name);
        var cu="";
        var pa= "";
        group.events.forEach(function(eventGroup,index){
            //console.log(eventGroup);
            cu += "con al menos un día de "+eventGroup+" entre el 01/01/20XX - 31/12/20XX ";
            pa += "con al menos un día de "+eventGroup+" anterior al 01/01/20XX ";
            if(index < group.events.length - 1) { cu+=" OR "; pa+= " OR "}
        });
        var cupa = "( " + cu + " ) y ( " + pa + " )";
        self.events.push({short_name: group.short_name, full_name: group.full_name, type: group.type, events: group.events, cu: cu, pa: pa, cupa: cupa, rels: []});

    }); 
    
    //code for variables of event's interaction
    
    this.rels.forEach(function(relation){
    
        var a = self.events[self.events_index.indexOf(relation[0])];
        var b = self.events[self.events_index.indexOf(relation[1])];
        
        console.log(a);
        console.log(b);
        a.rels[b.short_name] ={event: b.short_name, cu: "con al menos un día de "+a.full_name+" entre el 01/01/20XX - 31/12/20XX y al menos un día de "+b.full_name+" entre el 01/01/20XX - 31/12/20XX", ev: "con al menos un día en el que exista un curso de "+a.full_name+" y un curso de "+b.full_name+" simultáneamente"  };
        
    
    
    });
    
    this.buildTables = function () {
        // tablas sobre eventos individuales (o grupos)
        self.events.forEach(function(event,index){
                // tabla presencia en último año por edad y sexo
                var t1 = {
                    short_name: event.short_name+"_20XX",
                    title: "Pacientes con "+event.full_name+" en 20XX",
                    vars: [event.cu],
                    cells: [
                        ["","Pacientes con "+event.full_name+" en 2014","","",""],
                        ["","","Hombres","Mujeres","Ambos"]
                    ]

                }
                self.age_groups.forEach(function(a){
                    t1.cells.push([a.capt,event.full_name,"","",""]);
                    event.events.forEach(function(e){
                        var full_event = self.events[self.events_index.indexOf(e)];
                        t1.cells.push(["",full_event.full_name,"","",""]);
                    });
                });
                self.tables.push(t1); 

                // tabla presencia en último año global
                var t2 = {
                    short_name: event.short_name+"_2014",
                    title: "Pacientes con "+event.full_name+" en 20XX",
                    vars: [event.cu],
                    cells: [
                        ["Pacientes con "+event.full_name+" en 20XX","","",""],
                        ["","Hombres","Mujeres","Ambos"]
                    ]
                
                }
                t2.cells.push([event.full_name,"","",""]);
                event.events.forEach(function(e){
                    var full_event = self.events[self.events_index.indexOf(e)];
                    t2.cells.push([full_event.full_name,"","",""]);
                });

                self.tables.push(t2); 
        });
        
        // tablas sobre relaciones entre eventos
        
        self.rels.forEach(function(rel){
            
            var a = self.events[self.events_index.indexOf(rel[0])];
            var b = self.events[self.events_index.indexOf(rel[1])];
            
            
            // tabla de contingencia
            var t = {
               short_name: a.short_name+"_"+b.short_name+"_2014",
               title: "Tabla de contingencia entre "+a.full_name+" y "+b.full_name+"  en 20XX",
               vars: [a.cu, b.cu, a.rels[b.short_name]['cu']],
               cells: [
                   ["Tabla de contingencia entre "+a.full_name+" y "+b.full_name+"  en 20XX","","",""],
                   ["","Con "+a.short_name,"Sin"+a.short_name,"Total"],
                   ["Con "+b.short_name,"","",""],
                   ["Sin "+b.short_name,"","",""],
                   ["Total"+"","","",""]
               ]
           
            }
            self.tables.push(t);
        });
        
    }
    
    this.buildOutput = function () {
        self.events.forEach(function(entry,index) {
            //code for listing variables for individual events
            
            self.output += "<div><strong>" + entry.short_name + "_CU (Casos en el año actual de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.cu+"</div>";
            self.var_list.push(entry.short_name + "_CU");
            
            self.output += "<div><strong>" + entry.short_name + "_PA (Casos pasados de " + entry.full_name + " )</strong> = Numero de pacientes "+entry.pa+"</div>";
            self.var_list.push(entry.short_name + "_CA");
            
            self.output += "<div><strong>" + entry.short_name + "_CUPA (Casos en el año actual y también en el pasado de  " + entry.full_name + " )</strong> = Número de pacientes "+entry.cupa+"</div>";
            self.var_list.push(entry.short_name + "_CUPA");
        
        
            self.output += "<div>............</div>";
            
            
        });
    }
    
}




var events = [
    {short_name: "AAAAAA", full_name: "aaaaaaaaaaaaa", type: "medicine"}, 
    {short_name: "BBBBBB", full_name: "bbbbbbbbbbbbb", type: "diagnosis"},
    {short_name: "CCCCCC", full_name: "ccccccccccccc", type: "medicine"}
    ];

var groups = [{short_name: "AAABBB", full_name: "abababababab", type: "group", events: ["AAAAAA","BBBBBB"]}];

var rels = [["AAAAAA","BBBBBB"],["AAAAAA","CCCCCC"]];



var newIre = new Irebifap(events, groups, rels);
newIre.buildOutput();
newIre.buildTables();
console.log(newIre);


//document.getElementById("output").innerHTML = output;





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


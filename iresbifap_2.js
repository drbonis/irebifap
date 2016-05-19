
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
    
    this.age_groups = {};
    
    this.age_groups.full = [
        {min: 0, max: 0, capt: "<1"},
        {min: 1, max: 1, capt: "1 a <2"},
        {min: 2, max: 3, capt: "2 a <4"},
        {min: 4, max: 4, capt: "4 a <5"},
        {min: 5, max: 5, capt: "5 a <6"},
        {min: 6, max: 7, capt: "6 a <8"},
        {min: 8, max: 9, capt: "8 a <10"},
        {min: 10, max: 11, capt: "10 a <12"},
        {min: 12, max: 13, capt: "12 a <14"},
        {min: 14, max: 14, capt: "14 a <15"},
        {min: 15, max: 15, capt: "15 a <16"},
        {min: 16, max: 17, capt: "16 a <18"},
        {min: 18, max: 19, capt: "18 a <20"},
        {min: 20, max: 24, capt: "20 a <15"},
        {min: 25, max: 29, capt: "25 a <30"},
        {min: 30, max: 34, capt: "30 a <35"},
        {min: 35, max: 39, capt: "35 a <40"},
        {min: 40, max: 44, capt: "40 a <45"},
        {min: 45, max: 49, capt: "45 a <50"},
        {min: 50, max: 54, capt: "50 a <55"},
        {min: 55, max: 59, capt: "55 a <59"},
        {min: 60, max: 64, capt: "60 a <65"},
        {min: 65, max: 69, capt: "65 a <70"},
        {min: 70, max: 74, capt: "70 a <75"},
        {min: 75, max: 79, capt: "75 a <79"},
        {min: 80, max: 84, capt: "80 a <85"},
        {min: 85, max: 89, capt: "85 a <90"},
        {min: 90, max: 94, capt: "90 a <95"},
        {min: 95, max: 99, capt: "95 a <100"},
        {min: 100, max: 104, capt: "100 a <105"},
        {min: 105, max: 109, capt: "105 a <110 años"},
        {min: 0, max: 109, capt: "Total"},
        ];
        
    this.age_groups.pedi = [
        {min: 0, max: 1, capt: "<2"},
        {min: 2, max: 4, capt: "2 a 5"},
        {min: 5, max: 9, capt: "5 a 10"},
        {min: 10, max: 14, capt: "10 a 15"},
        {min: 15, max: 17, capt: "15 a 18"},
        {min: 0, max: 17, capt: "Total"}
        ];
        
    this.age_groups.medfam =  [  
        
        {min: 18, max: 24, capt: "18 a 25"},
        {min: 25, max: 44, capt: "25 a 45"},
        {min: 45, max: 64, capt: "45 a 65"},
        {min: 65, max: 84, capt: "65 a 85"},
        {min: 85, max: 109, capt: "85+"},
        {min: 18, max: 109, capt: "Total"}
        ];

    this.age_groups.oms = [
        {min: 0, max: 1, capt: "0 a 2"},
        {min: 2, max: 13, capt: "2 a 14"},
        {min: 14, max: 24, capt: "14 a 25"},
        {min: 25, max: 44, capt: "25 a 45"},
        {min: 45, max: 64, capt: "45 a 65"},
        {min: 65, max: 74, capt: "65 a 75"},
        {min: 75, max: 109, capt: "75+"},
        {min: 0, max: 109, capt: "Total"}
        ];
        
    this.age_groups.global = [
        {min: 0, max: 1, capt: "0 a 109"}
        ]
        
    this.sex = [{c: "Hombre", v: 0}, {c: "Mujer", v: 1}];
         

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
        self.events_index.push(group.short_name);
        var cu="";
        var pa= "";
        group.events.forEach(function(eventGroup,index){
            
            eventGroupFullName = self.events[self.events_index.indexOf(eventGroup)].full_name;
            cu += "con al menos un día de "+eventGroupFullName+" entre el 01/01/20XX - 31/12/20XX ";
            pa += "con al menos un día de "+eventGroupFullName+" anterior al 01/01/20XX ";
            if(index < group.events.length - 1) { cu+=" OR "; pa+= " OR "}
        });
        var cupa = "( " + cu + " ) y ( " + pa + " )";
        self.events.push({
            short_name: group.short_name, 
            full_name: group.full_name, 
            type: group.type, 
            events: group.events, 
            cu: cu, 
            pa: pa, 
            cupa: cupa,
            rels: {}});

    }); 
    
    //code for variables of event's interaction
    
    this.rels.forEach(function(relation){
    
        var a = self.events[self.events_index.indexOf(relation[0])];
        var b = self.events[self.events_index.indexOf(relation[1])];
        

        a.rels[b.short_name] ={
                event: b.short_name, 
                cu: "con al menos un día de "+a.full_name+" entre el 01/01/20XX - 31/12/20XX y al menos un día de "+b.full_name+" entre el 01/01/20XX - 31/12/20XX", 
                ev: "con al menos un día en el que exista un curso de "+a.full_name+" y un curso de "+b.full_name+" simultáneamente"  };
        
    
    
    });
    
    this.buildTables = function () {
        
        self.tablaEventNewNumPac = function(event,age_groups){
            // crea tabla con número pacientes que tienen 
            // el evento en el ultimo año
            
            var t = {
                short_name: event.short_name+"_20XX",
                title: "Pacientes incidentes de "+event.full_name+" en 20XX",
                vars: [event.cupa,event.cu],
                foot: "Número total de pacientes con un primer "+event.full_name+" en 20XX"

            }
            if(event.events.length==0){
                // evento es unico
                t.cells = [
                               
                               ["Edad","Hombres","Mujeres","Ambos"]
                           ]
            } else {
                // evento es compuesto por otros eventos
                t.cells = [
                               ["Edad","Evento","Hombres","Mujeres","Ambos"]
                           ]
            };
            age_groups.forEach(function(a){
                if(event.events.length==0){
                    t.cells.push([a.capt,"","",""]);
                } else {
                    t.cells.push([a.capt,"Nuevos casos de "+event.full_name,"","",""]);
                    event.events.forEach(function(e){
                        var full_event = self.events[self.events_index.indexOf(e)];
                        t.cells.push(["","Nuevos casos de "+full_event.full_name,"","",""]);
                    });
                }
            });
            return t;
        }
        
        
        self.tablaEventLastYearNumPac = function(event,age_groups){
            // crea tabla con número pacientes que tienen 
            // el evento en el ultimo año
            
            var t = {
                short_name: event.short_name+"_20XX",
                title: "Pacientes con "+event.full_name+" en 20XX",
                vars: [event.cu],
                foot: "Número total de pacientes con un "+event.full_name+" en 20XX"

            }
            if(event.events.length==0){
                // evento es unico
                t.cells = [
                               
                               ["Edad","Hombres","Mujeres","Ambos"]
                           ]
            } else {
                // evento es compuesto por otros eventos
                t.cells = [
                               ["Edad","Evento","Hombres","Mujeres","Ambos"]
                           ]
            };
            age_groups.forEach(function(a){
                if(event.events.length==0){
                    t.cells.push([a.capt,"","",""]);
                } else {
                    t.cells.push([a.capt,event.full_name,"","",""]);
                    event.events.forEach(function(e){
                        var full_event = self.events[self.events_index.indexOf(e)];
                        t.cells.push(["",full_event.full_name,"","",""]);
                    });
                }
            });
            return t;
        }
        
        self.tableAllEventsLastYearNumPac = function(e){
            
            var t = {
                short_name: "ALLEVENTS_20XX",
                title: "Pacientes con evento en 20XX",
                vars: [],
                foot: "Número total de pacientes con cada uno de los eventos presentes en 20XX"
            }
            
            t.cells = [
                
                ["Evento","Hombres","Mujeres","Ambos"]
            ]
            
            m = e.map(function(obj,index){
                return obj.short_name;
            });
            
            var n = m.slice(0); //clone m array
            e.forEach(function(ev){
                ev.events.forEach(function(sev){
                    i = m.indexOf(sev);
                    if(i >-1) {
                        m.splice(i,1);
                    }
                })
            });

            // m contiene la lista de events que no son subevents de nadie
            m.forEach(function(sn,i){
                thisEvent = e[n.indexOf(sn)];
                t.cells.push([thisEvent.full_name,"","",""]);
                t.vars.push(thisEvent.cu);
                
                thisEvent.events.forEach(function(subEventShortName){
                    subEvent = e[n.indexOf(subEventShortName)];
                    t.cells.push([subEvent.full_name,"","",""]);
                    t.vars.push(subEvent.cu);
                    
                })
                
            })

            return t;

        }
        
        self.tablaContingenciaLastYear = function(a,b) {
            var t = {
               short_name: a.short_name+"_"+b.short_name+"_2014",
               title: "Paciente con "+a.full_name+" y "+b.full_name+"  en 20XX, tabla de contingencia",
               vars: [a.cu, b.cu, a.rels[b.short_name]['cu']],
               cells: [
                   //["Tabla de contingencia entre "+a.full_name+" y "+b.full_name+"  en 20XX","","",""]
                   ["","Con "+a.short_name,"Sin "+a.short_name,"Total"],
                   ["Con "+b.short_name,"","",""],
                   ["Sin "+b.short_name,"","",""],
                   ["Total"+"","","",""]
               ],
               foot: "Tabla de contingencia de pacientes con al menos un día de "+a.full_name+" y "+b.full_name+" en 20XX"
            }
            return t;
        }
        
        self.tables.push(self.tableAllEventsLastYearNumPac(self.events));
        
        // tablas sobre eventos individuales (o grupos)
        self.events.forEach(function(event,index){
                self.tables.push(self.tablaEventLastYearNumPac(event,self.age_groups.pedi));
                self.tables.push(self.tablaEventLastYearNumPac(event,self.age_groups.medfam));
                self.tables.push(self.tablaEventLastYearNumPac(event,self.age_groups.oms));
                self.tables.push(self.tablaEventLastYearNumPac(event,self.age_groups.global));
                
                self.tables.push(self.tablaEventNewNumPac(event,self.age_groups.pedi));
                self.tables.push(self.tablaEventNewNumPac(event,self.age_groups.medfam));
                self.tables.push(self.tablaEventNewNumPac(event,self.age_groups.oms));
                self.tables.push(self.tablaEventNewNumPac(event,self.age_groups.global));
        });
        
        // tablas sobre relaciones entre eventos
        
        self.rels.forEach(function(rel){
            
            var a = self.events[self.events_index.indexOf(rel[0])];
            var b = self.events[self.events_index.indexOf(rel[1])];
            self.tables.push(self.tablaContingenciaLastYear(a,b));
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
    {short_name: "OMEPRA", full_name: "Omeprazol", type: "medicine"}, 
    {short_name: "ESOMEPRA", full_name: "Esomeprazol", type: "medicine"},
    {short_name: "ULCERPEPT", full_name: "Úlcera Péptica", type: "diagnosis"}
    ];

var groups = [{short_name: "IBP", full_name: "Inhibidores de la bomba de protones", type: "group", events: ["OMEPRA","ESOMEPRA"]}];

var rels = [["OMEPRA","ULCERPEPT"],["ESOMEPRA","ULCERPEPT"],["IBP","ULCERPEPT"]];



var newIre = new Irebifap(events, groups, rels);
newIre.buildOutput();
newIre.buildTables();






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

$("#seeOutput").click(function(e){
    set_num_cols = 1;
    e.preventDefault();
    output = "<div class=\"container\">";

    
    newIre.tables.forEach(function(table,index){

        if(index%set_num_cols==set_num_cols){
            output += "<div class=\"row\">\n";
        } 
        
        output += "<div class=\"col-md-"+(12/set_num_cols).toString()+"\">\n";
        output += "<div id=\""+table.shortname+"\" class=\"ireTable\">\n";
        output += "<div class=\"ireTableTitle\">"+table.title+"</div>";
            output += "<table class=\"table table-bordered\">";
            table.cells.forEach(function(row,index){
                output += "<tr>";
                row.forEach(function(cell,index){
                   output += "<td>"+cell+"</td>"; 
                });
                output += "</tr>";
            });
            output += "</table>";
        output += "<div class=\"ireTableFoot\">"+table.foot+"</div>"
        output +="</div><!-- ireTable -->";
        output +="</div><!-- col-md- -->";
        if(index%set_num_cols==set_num_cols-1){
            output += "</div><!-- row -->\n";
        }
    });


    output += "</div> <!--container-->";
    $("#tables").html(output);
})

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


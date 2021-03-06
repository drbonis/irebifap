$(document).ready(function(){

    var ire = new BIFAP.ire();
    
    $("button").on("click",function(e){
        e.preventDefault();
    });
    
    hideElement = function(dom_element) {
        if(dom_element.hasClass("hidden") === false) {
            dom_element.addClass("hidden");
        }
    };
    
    showElement = function(dom_element) {
        if(dom_element.hasClass("hidden") === true) {
            dom_element.toggleClass("hidden");
        };
    };

    normalizeShortname = function(dom_element) {
        if(dom_element.val().length > 16) {
            dom_element.val(dom_element.val().slice(0,16));
        }
        dom_element.val(dom_element.val().toUpperCase().replace(' ','_'));
    };
    
    tableHtml = function (table) {
        var html = "";
        html = html + "<div class=\"iretable\">"
        html = html + "<h3>"+table.fullname+"</h3>";
        html = html + "<table class=\"table\">";
        table.rows.forEach(function(row){
            html = html + "<tr>";
            row.forEach(function(col){
               html = html + "<td>" + col.content.toString() + "</td>";
            }); 
            html = html + "</tr>";
        });
        var btnText = "";
        switch(table.status){
            case "catalogue":
                btnText = "Seleccionar";
                btnId = table.shortname + "_SELECT";
                btnClass = "btn-tbl-select";
                break;
            case "selected":
                btnText = "Cancelar selección";
                btnId = table.shortname + "_UNSELECT";
                btnClass = "btn-tbl-unselect";
                break;
            case "discarded":
                btnText = "Cancelar descarte";
                btnId = table.shortname + "_UNDISCARD";
                btnClass = "btn-tbl-undiscard";
                break;
            default:
                btnText = "Seleccionar";
                btnId = table.shortname + "_SELECT";
                btnClass = "btn-tbl-select";
                
        }
            
        
        html = html + "</table><button id=\""+btnId+"\"class=\"btn btn-info btn-lg "+btnClass+"\" table-target=\""+table.shortname+"\">"+btnText+"</button>";
        if(table.status==="catalogue") {
            html = html + "<button id=\""+table.shortname+"_DISCARD\" class=\"btn btn-danger btn-lg btn-tbl-discard\" table-target=\""+table.shortname+"\">Descartar</button>";
        }
        html = html + "</div>";
        return html;
    }
    
    
    resetModal = function (modal) {
        modal.modal("hide");
        $.each($(modal).find("input[type=text]"), function(i,e){
            $(e).val("");
        });
        $.each($(modal).find("select"), function(i,e){
            $(e).val($(e).find("option").first().val());
        });
        $.each($(modal).find("input[type=checkbox]"),function(i,e){
            $(e).attr("checked",false);
        })
    };

    reloadGroups = function(select_obj, groups_container,ire,focusGroup) {
        
        grpUpdate = function(grpindex, key , newGrp) {
            myhash = {}
            myhash[key] = newGrp
            return ire.updateGroup(grpindex,myhash);
        };

        
        groups_container.html("");
        select_obj.html("");
        select_obj.val("");
        
        if(ire.getGroups().length>0) {
            $.each(ire.getGroups(),function(i,g){
                //group container generation
                templateGroupHtml = $("#group_template").html();
                
                newGroupHtml = templateGroupHtml.replace("{$nombre_completo_id}","grp_"+g.shortname+"_fullname");
                newGroupHtml = newGroupHtml.replace("{$nombre_completo}",g.fullname);
                newGroupHtml = newGroupHtml.replace("{$nombre_corto_id}","grp_"+g.shortname+"_shortname");
                newGroupHtml = newGroupHtml.replace(/\{\$nombre_corto\}/g,g.shortname);
                newGroupHtml = newGroupHtml.replace("{$heading_id}","grp_"+g.shortname+"_heading");
                
                newGroupHtml = newGroupHtml.replace("{$btn_borrar_id}","grp_"+g.shortname+"_delbtn");
                
                groups_container.append("<div id=\"grp_"+g.shortname+"\" class=\"hidden col-md-12 grp-details\" group-index=\""+i.toString()+"\">" + newGroupHtml + "</div>");
                // generar listado de variables dentro de ese grupo
                // primero las variables que están en el grupo
                g.variables.forEach(function(v){
                    new_checkbox_html = $("#variable_checklist_row_template").html().replace(/\{\$shortname_id\}/g,g.shortname+"_"+v).replace(/\{\$shortname\}/g,v).replace(/\{\$fullname\}/g,ire.getVariables()[ire.getVariableByShortname(v)].fullname);
                    $("#lista_grupos_con_checklist_"+g.shortname).append(new_checkbox_html);
                    $("#variable_checkbox_"+g.shortname+"_"+v).prop("checked",true);
                });
                //luego el resto de variables
                ire.getVariables().forEach(function (v,i) {
                    
                    if(g.variables.indexOf(v.shortname) == -1) {
                        new_checkbox_html = $("#variable_checklist_row_template").html().replace(/\{\$shortname_id\}/g,g.shortname+"_"+v.shortname).replace(/\{\$shortname\}/g,v.shortname).replace(/\{\$fullname\}/g,ire.getVariables()[ire.getVariableByShortname(v.shortname)].fullname);
                        $("#lista_grupos_con_checklist_"+g.shortname).append(new_checkbox_html);
                        $("#variable_checkbox_"+g.shortname+"_"+v.shortname).prop("checked",false);  
                        $("#variable_checkbox_"+g.shortname+"_"+v.shortname).on("click",function(){
                            if($(this).prop("checked")){
                                ire.addVariableToGroup(ire.getGroupByShortname(g.shortname),v.shortname);
                                
                            } else {
                                ire.removeVariableFromGroup(ire.getGroupByShortname(g.shortname),v.shortname);
                            };
                        });
                    };
                });
                
                // eventos para detalles de grupo
                
                $("#grp_"+g.shortname+"_shortname").on("input",function(e){
                    // chequear que nombre corto cumple requisitos
                    normalizeShortname($(this));

                    var grpPrev = ire.getGroups()[i];
                    $("#grp_"+grpPrev.shortname).attr("id","grp_"+$(this).val());
                    $("#grp_"+grpPrev.shortname+"_fullname").attr("id","grp_"+$(this).val()+"_fullname");
                    $("#grp_"+grpPrev.shortname+"_shortname").attr("id","grp_"+$(this).val()+"_shortname");
                    $("#grp_"+grpPrev.shortname+"_heading").html($(this).val());
                    $("#grp_"+grpPrev.shortname+"_heading").attr("id","grp_"+$(this).val()+"_heading");
                    
                    
                    
                    $(select_obj.find("option")[i]).val($(this).val());
                    $(select_obj.find("option")[i]).html(g.fullname+" ("+$(this).val()+")");
                    console.log(grpUpdate(i,'shortname',$(this).val()));
                    console.log(ire.getGroups());
    
                });
                
                $("#grp_"+g.shortname+"_fullname").on("input",function(e){
                    $(select_obj.find("option")[i]).html($(this).val()+" ("+g.shortname+")");
                    grpUpdate(i,'fullname',$(this).val());
                });
                
                $("#grp_"+g.shortname+"_delbtn").on("click",function(e){
                    ire.delGroup(i);
                    reloadGroups($("#listado_grupos"), $("#variables_group_container"),ire,ire.getGroups()[0]);
                });

               select_obj.append("<option value=\""+g.shortname+"\">"+g.fullname+" ("+g.shortname+")</option>");
            }); // end each group
            $("#grp_"+focusGroup.shortname).toggleClass("hidden");
            select_obj.val(focusGroup.shortname);
            
            
        }
    }

    reloadCovariables = function(select_obj, covariables_container,ire,focusVariable) {
        
        
        varUpdate = function(varindex, key , newVal) {
            myhash = {}
            myhash[key] = newVal
            ire.updateVariable(varindex,myhash);
        };

        covariables_container.html("");
        select_obj.html("");
        select_obj.val("");
        
        if(ire.getVariables().length>0) {
        
            templateVarHtml = $("#covariable_template").html();
            $.each(ire.getVariables(), function(i,v){
                //covariable container generation
                newVarHtml = templateVarHtml.replace("{$nombre_completo_id}","var_"+v.shortname+"_fullname");
                newVarHtml = newVarHtml.replace("{$nombre_completo}",v.fullname);
                newVarHtml = newVarHtml.replace("{$nombre_corto_id}","var_"+v.shortname+"_shortname");
                newVarHtml = newVarHtml.replace(/\{\$nombre_corto\}/g,v.shortname);
                newVarHtml = newVarHtml.replace("{$heading_id}","var_"+v.shortname+"_heading");
                newVarHtml = newVarHtml.replace("{$tipo_id}","var_"+v.shortname+"_type");
                newVarHtml = newVarHtml.replace("{$btn_borrar_id}","var_"+v.shortname+"_delbtn");
                covariables_container.append("<div id=\"var_"+v.shortname+"\" class=\"hidden col-md-12 covariable-details\" covariable-index=\""+i.toString()+"\">" + newVarHtml + "</div>");
                $("#var_"+v.shortname+"_type").val(v.type);
                
                //asigno eventos a los elementos de esa variable
    
                $("#var_"+v.shortname+"_shortname").on("input",function(e){
                    // chequear que nombre corto cumple requisitos
                    normalizeShortname($(this));

                    
                    
                    var varPrev = ire.getVariables()[i];
                    $("#var_"+varPrev.shortname).attr("id","var_"+$(this).val());
                    $("#var_"+varPrev.shortname+"_fullname").attr("id","var_"+$(this).val()+"_fullname");
                    $("#var_"+varPrev.shortname+"_shortname").attr("id","var_"+$(this).val()+"_shortname");
                    $("#var_"+varPrev.shortname+"_heading").html($(this).val());
                    $("#var_"+varPrev.shortname+"_heading").attr("id","var_"+$(this).val()+"_heading");
                    
                    $("#var_"+varPrev.shortname+"_type").attr("id","var_"+$(this).val()+"_type");
                    
                    $(select_obj.find("option")[i]).val($(this).val());
                    $(select_obj.find("option")[i]).html(v.fullname+" ("+$(this).val()+")");
                    
                    varUpdate(i,'shortname',$(this).val());
    
                });
                
                
                $("#var_"+v.shortname+"_fullname").on("input",function(e){
                    $(select_obj.find("option")[i]).html($(this).val()+" ("+v.shortname+")");
                    varUpdate(i,'fullname',$(this).val());
                });
                
                $("#var_"+v.shortname+"_type").on("change",function(e){
                    varUpdate(i,'type',$("#var_"+v.shortname+"_type").val());
                });
                
                $("#var_"+v.shortname+"_delbtn").on("click",function(e){
                    ire.delVariable(i);
                    reloadCovariables($("#listado_variables"), $("#variables_container"),ire,ire.getVariables()[0]);
                });
    
                //covariable select options generation
                select_obj.append("<option value=\""+v.shortname+"\">"+v.fullname+" ("+v.shortname+")</option>");
            });
            
            $("#var_"+focusVariable.shortname).toggleClass("hidden");
            select_obj.val(focusVariable.shortname);
        
        }
        
    };
    
    reloadRelations = function(ire) {
        $("#listado_relaciones_a").html("");
        $("#listado_relaciones_b").html("");
        ire.getVariables().forEach(function(v,index){
           $("#listado_relaciones_a").append("<option value=\""+v.shortname+"\">("+v.shortname+") "+v.fullname+"</option>"); 
           $("#listado_relaciones_b").append("<option value=\""+v.shortname+"\">("+v.shortname+") "+v.fullname+"</option>"); 
        });
        
        ire.getGroups().forEach(function(v,index){
           $("#listado_relaciones_a").append("<option value=\""+v.shortname+"\">("+v.shortname+") "+v.fullname+"</option>"); 
           $("#listado_relaciones_b").append("<option value=\""+v.shortname+"\">("+v.shortname+") "+v.fullname+"</option>"); 
        });
        
        $("#variables_relaciones_container").html("");
        ire.getRelations().forEach(function(r,i){
            var html = 
                    "<div class=\"row\">"+
                        "<div class=\"col-md-2\"><button id=\"btndel_"+r.vara+"_"+r.varb+"\" class=\"btn btn-default\">Borrar</button></div>"+
                        "<div class=\"col-md-2\">"+r.vara+"</div>"+
                        "<div class=\"col-md-3\"> relacionado con </div>"+
                        "<div class=\"col-md-5\">"+r.varb+"</div>"+
                    "</div>";
            $("#variables_relaciones_container").append(html);
            $("#btndel_"+r.vara+"_"+r.varb).on("click",function(e){
                ire.removeRelation(r.vara,r.varb);
                self.reloadRelations(ire);
            });
               
        });
        
    };
    
    reloadTables = function(ire) {
        $("#tablas_catalogo_container").html("");
        $("#tablas_seleccion_container").html("");
        $("#tablas_descartadas_container").html("");
      ire.getTables().forEach(function(t,i){
          switch(t.status){
            case "catalogue":
                $("#tablas_catalogo_container").append(self.tableHtml(t));
                break;
            case "selected":
                console.log("selected",t);
                $("#tablas_seleccion_container").append(self.tableHtml(t));
                break;
            case "discarded":
                $("#tablas_descartadas_container").append(self.tableHtml(t));
                break;
          }
          
      });
      $(".btn-tbl-select").on("click", function(e){
          console.log(ire.setStatusTable($(this).attr('table-target'),'selected'));
          self.reloadTables(ire);
      });
      $(".btn-tbl-discard").on("click", function(e){
          console.log(ire.setStatusTable($(this).attr('table-target'),'discarded'));
          self.reloadTables(ire);
      });
      $(".btn-tbl-unselect").on("click", function(e){
          console.log(ire.setStatusTable($(this).attr('table-target'),'catalogue'));
          self.reloadTables(ire);
      });
      $(".btn-tbl-undiscard").on("click", function(e){
          console.log(ire.setStatusTable($(this).attr('table-target'),'catalogue'));
          self.reloadTables(ire);
      });
    };
    
    showCovariableDetails = function(covariables_container,focusVariable) {
        $.each(covariables_container.find(".covariable-details"),function(){
            if($(this).hasClass("hidden")==false) {$(this).addClass("hidden")};
        });
        focusVariable.toggleClass("hidden");
    };
    
    showGroupDetails = function(group_container,focusGroup) {
        $.each(group_container.find(".grp-details"),function(g){
            if($(this).hasClass("hidden")==false) {$(this).addClass("hidden")};
        });
        focusGroup.toggleClass("hidden");
    };
    
    // eventos ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
    
    $("#btn_nueva_variable").on("click",function(e){
        var newVariable = {'shortname':$("#new_variable_shortname").val(),
                      'fullname': $("#new_variable_fullname").val(),
                      'type': $("#new_variable_type").val()
                      }
        ire.newVariable(newVariable);
        reloadCovariables($("#listado_variables"), $("#variables_container"),ire,newVariable);
        resetModal($("#"+$(this).attr("modal-ref")));
    });
    
    
    $("#btn_nuevo_grupo").on("click",function(e){

        newGroupVariables = [];
        $.each($("#lista_grupos_con_checklist .variable-de-grupo"), function(i,e){
            if($(e).prop('checked')) {
                newGroupVariables.push($(e).val());
                console.log($(e).val());
            }
        });
        console.log(newGroupVariables);
        
        var newGroup = {
                        'shortname': $("#new_group_shortname").val(),
                        'fullname': $("#new_group_fullname").val(),
                        'variables': newGroupVariables
        }

        ire.newGroup(newGroup);
        reloadGroups($("#listado_grupos"), $("#variables_group_container"),ire,newGroup);

        resetModal($("#"+$(this).attr("modal-ref")));
    });
    
    $("#btn_nueva_relacion").on("click", function(e){
        ire.newRelation({'vara': $("#listado_relaciones_a").val(),'varb': $("#listado_relaciones_b").val()});
        self.reloadRelations(ire);
    });
    
    $("#listado_variables").on("change", function(e){
        showCovariableDetails($("#variables_container"),$("#var_"+$(this).val()));
    });
    
    $("#listado_grupos").on("change", function(e){
        showGroupDetails($("#variables_group_container"),$("#grp_"+$(this).val()));
    });
    

    
    $("#btn_nuevo_grupo_launcher").on("click", function(e){
        e.preventDefault();
        $("#modal_nuevo_grupo").modal('show');
        $("#lista_grupos_con_checklist").html("");
        var variables = ire.getVariables();
        variables.forEach(function(v){
            new_checkbox_html = $("#variable_checklist_row_template").html().replace(/\{\$shortname_id\}/g,v.shortname).replace(/\{\$shortname\}/g,v.shortname).replace(/\{\$fullname\}/g,v.fullname);
            $("#lista_grupos_con_checklist").append(new_checkbox_html);
        });
    });
    
    $("#new_variable_shortname").on("input",function(e){
        normalizeShortname($(this));
    });
    
    $("#new_group_shortname").on("input", function(e){
        normalizeShortname($(this));
    });

    
    
    $("#secTablas").on("click",function(){
        
        $.each($(".section"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });
        
        $("#pantalla_tablas").toggleClass("hidden");
        
        $("#subsecTablasCatalogo").on("click",function(e){
            self.showElement($("#tablas_catalogo_container"));
            self.hideElement($("#pantalla_tablas_seleccion"));
            self.showElement($("#pantalla_tablas_catalogo"));
            //self.showElement($("#tablas_selector"));
            self.reloadTables(ire);
            
            $("#subsecTablasCatalogo").addClass("active");
            
            
        });
        
        $("#subsecTablasSeleccion").on("click",function(e){
            self.showElement($("#pantalla_tablas_seleccion"));
            self.showElement($("#tablas_seleccion_container"));
            self.hideElement($("#pantalla_tablas_catalogo"));
            self.hideElement($("#pantalla_tablas_descartadas"));
        });
        
        $("#subsecTablasDescartadas").on("click",function(e){
            self.showElement($("#pantalla_tablas_descartadas"));
            self.showElement($("#tablas_descartadas_container"));
            self.hideElement($("#pantalla_tablas_catalogo"));
            self.hideElement($("#pantalla_tablas_seleccion"));
        });
        
        
        $("#subsecTablasCatalogo").click();
        $("#subsecTablasCatalogo").addClass("active");
    })
    
    
    
    
    
    
    
    
    
    
    $("#secVariables").on("click",function(){
        
        $.each($(".section"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });

        $("#pantalla_variables").toggleClass("hidden");
        $("#subsecVariablesVariables").click();
    });
    
    $("#subsecVariablesVariables").on("click",function(){
        reloadCovariables($("#listado_variables"), $("#variables_container"),ire,ire.getVariables()[0]);
        //muestra subsect variables_variables
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });

        $("#var_selector").toggleClass("hidden");
        $("#variables_container").toggleClass("hidden");

    });

    $("#subsecVariablesGrupos").on("click", function(){
        reloadGroups($("#listado_grupos"), $("#variables_group_container"),ire,ire.getGroups()[0]);

        //muestra subsect variables_grupos
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });

        $("#group_selector").toggleClass("hidden");
        $("#variables_group_container").toggleClass("hidden");

    });
    
    $("#subsecVariablesRelaciones").on("click", function(){

        self.reloadRelations(ire);
        //muestra subsect variables_grupos
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });
        
        $("#relation_selector").toggleClass("hidden");
        $("#variables_relaciones_container").toggleClass("hidden");
    });
    
    $("#subsecVariablesResumen").on("click",function(){
        
        genVariablesHtml = function(ire) {
            var html = "";
            html = html +
                "<h2>Variables</h2>"+
                "<table class=\"table table-striped table-condensed\">"+
                "<theader>"+
                    "<tr><th>Lista de variables</th></tr>"+
                    "<tr><th>Nombre corto</th><th>Nombre completo</th><th>Tipo</th></tr>"+
                "</theader>"+
                "<tbody>";
            ire.getVariables().forEach(function(v,i){
                html = html + 
                    "<tr><td>"+v.shortname+"</td><td>"+v.fullname+"</td><td>"+v.type+"</td></tr>"
            });
            html = html +
            "</tbody>"+
            "</table>";
            return html;
        };
        genGroupsHtml = function(ire) {
          var html = "";
          html = html +
              "<h2>Grupos</h2>"+
              "<table class=\"table table-striped table-condensed\">"+
              "<theader>"+
                  "<tr><th>Lista de variables agrupadas</th></tr>"+
                  "<tr><th>Nombre corto</th><th>Nombre completo</th></tr>"+
              "</theader>"+
              "<tbody>";
          ire.getGroups().forEach(function(g,i){
              html = html + 
                  "<tr class=\"info\"><td>"+g.shortname+"</td><td>"+g.fullname+"</td></tr>";
              g.variables.forEach(function(shortname,i){
                  v = ire.getVariables()[ire.getVariableByShortname(shortname)];
                  html = html + 
                    "<tr><td></td><td><em>("+v.shortname+") "+g.fullname+"</em></td></tr>";
              });
          });
          html = html +
          "</tbody>"+
          "</table>";
          return html;  
        };
        genRelationsHtml = function(ire) {
            var html = "";
              html = html +
                  "<h2>Relaciones</h2>"+
                  "<table class=\"table table-striped table-condensed\" style=\"width: 300px\">"+
                  "<theader>"+
                      "<tr><th colspan=\"3\">Relaciones a analizar</th></tr>"+
                  "</theader>"+
                  "<tbody>";
              ire.getRelations().forEach(function(r,i){
                  html = html + 
                      "<tr><td style=\"width: 100px\">"+r.vara+"</td><td style=\"width: 100px\"><---></td><td style=\"width: 100px\">"+r.varb+"</td></tr>";
              });
              html = html +
              "</tbody>"+
              "</table>";
              return html;  
        };
        
        genResumenTextareaHtml = function(ire) {

            var html = "<h3>Texto plano para copiar <button class=\"btn btn-default btn-lg\"id=\"resumen_copy\"><span class=\"glyphicon glyphicon-copy\" aria-hidden=\"true\"></span></button></h3>" + 
                        "<textarea class=\"form-control\" id=\"resumen_textarea\">"
            
            var t = "";
            
            t = t + "Lista de variables:\n";
            ire.getVariables().forEach(function(v){
                t = t + v.shortname + "\t" + v.fullname + "\t" + v.type +"\n";
            });
            t = t + "\nLista de grupos:\n";
            ire.getGroups().forEach(function(g){
                t = t + g.shortname + "\t" + g.fullname + "\n"  
                g.variables.forEach(function(shortname){
                    t = t + g.shortname + "\t" + shortname + "\n";
                });
                t = t + "\n";
            });
            t = t + "\nLista de relaciones:\n";
            ire.getRelations().forEach(function(r){
                t = t + r.vara + "\t" + r.varb +"\n";
            });
            //html = html + t + "</textarea>";
            html = html + t + "</textarea>";
            
            return html;
            
        }
        
        
        c = $("#variables_resumen_container");
        c.html("");
        c.append(genVariablesHtml(ire));    
        c.append(genGroupsHtml(ire));
        c.append(genRelationsHtml(ire));
        c.append(genResumenTextareaHtml(ire));
        

        // muestra subsect variables_resumen
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });
        
        $("#variables_resumen_container").toggleClass("hidden");
        //$("#resumen_textarea").focus().select();
        $("#resumen_copy").on("click",function(e){
            $("#resumen_textarea").focus().select();
            document.execCommand("copy");
            alert("Resumen copiado al portapapeles, listo para pegar!");
        });

    });
    
    $("#testbtn").on("click",function(e){
        e.preventDefault();
        console.log(ire.getDataset());
        
    });

    reloadCovariables($("#listado_variables"), $("#variables_container"),ire,ire.getVariables()[0]);  
    reloadGroups($("#listado_grupos"), $("#variables_group_container"),ire,ire.getGroups()[0]);
    reloadRelations(ire);
    reloadTables(ire);
    $("#secVariables").click();
    
});
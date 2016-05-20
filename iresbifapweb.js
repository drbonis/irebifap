$(document).ready(function(){

    var ire = new BIFAP.ire();
    
    $("button").on("click",function(e){
        e.preventDefault();
    });
    
    

    
    
    
    resetModal = function (modal) {
        modal.modal("hide");
        $.each($(modal).find("input"), function(i,e){
            $(e).val("");
        });
        $.each($(modal).find("select"), function(i,e){
            $(e).val($(e).find("option").first().val());
        });
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
    
                $("#var_"+v.shortname+"_shortname").on("keyup",function(e){
                    // chequear que nombre corto cumple requisitos
                    
                    $(this).val($(this).val().toUpperCase().replace(' ','_'));
                    
                    
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
                
                
                $("#var_"+v.shortname+"_fullname").on("keyup",function(e){
                    $(select_obj.find("option")[i]).html($(this).val()+" ("+v.shortname+")");
                    varUpdate(i,'fullname',$(this).val());
                });
                
                $("#var_"+v.shortname+"_type").on("change",function(e){
                    varUpdate(i,'type',$("#var_"+v.shortname+"_type").val());
                });
                
                $("#var_"+v.shortname+"_delbtn").on("click",function(e){
                    console.log("borrar variable"); 
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
    
    showCovariableDetails = function(covariables_container,focusVariable) {
        $.each(covariables_container.find(".covariable-details"),function(){
            if($(this).hasClass("hidden")==false) {$(this).addClass("hidden")};
        });
        focusVariable.toggleClass("hidden");
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
    
    $("#listado_variables").on("change", function(e){
        console.log(e);
        showCovariableDetails($("#variables_container"),$("#var_"+$(this).val()));
    });
    
    $("#testbtn").on("click",function(e){
        e.preventDefault();
        reloadCovariables($("#listado_variables"), $("#variables_container"),ire,ire.getVariables()[0]);
    });

    $("#subsecVariablesResumen").on("click",function(){
        $("#variables_resumen_container").html("");
        ire.getVariables().forEach(function(variable,index){
            $("#variables_resumen_container").append("<div><strong>"+variable.shortname+"</strong> <em>"+variable.fullname+"</em> "+variable.type+"</div>");
        });
        
        ire.getGroups().forEach(function(group,index){
            $("#variables_resumen_container").append("<div><strong>"+group.shortname+"</strong> <em>"+group.fullname+"</em> Compuesto por: ");
            group.variables.forEach(function(variable,index){
                $("#variables_resumen_container").append(variable+" ");
            });
            $("#variables_resumen_container").append("</div>");
        });
        
        
        // muestra subsect variables_resumen
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });
        
        $("#variables_resumen_container").toggleClass("hidden");

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
        //muestra subsect variables_grupos
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });

            //$("#var_selector").toggleClass("hidden");
            $("#variables_groups_container").toggleClass("hidden");
    });

    reloadCovariables($("#listado_variables"), $("#variables_container"),ire,ire.getVariables()[0]);  
    
});
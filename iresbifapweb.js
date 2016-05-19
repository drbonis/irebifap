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
        
        templateVarHtml = $("#covariable_template").html();
        $.each(ire.getVariables(), function(i,v){
            //covariable container generation
            newVarHtml = templateVarHtml.replace("{$nombre_completo_id}","var_"+v.shortname+"_fullname");
            newVarHtml = newVarHtml.replace("{$nombre_completo}",v.fullname);
            newVarHtml = newVarHtml.replace("{$nombre_corto_id}","var_"+v.shortname+"_shortname");
            newVarHtml = newVarHtml.replace("{$nombre_corto}",v.shortname);
            newVarHtml = newVarHtml.replace("{$tipo_id}","var_"+v.shortname+"_type");
            covariables_container.append("<div id=\"var_"+v.shortname+"\" class=\"hidden covariable-details\" covariable-index=\""+i.toString()+"\">" + newVarHtml + "</div>");
            $("#var_"+v.shortname+"_type").val(v.type);

            $("#var_"+v.shortname+"_shortname").on("keyup",function(e){
                // chequear que nombre corto cumple requisitos
                
                $(this).val($(this).val().replace(' ','_'));
                
                var varPrev = ire.getVariables()[i];
                $("#var_"+varPrev.shortname).attr("id","var_"+$(this).val());
                $("#var_"+varPrev.shortname+"_fullname").attr("id","var_"+$(this).val()+"_fullname");
                $("#var_"+varPrev.shortname+"_shortname").attr("id","var_"+$(this).val()+"_shortname");
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
            

            

            //covariable select options generation
            select_obj.append("<option value=\""+v.shortname+"\">"+v.fullname+" ("+v.shortname+")</option>");
        });
        $("#var_"+focusVariable.shortname).toggleClass("hidden");
        select_obj.val(focusVariable.shortname);
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
        showCovariableDetails($("#covariables_container"),$("#var_"+$(this).val()));
    });
    
    $("#testbtn").on("click",function(e){
        e.preventDefault();
        reloadCovariables($("#listado_variables"), $("#variables_container"),ire,ire.getVariables()[0]);
        
    });

    $("#subsecVariablesResumen").on("click",function(){
        $("#variables_resumen_container").html("");
        ire.variables.forEach(function(variable,index){
            $("#variables_resumen_container").append("<div>"+variable.shortname+" "+variable.fullname+" "+variable.type+"</div>");
        });
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });
        
        $("#variables_resumen_container").toggleClass("hidden");

    });
    
    $("#subsecVariablesVariables").on("click",function(){
        $.each($(".subsect"),function(a,b){
            if($(b).hasClass("hidden")==false) {
                $(b).toggleClass("hidden");
            }
        });
        if($("#variables_container").hasClass("hidden")){
            $("#var_selector").toggleClass("hidden");
            $("#variables_container").toggleClass("hidden");
        };
    });

    
    
});
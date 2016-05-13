$(document).ready(function(){
    console.log("document ready");
    
    var ire = new BIFAP.ire();
    
    $("button").on("click",function(e){
        e.preventDefault();
    });
    $("#btn_nueva_variable").on("click",function(e){
        console.log("#btn_nueva_variable click");
        var newVariable = {'shortname':$("#new_variable_shortname").val(),
                      'fullname': $("#new_variable_fullname").val()         
                      }
        ire.newVariable(newVariable);
        $("#new_variable_shortname").val("");
        $("#new_variable_fullname").val("");
        $("#listado_variables").html("");
        

        $.each(ire.getVariables(), function(i,v){
            $("#listado_variables").append("<option value="+v.shortname+">"+v.fullname+" ("+v.shortname+")</option>");
        })
        $("#modal_nueva_variable").modal("hide");
        $("#listado_variables").val(newVariable.shortname);
    });
});
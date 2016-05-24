var BIFAP = BIFAP || {};

BIFAP.ire = function () {
    var self = this;
    self.variables = [];
    self.groups = [];
    
    //for testing
    self.variables = [{'shortname':'VARIABLE_A', 
                     'fullname': 'variable a completa',
                     'type': 'diagnostico'
                     },
                     {'shortname':'VARIABLE_B', 
                     'fullname': 'variable b completa',
                     'type': 'farmaco'
                     },
                     {'shortname':'VARIABLE_C', 
                     'fullname': 'variable c completa',
                     'type': 'farmaco'
                     }
                    ];
                    
    self.groups = [{'shortname':'GROUP_A',
                    'fullname':'Grupo A completo',
                    'variables': ["VARIABLE_A","VARIABLE_B"]
                    },
                    {'shortname':'GROUP_B',
                    'fullname':'Grupo B completo',
                    'variables': ["VARIABLE_B","VARIABLE_C"]
                    }];
    
    self.shortnameExists = function(shortname) {
        if(self.getVariableByShortname(shortname) < 0 && self.getGroupByShortname(shortname) < 0) {
            return false;
        } else {
            return true;
        }
    }
    
    self.newGroup = function(varparams = {'shortname': '', 'fullname': '', 'variables': []}) {
        //pendiente de incluir que todas las variables del grupo existen y 
        //que shortname es único tanto en variables como groups
        if(self.shortnameExists(varparams.shortname) == false) {
            self.groups.push({'shortname': varparams.shortname || '', 
                              'fullname': varparams.fullname || '',
                              'variables': varparams.variables || []});
            return true;
        } else {
            return false;
        }
    }
    

    
    self.newVariable = function(varparams = {'shortname': '', 'fullname': '', 'type': ''}) {
        //pendiente de incluir check de que shortname es único tanto en variables como groups
        if(self.shortnameExists(varparams.shortname) == false) {
            self.variables.push({'shortname': varparams.shortname || '', 
                            'fullname': varparams.fullname || '',
                            'type': varparams.type || ''
                            });
        }
    }
    
    self.getGroups = function () {
        //pendiente de hacer groups privado
        return self.groups;
    }
    
    self.getVariables = function() {
        //pendiente de hacer variables privado
        return self.variables;
    };
    
    self.getElementByShortname = function(array,shortname) {
        //returns index, if not found -1
        var found_index = -1;
        for (i = 0; i < array.length; i++) {
            if (shortname === array[i].shortname) { 
                var found_index = i;
                break;
            } 
        }
        return found_index;
    }
    
    self.getGroupByShortname = function(shortname) {
        //returns index, if not found -1
        var groups = self.getGroups();
        return self.getElementByShortname(groups,shortname);
    }
    
    self.getVariableByShortname = function(shortname) {
        //returns index, if not found -1
        var variables = self.getVariables();
        return self.getElementByShortname(variables,shortname);
    }
    
    self.updateGroup = function(index,updatedGroup = {}) {
        updated_keys = Object.keys(updatedGroup);
        if(updated_keys.indexOf("shortname") >= 0 && self.shortnameExists(updatedGroup.shortname)) {
            // update contiene shortname que ya existe
            return false;
        } else{
            updated_keys.forEach(function(j,i){
                self.groups[index][j] = updatedGroup[j];
            });
            return true;
        }
    }
    
    self.updateVariable = function(index,updatedVariable = {}) {
        updated_keys = Object.keys(updatedVariable);
        if(updated_keys.indexOf("shortname") >= 0 && self.shortnameExists(updatedVariable.shortname)) {
            // update contiene shortname que ya existe
            return false;
        } else{
            updated_keys.forEach(function(j,i){
                //aqui al actualizar shortname hay que actualizar el array de variables
                //de los groups que contienen esa variable
                var oldVar = self.variables[index][j];
                self.variables[index][j] = updatedVariable[j];
                if(j == "shortname") {
                    self.updateGroupVariablesShortname(oldVar,updatedVariable[j]);   
                }
                
            });
            return true;
        }
    }
    
    self.updateGroupVariablesShortname = function (oldShortname,newShortname) {
        self.getGroups().forEach(function(g,i){
           self.removeVariableFromGroup(i, oldShortname);
           self.addVariableToGroup(i, newShortname);
        });
    }
    
    self.delVariable = function(index) {
        self.getGroups().forEach(function(g,i){
            self.removeVariableFromGroup(i, self.variables[index].shortname);
        });
        self.variables.splice(index,1);
    }
    
    self.delGroup = function(index) {
        self.groups.splice(index,1);
    }
    
    self.addVariableToGroup = function(group_index, variable) {
        if(group_index >= 0) {
            var i = self.groups[group_index].variables.indexOf(variable);
            
            if (i < 0 && self.shortnameExists(variable)) {
                self.groups[group_index].variables.push(variable);
                return self.groups[group_index];
            } else {
                return false;
            }
            
        } else {
            return false;
        }
    }
    
    self.removeVariableFromGroup = function(group_index, variable) {
        var i = self.groups[group_index].variables.indexOf(variable);
        if (i >= 0) {
            self.groups[group_index].variables.splice(i,1);
        }
        return self.groups[group_index];
    }
    
    self.removeVariableFromAllGroups = function(variable) {
        self.groups.forEach(function(i){
            i.variables.splice(i.variables.indexOf(variable),1);
        });
        return true;
    }
}
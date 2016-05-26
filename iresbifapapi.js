var BIFAP = BIFAP || {};

BIFAP.ire = function () {
    var self = this;
    self.variables = [];
    self.groups = [];
    
    //for testing
    self.variables = [{'shortname':'HTA', 
                     'fullname': 'Hipertensión arterial',
                     'type': 'diagnostico'
                     },
                     {'shortname':'DM2', 
                     'fullname': 'Diabetes mellitus no insulinodependiente',
                     'type': 'diagnostico'
                     },
                     {'shortname':'IBUPROFENO', 
                     'fullname': 'Ibuprofeno',
                     'type': 'farmaco'
                     },
                     {'shortname':'PARACETAMOL', 
                     'fullname': 'Paracetamol',
                     'type': 'farmaco'
                     }
                    ];
                    
    self.groups = [{'shortname':'RCV',
                    'fullname':'Enfermedad que aumenta el riesgo cardiovascular',
                    'variables': ["HTA","DM2"]
                    },
                    {'shortname':'ANALGESICO',
                    'fullname':'Fármacos analgésicos',
                    'variables': ["IBUPROFENO","PARACETAMOL"]
                    }];
                    
    self.relations = [
                        {
                            'shortname': 'HTA_DM2',
                            'vara': 'HTA',
                            'varb': 'DM2'
                        },
                        {
                            'shortname': 'HTA_IBUPROFENO',
                            'vara': 'HTA',
                            'varb': 'IBUPROFENO'
                        },
                        {
                            'shortname': 'HTA_PARACETAMOL',
                            'vara': 'HTA',
                            'varb': 'PARACETAMOL'
                        },
                        {
                            'shortname': 'RCV_IBUPROFENO',
                            'vara': 'RCV',
                            'varb': 'IBUPROFENO'
                        },
                        {
                            'shortname': 'RCV_ANALGESICO',
                            'vara': 'RCV',
                            'varb': 'ANALGESICO'
                        }
                    ]
    self.getRelations = function() {
        return self.relations;
    }
    
    self.shortnameExists = function(shortname) {
        if(self.getVariableByShortname(shortname) < 0 && self.getGroupByShortname(shortname) < 0) {
            return false;
        } else {
            return true;
        }
    }
    
    self.newGroup = function(varparams) {
        varparams = varparams || {'shortname': '', 'fullname': '', 'variables': []};
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
    

    
    self.newVariable = function(varparams) {
        varparams = varparams || {'shortname': '', 'fullname': '', 'type': ''};
        //pendiente de incluir check de que shortname es único tanto en variables como groups
        if(self.shortnameExists(varparams.shortname) == false) {
            self.variables.push({'shortname': varparams.shortname || '', 
                            'fullname': varparams.fullname || '',
                            'type': varparams.type || ''
                            });
        }
    }
    
    self.newRelation = function(varparams) {
        varparams = varparams || {'vara': '', 'varb': ''};
        if(self.shortnameExists(varparams.vara) && self.shortnameExists(varparams.varb) && self.relationExists(varparams.vara, varparams.varb) == false && varparams.vara != varparams.varb) {
            self.relations.push({
                                    'vara': varparams.vara,
                                    'varb': varparams.varb,
                                    'shortname': varparams.vara + "_" + varparams.varb
                                });
        }
    }
    
    self.relationExists = function(vara,  varb) {
        vara = vara || '';
        varb = varb || '';
        result = false;
        self.getRelations().forEach(function(r,i){
            if(     ((r.vara == vara) && (r.varb == varb)) || 
                    ((r.varb == vara) && (r.vara == varb))    
                ){ 
                    result = true;
                }
        });
        return result;
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
    
    self.updateGroup = function(index,updatedGroup) {
        updatedGroup = updatedGroup || {};
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
    
    self.updateVariable = function(index,updatedVariable) {
        updatedVariable = updatedVariable || {};
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
                    self.updateOverallShortname(oldVar,updatedVariable[j]);   
                }
                
            });
            return true;
        }
    }
    
    self.updateOverallShortname = function (oldShortname,newShortname) {
        self.getGroups().forEach(function(g,i){
           self.removeVariableFromGroup(i, oldShortname);
           self.addVariableToGroup(i, newShortname);
        });
        self.getRelations().forEach(function(r,i){
            if(r.vara == oldShortname) {
                r.vara = newShortname;
            }
            if(r.varb == oldShortname) {
                r.varb = newShortname;
            }
            
        });
    }
    
    self.removeRelation = function(vara,varb) {
        varb = varb || "";
        var array_to_remove = [];
        self.getRelations().forEach(function(r,i){
            
            if(
                (r.vara == vara && r.varb == varb) || 
                (r.vara == varb && r.varb == vara) || 
                (varb == "" && (r.vara == vara || r.varb == vara))
                ) {
                    console.log(vara,varb," removes: ",r.vara, r.varb);
                    array_to_remove.push(i);
            }
        });
        array_to_revomve = array_to_remove.reverse();
        array_to_remove.forEach(function(index){
            console.log(index);
            console.log(self.relations[index]);
           self.relations.splice(index,1); 
        });
        
        return self.relations;
    }
    
    self.delVariable = function(index) {
        self.getGroups().forEach(function(g,i){
            self.removeVariableFromGroup(i, self.variables[index].shortname);
        });
        self.removeRelation(self.variables[index].shortname);
        self.variables.splice(index,1);
    }
    
    self.delGroup = function(index) {
        self.removeRelation(self.groups[index].shortname);
        self.groups.splice(index,1);
        
    }
    
    self.addVariableToGroup = function(group_index, variable) {
        if(group_index >= 0) {
            console.log("Group index: " + group_index.toString());
            console.log(self.groups);
            console.log(self.groups[group_index]);
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
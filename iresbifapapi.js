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
                    
        self.dataset = {};
    
    
    self.summarizeVarDataset = function(varshortname) {
        function add(a,b) { return a+b };
        var sum = self.dataset[varshortname].reduce(add, 0);
        var count = self.dataset[varshortname].length;
        var mean = sum / count;
        return {'shortname': varshortname, 'sum': sum, 'count': count, 'mean': mean}
    }
    
    self.contingencyTabVarDataset = function(vara, varb) {
        var cell_a = 0;
        var cell_b = 0;
        var cell_c = 0;
        var cell_d = 0;
        self.dataset[vara].forEach(function(vara,index){
            if(vara == 0) {
                if(self.dataset[varb][index] == 0) {
                    cell_a = cell_a + 1;   
                } else {
                    cell_b = cell_b + 1;
                }
            } else {
                if(self.dataset[varb][index] == 0) {
                    cell_c = cell_c + 1;
                } else {
                    cell_d = cell_d + 1;
                }
            }
        });
        return [cell_a, cell_b, cell_c, cell_d, eval((cell_a * cell_d) / (cell_b * cell_c))];
    }
    
    self.addRandomVarToDataset = function(shortname, distribution) {
        var distribution = distribution || {'M': {
                                                    0: 0.1,
                                                    10: 0.1,
                                                    20: 0.1,
                                                    30: 0.1,
                                                    40: 0.1,
                                                    50: 0.1,
                                                    60: 0.1,
                                                    70: 0.1,
                                                    80: 0.1,
                                                    90: 0.1,
                                                    100: 0.1
                                                    }, 
                                            'F': {
                                                      0: 0.1,
                                                      10: 0.1,
                                                      20: 0.1,
                                                      30: 0.1,
                                                      40: 0.1,
                                                      50: 0.1,
                                                      60: 0.1,
                                                      70: 0.1,
                                                      80: 0.1,
                                                      90: 0.1,
                                                      100: 0.1
                                                      }
                                            };
                                            
        self.dataset[shortname] = [];                                    
        self.dataset.id.forEach(function(index){
            var age = 2016 - self.dataset.yearnac[index];
            var sex = self.dataset.sex[index];
            var probVarForAgeSex = 0;
            var flag = 0;
            Object.keys(distribution[self.dataset.sex[index]]).forEach(function(key, index){
                if(parseInt(key) > age){
                   if(flag == 0) {
                    probVarForAgeSex = distribution[sex][parseInt(key)];
                   }
                   flag = 1;
                };
            });
            if(Math.random() <= probVarForAgeSex) {
                self.dataset[shortname].push(1);
            } else {
                self.dataset[shortname].push(0);
            };
            
        });
        return self.dataset;
    }
        
    self.generateRandomDatasetBase = function(size) {
        var i = 0;
        self.dataset = {'id': [], 'yearnac': [], 'sex': []};
        var piramide = [
                        {'sex': 'M', 'minage': 0, 'maxage': 9, 'percentage':0.052528185737830156 },
                        {'sex': 'M', 'minage': 10, 'maxage': 19, 'percentage': 0.04891836669848686},
                        {'sex': 'M', 'minage': 20, 'maxage': 29, 'percentage': 0.050074669238069844},
                        {'sex': 'M', 'minage': 30, 'maxage': 39, 'percentage': 0.07762285196426376},
                        {'sex': 'M', 'minage': 40, 'maxage': 49, 'percentage':0.08287801906172335 },
                        {'sex': 'M', 'minage': 50, 'maxage': 59, 'percentage': 0.06934361526208833},
                        {'sex': 'M', 'minage': 60, 'maxage': 69, 'percentage': 0.05265251934423693},
                        {'sex': 'M', 'minage': 70, 'maxage': 79, 'percentage': 0.034999910203506485},
                        {'sex': 'M', 'minage': 80, 'maxage': 89, 'percentage': 0.020573067406773973},
                        {'sex': 'M', 'minage': 90, 'maxage': 99, 'percentage': 0.0032451071272167646},
                        {'sex': 'M', 'minage': 100, 'maxage': 109, 'percentage': 0.00006631125675027872},
                        {'sex': 'F', 'minage': 0, 'maxage': 9, 'percentage': 0.04985363171556892},
                        {'sex': 'F', 'minage': 10, 'maxage': 19, 'percentage': 0.046919358604369084},
                        {'sex': 'F', 'minage': 20, 'maxage': 29, 'percentage': 0.04919328211709739},
                        {'sex': 'F', 'minage': 30, 'maxage': 39, 'percentage': 0.07687823181033876},
                        {'sex': 'F', 'minage': 40, 'maxage': 49, 'percentage': 0.07994650891955478},
                        {'sex': 'F', 'minage': 50, 'maxage': 59, 'percentage': 0.06823980913409933},
                        {'sex': 'F', 'minage': 60, 'maxage': 69, 'percentage': 0.05455896797580744},
                        {'sex': 'F', 'minage': 70, 'maxage': 79, 'percentage': 0.04040980356671672},
                        {'sex': 'F', 'minage': 80, 'maxage': 89, 'percentage': 0.03245936017926143},
                        {'sex': 'F', 'minage': 90, 'maxage': 99, 'percentage': 0.008348310927956964},
                        {'sex': 'F', 'minage': 100, 'maxage': 109, 'percentage': 0.00028596729473557696}
                        ];
        
        getRandomSexYear = function(piramide) {
            var pir = [0];         
            var randomCohort = {};
            var i = 0;
            piramide.forEach(function(p,i){
                pir.push(p.percentage+pir[pir.length - 1]);
            });    
            pir[pir.length - 1] = 1;
            pir.shift();
            var alea = Math.random();
            randomCohort = piramide[pir.length - 1];
            
            for(i = 0; i < pir.length -1; i++) {
                if (alea <= pir[i]) {
                    randomCohort = piramide[i];
                    break;
                }
            }

            yearnac = 2016 - randomCohort.minage + Math.floor(Math.random() * (randomCohort.maxage - randomCohort.minage));
            return {'sex': randomCohort.sex, 'yearnac': yearnac }
        }
        
        for (var i = 0; i < size; i++) {
            self.dataset.id.push(i);
            var sexyear = getRandomSexYear(piramide);
            self.dataset.sex.push(sexyear.sex);
            self.dataset.yearnac.push(sexyear.yearnac);

        }
        return self.dataset;
    }    
        
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
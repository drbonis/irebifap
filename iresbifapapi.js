var BIFAP = BIFAP || {};

BIFAP.ire = function () {
    var self = this;
    self.variables = [];
    self.groups = [];
    
             

    self.addone = function(number) { return number + 1};
    
    
    self.summarizeVarDataset = function(varshortname,sex,agemin,agemax) {
        
        results = {'shortname': varshortname, 'sum': null, 'count': null, 'mean': null};
        
        function add(a,b) { return a+b };
        var patients_index = self.filterVar('','',sex,agemin, agemax,2016);
        var patientsVar = [];
        patients_index.forEach(function(pmindex){
                patientsVar.push(self.dataset[varshortname][pmindex]);
        });
        results.sum = patientsVar.reduce(add, 0);
        results.count = patientsVar.length;
        results.mean = results.sum / results.count;
        return results;
    }
    
    
    
    self.filterVar = function(varshortname, value, sex, agemin, agemax, curryear) {
        // devuelve array con los index de pacientes que cumple las condiciones del filtro
        var varshortname = varshortname || '';
        var value = value || '';
        var sex = sex || '';
        var agemin = agemin || 0;
        var agemax = agemax || 110;
        var curryear = curryear || 2016;
        var result = [];
        
        self.getDataset()['id'].forEach(function(index){
            var isVar = 0;
            var isAge = 0;
            var isSex = 0;
            if (varshortname === '') {
               isVar = 1;
            } else {
                if(self.dataset[varshortname][index] === value) {
                    isVar = 1;
                }
            };
            if (sex === '') {
                isSex = 1;
            } else {
                if(self.dataset['sex'][index] === sex) {
                    isSex = 1;
                }
            };
            if (agemin <= curryear - self.dataset['yearnac'][index] && agemax >= curryear - self.dataset['yearnac'][index]) {
                isAge = 1;
            }
            
            if(isVar == 1 && isAge == 1 && isSex == 1) {
                result.push(index);
            }

        });
        
        return result;
        
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
        return {'a_f_b_f': cell_a, 'a_f_b_t': cell_b, 'a_t_b_f': cell_c, 'a_t_b_t': cell_d, 'odds_ratio': eval((cell_a * cell_d) / (cell_b * cell_c))};
    }
    
    self.getProbVar = function(distribution,age,sex) {
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
        var probVarForAgeSex = 0;
        var flag = 0;
        Object.keys(distribution[sex]).forEach(function(key, index){
            if(parseInt(key) > age){
               if(flag == 0) {
                probVarForAgeSex = distribution[sex][parseInt(key)];
               }
               flag = 1;
            };
        });
        return probVarForAgeSex;
    }
        
    
    
    self.addRandomVarToDataset = function(shortname, distribution) {
        var distribution = distribution || {'M': {
                                                    0: 0.1,
                                                    10: 0.1,
                                                    20: 0.1,
                                                    30: 0.1,
                                                    40: 0.1,
                                                    50: 0.1,
                                                    60: 0.2,
                                                    70: 0.2,
                                                    80: 0.2,
                                                    90: 0.2,
                                                    100: 0.2
                                                    }, 
                                            'F': {
                                                      0: 0.2,
                                                      10: 0.2,
                                                      20: 0.2,
                                                      30: 0.2,
                                                      40: 0.2,
                                                      50: 0.2,
                                                      60: 0.4,
                                                      70: 0.4,
                                                      80: 0.4,
                                                      90: 0.4,
                                                      100: 0.4
                                                      }
                                            };
                                            
        self.dataset[shortname] = [];                                    
        self.dataset.id.forEach(function(index){
            var age = 2016 - self.dataset.yearnac[index];
            var sex = self.dataset.sex[index];

            if(Math.random() <= self.getProbVar(distribution,age,sex)) {
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

            return {'sex': randomCohort.sex, 'yearnac': Math.min(yearnac,2016) }
        }
        
        for (var i = 0; i < size; i++) {
            self.dataset.id.push(i);
            var sexyear = getRandomSexYear(piramide);
            self.dataset.sex.push(sexyear.sex);
            self.dataset.yearnac.push(sexyear.yearnac);

        }
        return self.dataset;
    }    
    
    self.getDataset = function(){
        return self.dataset;
    }
    
    self.getContingencyforCorrelateVars = function (vara,varb,tor,sex,agemin,agemax) {
        var a = 0; // vara && varb
        var b = 0; // vara && !varb
        var c = 0; // a + b, vara
        var d = 0; // !vara && varb
        var e = 0; // !vara && !varb
        var f = 0; // 1 - c, !vara
        var g = 0; // a + d, varb
        var h = 0; // b + e, !varb
        var i = self.summarizeVarDataset(vara,sex,agemin,agemax).count; // a + b + d + e
        a = 0;
        c = self.summarizeVarDataset(vara,sex,agemin,agemax).sum;
        g = self.summarizeVarDataset(varb,sex,agemin,agemax).sum;
        f = i - c;
        h = i - g;
        
        b = c - a;
        d = g - a;
        e = i - a - b - d;
        
        or = (a*e)/(d*b);
        while (tor > or) {
            a = a + 1;
            b = c - a;
            d = g - a;
            e = i - a - b - d;
            or = (a*e)/(d*b);
        }
        
        return {'a_f_b_f': e/i, 'a_f_b_t': d/i, 'a_t_b_f': b/i, 'a_t_b_t': a/i}
    }
    
    self.correlateVars = function(vara,varb,tor) {
        var agegroups = [0,10,20,30,40,50,60,70,80,90,100,110];
        var sex = ['M','F'];
        for(i=0;i<agegroups.length -1;i++) {
            agemin = agegroups[i];
            agemax = agegroups[i+1];
        
            sex.forEach(function(sex){
                
                var probs = self.getContingencyforCorrelateVars(vara,varb,tor,sex,agemin,agemax);
                
                self.filterVar('','',sex,agemin,agemax).forEach(function(index){
                //self.getDataset().id.forEach(function(index){
                    var aleator = Math.random();
                    if(aleator<=probs.a_t_b_t) { // ambas true
                        //console.log(aleator,"a true, b true");
                        self.dataset[vara][index] = 1;
                        self.dataset[varb][index] = 1;
                    } else if (aleator<=probs.a_t_b_t + probs.a_t_b_f) {
                        //console.log(aleator,"a true, b false");
                        self.dataset[vara][index] = 1;
                        self.dataset[varb][index] = 0;
                    } else if (aleator<=probs.a_t_b_t + probs.a_t_b_f + probs.a_f_b_t) {
                       //console.log(aleator,"a false, b true");
                       self.dataset[vara][index] = 0;
                       self.dataset[varb][index] = 1;
                    } else {
                        //console.log(aleator,"a false, b false");
                        self.dataset[vara][index] = 0;
                        self.dataset[varb][index] = 0;
                    }
                });
                
            });
            
        };
        

        return self.contingencyTabVarDataset(vara,varb);
            
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

    self.getTables = function () {
        return self.tables;
    }
    self.getTableByShortname = function (shortname) {
        for (var i = 0; i<self.tables.length; i++) {
            if(self.tables[i].shortname === shortname){
              return i;
            };
        }
        return -1;
    }


    self.addTable = function(tableName,params) {
        var tableName = tableName || '';
        var params = params || {};
        switch(tableName) {
            case "prevalencia":
                params.agegrps = params.agegrps || [0,2, 14,25,45,65,75,110];
                var myVar = self.getVariables()[self.getVariableByShortname(params.varshortname)];
                var newTab = {
                    
                            'shortname': myVar.shortname + "_PREVTAB",
                            'fullname': "Tabla: " + myVar.fullname,
                            'footer': "Pacientes con " + myVar.fullname,
                            'status': "catalogue",
                            'rows': []
                            }
                newTab.rows.push([
                                     {'colspan': 1, 'content': ""},
                                     {'colspan': 1, 'content': "Pacientes con "+ myVar.shortname},
                                     {'colspan': 1, 'content': ""},
                                     {'colspan': 1, 'content': ""},
                                     {'colspan': 1, 'content': "Pacientes totales"},
                                     {'colspan': 1, 'content': ""},
                                     {'colspan': 1, 'content': ""},
                                     {'colspan': 1, 'content': "% con "+ myVar.shortname},
                                     {'colspan': 1, 'content': ""},
                                     {'colspan': 1, 'content': ""}
                                 ],[
                                       {'colspan': 1, 'content': ""},
                                       {'colspan': 1, 'content': "Hombres"},
                                       {'colspan': 1, 'content': "Mujeres"},
                                       {'colspan': 1, 'content': "Ambos"},
                                       {'colspan': 1, 'content': "Hombres"},
                                       {'colspan': 1, 'content': "Mujeres"},
                                       {'colspan': 1, 'content': "Ambos"},
                                       {'colspan': 1, 'content': "Hombres"},
                                       {'colspan': 1, 'content': "Mujeres"},
                                       {'colspan': 1, 'content': "Ambos"}
                                   ]);
                
                for(var i = 0; i < params.agegrps.length - 1; i++) {
                    var agemin = params.agegrps[i];
                    var agemax = params.agegrps[i+1];
                    var summary_male = self.summarizeVarDataset(myVar.shortname,"M",agemin,agemax);
                    var summary_female = self.summarizeVarDataset(myVar.shortname,"F",agemin,agemax);
                    newTab.rows.push([
                        {'colspan': 1, 'content':  agemin.toString() + " a " + agemax.toString()},
                        {'colspan': 1, 'content': summary_male.sum},
                        {'colspan': 1, 'content': summary_female.sum},
                        {'colspan': 1, 'content': summary_male.sum + summary_female.sum},
                        {'colspan': 1, 'content': summary_male.count},
                        {'colspan': 1, 'content': summary_female.count},
                        {'colspan': 1, 'content': summary_male.count + summary_female.count},
                        {'colspan': 1, 'content': parseFloat(Math.round((summary_male.sum / summary_male.count)*100)/100).toFixed(2)},
                        {'colspan': 1, 'content': parseFloat(Math.round((summary_female.sum / summary_female.count)*100)/100).toFixed(2)},
                        {'colspan': 1, 'content': parseFloat(Math.round(((summary_male.sum + summary_female.sum) / (summary_male.count + summary_female.count))*100)/100).toFixed(2)}
                    ]);
                }
                
                var summary_male = self.summarizeVarDataset(myVar.shortname,"M",0,110);
                var summary_female = self.summarizeVarDataset(myVar.shortname,"F",0,110);
                
                newTab.rows.push([
                    
                                     {'colspan': 1, 'content': "Total"},
                                     {'colspan': 1, 'content': summary_male.sum},
                                     {'colspan': 1, 'content': summary_female.sum},
                                     {'colspan': 1, 'content': summary_male.sum + summary_female.sum},
                                     {'colspan': 1, 'content': summary_male.count},
                                     {'colspan': 1, 'content': summary_female.count},
                                     {'colspan': 1, 'content': summary_male.count + summary_female.count},
                                     {'colspan': 1, 'content': parseFloat(Math.round((summary_male.sum / summary_male.count)*100)/100).toFixed(2)},
                                     {'colspan': 1, 'content': parseFloat(Math.round((summary_female.sum / summary_female.count)*100)/100).toFixed(2)},
                                     {'colspan': 1, 'content': parseFloat(Math.round(((summary_male.sum + summary_female.sum) / (summary_male.count + summary_female.count))*100)/100).toFixed(2)}
                                 ]);
                self.tables.push(newTab);
                break;
                
            case "contingencia":
                params.vara = params.vara || '';
                params.varb = params.varb || '';
                var myContTab = self.contingencyTabVarDataset(params.vara, params.varb);
                var newTab = {
                    
                            'shortname': params.vara + "_" + params.varb + "_CONTTAB",
                            'fullname': "Tabla: " + params.vara + "_" + params.varb,
                            'footer': "Tabla de contingencia de pacientes con " + params.vara + " y " + params.varb,
                            'status': "catalogue",
                            'rows': []
                            };
                newTab.rows.push([
                                    {'colspan': 1, 'content': ''},
                                    {'colspan': 1, 'content': params.varb + " SI"},
                                    {'colspan': 1, 'content': params.varb + " NO"},
                                    {'colspan': 1, 'content': ''}
                                ],
                                [
                                    {'colspan': 1, 'content': params.vara + " SI"},
                                    {'colspan': 1, 'content': myContTab.a_t_b_t},
                                    {'colspan': 1, 'content': myContTab.a_t_b_f},
                                    {'colspan': 1, 'content': myContTab.a_t_b_t + myContTab.a_t_b_f}
                                ],
                                [
                                    {'colspan': 1, 'content': params.vara + " NO"},
                                    {'colspan': 1, 'content': myContTab.a_f_b_t},
                                    {'colspan': 1, 'content': myContTab.a_f_b_f},
                                    {'colspan': 1, 'content': myContTab.a_f_b_t + myContTab.a_f_b_f}
                                ],
                                [
                                    {'colspan': 1, 'content': ""},
                                    {'colspan': 1, 'content': myContTab.a_t_b_t+myContTab.a_f_b_t},
                                    {'colspan': 1, 'content': myContTab.a_t_b_f+myContTab.a_f_b_f},
                                    {'colspan': 1, 'content': myContTab.a_t_b_t+myContTab.a_f_b_t+myContTab.a_t_b_f+myContTab.a_f_b_f}
                                ],
                                [
                                    {'colspan': 1, 'content': ""},
                                    {'colspan': 1, 'content': ""},
                                    {'colspan': 1, 'content': "Odds Ratio: "},
                                    {'colspan': 1, 'content': parseFloat(Math.round(myContTab.odds_ratio*100)/100).toFixed(2)}
                                ]
                                
                                
                                
                                );
                console.log(myContTab);
                self.tables.push(newTab);
                break;
            default: 
                return false;
                break;
        }
    }

    
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
                    ];

    self.tables = [];
    self.dataset = {}; 
    
    /* Table data model
       {
       'shortname': 'asdf',
       'fullname': 'asdf',
       'footer': 'asdf',
       'rows': [
                   [
                       {'colspan': 1, 'content': self.addone(0)},
                       {'colspan': 1, 'content': self.addone(1)},
                       {'colspan': 1, 'content': self.addone(3)}
                   ],
                   [
                       {'colspan': 1, 'content': self.addone(0)},
                       {'colspan': 1, 'content': self.addone(1)},
                       {'colspan': 1, 'content': self.addone(3)}
                   ],
                   [
                       {'colspan': 1, 'content': self.addone(0)},
                       {'colspan': 1, 'content': self.addone(1)},
                       {'colspan': 1, 'content': self.addone(3)}
                   ]
               ]
       }
     */
    
    
    self.generateRandomDatasetBase(10000);
    self.variables.forEach(function(variable){
        self.addRandomVarToDataset(variable.shortname);    
    });
    self.correlateVars("HTA","DM2",5);
    self.addTable("prevalencia",{'varshortname':"HTA"});
    self.addTable("prevalencia",{'varshortname':"DM2"});
    self.addTable("prevalencia",{'varshortname':"PARACETAMOL"});
    self.addTable("prevalencia",{'varshortname':"IBUPROFENO"});
    
    self.relations.forEach(function(relation){
        console.log(relation.vara);
        console.log(relation.varb);
        if(self.getVariableByShortname(relation.vara) > -1 && self.getVariableByShortname(relation.varb) > -1) {
            self.addTable("contingencia",{'vara': relation.vara, 'varb': relation.varb});
        }
    });
    
    console.log(self);
    console.log(self.summarizeVarDataset('HTA','',0,110));
    
    
    
    
}
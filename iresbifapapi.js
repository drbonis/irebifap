var BIFAP = BIFAP || {};

BIFAP.ire = function () {
    var self = this;
    self.variables = [];
    
    //for testing
    self.variables = [{'shortname':'VARIABLE_A', 
                     'fullname': 'variable a completa',
                     'type': 'diagnostico'
                     },
                     {'shortname':'VARIABLE_B', 
                     'fullname': 'variable b completa',
                     'type': 'farmaco'
                     }
                    ];
    
    
    self.newVariable = function(varparams = {'shortname': '', 'fullname': ''}) {
        self.variables.push({'shortname': varparams.shortname || '', 
                        'fullname': varparams.fullname || '',
                        'type': varparams.type || ''
                        });
    }
    
    self.getVariables = function() {
        return self.variables;
    };
    
    self.getVariableByShortname = function(shortname) {
        //returns index, if not found -1
        var variables = self.getVariables();
        var found_index = -1;
        for (i = 0; i < variables.length; i++) {
            if (shortname === variables[i].shortname) { 
                var found_index = i;
                break;
            } 
        }
        return found_index;
    }
    
    self.updateVariable = function(index,updatedVariable = {}) {
        updated_keys = Object.keys(updatedVariable);
        updated_keys.forEach(function(j,i){
            self.variables[index][j] = updatedVariable[j];
        });
    }
}
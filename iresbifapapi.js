var BIFAP = BIFAP || {};

BIFAP.ire = function () {
    var self = this;
    var variables = [];
    
    self.newVariable = function(varparams = {'shortname': '', 'fullname': ''}) {
        variables.push({'shortname': varparams.shortname || '', 
                        'fullname': varparams.fullname || ''
                        });
    }
    
    self.getVariables = function() {
        return variables;
    };
}
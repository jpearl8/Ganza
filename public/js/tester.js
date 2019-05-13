
// require(['../../models/Fashion.js'], function(fashion){

// });
//v/ar fashion = require('../../models/Fashion.js');
// define(function (require) {
//     var mongoose = require('mongoose');
// });
// //const mongoose = require('mongoose');
// const Fashion = mongoose.model('Fashion');

//document.getElementById('AA').style.color = "red";

/*var s = document.getElementsByName('ssave');
for (var ss = 0; ss < s.length; ss++){
    s[ss].style.visibility = "hidden";
};
var c = document.getElementsByName('hidden');
for (var cc = 0; cc < c.length; cc++){
    c[cc].style.visibility = "hidden";
};*/


$(document).ready(function () {
    $(document).on("click", ".btn_save", function(e) {
        e.preventDefault();
        console.log("CLACK");
        var tbl_row = $(this).closest('tr');
        var row_id = tbl_row.attr('id');
        console.log("row id " + row_id.toString());
        var arr = {}; 
        arr["_id"] = row_id.toString();
        fashform = document.forms["fash"];
        fashform.elements["_id"].value = row_id.toString();
        tbl_row.find('.row_data').each(function(index, val) 
	    {   
            
            var col_name = $(this).attr('col_name');  
            var col_val  =  $(this).html();
            if (col_name == "assigned" || col_name == "returned"){
                if(col_val == "<value>yes</value>"){
                    col_val= true;
                } else { col_val = false; }
            }
            fashform.elements[col_name].value = col_val.toString();
            
            arr[col_name] = col_val.toString();

        }); 
        console.log(fashform);
        //console.log(arr);
        fashform.action = "/fashion/1"
        fashform.submit();        
       // console.log(arr);
        
        
        
        //const fashion = new Fashion(arr);
        //fashion.save()
         //   .then(() => { res.redirect('fashion'); })
         //   .catch(() => { res.send('Sorry! Something went wrong'); })
        console.log("maybe it worked?");
        	

    });
});



console.log("js ran");

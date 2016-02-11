var prompt = require('prompt');

//
// Start the prompt
//
prompt.start();

//
// Get two properties from the user: username and email
//
function test(){
    prompt.get('r', function (err, result) {
        //
        // Log the results.
        //
        console.log(result);
        if(result.r == "e"){
            process.exit()
        } else {

            test()
        }

    });
}
test();

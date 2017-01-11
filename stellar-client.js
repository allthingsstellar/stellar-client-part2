
jQuery(document).ready( function($){
  var testNetwork = "https://horizon-testnet.stellar.org";
  var liveNetwork = "https://horizon.stellar.org";
  var friendbot = "https://horizon-testnet.stellar.org/friendbot";
  var server = new StellarSdk.Server(testNetwork);
  var keys = false;


  // generate Key Pair
  $('#generateKey').on('click', function() {
    console.log("generateKey");
    keys = StellarSdk.Keypair.random();
      var output = "<p>Account ID:"+keys.accountId()+"</p><p>Secret Key: "+keys.seed()+"</p>";
    $('#generatedKeys').html(output);

  });
  

  // Create Account
  $('#createAccount').on('click', function() {
      
      var resp = $('#createResponse');

      if (keys) {
        resp.html('<p class="text-info">Creating account ... </p>');

         $.get(friendbot, { addr: keys.accountId()})
              .done(function(data){
                console.log("Data: ",data);
                resp.html('<p class="text-success">Account created successfully</p>');
              })
              .fail(function(error) {
                console.log("error", error);
                resp.html('<p class="text-danger">Account creation failed</p>');

              });
      }else{
        alert("Please generate keys");
      }

  });

  // View Account
  $('#viewAccount').on('click', function() {
      
      var resp = $('#viewResponse');
      var accountId = $('#viewAccountId').val();

      if (!StellarSdk.Keypair.isValidPublicKey(accountId)) {
         resp.html('<p class="text-danger">Invalid Account ID </p>');
         return false;
      }else{
        resp.html('<p class="text-info">Finding account on Stellar... </p>');
        // load account
        server.loadAccount(accountId)
              .catch(function(error) {
                resp.html('<p class="text-danger">Account not active </p>');
                return false;
              })
              .then(function(account) {
                console.log("account", account);
                // Get account details
                resp.html(getAccountDetails(account));
              });
      }

  });  

function getAccountDetails(account) {
    var output = "";
    output += "Account ID: "+account.account_id+"\n************\n"
    output += "Sequence No: "+account.sequence+"\n************\n";
    account.balances.forEach(function(balance) {

      var asset = "";
      if (balance.asset_type === 'native') {
        asset = 'Asset Code: XLM';
      }else{
        asset = 'Asset Code: '+balance.asset_code+"\nAsset Issuer: "+balance.asset_issuer;
      }

      output +="Amount: "+balance.balance+"\n"+asset+"\n************\n";
    });

    return output;
    
}

});
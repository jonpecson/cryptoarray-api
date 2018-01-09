/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {




  deposit: function (req, res) {

    var account_number = req.body.account_number;

    // 1. Retrieve account details
    Account.findOne({
      account_number: account_number
    }).exec(function (err, account) {
      if (err) {
        return res.serverError(err);
      }
      if (!account) {
        return res.notFound('Could not find the specified account.');
      }


      if (req.body.amount) {
        // 2. Update account balance
        account.balance += parseFloat(req.body.amount);

        // 3. Save updated account balance
        account.save(function (err) {
          if (err) {
            return res.serverError(err);
          }
          return res.ok();
        }); //</Account.save()>


        // 4. Prepare transaction payload
        var transaction = {
          account: account.id, // account id
          customer: req.body.customer,
          type: 'Credit',
          amount: req.body.amount,
          description: req.body.description,
          effective_date: req.body.effective_date,
          account_type: req.body.account_type,
        }

        // 5. Create Transaction
        Transaction.create(transaction).exec(function (err, result) {
          if (err) {
            sails.log.debug('Some error occured ' + err);
            return res.json(500, {
              error: 'Some error occured'
            });
          }
          sails.log.debug('Success', JSON.stringify(result));
          // return res.json(200, { success: 'Success' });
          // 6. Respond result
          return res.send({
            transaction_type: 'Cash Deposit',
            message: "Transaction completed.",
            balance: account.balance,
            timestamp: new Date()
          });
        }); //</Transaction.create()>



      } else {
        sails.log.debug('Some error occured ' + err);
        return res.json(500, {
          error: 'You must enter a valid amount.'
        });
      }

    }); //</Account.findOne()>
  }, //</deposit>


  withdraw: function (req, res) {

    var account_number = req.body.account_number;

    // 1. Retrieve account details
    Account.findOne({
      account_number: account_number
    }).exec(function (err, account) {
      if (err) {
        return res.serverError(err);
      }
      if (!account) {
        return res.notFound('Could not find the specified account.');
      }


      if (req.body.amount) {
        // 2. Update account balance
        account.balance -= parseFloat(req.body.amount);


        if (account.balance > 0) {
          // 3. Save updated account balance
          account.save(function (err) {
            if (err) {
              return res.serverError(err);
            }
            return res.ok();
          }); //</Account.save()>

          // 4. Prepare transaction payload
          var transaction = {
            account: account.id, // account id
            customer: req.body.customer,
            type: 'Debit',
            amount: req.body.amount,
            description: req.body.description,
            effective_date: req.body.effective_date,
            account_type: req.body.account_type,
          }

          // 5. Create Transaction
          Transaction.create(transaction).exec(function (err, result) {
            if (err) {
              sails.log.debug('Some error occured ' + err);
              return res.json(500, {
                error: 'Some error occured'
              });
            }
            sails.log.debug('Success', JSON.stringify(result));
            // return res.json(200, { success: 'Success' });
            // 6. Respond result
            return res.send({
              transaction_type: 'Cash Withrawal',
              message: "Transaction completed.",
              balance: account.balance,
              timestamp: new Date()
            });
          }); //</Transaction.create()>

        } else {
          sails.log.debug('Some error occured ' + err);
          return res.json(500, {
            error: "Insufficient balance.",
            message: "Transaction failed. Make sure you entered the correct amount.",
            timestamp: new Date()
          });
        }

      } else {
        sails.log.debug('Some error occured ' + err);
        return res.json(500, {
          error: 'You must enter a valid amount.'
        });
      }

    }); //</Account.findOne()>
  }, //</withdraw>


  wiretransfer: function (req, res) {

    var data = req.body;

    console.log(data);
    
    var wiretransfer = {
        bank_account_no: data.bank_account_no,
        beneficiary_bank_swift_bic: data. beneficiary_bank_swift_bic,
        beneficiary_bank_name : data.beneficiary_bank_name,
        beneficiary_bank_address : data.beneficiary_bank_address,
        beneficiary_bank_country : data.beneficiary_bank_country,
        beneficiary_bank_aba_rtn : data.beneficiary_bank_aba_rtn,
        transfer_amount : data.transfer_amount,
        transfer_currency : data.transfer_currency,
        transfer_description : data.transfer_description,
        beneficiary_customer_name : data.beneficiary_customer_name,
        beneficiary_customer_address : data.beneficiary_customer_address,
        beneficiary_customer_acct_iban : data.beneficiary_customer_acct_iban,
        beneficiary_customer_ref_message : data.beneficiary_customer_ref_message,
        intermediary_bank_swift : data.intermediary_bank_swift,
        intermediary_bank_name : data.intermediary_bank_name,
        intermediary_bank_address : data.intermediary_bank_address,
        intermediary_bank_location : data.intermediary_bank_location,
        intermediary_bank_country : data.intermediary_bank_country,
        intermediary_bank_aba_rtn : data.intermediary_bank_aba_rtn,
        intermediary_bank_acct_iban : data.intermediary_bank_acct_iban
    }

    return res.json(200, { data: wiretransfer });

   

  } //</moneytransfer>



};

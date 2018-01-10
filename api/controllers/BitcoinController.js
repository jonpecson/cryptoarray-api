/**
 * BitcoinController
 *
 * @description :: Server-side logic for managing bitcoins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var moment = require("moment");
var request = require('request');


module.exports = {

    price: function (req, res) {
        var result = null;

        this.today = moment().format('YYYY-MM-DD');
        this.previousDayOfMonth = moment(this.today).subtract(7, 'days').format('YYYY-MM-DD');


        request(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${this.previousDayOfMonth}&end=${this.today}&currency=USD`, function (error, response, body) {
            // console.log(body);
            // var data = JSON.parse(body);

            // var labels = Object.keys(data.bpi);

            // var series = Object.keys(data.bpi).reduce(function(previous, current) {
            //     previous.push(data.bpi[current]);
            //     return previous;
            // }, []);

            // let result = {"labels": labels, "series": [series]};
            res.send(body);
        });





    },

    profit: function (req, res) {

        packages = [
            {
                package_name: 'Package 1',
                lease_price: 500,
                gpu_count: 1,
                fee: 0.37
            },
            {
                package_name: 'Package 2',
                lease_price: 1000,
                gpu_count: 2,
                fee: 0.35
            },
            {
                package_name: 'Package 3',
                lease_price: 2500,
                gpu_count: 5,
                fee: 0.32
            },
            {
                package_name: 'Package 4',
                lease_price: 5000,
                gpu_count: 10,
                fee: 0.30
            },
            {
                package_name: 'Package 5',
                lease_price: 10000,
                gpu_count: 20,
                fee: 0.28
            },
            {
                package_name: 'Package 6',
                lease_price: 25000,
                gpu_count: 50,
                fee: 0.26
            },
            {
                package_name: 'Package 7',
                lease_price: 50000,
                gpu_count: 100,
                fee: 0.23
            },
            {
                package_name: 'Package 8',
                lease_price: 100000,
                gpu_count: 200,
                fee: 0.20
            }

        ];

        var income = {
            daily: { usd: 5.54, btc: 0.00036915 },
            weekly: { usd: 38.80, btc: 0.00258405 },
            monthly: { usd: 166.28, btc: 0.01107450 },
        }

        var response = {
            hwname: 'NVIDIA GTX 1070 TI',
            elcost: .12,
            daily: income.daily,
            weekly: income.weekly,
            monthly: income.monthly,
            profits: []
        };

        for (let item of packages) {
            item.daily =  income.daily.usd * item.gpu_count;
            item.weekly = income.weekly.usd * item.gpu_count;
            item.monthly = income.monthly.usd * item.gpu_count;
            item.yearly = 12 * income.monthly.usd * item.gpu_count;
            item.net = (item.yearly - (item.yearly * item.fee)) - item.lease_price;
            item.roi = item.net / item.lease_price * 100;
            response.profits.push(item);
        }

        res.send(response);

    },

    coinwarz: function(req, res) {
        request('http://www.coinwarz.com/v1/api/profitability?apikey=d8662c8fde494723a8004b1afdbb5222&algo=all', function (error, response, body) {
            res.send(body);
        });
    }





};


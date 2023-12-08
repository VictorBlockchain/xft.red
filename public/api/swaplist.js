import clientPromise from "../../dapp/lib/mongodb";
import { ObjectId } from "mongodb";
import axios from "axios";

export default async (req, res) => {
    try {

        const { from, to} = req.body;
        let list =  {}
        const config = {
            method: 'get',
          maxBodyLength: Infinity,
            url: 'https://api.changenow.io/v2/exchange/available-pairs?fromCurrency='+from+'&toCurrency='+to+'&fromNetwork='+from+'&toNetwork'+to+'=&flow=',
            headers: { 
              'x-changenow-api-key': process.env.CHANGENOW
            }
          };
          axios(config)
            .then(function (response) {
                list = JSON.stringify(response.data)
            //console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                //console.log(error);
            });

        res.json(list);
    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
};
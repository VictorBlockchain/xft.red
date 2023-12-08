import clientPromise from "../../dapp/lib/mongodb";
import { ObjectId } from "mongodb";
import axios from "axios";
import qrCode from 'qrcode';

export default async (req, res) => {
    try {

        const { fromCurrency, toCurrency, amount, payToAddress, email} = req.body;
        // console.log(fromCurrency, toCurrency, amount, payToAddress, email)
        let resp = {}
        // console.log(process.env.CHANGENOW)
        const data = JSON.stringify({
            "fromCurrency": fromCurrency,
            "toCurrency": toCurrency,
            "fromNetwork": fromCurrency,
            "toNetwork": toCurrency,
            "fromAmount": amount,
            "toAmount": "",
            "address": payToAddress,
            "extraId": "",
            "refundAddress": "",
            "refundExtraId": "",
            "userId": "",
            "payload": "",
            "contactEmail": email,
            "source": "",
            "flow": "standard",
            "type": "direct",
            "rateId": ""
          });
          var config = {
            method: 'post',
          maxBodyLength: Infinity,
            url: 'https://api.changenow.io/v2/exchange',
            headers: { 
              'Content-Type': 'application/json', 
              'x-changenow-api-key': process.env.CHANGENOW
            },
            data : data
          };
         await axios(config)
            .then(async(response) =>{
                const qrCodeUrl = await qrCode.toDataURL(response.data.payinAddress);
                console.log(qrCodeUrl)
                response.data.qr = qrCodeUrl;
                resp = response.data;
                //console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });

        res.json(resp);
    } catch (e) {
        console.error(e);
        throw new Error(e).message;
    }
};
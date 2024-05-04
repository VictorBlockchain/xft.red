import axios from "axios";
import qrCode from 'qrcode';

export default async (req:any, res:any) => {
    try {
        
      const { fromCurrency, fromCurrency_network, toCurrency, toCurrency_network, amount, payToAddress, email } = req.body;
        // console.log(fromCurrency, fromCurrency_network, toCurrency, toCurrency_network, amount, payToAddress, email)
        let resp:any;
                
              const apiUrl = 'https://api.changenow.io/v2/validate/address';
              const currency = toCurrency;
              const address = payToAddress.replace(/\s/g, '');
        

              const data = JSON.stringify({
              "fromCurrency": fromCurrency,
              "toCurrency": toCurrency,
              "fromNetwork": fromCurrency_network,
              "toNetwork": toCurrency_network,
              "fromAmount": amount,
              "toAmount": "",
              "address": address,
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
            var config:any = {
              method: 'post',
              maxBodyLength: Infinity,
              url: 'https://api.changenow.io/v2/exchange',
              headers: { 
                'Content-Type': 'application/json', 
                'x-changenow-api-key': process.env.CHANGENOW
              },
              data : data
            };
            let rate:any = await axios(config)
            // console.log(rate.data)
            const qrCodeUrl = await qrCode.toDataURL(rate.data.payinAddress);
            rate.data.qr = qrCodeUrl;
            rate.data.result = true
            resp = rate.data;

            // console.log(resp)
        
        res.json(resp);
    } catch (e:any) {
        console.error(e.response.data);
        res.json(e.response.data);

        throw new Error(e).message;
    }
};
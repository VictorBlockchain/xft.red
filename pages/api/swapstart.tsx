import axios from "axios";
import qrCode from 'qrcode';

export default async (req:any, res:any) => {
    try {
        
        const { fromCurrency, toCurrency, amount, payToAddress, email} = req.body;
                
        const apiUrl = 'https://api.changenow.io/v2/exchange/currencies';
        const params = {
          active: '',
          flow: 'standard',
          buy: '',
          sell: ''
        };
        
       let resp:any = await axios.get(apiUrl, { params })
        // console.log(resp.data)
        
        res.json(resp.data);
    } catch (e:any) {
        console.error(e);
        throw new Error(e).message;
    }
};
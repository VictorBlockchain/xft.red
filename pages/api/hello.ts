import fs from 'fs'
import path from 'path'
const _dirnftea = path.join(process.cwd(), '/public/profile')

export default async function handler(req:any, res:any) {
    res.setHeader('Cache-Control', 's-maxage=10');
    let data_ = req.body
    console.log(data_)
    if (fs.existsSync(_dirnftea+'/'+data_.user+'.json')) {

        data_ = fs.readFileSync(_dirnftea+'/'+data_.user+'.json')
        data_ = JSON.parse(data_);

    }else{
        if(data_.name!=0) {
        fs.writeFileSync(_dirnftea+'/'+data_.user+'.json', JSON.stringify(data_))

         }else{

             data_ = []
         }
    }
    res.status(200).json({
        data: data_
    })
}
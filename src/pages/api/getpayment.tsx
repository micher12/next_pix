"use server";

import type { NextApiRequest, NextApiResponse } from 'next'
import { MercadoPagoConfig, Payment } from "mercadopago"

export default async function payment(req: NextApiRequest, res: NextApiResponse){
    

    if(req.method === "POST"){

        const headers = req.headers;
        const preKey = headers["x-key"] as string;
        const key = preKey?.split("Bearer ")[1];
        const token = process.env.PAYMENT_TOKEN as string;
        const response: any = [];

        if(key === token){
          
            const id = req.body.id;
        
            const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN_TESTE as string });
            const payments = new Payment(client);


            await payments.get({id: id}).then((res)=>{
                response.push(res);
            })
        

            return res.status(200).json({sucesso: "ok", payment: response[0]});
        
        }
           

        return res.status(401).json({erro: "Invalido!"});
        
    }else{
       return res.status(405).json({erro: "Invalido!"})
    }

}
"use server";

import type { NextApiRequest, NextApiResponse } from 'next'
import { MercadoPagoConfig, Payment } from "mercadopago"

export default async function payment(req: NextApiRequest, res: NextApiResponse){
    
    const addOneHour = () => {
        const date = new Date();
        date.setHours(date.getHours() + 1);
      
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const milliseconds = String(date.getMilliseconds()).padStart(3, '0');
        
        const timezoneOffset = -date.getTimezoneOffset();
        const sign = timezoneOffset >= 0 ? "+" : "-";
        const timezoneHours = String(Math.floor(Math.abs(timezoneOffset) / 60)).padStart(2, '0');
        const timezoneMinutes = String(Math.abs(timezoneOffset) % 60).padStart(2, '0');
      
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${sign}${timezoneHours}:${timezoneMinutes}`;
    };    

    function generateIdempotencyKey() {
        const timestamp = Date.now().toString(36); // Converte o tempo atual em uma string base 36
        const randomString = Math.random().toString(36).substring(2, 12); // Gera uma string aleatória base 36
      
        return `${timestamp}-${randomString}`
    }


    if(req.method === "POST"){

        const headers = req.headers;
        const preKey = headers["x-key"] as string;
        const key = preKey?.split("Bearer ")[1];
        const token = process.env.PAYMENT_TOKEN as string;
        const response: any = [];

        if(key === token){
          
            const type = req.body;
        
            if(type.type === "pix"){

                const client = new MercadoPagoConfig({ accessToken: process.env.ACCESS_TOKEN_TESTE as string, options: { timeout: 5000, idempotencyKey: generateIdempotencyKey() } });
                const payments = new Payment(client);


                const body = {
                    transaction_amount: 1.0, //qnt * produto
                    additional_info: {
                        items: [
                            {
                                id: 'MLB2907679857',
                                title: 'Meu produto aleatorio',
                                quantity: 2,
                                unit_price: 12,
                            }
                        ],
                    },
                    description: 'MEU PRODUTO ',
                    payment_method_id: 'pix',
                    payer: {
                        entity_type: 'individual',
                        type: 'customer',
                        email: 'michelasm3@gmail.com' //não confiar no callback do checkout este email. Passar diretamente o email para o banco de dados.
                    },
                    date_of_expiration: addOneHour(),
                };


                await payments.create({ body }).then((res)=>{
                    response.push(res);
                })
           

                return res.status(200).json({sucesso: "ok", payment: response[0]});
            }
        

            return res.status(400).json({erro: "Something wrong"});
            
        }
           

        return res.status(401).json({erro: "Invalido!"});
        
    }else{
       return res.status(405).json({erro: "Invalido!"})
    }

}
"use client";

import paymentToken from "./components/paymentToken";

export default function Home() {

  const pixPayment = async (e: React.MouseEvent<HTMLAnchorElement>)=>{
    
    const api = await fetch(process.env.NEXT_PUBLIC_PATH+"/api/payment",{
      method: "POST",
      body:JSON.stringify({type:"pix"}),
      headers:{
        "Content-type":"application/json",
        "x-key":`Bearer ${await paymentToken()}`
      }
    });

    const response = await api.json();
    const status = api.status;

    if(status === 200 && response.sucesso === "ok"){
      //console.log(response.payment);
      //console.log(response.payment.payer);
      console.log(response.payment.status); //status "pending"
      console.log(response.payment.id); //id para recuperar checkout 
      console.log(response.payment.point_of_interaction.transaction_data.qr_code); //codigo qr code
      console.log(response.payment.point_of_interaction.transaction_data.ticket_url); //url para checkout
    }

  }

  return (
    <>
      <div className="w-full flex items-center justify-center mt-10">
        <a onClick={pixPayment} className="bg-blue-500 px-16 py-1.5 rounded text-slate-50 font-bold text-xl cursor-pointer">PAGAR COM PIX</a>
      </div>
    </>
  )
}

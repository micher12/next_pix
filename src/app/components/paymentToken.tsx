"use server";

export default async function paymentToken(){

    return process.env.PAYMENT_TOKEN;

}
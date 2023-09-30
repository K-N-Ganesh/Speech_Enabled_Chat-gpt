import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

import OpenAI from "openai";

// Create an instance of the OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });



const app=express();
app.use(cors());
app.use(express.json());
app.get('/',async (req,res)=>{
    res.status(200).send({
        message:"hello from codex",
    })
});
app.post('/',async(req,res)=>{
    try{
        const prompt=req.body.prompt;
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              
              {
                "role": "user",
                "content": `${prompt}`
              }
            ],
            temperature: 0,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
          });
        
        res.status(200).send({
            //bot:response.data.choices[0].text
            "bot": response.choices[0].message.content
        })
    }
    catch(error){
        console.log(error);
        res.status(500).send({error});
    }
})
app.listen(3000,()=> console.log('Server is running on port http://localhost:3000'));
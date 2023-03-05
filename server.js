import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ChatGPTAPI } from "chatgpt";
import { Configuration, OpenAIApi } from "openai";
import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

//Initialize ChatGPT API
const api = new ChatGPTAPI({
  apiKey: process.env.OPENAI_API_KEY,
});

//Initialize DALL-E API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

//Initialize Express Server
const app = express();

//Middlewares
app.use(bodyParser.json());
app.use(cors());

//POST Route to ChatGPT
app.post(`/chat`, async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await api.sendMessage(prompt);

    res.send(response.text);
  } catch (error) {
    res.send(error);
  }
});

//POST Route to DALL-E
app.post(`/draw`, async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    const image_url = response.data.data[0].url;

    res.send(image_url);
  } catch (error) {
    res.send(error);
  }
});

//Listener
const PORT = 8080;

app.listen(process.env.PORT || PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

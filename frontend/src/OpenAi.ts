import OpenAI from "openai";

const infoData = async (link: string) => {
  const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    dangerouslyAllowBrowser: true, // ⚠️ Add this line
  });

  const completion = await openai.chat.completions.create({
    model: "deepseek/deepseek-chat-v3-0324:free",
    messages: [{ role: "user", content: `${link}  discribe the priparetion in the json formate  ` }],
  });

  console.log(completion.choices[0].message);
};

export default { infoData };

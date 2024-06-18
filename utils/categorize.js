import OpenAI from "openai";

const openai = new OpenAI({
  organization: process.env.ORGANIZATION_ID,
  project: process.env.PROJECT_ID,
  apiKey: process.env.API_KEY,
});

const categorizedPage = async (pageInfo) => {
  const { headings, metaDescription } = pageInfo;
  const stream = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "Analyze this JSON that contains a list of headings in a page and the meta description. Provide an answer with a JSON object containing the following keys: title, description and categories, categories is an array of strings. Add at least 6 categories to categorize the given page info. The main categories are: API, Documentation, Tutorial. This is going to be added to a DB later, so make sure the JSON object is valid. Try to provide the main functionality of the page in the title and a summarized description keeping in mind all the info given. For example, if it talks about an API, the title should include API. If the meta description is not found, add your own description in 150 characters max. If the information is in another language, translate it to english. If you are not able to provide the requested information, please respond: Error. ",
      },
      {
        role: "user",
        content: JSON.stringify({ headings, metaDescription }),
      },
    ],
    model: "gpt-4o",
  });
  // gpt response includes the JSON tags, so we need to remove them
  return stream.choices[0].message.content.slice(7).slice(0, -3);
};

export { categorizedPage };

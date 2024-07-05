const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY,
});

async function getAssistant(inputString) {
    try {
        const assistant = await openai.beta.assistants.retrieve(
            "asst_kpmxgdVKEFW2eJF9VdHLvNsY"
        );

        // Create a new thread
        const thread = await openai.beta.threads.create();

        // Add a message to the thread
        const message = await openai.beta.threads.messages.create(thread.id, {
            role: "user",
            content: inputString
        });

        // Run the assistant on the thread
        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: assistant.id
        });

        let responseReceived = false;
        while (!responseReceived) {
            const messages = await openai.beta.threads.messages.list(thread.id);

            // Check if the assistant's response is in the messages
            for (let msg of messages.data) {
                if (msg.role === "assistant" && msg.content.length > 0) {
                    return(msg.content.text.value);
                }
            }

            // Wait for a while before polling again
            if (!responseReceived) {
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

    } catch (error) {
        console.error("Error retrieving assistant:", error);
    }
}


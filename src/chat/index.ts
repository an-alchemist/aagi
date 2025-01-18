import { elizaLogger, IAgentRuntime, settings } from "@elizaos/core";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.on("SIGINT", () => {
  rl.close();
  process.exit(0);
});

async function handleTwitterPost(runtime: IAgentRuntime, content: string) {
  if (!runtime?.clients) return;

  // Looking at the logs, TwitterClientInterface adds the manager directly to clients array
  const manager = runtime.clients.find(c => c.post?.generateAndPost);

  if (manager?.post) {
    try {
      await manager.post.generateAndPost({
        customContent: content,
        skipScheduling: true
      });
      elizaLogger.log("Tweet posted successfully!");
    } catch (error) {
      elizaLogger.error("Failed to post tweet:", error);
    }
  }
}

async function handleUserInput(input, agentId, runtime) {
  if (input.toLowerCase() === "exit") {
    rl.close();
    process.exit(0);
  }
  if (input.startsWith("/tweet ")) {
    const tweetContent = input.slice(7);
    await handleTwitterPost(runtime, tweetContent);
    return;
  }

  try {
    const serverPort = parseInt(settings.SERVER_PORT || "3000");

    const response = await fetch(
      `http://localhost:${serverPort}/${agentId}/message`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: input,
          userId: "user",
          userName: "User",
        }),
      }
    );

    const data = await response.json();
    data.forEach((message) => console.log(`${"Agent"}: ${message.text}`));
  } catch (error) {
    console.error("Error fetching response:", error);
  }
}

export function startChat(characters, runtime) {
  function chat() {
    const agentId = characters[0].name ?? "Agent";
    rl.question("You: ", async (input) => {
      await handleUserInput(input, agentId, runtime);
      if (input.toLowerCase() !== "exit") {
        chat(); // Loop back to ask another question
      }
    });
  }

  return chat;
}

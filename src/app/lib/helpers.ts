import { getPlaygroundSize, getRedBallPosition, moveRedBall } from "./playgroundFunctions";

type FunctionCall = {
  name: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  arguments: any,
}

export function handleToolCalls(tool_calls: FunctionCall[]){
  const responses: string[] = [];
  for(const tool_call of tool_calls){
    if(tool_call && tool_call.name && tool_call.arguments){
      console.log("Function Call", tool_call);

      switch (tool_call.name){
        case "moveRedBall":
          moveRedBall(tool_call.arguments);
          break;
        case "getRedBallPosition":
          responses.push(getRedBallPosition());
          break;
        case "getPlaygroundSize":
          responses.push(getPlaygroundSize());
          break;
      }
    }
  }

  return responses;
}

export function stripFunctionTags(input: string): string {
  return input.replace(/<function>[\s\S]*?<\/function>/g, "").trim();
}

export function extractFunctionJSON(input: string): string | null {
  const match = input.match(/<function>([\s\S]*?)<\/function>/);
  return match ? match[1].trim() : null;
}
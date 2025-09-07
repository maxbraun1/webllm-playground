"use client";

import { useEffect, useRef, useState } from "react";
import { useEngineStore } from "../stores/engineStore";
import "./sidebar.css";
import { initEngine, initial_message } from "../lib/engine/engine";
import { ChatCompletionMessageParam } from "@mlc-ai/web-llm";
import { extractFunctionJSON, handleToolCalls } from "../lib/helpers";
import * as webllm from "@mlc-ai/web-llm";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [textareaValue, setTextareaValue] = useState("");
  const [messages, setMessages] = useState<ChatCompletionMessageParam[]>([
    initial_message,
  ]);
  const [modelList, setModelList] = useState<webllm.ModelRecord[]>();
  const [model, setModel] = useState("Hermes-3-Llama-3.1-8B-q4f16_1-MLC");
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { engine } = useEngineStore();

  async function loadModelList() {
    const modelList = webllm.prebuiltAppConfig.model_list;
    setModelList(modelList)
  }

  useEffect(() => {
    loadModelList();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function sendMessage() {
    if (!engine) return;

    let convo: ChatCompletionMessageParam[] = messages;

    convo = [
      ...convo,
      { role: "user", content: textareaValue } as ChatCompletionMessageParam,
    ];

    setTextareaValue("");

    setMessages(convo);

    const updated = await runTurn(convo);

    setMessages(updated);
  }

  // Keeps calling the model (and tools) until we get a plain assistant message.
  async function runTurn(
    convo: ChatCompletionMessageParam[]
  ): Promise<ChatCompletionMessageParam[]> {
    const response = await engine!.chat.completions.create({
      messages: convo,
    });

    const content = response.choices[0].message.content;
    if (!content || !content.trim()) {
      return convo;
    }

    let nextConvo = [
      ...convo,
      { role: "assistant", content } as ChatCompletionMessageParam,
    ];

    // If the assistant included a <function>…</function>, extract & execute it
    const fnStr = extractFunctionJSON(content); // returns string | null
    if (!fnStr) {
      return nextConvo;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let call: any = null;
    try {
      call = JSON.parse(fnStr);
    } catch (e) {
      console.error("Bad function JSON:", fnStr, e);
      return nextConvo;
    }

    // Execute your tool(s)
    const result = handleToolCalls(call);
    // Append tool result as a tool message
    nextConvo = [
      ...nextConvo,
      {
        role: "tool",
        content: typeof result === "string" ? result : JSON.stringify(result),
        tool_call_id: "0",
      } as ChatCompletionMessageParam,
    ];

    return runTurn(nextConvo);
  }

  return (
    <aside className="w-full basis-1/2 p-5 bg-slate-800 space-y-5 relative">
      <h1>Chatbot</h1>
      <div className="bg-slate-900 rounded p-4 overflow-y-auto h-[400px] w-full space-y-2" ref={chatContainerRef}>
        {messages.map((m, idx) =>
          idx > 0 && ["user", "assistant"].includes(m.role)? (
            <p id={m.role} className="max-w-11/12 rounded px-3 py-2" key={idx}>
              {m.content?.toString()}
            </p>
          ) : null
        )}
      </div>
      <textarea
        className="bg-slate-900 rounded p-2 w-full"
        value={textareaValue}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
          }
        }}
        onChange={(e) => setTextareaValue(e.target.value)}
        rows={3}
        placeholder="Enter message..."
      />
      <button
        className="border rounded p-1 min-w-24 cursor-pointer"
        onClick={() => sendMessage()}
      >
        Send
      </button>

      { modelList &&
        <>
          <p>Model:</p>
          <Popover open={modelSelectorOpen} onOpenChange={setModelSelectorOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={modelSelectorOpen}
                className="w-full bg-slate-800 justify-between hover:bg-slate-800 hover:text-white cursor-pointer"
              >
                {model
                  ? modelList.find((modelList) => modelList.model_id === model)?.model_id
                  : "Select model..."}
                <ChevronsUpDown className="opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full bg-slate-800 p-0">
              <Command>
                <CommandInput placeholder="Search framework..." className="h-9" />
                <CommandList>
                  <CommandEmpty>No framework found.</CommandEmpty>
                  <CommandGroup>
                    {modelList.map((modelOption) => (
                      <CommandItem
                        key={modelOption.model_id}
                        value={modelOption.model_id}
                        onSelect={() => {
                          setModel(modelOption.model_id);
                          setModelSelectorOpen(false)
                          initEngine(modelOption.model_id);
                        }}
                      >
                        {modelOption.model_id}
                        <Check
                          className={cn(
                            "ml-auto",
                            model === modelOption.model_id ? "opacity-100" : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </>
      }
    </aside>
  );
}

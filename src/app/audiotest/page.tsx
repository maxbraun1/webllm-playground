"use client";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";
import { useEffect } from "react";


export default function AudioTest(){
  useEffect(() => {
    setup();
  }, []);

  async function setup(){
    // Create Deepgram client
    const res = await fetch("/api/deepgram-token");
    const { token } = await res.json();

    const deepgramClient = createClient({ accessToken: token });

    // Create a live transcription connection
    const deepgramConnection = deepgramClient.listen.live({
      model: "nova-3",
      language: "en-US",
    });

    deepgramConnection.on(LiveTranscriptionEvents.Open, () => {
      console.log("Deepgram connection open");
      deepgramConnection.on(LiveTranscriptionEvents.Transcript, (data) => {
        console.log("data", data);
      });
      deepgramConnection.on(LiveTranscriptionEvents.Close, (e) => {
        console.log("Connection closed:", e);
      });
      deepgramConnection.on(LiveTranscriptionEvents.Metadata, (data) => {
        console.log(data);
      });
      deepgramConnection.on(LiveTranscriptionEvents.Error, (err) => {
        console.error(err);
      });

      //Get mic audio
      navigator.mediaDevices.getUserMedia({ audio: true }).then(async (stream) => {
        // Turn that into an audio source Deepgram can use
        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);

        await audioContext.audioWorklet.addModule("/mic-processor.js");
        const micNode = new AudioWorkletNode(audioContext, "mic-processor");
        source.connect(micNode);

        micNode.port.onmessage = (event) => {
          const inputData = event.data
          const int16Data = new Int16Array(inputData.length)
          for (let i = 0; i < inputData.length; i++) {
            int16Data[i] = inputData[i] * 0x7fff
          }
          deepgramConnection.send(int16Data.buffer);
        }
      });
    });
  }
}
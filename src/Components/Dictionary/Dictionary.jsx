import axios from "axios"
import { useState } from "react"
import { baseurl } from "../../constants/constants"

export const Dictionary = () => {
    const [word, setWord] = useState("")
    const [data, setData] = useState({})
    const handleInput = (e) => {
        console.log(e.target.value)
        setWord(e.target.value)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("submitted")
        axios.get(`${baseurl+word}`).then((res)=>{
          console.log(res.data.entries)
          
          setData(res.data)
        })
        
    }

    const handleSound = async () => {
    if (!data.word) return;

    try {
        // Step 1: Query Wiktionary for images associated with the word
        const wikiRes = await axios.get("https://en.wiktionary.org/w/api.php", {
            params: {
                action: "query",
                titles: data.word,
                prop: "images",
                format: "json",
                origin: "*", // Required to bypass CORS
            },
        });

        const pages = wikiRes.data.query.pages;
        const pageId = Object.keys(pages)[0];
        const images = pages[pageId]?.images || [];

        // Find an audio file (e.g., .ogg or .mp3)
        const audioFileObj = images.find(
            (img) => img.title.endsWith(".ogg") || img.title.endsWith(".mp3")
        );

        if (!audioFileObj) {
            alert(`No audio file found on Wikimedia Commons for "${data.word}"`);
            return;
        }

        // Step 2: Query Wikimedia Commons to resolve direct file URL
        const commonsRes = await axios.get("https://commons.wikimedia.org/w/api.php", {
            params: {
                action: "query",
                titles: audioFileObj.title,
                prop: "imageinfo",
                iiprop: "url",
                format: "json",
                origin: "*", 
            },
        });

        const commonsPages = commonsRes.data.query.pages;
        const commonsPageId = Object.keys(commonsPages)[0];
        const audioUrl = commonsPages[commonsPageId]?.imageinfo?.[0]?.url;

        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play().catch((err) => console.error("Playback error:", err));
        } else {
            alert("Could not resolve audio URL.");
        }
    } catch (error) {
        console.error("Failed to fetch audio:", error);
        alert("Error fetching audio file.");
    }
};
   
  return (
    <div>


    <nav className="flex bg-gray-800 items-center justify-between text-white font-semibold h-10 px-4">
        <h2>Dictionary</h2>
        <ul>
            <li className="flex gap-3"><input className="px-1 bg-gray-600 rounded border-0 focus:outline-0 " type="text" name="word" onChange={handleInput} /><button onClick={handleSubmit} className="hover:bg-gray-600 rounded">🔍</button></li>
        </ul>
    </nav>

    <div className="flex flex-col bg-[#3D4655] rounded-xl p-3 mt-10 justify-center items-center max-w-md mx-auto">
      <div className="flex justify-between w-full">
        <div className="flex flex-col text-start px-1">
          <h4 className="text-[#61B2A6] font-extrabold ">WORD</h4>
          <h2 className="text-2xl font-bold text-white">{data.word} <button className="h-5 bg-black/20 hover:bg-black/50 focus:outline-2 focus:outline-offset-2 focus:outline-violet-500  cursor-pointer rounded-2xl" onClick={handleSound}><sup >🔊</sup></button> </h2>
        </div>
        {/* <div>
          
          <h1 className="text-[#61B2A6] font-extrabold">other language</h1>
          <h1 className="text-white font-bold">other</h1>
        </div> */}
      </div>

        <div className="w-full text-white">
          <hr className="bg-white w-full"/>
          
          <div className="flex gap-20 px-3 pt-1">

                <div className="flex flex-col">
                  <h4 className="font-extrabold text-[#61B2A6]">CLASS</h4>
                  { data?.entries?.map((entry)=>(
                    <h2 className="text-sm">{entry.partOfSpeech}</h2>
          ))}
                  
                </div>
                <div className="flex flex-col">
                  <h4 className="font-extrabold text-[#61B2A6]">Phonatic</h4>
                  <h2 className="text-sm">{data.entries?.[0]?.pronunciations?.[0]?.text || "N/A"}</h2>
                </div>
                </div>
                <div className=" px-3 mt-3 flex flex-col gap-1">
                  <h4 className="font-extrabold text-[#61B2A6] text-sm">DEFINITION</h4>
                  {   (()=>{
                     let counter =1;
                    

                   return data?.entries?.map((entry)=>
                    entry?.senses?.map((sense)=>{
                      if (counter > 5) return null;
                      return(
                  
               <h2 className="text-sm" key={counter}>{`${counter++}. ${sense.definition} `} <span className="font-light italic">{` (${entry.partOfSpeech})`}</span></h2>
               );
              
                  })
            
          )
          })()}
                 
                 
                  <h4 className="font-extrabold text-[#61B2A6] text-sm">EXAMPLE</h4>
                  {(() => {
  let counter = 1;

  return data?.entries?.map((entry) =>
    entry?.senses?.map((sense) => {
      const allExamples = [
        ...(sense.examples || []),
        ...(sense.subsenses?.flatMap((sub) => sub.examples || []) || [])
      ];

      return allExamples.map((ex) => {
        if (counter > 5) return null; // Stops rendering after 5 examples

        return (
          <p className="text-sm italic text-gray-300" key={counter}>
            {`${counter++}. "${ex}"`}
          </p>
        );
      });
    })
  );
})()}
                </div>
        
      </div>
    </div>
        </div>
  )
}

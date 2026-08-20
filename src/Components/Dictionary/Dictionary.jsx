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
  return (
    <div>


    <nav className="flex bg-gray-800 items-center justify-between text-white font-semibold h-10 px-4">
        <h2>Dictionary</h2>
        <ul>
            <li className="flex gap-3"><input className="px-1 bg-gray-600 rounded border-0 focus:outline-0 " type="text" name="word" onChange={handleInput} /><button onClick={handleSubmit} className="hover:bg-gray-600 rounded">🔍</button></li>
        </ul>
    </nav>

    <div className="flex flex-col bg-[#3D4655] rounded p-3 mt-10 justify-center items-center max-w-md mx-auto">
      <div className="flex justify-between w-full">
        <div className="flex flex-col text-start px-1">
          <h4 className="text-[#61B2A6] font-extrabold ">WORD</h4>
          <h2 className="text-2xl font-bold text-white">{data.word}</h2>
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
      // Gather examples from both main sense and subsenses
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

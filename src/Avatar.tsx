import React, { useState, useEffect, useRef } from 'react';
import './App.css';


interface Option {
    name: string;
    thumbnail: string;
    folder: string;
    filename: string;
    layers: string[];
}

interface SelectedOptions {
    [key: string]: Option;
}


const getIdx = (fn: string) => {
    if(fn.includes('body')) {
        return 0;
    }
    if(fn.includes('crown')) {
        return 2;
    }
    if(fn.includes('face')) {
        return 1;
    }
    if(fn.includes('bust')) {
        return 3;
    }
    if(fn.includes('neck')) {
        return 4;
    }
    return 0;
}

export const Avatar: React.FC = () => {

    async function copyTextToClipboard(text: string) {
        if ('clipboard' in navigator) {
          return await navigator.clipboard.writeText(text);
        } else {
          return document.execCommand('copy', true, text);
        }
      }

    const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({} as SelectedOptions)

    const [output, setOutput] = useState("");

    const [tab, setTab] = useState<string>("Neck");

    const [selectedLayers, setSelectedLayers] = useState<Option[]>([]);

    const [copied, setCopied] = useState(false);

    const [images, setImages] = useState<Array<string | CanvasImageSource>>(['','','','','']);
    const [context, setContext] = useState<CanvasRenderingContext2D | null | undefined>(undefined);

    const [data, setData] = useState<any>({});
    

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        fetch("https://bafkreihplfy3cndieha7lqh2tirqaagwzj3brs3ip6bmaokw3loed26jlm.ipfs.nftstorage.link/").then((res)=>res.json()).then((res)=>{
            setData(res);

        });
        const rand =  Math.floor(Math.random() * 3) + 1;
        
    },[])

    useEffect(() => {
        Object.keys(data).forEach((key) => {
            let randomElement = data[key][Math.floor(Math.random()*data[key].length)];
            if(!key.includes("Extra") && !key.includes("Neck")){
                setSelectedOptions((selectedOptions: SelectedOptions)=>({...selectedOptions, [key]: randomElement}))
            }
            
        });
    }, [JSON.stringify(data)])

    useEffect(()=> {
        setTimeout(()=>{
            setCopied(false);
        }, 5000);
    }, [copied])

    useEffect(()=>{
        const canvas = canvasRef.current;
        if(!context && canvas){
            setContext(canvas?.getContext('2d'));
        }
        
        if (context) {
            const w = canvas?.width || 600;
            const h = canvas?.height || 600;

            let layers = Object.values(selectedOptions).map((option: Option)=>{
                return option.layers;
            }).flat().toSorted();
            
            console.log(layers);
            const _output = Object.fromEntries(layers.filter((layer: string)=>!layer.includes("Empty")&&!layer.includes("_6_Crown")).map((layer: string)=>{
                let split_layer = layer.split("/");
                return [layer.split("/")[split_layer.length-2], layer.split("/")[split_layer.length-1]];
                
            }));
            setOutput(JSON.stringify(_output))

            let layer_number = 0;
            for(let layer of layers){
                drawImageOnCanvas(context!, layer, 0, 0, w, h, layer_number);
                layer_number++;
            }
        }

    }, [JSON.stringify(selectedOptions), context])

    const drawImageOnCanvas = (
        context: CanvasRenderingContext2D,
        imageName: string,
        x: number,
        y: number,
        w: number,
        h: number,
        layer_number: number = 0
    ) => {
        
        const image = new Image();
        image.src = imageName;
        // console.log(imageName);
        // image.src = `/avatars/${imageName}.png`; // Adjust the path as per your image location
        image.onload = () => {
            // console.log(imageName, "loaded")
            setImages((imgs)=>{
                imgs[layer_number] = image;
                const canvas = canvasRef.current;
                context?.clearRect(0, 0, canvas?.width || 600, canvas?.height || 600);
                for (let im of imgs){
                    if(typeof(im) != "string" && context){
                        try {
                        context.drawImage(im, 0, 0, canvas?.width || 600, canvas?.height || 600);
                        } catch (e) {
                            console.log(e);
                            console.log(im);
                            console.log(typeof(im));
                        }
                    }
                }

                return imgs;
            });
            
        };
        
    };


    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <div>

                    <canvas ref={canvasRef} width={600} height={600} style={{ width: '70vh', maxWidth: '90vw', height: '70vh', maxHeight: '90vw' }} />
                </div>
                <div style={{
                    display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-around", alignItems: "center", flexWrap: "wrap"
                }}>
                    <div style={{display: 'flex', flexDirection: 'row', flexWrap: "wrap"}}>
                    {Object.keys(data).map((key, i) => (
                        <div key={`tab_${key}_${i}`}
                        style={{
                            display: 'flex', flexDirection: 'column', alignSelf: 'baseline', border: "1px solid black",
                            borderRadius: '10%',
                            backgroundColor: tab === key ? 'lightblue' : 'white',
                            margin: '2px',
                            padding: '5px',
                            height: 'max-content',
                            alignItems: 'center',
                            
                            }}>
                        <img key={`tabselect_${key}_${i}`} onClick={() => setTab(key)} src={selectedOptions?.[key]?.thumbnail}
                            style={{
                                width: "fit-content",
                                height: "fit-content",
                                maxWidth: "50px",
                                maxHeight: "50px",
                                
                                cursor: "pointer",
                                margin: "5px"
                            }}
                         />
                         <span style={{color: '0e0e0e', fontSize: '0.75em'}}>{key}</span>
                         </div>

                    ))}
                    </div>
                <div style={{
                        
                        maxWidth: '60vw',
                        overflowX: 'scroll',
                        overflowY: 'hidden',
                        width: '50vw',
                        height: '200px',
                    }}>
                {Object.keys(data).filter((key)=>key==tab).map((key, i) => (
                    <div key={`thumbs_${key}_${i}`} className="thumbnail-container" style={{
                        display: tab === key ? 'flex' : 'none',
                        width: 'fit-content',
                        scrollSnapType: 'x mandatory',
                        scrollBehavior: 'smooth',
                        overscrollBehaviorX: 'contain',
                        
                    }}>
                        {data[key].map((option: Option, i: number) => (
                            <div key={`${key}_${i}`} style={{
                                alignSelf: 'center',
                                scrollSnapStop: 'always',
                                scrollSnapAlign: 'center',
                                }}>
                            <img
                                
                                src={option?.thumbnail}
                                alt={option?.name}
                                className={`thumbnail ${selectedOptions[key]?.thumbnail === option?.thumbnail ? 'selected' : ''}`}
                                onClick={() => setSelectedOptions({ ...selectedOptions, [key]: option})}

                                style={{
                                    width: "fit-content",
                                    height: "fit-content",
                                    maxWidth: "150px",
                                    maxHeight: "150px",
                                    border: "1px solid black",
                                    cursor: "pointer",
                                    margin: "5px"
                                }}
                            />
                            <span style={{color: '#fffefe', fontSize: '0.75em'}}>{option.name}</span>
                            </div>
                        ))}
                    </div>

                ))}
                </div>
                <div style={{width: '10vw', lineHeight:'0.6em'}}>
                    <span style={{color: '#fffefe', fontSize: '0.65em'}}>When you&apos;re happy with your Nieuxy, copy the text below and email it to Lindsey along with your member number:</span>
                    <span style={{display: copied ? 'block' : 'none', color: '#00eeff', fontSize: '0.65em', marginTop:'0.4em'}}>Copied!</span>
                    <textarea spellCheck={false} style={{width: '100%', fontSize: '0.45em', marginTop:'0.4em'}} value={output} onClick={(e)=>{
                        (e.target as HTMLTextAreaElement).select();
                        copyTextToClipboard(output);
                        setCopied(true);
                    }} />
                    
                </div>

            </div>
            
            
            </div>
        </div>
    );
};

export default Avatar;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface Option {
    name: string;
    thumbnail: string;
}

const crownOptions: Option[] = [
    { name: 'Crown 1', thumbnail: '/avatars/crown1.png' },
    { name: 'Crown 2', thumbnail: '/avatars/crown2.png' },
    { name: 'Crown 3', thumbnail: '/avatars/crown3.png' },
];

const faceOptions: Option[] = [
    { name: 'Face 1', thumbnail: '/avatars/face1.png' },
    { name: 'Face 2', thumbnail: '/avatars/face2.png' },
    { name: 'Face 3', thumbnail: '/avatars/face3.png' },
];

const bustOptions: Option[] = [
    { name: 'Bust 1', thumbnail: '/avatars/bust1.png' },
    { name: 'Bust 2', thumbnail: '/avatars/bust2.png' },
    { name: 'Bust 3', thumbnail: '/avatars/bust3.png' },
];

const neckOptions: Option[] = [
    { name: 'Neck 1', thumbnail: '/avatars/neck1.png' },
    { name: 'Neck 2', thumbnail: '/avatars/neck2.png' },
    { name: 'Neck 3', thumbnail: '/avatars/neck3.png' },
];

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
    const [selectedBody, setSelectedBody] = useState('');
    const [selectedCrown, setSelectedCrown] = useState('');
    const [selectedFace, setSelectedFace] = useState('');
    const [selectedBust, setSelectedBust] = useState('');
    const [selectedNeck, setSelectedNeck] = useState('');
    const [images, setImages] = useState<Array<string | CanvasImageSource>>(['','','','','']);
    const [context, setContext] = useState<CanvasRenderingContext2D | null | undefined>();
    

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(()=>{
        const rand =  Math.floor(Math.random() * 3) + 1;
        setSelectedBody(`/avatars/body${rand}.png`);
    },[])

    useEffect(() => {
        const canvas = canvasRef.current;

        setContext(canvas?.getContext('2d'));
        console.log(selectedBody, selectedCrown, selectedFace, selectedBust, selectedNeck)
        if (context) {
            const w = canvas?.width || 600;
            const h = canvas?.height || 600;
            

            // Draw the selected avatar parts in order
            if (selectedBody) drawImageOnCanvas(context, selectedBody, 0, 0, w, h);
            if (selectedCrown) drawImageOnCanvas(context, selectedCrown, 0, 0, w, h);
            if (selectedFace) drawImageOnCanvas(context, selectedFace, 0, 0, w, h);
            if (selectedBust) drawImageOnCanvas(context, selectedBust, 0, 0, w, h);
            if (selectedNeck) drawImageOnCanvas(context, selectedNeck, 0, 0, w, h);
        }
    }, [selectedBody, selectedCrown, selectedFace, selectedBust, selectedNeck]);

    useEffect(()=>{
        console.log(images)
        

    }, [images, `${images}`])

    const drawImageOnCanvas = (
        context: CanvasRenderingContext2D,
        imageName: string,
        x: number,
        y: number,
        w: number,
        h: number
    ) => {
        
        const image = new Image();
        image.src = imageName;
        console.log(imageName);
        // image.src = `/avatars/${imageName}.png`; // Adjust the path as per your image location
        image.onload = () => {
            console.log(imageName, "loaded")
            setImages((imgs)=>{
                imgs[getIdx(imageName)] = image;
                const canvas = canvasRef.current;
                context?.clearRect(0, 0, canvas?.width || 600, canvas?.height || 600);
                for (let im of imgs){
                    if(typeof(im) != "string" && context){
                        context.drawImage(im, 0, 0, canvas?.width || 600, canvas?.height || 600);
                    }
                }

                return imgs;
            });
            
        };
        
    };

    const handleCrownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCrown(event.target.value);
    };

    const handleFaceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedFace(event.target.value);
    };

    const handleBustChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBust(event.target.value);
    };

    const handleNeckChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNeck(event.target.value);
    };

    return (
        <div>
            <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                <div>

                    <canvas ref={canvasRef} width={600} height={600} style={{ width: '80vh', maxWidth: '90vw', height: '80vh', maxHeight: '90vw' }} />
                </div>
                <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-around" }} >
                    <div>
                        <label htmlFor="crown-select">Crown</label>
                        <select id="crown-select" value={selectedCrown} onChange={handleCrownChange}>
                            <option value="">None</option>
                            {crownOptions.map((option) => (
                                <option key={option.name} value={option.thumbnail}>
                                    {option.thumbnail}
                                </option>
                            ))}
                        </select>
                        <div className="thumbnail-container">
                            {crownOptions.map((option) => (
                                <img
                                    key={option.name}
                                    src={option.thumbnail}
                                    alt={option.name}
                                    className={`thumbnail ${selectedCrown === option.thumbnail ? 'selected' : ''}`}
                                    onClick={() => setSelectedCrown(option.thumbnail)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="face-select">Face</label>
                        <select id="face-select" value={selectedFace} onChange={handleFaceChange}>
                            <option value="">None</option>
                            {faceOptions.map((option) => (
                                <option key={option.name} value={option.thumbnail}>
                                    {option.thumbnail}
                                </option>
                            ))}
                        </select>
                        <div className="thumbnail-container">
                            {faceOptions.map((option) => (
                                <img
                                    key={option.name}
                                    src={option.thumbnail}
                                    alt={option.name}
                                    className={`thumbnail ${selectedFace === option.thumbnail ? 'selected' : ''}`}
                                    onClick={() => setSelectedFace(option.thumbnail)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="bust-select">Bust</label>
                        <select id="bust-select" value={selectedBust} onChange={handleBustChange}>
                            <option value="">None</option>
                            {bustOptions.map((option) => (
                                <option key={option.name} value={option.thumbnail}>
                                    {option.thumbnail}
                                </option>
                            ))}
                        </select>
                        <div className="thumbnail-container">
                            {bustOptions.map((option) => (
                                <img
                                    key={option.name}
                                    src={option.thumbnail}
                                    alt={option.name}
                                    className={`thumbnail ${selectedBust === option.thumbnail ? 'selected' : ''}`}
                                    onClick={() => setSelectedBust(option.thumbnail)}
                                />
                            ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="neck-select">Neck</label>
                        <select id="neck-select" value={selectedNeck} onChange={handleNeckChange}>
                            <option value="">None</option>
                            {neckOptions.map((option) => (
                                <option key={option.name} value={option.thumbnail}>
                                    {option.thumbnail}
                                </option>
                            ))}
                        </select>
                        <div className="thumbnail-container">
                            {neckOptions.map((option) => (
                                <img
                                    key={option.name}
                                    src={option.thumbnail}
                                    alt={option.name}
                                    className={`thumbnail ${selectedNeck === option.thumbnail ? 'selected' : ''}`}
                                    onClick={() => setSelectedNeck(option.thumbnail)}
                                />
                            ))}
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Avatar;

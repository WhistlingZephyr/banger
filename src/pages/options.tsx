import ReactDOM, {type JSX} from 'react-dom';
import {useEffect, useRef, useState} from 'react';
import {getEngine, listEngines, updateEngine} from '../helpers/search';
import {getLuckyBangUrl, updateLuckyBangUrl} from '../helpers/lucky-bang';
import {type BackendId, getBackend, updateBackend} from '../helpers/bang';

const App = (): JSX.Element => {
    const [engines, setEngines] = useState<Engine[]>([]);
    const [currentEngine, setCurrentEngine] = useState('');
    const [luckyUrl, setLuckyUrl] = useState('');
    const [backend, setBackend] = useState('');
    const [savedText, setSavedText] = useState('Save');

    const engineSelectionRef = useRef<HTMLSelectElement>(null);
    const backendSelectionRef = useRef<HTMLSelectElement>(null);
    const luckyUrlRef = useRef<HTMLInputElement>(null);
    const onSave = async (): Promise<void> => {
        setSavedText('Saving...');

        if (currentEngine !== engineSelectionRef.current!.value) {
            setCurrentEngine(engineSelectionRef.current!.value);
            await updateEngine(engineSelectionRef.current!.value);
        }

        if (luckyUrl !== luckyUrlRef.current!.value) {
            setLuckyUrl(luckyUrlRef.current!.value);
            await updateLuckyBangUrl(luckyUrlRef.current!.value);
        }

        if (backend !== backendSelectionRef.current!.value) {
            setBackend(backendSelectionRef.current!.value);
            await updateBackend(backendSelectionRef.current!.value as BackendId);
        }

        setSavedText('Saved!');
        setTimeout(() => {
            setSavedText('Save');
        }, 500);
    };

    useEffect(() => {
        (async (): Promise<void> => {
            setEngines(await listEngines());
            setCurrentEngine(await getEngine());
            setLuckyUrl(await getLuckyBangUrl());
            setBackend(await getBackend());
        })();
    }, []);

    return <main className='main'>
        {engines
            ? <>
                <div className='input-container'>
                    <label htmlFor='engine-selection'>Search engine to use:</label>
                    <select id='engines-selection' value={currentEngine} ref={engineSelectionRef}>{
                        engines.map(engine =>
                            <option className='engine-option' value={engine.name}>{engine.name}</option>,
                        )
                    }</select>
                </div>
                <div className='input-container'>
                    <label htmlFor='backend-selection'>Bang database to use:</label>
                    <select id='backend-selection' value={backend} ref={backendSelectionRef}>
                        <option value='ddg'>DuckDuckGo</option>
                        <option value='brave'>Brave</option>
                    </select>
                </div>
                <div className='input-container'>
                    <label htmlFor='lucky-url-input'>Lucky bang (!) url:</label>
                    <input id='lucky-url-input' type='text' value={luckyUrl} ref={luckyUrlRef}/>
                </div>
                <button className='save-button' onClick={onSave}>{savedText}</button>
            </>
            : <p className='loading'>Loading list of engines...</p>
        }
    </main>;
};

ReactDOM.render(<App/>, document.querySelector('#app')!);

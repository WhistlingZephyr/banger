import {render, type JSX} from 'preact';
import {useEffect, useRef, useState} from 'preact/hooks';
import {getEngine, listEngines, updateEngine} from '../helpers/search';
import {getLuckyBangUrl, updateLuckyBangUrl} from '../helpers/lucky-bang';
import {type BackendId, getBackendId, updateBackend} from '../helpers/bang';
import {isUrl} from '../utils/url';

const App = (): JSX.Element => {
    const [engines, setEngines] = useState<Engine[]>([]);
    const [currentEngine, setCurrentEngine] = useState('');
    const [luckyUrl, setLuckyUrl] = useState('');
    const [backend, setBackend] = useState('');
    const [toast, setToast] = useState({label: '', type: 'info'});
    const [showToast, setShowToast] = useState(false);
    const [luckyUrlError, setLuckyUrlError] = useState<boolean | string>(false);
    const engineSelectionRef = useRef<HTMLSelectElement>(null);
    const backendSelectionRef = useRef<HTMLSelectElement>(null);
    const luckyUrlRef = useRef<HTMLInputElement>(null);
    const onSave = async (): Promise<void> => {
        setToast({label: 'Saving...', type: 'info'});
        setLuckyUrl(luckyUrlRef.current!.value);
        setCurrentEngine(engineSelectionRef.current!.value);
        setBackend(backendSelectionRef.current!.value);
        setShowToast(true);
        let luckyUrlValid = isUrl(luckyUrlRef.current!.value);
        if (luckyUrlValid) {
            luckyUrlValid = luckyUrlRef.current!.value.includes('%s');
            if (luckyUrlValid) {
                setLuckyUrlError(false);
            } else {
                setLuckyUrlError('URL doesn\'t include "%s"');
            }
        } else {
            setLuckyUrlError('Invalid URL');
        }

        try {
            if (luckyUrlValid) {
                if (luckyUrl !== luckyUrlRef.current!.value) {
                    await updateLuckyBangUrl(luckyUrlRef.current!.value);
                }

                if (currentEngine !== engineSelectionRef.current!.value) {
                    await updateEngine(engineSelectionRef.current!.value);
                }

                if (backend !== backendSelectionRef.current!.value) {
                    await updateBackend(backendSelectionRef.current!.value as BackendId);
                }

                setToast({label: 'Saved successfully', type: 'success'});
            } else {
                setToast({label: 'Failed to save, invalid input', type: 'error'});
            }
        } catch (error: unknown) {
            console.error(error);
            setToast({label: 'Failed to save all, unknown error', type: 'error'});
        }

        setTimeout(() => {
            setShowToast(false);
        }, 2000);
    };

    useEffect(() => {
        (async (): Promise<void> => {
            setEngines(await listEngines());
            setCurrentEngine(await getEngine());
            setLuckyUrl(await getLuckyBangUrl());
            setBackend(await getBackendId());
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
                    <input
                        id='lucky-url-input'
                        className={`url-input ${luckyUrlError ? 'error' : ''}` }
                        type='text'
                        value={luckyUrl}
                        ref={luckyUrlRef}
                    />
                    {luckyUrlError && <span className='message error'>{luckyUrlError}</span>}
                </div>
                <button className='save-button' onClick={onSave}>Save</button>
                <p className='note'>
                    Note: %s will be replaced with the user's query
                </p>
                {showToast
                    && <div className={`toast ${toast.type}`}>
                        {toast.label}
                    </div>
                }
            </>
            : <p className='loading'>Loading list of engines...</p>
        }
    </main>;
};

render(<App/>, document.querySelector('#app')!);

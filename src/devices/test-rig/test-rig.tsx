import React, { CSSProperties, useEffect, useState } from 'react';
import { Hide } from '../camera/Hide';
import { ErrorView } from './ErrorView';
import { Json } from './Json';
import { MediaStreamCheckResult, scenarios } from '@fakes/media-devices';
import { StreamView } from './StreamView';

export interface Result {
    what: string;
    details: MediaStreamCheckResult;
}

type GetUserMediaResult = MediaStream | Error

const reconstructPromiseFrom = (result: GetUserMediaResult): Promise<MediaStream> => {
    if (result instanceof Error) {
        return Promise.reject(result);
    }
    return Promise.resolve(result);
};

const initial: { permissionState: PermissionState, scenarioSummary: string } = {
    permissionState: 'granted',
    scenarioSummary: scenarios.requestedDeviceTypeNotAttached.summary
};

export const TestRig: React.FC<{}> = () => {
    const [selectedScenario, setSelectedScenario] = useState<string>();
    const [constraintsAsString, setConstraintsAsString] = useState('');
    const [parseError, setParseError] = useState<boolean>(false);
    const [constraints, setConstraints] = useState<MediaStreamConstraints>();
    const [getUserMediaResult, setGetUserMediaResult] = useState<GetUserMediaResult | null>(null);
    const [results, setResults] = useState<Result[]>([]);
    const [permissionState, setPermissionState] = useState<PermissionState>(initial.permissionState);

    useEffect(() => {
        try {
            const parsedConstraints = (constraintsAsString === 'undefined') ? undefined : JSON.parse(constraintsAsString);
            setConstraints(parsedConstraints);
            setParseError(false);
        } catch (e) {
            setParseError(true);
        }
    }, [constraintsAsString, setParseError]);

    useEffect(() => {
        if (selectedScenario === undefined) {
            const summaries = Array.from(scenarios.all.keys());
            const thisOne = summaries.includes(initial.scenarioSummary) ? initial.scenarioSummary : summaries[0];
            setSelectedScenario(thisOne);
            return;
        }
        const scenarioConstrains = scenarios.all.get(selectedScenario)?.constraints;
        const scenarioConstraintsAsString = scenarioConstrains === undefined ? 'undefined' : JSON.stringify(scenarioConstrains, null, 2);
        setConstraintsAsString(scenarioConstraintsAsString);
    }, [selectedScenario]);

    useEffect(() => {
        setResults(() => []);
    }, [selectedScenario]);

    const handleStart = () => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream: MediaStream) => setGetUserMediaResult(() => stream))
            .catch((err: Error) => setGetUserMediaResult(() => err));
    };

    const handleClearChecks = () => {
        setResults(() => []);
    };

    const handleDetach = () => {
        if (getUserMediaResult instanceof MediaStream) {
            getUserMediaResult.getTracks().forEach(track => track.stop());
        }
        handleClearChecks();
        setGetUserMediaResult(null);
    };

    const handleRunChecks = async () => {
        const scenario = scenarios.all.get(selectedScenario ?? '');
        if (scenario === undefined || getUserMediaResult === null) {
            return;
        }
        const checks = scenario.expected[permissionState]?.checks ?? [];
        const results = checks.map(async check => {
            let result: MediaStreamCheckResult;
            try {
                result = await check.predicate(reconstructPromiseFrom(getUserMediaResult));
            } catch (e) {
                let messages: string[];
                if (e instanceof Error) {
                    messages = [`check threw exception ${e.toString()}`];
                } else {
                    messages = ['thrown object is not an instance of Error']
                }
                result = { success: false, messages };
            }
            return ({
                what: check.what,
                details: result
            });
        });
        setResults(await Promise.all(results));
    };


    const blub: CSSProperties = {
        display: 'flex',
        flexDirection: 'column'
    };
    const banana: CSSProperties = {
        display: 'flex',
        flexDirection: 'row'
    };

    return <div>
        <h1 key={'test-rig'}>Test Rig{parseError ? ' (parse error)' : ''}</h1>
        <div style={banana}>
            <div style={blub}>
                <select name="device">
                    <option>camera</option>
                    <option>microphone</option>
                </select>
                <select name="permission" onChange={(e) => {
                    const value = e.target.value;
                    if (value === 'granted' || value === 'denied' || value === 'prompt') {
                        setPermissionState(value);
                    }
                }} value={permissionState}>
                    <option value={'granted'}>granted</option>
                    <option value={'denied'}>denied</option>
                    <option value={'prompt'}>prompt</option>
                </select>
                <select name="scenarios"
                        value={selectedScenario}
                        onChange={(e) => setSelectedScenario(e.target.value)}>
                    {Array.from(scenarios.all.keys()).map(summary => <option value={summary} key={summary}>{summary}</option>)}
                </select>
            </div>
            <textarea value={constraintsAsString} onChange={(e) => setConstraintsAsString(e.target.value)}/>
            <button onClick={handleStart}>start</button>
            <button disabled={getUserMediaResult === null} onClick={handleRunChecks}>run checks</button>
            <button disabled={results.length === 0} onClick={handleClearChecks}>clear checks</button>
            <button onClick={handleDetach}>detach</button>
            <ul key={'results'}>
                {results.map((result, checkIndex) => {
                    const success = result.details.success ? '✅' : '❌';
                    const messages = result.details.messages ?? [];

                    const showMessages = !result.details.success && messages.length !== 0;
                    const messagesView = showMessages ? <ul key={`message ${checkIndex}`}>
                        {messages.map((message, messageIndex) => <li key={`message ${checkIndex} ${messageIndex}`}>{message}</li>)}
                    </ul> : null;

                    return <React.Fragment key={`doombuggy ${checkIndex}`}>
                        <li key={`check result ${checkIndex}`}>{`${success}: ${result.what}`}</li>
                        {messagesView}
                    </React.Fragment>;
                })}
            </ul>
        </div>
        {getUserMediaResult === null ? null :
            getUserMediaResult instanceof MediaStream ?
                <StreamView stream={getUserMediaResult}/> :
                <ErrorView error={getUserMediaResult}/>}
        <Hide hide={true}>
            <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
        </Hide>
    </div>;
};

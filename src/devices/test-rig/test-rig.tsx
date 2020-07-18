import React, { useEffect, useState } from 'react';
import { Hide } from '../camera/Hide';
import { ErrorView } from './ErrorView';
import { Json } from './Json';
import { StreamView } from './StreamView';
import { scenarios } from './Scenarios';

interface Result {
    what: string;
    success: boolean;
}

type GetUserMediaResult = MediaStream | Error

const reconstructPromiseFrom = (result: GetUserMediaResult): Promise<MediaStream> => {
    if (result instanceof Error) {
        return Promise.reject(result);
    }
    return Promise.resolve(result);
};

export const TestRig: React.FC<{}> = () => {
    const [selectedScenario, setSelectedScenario] = useState<string>();
    const [constraintsAsString, setConstraintsAsString] = useState('');
    const [parseError, setParseError] = useState<boolean>(false);
    const [constraints, setConstraints] = useState<MediaStreamConstraints>();
    const [getUserMediaResult, setGetUserMediaResult] = useState<GetUserMediaResult | null>(null);
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        try {
            console.log(constraintsAsString)
            const parsedConstraints = (constraintsAsString === 'undefined') ? undefined : JSON.parse(constraintsAsString);
            setConstraints(parsedConstraints);
            setParseError(false);
        } catch (e) {
            setParseError(true);
        }
    }, [constraintsAsString, setParseError]);

    useEffect(() => {
        if (selectedScenario === undefined) {
            const first = Array.from(scenarios.keys())[0];
            setSelectedScenario(first);
            return;
        }
        const scenarioConstrains = scenarios.get(selectedScenario)?.constraints;
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

    const handleDetach = () => {
        setGetUserMediaResult(null);
    };

    const handleRunChecks = async () => {
        const scenario = scenarios.get(selectedScenario ?? '');
        if (scenario === undefined || getUserMediaResult === null) {
            return;
        }
        const results = scenario.expected.checks.map(async check => {
            let success: boolean;
            try {
                success = await check.predicate(reconstructPromiseFrom(getUserMediaResult));
            } catch (e) {
                success = false;
            }

            return ({
                what: check.what,
                success
            });
        });

        setResults(await Promise.all(results));
    };

    const handleClearChecks = () => {
        setResults(() => []);
    };

    return <div>
        <h1>Test Rig{parseError ? ' (parse error)' : ''}</h1>
        <select name="scenarios" onChange={(e) => setSelectedScenario(e.target.value)}>
            {Array.from(scenarios.keys()).map(summary => <option value={summary} key={summary}>{summary}</option>)}
        </select>
        <textarea value={constraintsAsString} onChange={(e) => setConstraintsAsString(e.target.value)}/>
        <button onClick={handleStart}>start</button>
        <button disabled={getUserMediaResult === null} onClick={handleRunChecks}>run checks</button>
        <button onClick={handleClearChecks}>clear checks</button>
        <button onClick={handleDetach}>detach</button>
        <ul>
            {results.map((result, index) => {
                const success = result.success ? '✅' : '❌';
                return <li key={index}>{`${success}: ${result.what}`}</li>;
            })}
        </ul>
        {getUserMediaResult === null ? null :
            getUserMediaResult instanceof MediaStream ?
                <StreamView stream={getUserMediaResult}/> :
                <ErrorView error={getUserMediaResult}/>}
        <Hide hide={true}>
            <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
        </Hide>
    </div>;
};

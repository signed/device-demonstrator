import React, { useEffect, useState } from 'react';
import { Hide } from '../camera/Hide';
import { Json } from '../camera/Json';
import { StreamView } from '../camera/StreamView';

type MediaStreamCheck = {
    what: string;
    predicate: (stream: MediaStream) => boolean
}

interface Result {
    what: string;
    success: boolean;
}

interface Expected {
    description: string;
    checks: MediaStreamCheck[]
}

interface Scenario {
    summary: string;
    description: string;
    constraints: MediaStreamConstraints,
    expected: Expected
}

const noDeviceWithDeviceId: Scenario = {
    summary: 'bogus device id',
    description: 'the constraint contains a deviceId that no device has',
    constraints: { audio: { deviceId: 'bogus' } },
    expected: {
        description: 'fallback to any other audio device',
        checks: [
            {
                what: 'stream is active',
                predicate: (stream) => stream.active
            }
            , {
                what: 'stream has an id',
                predicate: (stream) => stream.id.length > 0
            }
        ]
    }
};

const existingDevice: Scenario = {
    summary: 'existing device',
    description: 'the constraint contains a deviceId of an existing device',
    constraints: { video: { deviceId: '77df7c3d3f24890c51364752fb295895fbebdc821755f6706f5bcd06e6e63269' } },
    expected: {
        description: 'tbd',
        checks: []
    }
};

const scenarios = new Map<string, Scenario>();
scenarios.set(noDeviceWithDeviceId.summary, noDeviceWithDeviceId);
scenarios.set(existingDevice.summary, existingDevice);

export const TestRig: React.FC<{}> = () => {
    const [selectedScenario, setSelectedScenario] = useState<string>();
    const [constraintsAsString, setConstraintsAsString] = useState('');
    const [parseError, setParseError] = useState<boolean>(false);
    const [constraints, setConstraints] = useState<MediaStreamConstraints>();
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [results, setResults] = useState<Result[]>([]);

    useEffect(() => {
        try {
            setConstraints(JSON.parse(constraintsAsString));
            setParseError(false);
        } catch (e) {
            setParseError(true);
        }
    }, [constraintsAsString, setParseError]);

    useEffect(() => {
        if (selectedScenario === undefined) {
            setSelectedScenario(noDeviceWithDeviceId.summary);
            return;
        }
        setConstraintsAsString(JSON.stringify(scenarios.get(selectedScenario)?.constraints, null, 2));
    }, [selectedScenario]);

    useEffect(() => {
        setResults(() => []);
    }, [selectedScenario]);

    const handleStart = () => {
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream: MediaStream) => setStream(() => stream))
            .catch((err: Error) => alert(err));
    };

    const handleDetach = () => {
        setStream(null);
    };

    const handleRunChecks = () => {
        const scenario = scenarios.get(selectedScenario ?? '');
        if (scenario === undefined || stream === null) {
            return;
        }
        const results = scenario.expected.checks.map(check => {
            let success: boolean;
            try {
                success = check.predicate(stream);
            } catch (e) {
                success = false;
            }

            return ({
                what: check.what,
                success
            });
        });
        setResults(() => results);
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
        <button disabled={stream === null} onClick={handleRunChecks}>run checks</button>
        <button onClick={handleClearChecks}>clear checks</button>
        <button onClick={handleDetach}>detach</button>
        <ul>
            {results.map(result => {
                const success = result.success ? '✅' : '❌';
                return <li>{`${success}: ${result.what}`}</li>;
            })}
        </ul>
        <StreamView stream={stream}/>
        <Hide hide={true}>
            <Json content={navigator.mediaDevices.getSupportedConstraints()}/>
        </Hide>
    </div>;
};

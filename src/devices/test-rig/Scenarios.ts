type MediaStreamPredicate = (mediaStream: MediaStream) => boolean
type ErrorPredicate = (error: Error) => boolean
type MediaStreamPromisePredicate = (mediaStream: Promise<MediaStream>) => Promise<boolean>

const mediaStream: (input: MediaStreamPredicate) => MediaStreamPromisePredicate = (input: MediaStreamPredicate) => {
    return async (promise: Promise<MediaStream>) => input(await promise);
};
const error: (input: ErrorPredicate) => MediaStreamPromisePredicate = (input: ErrorPredicate) => {
    return async (promise: Promise<MediaStream>) => {
        try {
            await promise;
            return false;
        } catch (e) {
            return input(e);
        }
    };
};

type MediaStreamCheck = {
    what: string;
    predicate: MediaStreamPromisePredicate
}

interface Expected {
    description: string;
    checks: MediaStreamCheck[]
}

interface Scenario {
    summary: string;
    description: string;
    constraints?: MediaStreamConstraints,
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
                predicate: mediaStream((stream) => stream.active)
            }
            , {
                what: 'stream has an id',
                predicate: mediaStream((stream) => stream.id.length > 0)
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

const passUndefined: Scenario = {
    summary: 'undefined constraints',
    description: 'pass undefined as constraints',
    constraints: undefined,
    expected: {
        description: 'reject and communicate that at least one constrain has to be present',
        checks: [
            {
                what: 'Type Error',
                predicate: error((err) => err instanceof TypeError)
            }, {
                what: 'error message',
                predicate: error((err) => err.message === `Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested`)
            }
        ]
    }
};

const collectScenarios = () => {
    const result = new Map<string, Scenario>();
    result.set(noDeviceWithDeviceId.summary, noDeviceWithDeviceId);
    result.set(existingDevice.summary, existingDevice);
    result.set(passUndefined.summary, passUndefined);
    return result;
};

export const scenarios = collectScenarios();


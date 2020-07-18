type MediaStreamCheck = {
    what: string;
    predicate: (stream: MediaStream) => boolean
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

const collectScenarios = () => {
    const result = new Map<string, Scenario>();
    result.set(noDeviceWithDeviceId.summary, noDeviceWithDeviceId);
    result.set(existingDevice.summary, existingDevice);
    return result;
}

export const scenarios = collectScenarios()


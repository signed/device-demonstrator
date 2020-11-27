import { MatcherFunction } from '@testing-library/dom/types/matches';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { MediaDeviceDescription, forgeMediaDevices, allAccessAllowed, MediaDevicesControl } from '@fakes/media-devices';
import { CameraDemonstrator, fetchDevices } from './CameraDemonstrator';
import { Context } from './DeviceDemonstratorContext';
import { RecordingDirector } from './RecordingDirector';

const including: (text: string) => MatcherFunction = (text: string) => {
    return (content: String, _element: HTMLElement) => {
        return content.includes(text);
    };
};

const mediaDevicesFake = () => {
    const backup = navigator.mediaDevices;
    return {
        install: (): MediaDevicesControl => {
            const control = forgeMediaDevices(allAccessAllowed());
            Object.assign(navigator, { mediaDevices: control.mediaDevices });
            return control;
        },
        restore: () => {
            Object.assign(navigator, { mediaDevices: backup });
        }
    };
};

describe('hello devices', () => {
    const fake = mediaDevicesFake();
    let control: MediaDevicesControl;
    beforeEach(() => {
        control = fake.install();
    });

    afterEach(() => {
        fake.restore();
    });

    const camera: MediaDeviceDescription = {
        deviceId: '1234', groupId: '5678', kind: 'videoinput', label: 'The Camera Label'
    };

    test('should exp', async () => {
        const recordingDirector = new RecordingDirector();
        const updateDevices = () => fetchDevices(recordingDirector);
        control.mediaDevices.addEventListener('devicechange', updateDevices);

        const UnderTest = () => {
            return <Context.Provider value={{ recordingDirector }}>
                <CameraDemonstrator/>
            </Context.Provider>;
        };

        const { getByText, findByText } = render(<UnderTest/>);

        act(() => {
            control.attach(camera);
        });

        await act(async () => {
            fireEvent.click(getByText('Show Previews'));
        });

        expect(await findByText(including('The Camera Label'))).toBeInTheDocument();
    });
});

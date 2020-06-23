import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import { MediaDeviceDescription } from '../MediaDeviceDescription';
import { MediaDevicesFake } from '../MediaDevicesFake';
import { CameraDemonstrator, fetchDevices, setupCameraDemonstrator } from './CameraDemonstrator';
import { Context } from './DeviceDemonstratorContext';
import { RecordingDirector } from './RecordingDirector';


const mediaDevicesFake = () => {
    const backup = navigator.mediaDevices;
    return {
        install: (): MediaDevicesFake => {
            const mediaDevices = new MediaDevicesFake();
            Object.assign(navigator, { mediaDevices });
            return mediaDevices;
        },
        restore: () => {
            Object.assign(navigator, { mediaDevices: backup });
        }
    };
};

describe('hello devices', () => {
    const fake = mediaDevicesFake();
    let mediaDevices: MediaDevicesFake;
    beforeEach(() => {
        mediaDevices = fake.install();
    });

    afterEach(() => {
        fake.restore();
    });

    const camera: MediaDeviceDescription = {
        deviceId: '1234', groupId: '5678', kind: 'videoinput', label: 'The Camera'
    };


    test('should ', () => {
        act(() => {
            const Demonstrator = setupCameraDemonstrator();
            const { debug, getByText } = render(<Demonstrator/>);
            mediaDevices.attach(camera);
            fireEvent.click(getByText('Show Previews'));
            console.log(debug());
        });
    });

    test('should exp', async () => {
        const recordingDirector = new RecordingDirector();
        const updateDevices = () => fetchDevices(recordingDirector);
        mediaDevices.addEventListener('devicechange', updateDevices);

        const UnderTest = () => {
            return <Context.Provider value={{ recordingDirector }}>
                <CameraDemonstrator/>
            </Context.Provider>;
        };

        const { getByText, debug } = render(<UnderTest/>);

        act(() => {
            mediaDevices.attach(camera);
        })

        await act(async () => {
            fireEvent.click(getByText('Show Previews'));
        })

        console.log(debug());

    });

});

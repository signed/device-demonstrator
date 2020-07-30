type MediaStreamTrackEventListener = (this: MediaStreamTrack, ev: Event) => any

export interface MediaStreamTrackProperties {
    readyState: MediaStreamTrack['readyState']
    enabled: MediaStreamTrack['enabled']
}

export const initialMediaStreamTrackProperties = (): MediaStreamTrackProperties => {
    return { readyState: 'live', enabled: true };
};

export class MediaStreamTrackFake implements MediaStreamTrack {
    constructor(private readonly _id: string, private readonly properties: MediaStreamTrackProperties) {
    }

    get enabled(): boolean {
        return this.properties.enabled;
    }

    set enabled(value: boolean) {
        this.properties.enabled = value;
    }

    get id(): string {
        return this._id;
    }

    get isolated(): boolean {
        throw new Error('not implemented');
    }

    get kind(): string {
        throw new Error('not implemented');
    }

    get label(): string {
        throw new Error('not implemented');
    }

    get muted(): boolean {
        throw new Error('not implemented');
    }

    get readyState(): MediaStreamTrackState {
        return this.properties.readyState;
    };

    onended: MediaStreamTrackEventListener | null = null;
    onisolationchange: MediaStreamTrackEventListener | null = null;
    onmute: MediaStreamTrackEventListener | null = null;
    onunmute: MediaStreamTrackEventListener | null = null;

    addEventListener<K extends keyof MediaStreamTrackEventMap>(type: K, listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: any, listener: any, options?: boolean | AddEventListenerOptions): void {
        throw new Error('not implemented');
    }

    removeEventListener<K extends keyof MediaStreamTrackEventMap>(type: K, listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: any, listener: any, options?: boolean | EventListenerOptions): void {
        throw new Error('not implemented');
    }

    dispatchEvent(event: Event): boolean {
        throw new Error('not implemented');
    }

    applyConstraints(constraints?: MediaTrackConstraints): Promise<void> {
        throw new Error('not implemented');
    }

    clone(): MediaStreamTrack {
        throw new Error('not implemented');
    }

    getCapabilities(): MediaTrackCapabilities {
        throw new Error('not implemented');
    }

    getConstraints(): MediaTrackConstraints {
        throw new Error('not implemented');
    }

    getSettings(): MediaTrackSettings {
        throw new Error('not implemented');
    }

    stop(): void {
        this.properties.readyState = 'ended';
    }
}

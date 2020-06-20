export type MediaStreamEventListener = (this: MediaStream, ev: MediaStreamTrackEvent) => any;

type MediaStreamTrackEventListener = (this: MediaStreamTrack, ev: Event) => any

export class MediaStreamTrackFake implements MediaStreamTrack {
    get enabled(): boolean {
        throw new Error('not implemented');
    }

    set enabled(value: boolean) {
        throw new Error('not implemented');
    }

    get id(): string {
        throw new Error('not implemented');
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
        throw new Error('not implemented');
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
        throw new Error('not implemented');
    }

}

export class MediaStreamFake implements MediaStream {
    get active(): boolean {
        return false;
    }

    get id(): string {
        return '';
    }

    public onaddtrack: MediaStreamEventListener | null = null;
    public onremovetrack: MediaStreamEventListener | null = null;

    addEventListener<K extends keyof MediaStreamEventMap>(type: K, listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject | null, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: any, listener: any, options?: boolean | AddEventListenerOptions): void {
        throw new Error('not implemented');
    }

    removeEventListener<K extends keyof MediaStreamEventMap>(type: K, listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, callback: EventListenerOrEventListenerObject | null, options?: EventListenerOptions | boolean): void;
    removeEventListener(type: any, listener: any, options?: boolean | EventListenerOptions): void {
        throw new Error('not implemented');
    }

    dispatchEvent(event: Event): boolean {
        throw new Error('not implemented');
    }

    addTrack(track: MediaStreamTrack): void {
        throw new Error('not implemented');
    }

    clone(): MediaStream {
        throw new Error('not implemented');
    }

    getAudioTracks(): MediaStreamTrack[] {
        throw new Error('not implemented');
    }

    getTrackById(trackId: string): MediaStreamTrack | null {
        throw new Error('not implemented');
    }

    getTracks(): MediaStreamTrack[] {
        throw new Error('not implemented');
    }

    getVideoTracks(): MediaStreamTrack[] {
        throw new Error('not implemented');
    }

    removeTrack(track: MediaStreamTrack): void {
        throw new Error('not implemented');
    }
}

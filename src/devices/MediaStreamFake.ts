export type MediaStreamEventListener = (this: MediaStream, ev: MediaStreamTrackEvent) => any;

type MediaStreamTrackEventListener = (this: MediaStreamTrack, ev: Event) => any

export class MediaStreamTrackFake implements MediaStreamTrack {
    get enabled(): boolean {
        throw new Error('not implemented');
    }

    set enabled(_value: boolean) {
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
    constructor(private readonly mediaTracks: Array<MediaStreamTrackFake>) {
    }

    /**
     * A Boolean value that returns true if the MediaStream is active, or false otherwise.
     * A stream is considered active if at least one of its MediaStreamTracks is not in the MediaStreamTrack.ended state.
     * Once every track has ended, the stream's active property becomes false.
     */
    get active(): boolean {
        return false;
    }

    /**
     *  A {@DOMString} containing 36 characters denoting a universally unique identifier (UUID) for the object.
     */
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

    /**
     * Stores a copy of the MediaStreamTrack given as argument.
     * If the track has already been added to the MediaStream object, nothing happens.
     * @param track
     */
    addTrack(track: MediaStreamTrack): void {
        throw new Error('not implemented');
    }

    /**
     * Returns a clone of the MediaStream object.
     * The clone will, however, have a unique value for {@link MediaStreamFake.id id}.
     */
    clone(): MediaStream {
        throw new Error('not implemented');
    }

    /**
     * Returns a list of the {@link MediaStreamTrackFake} objects stored in the {@link MediaStreamFake} object that have their kind attribute set to audio.
     * The order is not defined, and may not only vary from one browser to another, but also from one call to another.
     */
    getAudioTracks(): MediaStreamTrackFake[] {
        throw new Error('not implemented');
    }

    /**
     * Returns the track whose ID corresponds to the one given in parameters, trackid.
     * If no parameter is given, or if no track with that ID does exist, it returns null.
     * If several tracks have the same ID, it returns the first one.
     * @param trackId
     */
    getTrackById(trackId: string): MediaStreamTrackFake | null {
        throw new Error('not implemented');
    }

    /**
     * Returns a list of all {@link MediaStreamTrackFake} objects stored in the MediaStream object, regardless of the value of the kind attribute.
     * The order is not defined, and may not only vary from one browser to another, but also from one call to another.
     */
    getTracks(): MediaStreamTrackFake[] {
        return [...this.mediaTracks];
    }

    /**
     * Returns a list of the {@link MediaStreamTrackFake} objects stored in the MediaStream object that have their kind attribute set to "video".
     * The order is not defined, and may not only vary from one browser to another, but also from one call to another.
     */
    getVideoTracks(): MediaStreamTrackFake[] {
        throw new Error('not implemented');
    }

    /**
     * Removes the {@link MediaStreamTrackFake} given as argument.
     * If the track is not part of the MediaStream object, nothing happens.
     * @param track
     */
    removeTrack(track: MediaStreamTrack): void {
        throw new Error('not implemented');
    }
}

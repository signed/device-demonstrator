export type IceCandidateAddedListener = () => void

export class IceCandidates {
    private addListeners: Array<IceCandidateAddedListener> = [];
    private _iceCandidates: Array<RTCIceCandidate> = [];

    addOnAdd(listener: IceCandidateAddedListener) {
        this.addListeners.push(listener);
    }

    removeOnAdd(listener: IceCandidateAddedListener) {
        const index = this.addListeners.indexOf(listener);
        if (-1 === index) {
            throw new Error('why would somebody try to remove a listener that was never added');
        }
        this.addListeners.splice(index, 1);
    }

    add(iceCandidate: RTCIceCandidate) {
        this._iceCandidates.push(iceCandidate);
        this.addListeners.forEach(addListener => addListener());
    }

    get ideCandidates(): Array<RTCIceCandidate> {
        return [...this._iceCandidates];
    }
}

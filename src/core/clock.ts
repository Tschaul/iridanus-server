export class Clock {

    constructor(private startTimestamp: number) {}

    getTimestamp(): number {
        return new Date().getTime() - this.startTimestamp;
    }
}

export class TestClock extends Clock {

    public timestamp: number;

    getTimestamp() {
        return this.timestamp;
    }
}
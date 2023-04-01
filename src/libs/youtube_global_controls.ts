// Inspired by https://github.com/nsrau/react-youtube-iframe/blob/main/src/index.tsx
class YoutubeController {
    iframe: HTMLIFrameElement | null = null;
    volume?: number;
    configure(iframe: HTMLIFrameElement | null) {
        this.iframe = iframe;
        this.iframe?.contentWindow?.postMessage(
            JSON.stringify({
                event: "command",
                func: "getVolume",
            }),
            "*"
        );
    }
    hush() {
        this.iframe?.contentWindow?.postMessage(
            JSON.stringify({
                event: "command",
                func: "getVolume",
            }),
            "*"
        );
        this.iframe?.contentWindow?.postMessage(
            JSON.stringify({
                event: "command",
                func: "setVolume",
                args: [20],
            }),
            "*"
        );
    }
    unhush() {
        this.iframe?.contentWindow?.postMessage(
            JSON.stringify({
                event: "command",
                func: "setVolume",
                args: [this.volume || 60],
            }),
            "*"
        );
    }
}

export const globalYoutubeController = new YoutubeController();

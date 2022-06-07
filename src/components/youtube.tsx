
import React, { useState } from "react";
import styled from "styled-components";

const videosList = [
    ["Royalty Free Workout Music", "https://www.youtube.com/embed/vsNVCvp_j7A"],
    ["Beer with Duncan", "https://www.youtube.com/watch?v=hOML9zwoZn0"],
    [
        "Harder Better Faster Stronger",
        "https://www.youtube.com/watch?v=gAjR4_CbPpQ",
    ],
    ["Thunderstruck", "https://www.youtube.com/watch?v=v2AC41dglnM"],
    ["Roxanne", "https://www.youtube.com/watch?v=3T1c7GkzRQQ"],
    ["Believer", "https://www.youtube.com/watch?v=7wtfhZwyrcc"],
    ["Moral of the Story", "https://www.youtube.com/watch?v=0M1L15hpphQ"],
    ["Sexy and I Know It", "https://www.youtube.com/watch?v=26oIRMdH9AQ"],
    ["Unstoppable", "https://www.youtube.com/watch?v=h3h035Eyz5A"],
    ["Shake It Off", "https://www.youtube.com/watch?v=nfWlot6h_JM"],
    ["Wes Anderson", "https://www.youtube.com/watch?v=oAQNnd7QIkk"],
    ["Panic Station", "https://www.youtube.com/watch?v=vk24UKKI4yY"],
    ["This Year", "https://www.youtube.com/watch?v=ii6kJaGiRaI"],
    ["Don't Stop Me Now", "https://www.youtube.com/watch?v=HgzGwKwLmgM"],
    ["Killer Queen", "https://www.youtube.com/watch?v=2ZBtPf7FOoM"],
];

export const YouTube = () => {
    const [videoId, setVideoId] = useState(
        "https://www.youtube.com/embed/vsNVCvp_j7A"
    ); // Royalty-free workout music
    let videoUrl;

    // Only 'embed' links work in an iframe - let's be nice and normalise if we can.
    // Did the user specify a YouTube URL pattern we recognise? If so, we can extract the video ID.
    const patterns = [
        "https://www.youtube.com/watch?v=",
        "https://youtu.be/",
        "https://www.youtube.com/embed/",
    ];
    patterns.forEach((pattern) => {
        if (videoId.startsWith(pattern)) {
            videoUrl =
                "https://www.youtube.com/embed/" +
                videoId.substring(pattern.length);
        }
    });
    // Otherwise, we assume they specified an ID directly.
    if (!videoUrl) {
        videoUrl = "https://www.youtube.com/embed/" + videoId;
    }
    let iframe: HTMLIFrameElement | null;
    return (
        <YouTubeWrapper>
            <iframe
                width="560"
                height="315"
                src={videoUrl + "?enablejsapi=1"}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                ref={el => { iframe = el }}
            ></iframe>
            <UrlWrapper>
                Video URL:
                <input
                    type="text"
                    value={videoId}
                    onChange={(ev) => setVideoId(ev.target.value)}
                />
            </UrlWrapper>
            {/* Inspired by https://github.com/nsrau/react-youtube-iframe/blob/main/src/index.tsx
            <button onClick={() => {
                iframe?.contentWindow?.postMessage(JSON.stringify({
                    'event': 'command',
                    'func': "playVideo",
                    'args': []
                }), "*")
            }}>Play</button>
            <button onClick={() => {
                iframe?.contentWindow?.postMessage(JSON.stringify({
                    'event': 'command',
                    'func': "pauseVideo",
                    'args': []
                }), "*")
            }}>Pause</button>
            <button onClick={() => {
                iframe?.contentWindow?.postMessage(JSON.stringify({
                    'event': 'command',
                    'func': "setVolume",
                    'args': [20]
                }), "*")
            }}>20</button>
            <button onClick={() => {
                iframe?.contentWindow?.postMessage(JSON.stringify({
                    'event': 'command',
                    'func': "setVolume",
                    'args': [60]
                }), "*")
            }}>60</button> */}
            {videosList.map(([title, url]) => (
                <button onClick={() => setVideoId(url)}>{title}</button>
            ))}
        </YouTubeWrapper>
    );
};

const UrlWrapper = styled.div`
    input {
        width: 300px;
    }
    margin: 8px auto;
    width: 400px;
`;

const YouTubeWrapper = styled.div`
    width: 560px;
    margin: 16px auto;
`;

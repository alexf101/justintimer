import React, { useState } from "react";
import styled from "styled-components";

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
    return (
        <YouTubeWrapper>
            <iframe
                width="560"
                height="315"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            ></iframe>
            <UrlWrapper>
                Video URL:
                <input
                    type="text"
                    value={videoId}
                    onChange={(ev) => setVideoId(ev.target.value)}
                />
            </UrlWrapper>
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

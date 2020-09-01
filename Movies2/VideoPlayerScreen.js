import React from 'react';
import YouTube from 'react-native-youtube';

export default class VideoPlayerScreen extends React.Component {

    render() {

        const APIKEY = "AIzaSyCjvurjwwWWjRWm6UBrI0R3O-YDaLQ-tck"
        const id = this.props.route.params.video.key;

        return (
            <YouTube
                apiKey={APIKEY}
                videoId={id}
                play={true} // control playback of video with true/false
                loop={false} // control whether the video should loop when ended
                fullscreen={true}
                onReady={e => this.setState({ isReady: true })}
                onChangeState={e => this.setState({ status: e.state })}
                onChangeQuality={e => this.setState({ quality: e.quality })}
                onError={e => this.setState({ error: e.error })}
                style={{ alignSelf: 'stretch', height: 300 }}
            />
        );
    }
}

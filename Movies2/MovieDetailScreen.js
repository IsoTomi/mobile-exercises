import React from 'react';
import {
    Text, View, StyleSheet, Image, ScrollView
} from 'react-native';

import { TouchableHighlight } from 'react-native-gesture-handler';

// MovieDetailScreen - default class
export default class MovieDetailScreen extends React.Component {
    // constructor - method
    constructor(props) {
        super(props);
        this.state = { genres: [], runtime: 0, homepage: "", videos: [] };
    }

    componentDidMount() {
        this.getMovieDetails();
    }

    // getMovieDetails - method
    async getMovieDetails() {
        let APIKEY ="ffb613665afada601ff38fc6850e076a";
        // Get the movie ID code from props.
        let id = (this.props.route.params.movie.id).toString();
        let response = await fetch('https://api.themoviedb.org/3/movie/' + id + '?api_key=' + 
            APIKEY + '&append_to_response=videos');
        let data = await response.json();

        // Map the genres from response data.
        let genres = data.genres.map((index) => {
            return index.name;
        });

        // Map the videos from response data.
        let videos = data.videos.results.map((index) => {
            return index;
        })

        this.setState({genres: genres, runtime: data.runtime, homepage: data.homepage, 
            videos: videos});
    }

    // videoItemPressed - method
    videoItemPressed = (index) => {
        this.props.navigation.navigate("VideoPlayer", {video: this.state.videos[index]});
    }

    // render - method
    render() {
        const { route } = this.props;
        const { movie } = route.params;

        let IMAGEPATH = 'http://image.tmdb.org/t/p/w500';
        let imageurl = IMAGEPATH + movie.backdrop_path;

        // Genres
        let genres = this.state.genres.map((name) => {
            return (
                <Text>{name} </Text>
            )
        });

        // Videos
        var videos = this.state.videos.map(function(video,index){
            return (
                <TouchableHighlight onPress={_ => this.videoItemPressed(index)}
                    underlayColor="lightgray" key={index}>
                    <Text video={video} key={index} style={styles.videoLink}>{video.name}</Text>
                </TouchableHighlight>
            )
        }.bind(this));

        return (
            <View>
                <Image source={{uri: imageurl}} style={styles.image} />
                <Text style={styles.title}>{movie.title}</Text>
                <Text style={styles.info}>{movie.release_date}</Text>
                <Text style={styles.text}>{movie.overview}</Text>
                <Text style={styles.info}>Genres: {genres}</Text>
                <Text style={styles.info}>Runtime: {this.state.runtime}</Text>
                <Text style={styles.info}>Homepage: {this.state.homepage}</Text>
                <Text style={styles.info}>Videos: </Text>
                <ScrollView>
                    {videos}
                </ScrollView>
                
            </View>
        );
    }
}

const styles = StyleSheet.create({
    image: {
      aspectRatio: 670/250
    },
    title: {
      fontWeight: 'bold',
      fontSize: 15
    },
    text: {
      fontSize: 12,
      flexWrap: 'wrap'
    },
    info: {
        fontSize: 12,
        marginTop: 2,
        marginBottom: 2
    },
    videoLink: {
        color: 'blue'
    }
  });
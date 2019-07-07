import React, { Component } from 'react';
import './Home.css';
import '../../assets/font-awesome-4.7.0/css/font-awesome.min.css'
import { withStyles } from '@material-ui/core/styles';
import Header from '../../common/header/Header';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';

const styles = theme => ({
    nullRestaurantList: {
        marginTop: 15,
        marginLeft: 25,
    },
    restaurantCardsGridList: {
        margin: 'auto',
    },
    restaurantCard: {
        width: 250,
        maxWidth: 250,
        height: 340,
        maxHeight: 340,
        marginTop: 15,
        marginBottom: 10,
        marginLeft: 25,
        marginRight: 5,
        paddingBottom: 15,
        cursor: 'pointer',
    },
    restaurantCardMedia: {
        height: 140
    },
    restaurantName: {
        marginBottom: 20,
    },
    ratingAvgRateDiv: {
        position: 'absolute',
        bottom: 20,
    },
    restaurantRatingDiv: {
        backgroundColor: '#EACC5E',
        width: 100,
        textAlign: 'center',
        float: 'left'
    },
    restaurantRatingText: {
        color: 'white',
    },
    restaurantAvgRateText: {
        marginLeft: 30,
        float: 'right',
    },
});

class Home extends Component {

    constructor() {
        super();
        this.state = {
            restaurants: [],
            cards: 2,
        }
    }
    searchHandler = (query) => {
        let that = this;
        let dataRestaurants = null;
        let xhrRestaurants = new XMLHttpRequest();
        xhrRestaurants.addEventListener('readystatechange', function () {
            if (this.readyState === 4) {
                if (!JSON.parse(this.responseText).restaurants) {
                    that.setState({
                        restaurants: null,
                    })
                } else {
                    that.setState({
                        restaurants: JSON.parse(this.responseText).restaurants,
                    })
                }
            }
        })
        if (query === '') {
            xhrRestaurants.open('GET', `${this.props.baseUrl}/restaurant`);
        } else {
            xhrRestaurants.open('GET', `${this.props.baseUrl}/restaurant/name/`+query);
        }
        xhrRestaurants.send(dataRestaurants);
    }  


    render() {
        const { classes } = this.props;
        return (
            <div>
                {/* header with search box */}
                <Header
                    showSearchBox="true"
                    searchHandler={this.searchHandler}
                />

              
            </div>
        );
    }
}

export default withStyles(styles)(Home);

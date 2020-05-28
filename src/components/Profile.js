import React, { Component } from "react";
import {DebounceInput} from 'react-debounce-input';

import "./Profile.css";

const PROFILE_API_URL = 'http://127.0.0.1:8000/users/';
const DEBOUNCE_DELAY = 500;

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: 0,
            userData: [],
            isLoading: false,
            showDetail: false
        };
    }

    componentDidMount() {
        this.fetchUserHistory();
    }

    fetchUserHistory(q){
        let p = new URLSearchParams();
        p.append('q', q || '');
        fetch(
            PROFILE_API_URL + '?' + p,
            {
                method: "GET",
                mode: "cors"
            }
        )
            .then(response => response.json())
            .then(data => {
                this.setState({
                        userCount: data.count,
                        userData: data.results,
                        isLoading: false
                    });
            })
            .catch(error => console.error("Error:", error))

    }

    handleOnInputChange = (search) => {
        this.setState({
            userData:[],
            isLoading: true
        });

        this.fetchUserHistory(search)
    }

    handleOnClick = (userID) => {
        console.log(this.renderUserDetail(userID));
        return this.renderUserDetail();
    }

    renderUserList = () => {

        if (this.state.userData && this.state.isLoading){
            return ;
        }

        return this.state.userData.map((userInfo, index) => {
            const {username,first_name, last_name, email, status} = userInfo;
            return (

                <ul key={index} ><h3>{username}</h3>
                    <li>Username: </li>
                    <li>Name: {first_name} {last_name}</li>
                    <li>Email: {email}</li>
                    <li>User Status: {status}</li>
                </ul>

            );
        });
    }
    render() {
        return(
            <div className="wrapper">
                <div>
                    <h2>User Profile Search</h2>
                </div>
                <div className="control">
                    <DebounceInput
                        minLength={2}
                        debounceTimeout={DEBOUNCE_DELAY}
                        onChange={e => this.handleOnInputChange(e.target.value)}/>
                </div>
                <div className="list is-hoverable">
                    {this.renderUserList() == '' ? <p>User Name Not Found!</p>: this.renderUserList()}

                </div>
            </div>
        );
    }
}

export default Profile;

import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody } from 'reactstrap'
import Button from 'react-bootstrap/Button';
import axios from "axios";
import emptystar from "../star_favorite_favorite_favorite_favorite_2359.png"
import fullstar from "../star_favorite_favorite_favorite_favorite_2360.png"
import halfstar from "../star_favorite_favorite_favorite_favorite_2361.png";

import {APP_URL} from "../environment";
import LabelList from "./LabelList";
import StarRatingComponent from 'react-star-rating-component';
import CreateOrEditApp from "./CreateOrEditApp";

class ModalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAppDetails: false,
            modalEditApp: false,
            added_app: false,
            id_user:0,
            labels:[],
            rating:props.item.rank,
            nb_ratings:0
        }
        this.addAppToDashBoard=this.addAppToDashBoard.bind(this);
        this.deleteAppFromDashBoard=this.deleteAppFromDashBoard.bind(this);
        this.deleteApp=this.deleteApp.bind(this);
        this.addRank=this.addRank.bind(this);
        this.editRank=this.editRank.bind(this);
        this.hasRank=this.hasRank.bind(this);
        this.getUser();
        this.getLabels();
        this.getNbRating()
    }

    getLabels(){
        axios.get(APP_URL+'/app/'+this.props.item.id_app+'/labels',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(items => {
                if(items!==null) {
                    this.setState(
                        {
                            labels: items
                        }
                    )
                }
            })
            .catch(err => console.log(err))

    }

    hasDownloadedApp(){
        axios.get(APP_URL+'/user/'+this.state.id_user+'/hasdownloadedapp/'+this.props.item.id_app,{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(res => this.setState(
                {
                    added_app:res.hasApp
                })
            )
            .catch(err => console.log(err))
    }

    getUser(){
        axios.get(APP_URL+'/user',{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(item => this.setState(
                {
                    id_user:item.id_user
                })
            )
            .then(() => this.hasDownloadedApp())
            .catch(err => console.log(err))
    }

    addAppToDashBoard(){
        axios.post(APP_URL+'/user/mydownloadedapps',{
            id_user: this.props.id_user,
            id_app: this.props.item.id_app
        },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:true
                })
            )
            .then(() =>{
                if(this.props.addAppToDashBoard){
                    this.props.addAppToDashBoard(this.props.item)
                }
            })
            .catch(err => console.log(err))
    }

    deleteAppFromDashBoard(){
        axios.delete(APP_URL+'/user/mydownloadedapps',{
            headers:{
                Authorization:localStorage.getItem('token'),
                id_user: this.props.id_user,
                id_app: this.props.item.id_app,
            }
        },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:false
                })
            )
            .then(() => {
                if(this.props.deleteDownloadedApp){
                    this.props.deleteDownloadedApp(this.props.item.id_app)
                }
            })
            .catch(err => console.log(err))
    }

    getNbRating(){
        axios.get(APP_URL+'app/nbrank', {
            headers: {
                Authorization: localStorage.getItem('token'),
                id_app: this.props.item.id_app
            }
        })
            .then(response => response.data)
            .then(res => this.setState({nb_ratings:res.nb_ratings}))
            .catch(err => err)

    }

    hasRank(){
        axios.get(APP_URL+'/user/app/rank',{
            headers:{
                Authorization:localStorage.getItem('token'),
                id_user: this.props.id_user,
                id_app: this.props.item.id_app
            }
        })
            .then(response => response.data)
            .then(res => {
                if(res.hasRank){
                    this.editRank()
                }
                else{
                    this.addRank()
                }
                })
            .then(() => this.hasDownloadedApp())
            .catch(err => console.log(err))
    }

    addRank(){
        axios.post(APP_URL+'/user/app/rank',{
            id_user: this.props.id_user,
            id_app: this.props.item.id_app,
            rank: this.state.rating
        },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(() => {
                const nb_ratings = this.state.nb_ratings;
                const new_rating = this.state.rating;
                const actual_rating = this.props.item.rank;
                this.setState({rating:(actual_rating*nb_ratings+new_rating)/(nb_ratings+1)})
            })

            .catch(err => console.log(err))
    }

    editRank(){
        axios.put(APP_URL+'/user/app/rank',{
            id_user: this.props.id_user,
            id_app: this.props.item.id_app,
            rank: this.state.rating
        },{
            headers:{
                Authorization:localStorage.getItem('token')
            }
        })
            .then(() => {
                const nb_ratings = this.state.nb_ratings;
                const new_rating = this.state.rating;
                const actual_rating = this.props.item.rank;
                this.setState({rating:(actual_rating*(nb_ratings-1)+new_rating)/nb_ratings})
            })
            .catch(err => console.log(err))
    }

    deleteApp(){
        axios.delete(APP_URL+'/app',{
            headers:{
                Authorization:localStorage.getItem('token'),
                id_user: this.props.id_user,
                id_app: this.props.item.id_app
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:false
                })
            )
            .then(this.props.deleteApp(this.props.item.id_app))
            .catch(err => console.log(err))
    }


    toggleModalDetailsApp = () => {
        this.setState(prevState => ({
            modalAppDetails: !prevState.modalAppDetails
        }))
    }

    toggleModalEditApp = () => {
        this.setState( prevState => ({
            modalEditApp: !prevState.modalEditApp
        }))
    }

    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
        this.hasRank()
    }

    componentWillUnmount() {
    }


    componentDidMount() {
        this.getLabels();
    }



    render() {
        const closeBtn = <Button className="close" onClick={this.toggleModalDetailsApp}>&times;</Button>;
        const closeEditBtn = <Button className="close" onClick={this.toggleModalEditApp}>&times;</Button>;

        const editBtn = () =>{
            if(this.props.deleteApp) {
                return <Button onClick={this.toggleModalEditApp}>Edit App</Button>
            }
           else{
               return ''
            }
        };
        const modalEdit = () => {
            if(this.props.deleteApp) {
                return <Modal isOpen={this.state.modalEditApp} toggle={this.toggleModalEditApp}
                              className={this.props.className}>
                    <ModalHeader toggle={this.toggleModalEditApp} close={closeEditBtn}>Edit an App</ModalHeader>
                    <ModalBody>
                        <CreateOrEditApp item={this.props.item} handleClose={this.toggleModalEditApp} editApp={this.props.editApp}
                                         oldLabels={this.state.labels}/>
                    </ModalBody>
                </Modal>
            }
            else{
                return ''
            }
        }

        const addBtn =  () => {
            if(this.state.added_app){
                return <Button className="delete" onClick={this.deleteAppFromDashBoard}>Remove from my Dashboard</Button>
            }
            else{
                return <Button className="add" onClick={this.addAppToDashBoard}>Add to my Dashboard</Button>
            }
        };

        const link = () =>{
            if(this.props.item.link_app!==''){
                return <a href={this.props.item.link_app} target="external"><Button>Open</Button></a>
            }
            else{
                return ''
            }
        };

        const deleteBtn = () =>{
            if(this.props.item.id_user===this.props.id_user){
                return <Button onClick={this.deleteApp.bind(this)}>Del</Button>
            }
            else{
                return ''
            }
        }

        const labels = () =>{
            if(this.state.labels!==[]){
                return <LabelList items={this.state.labels}/>
            }
            else{
                return <h5>No labels</h5>
            }
        }

        return (
                <tr key={this.props.item.id_app}>
                    <td onClick={this.toggleModalDetailsApp}>{this.props.item.name_app}</td>
                    <td onClick={this.toggleModalDetailsApp}>{this.props.item.name_user}</td>
                    <td><div style={{fontSize: 24}}>
                        <StarRatingComponent
                            id={this.props.item.id_app+this.props.item.name_app}
                            name="rank"
                            starCount={5}
                            starHoverColor='rgb(255,0,0)'
                            value={this.state.rating}
                            editing={this.props.item.id_user!==this.state.id_user}
                            onStarClick={this.onStarClick.bind(this)}
                            renderStarIcon= {(index, value) => {
                                return (
                                    <span>
                                        {index <= value?<img src={fullstar}/>:<img src={emptystar}/>}
                                    </span>
                                );
                            }}
                            renderStarIconHalf={() => {
                                return (
                                    <span>
                                        <img src={halfstar}/>
                                    </span>
                                );
                            }} />
                    </div></td>
                    <td>{addBtn()}</td>
                    <td>{deleteBtn()}</td>
                    <td>{editBtn()}
                    {modalEdit()}
                    <Modal isOpen={this.state.modalAppDetails} toggle={this.toggleModalDetailsApp} className={this.props.className}>
                        <ModalHeader toggle={this.toggleModalDetailsApp} close={closeBtn}>{this.props.item.name_app}</ModalHeader>
                        <ModalBody>
                            <div>
                                Description : {this.props.item.description_app}<br/>
                                {link()}<br/>
                                {labels()}
                                {addBtn()}
                            </div>
                        </ModalBody>
                    </Modal>
                    </td>
                </tr>

        )
    }
}

export default ModalForm
import React, { Component } from 'react'
import {Modal, ModalHeader, ModalBody } from 'reactstrap'
import Button from 'react-bootstrap/Button';
import axios from "axios";
import emptystar from "../assets/images/star_favorite_favorite_favorite_favorite_2359.png"
import fullstar from "../assets/images/star_favorite_favorite_favorite_favorite_2360.png"
import halfstar from "../assets/images/star_favorite_favorite_favorite_favorite_2361.png";

import {APP_URL} from "../environment";
import LabelList from "./LabelList";
import StarRatingComponent from 'react-star-rating-component';
import CreateOrEditApp from "./CreateOrEditApp";

class AppDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalAppDetails: false,
            modalEditApp: false,
            modalCheckDelete: false,
            added_app: false,
            labels:[],
            rating:props.item.rating
        };

        this.addAppToDashBoard=this.addAppToDashBoard.bind(this);
        this.deleteAppFromDashBoard=this.deleteAppFromDashBoard.bind(this);
        this.deleteApp=this.deleteApp.bind(this);
        this.addRating=this.addRating.bind(this);
        this.editRating=this.editRating.bind(this);
        this.hasRating=this.hasRating.bind(this);
        this.hasAppOnDashBoard=this.hasAppOnDashBoard.bind(this);
        this.getLabels();
        this.hasAppOnDashBoard();
    }

    /**
     * getLabels: send a request to server to have labels of the app and set labels state with them
     */
    getLabels(){
        axios.get(APP_URL+'/app/'+this.props.item.id_app+'/labels',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
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

    /**
     * hasAppOnDashboard: send a request to know if the app has been added on the dashBoard and set the added_app state with this boolean
     */
    hasAppOnDashBoard(){
        axios.get(APP_URL+'/user/'+this.props.id_user+'/hasappondashboard/'+this.props.item.id_app,{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
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


    /**
     * addAppToDashBoard: send a request to server to add the app on user dashBoard and set added_app state to true
     */
    addAppToDashBoard(){
        axios.post(APP_URL+'/user/myappsondashboard',{
            id_user: this.props.id_user,
            id_app: this.props.item.id_app
        },{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            //the app is added to dashBoard
            .then(() => this.setState(
                {
                    added_app:true
                })
            )
            //trigger addAppToDashBoard function of parent component (AppList) to add the app on the list of Component
            .then(() =>{
                if(this.props.addAppToDashBoard){
                    this.props.addAppToDashBoard(this.props.item)
                }
            })
            .catch(err => console.log(err))
    }

    /**
     * deleteAppFromDashBoard: send a request to server to delete app from dashBoard
     */
    deleteAppFromDashBoard(){
        axios.delete(APP_URL+'/user/'+this.props.id_user+'/myappsondashboard/'+this.props.item.id_app,{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:false
                })
            )
            //trigger deleteAppFromDashBoard function of parent component (AppList) to delete the app from the list of Component
            .then(() => {
                if(this.props.deleteAppFromDashBoard){
                    this.props.deleteAppFromDashBoard(this.props.item.id_app)
                }
            })
            .catch(err => console.log(err))
    }

    /**
     * hasRating: triggered after user rate the app
     * request the server to know if actual user has rated the app and then create or edit the rating of him on app, depending of result
     */
    hasRating(){
        axios.get(APP_URL+'/user/'+this.props.id_user+'/app/'+this.props.item.id_app+'/rating',{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(res => {
                //if he has already rated the app, edit his rating
                if(res.hasRating){
                    this.editRating()
                }
                //else, create his rating
                else{
                    this.addRating()
                }
                })
            .then(() => this.hasAppOnDashBoard())
            .catch(err => console.log(err))
    }

    /**
     * addRating: request the server to add rating of user on app
     */
    addRating(){
        axios.post(APP_URL+'/user/app/rating',{
            id_user: this.props.id_user,
            id_app: this.props.item.id_app,
            rating: this.state.rating
        },{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(()=>this.setState({rating:this.props.rating}))
            .catch(err => console.log(err))
    }

    /**
     * editRating: request the server to edit rating of user on app
     */
    editRating(){
        axios.put(APP_URL+'/user/app/rating',{
            id_user: this.props.id_user,
            id_app: this.props.item.id_app,
            rating: this.state.rating
        },{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(()=>this.setState({rating:this.props.rating}))
            .catch(err => console.log(err))
    }

    /**
     * deleteApp: request the server to delete an app
     */
    deleteApp(){
        axios.delete(APP_URL+'/user/'+this.props.id_user+'/app/'+this.props.item.id_app,{
            headers:{
                Authorization:'Bearer '+localStorage.getItem('token')
            }
        })
            .then(response => response.data)
            .then(() => this.setState(
                {
                    added_app:false
                })
            )
            .then(this.toggleModalCheckDeleteApp)
            //trigger the parent component function to delete app from list
            .then(this.props.deleteApp(this.props.item.id_app))
            .catch(err => console.log(err))
    }

    /**
     * toggleModalDetailsApp: change state of modalAppDetails to open and close the modal
     */
    toggleModalDetailsApp = () => {
        this.setState(prevState => ({
            modalAppDetails: !prevState.modalAppDetails
        }))
    };

    /**
     * toggleModalEditApp: change state of modalEditApp to open and close the modal
     */
    toggleModalEditApp = () => {
        this.setState( prevState => ({
            modalEditApp: !prevState.modalEditApp
        }))
    };

    toggleModalCheckDeleteApp = () => {
        this.setState( prevState => ({
        modalCheckDelete: !prevState.modalCheckDelete
        }))
    };

    /**
     * onStarClick: store in rating state the rating given by the user on the app and save this rating
     * @param nextValue: the value of Star component after user rated the app, his rating
     * @param prevValue: the value of star component before user rated the app, the average rating
     * @param name
     */
    onStarClick(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
        //request the server to save it
        this.hasRating()
    }

    componentWillUnmount() {
    }


    componentDidMount() {
        this.getLabels();
        this.hasAppOnDashBoard()
    }



    render() {
        const closeBtn = <Button className="close" onClick={this.toggleModalDetailsApp}>&times;</Button>;
        const closeEditBtn = <Button className="close" onClick={this.toggleModalEditApp}>&times;</Button>;
        const closeCheckDeleteBtn = <Button className="close" onClick={this.toggleModalCheckDeleteApp}>&times;</Button>;

        const editBtn = () =>{
            if(this.props.deleteApp) {
                return <Button className="editAppBtn" onClick={this.toggleModalEditApp}>Edit App</Button>
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
                return <Button className="delete" onClick={this.deleteAppFromDashBoard}>Remove from my DashBoard</Button>
            }
            else{
                return <Button className="add" onClick={this.addAppToDashBoard}>Add to my DashBoard</Button>
            }
        };

        const link = () =>{
            if(this.props.item.link_app!==''){
                return <a href={this.props.item.link_app} target="external"><Button>Open</Button></a>
            }
            else{
                return <i>No link</i>
            }
        };

        const deleteBtn = () =>{
            if(this.props.deleteApp){
                return <Button className="deleteApp" onClick={this.toggleModalCheckDeleteApp}>Del</Button>
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
                    <td onClick={this.toggleModalDetailsApp} className="name_app">{this.props.item.name_app}</td>
                    <td onClick={this.toggleModalDetailsApp} className="name_creator">{this.props.item.name_user}</td>
                    <td><div style={{fontSize: 24}}>
                        <StarRatingComponent
                            className="star_component"
                            id={this.props.item.id_app+this.props.item.name_app}
                            name="rating"
                            starCount={5}
                            starHoverColor='rgb(255,0,0)'
                            value={this.state.rating}
                            editing={this.props.item.id_creator!==this.props.id_user}
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
                    <td>{link()}</td>
                    <td>{addBtn()}</td>
                    <td>{deleteBtn()}
                        <Modal isOpen={this.state.modalCheckDelete} toggle={this.toggleModalCheckDeleteApp} className={this.props.className}>
                            <ModalHeader toggle={this.toggleModalCheckDeleteApp} close={closeCheckDeleteBtn}>{this.props.item.name_app}</ModalHeader>
                            <ModalBody>
                                <div>
                                    <h4>Do you really want to delete {this.props.item.name_app} ?</h4><br/>
                                    <Button onClick={this.deleteApp.bind(this)}>Yes</Button><Button onClick={this.toggleModalCheckDeleteApp}>No</Button>
                                </div>
                            </ModalBody>
                        </Modal>
                    </td>
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

export default AppDetails
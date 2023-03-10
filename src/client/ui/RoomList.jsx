const React = require('react');
const GridList = require('material-ui/GridList')['default'];
const GridTile = require('material-ui/GridList')['GridTile'];
const FlatButton = require('material-ui/FlatButton')['default'];
const Dialog = require('material-ui/Dialog')['default'];
const TextField = require('material-ui/TextField')['default'];
const Client = require('../Client');
const Event = require('../../common/Event');

class RoomList extends React.Component {

    constructor(prop) {
        super(prop); // onJoinRoom
        this.state = {
            password: '',
            rooms: [],
            roomForPassword: null,
            errmsg: '',
            open: false,
            clickSubmit: false
        };
        this.handlePassword = this.handlePassword.bind(this);
        this.onCancel = this.onCancel.bind(this);
        this.onSubmitPw = this.onSubmitPw.bind(this);
    }

    componentDidMount() {
        Client.current.listRooms((data) => {
            //console.log(data);
            this.setState({rooms: data});
        });
        Client.current.subscribe(Event.ROOMS_CHANGE, (data) => {
            this.setState({rooms: data});
        });
    }

    onClickJoinRoom(room) {
        if (room.password) {
            this.setState({roomForPassword: room, open: true});
            // console.log('check click join');
            // console.log(this);
        } else {
            // console.log('check click join');
            // console.log(this);
            Client.current.joinRoom(room.id, null, (data) => {
                if (data.ret === 0) {
                    this.setState({roomForPassword: null});
                    room.existPlayers = data.existPlayers || [];
                    this.props.onJoinRoom(room);
                }
            });
        }
    }

    onSubmitPw(room, password) {
        console.log('check onsubmit');
        if (room === null || this.state.clickSubmit === false) return;
        Client.current.joinRoom(room.id, password, (data) => {
            if (data.ret === -2) {
                this.setState({errmsg: '????????????'})
            } else if (data.ret === 0) {
                this.setState({roomForPassword: null, errmsg: '', open: false});
                room.existPlayers = data.existPlayers || [];
                this.props.onJoinRoom(room);
            }
        });
    }
    // TODO ????????????????????????
    onCancel() {
        this.setState({roomForPassword: null, errmsg: '', open: false});
        console.log(this);
    }

    handlePassword(_, value) {
        this.setState({password: value});
    }

    handleClickSubmit() {
        this.setState({clickSubmit: true});
        this.onSubmitPw(this.state.roomForPassword, this.state.password);
    }

    render() {
        const actions = [
            <FlatButton
                label="??????"
                primary={true}
                onClick={this.handleClickSubmit.bind(this)}/>,
                // onClick={this.onSubmitPw(this.state.roomForPassword, this.state.password)}/>,
            <FlatButton
                label="??????"
                primary={true}
                onClick={this.onCancel}/>
        ];
        return (
            <div style={{position: 'absolute', bottom: 0, top: '64px', left: 0, right: 0}}>
                {
                    this.state.rooms.length === 0 ?
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center'}}>
                            <p style={{margin: 0, textAlign: 'center', width: '100%'}}>???????????????????????????</p>
                        </div>
                     :
                    <GridList
                        cellHeight={180}
                        padding={10}
                        style={{width: '100%', margin: 0}}
                        cols={4}>
                        {this.state.rooms.map((tile) => (
                            <GridTile
                                key={tile.id}
                                title={tile.name}
                                actionIcon={<FlatButton
                                    label={'join'} style={{color: 'white', marginRight: '7px'}}
                                    onClick={this.onClickJoinRoom.bind(this, tile)}/>}>
                                <img
                                    src={'images/' + (tile.type === 1 ? 'turingmachine.jpg' : tile.type === 2 ?'hanoi.jpg':'sort.jpg')}
                                    style={{height: '100%', width: 'auto', minHeight: '100%', minWidth: '100%'}} />
                            </GridTile>
                        ))}
                    </GridList>
                }
                <Dialog
                    title={'???????????????'}
                    actions={actions}
                    open={this.state.open}
                    contentStyle={{width: '304px'}}>
                    <p style={{color: 'red', fontSize: '12px', margin: 0}}>{this.props.errmsg}</p>
                    <TextField
                        hintText="??????"
                        floatingLabelText="??????"
                        value={this.state.password}
                        onChange={this.handlePassword}/>
                </Dialog>
            </div>
        );
    }

}

// class PwDialog extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.state = {
//             password: '',
//             open : true,
//         };
//
//         this.handlePassword = this.handlePassword.bind(this);
//         this.handleClickCancel = this.handleClickCancel.bind(this);
//     }





module.exports = RoomList;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
import axios from 'axios'
import socketClient from 'socket.io-client'

//Socket io client
const socket = socketClient('http://localhost:4000')
socket.on('connect', () => console.log('[SOCKET] Connect => Estabeleceu nova conexão'))

const Play = props => {

    const roomID = props.match.params.id
    const [token, setToken] = useState(localStorage.getItem('app-token'))
    const [userInf, setUserinf] = useState({})
    const [avatar, setAvatar] = useState([])
    const [roomInf, setRoomInf] = useState([])
    const [uploadError, setUploadError] = useState(null)
    const [progressBar, setProgressBar] = useState(0)
    const [messages, setMessages] = useState([])

    const [expec, setExpec] = useState({})
    const [players, setPlayers] = useState({})
    const [npc, setNpc] = useState({1: {name: 'npc 1'}, 2: {name: 'npc 2'}})
    
    useEffect( () => {
        async function fecthData() {
            await axios.post('http://localhost:4444/v1/api/userinf',{token: token})
            .then(response => {
                return response.data
            })
            .then(data => {
                setUserinf(data)
            })
            .catch(err => alert('Erro, entre em contato com o suporte técnico', err))
        }
        fecthData()
    },[token])
    
    useEffect(() => {
        const fecthData = async () => {
            await axios.post('http://localhost:4444/v1/api/playroom', {id: roomID})
            .then(response => {
                return response.data
            })
            .then(data => {
                setRoomInf(data)
            })
            .catch(err => console.log('Erro, entre em contato com o suporte técnico', err))
        }
        fecthData()
    },[roomID])

    useEffect(() => {
        if (userInf.id !== undefined){
            socket.emit('userInfo', userInf)
            socket.emit('Adicionar a sala', roomID)
        }
    },[userInf])
    
    useEffect(()=>{
        if(!!avatar.length){
            setUploadError(null)
            setProgressBar(0)
        } else{
            const msg = <div className='alert alert-danger mt-sm-2 text-sm'>imagem inválida</div>
            setUploadError(msg)
        }
        
    },[avatar])
    
    useEffect(() => {
        const newMessages = newMessage => {
            setMessages([...messages, newMessage])
        }
        socket.on('Mensagens recebidas', newMessages)
        return () => socket.off('Mensagens recebidas', newMessages)
    },[messages])

    useEffect(() => {
        const expectedList = expectadores => {
            setExpec(expectadores)
        }
        socket.on('Lista de expectadores', expectedList)
        return () => socket.off('Lista de expectadores', expectedList)
    },[expec])

    useEffect(() => {
        const playersList = jogadores => {
            setPlayers(jogadores)
        }
        socket.on('Lista de jogadores', playersList)
        return () => socket.off('Lista de jogadores', playersList)
    },[players])

    const createdData = userInf.createdAt
  
    const avatarChange = e => {
        setAvatar(e.target.files)
        return e.target.files
    }

    const avatarUpload = async (values, {setSubmitting, setErrors, setStatus, resetForm}) => {
        const data = new FormData();
        data.append('avatar', avatar[0])
        data.append("username", userInf.username)
        const config = {
            headers: {'Content-Type': 'multipart/form-data' },
            onUploadProgress: function(progressEvent) {
                setProgressBar(Math.round((progressEvent.loaded * 100) / progressEvent.total))
            }
        }
        
        await axios.post('http://localhost:4444/v1/api/uploadAvatar', data, config)
        .then(response => {
            localStorage.removeItem('app-token')
            localStorage.setItem('app-token', response.data)
            setToken(localStorage.getItem('app-token'))
        })
        .catch(err => console.log(err))
        
    }
    
    const acceptExpecForPlayer = expectador => {
        if(userInf.username === roomInf.owner) {
            socket.emit('Remover expectador', expectador)
        } else {
            alert('Somente o Dono da sala pode aceitar jogadores')
        }
    }

    const sendMessageForAll = e => {
        if (e === '') {
            return alert('Digite uma mensagem para ser enviada')
        } else {
            socket.emit('Enviar mensagem para todos', {username: userInf.username, message: e})
            e =''
        }
    }
    
    socket.on('Notification', notificacao => {
        alert(notificacao)
    })

return (
    <>
    {/* Header */}
        <div className='border-bottom border-primary fixed-top'>
        <div className='row'>
          <nav className='navbar navbar-expand navbar-dark bg-dark w-100'>
            <div className='col-4 d-flex align-items-start'>
                <a className="btn btn-primary" href="/panel" onClick={()=>{socket.disconnect()}}>Sair da sala</a>
            </div>
            <div className="col-4 d-flex justify-content-center align-items-center">
                <h4>{roomInf.name}</h4>
            </div>
            <div className='col-4 d-flex align-items-center justify-content-end'>
                <div className="dropdown text-center">
                    <div type="button" id="dropdownperfil" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img style={{width: '40px', height: '40px', borderRadius: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={userInf.avatar} alt="avatar" />
                    </div>
                <div className="dropdown-menu dropdown-menu-right text-center" aria-labelledby="dropdownperfil">
                    <div className="card-header">
                        <img style={{width: '100px', height: '100px', borderRadius: '50%', display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src={userInf.avatar} alt="avatar" /><br />
                        <button type="button" className="btn btn-primary btn-sm" style={{marginTop: '16px'}} data-toggle="modal" data-target="#uploadimgModal">
                            Alterar
                        </button>
                    </div>
                    <div className="card-body text-dark">
                        <h6>Conta: <span id="logado-text">{userInf.type}</span></h6>
                        <h6>Nickname: {userInf.username}</h6>
                        <h6>Créditos: <span id="showcredit">{userInf.atlaaCoins}</span></h6>
                    </div>
                    <div className="card-footer text-dark">
                        <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                            <a className="nav-link active" id="v-pills-lobby-tab" data-toggle="pill" href="#v-pills-lobby" role="tab" aria-controls="v-pills-lobby" aria-selected="true">Lobby</a>
                            <a className="nav-link" id="v-pills-opt-tab" data-toggle="pill" href="#v-pills-opt" role="tab" aria-controls="v-pills-opt" aria-selected="false">Opções</a>
                            <a className="nav-link" href="/" role="tab">Sair</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
          </nav>
        </div>
      </div>
    {/* Body */}
        <div className="tab-content justify-content-center" style={{margin:"3%"}}>
        <div className="tab-pane fade show active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
            <div className="row">
                <div className="col-2 pl-4 pt-5">
                    <div id="listaNPC" className="mt-5">
                        {Object.keys(npc).map(key => {
                            return (
                                <div key={key} className="card card-custom-grey mt-2">
                                    <div className="card-body">
                                        <p>{npc[key].name}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div id="listaPlayers">
                        {Object.keys(players).map(key => {
                            return (
                                players[key].roomID === roomID
                                ?<div key={key} className="card card-custom-grey mt-2">
                                    <div className="card-body">
                                        <p>{players[key].username}</p>
                                    </div>
                                </div>
                                :null
                            )
                        })}
                    </div>
                </div>
                <div className="col-8">
                    <div className="card card-custom shadow-lg mt-1 text-light h-100">
                        <div className="card-body">
                            <div className="tab-content" id="v-pills-tabContent">

                                <div className="tab-pane fade show active" id="v-pills-lobby" role="tabpanel" aria-labelledby="v-pills-lobby-tab">
                                    <nav className="navbar justify-content-center navbar-dark">
                                        <ul className="d-flex justify-content-center nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" id="pills-chatmesa-tab" data-toggle="pill" href="#pills-chatmesa" role="tab" aria-controls="pills-chatmesa" aria-selected="false">CHAT MESA</a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-chatgeral-tab" data-toggle="pill" href="#pills-chatgeral" role="tab" aria-controls="pills-chatgeral" aria-selected="false">CHAT GERAL</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <div className="tab-content" id="pills-tabContent">

                                        <div className="tab-pane fade show active" id="pills-chatmesa" role="tabpanel" aria-labelledby="pills-chatmesa-tab">
                                            <div className="container-fluid">
                                                <div className="row d-flex align-items-start">
                                                    <div className="col-12 border border-primary" id="getDiv">
                                                        <div id="conteudo-chat-mesa" className="form-control text-light chat chat-mesa">
                                                            {messages.map((m, i) => {
                                                                return (
                                                                <p key={i}><span style={{color: roomInf.owner === m.username ? 'red' : 'green'}}>{m.username}: </span>{m.message}</p>
                                                                )
                                                            }).reverse()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row d-flex align-items-end mt-3">
                                                    <div className="col-8 border border-primary">
                                                        <form id="form-chat-mesa" onSubmit={e => {e.preventDefault();sendMessageForAll(e.target.cmmsg.value)}}>
                                                            <div className="form-row">
                                                                <div className="col-11 text-center">
                                                                    <textarea type="text" name="cmmsg" id="cmmsg" className="form-control text-light chat" placeholder="Mensagem..."></textarea>
                                                                </div>
                                                                <div className="col-1 d-flex align-items-center">
                                                                    <button className="btn btn-primary" type="submit">Enviar</button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="col-4 col-icon d-flex align-items-center text-center">
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="tab-pane fade" id="pills-chatgeral" role="tabpanel" aria-labelledby="pills-chatgeral-tab">
                                            <div className="container-fluid">
                                                <div className="row d-flex align-items-start">
                                                    <div className="col-12 border border-primary" id="conteudo-chat-geral">
                                                        <textarea type="text" className="form-control text-light chat chat-geral" readOnly placeholder="Nenhuma mensagem ate o momento..."></textarea>
                                                    </div>
                                                </div>
                                                <div className="row d-flex align-items-end mt-3">
                                                    <div className="col-8 border border-primary">
                                                        <form action="chat.php" method="post" id="form-chat-geral">
                                                            <div className="form-row">
                                                                <div className="col-11 text-center">
                                                                    <textarea type="text" name="cgmsg" className="form-control text-light chat" placeholder="Mensagem..."></textarea>
                                                                </div>
                                                                <div className="col-1 d-flex align-items-center">
                                                                    <button className="btn btn-primary" type="submit">Enviar</button>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <div className="col-4 col-icon d-flex align-items-center text-center">
                                                        
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade" id="v-pills-opt" role="tabpanel" aria-labelledby="v-pills-opt-tab">
                                    <nav className="navbar justify-content-center navbar-dark">
                                        <ul className="d-flex justify-content-center nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" id="pills-profile-tab" data-toggle="pill" href="#pills-profile" role="tab" aria-controls="pills-profile" aria-selected="false">PERFIL</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="d-flex justify-content-center">
                                                            <p className="text-center h1">Meu perfil!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row justify-content-md-center">
                                                    <div className="col-sm-7 text-light">
                                                        <table className="table table-sm table-borderless border border-primary  text-light">
                                                            <thead>
                                                            <tr>
                                                            <th scope="col">Nome:</th>
                                                            <th scope="col">{userInf.name}</th>
                                                            </tr>
                                                            <tr>
                                                            <th scope="col">Nickname:</th>
                                                            <th scope="col">{userInf.username}</th>
                                                            </tr>
                                                            <tr>
                                                            <th scope="col">Email:</th>
                                                            <th scope="col">{userInf.email}</th>
                                                            </tr>
                                                            <tr>
                                                            <th scope="col">Créditos:</th>
                                                            <th scope="col">{userInf.atlaaCoins}</th>
                                                            </tr>
                                                            <tr>
                                                            <th scope="col">Tipo de conta:</th>
                                                            <th scope="col">{userInf.type}</th>
                                                            </tr>
                                                            <tr>
                                                            <th scope="col">Data de Cadastro:</th>
                                                            <th scope="col">{createdData ? createdData.substr(0,10).split('-').reverse().join('/') : createdData}</th>
                                                            </tr>
                                                            </thead>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="tab-pane fade" id="v-pills-opt-adm" role="tabpanel" aria-labelledby="v-pills-opt-adm-tab">
                                    <nav className="navbar justify-content-center navbar-dark">
                                        <ul className="d-flex justify-content-center nav nav-pills mb-3" id="pills-tab" role="tablist">
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link active" id="pills-tickets-tab" data-toggle="pill" href="#pills-tickets" role="tab" aria-controls="pills-tickets" aria-selected="true">TICKETS</a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-profile-adm-tab" data-toggle="pill" href="#pills-profile-adm" role="tab" aria-controls="pills-profile-adm" aria-selected="false">PERFIL</a>
                                            </li>
                                            <li className="nav-item" role="presentation">
                                                <a className="nav-link" id="pills-creditos-tab" data-toggle="pill" href="#pills-creditos" role="tab" aria-controls="pills-creditos" aria-selected="false">CREDITOS</a>
                                            </li>
                                        </ul>
                                    </nav>
                                    <div className="tab-content" id="pills-tabContent">
                                        <div className="tab-pane fade show active" id="pills-tickets" role="tabpanel" aria-labelledby="pills-tickets-tab">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="d-flex justify-content-center">
                                                            <p className="text-center h3">Lista de tickets!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="row">
                                                            <div className="col-sm-3">
                                                                <h6>ID</h6>
                                                            </div>
                                                            
                                                            <div className="col-sm-3">
                                                                <h6>NOME</h6>
                                                            </div>
                                                            
                                                            <div className="col-sm-3">
                                                                <h6>EMAIL</h6>
                                                            </div>
                                                            
                                                            <div className="col-sm-3">
                                                                <h6>MENSAGEM</h6>
                                                            </div>
                                                        </div>
                                                        <div id="result-tickets"></div>
                                                        <div className="d-flex justify-content-center">
                                                            <button type="button" id="update-ticket" className="btn btn-info">Atualizar</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
                                        <div className="tab-pane fade" id="pills-profile-adm" role="tabpanel" aria-labelledby="pills-profile-adm-tab">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="d-flex justify-content-center">
                                                            <p className="text-center h3">Editar perfil!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="row justify-content-md-center">
                                                    <div className="col-sm-6">
                                                        <form id="form-editar-perfil" method="POST" action="../editaperfil.php">
                                                            <div className="form-group">
                                                                <label htmlFor="nicknameatual">Nickname a ser alterado:</label>
                                                                <input className="form-control" type="text" name="nicknameatual" id="anicknameatual" placeholder="Nickname atual..."/>
                                                            </div>

                                                            <div className="form-group">
                                                                <label htmlFor="nome">Nome:</label>
                                                                <input className="form-control" type="text" name="nome" id="anome" placeholder="Novo nome..."/>
                                                            </div>

                                                            <div className="form-group">
                                                                <label htmlFor="nickname">Nickname:</label>
                                                                <input className="form-control" type="text" name="nickname" id="anickname" placeholder="Novo nickname..."/>
                                                            </div>
                                
                                                            <div className="form-group">
                                                                <label htmlFor="email">E-mail:</label>
                                                                <input className="form-control" type="email" name="email" id="aemail" placeholder="Novo e-mail..."/>
                                                            </div>
                                
                                                            <div className="form-group">
                                                                <label htmlFor="senha">Senha:</label>
                                                                <input className="form-control" type="password" name="senha" id="asenha" placeholder="Nova senha..." autoComplete="off"/>
                                                            </div>

                                                            <div className="form-group">
                                                                <label htmlFor="idaccess">Acesso:</label>
                                                                <input className="form-control" type="text" name="idaccess" id="aidaccess" placeholder="1 para admin e 0 para usuario..."/>
                                                            </div>
                                
                                                            <div className="form-group text-center">
                                                                <button type="submit" className="btn btn-primary">Enviar</button>
                                                            </div>
                                
                                                            <div className="alert alert-danger d-none">
                                                                Preencha o campo <span id="a-campo-erro"></span>!
                                                            </div>
                                                            <div id="success-edit-perfil" className="d-none"></div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="tab-pane fade" id="pills-creditos" role="tabpanel" aria-labelledby="pills-creditos-tab">
                                            <div className="container">
                                                <div className="row">
                                                    <div className="col-sm-12">
                                                        <div className="d-flex justify-content-center">
                                                            <p className="text-center h3">Editar créditos!</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="row justify-content-md-center">
                                                    <div className="col-sm-6">
                                                        <form id="form-editar-creditos" method="POST" action="../editacreditos.php">
                                                            <div className="form-group">
                                                                <label htmlFor="nicknamec">Nickname a ser creditado:</label>
                                                                <input className="form-control" type="text" name="nicknamec" id="nicknamec" placeholder="Nickname..."/>
                                                            </div>

                                                            <div className="form-group">
                                                                <label htmlFor="creditos">Créditos:</label>
                                                                <input className="form-control" type="number" name="creditos" id="creditos"/>
                                                            </div>

                                                            <div className="form-group text-center">
                                                                <button type="submit" name="adicionar" id="adicionarcredito" className="btn btn-primary" value="adicionar">Adicionar</button>
                                                                <button type="submit" name="remover" id="removercredito" className="btn btn-primary" value="remover">Remover</button>
                                                            </div>
                                
                                                            <div className="alert-creditos alert alert-danger d-none">
                                                                Preencha o campo <span id="credito-erro"></span>!
                                                            </div>
                                                            <div id="success-edit-credito" className="d-none"></div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>  
                                        </div>
                                    </div>
                                </div>

                                <div className="tab-pane fade text-center" id="v-pills-sair" role="tabpanel" aria-labelledby="v-pills-sair-tab">
                                    <a className="btn btn-danger" href="../sair.php" role="button">Confirmar logout</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-2 pt-5">
                    <div className="mt-5">
                        <div className="">
                            {Object.keys(expec).map((key) => {
                                return (
                                    expec[key].userInfo.roomID === roomID
                                    ?<div key={key}>
                                        <button type="button" className="btn btn-outline-primary mb-2" data-toggle="modal" data-target={`#${expec[key].userInfo.username}`}>{expec[key].userInfo.username}</button>
                                            {/* Modal aprovar expectador */}
                                        <div className="modal fade text-dark" id={expec[key].userInfo.username} tabIndex="-1" role="dialog" aria-labelledby="uploadimgModalLabel" aria-hidden="true">
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title" id="uploadimgModalLabel">Ficha {expec[key].userInfo.username}</h5>
                                                        <button type="button" className="close" data-dismiss="modal">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                    </div>
                                                    <div className="modal-body">
                                                        Ficha do player {expec[key].userInfo.username} aqui
                                                    </div>
                                                    <div className="modal-footer">
                                                        <button type="button" className="btn btn-primary" onClick={e => {e.preventDefault(); acceptExpecForPlayer(key)}} data-dismiss="modal">Aceitar</button>
                                                        <button type="button" className="btn btn-danger">Rejeitar</button>
                                                        <button type="button" className="btn btn-secondary" data-dismiss="modal">Fechar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    : null
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    {/* Footer */}
        <footer>
            <div className="fixed-bottom bg-dark border-top border-primary w-auto">
            <div className="text-center">© 2020 Copyright:
                <a href="https://www.gale.net.br/"> www.gale.net.br</a>
            </div>  
            </div>
        </footer>    
    {/* upload img modal */}
        <div className="modal fade text-dark" id="uploadimgModal" tabIndex="-1" role="dialog" aria-labelledby="uploadimgModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="uploadimgModalLabel">Carregar imagem</h5>
                        <button type="button" className="close" data-dismiss="modal">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <Formik initialValues={{avatar: []}} onSubmit={avatarUpload} /*validationSchema={validationUpload}*/ >
                            <Form>
                                <div className="form-group text-center">
                                    <input className="form-control-file" type="file" id='avatarInput' name='avatar' onChange={avatarChange} accept=".jpg, .jpeg, .png, .gif, .jfif" />
                                </div>
                                <div className="form-group text-center">
                                    {!!avatar.length ? <button type="submit" className="btn btn-primary">Enviar</button> : <button type="submit" className="btn btn-primary" disabled>Enviar</button>}
                                </div>
                                <div id='errorMsg'>{uploadError}</div><br />
                                {progressBar === 0
                                    ?null
                                    :<div className="progress">
                                    <div className="progress-bar progress-bar-striped bg-success" role="progressbar" style={{width: `${progressBar}%`}}></div>
                                    </div>
                                }
                                {progressBar === 100 ? <div className='alert alert-success mt-sm-2 text-sm'>Imagem enviado com sucesso!</div> : null}
                            </Form> 
                        </Formik>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={() => {setProgressBar(0)}}>Fechar</button>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default Play
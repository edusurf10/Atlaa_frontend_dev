import React, { useEffect, useState } from 'react'
import { Formik, Form } from 'formik'
// import * as yup from 'yup'
import FavRoom from '../components/FavRoom'
import MyRoom from '../components/MyRoom'
import Room from '../components/Room'
import axios from 'axios'

const Panel = () => {
  
  const [token, setToken] = useState(localStorage.getItem('app-token'))
  const [userInf, setUserinf] = useState({})
  const [avatar, setAvatar] = useState([])
  const [uploadError, setUploadError] = useState(null)
  const [progressBar, setProgressBar] = useState(0)

  useEffect( () => {
    async function fecthData() {
      await axios.post(`${process.env.REACT_APP_HOST}/v1/api/userinf`,{token: token})
      .then(response => {
        return response.data
      })
      .then(data => {
        setUserinf(data)
      })
      .catch(err => alert('Erro, entre em contato com o suporte técnico', err))
    }
    fecthData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token])

  useEffect(()=>{
    if(!!avatar.length){
      setUploadError(null)
      setProgressBar(0)
    } else{
      const msg = <div className='alert alert-danger mt-sm-2 text-sm'>imagem inválida</div>
      setUploadError(msg)
    }

  },[avatar])

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

    await axios.post(`${process.env.REACT_APP_HOST}/v1/api/uploadAvatar`, data, config)
    .then(response => {
      localStorage.removeItem('app-token')
      localStorage.setItem('app-token', response.data)
      setToken(localStorage.getItem('app-token'))
    })
    .catch(err => console.log(err))
    
  }

  return (
    <>
      <div className="container-fluid">
      {/* header */}
        <div className='border-bottom border-primary fixed-top'>
          <div className='row'>
            <div className="col-12">
              <nav className='navbar navbar-expand navbar-dark bg-dark'>
                <div className='col-6 d-flex align-items-start'>
                    <ul className='nav nav-pills' role='tablist'>
                        <li className='nav-item' role='presentation'>
                            <a className='nav-link btn-sm active' id='pills-home-tab' data-toggle='pill' href='#pills-home' role='tab' aria-controls='pills-home' aria-selected='true'>LOBBY</a>
                        </li>
                        <li className='nav-item' role='presentation'>
                            <a className='nav-link btn-sm' id='pills-sobre-tab' data-toggle='pill' href='#pills-sobre' role='tab' aria-controls='pills-sobre' aria-selected='false'>SOBRE</a>
                        </li>
                        <li className='nav-item' role='presentation'>
                            <a className='nav-link btn-sm' id='pills-contato-tab' data-toggle='pill' href='#pills-contato' role='tab' aria-controls='pills-contato' aria-selected='false'>CONTATO</a>
                        </li>
                    </ul>
                </div>
                <div className='col-6 d-flex align-items-center justify-content-end'>
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
        </div>
      {/* home */}
        <div className="tab-content justify-content-center" style={{margin:"3%"}}>
          <div className="tab-pane fade show active" id="pills-home" role="tabpanel">
              <div className="container">
                  <div className="row">
                      <div className="col-sm-12">
                          <div className="card card-custom shadow-lg mt-3 text-light">
                              <div className="card-body">
                                  <div className="tab-content" id="v-pills-tabContent">
                                      <div className="tab-pane fade show active" id="v-pills-lobby" role="tabpanel" aria-labelledby="v-pills-lobby-tab">
                                          <nav className="navbar justify-content-center navbar-dark">
                                              <ul className="d-flex justify-content-center nav nav-pills mb-3" id="pills-tab" role="tablist">
                                                  <li className="nav-item" role="presentation">
                                                      <a className="nav-link active" id="pills-salas-tab" data-toggle="pill" href="#pills-salas" role="tab">SALAS</a>
                                                  </li>
                                                  <li className="nav-item" role="presentation">
                                                      <a className="nav-link" id="pills-minhassalas-tab" data-toggle="pill" href="#pills-minhassalas" role="tab">MINHAS SALAS</a>
                                                  </li>
                                                  <li className="nav-item" role="presentation">
                                                      <a className="nav-link" id="pills-favorito-tab" data-toggle="pill" href="#pills-favorito" role="tab">FAVORITOS</a>
                                                  </li>
                                              </ul>
                                          </nav>
                                          <div className="tab-content" id="pills-tabContent">
                                              <div className="tab-pane fade show active" id="pills-salas" role="tabpanel" aria-labelledby="pills-salas-tab">
                                                  <div className="container">
                                                      <div className="row" id="listRoom">
                                                        <Room/>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="tab-pane fade" id="pills-minhassalas" role="tabpanel" aria-labelledby="pills-minhassalas-tab">
                                                  <div className="container">
                                                      <div className="row" id="listMyRoom">
                                                        <MyRoom/>
                                                      </div>
                                                  </div>
                                              </div>
                                              <div className="tab-pane fade" id="pills-favorito" role="tabpanel" aria-labelledby="pills-favorito-tab">
                                                  <div className="container">
                                                      <div className="row" id="favRoom">
                                                        <FavRoom/>
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
                                                      <hr  />
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
                                                              </div><hr  />
                                                              <div id="result-tickets"></div><hr  />
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
                                                      <hr  />
                                                      <div className="row justify-content-md-center">
                                                          <div className="col-sm-6">
                                                              <form id="form-editar-perfil" method="POST" action="../editaperfil.php">
                                                                  <div className="form-group">
                                                                      <label htmlFor="nicknameatual">Nickname a ser alterado:</label>
                                                                      <input className="form-control" type="text" name="nicknameatual" id="anicknameatual" placeholder="Nickname atual..."/>
                                                                  </div><hr  />
              
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
                                                                      <textarea className="form-control" type="password" name="senha" id="asenha" placeholder="Nova senha..." autoComplete="off"></textarea>
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
                                                      <hr  />
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
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="tab-pane fade" id="pills-sobre" role="tabpanel" style={{margin:"5%"}}>
              <div className="container d-flex align-items-center h-75">
                  <div className="row justify-content-md-center">
                      <div className="col-10">
                          <p className="text-center h4">Descrição do sistema</p>
                          <p className="text-center mt-3"> A sigla RPG significa "Role Playing Game" que em portugues seria algo como "Jogo de interpretação de papéis". É um jogo aonde cada pessoa monta seu personagem dentro de um sistema pré definido e interpreta ele no mundo criado pelo narrador. O "mundo" aonde se passa o jogo pode ser qualquer lugar, dimensão, ou cenario (Velho oeste, Cyberpunk, Medieval, Fantasia, Super heróis, etc.). O RPG é um jogo interpretativo, aonde você assume as ações do seu personagem, e por ser um jogo falado, ou escrito, as possibilidades são infinitas.
                          </p>
                          <p className="text-center mt-2"> A plataforma ATLAA de RPG busca ser intuitiva e facil de usar, tornando-se assim agradavel. Buscamos deixar tudo o mais pratico possivel para facilitar tanto a vida do mestre como a do jogador. Cada usuário pode criar suas próprias salas de aventura, com o sistema e quantidade de jogadores que bem entender.
                              Implementamos um formato no qual o dono da sala pode explicar e mostrar o sistema que está usando para criar suas aventuras, pois através de NPC's poderá interagir no chat, criando uma sensação maior de imersão e tornando a aventura muito mais divertida.
                          </p>
                      </div>
                  </div>
              </div>
          </div>
          <div className="tab-pane fade" id="pills-contato" role="tabpanel" style={{margin:"5%"}}>
              <div className="container d-flex align-items-center justify-content-md-center h-75">
                  <div className="row border border-primary">
                      <div className="col">
                          <p className="text-center h4">Contato</p>
                      </div>
                      <div className="w-100"></div>
                      <div className="col">
                          <form action="contato.php" method="POST" id="form-contato">
                              <div className="form-group">
                                  <label htmlFor="nome">Nome:</label>
                                  <input className="form-control" type="text" name="nome" id="nome" placeholder="Digite seu nome..."/>
                              </div>
          
                              <div className="form-group">
                                  <label htmlFor="email">E-mail:</label>
                                  <input className="form-control" type="email" name="email" id="email" placeholder="Digite seu e-mail..."/>
                              </div>
          
                              <div className="form-group">
                                  <label htmlFor="mensagem">Mensagem:</label>
                                  <textarea className="form-control" name="mensagem" id="mensagem" placeholder="Digite a mensagem..."></textarea>
                              </div>
          
                              <div className="form-group text-center">
                                  <button type="submit" className="btn btn-primary">Enviar</button>
                              </div>
          
                              <div className="alert-contato alert alert-danger d-none">
                                  Preencha o campo <span id="campo-erro"></span>!
                              </div>
                              <div id="success-contato" className="d-none"></div>
                          </form>
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
      </div>
    </>
  )
}

export default Panel
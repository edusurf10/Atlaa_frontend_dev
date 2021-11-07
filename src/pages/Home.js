import React from 'react'
import { ErrorMessage, Formik, Form, Field } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import { history } from '../history'
import logo from '../icon/logo_gif.gif'
import iconFb from '../icon/fb.png'
import iconInsta from '../icon/inst.png'
import iconEmail from '../icon/email.png'
import iconNick from '../icon/icon_nickname.png'
import iconPass from '../icon/icon_senha.png'
const Home = () => {
  localStorage.removeItem('app-token')
  
  const handleSubmitLogin = async values => {
    await axios.post(`${process.env.REACT_APP_HOST}/v1/api/auth`, values)
    .then(resp => {
      const { data } = resp
      if (data) {
        localStorage.setItem('app-token', data)
        history.push('/panel')
      }
      else {
        console.log("FALHA NO LOGIN ! ")
      }
    })
    .catch(error => {
      console.log("Erro na requisição a API: ", error)
    })
  }

  const handleSubmitRegister = async values => {
    await axios.post(`${process.env.REACT_APP_HOST}/v1/api/user`, values)
    .then(resp => {
      const { data } = resp
      if (data) {
        alert('Cadastrado com sucesso!')
      }
    })
    .catch(error => {
      console.log("Erro na requisição a API: ", error)
    })
  }

  // const validations = yup.object().shape({
  //   username: yup.string().required('username é obrigatório'),
  //   password: yup.string().min(8, 'minimo de 8 caracteres para a senha').required('senha é obrigatória')
  // })

  const validationsReg = yup.object().shape({
    username: yup.string().min(4, 'minimo 4 caracteres').max(16, 'máximo 16 caracteres').trim('nickname não pode conter espaços').required('nickname é obrigatório'),
    password: yup.string().min(8, 'minimo 8 caracteres').required('senha é obrigatório'),
    name: yup.string().min(5, 'minimo 5 caracteres').max(60).required('nome é obrigatório'),
    email: yup.string().email('email inválido').required('email é obrigatório'),
    confSenha: yup.string().oneOf([yup.ref('password')], 'Senhas não conferem')
  })

  return (
    <>
      <div className="container-fluid">
        <div className='border-bottom border-primary fixed-top'>
          <div className='row'>
            <div className="col-12">
              <nav className='navbar navbar-expand-md navbar-dark bg-dark'>
                <div className='col-4 d-flex align-items-start'>
                  <ul className='nav nav-pills' id='pills-tab' role='tablist'>
                    <li className='nav-item' role='presentation'>
                      <a className='nav-link btn-sm active' id='pills-home-tab' data-toggle='pill' href='#pills-home' role='tab' aria-controls='pills-home' aria-selected='true'>INICIO</a>
                    </li>
                    <li className='nav-item' role='presentation'>
                      <a className='nav-link btn-sm' id='pills-profile-tab' data-toggle='pill' href='#pills-profile' role='tab' aria-controls='pills-profile' aria-selected='false'>SOBRE</a>
                    </li>
                    <li className='nav-item' role='presentation'>
                      <a className='nav-link btn-sm' id='pills-contact-tab' data-toggle='pill' href='#pills-contact' role='tab' aria-controls='pills-contact' aria-selected='false'>CONTATO</a>
                    </li>
                  </ul>
                </div>
                <div className='col-8 d-flex align-items-end justify-content-end'>
                  <Formik initialValues={{username:"", password:""}} onSubmit={handleSubmitLogin} /*validationSchema={validations}*/>
                    <Form className='form-inline'>
                      <ErrorMessage component="span" name="username" className="alert alert-danger mr-sm-2 text-sm"/>
                      <ErrorMessage component="span" name="password" className="alert alert-danger mr-sm-2 text-sm"/>
                      <div className='input-group align-items-center mr-2'>
                        <img className='img-fluid mr-2' src={iconNick} alt='Username' width='32px' height='32px' />
                        <Field className='form-control form-control-sm form-group' name='username' placeholder='Seu nickname...'/>
                      </div>
                      <div className='input-group align-items-center'>
                        <img className='img-fluid mr-2' src={iconPass} alt='Password' width='18px' height='18px' />
                        <Field className='form-control form-control-sm form-group mr-sm-2' type='password' name='password' autoComplete="off" placeholder='Sua senha...' />
                      </div>
                      <button type='submit' className='btn btn-sm btn-primary mr-sm-2'>Logar</button>
                      <button type='button' className='btn btn-sm btn-secondary mr-sm-2' data-toggle='modal' data-target='#register-modal'>Registrar-se</button>
                    </Form>                  
                  </Formik>
                </div>
              </nav>
            </div>
          </div>
        </div>
        <div className="tab-content d-flex justify-content-center align-items-center" style={{margin:"13%"}}>
          <div className="tab-pane fade show active" id="pills-home" role="tabpanel">
            <div className="container">
              <div className="row justify-content-md-center">
                <div className="col-auto text-center ">
                  <img src={logo} className='img-fluid' width='200' height='200' alt="RPG" />
                </div>
                <div className="col-auto d-flex align-items-end">
                  <blockquote className="blockquote">
                    <p className="mb-0 text-primary h1">ATLAA</p>
                    <footer className="blockquote-footer">Plataforma ATLAA de RPG de mesa!</footer>
                  </blockquote>                      
                </div>
              </div>
              <div className="row justify-content-md-center mt-5">
                <div className="col-6">
                  <p className="text-center">Olá aventureiro! Bem vindo a plataforma ATLAA de RPG de mesa online. Esperamos que você mate dragões, destrua robôs, salve alguém em perigo de um prédio em chamas e até mesmo roube o coração da pessoa que você ama. Aqui você terá a oportunidade de viver aventuras infinitas, aonde acontecem as coisas mais loucas e interessantes. Jogue sem moderação!</p>
                </div>
              </div>
              <div className="row justify-content-md-center mt-3">
                <div className="col-auto">
                  <img className="rounded-circle border bg-light redes" src={iconFb} alt="Facebook" width='40' height='40' />
                </div>
                <div className="col-auto">
                  <img className="rounded-circle border bg-light redes" src={iconInsta} alt="Instagram" width='40' height='40' />
                </div>
                <div className="col-auto">
                  <img className="rounded-circle border bg-light redes" src={iconEmail} alt="Email" width='40' height='40' />
                </div>
              </div>
            </div>
          </div>
      
        <div className="tab-pane fade mb-3" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <div className="justify-content-center">
                  <p className="text-center h4 ">Descrição do sistema</p>
                </div>
              </div>
            </div>
            <div className="row justify-content-md-center">
              <div className="col-sm-10 mt-3">
                <p className="text-center mt-3"> A sigla RPG significa "Role Playing Game" que em portugues seria algo como "Jogo de interpretação de papéis". É um jogo aonde cada pessoa monta seu personagem dentro de um sistema pré definido e interpreta ele no mundo criado pelo narrador. O "mundo" aonde se passa o jogo pode ser qualquer lugar, dimensão, ou cenario (Velho oeste, Cyberpunk, Medieval, Fantasia, Super heróis, etc.). O RPG é um jogo interpretativo, aonde você assume as ações do seu personagem, e por ser um jogo falado, ou escrito, as possibilidades são infinitas.</p>
              </div>
              <div className="col-sm-10 mt-2">
                <p className="text-center"> A plataforma ATLAA de RPG busca ser intuitiva e facil de usar, tornando-se assim agradavel. Buscamos deixar tudo o mais pratico possivel para facilitar tanto a vida do mestre como a do jogador. Cada usuário pode criar suas próprias salas de aventura, com o sistema e quantidade de jogadores que bem entender.
                    Implementamos um formato no qual o dono da sala pode explicar e mostrar o sistema que está usando para criar suas aventuras, pois através de NPC's poderá interagir no chat, criando uma sensação maior de imersão e tornando a aventura muito mais divertida.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
          <div className="container border border-primary">
            <div className="row">
              <div className="col">
                <p className="text-center h4">Contato</p>
              </div>
              <div className="w-100"></div>
              <div className="col">
                <form action="contato.php" method="POST" id="form-contato">
                  <div className="form-group">
                    <label htmlFor="nome">Nome:</label>
                    <input className="form-control" type="text" name="nome" id="nome" placeholder="Digite seu nome..." />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">E-mail:</label>
                    <input className="form-control" type="email" name="email" id="email" placeholder="Digite seu e-mail..." />
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
        <div className="modal fade" id="register-modal" tabIndex="-1" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content text-dark">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">Cadastro</h5>
          </div>
          <div className="modal-body">
            <Formik initialValues={{username:"", email:"", password:"", confSenha:""}} onSubmit={handleSubmitRegister} validationSchema={validationsReg}>
              <Form>
                <div className="form-group">
                    <label htmlFor="cnome">Nome:</label>
                    <Field className="form-control" name="name" placeholder="Digite seu nome..."/>
                    <ErrorMessage component="span" name="name" className="form-control alert alert-danger mt-sm-2"/>
                </div>

                <div className="form-group">
                    <label htmlFor="cnickname">Nickname:</label>
                    <Field className="form-control" name="username" placeholder="Digite seu nickname (apenas letras e numeros...)" pattern="^[a-zA-Z0-9]+$"/>
                    <ErrorMessage component="span" name="username" className="form-control alert alert-danger mt-sm-2"/>
                </div>

                <div className="form-group">
                    <label htmlFor="cemail">E-mail:</label>
                    <Field className="form-control" type="email" name="email" placeholder="Digite seu e-mail..." maxLength="50"/>
                    <ErrorMessage component="span" name="email" className="form-control alert alert-danger mt-sm-2"/>
                </div>

                <div className="form-group">
                    <label htmlFor="csenha">Senha:</label>
                    <Field className="form-control" type="password" name="password" autoComplete="off" placeholder="Digite uma Senha..." maxLength="16"/>
                    <ErrorMessage component="span" name="password" className="form-control alert alert-danger mt-sm-2"/>
                </div>

                <div className="form-group">
                    <label htmlFor="cconfSenha">Confirmar senha:</label>
                    <Field className="form-control" type="password" name="confSenha" autoComplete="off" placeholder="Digite novamente sua Senha..."/>
                    <ErrorMessage component="span" name="confSenha" className="form-control alert alert-danger mt-sm-2"/>
                </div>

                <div className="form-group text-center">
                    <button type="submit" className="btn btn-primary">Cadastrar</button>
                </div>
              </Form>
            </Formik>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
        <footer>
          <div className="fixed-bottom bg-dark border-top border-primary w-auto">
            <div className="text-center">© 2020 Copyright:
              <a href="https://www.gale.net.br/"> www.gale.net.br</a>
            </div>  
          </div>
        </footer>
      </div>
    </>
  )
}

export default Home
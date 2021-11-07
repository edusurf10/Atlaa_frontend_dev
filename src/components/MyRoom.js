import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Formik, Form, Field } from 'formik'

const MyRoom = () => {
  const [roomInf, setRoominf] = useState([])
  const token = localStorage.getItem('app-token')
  
  const initialValues = {
    descrition: "",
    maxUser: 0,
    name: "",
    systemType: "",
    password: "",
    token: token
  }
  
  const createRoom = async values => {
    await axios.post(`${process.env.REACT_APP_HOST}/v1/api/createroom`, values)
    .then(response => setRoominf(response.data))
    .catch(err => console.log('Erro ao criar sala, entre em contato com a equipe.', err))
  }
  
  useEffect( () => {
    async function fecthData() {
      await axios.post(`${process.env.REACT_APP_HOST}/v1/api/myroom`, {token: token})
      .then(response => {
        return response.data
      })
      .then(data => {
        setRoominf(data)
      })
      .catch(err => console.log('Erro, entre em contato com o suporte técnico', err))
    }
    fecthData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  return (
    <>
      {/* Listar minhas salas criadas */}
      {roomInf.map((room) => {
        return (
          <div key={room.id} className='col-auto mb-3'>
            <div className='card border border-primary text-dark' style={{width: '14rem'}}>
                <div className='card-header'>
                    <img className='card-img-top' src={room.cape} height='100rem' alt='Imagem de capa da sala'/>
                </div>
                <div className='card-body text-center'>
                    <h5 className='card-title'>{room.name}</h5>
                    <p className='card-text mh-25 desc-lg'>{room.descrition}</p>
                    <p className='card-text'>{room.systemType}</p>
                    <p className='card-text'>x / {room.maxUser}</p>
                </div>
                <div className='card-footer text-center'>
                    <a href={`/play/${room.id}`} className='btn btn-primary'>Entrar na sala</a>
                </div>
            </div>
          </div>
        )
      })}
      {/* Criar Sala */}
      <div className="col-auto">
        <div className="card border border-primary text-dark" style={{width: '14rem'}}>
          <div className="card-body d-flex justify-content-center">
            <div type='button' data-toggle='modal' data-target='#criarsalamodal'><p className="h1 text-primary">+</p></div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="criarsalamodal" tabIndex="-1" role="dialog" aria-labelledby="criarsala" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content text-dark">
            <div className="modal-header text-center">
              <h5 className="modal-title">Criar Sala</h5>
            </div>
            <div className="modal-body">
              <Formik initialValues={initialValues} onSubmit={createRoom} >
                <Form>
                  <div className="form-group">
                    <label htmlFor="name">Nome:</label>
                    <Field className="form-control" type="text" name="name" placeholder="Digite o nome da sala..."/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="descrition">Descrição:</label>
                    <Field as="textarea" className="form-control" name="descrition" placeholder="Digite a descrição da sala..."/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="systemType">Tipo de sistema:</label>
                    <Field className="form-control" type="text" name="systemType" placeholder="Digite o tipo de sistema usado em seu jogo..."/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="maxUser">Máximo de usuarios:</label>
                    <Field className="form-control" type="number" name="maxUser"/>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">Senha da sala:</label>
                    <Field className="form-control" type="password" name="password" autoComplete="off" placeholder="vazio para deixar sem senha..."/>
                  </div>

                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-primary">Criar Sala</button>
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
    </>
  )
}

export default MyRoom
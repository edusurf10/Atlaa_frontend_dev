import React, { useEffect, useState } from 'react'
import axios from 'axios'


const Room = () => {

  const [roomInf, setRoominf] = useState([])
  const [updatePage, setUpdatePage] = useState(0)
  
  async function fecthData() {
    await axios.get(`${process.env.REACT_APP_HOST}/v1/api/room`)
    .then(response => {
      return response.data
    })
    .then(data => {
      setRoominf(data)
    })
    .catch(err => console.log('Erro, entre em contato com o suporte técnico', err))
  }
  
  useEffect( () => {
    fecthData()
  },[updatePage])

  return (
    <>
      <div className="col-12 mb-2"><button className="btn btn-primary mt-2" onClick={(e) => {e.preventDefault();setUpdatePage(updatePage +1)}}>Atualizar lista</button></div>
      {roomInf.map(room => {
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
                <p className='card-text'>0 / {room.maxUser}</p>
              </div>
              <div className='card-footer text-center'>
                <a href={`/play/${room.id}`} className='btn btn-primary'>Entrar na sala</a>
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}

export default Room
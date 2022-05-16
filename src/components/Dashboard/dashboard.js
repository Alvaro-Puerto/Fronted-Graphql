import React, { useState } from "react";
import { Navigate } from 'react-router-dom';
import { useQuery, gql, useMutation } from "@apollo/client";


const CARS_QUERY = gql`
query{
    cars{
      edges{
        node{
          brand
          model
          price
          color
          year,
          id
        }
      }
    }
  }
`;


export default function Dashboard() {
    const [formState, setFormState] = useState({
        is_create: true,
        id: '',
        brand: '',
        model: '',
        color: '',
        year: 2022,
        price: 0,
        header: '',
        id_car: ''
      });


    var AUTH_QUERY = gql `mutation{
        authMutation(email:"${formState.email}", password:"${formState.password}")
        {
          accessToken,
          refreshToken
        }
    }`;

    const submitForm = () => {
        if( formState.brand ) {
            alert('Por favor ingrese una marca');
            return false;
        } 
        if( formState.model ) {
            alert('Por favor ingrese un modelo');
            return false;
        } 
        if( formState.color ) {
            alert('Por favor ingrese un color');
            return false;
        } 
        if( formState.year ) {
            alert('Por favor ingrese un año');
            return false;
        } 
        if( formState.price ) {
            alert('Por favor ingrese un precio');
            return false;
        } 
    }

    const confirmDelete = (id) => {
       setFormState({
           ...formState,
           id_car: id
       })
    };

    const updateRecord = (record) => {
        console.log(record);
          
        setFormState({
            ...formState,
            header: 'Actualizar vehiculo',
            is_create: false,
            id: record.id,
            brand: record.brand,
            model: record.model,
            price: record.price,
            year: record.year,
            color: record.color
        })
    }

    const openModalCreate = () => {
        setFormState({
            ...formState,
            is_create: false,
            id: '',
            brand: '',
            model: '',
            price: '0',
            year: '2022',
            color: '',
            header: 'Crear nuevo vehiculo'
        })


    }

    const CAR_ADD_QUERY = gql `mutation{
        carAddMutation(
            brand: "${formState.brand}", 
            model: "${formState.model}", 
            color:"${formState.color}", 
            price:"${formState.price}", 
            year:"${formState.year}",
        )
        {
          car{
            color
            price
            id
            brand
            model
            year
          }
        }
    } `;

    const CAR_EDIT_QUERY = gql `mutation{
        carEditMutation(
          id: "${formState.id}", 
          brand: "${formState.brand}", 
          model: "${formState.model}", 
          color:"${formState.color}", 
          price:"${formState.price}", 
          year:"${formState.year}"
        ){
          car{
            id
            brand
            model
            year
            color
            price
          }
        }
    }`;

    const CAR_DELETE_QUERY = gql `mutation{
        carDeleteMutation(id:"${formState.id_car}"){
          car{
            id
          }
        }
      }
    `
    const [car_delete_query, {resp, loa, message_error}] = useMutation(CAR_DELETE_QUERY, {
        onCompleted(resp) {
            window.location.reload(false);
        }
    })

    const [ car_add_query, 
        { response, load, err }] = useMutation(CAR_ADD_QUERY, {
            onCompleted(response) {
                window.location.reload(false);
            }
    });
    
    const [ car_edit_query, 
        { res, loader, errr }] = useMutation(CAR_EDIT_QUERY, {
           onCompleted(response) {
            window.location.reload(false);
           }
    });

    const { data, loading, error, reload } = useQuery(CARS_QUERY, {
        pollInterval: 500
    });

    const logout = () => {
        localStorage.removeItem('_token')
        window.location.reload(false);
    }
    
    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
    return (
        <div>
            <div className="container mt-4 d-flex justify-content-end">
                <button className="btn btn-link" onClick={() => logout()}>Cerrar sesion</button>
            </div>
           <div className="container mt-4">
               <div className="card mt-4">
                   <div className="card-header bg-white d-flex justify-content-between">
                       <p className="fw-bold">Lista de vehiculos</p>
                       <button type="button" onClick={() => openModalCreate()} className="btn btn-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            Nuevo
                        </button>
                   </div>
                   <div className="card-body">
                   <table className="table">
                        <thead>
                            <tr>
                            <th scope="col">Marca</th>
                            <th scope="col">Modelo</th>
                            <th scope="col">Color</th>
                            <th scope="col">Año</th>
                            <th scope="col">Precio</th>
                            <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                        {data.cars.edges.map((car) => (
                            <tr>
                                <td>{car.node.brand}</td>
                                <td>{car.node.model}</td>
                                <td>{car.node.color}</td>
                                <td>{car.node.year}</td>
                                <td>{car.node.price}</td>
                                <td>
                                <button type="button" className="btn btn-warning me-2" onClick={() => updateRecord(car.node)} data-bs-toggle="modal" data-bs-target="#exampleModal3">
                                    Editar
                                </button>
                                <button type="button" onClick={() => confirmDelete(car.node.id)} className="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                    Eliminar
                                </button>
                                </td>
                            </tr>
                        ))}
                            
                        </tbody>
                    </table>
                   </div>
               </div>
           </div>
          

        <div className="modal fade" id="exampleModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{formState.header}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={car_add_query}>
                        <input 
                        type="hidden" 
                        name="" 
                        value={formState.id} 
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                id: e.target.value
                            })
                        }
                        />
                        <div className="row">
                            <div className="col">
                                <label htmlFor="">Marca</label>
                                <input type="text" 
                                name="" 
                                className="form-control" 
                                id="" value={formState.brand}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        brand: e.target.value
                                    })
                                }
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="">Modelo</label>
                                <input type="text" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.model} 
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        model: e.target.value
                                    })
                                }/>
                            </div>
                           
                        </div>
                        <div className="row">
                        <div className="col">
                                <label htmlFor="">Color</label>
                                <input 
                                type="text" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.color} 
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        color: e.target.value
                                    })
                                }
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="">Año</label>
                                
                                <input 
                                type="number" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.year}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        year: e.target.value
                                    })
                                }
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="">Precio</label>
                                <input 
                                type="number" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.price}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        price: e.target.value
                                    })
                                }
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" onClick={car_add_query} className="btn btn-success">Guardar</button>
                </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="exampleModal3" tabIndex={-1} aria-labelledby="exampleModalLabe3" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{formState.header}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <form onSubmit={submitForm}>
                        <input 
                        type="hidden" 
                        name="" 
                        value={formState.id} 
                        onChange={(e) =>
                            setFormState({
                                ...formState,
                                id: e.target.value
                            })
                        }
                        />
                        <div className="row">
                            <div className="col">
                                <label htmlFor="">Marca</label>
                                <input type="text" 
                                name="" 
                                className="form-control" 
                                id="" value={formState.brand}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        brand: e.target.value
                                    })
                                }
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="">Modelo</label>
                                <input type="text" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.model} 
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        model: e.target.value
                                    })
                                }/>
                            </div>
                           
                        </div>
                        <div className="row">
                        <div className="col">
                                <label htmlFor="">Color</label>
                                <input 
                                type="text" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.color} 
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        color: e.target.value
                                    })
                                }
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="">Año</label>
                                
                                <input 
                                type="number" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.year}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        year: e.target.value
                                    })
                                }
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="">Precio</label>
                                <input 
                                type="number" 
                                name="" 
                                className="form-control" 
                                id="" 
                                value={formState.price}
                                onChange={(e) =>
                                    setFormState({
                                        ...formState,
                                        price: e.target.value
                                    })
                                }
                                />
                            </div>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                   
                    <button type="button" onClick={car_edit_query} className="btn btn-success">Editar</button>

                </div>
                </div>
            </div>
        </div>

        <div className="modal fade" id="exampleModal2" tabIndex={-1} aria-labelledby="exampleModalLabel2" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">{formState.header}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                    <p>Desea eliminar este registro</p>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" onClick={car_delete_query} className="btn btn-danger">Confirmar</button>
                </div>
                </div>
            </div>
        </div>
      </div>
    )
}
import React from "react";
import { useQuery, gql } from "@apollo/client";


const FILMS_QUERY = gql`
query{
    cars{
      edges{
        node{
          brand
          model
          price
          color
          year
        }
      }
    }
  }
`;


export default function Dashboard() {
    const { data, loading, error } = useQuery(FILMS_QUERY);

    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>
    return (
        <div>
           <div className="container">
               <div className="card">
                   <div className="card-header bg-white d-flex justify-content-between">
                       <p className="fw-bold">Lista de vehiculos</p>
                       <button className="btn btn-success">Nuevo</button>
                   </div>
                   <div className="card-body">
                   <table class="table">
                        <thead>
                            <tr>
                            <th scope="col">Marca</th>
                            <th scope="col">Modelo</th>
                            <th scope="col">Color</th>
                            <th scope="col">Año</th>
                            <th scope="col">Precio</th>
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
                            </tr>
                        ))}
                            
                        </tbody>
                    </table>
                   </div>
               </div>
           </div>
           <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>


            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    ...
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary">Save changes</button>
                </div>
                </div>
            </div>
            </div>
      </div>
    )
}
import { Car } from "src/cars/interfaces/car.interface";
import { v4 as uuid } from 'uuid';

export const CARS_SEED: Car [] = [
    {id: uuid(), brand: 'Toyota', model: 'Corolla', year: 2021},
    {id: uuid(), brand: 'Ford', model: 'Fiesta', year: 2021},
    {id: uuid(), brand: 'Nissan', model: 'Sentra', year: 2021},
    {id: uuid(), brand: 'Chevrolet', model: 'Spark', year: 2021},
    {id: uuid(), brand: 'Mercedes Benz', model: 'Clase A', year: 2021},
    {id: uuid(), brand: 'BMW', model: 'Serie 1', year: 2021}
]

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface connectedClients{
    [id: string]: {
        socket: Socket,
        user: User,
    };

}

@Injectable()
export class MessagesWsService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    private connectedClients: connectedClients = {};

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({id: userId});
        if(!user) throw new Error('User not found');
        if(!user.isActive) throw new Error('User is not active');
        this.connectedClients[client.id] = {
            socket: client,
            user,
        };
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId];
    }

    getConnectedClients() {
        return Object.keys(this.connectedClients);
    }

    getUserFullName(clientId: string) {
        return this.connectedClients[clientId].user.fullName;
    }
}

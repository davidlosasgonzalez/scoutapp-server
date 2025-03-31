// Importamos los decoradores de TypeORM.
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

// Inicializamos la entidad del usuario.
@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn({ name: 'id' })
    id: number;

    @Column({ name: 'username', length: 30, unique: true })
    username: string;

    @Column({ name: 'first_name', length: 50 })
    firstName: string;

    @Column({ name: 'last_name', length: 100 })
    lastName: string;

    @Column({ name: 'email', length: 100, unique: true })
    email: string;

    @Column({ name: 'password', length: 100 })
    password: string;

    @Column({ name: 'birth_date', type: 'date' })
    birthDate: Date;

    @Column({ name: 'avatar', nullable: true, length: 100 })
    avatar: string;

    @Column({ name: 'role', type: 'enum', enum: ['family', 'scout'] })
    role: 'family' | 'scout';

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'modified_at' })
    modifiedAt: Date;
}

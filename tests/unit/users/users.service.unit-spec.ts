// Importamos dependencias de testing.
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';

// Importamos servicios y entidad necesarios.
import { UsersService } from '../../../src/modules/users/services/users.service';
import { UserEntity } from '../../../src/modules/auth/entities/user.entity';

// Creamos un mock para el repositorio de usuarios.
const mockUserRepo = () => ({
    findOne: jest.fn(),
});

// Inicializamos el test unitario del servicio UsersService.
describe('UsersService (unit)', () => {
    let usersService: UsersService;
    let userRepo: ReturnType<typeof mockUserRepo>;

    // Configuramos el entorno de testing antes de cada test.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useFactory: mockUserRepo,
                },
            ],
        }).compile();

        usersService = module.get<UsersService>(UsersService);
        userRepo = module.get(getRepositoryToken(UserEntity));
    });

    // Test principal: obtener el perfil privado de un usuario existente.
    it('debería devolver el perfil privado del usuario autenticado', async () => {
        // Definimos el usuario simulado.
        const userId = 1;

        const userMock: UserEntity = {
            id: userId,
            username: 'josinho',
            firstName: 'Jose',
            lastName: 'Ramón Gayoso',
            birthDate: new Date('2004-04-04'),
            email: 'jose.ramon@gmail.com',
            password: 'hashed-password',
            avatar: '',
            role: 'family',
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        // Simulamos el resultado de la consulta.
        userRepo.findOne.mockResolvedValue(userMock);

        // Ejecutamos el servicio.
        const result = await usersService.getPrivateProfile(userId);

        // Validamos que se devuelven los campos esperados.
        expect(result).toMatchObject({
            id: userMock.id,
            username: userMock.username,
            firstName: userMock.firstName,
            lastName: userMock.lastName,
            birthDate: userMock.birthDate,
            email: userMock.email,
            avatar: userMock.avatar,
            role: userMock.role,
            createdAt: userMock.createdAt,
            modifiedAt: userMock.modifiedAt,
        });

        // Validamos que no se devuelve la contraseña.
        expect(result).not.toHaveProperty('password');

        // Validamos que se hizo la consulta al repositorio correctamente.
        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { id: userId },
        });
    });

    // Test negativo: usuario no encontrado.
    it('debería lanzar una excepción si el usuario no existe', async () => {
        const userId = 999;
        userRepo.findOne.mockResolvedValue(null);

        await expect(usersService.getPrivateProfile(userId)).rejects.toThrow(
            new NotFoundException('Usuario no encontrado'),
        );

        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { id: userId },
        });
    });
});

// Importamos dependencias de testing.
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// Importamos servicio, entidad y dependencias necesarias.
import { UpdateUserService } from '../../../src/modules/users/services/update-user.service';
import { HashService } from '../../../src/modules/auth/services/hash.service';
import { UserEntity } from '../../../src/modules/auth/entities/user.entity';
import { UpdateUserDto } from '../../../src/modules/users/dtos/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

// Creamos un mock para el repositorio de usuarios.
const mockUserRepo = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
});

// Creamos un mock para el servicio de hash.
const mockHashService = () => ({
    hashPassword: jest.fn(),
});

// Inicializamos el test unitario del servicio UpdateUserService.
describe('UpdateUserService (unit)', () => {
    let updateUserService: UpdateUserService;
    let userRepo: ReturnType<typeof mockUserRepo>;
    let hashService: ReturnType<typeof mockHashService>;

    // Configuramos el entorno de testing antes de cada test.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateUserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useFactory: mockUserRepo,
                },
                {
                    provide: HashService,
                    useFactory: mockHashService,
                },
            ],
        }).compile();

        updateUserService = module.get<UpdateUserService>(UpdateUserService);
        userRepo = module.get(getRepositoryToken(UserEntity));
        hashService = module.get(HashService);
    });

    // Test positivo: actualiza correctamente el nombre de usuario.
    it('debería actualizar el nombre de usuario correctamente', async () => {
        // Definimos un mock de usuario existente.
        const userMock: UserEntity = {
            id: 1,
            username: 'original',
            firstName: 'Jose',
            lastName: 'Ramón Gayoso',
            email: 'jose.ramon@gmail.com',
            birthDate: new Date('2004-04-04'),
            password: 'hashed',
            avatar: '',
            role: 'family',
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        // Simulamos DTO de entrada con nuevo nombre de usuario.
        const dto: UpdateUserDto = {
            username: 'updatedName',
        };

        // Simulamos que el usuario existe y se guarda correctamente.
        userRepo.findOne.mockResolvedValue(userMock);
        userRepo.save.mockResolvedValue({
            ...userMock,
            username: dto.username,
        });

        // Ejecutamos el servicio y verificamos resultados.
        const result = await updateUserService.execute(userMock.id, dto);

        expect(result.username).toBe(dto.username);
        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { id: userMock.id },
        });
        expect(userRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({ username: dto.username }),
        );
    });

    // Test negativo: lanza error si el usuario no existe.
    it('debería lanzar un error si el usuario no existe', async () => {
        const dto: UpdateUserDto = { username: 'nuevoNombre' };
        userRepo.findOne.mockResolvedValue(null);

        await expect(updateUserService.execute(1, dto)).rejects.toThrow(
            NotFoundException,
        );
    });

    // Test negativo: lanza error si falta una de las contraseñas.
    it('debería lanzar error si se proporciona solo una de las contraseñas', async () => {
        const userMock = { id: 1, password: 'hashed' } as UserEntity;
        userRepo.findOne.mockResolvedValue(userMock);

        const dto: UpdateUserDto = {
            password: 'Nueva123!',
            repeatedPass: '',
        };

        await expect(
            updateUserService.execute(userMock.id, dto),
        ).rejects.toThrow(
            new BadRequestException('Debes proporcionar ambas contraseñas'),
        );
    });

    // Test negativo: lanza error si las contraseñas no coinciden.
    it('debería lanzar error si las contraseñas no coinciden', async () => {
        const userMock = { id: 1, password: 'hashed' } as UserEntity;
        userRepo.findOne.mockResolvedValue(userMock);

        const dto: UpdateUserDto = {
            password: 'Nueva123!',
            repeatedPass: 'Otra123!',
        };

        await expect(
            updateUserService.execute(userMock.id, dto),
        ).rejects.toThrow(
            new BadRequestException('Las contraseñas no coinciden'),
        );
    });

    // Test positivo: actualiza correctamente la contraseña.
    it('debería actualizar la contraseña correctamente si ambas coinciden', async () => {
        const userMock: UserEntity = {
            id: 1,
            username: 'user',
            firstName: 'Jose',
            lastName: 'Gayoso',
            email: 'correo@test.com',
            birthDate: new Date(),
            password: 'old-hash',
            avatar: '',
            role: 'family',
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        const dto: UpdateUserDto = {
            password: 'Nueva123!',
            repeatedPass: 'Nueva123!',
        };

        const hashedNewPassword = 'nuevo-hash';

        userRepo.findOne.mockResolvedValue(userMock);
        hashService.hashPassword.mockResolvedValue(hashedNewPassword);
        userRepo.save.mockResolvedValue({
            ...userMock,
            password: hashedNewPassword,
        });

        const result = await updateUserService.execute(userMock.id, dto);

        expect(hashService.hashPassword).toHaveBeenCalledWith(dto.password);
        expect(result.password).toBe(hashedNewPassword);
    });
});

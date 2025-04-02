// Importamos dependencias de testing.
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

// Importamos servicios y entidad necesarios.
import { RegisterService } from '@/modules/auth/services/register.service';
import { HashService } from '@/modules/auth/services/hash.service';
import { UserEntity } from '@/modules/auth/entities/user.entity';

// Importamos el DTO de entrada.
import { RegisterDto } from '@/modules/auth/dtos/register.dto';

// Creamos un mock para el repositorio de usuarios.
const mockUserRepo = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
});

// Creamos un mock para el servicio de hash.
const mockHashService = () => ({
    hashPassword: jest.fn(),
});

// Inicializamos el test unitario del servicio RegisterService.
describe('RegisterService (unit)', () => {
    let registerService: RegisterService;
    let userRepo: ReturnType<typeof mockUserRepo>;
    let hashService: ReturnType<typeof mockHashService>;

    // Configuramos el entorno de testing antes de cada test.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                RegisterService,
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

        registerService = module.get<RegisterService>(RegisterService);
        userRepo = module.get(getRepositoryToken(UserEntity));
        hashService = module.get(HashService);
    });

    // Test principal: registrar un nuevo usuario correctamente.
    it('debería registrar un nuevo usuario correctamente', async () => {
        // Definimos el DTO de entrada.
        const dto: RegisterDto = {
            username: 'josinho',
            firstName: 'Jose',
            lastName: 'Ramón Gayoso',
            birthDate: '2004-04-04',
            email: 'jose.ramon@gmail.com',
            password: 'Hackaboss17!',
            repeatedPass: 'Hackaboss17!',
            role: 'family',
        };

        // Definimos el hash que se usará en el mock.
        const hashedPassword = 'hashedPassword123!';

        // Simulamos el objeto creado por create().
        const createdUser = {
            ...dto,
            password: hashedPassword,
            birthDate: new Date(dto.birthDate),
        };

        // Simulamos el resultado final del usuario guardado.
        const savedUser = {
            id: 1,
            ...createdUser,
            avatar: '',
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        // Simulamos las dos llamadas a findOne (email y username no existentes).
        userRepo.findOne
            .mockResolvedValueOnce(undefined) // primera: email
            .mockResolvedValueOnce(undefined); // segunda: username

        // Simulamos el hash de contraseña.
        hashService.hashPassword.mockResolvedValue(hashedPassword);

        // Simulamos creación y guardado de usuario.
        userRepo.create.mockReturnValue(createdUser);
        userRepo.save.mockResolvedValue(savedUser);

        // Ejecutamos el servicio.
        const result = await registerService.execute(dto);

        // Verificamos que devuelve solo lo necesario.
        expect(result).toMatchObject({
            id: savedUser.id,
            email: savedUser.email,
            role: savedUser.role,
        });

        // Verificamos que se haya buscado primero por email y luego por username.
        expect(userRepo.findOne).toHaveBeenNthCalledWith(1, {
            where: { email: dto.email },
        });
        expect(userRepo.findOne).toHaveBeenNthCalledWith(2, {
            where: { username: dto.username },
        });

        // Verificamos que la contraseña se haya hasheado correctamente.
        expect(hashService.hashPassword).toHaveBeenCalledWith(dto.password);

        // Verificamos que se haya creado el usuario correctamente.
        expect(userRepo.create).toHaveBeenCalledWith({
            username: dto.username,
            firstName: dto.firstName,
            lastName: dto.lastName,
            birthDate: new Date(dto.birthDate),
            email: dto.email,
            password: hashedPassword,
            role: dto.role,
        });

        // Verificamos que se haya guardado correctamente.
        expect(userRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
                username: dto.username,
                email: dto.email,
                password: hashedPassword,
                role: dto.role,
            }),
        );
    });

    // Test: debería lanzar error si el email ya está en uso.
    it('debería lanzar error si el email ya está en uso', async () => {
        // Simulamos que ya existe un usuario con ese email.
        userRepo.findOne.mockResolvedValueOnce({ id: 99 });

        const dto: RegisterDto = {
            username: 'nuevo_usuario',
            firstName: 'Nombre',
            lastName: 'Apellido',
            birthDate: '2000-01-01',
            email: 'duplicado@email.com',
            password: 'password123',
            repeatedPass: 'password123',
            role: 'scout',
        };

        // Verificamos que lanza BadRequestException con el mensaje correcto.
        await expect(registerService.execute(dto)).rejects.toThrow(
            'Ya existe una cuenta con este email',
        );

        // Verificamos que se haya consultado el email.
        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { email: dto.email },
        });
    });

    // Test: debería lanzar error si el username ya está en uso.
    it('debería lanzar error si el username ya está en uso', async () => {
        // Simulamos que el email no está en uso, pero el username sí.
        userRepo.findOne
            .mockResolvedValueOnce(undefined) // email disponible
            .mockResolvedValueOnce({ id: 88 }); // username duplicado

        const dto: RegisterDto = {
            username: 'usuario_existente',
            firstName: 'Nombre',
            lastName: 'Apellido',
            birthDate: '2000-01-01',
            email: 'email@disponible.com',
            password: 'password123',
            repeatedPass: 'password123',
            role: 'family',
        };

        // Verificamos que lanza BadRequestException con el mensaje correcto.
        await expect(registerService.execute(dto)).rejects.toThrow(
            'El nombre de usuario ya está en uso',
        );

        // Verificamos ambas consultas.
        expect(userRepo.findOne).toHaveBeenNthCalledWith(1, {
            where: { email: dto.email },
        });
        expect(userRepo.findOne).toHaveBeenNthCalledWith(2, {
            where: { username: dto.username },
        });
    });

    // Test: debería lanzar error si las contraseñas no coinciden.
    it('debería lanzar error si las contraseñas no coinciden', async () => {
        // Simulamos que email y username están disponibles.
        userRepo.findOne
            .mockResolvedValueOnce(undefined)
            .mockResolvedValueOnce(undefined);

        const dto: RegisterDto = {
            username: 'nuevo',
            firstName: 'Nombre',
            lastName: 'Apellido',
            birthDate: '2000-01-01',
            email: 'nuevo@email.com',
            password: 'pass123',
            repeatedPass: 'otraPass123',
            role: 'scout',
        };

        // Verificamos que lanza BadRequestException con el mensaje correcto.
        await expect(registerService.execute(dto)).rejects.toThrow(
            'Las contraseñas no coinciden',
        );

        // Verificamos que se hicieron las búsquedas previas.
        expect(userRepo.findOne).toHaveBeenNthCalledWith(1, {
            where: { email: dto.email },
        });
        expect(userRepo.findOne).toHaveBeenNthCalledWith(2, {
            where: { username: dto.username },
        });
    });
});

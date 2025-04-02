// Importamos dependencias de testing.
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

// Importamos servicios y entidad necesarios.
import { LoginService } from '@/modules/auth/services/login.service';
import { HashService } from '@/modules/auth/services/hash.service';
import { UserEntity } from '@/modules/auth/entities/user.entity';

// Importamos el DTO de entrada.
import { LoginDto } from '@/modules/auth/dtos/login.dto';

// Creamos un mock para el repositorio de usuarios.
const mockUserRepo = () => ({
    findOne: jest.fn(),
});

// Creamos un mock para el servicio de hash.
const mockHashService = () => ({
    comparePasswords: jest.fn(),
});

// Creamos un mock para el servicio JWT.
const mockJwtService = () => ({
    sign: jest.fn(),
});

// Inicializamos el test unitario del servicio LoginService.
describe('LoginService (unit)', () => {
    let loginService: LoginService;
    let userRepo: ReturnType<typeof mockUserRepo>;
    let hashService: ReturnType<typeof mockHashService>;
    let jwtService: ReturnType<typeof mockJwtService>;

    // Configuramos el entorno de testing antes de cada test.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                LoginService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useFactory: mockUserRepo,
                },
                {
                    provide: HashService,
                    useFactory: mockHashService,
                },
                {
                    provide: JwtService,
                    useFactory: mockJwtService,
                },
            ],
        }).compile();

        loginService = module.get<LoginService>(LoginService);
        userRepo = module.get(getRepositoryToken(UserEntity));
        hashService = module.get(HashService);
        jwtService = module.get(JwtService);
    });

    // Test principal: login exitoso, retorna token.
    it('debería loguear al usuario correctamente y retornar un token', async () => {
        const dto: LoginDto = {
            email: 'jose.ramon@gmail.com',
            password: 'Hackaboss17!',
        };

        const userMock: UserEntity = {
            id: 1,
            email: dto.email,
            password: 'hashedPassword',
            role: 'family',
            username: 'josinho',
            firstName: 'Jose',
            lastName: 'Ramón Gayoso',
            birthDate: new Date('2004-04-04'),
            avatar: '',
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        const mockToken = 'mocked.jwt.token';

        userRepo.findOne.mockResolvedValue(userMock);
        hashService.comparePasswords.mockResolvedValue(true);
        jwtService.sign.mockReturnValue(mockToken);

        const result = await loginService.execute(dto);

        expect(result).toEqual({ token: mockToken });

        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { email: dto.email },
        });

        expect(hashService.comparePasswords).toHaveBeenCalledWith(
            dto.password,
            userMock.password,
        );

        expect(jwtService.sign).toHaveBeenCalledWith({
            sub: userMock.id,
            role: userMock.role,
        });
    });

    // Test negativo: usuario no encontrado por email.
    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
        const dto: LoginDto = {
            email: 'notfound@gmail.com',
            password: 'somePass123!',
        };

        userRepo.findOne.mockResolvedValue(null);

        await expect(loginService.execute(dto)).rejects.toThrow(
            'Credenciales inválidas',
        );

        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { email: dto.email },
        });
    });

    // Test negativo: contraseña incorrecta.
    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
        const dto: LoginDto = {
            email: 'jose.ramon@gmail.com',
            password: 'wrongPassword!',
        };

        const userMock: UserEntity = {
            id: 1,
            email: dto.email,
            password: 'hashedPassword',
            role: 'family',
            username: 'josinho',
            firstName: 'Jose',
            lastName: 'Ramón Gayoso',
            birthDate: new Date('2004-04-04'),
            avatar: '',
            createdAt: new Date(),
            modifiedAt: new Date(),
        };

        userRepo.findOne.mockResolvedValue(userMock);
        hashService.comparePasswords.mockResolvedValue(false);

        await expect(loginService.execute(dto)).rejects.toThrow(
            'Credenciales inválidas',
        );

        expect(hashService.comparePasswords).toHaveBeenCalledWith(
            dto.password,
            userMock.password,
        );
    });
});

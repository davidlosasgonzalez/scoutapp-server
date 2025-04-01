// Importamos las dependencias de testing.
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';

// Importamos el servicio y la entidad necesarios.
import { UpdateAvatarService } from '../../../src/modules/users/services/update-avatar.service';
import { UserEntity } from '../../../src/modules/auth/entities/user.entity';
import { UploadService } from '../../../src/shared/services/uploads.service';

// Creamos un mock para el repositorio de usuarios.
const mockUserRepo = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
});

// Creamos un mock para UploadService.
const mockUploadService = {
    save: jest.fn().mockResolvedValue('mocked-avatar.jpg'),
};

// Inicializamos el test unitario del servicio UpdateAvatarService.
describe('UpdateAvatarService (unit)', () => {
    let updateAvatarService: UpdateAvatarService;
    let userRepo: ReturnType<typeof mockUserRepo>;

    // Configuramos el entorno de testing antes de cada test.
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UpdateAvatarService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useFactory: mockUserRepo,
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn((key: string) => {
                            if (key === 'UPLOADS_DIR') return 'uploads-test';
                            return null;
                        }),
                    },
                },
                {
                    provide: UploadService,
                    useValue: mockUploadService,
                },
            ],
        }).compile();

        updateAvatarService =
            module.get<UpdateAvatarService>(UpdateAvatarService);
        userRepo = module.get(getRepositoryToken(UserEntity));
    });

    // Test positivo: actualiza el avatar correctamente.
    it('debería actualizar el avatar correctamente', async () => {
        const userId = 1;
        const file = {
            originalname: 'avatar-test.png',
            buffer: Buffer.from('fake image content'),
        } as Express.Multer.File;

        const userMock = {
            id: userId,
            avatar: '',
        } as UserEntity;

        userRepo.findOne.mockResolvedValue(userMock);
        userRepo.save.mockResolvedValue({
            ...userMock,
            avatar: 'mocked-avatar.jpg',
        });

        const result = await updateAvatarService.execute(userId, file);

        expect(userRepo.findOne).toHaveBeenCalledWith({
            where: { id: userId },
        });

        expect(mockUploadService.save).toHaveBeenCalledWith(file);
        expect(userRepo.save).toHaveBeenCalledWith({
            ...userMock,
            avatar: 'mocked-avatar.jpg',
        });

        expect(result).toBe('mocked-avatar.jpg');
    });

    // Test negativo: lanza error si el usuario no existe.
    it('debería lanzar error si el usuario no existe', async () => {
        userRepo.findOne.mockResolvedValue(null);

        await expect(
            updateAvatarService.execute(9999, {
                originalname: 'fake.png',
                buffer: Buffer.from('x'),
            } as Express.Multer.File),
        ).rejects.toThrow(new NotFoundException('Usuario no encontrado'));
    });
});

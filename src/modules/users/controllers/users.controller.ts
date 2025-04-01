// Importamos las dependencias.
import {
    Controller,
    Get,
    Put,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

// Importamos los servicios.
import { UsersService } from '../services/users.service';
import { UpdateAvatarService } from '../services/update-avatar.service';
import { UpdateUserService } from '../services/update-user.service';

// Importamos el DTO.
import { UpdateUserDto } from '../dtos/update-user.dto';

// Importamos el guard.
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

// Importamos el decorador y el tipo del usuario autenticado.
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { AuthPayload } from '../../auth/interfaces/auth-payload.interface';

// Inicializamos el controlador.
@Controller('api/users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly updateAvatarService: UpdateAvatarService,
        private readonly updateUserService: UpdateUserService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get('private')
    async getPrivateProfile(@CurrentUser() user: AuthPayload) {
        const data = await this.usersService.getPrivateProfile(user.sub);
        return {
            status: 'ok',
            data,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Put('avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    async updateAvatar(
        @CurrentUser() user: AuthPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const filename = await this.updateAvatarService.execute(user.sub, file);
        return {
            status: 'ok',
            message: 'Avatar actualizado',
            data: { filename },
        };
    }

    @UseGuards(JwtAuthGuard)
    @Put()
    async updateUser(
        @CurrentUser() user: AuthPayload,
        @Body() dto: UpdateUserDto,
    ) {
        const updated = await this.updateUserService.execute(user.sub, dto);
        const { password, ...safe } = updated;

        return {
            status: 'ok',
            message: 'Usuario actualizado',
            data: safe,
        };
    }
}

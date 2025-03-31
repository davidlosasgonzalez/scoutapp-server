// Importamos dependencias.
import { DataSource } from 'typeorm';

// Inicializamos la función que limpia la base de datos de test.
export const resetTestDatabase = async (
    dataSource: DataSource,
): Promise<void> => {
    const entities = dataSource.entityMetadatas;

    for (const entity of entities) {
        const repository = dataSource.getRepository(entity.name);
        await repository.query(`DELETE FROM \`${entity.tableName}\``);
    }
};

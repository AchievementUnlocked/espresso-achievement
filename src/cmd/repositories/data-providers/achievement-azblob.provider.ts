import { Injectable } from '@nestjs/common';
import { BlockBlobClient, ContainerClient, StorageSharedKeyCredential } from '@azure/storage-blob';

import { ConfigPolicyService } from 'operational/configuration';
import { LogPolicyService } from 'operational/logging';
import { AUError } from 'operational/exception';

import { AchievementMediaFullDto } from 'domain/schemas';
import { AchievementMedia } from 'domain/entities';


@Injectable()
export class AchievementAzblobProvider {

    private readonly accountName: string;
    private readonly accountKey: string;
    private readonly containerName: string;
    private readonly mediaBasePath: string;
    private readonly clientUrl: string;

    constructor(
        private readonly configPolicy: ConfigPolicyService,
        private readonly logPolicy: LogPolicyService) {

        this.logPolicy.trace('Init AchievementAzblobProvider', 'Init');

        this.accountName = this.configPolicy.get('AZBLOB_ACCOUNT_NAME');
        this.accountKey = this.configPolicy.get('AZBLOB_ACCOUNT_KEY');
        this.containerName = this.configPolicy.get('AZBLOB_ACHIEVEMENT_CONTAINER_NAME');
        this.mediaBasePath = this.configPolicy.get('AZBLOB_ACHIEVEMENT_CONTAINER_MEDIA_PATH');
        this.clientUrl = this.configPolicy.get('AZBLOB_ACHIEVEMENT_CLIENT_URL_PATH');
    }

    async saveAchievementMedia(entity: AchievementMedia) {
        this.logPolicy.trace('Call AchievementAzblobProvider.saveAchievementMedia', 'Call');

        const blockBlobClient = this.createBlockBlobClient(`${this.mediaBasePath}/${entity.mediaPath}`);

        const uploadBlobResponse = await blockBlobClient.upload(entity.buffer, entity.buffer.length);

        // check if the status code is 20x
        if ((uploadBlobResponse._response.status % 200) < 100) {
            this.logPolicy.debug(`Success: Uploading block blob ${entity.mediaPath} HTTP ${uploadBlobResponse._response.status}`);
            
            // If the media was saved successfully, we need to clear the buffer so it does not occupy the memory space
            this.logPolicy.debug('CLEARING BUFFER FOR ' + entity.mediaPath);
            entity.clearBuffer();
        } else {
            this.logPolicy.error(`Error: Uploading block blob ${entity.mediaPath} HTTP ${uploadBlobResponse._response.status}`);
            
            throw new AUError(`Error: Uploading block blob ${entity.mediaPath} HTTP ${uploadBlobResponse._response.status}`);
        }
    }

    async saveAchievementMediaDto(dto: AchievementMediaFullDto[]) {
        this.logPolicy.trace('Call AchievementAzblobProvider.saveAchievementMediaDto', 'Call');

        dto.forEach(async dtoItem => {
            const blockBlobClient = this.createBlockBlobClient(`${this.mediaBasePath}/${dtoItem.mediaPath}`);

            const uploadBlobResponse = await blockBlobClient.upload(dtoItem.buffer, dtoItem.buffer.length);

            // check if the status code is 20x
            if ((uploadBlobResponse._response.status % 200) < 100) {
                this.logPolicy.debug(`Success: Uploading block blob ${dtoItem.mediaPath} HTTP ${uploadBlobResponse._response.status}`);
            } else {
                this.logPolicy.error(`Error: Uploading block blob ${dtoItem.mediaPath} HTTP ${uploadBlobResponse._response.status}`);

                throw new AUError(`Error: Uploading block blob ${dtoItem.mediaPath} HTTP ${uploadBlobResponse._response.status}`);
            }
        });
    }


    protected createBlockBlobClient(path: string): BlockBlobClient {

        const sharedKeyCredential = new StorageSharedKeyCredential(this.accountName, this.accountKey);
        const containerClient = new ContainerClient(this.clientUrl, sharedKeyCredential);
        return containerClient.getBlockBlobClient(path);
    }

}

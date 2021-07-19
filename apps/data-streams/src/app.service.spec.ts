import { ClientProxy, ClientProxyFactory, ClientsModule } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
    let service: AppService;
    let client: ClientProxy;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            imports: [ClientsModule],
            providers: [
                AppService,
                {
                    provide: 'WORKER', useValue: {
                        send: jest.fn(() => 'URL'),
                        emit: jest.fn(() => {
                            return {
                                subscribe: () => { }
                            }
                        })
                    }
                }
            ],
        }).compile();

        service = app.get<AppService>(AppService);
        client = app.get<ClientProxy>('WORKER');
    });

    it('should be defined', () => {
        expect(service).toBeDefined()
        expect(client).toBeDefined()
    });

    it('should return URL (request-response)', () => {
        const data = { url: 'URL' }
        expect(service.start(data)).toBe('URL')
        expect(client.send).toHaveBeenCalled()
    })
});

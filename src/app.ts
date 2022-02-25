import express, { Request, Response } from 'express';
import {Routes} from './interfaces/routes.interface';
import errorMiddleware from './middlewares/error.middleware';
import {SubscriptionDateAndPayoutTask} from "./cronjob/subscriptionAndPayout"
import {
    Connection,
    ConnectionOptions,
    createConnection,
    getConnection
} from 'typeorm'


class App {
    public app: express.Application;
    public port: string | number;
    public env: boolean;

    constructor(routes: Routes[]) {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.env = process.env.NODE_ENV === 'production';

        this.createConnection();
        this.initializeMiddlewares();
        this.initializeRoutes(routes);
        this.initializeErrorHandling();

        SubscriptionDateAndPayoutTask.start();

    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`🚀 App listening on the port ${this.port}`);
        });
    }

    private initializeMiddlewares() {
        if (this.env) {
            //production
            // this.app.use(cors());
            // this.app.use(hpp());
            // this.app.use(helmet());
            // this.app.use(logger('combined'));
            //this.app.use(cors({ origin: 'your.domain.com', credentials: true }));
        } else {
            //development
            // this.app.use(logger('dev'));
            // this.app.use(cors({
            //   origin: true,
            //   credentials: true
            // }));
        }
        this.app.use(express.json());
        this.app.use(express.urlencoded({
            extended: true
        }));
        this.app.use('/uploads', express.static('uploads'));
        this.app.set('view engine', 'ejs')
        this.app.use('/public', express.static('public'))
    }

    private initializeRoutes(routes: Routes[]) {
        routes.forEach(route => {
            this.app.use('/', route.router);
        });
    }

    private initializeErrorHandling() {
        this.app.use(errorMiddleware);
    }
    
    public createConnection(){

        const connected = this.isConnected()
        if (connected) {
            return getConnection()
        }
        const config: ConnectionOptions = {
            "type": "mysql",
            "host": "localhost",
            "port": 3306,
            "username": "root",
            "password": "",
            "database": "proest",
            "entities": ["src/entity/*.ts"],
            "logging": true,
            "synchronize": true
        }
        createConnection(config)
    }

    public isConnected(): boolean {
        try {
            return !!getConnection()
        } catch (e) {
            return false
        }
    }
}

export default App;
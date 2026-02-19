declare module 'midtrans-client' {
    class Snap {
        constructor(options: {
            isProduction: boolean;
            serverKey: string | undefined;
            clientKey: string | undefined;
        });

        createTransaction(parameter: any): Promise<{
            token: string;
            redirect_url: string;
        }>;
    }

    class CoreApi {
        constructor(options: {
            isProduction: boolean;
            serverKey: string | undefined;
            clientKey: string | undefined;
        });
    }

    export default {
        Snap,
        CoreApi
    };
}

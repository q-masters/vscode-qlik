window.acquireVsCodeApi = () => ({
    postMessage: (request) =>  {
        switch (request.body.action) {
            case 'read':
                window.postMessage({
                    request,
                    body: window.connectionListCommand,
                    success: true
                });
                break;
        }
    }
});

window.connectionListCommand = [{
        label: 'Qlik Local 1',
        connection: {
            host     : '127.0.0.1',
            port     : null,
            path     : null,
            secure   : false,
            allowUntrusted: false,
            authorization: {
                strategy: 1,
                data: {
                    domain: null,
                    password: null
                }
            }
        },
        fileRender: 0,
        display: {
          dimensions: false,
          measures: true,
          script: true,
          sheets: true,
          variables: true
        }
    }, {
        label: 'Qlik Local 2',
        connection: {
            host     : '127.0.0.1',
            port     : '9077',
            path     : 'proxy',
            secure   : true,
            allowUntrusted: true,
            authorization: {
                strategy: 1,
                data: {
                    domain: "hannuschkar4fa4\\qlik",
                    password: "qlik2020"
                }
            },
            isQlikSenseDesktop: true
        },
        fileRender: 1,
        display: {
          dimensions: true,
          measures: true,
          script: false,
          sheets: false,
          variables: true
        }
    }];

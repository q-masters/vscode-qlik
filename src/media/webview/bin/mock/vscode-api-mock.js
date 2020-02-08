window.acquireVsCodeApi = () => ({
    postMessage: (message) =>  {
        switch (message.command) {
            case 'Connection.Read':
                window.postMessage(window.connectionListCommand);
                break;
        }
    }
})

window.connectionListCommand = {
    command: "Connection.Update",
    data: [{
        label: 'Qlik Local',
        settings: {
            username : 'user',
            password : 'qwertz',
            host     : '127.0.0.1',
            port     : '9076',
            secure   : false
        }
    }, {
        label: 'Qlik Local 2',
        settings: {
            username : '',
            password : '',
            host     : '127.0.0.1',
            port     : '9077',
            secure   : true
        }
    }]
}

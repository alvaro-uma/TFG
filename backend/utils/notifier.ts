
const notifier = {
    databaseMessages: true,
};


export  const dataBaseNotifier = (message : string) => {
    if(notifier.databaseMessages) {
        notifier.databaseMessages = false
        console.log("[DATABASE LAYER] "+message);
    }
}


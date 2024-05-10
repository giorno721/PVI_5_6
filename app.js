if('serviceWorker' in navigator){
    navigator.serviceWorker.register("/sw.js")
        .then(()=>console.log("Зареєстрований"))
        .catch(()=>console.log("Отримали помилку"));
}
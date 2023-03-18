

//la mision de esto es recibir una respuesta , que va a contener una lista en JSON y el adaptador devolvera UN array con esa info
export const listAdapter = async (response : Response) : Promise< Array <any> | boolean > =>{
    const json = await response.json();
    let arr : any = [];
    switch (response.status) {
      case 200:
        console.log("listAdapter, json recibido -> " , json);
        json.map((entradaJSON : any) =>{
            arr.push(entradaJSON);
        })
        return arr;
      default:
        return false;
    }
}
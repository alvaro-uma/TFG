import React, { useEffect, useState } from "react";
import { store } from "../../../../..";
import { APIController } from "../../../../../services/APIController";
import styles from "./createExam.module.css";

const MAX_ITERACIONES = 20;


enum QuestionType {
  SIMPLE = "simple",
  TAREAS_RECURSOS = "tareas_recursos",
}

export const CreateExam = (props: any) => {
  const [wrappers, setWrappers] = useState<QuestionWrapper[]>([]);
  const [deleteComponentId, setDeleteComponentId] = useState<string | boolean>(
    false
  );

  const [asignature_id, setAsignatureId] = useState<string>(
    props.asignature.id
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startLocalDate, setStartLocalDate] = useState<string>("");
  const [endLocalDate, setEndLocalDate] = useState<string>("");

  useEffect(() => {
    const deleteComponent = (idToDelete: string) => {
      console.log("inicio");
      setWrappers((wrappers) =>
        wrappers.filter((wrapper) => wrapper.component.props.id !== idToDelete)
      );
    };

    if (deleteComponentId) {
      deleteComponent(deleteComponentId as string);
      setDeleteComponentId(false);
    }
  }, [deleteComponentId]);

  const handleAddSimpleQuesitonComponent = () => {
    setWrappers([
      ...wrappers,
      new QuestionWrapper(handleDeleteComponent, QuestionType.SIMPLE),
    ]);
  };
  const handleAddTareasRecursosQuestionComponent = () => {
    setWrappers([
      ...wrappers,
      new QuestionWrapper(handleDeleteComponent, QuestionType.TAREAS_RECURSOS),
    ]);
  };

  const handleDeleteComponent = (idToDelete: string) => {
    console.log("borrando componente", idToDelete);
    setDeleteComponentId(idToDelete);
  };

  const handleCreate = () => {
    console.log("creando examen");
    //wrappers.forEach((wrapper) => console.log(JSON.stringify(wrapper.toJSON())));
    const questions = wrappers.map((wrapper) => wrapper.toJSON());

    //esto se pone asi para que el backend lo pueda leer

    const exam = {
      name: title,
      description: description,
      questions: questions,
      asignatureID: asignature_id,
      startDate: new Date(startLocalDate).getTime() / 1000,
      endDate: new Date(endLocalDate).getTime() / 1000,
    };
    console.log("creando examen");
    //console.log(exam);
    console.log(JSON.stringify(exam));
    //return;
    const API = new APIController();
    API.createExam(store.getState().token, JSON.stringify(exam)).then(
      (response: Response) => {
        if (response.status === 200) {
          alert("Examen creado");
          props.setRefresh(!props.refresh);
        } else {
          alert("Error al crear el examen");
        }
      }
    );
  };

  return (
    <div>
      {/* Informacion general del examen */}
      <div className={styles.general_info}>
        <h4>Titulo del examen</h4>
        <input
          type="text"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          required
        />

        <h4>Descripcion</h4>
        <textarea
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />

        <h4>Inicio</h4>
        <label>Fecha y hora</label>
        <input
          type="datetime-local"
          onChange={(e) => {
            setStartLocalDate(e.target.value);
          }}
          required
        />

        <h4>Fin</h4>
        <label>Fecha y hora</label>
        <input
          type="datetime-local"
          onChange={(e) => {
            setEndLocalDate(e.target.value);
          }}
          required
        />
      </div>
      {/* Preguntas */}
      <div className={styles.questions_space}>
        <label>Crear pregunta tipo:</label>
        <button onClick={handleAddSimpleQuesitonComponent}>
          Escribir respuesta
        </button>
        <button onClick={handleAddTareasRecursosQuestionComponent}>
          Tareas recursos
        </button>
        {wrappers.map((wrapper) => wrapper.getComponent())}
      </div>

      {/* Boton crear examen */}
      <button
        onClick={() => {
          handleCreate();
        }}
      >
        Crear examen
      </button>
    </div>
  );
};

class QuestionWrapper {
  //atributo que todo tipo de pregunta debe tener
  id: string;
  tipo: QuestionType;
  component: JSX.Element;
  deleteComponent: (id: string) => void;

  //atributos que solo las preguntas de escribir respuesta tienen
  statement: string;
  answer: string;

  //atributos que solo las preguntas de tiempo de respuesta tienen
  tareas: Tarea[];
  recursos: Recurso[];
  resultados : Resultados = {};
  protocolo: string = "herencia";

  constructor(deleteComponent: (id: string) => void, tipo: QuestionType) {
    this.id = Math.random().toString(36).substr(2, 9);
    this.statement = "";
    this.answer = "";
    this.deleteComponent = deleteComponent;
    this.tipo = tipo;
    this.tareas = [];
    this.recursos = [];
    switch (tipo) {
      case QuestionType.SIMPLE:
        this.component = (
          <CWriteAnswer
            key={this.id}
            id={this.id}
            updateStatement={this.updateStatement.bind(this)}
            updateAnswer={this.updateAnswer.bind(this)}
            deleteComponent={this.deleteComponent}
          />
        );
        break;
      case QuestionType.TAREAS_RECURSOS:
        this.component = (
          <CTareasRecursos
            key={this.id}
            id={this.id}
            updateTareas={this.updateTareas.bind(this)}
            updateRecursos={this.updateRecursos.bind(this)}
            updateResultados={this.updateResultados.bind(this)}
            updateProtocolo={this.updateProtocolo.bind(this)}
            deleteComponent={this.deleteComponent}
          />
        );
        break;
    }
  }

  //metodos para actualizar los atributos de las preguntas de escribir respuesta
  updateStatement(statement: string) {
    this.statement = statement;
  }
  updateAnswer(answer: string) {
    this.answer = answer;
  }

  setText(text: string) {
    this.statement = text;
  }
  //metodos para actualizar los atributos de las preguntas de tiempo de respuesta
  updateTareas(tareas: Tarea[]) {
    this.tareas = tareas;
  }
  updateRecursos(recursos: Recurso[]) {
    this.recursos = recursos;
  }
  updateResultados(resultados: Resultados) {
    this.resultados = resultados;
  }
  updateProtocolo(protocolo: string) {
    this.protocolo = protocolo;
  }
  //Metodos comunes a todos los tipos de preguntas
  getComponent() {
    return this.component;
  }
  toJSON() {
    switch (this.tipo) {
      case QuestionType.SIMPLE:
        return {
          id: this.id,
          statement: this.statement,
          answer: this.answer,
          type: QuestionType.SIMPLE,
        };
        case QuestionType.TAREAS_RECURSOS:
          return {
            id: this.id,
            tareas: this.tareas,
            recursos: this.recursos,
            resultados : this.resultados,
            protocolo: this.protocolo,
          };
        default:
          return {};
    }
  }
}

//CLASES E INTERFACES NECESARIAS
class Tarea {
  id: string;
  nombre: string;
  periodo: number;
  deadline: number;
  peorTiempo: number;
  constructor(
    nombre: string,
    periodo: number,
    deadline: number,
    peorTiempo: number
  ) {
    this.nombre = nombre;
    this.periodo = periodo;
    this.deadline = deadline;
    this.peorTiempo = peorTiempo;
    this.id = Math.random().toString(36).substr(2, 9);
  }
  update(
    nombre: string,
    periodo: number,
    deadline: number,
    peorTiempo: number
  ) {
    this.nombre = nombre;
    this.periodo = periodo;
    this.deadline = deadline;
    this.peorTiempo = peorTiempo;
  }
}
class Recurso {
  id: string;
  nombre: string;
  tareaAsignada: string;
  tiempo: number;
  constructor(nombre: string, tareaAsignada: string, tiempo: number) {
    this.nombre = nombre;
    this.tareaAsignada = tareaAsignada;
    this.tiempo = tiempo;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

interface Asociacion {
  [key: string]: string[];
}
interface Resultados {
  [key: string]: DatoTiempos;
}
interface ITechos {
  [key: string]: number;
}
interface IPeoresTiemposRecursos {
  [key: string]: number;
}

class DatoTiempos {
  t_bloqueo: number;
  t_respuesta: number;
  constructor(t_bloqueo: number, t_respuesta: number) {
    this.t_bloqueo = t_bloqueo;
    this.t_respuesta = t_respuesta;
  }
}

//COMPONENTES

function CWriteAnswer(props: any) {
  const [statement, setStatement] = useState<string>(props.text);
  const [answer, setAnswer] = useState<string>("");
  //en el tema de actualizar
  const handleStatementChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setStatement(event.target.value);
    props.updateStatement(event.target.value);
  };
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAnswer(event.target.value);
    props.updateAnswer(event.target.value);
  };
  const handleDeleteComponent = () => {
    props.deleteComponent(props.id);
  };
  return (
    <div className={styles.question}>
      <label>Enunciado: </label>
      <textarea value={statement} onChange={handleStatementChange} />
      <label>Respuesta correcta: </label>
      <input value={answer} onChange={handleAnswerChange} />
      <button
        onClick={() => {
          handleDeleteComponent();
        }}
      >
        Borrar
      </button>
    </div>
  );
}
//los props de la tabla de tareas
//deben de ser las tareas como estado  y su setter
const CTablaTareas = (props: any) => {
  function handleChange(tarea: Tarea, campo: string, valor: string) {
    console.log("handleChange", tarea, campo, valor);
    let copia_tareas = props.tareas;
    switch (campo) {
      case "nombre":
        copia_tareas.map((t: Tarea) => {
          if (t.id === tarea.id) {
            t.nombre = valor;
          }
        });
        break;
      case "periodo":
        copia_tareas.map((t: Tarea) => {
          if (t.id === tarea.id) {
            t.periodo = parseInt(valor);
          }
        });
        break;
      case "deadline":
        copia_tareas.map((t: Tarea) => {
          if (t.id === tarea.id) {
            t.deadline = parseInt(valor);
          }
        });
        break;
      case "peorTiempo":
        copia_tareas.map((t: Tarea) => {
          if (t.id === tarea.id) {
            t.peorTiempo = parseInt(valor);
          }
        });
        break;
      default:
        break;
    }
    props.setTareas(copia_tareas);
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>T</th>
          <th>D</th>
          <th>C</th>
        </tr>
      </thead>
      <tbody>
        {props.tareas.map((tarea: Tarea) => (
          <tr key={tarea.id}>
            <td>
              <input
                onChange={(e) => handleChange(tarea, "nombre", e.target.value)}
              />
            </td>
            <td>
              <input
                onChange={(e) => handleChange(tarea, "periodo", e.target.value)}
              />
            </td>
            <td>
              <input
                onChange={(e) =>
                  handleChange(tarea, "deadline", e.target.value)
                }
              />
            </td>
            <td>
              <input
                onChange={(e) =>
                  handleChange(tarea, "peorTiempo", e.target.value)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CTablaRecursos = (props: any) => {
  function handleChange(recurso: Recurso, campo: string, valor: string) {
    console.log("handleChange", recurso, campo, valor);
    let copia_recursos = props.recursos;
    switch (campo) {
      case "nombre":
        copia_recursos.map((r: Recurso) => {
          if (r.id == recurso.id) {
            r.nombre = valor;
          }
        });
        break;
      case "tareaAsignada":
        copia_recursos.map((r: Recurso) => {
          if (r.id == recurso.id) {
            r.tareaAsignada = valor;
          }
        });
        break;
      case "tiempo":
        copia_recursos.map((r: Recurso) => {
          if (r.id == recurso.id) {
            r.tiempo = parseInt(valor);
          }
        });
        break;
    }
    props.setRecursos(copia_recursos);
  }
  return (
    <table>
      <thead>
        <tr>
          <th>Tarea</th>
          <th>Recurso</th>
          <th>Tiempo</th>
        </tr>
      </thead>
      <tbody>
        {props.recursos.map((recurso: Recurso) => (
          <tr key={recurso.id}>
            <td>
              <input
                onChange={(e) =>
                  handleChange(recurso, "tareaAsignada", e.target.value)
                }
              />
            </td>
            <td>
              <input
                onChange={(e) =>
                  handleChange(recurso, "nombre", e.target.value)
                }
              />
            </td>
            <td>
              <input
                onChange={(e) =>
                  handleChange(recurso, "tiempo", e.target.value)
                }
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const CResultados = (resultados: Resultados) => {
  return (
    <div>
      <h2>Tiempos de Bloqueo</h2>
      <ul>
        {Object.entries(resultados).map(([key, value]) => (
          <li key={key}>
            {key} : {value.t_bloqueo} , {value.t_respuesta}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CTareasRecursos = (props: any) => {
  const [numFilasRecursos, setNumFilasRecursos] = useState(0);
  const [numFilasTareas, setNumFilasTareas] = useState(0);

  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [recursos, setRecursos] = useState<Recurso[]>([]);
  const [resultados, setResultados] = useState<Resultados>();
  const [protocolo, setProtocolo] = useState("herencia");

  function handleCalcular() {
    //espacio para validacion de todos los campos y demas

    //fin de espacio para la validacion de todos los campos y demas
    const resultados = clasificador(tareas, recursos, protocolo);
    setResultados(resultados);
    props.updateTareas(tareas);
    props.updateRecursos(recursos);
    props.updateResultados(resultados);
    props.updateProtocolo(protocolo);
  }
  useEffect(() => {
    console.log("useEffect numeroTareas", numFilasTareas);
    if (numFilasTareas > 0 && tareas.length != numFilasTareas) {
      const newTareas = [...tareas];
      while (newTareas.length < numFilasTareas) {
        newTareas.push(new Tarea("", 0, 0, 0));
      }
      while (newTareas.length > numFilasTareas) {
        newTareas.pop();
      }
      setTareas(newTareas);
    }
  }, [numFilasTareas]);
  useEffect(() => {
    console.log("useEffect numero de recursos", numFilasRecursos);
    if (numFilasRecursos > 0 && recursos.length != numFilasRecursos) {
      const newRecursos = [...recursos];
      while (newRecursos.length < numFilasRecursos) {
        newRecursos.push(new Recurso("", "", 0));
      }
      while (newRecursos.length > numFilasRecursos) {
        newRecursos.pop();
      }
      setRecursos(newRecursos);
    }
  }, [numFilasRecursos]);

  return (
    <div className={styles.question}>
      <h2>Tareas y recursos</h2>
      <label>Numero de tareas</label>
      <input
        type="number"
        placeholder="0"
        onChange={(e) => setNumFilasTareas(parseInt(e.target.value))}
      ></input>
      <label>Numero de recursos</label>
      <input
        type="number"
        placeholder="0"
        onChange={(e) => setNumFilasRecursos(parseInt(e.target.value))}
      ></input>
      {/* un radiobutton para elegir el algoritmo de planificacion */}
      <input
        type="radio"
        value="herencia"
        name="protocolo"
        onClick={() => {
          setProtocolo("herencia");
        }}
        defaultChecked={true}
      />
      Herencia de Prioridad
      <input
        type="radio"
        value="techos"
        name="protocolo"
        onClick={() => {
          setProtocolo("techos");
        }}
        defaultChecked={false}
      />
      Techos de Prioridad
      <button onClick={handleCalcular}>Calcular</button>
      <h4>Tareas</h4>
      <CTablaTareas tareas={tareas} setTareas={setTareas} />
      <h4>Recursos</h4>
      <CTablaRecursos recursos={recursos} setRecursos={setRecursos} />
      {resultados && <CResultados {...resultados} />}
      <button
        onClick={() => {
          props.deleteComponent(props.id);
        }}
      >
        Borrar pregunta
      </button>
    </div>
  );
};

//FUNCIONES

//Funcion auxiliar para ordena las tareas segun un parametro
//A esta funcion le falta definir como se comporta la asignacion de prioidad ante un empate
function ordenarTareas(tareas: Tarea[], parametro: string) {
  let tareasOrdenadas = [...tareas];
  switch (parametro) {
    case "T":
      //Ordenar las tareas por período
      tareasOrdenadas.sort((a, b) => {
        // Parsear los períodos de las tareas a números
        const periodoA = a.periodo;
        const periodoB = b.periodo;

        // Comparar los períodos y devolver el resultado
        if (periodoA < periodoB) {
          return -1;
        } else if (periodoA > periodoB) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "D":
      //Ordenar las tareas por deadline
      tareasOrdenadas.sort((a, b) => {
        // Parsear los períodos de las tareas a números
        const valorA = a.deadline;
        const valorB = b.deadline;

        // Comparar los períodos y devolver el resultado
        if (valorA < valorB) {
          return -1;
        } else if (valorA > valorB) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
    case "C":
      tareasOrdenadas.sort((a, b) => {
        // Parsear los períodos de las tareas a números
        const valorA = a.peorTiempo;
        const valorB = b.peorTiempo;

        // Comparar los períodos y devolver el resultado
        if (valorA < valorB) {
          return -1;
        } else if (valorA > valorB) {
          return 1;
        } else {
          return 0;
        }
      });
      break;
  }
  return tareasOrdenadas;
}

//Funcion auxiliar para asociar las tareas con los recursos
function asociarTablas(tareas: Tarea[], recursos: Recurso[]) {
  let asociaciones: Asociacion = {};
  let copiaRecursos = [...recursos];
  tareas.map((tarea) => {
    asociaciones[tarea.nombre] = [];
    copiaRecursos.map((recurso) => {
      if (recurso.tareaAsignada == tarea.nombre) {
        asociaciones[tarea.nombre].push(recurso.nombre);
      }
    });
  });
  return asociaciones;
}
//Funcion auxiliar para calcular los peores tiempos de cada recurso
function calcularPeoresTiempos(recursos: Recurso[]) {
  let r: IPeoresTiemposRecursos = {};

  recursos.map((recurso) => {
    if (!(recurso.nombre in r)) {
      //si no esta en el diccionario lo añadimos
      r[recurso.nombre] = recurso.tiempo;
    } else {
      if (recurso.tiempo > r[recurso.nombre]) {
        r[recurso.nombre] = recurso.tiempo;
      }
    }
  });
  return r;
}

//Algoritmos de priodidad de tareas --- REVISAR
function HerenciaTiemposBloqueo(
  tareas: Tarea[],
  recursos: Recurso[],
  resultados: Resultados
) {
  //primero damos por supuesto que la forma de organizar las tareas va a ser por el periodo
  let parametroOrden = "T";
  //copiamos las tareas y los recusos de forma local para respetar la mutabilidad
  let copiaTareas = [...tareas];
  let copiaRecursos = [...recursos];

  //comprobamos si tenemos que hacerlo por deadline
  for (let i = 0; i < tareas.length; i++) {
    //se podria hacer mas eficiente con un while y que cortase cuando detecte la condicion
    if (tareas[i].periodo > tareas[i].deadline) {
      parametroOrden = "D";
    }
  }

  //ahora vamos a ordenar las tareas en funcion del parametro de orden
  copiaTareas = ordenarTareas(copiaTareas, parametroOrden).reverse();
  //con ese orden vamos a asociar las tareas a los recursos
  const asociaciones = asociarTablas(copiaTareas, copiaRecursos);
  //llegados a este punto tenemos las tareas ordenadas y asociadas a los recursos por orden
  const peoresTiemposRecursos = calcularPeoresTiempos(copiaRecursos);

  console.log("tareas ordenadas: ", copiaTareas);

  //CALCULO DE  LOS TIEMPOS DE BLOQUEO
  for (let i = 0; i < copiaTareas.length; i++) {
    if (i == 0) {
      //para el elemento menos prioritario
      const datoTiempos = new DatoTiempos(0, -1);
      resultados[copiaTareas[i].nombre] = datoTiempos;
    } else {
      //veo los rercursos utlizados por las tareas con menos prioridad que la actual
      let recursosUtilizadosPorMenosPrioritarias: string[] = [];
      for (let j = i - 1; 0 <= j; j--) {
        if (asociaciones[copiaTareas[j].nombre].length > 0) {
          recursosUtilizadosPorMenosPrioritarias =
            recursosUtilizadosPorMenosPrioritarias.concat(
              asociaciones[copiaTareas[j].nombre]
            );
        }
      }
      recursosUtilizadosPorMenosPrioritarias =
        recursosUtilizadosPorMenosPrioritarias.filter(
          (value, index) =>
            recursosUtilizadosPorMenosPrioritarias.indexOf(value) === index
        );
      //console.log("recursos utilizados por las tareas con menos prioridad que:",copiaTareas[i].nombre, recursosUtilizadosPorMenosPrioritarias);
      //veo los recursos utilizados por las tareas con mayor prioridad que la actual
      let recursosUtilizadosPorMasPrioritarias: string[] = [];
      for (let j = i; j < copiaTareas.length; j++) {
        if (asociaciones[copiaTareas[j].nombre].length > 0) {
          recursosUtilizadosPorMasPrioritarias =
            recursosUtilizadosPorMasPrioritarias.concat(
              asociaciones[copiaTareas[j].nombre]
            );
        }
      }
      recursosUtilizadosPorMasPrioritarias =
        recursosUtilizadosPorMasPrioritarias.filter(
          (value, index) =>
            recursosUtilizadosPorMasPrioritarias.indexOf(value) === index
        );
      //console.log("recursos utilizados por las tareas con mas prioridad que:",copiaTareas[i].nombre, recursosUtilizadosPorMasPrioritarias);
      //hago la interseccion de los ambos conjuntos
      let suma = 0;
      let recursosUtilizadosPorAmbos: string[] =
        recursosUtilizadosPorMenosPrioritarias.filter((value) =>
          recursosUtilizadosPorMasPrioritarias.includes(value)
        );
      for (let recurso of recursosUtilizadosPorAmbos) {
        suma = suma + peoresTiemposRecursos[recurso];
      }
      const datoTiempos = new DatoTiempos(suma, -1);
      resultados[copiaTareas[i].nombre] = datoTiempos;
    }
  }
  console.log("resultado tiempos bloqueo: ", resultados);
  return resultados;
}

function TechosTiemposBloqueo(
  tareas: Tarea[],
  recursos: Recurso[],
  resultados: Resultados
) {
  //INICIO DE PARTE COMUN AL OTRO ALGORITMO
  //primero damos por supuesto que la forma de organizar las tareas va a ser por el periodo
  let parametroOrden = "T";
  //copiamos las tareas y los recusos de forma local para respetar la mutabilidad
  let copiaTareas = [...tareas];
  let copiaRecursos = [...recursos];

  //comprobamos si tenemos que hacerlo por deadline
  for (let i = 0; i < tareas.length; i++) {
    //se podria hacer mas eficiente con un while y que cortase cuando detecte la condicion
    if (tareas[i].periodo > tareas[i].deadline) {
      parametroOrden = "D";
    }
  }

  //ahora vamos a ordenar las tareas en funcion del parametro de orden
  copiaTareas = ordenarTareas(copiaTareas, parametroOrden).reverse();
  //con ese orden vamos a asociar las tareas a los recursos
  const asociaciones = asociarTablas(copiaTareas, copiaRecursos);
  //llegados a este punto tenemos las tareas ordenadas y asociadas a los recursos por orden
  const peoresTiemposRecursos = calcularPeoresTiempos(copiaRecursos);
  //FIN DE PARTE COMUN AL OTRO ALGORITMO

  //CALCULO DE LOS TECHOS DE PRIORIRDAD
  let techosPrioridad: ITechos = {};
  for (let key in peoresTiemposRecursos) {
    //key aqui es el nombre del recurso
    let techo = 0;
    for (let i = 0; i < copiaTareas.length; i++) {
      if (asociaciones[copiaTareas[i].nombre].includes(key) && i + 1 > techo) {
        techo = i + 1;
      } else {
      }
    }
    techosPrioridad[key] = techo;
  }
  // console.log("orden de las tareas: ", copiaTareas);
  // console.log("techos de prioridad: ", techosPrioridad);
  //CALCULO DE  LOS TIEMPOS DE BLOQUEO

  for (let i = 0; i < copiaTareas.length; i++) {
    let bloqueo = 0;
    const prioridad = i + 1;
    // console.log("calculando bloqueo para la tarea: ", copiaTareas[i].nombre);
    if (i == 0) {
      //para los elementos mas y menos prioritarios el tiempo de bloqueo es 0
      // console.log(
      //   "es la tarea menos prioritario por tanto su tiempo de bloqueo es 0"
      // );
      const datoTiempos = new DatoTiempos(0, -1);
      resultados[copiaTareas[i].nombre] = datoTiempos;
    } else {
      //veo los rercursos utlizados por las tareas con menos prioridad que la actual
      let recursosUtilizadosPorMenosPrioritarias: string[] = [];

      for (let j = i - 1; 0 <= j; j--) {
        if (asociaciones[copiaTareas[j].nombre].length > 0) {
          recursosUtilizadosPorMenosPrioritarias =
            recursosUtilizadosPorMenosPrioritarias.concat(
              asociaciones[copiaTareas[j].nombre]
            );
        }
      }
      recursosUtilizadosPorMenosPrioritarias =
        recursosUtilizadosPorMenosPrioritarias.filter(
          (value, index) =>
            recursosUtilizadosPorMenosPrioritarias.indexOf(value) === index
        );
      //veo de esos recursos cuales tienen un techo mayor o igual a la prioridad de la tarea actual
      // console.log("prioridad de la tarea actual: ", prioridad);
      // console.log("recursos a mirar: ", recursosUtilizadosPorMenosPrioritarias);
      for (let recurso of recursosUtilizadosPorMenosPrioritarias) {
        // console.log("recurso: ", recurso, "techo: ", techosPrioridad[recurso]);
        let techo = techosPrioridad[recurso];
        if (techo >= prioridad && techo > bloqueo) {
          const datoTiempos = new DatoTiempos(
            peoresTiemposRecursos[recurso],
            -1
          );
          resultados[copiaTareas[i].nombre] = datoTiempos;
        }
      }
    }
  }
  // console.log("resultados", resultados);
  return resultados;
}

//Funcion para calcular los tiempos de respuesta de las tareas , sin recursos
function TiempoRespuestaHerencia(tareas: Tarea[], resultados: Resultados) {

  //Ordenar las tareas por período
  let tareasOrdenadas = [...tareas];
  tareasOrdenadas = ordenarTareas(tareasOrdenadas, "T");

  // Calcular el tiempo de respuesta

  for (let i = 0; i < tareas.length; i++) {
    const tarea = tareasOrdenadas[i];
    //para la tarea mas prioritaria el timpo de respuesta es el tiempo de la tarea
    if (i == 0) {
      resultados[tarea.nombre].t_respuesta = tarea.peorTiempo;
    } else {
      let w_anterior = tareasOrdenadas[i].peorTiempo; //aqui en este momento es el inicial;;
      let w_actual = w_anterior;
      let guarda = true;
      let contador = 0;
      while (w_anterior != w_actual || (guarda && contador < MAX_ITERACIONES)) {
        guarda = false;
        let sumatorio = 0;

        w_anterior = w_actual;
        for (let j = 0; j < i; j++) {
          sumatorio +=
            Math.ceil(w_anterior / tareasOrdenadas[j].periodo) *
            tareasOrdenadas[j].peorTiempo;
        }
        //console.log("Cuenta realizada : ", tareasOrdenadas[i].peorTiempo , " + ", sumatorio);

        w_actual = tareasOrdenadas[i].peorTiempo + sumatorio; //aqui falta el sumatorio

        // console.log("W= ", w_anterior);
      }
      // console.log("w_actual", w_actual);
      if (w_actual == w_anterior) {
        resultados[tarea.nombre].t_respuesta = w_actual;
      }
    }
  }
  return resultados;
}

//Funcion para calcular tiempos de respuesta con recursos techos
function TiempoRespuestaTechos(tareas: Tarea[], recursos: Recurso[], resultados: Resultados) {
  let parametroOrden = "T";
  //copiamos las tareas y los recusos de forma local para respetar la mutabilidad
  let copiaTareas = [...tareas];
  let copiaRecursos = [...recursos];

  //comprobamos si tenemos que hacerlo por deadline
  for (let i = 0; i < tareas.length; i++) {
    //se podria hacer mas eficiente con un while y que cortase cuando detecte la condicion
    if (tareas[i].periodo > tareas[i].deadline) {
      parametroOrden = "D";
    }
  }
  //ordeanamos las tareas de MAS a MENOS prioritarias
  const tareasOrdenadas = ordenarTareas(copiaTareas, parametroOrden);

  for(let i = 0; i < tareasOrdenadas.length; i++){
    const ci = tareasOrdenadas[i].peorTiempo;
    const bi = resultados[tareasOrdenadas[i].nombre].t_bloqueo;
    let iteraciones = 0;
    let w_anterior = ci + bi;
    let w_actual = -1;
    
    while(iteraciones<MAX_ITERACIONES && w_anterior != w_actual){
      // console.log("Tarea actual: ", tareasOrdenadas[i].nombre, "w_anterior: ", w_anterior, "w_actual: ", w_actual, "iteraciones: ", iteraciones)
      //calculamos el sumatorio
      if(w_actual != -1){
        w_anterior = w_actual;
      }
      let sumatorio = 0;
      for(let j = i - 1 ; j>=0; j--){
        sumatorio += Math.ceil(w_anterior/tareasOrdenadas[j].periodo) * tareasOrdenadas[j].peorTiempo;
      }
      //Aplicamos la formulita
      w_actual = ci + bi + sumatorio;
      // console.log("w_actual: ", w_actual);
      iteraciones++;
      
    }
    //Comporbamos si hace falta seguir
    if(w_actual == w_anterior){
      resultados[tareasOrdenadas[i].nombre].t_respuesta = w_actual;
    }

  }

  // console.log("----CALCULANDO TIEMPOS DE RESPUESTA CON TECHOS----");
  // console.log("Reusltados de los tiempos de respuesta: ", resultados);
  return resultados;
}

//TODO : Funcion para calcular los tiempos de respuesta con recursos herencia
function TiempoRespuestaHerenciaRecursos(tareas: Tarea[], recursos: Recurso[], resultados: Resultados) {
  //TODO
}

//clasificador , esto lo que hace es ver cuales de los siguientes tipos de problemas tenemos
//1. Protocolo de herencia sin recursos
//2. Protocolo de herencia con recursos
//3. Protocolo de techos sin recursos
//4. Protocolo de techos con recursos
function clasificador(tareas: Tarea[], recursos: Recurso[], protocolo: string) {
  let resultados: Resultados = {};
  if (tareas.length == 0) {
    alert("NO HAY TAREAS ");
    return resultados;
  }
  if (recursos.length == 0) {
    switch (protocolo) {
      case "herencia":
        resultados = TiempoRespuestaHerencia(tareas, resultados);
        break;
      case "techos":
        alert("no se puede calcular el tiempo de respuesta con techos sin recursos");
        break;
      default:
        alert("no se ha seleccionado ningun protocolo o este no existe");
        break;
    }
    return resultados;
  }
  if (recursos.length > 0 && tareas.length > 0) {
    switch (protocolo) {
      case "herencia":
        resultados = HerenciaTiemposBloqueo(tareas, recursos, resultados);
        //TODO : Añadir la funcion de tiempos de respuesta con herencia
        break;
      case "techos":
        resultados = TechosTiemposBloqueo(tareas, recursos, resultados);
        resultados = TiempoRespuestaTechos(tareas, recursos , resultados);
        break;
      default:
        alert("no se ha seleccionado ningun protocolo o este no existe");
        break;
    }
  }
  return resultados;
}
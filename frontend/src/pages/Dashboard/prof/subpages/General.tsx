export const General = (props : any) => {
    return (
      <div>
        <h1>Estadisticas de la asignatura</h1>
        <div>
          <h3>Numero de alumnos inscritos : {props.menuState.students.length}</h3>
          <h3>Numero de examenes </h3>
          <h3>Graficas de nota media segun el examen (diagrama de barras) </h3>
        </div>
      </div>
    );
  };
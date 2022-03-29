import React, { Component } from "react";
import ActionMenu from "./componentes/ActionsMenu";
import Tabla from "./componentes/Tabla";
import Modal from "./componentes/Modal";
import { listarEntidad, crearEditarEntidad, eliminarEntidad } from "./servicio";
import ComponenteCampo from "./componentes/ComponenteCampo";

class Pagina extends Component {
  constructor(props) {
    super(props); //llama a todos los métodos del componente
    this.state = {
      mostarModal: false,
      entidades: [],
      objeto: {},
      idObjeto: null,
      method: "POST",
      columnas: [],
    };
  }

  cambiarModal = (_evento, method = "POST") => {
    this.setState({ mostarModal: !this.state.mostarModal, method });
  };

  listar = async () => {
    const { entidad } = this.props;
    const entidades = await listarEntidad({ entidad });
    let columnas = [];
    if (Array.isArray(entidades) && entidades.length > 0) {
      columnas = Object.keys(entidades[0]) || [];
    }
    this.setState({ entidades, columnas });
  };

  manejarInput = (evento) => {
    const {
      target: { value, name },
    } = evento;
    let { objeto } = this.state;
    objeto = { ...objeto, [name]: value };
    this.setState({ objeto });
  }; //... copia de objeto del constructor

  crearEntidad = async (_evento = null) => {
    const { entidad } = this.props;
    let { objeto, method, idObjeto } = this.state;
    await crearEditarEntidad({ entidad, objeto, method, idObjeto });
    this.cambiarModal();
    this.listar();
  };

  editarEntidad = (_evento, index) => {
    const objeto = { ...this.state.entidades[index] };
    this.setState({ objeto, idObjeto: index }, () => {
      this.cambiarModal(null, "PUT");
    });
  };

  eliminarEntidad = async (_evento, index) => {
    const { entidad } = this.props;
    const respuesta = await eliminarEntidad({ entidad, idObjeto: index });
    console.log({ respuesta });
    this.listar();
  };

  componentDidMount() {
    this.listar();
  }

  // código del componente

  // render siempre debe ir el último
  //render = interpreta el código para mostrar
  render() {
    const { titulo = "Página sin título", entidad } = this.props;
    const { columnas, idObjeto } = this.state;
    return (
      <>
        <div className="container">
          <ActionMenu cambiarModal={this.cambiarModal} titulo={titulo} />
          <Tabla
            entidades={this.state.entidades}
            editarEntidad={this.editarEntidad}
            eliminarEntidad={this.eliminarEntidad}
            columnas={this.columnas}
          />
          {this.state.mostarModal && (
            <Modal
              cambiarModal={this.cambiarModal}
              manejarInput={this.manejarInput}
              crearEntidad={this.crearEntidad}
              //objeto={this.state.objeto}
              entidad={entidad}
              idObjeto={idObjeto}
            >
              {columnas.map((columna, index) => (
                <ComponenteCampo
                  key={index}
                  nombreCampo={columna}
                  manejarInput={this.manejarInput}
                  objeto={this.state.objeto}
                />
              ))}
            </Modal>
          )}
        </div>
      </>
    );
  }
}

export default Pagina;

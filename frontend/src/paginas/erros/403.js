import React from 'react';

const AccessDeniedPage = () => {
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-2 text-center">
          <p>
            <i className="fa fa-exclamation-triangle fa-5x"></i>
            <br />
            <strong>Código: 403</strong>
          </p>
        </div>
        <div className="col-md-10">
          <h3 className="display-5 fw-bold">Acesso Negado</h3>
          <p className="fw-light fs-4">
            Desculpe, mas você não possui permissão para acessar esta página.
            <br />
            Se você acredita que isso é um engano, entre em contato conosco por e-mail <code>email@exemplo.com</code>
          </p>
          <a className="btn btn-danger" href="/">Ir para a página inicial</a>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;

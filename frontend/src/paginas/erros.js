import {Link} from 'react-router-dom';
const UnauthorizedPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>Erro 401: Acesso não autorizado</h1>
            <p>Você não possui permissão para acessar esta página.</p>
            <p>Por favor, faça o login para acessar este recurso.</p>
            <Link to="/" style={{ textDecoration: 'none', marginTop: '20px' }}>
                <button style={{ padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none' }}>Login</button>
            </Link>
        </div>
    );
};

const NotFoundPage = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '100px' }}>
            <h1>Erro 404: Página não encontrada</h1>
            <p>A página que você está procurando não existe.</p>
            <p>Volte para a <Link to="/" style={{ textDecoration: 'underline' }}>página inicial</Link>.</p>
        </div>
    );
};

export {UnauthorizedPage, NotFoundPage};
export default function DashboardPage() {
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Proveedores GSV</h1>
      </header>

      <section className="welcome-section">
        <div className="welcome-content">
          <div className="welcome-text">
            <h2>¡Bienvenidos!</h2>
            <p>
              Este sistema te permite gestionar eficientemente tus proveedores, registrar suministros
              y mantener el control total de los recursos tecnológicos. Simplificamos tus tareas
              administrativas para que puedas enfocarte en crecer tu negocio.
            </p>
          </div>
          <div className="welcome-image">
            <img src="/images/tech-welcome.png" alt="Ilustración tecnológica" />
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <h3>Accesos rápidos</h3>
        <div className="card-grid">
          <div className="card" onClick={() => window.location.href = '/proveedores'}>
            <h4>Proveedores</h4>
            <p>Gestiona y edita tus proveedores registrados.</p>
          </div>
          <div className="card" onClick={() => window.location.href = '/suministros'}>
            <h4>Suministros</h4>
            <p>Registra y visualiza los suministros recientes.</p>
          </div>
          <div className="card" onClick={() => window.location.href = '/piezas'}>
            <h4>Piezas</h4>
            <p>Registra y visualiza las piezas recientes.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

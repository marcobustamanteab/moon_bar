import { MetricCard, SimpleCard } from "../../components/common/DivCard";
// import { useAuth } from "../../context/AuthContext";
import { DollarSign, Utensils, ClipboardList, UserCircle } from "lucide-react";

export const Home = () => {
  const date = new Date().toLocaleDateString();

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">
        Métricas
      </h1>

      {/* Primera fila: MetricCards */}
      <div className="row g-4 mb-4">
        {/* Ventas Totales */}
        <div className="col-md-3">
          <MetricCard
            title="Ventas Totales"
            value="$125,430"
            variant="primary"
            change={{ value: 12.5, type: "increase" }}
            icon={<DollarSign size={24} color="#3e9392" />}
          />
        </div>

        {/* Total Mesas */}
        <div className="col-md-3">
          <MetricCard
            title="Total Mesas"
            value="24"
            variant="success"
            change={{ value: 4.2, type: "increase" }}
            icon={<Utensils size={24} />}
          />
        </div>

        {/* Total Órdenes */}
        <div className="col-md-3">
          <MetricCard
            title="Total Órdenes"
            value="156"
            variant="warning"
            change={{ value: 8.3, type: "increase" }}
            icon={<ClipboardList size={24} />}
          />
        </div>

        {/* Garzones */}
        <div className="col-md-3">
          <MetricCard
            title="Garzones Activos"
            value="8"
            variant="danger"
            change={{ value: 2, type: "increase" }}
            icon={<UserCircle size={24} />}
          />
        </div>
      </div>

      {/* Segunda fila: SimpleCards */}
      <div className="row g-4">
        <div className="col-md-6">
          <SimpleCard
            title="Estadísticas Generales"
            subtitle={date}
            footer={
              <div className="d-flex justify-content-between">
                <span>Última actualización: Hoy</span>
                <button className="btn btn-primary btn-sm">Ver más</button>
              </div>
            }
          >
            <div className="p-3">
              <h4 className="mb-3">Resumen del Día</h4>
              <p>Aquí van las estadísticas generales...</p>
            </div>
          </SimpleCard>
        </div>

        <div className="col-md-6">
          <SimpleCard
            title="Actividad Reciente"
            subtitle="Últimas 24 horas"
            footer={
              <div className="d-flex justify-content-between">
                <span>5 actividades nuevas</span>
                <button className="btn btn-primary btn-sm">Ver todas</button>
              </div>
            }
          >
            <div className="p-3">
              <h4 className="mb-3">Actividades</h4>
              <p>Lista de actividades recientes...</p>
            </div>
          </SimpleCard>
        </div>
      </div>
    </div>
  );
};

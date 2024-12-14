import React, { useState, useEffect } from 'react';
import { Activity, User, Clock, Calendar, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { SimpleCard } from '../common/DivCard';
import { UserAPI } from '../../api/endpoints/users';
import { useLoading } from '../../context/LoadingContext';

interface ActivityLog {
 id: number;
 username: string;
 activity_type: ActivityType;
 timestamp: string;
 details: string;
 ip_address: string;
}

type ActivityType = 'login' | 'logout' | 'password_change' | 'password_change_failed' | 
                   'profile_update' | 'failed_login' | 'user_created' | 'token_validation' | 
                   'token_validation_failed';

const UserActivityLog: React.FC = () => {
 const [logs, setLogs] = useState<ActivityLog[]>([]);
 const [error, setError] = useState<string>('');
 const { setLoading } = useLoading();
 const [filterDays, setFilterDays] = useState<number>(7);
 const [filterType, setFilterType] = useState<string>('');
 const [filterUsername, setFilterUsername] = useState<string>('');
 const [currentPage, setCurrentPage] = useState(1);
 const [itemsPerPage] = useState(5);

 const fetchLogs = async () => {
   try {
     setLoading(true);
     const data = await UserAPI.getActivityLogs({
       days: filterDays,
       activity_type: filterType,
       username: filterUsername
     });
     setLogs(data);
     setCurrentPage(1); 
     setError('');
   } catch (error) {
     setError('Error al cargar los registros de actividad');
     console.error('Error fetching logs:', error);
   } finally {
     setLoading(false);
   }
 };

 useEffect(() => {
   fetchLogs();
 }, [filterDays, filterType, filterUsername]);

 const getActivityIcon = (type: ActivityType) => {
   const iconClasses = {
     login: 'bg-soft-primary text-primary',
     logout: 'bg-soft-secondary text-secondary',
     password_change: 'bg-soft-warning text-warning',
     password_change_failed: 'bg-soft-danger text-danger',
     failed_login: 'bg-soft-danger text-danger',
     profile_update: 'bg-soft-info text-info',
     user_created: 'bg-soft-success text-success',
     token_validation: 'bg-soft-primary text-primary',
     token_validation_failed: 'bg-soft-danger text-danger'
   };

   return (
     <div className={`p-2 rounded-circle ${iconClasses[type] || 'bg-soft-secondary text-secondary'}`}>
       <Activity size={16} />
     </div>
   );
 };

 const formatDate = (dateString: string) => {
   const date = new Date(dateString);
   return date.toLocaleDateString('es-ES', {
     year: 'numeric',
     month: 'long',
     day: 'numeric',
     hour: '2-digit',
     minute: '2-digit'
   });
 };

 const handleFilter = () => {
   fetchLogs();
 };

 const indexOfLastLog = currentPage * itemsPerPage;
 const indexOfFirstLog = indexOfLastLog - itemsPerPage;
 const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);
 const totalPages = Math.ceil(logs.length / itemsPerPage);

 const paginate = (pageNumber: number) => {
   setCurrentPage(pageNumber);
   window.scrollTo({ top: 0, behavior: 'smooth' });
 };

 const getPageNumbers = () => {
   const pageNumbers = [];
   const maxVisiblePages = 5;
   let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
   const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

   if (endPage - startPage + 1 < maxVisiblePages) {
     startPage = Math.max(1, endPage - maxVisiblePages + 1);
   }

   for (let i = startPage; i <= endPage; i++) {
     pageNumbers.push(i);
   }

   return pageNumbers;
 };

 return (
   <div className="p-3">
     <div className="mb-4">
       <h5 className="mb-1">Registro de Actividad</h5>
       <p className="text-muted small">Monitoreo de actividades de usuarios en el sistema</p>
     </div>

     {error && (
       <div className="alert alert-danger" role="alert">
         {error}
       </div>
     )}

     <SimpleCard
       className="mb-4"
       withHeader
       title="Filtros"
     >
       <div className="row g-3">
         <div className="col-md-3">
           <label className="form-label">Período</label>
           <select 
             className="form-select" 
             value={filterDays}
             onChange={(e) => setFilterDays(Number(e.target.value))}
           >
             <option value={1}>Último día</option>
             <option value={7}>Última semana</option>
             <option value={30}>Último mes</option>
             <option value={90}>Últimos 3 meses</option>
           </select>
         </div>
         
         <div className="col-md-3">
           <label className="form-label">Tipo de Actividad</label>
           <select 
             className="form-select"
             value={filterType}
             onChange={(e) => setFilterType(e.target.value)}
           >
             <option value="">Todos</option>
             <option value="login">Inicio de sesión</option>
             <option value="logout">Cierre de sesión</option>
             <option value="password_change">Cambio de contraseña</option>
             <option value="failed_login">Intentos fallidos</option>
           </select>
         </div>
         
         <div className="col-md-3">
           <label className="form-label">Usuario</label>
           <input
             type="text"
             className="form-control"
             placeholder="Nombre de usuario"
             value={filterUsername}
             onChange={(e) => setFilterUsername(e.target.value)}
           />
         </div>
         
         <div className="col-md-3 d-flex align-items-end">
           <button 
             className="btn btn-primary w-100"
             onClick={handleFilter}
           >
             <Filter size={16} className="me-2" />
             Filtrar
           </button>
         </div>
       </div>
     </SimpleCard>

     <SimpleCard>
       <div className="d-flex flex-column">
         {logs.length > 0 ? (
           <>
             <div className="d-flex flex-column gap-4 mb-4">
               {currentLogs.map((log) => (
                 <div key={log.id} className="d-flex align-items-start gap-3 p-3 border rounded bg-white">
                   {getActivityIcon(log.activity_type)}
                   
                   <div className="flex-grow-1">
                     <div className="d-flex align-items-center gap-2 mb-1">
                       <User size={16} className="text-muted" />
                       <span className="fw-medium">{log.username}</span>
                       <span className="text-muted">•</span>
                       <span className="text-muted">{log.ip_address}</span>
                     </div>
                     
                     <p className="mb-2">{log.details}</p>
                     
                     <div className="d-flex align-items-center gap-3 text-muted small">
                       <div className="d-flex align-items-center gap-1">
                         <Calendar size={14} />
                         <span>{formatDate(log.timestamp)}</span>
                       </div>
                       <div className="d-flex align-items-center gap-1">
                         <Clock size={14} />
                         <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                       </div>
                     </div>
                   </div>
                 </div>
               ))}
             </div>

             <div className="d-flex justify-content-between align-items-center border-top pt-3">
               <div className="text-muted small">
                 Mostrando {indexOfFirstLog + 1} a {Math.min(indexOfLastLog, logs.length)} de {logs.length} registros
               </div>
               
               <nav aria-label="Navegación de páginas">
                 <ul className="pagination mb-0">
                   <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                     <button
                       className="page-link"
                       onClick={() => paginate(currentPage - 1)}
                       disabled={currentPage === 1}
                     >
                       <ChevronLeft size={16} />
                     </button>
                   </li>

                   {getPageNumbers().map(number => (
                     <li 
                       key={number} 
                       className={`page-item ${currentPage === number ? 'active' : ''}`}
                     >
                       <button
                         className="page-link"
                         onClick={() => paginate(number)}
                       >
                         {number}
                       </button>
                     </li>
                   ))}

                   <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                     <button
                       className="page-link"
                       onClick={() => paginate(currentPage + 1)}
                       disabled={currentPage === totalPages}
                     >
                       <ChevronRight size={16} />
                     </button>
                   </li>
                 </ul>
               </nav>
             </div>
           </>
         ) : (
           <div className="text-center py-4 text-muted">
             No se encontraron registros de actividad
           </div>
         )}
       </div>
     </SimpleCard>
   </div>
 );
};

export default UserActivityLog;